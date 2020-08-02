import React, {Component} from 'react';
import { StarFill, Star} from 'react-bootstrap-icons';
import './CurrencyRates.css';

class CurrencyRates extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rates: []
        };

        this.getQuotes();
    }

    getQuotes() {
        fetch('http://130.211.109.15/api.php', {
            method: 'POST',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                action: "quote"
            })
        })
            .then(response => {
                return response.json();
            })
            .then(json => {
                if (json.type !== 0) {
                    if (json.result === 'ok') {
                        this.setState({rates: json.assets});
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

    rowRatesClickHandler(key) {
        this.moveToTopOfList(key);
    }

    moveToTopOfList(key) {
        let rates = this.state.rates;

        if (rates[key].starfill !== true) {
            rates[key].starfill = true;
            rates.unshift(...rates.splice(key,1));
            this.setState({rates: rates});
        }
    }

    render() {
        const length = this.state.rates.length;
        const items = [];
        for (let k = 0; k < length; k++) {
            items.push(
                <div className="row row-rate" key={k}>
                    <span className="col-1 star" onClick={() => this.rowRatesClickHandler(k)}>
                        {this.state.rates[k].starfill === true ? <StarFill /> : <Star />}
                    </span>
                    <span className="col-5">{this.state.rates[k].asset}</span>
                    <span className="col-2">{this.state.rates[k].quote}</span>
                    <span className="col-4">
                        {(function (strDate) {
                            const date = new Date(strDate);
                            return date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear();
                        }(this.state.rates[k].startDate))}
                    </span>
                </div>
            );
        }

        return (
            <div className="tab-pane fade show active" id="nav-currency-rates" role="tabpanel">
                <div className="container container-row-currency text-center">
                    <div className="row row-currency-rates header">
                        <span className="col-1" />
                        <span className="col-5">
                            Валютная пара
                        </span>
                        <span className="col-2">
                            Котировка
                        </span>
                        <span className="col-4">
                            Дата получения
                        </span>
                    </div>
                    <div className="row row-currency-rates">
                        <div className="col-12">
                            {items}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default CurrencyRates;
