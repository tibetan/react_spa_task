import React, {Component} from 'react';
import { ArrowLeft, ArrowRight} from 'react-bootstrap-icons';
import './History.css';


const ARROW_LEFT = 'left';
const ARROW_RIGHT = 'right';
const SORT_DIRECTION_DESC = 'descending';
const SORT_DIRECTION_ASC = 'ascending';

class History extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dealsTotal: [],
            dealsPage: {
                1: [],
                2: [],
            },
            currentPageNumber: 1,
            rules: {profitMore100: 0, negativeProfit: 2, identicalActives: 2},
            dealsCountByRules: {profitMore100: 0, negativeProfit: 0, identicalActives: 0},
        };

        this.getDeals();
        this.convertDate = this.convertDate.bind(this);
        this.createSortedFilteredDealsOnePage = this.createSortedFilteredDealsOnePage.bind(this);
        this.generateFooter = this.generateFooter.bind(this);
    }

    getDeals() {
        fetch('http://130.211.109.15/api.php', {
            method: 'POST',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                action: "history"
            })
        })
            .then(response => {
                return response.json();
            })
            .then(json => {
                if (json.type !== 0) {
                    if (json.result === 'ok') {
                        let deals = json.deals;

                        this.sortByKey(deals, 'finishDate', SORT_DIRECTION_ASC);
                        this.setState({
                            dealsTotal: deals
                        });
                    } else {
                        console.log(json);
                    }
                }
            })
            .catch(error => {
                console.log(error);
                alert('Произошла ошибка в попытке соединиться по АПИ');
                debugger;
            });
    }

    createSortedFilteredDealsOnePage(dealsTotal, dealsPage) {
        if (dealsPage.length < 10) {
            let currentDeal = {};
            let dealsPageCount = dealsPage.length;
            let dealsCountByRuleNegativeProfit = this.state.dealsCountByRules.negativeProfit;
            let dealsCountByRuleProfitMore100 = this.state.dealsCountByRules.profitMore100;

            while (dealsPageCount < 10) {
                currentDeal = dealsTotal.pop();

                if (this.checkIfExistsProfitMoreThan100(dealsCountByRuleProfitMore100, currentDeal)) {
                    continue
                }

                if (this.checkIfNegativeProfitsMoreThanTwo(dealsCountByRuleNegativeProfit, currentDeal)) {
                    continue;
                }

                if (this.checkIfIdenticalActivesMoreThanTwo(dealsPage, currentDeal)) {
                    continue;
                }

                if (currentDeal.profit > 100) {
                    dealsCountByRuleProfitMore100++;
                } else if (currentDeal.profit < 0
                    && dealsCountByRuleNegativeProfit < this.state.rules.negativeProfit
                ) {
                    dealsCountByRuleNegativeProfit++;
                }

                dealsPageCount = dealsPage.push(currentDeal);
            }

            this.sortByKey(dealsPage, 'finishDate', SORT_DIRECTION_DESC);
        }

        return {dealsTotal: dealsTotal, dealsPage: dealsPage};
    }

    sortByKey(deals, key, sortDirection) {
        deals.sort(function(a, b){
            let dateA = new Date(a[key]), dateB = new Date(b[key]);

            switch(sortDirection) {
                case SORT_DIRECTION_DESC:
                    return dateB - dateA;
                case SORT_DIRECTION_ASC:
                    return dateA - dateB;
                default:
                    return dateA - dateB;
            }
        });
    }

    checkIfExistsProfitMoreThan100(countOfProfitsMoreThan100, deal) {
        return countOfProfitsMoreThan100 === this.state.rules.profitMore100 && deal.profit < 100;
    }

    checkIfNegativeProfitsMoreThanTwo(countOfNegativeProfits, deal) {
        return countOfNegativeProfits >= this.state.rules.negativeProfit && deal.profit < 0;
    }

    checkIfIdenticalActivesMoreThanTwo(deals, deal) {
        let count = 0;
        deals.forEach(function(d) {
            if (d.asset === deal.asset) {
                count++;
            }
        });

        return count >= this.state.identicalActives;
    }

    convertDate(strDate) {
        const date = new Date(strDate);
        return date.getHours() + ':' + date.getMinutes() + ' '
            + date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear();
    }

    arrowClickHandler(arrowName) {
        switch(arrowName) {
            case ARROW_LEFT:
                this.setState({
                    currentPageNumber: 1
                });
                break;
            case ARROW_RIGHT:
                this.setState({
                    currentPageNumber: 2
                });
                break;
            default:
                break;
        }
    }

    generateHistoryList(deals) {
        const result = [];
        const length = deals.length;

        for (let k = 0; k < length; k++) {
            result.push(
                <div className="row row-line" key={k}>
                    <span className="col-2">{deals[k].asset}</span>
                    <span className="col-2">{this.convertDate(deals[k].startDate)}</span>
                    <span className="col-2">{deals[k].startQuote}</span>
                    <span className="col-2">{this.convertDate(deals[k].finishDate)}</span>
                    <span className="col-2">{deals[k].finishQuote}</span>
                    <span className="col-2">{deals[k].profit}</span>
                </div>
            );
        }

        return result;
    }

    generateFooter() {
        const result = [];
        switch(this.state.currentPageNumber) {
            case 1:
                result.push(
                    <div className="col-12" key="0">
                            <span className="arrow">
                                <ArrowLeft/>
                            </span>
                        {this.state.currentPageNumber + ' / 2'}
                        <span className="arrow active"
                              onClick={() => this.arrowClickHandler(ARROW_RIGHT)}
                        >
                                <ArrowRight/>
                            </span>
                    </div>
                );
                break;
            case 2:
                result.push(
                    <div className="col-12" key="0">
                            <span className="arrow active"
                                  onClick={() => this.arrowClickHandler(ARROW_LEFT)}
                            >
                                <ArrowLeft/>
                            </span>
                        {this.state.currentPageNumber + ' / 2'}
                        <span className="arrow">
                                <ArrowRight/>
                            </span>
                    </div>
                );
                break;
            default:
                break;
        }

        return result;
    }

    render() {
        const length = this.state.dealsTotal.length;

        if (length > 0) { //TODO Без этой проверки Реакт вызывает ошибку, что данные пустые. Надо будет разобраться в причине
            const result = this.createSortedFilteredDealsOnePage(this.state.dealsTotal, this.state.dealsPage[this.state.currentPageNumber]);
            const historyList = this.generateHistoryList(result.dealsPage);
            const footer = this.generateFooter();

            return (
                <div className="tab-pane fade show active" id="nav-history" role="tabpanel">
                    <div className="container container-history text-center">
                        <div className="row row-history header">
                        <span className="col-2">
                            Актив
                        </span>
                            <span className="col-2">
                            Начало
                        </span>
                            <span className="col-2">
                            Котировка
                        </span>
                            <span className="col-2">
                            Конец
                        </span>
                            <span className="col-2">
                            Котировка
                        </span>
                            <span className="col-2">
                            Прибыль
                        </span>
                        </div>
                        <div className="row row-history">
                            <div className="col-12">
                                {historyList}
                            </div>
                        </div>
                        <div className="row row-history footer">
                            {footer}
                        </div>
                    </div>
                </div>
            );
        } else {
            return (<div/>);
        }
    }
}

export default History;
