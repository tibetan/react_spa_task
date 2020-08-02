import React, {Component} from 'react';
import './Converter.css';

class Converter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sumValue: '',
            currency1Value: '',
            currency2Value: '',
            totalValue: undefined,
            rates: [],
            currency2Unique: []
        };

        this.getQuotes();
        this.numbersOnlySumChangeHandler = this.numbersOnlySumChangeHandler.bind(this);
        this.currency1ValueChangeHandler = this.currency1ValueChangeHandler.bind(this);
        this.currency2ValueChangeHandler = this.currency2ValueChangeHandler.bind(this);
        this.calculateFormSubmitHandler = this.calculateFormSubmitHandler.bind(this);
        this.createCurrenciesForSelects = this.createCurrenciesForSelects.bind(this);
    }

    getQuotes(e) {
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
                        debugger;
                    }
                }
            })
            .catch(error => {
                console.log(error);
                alert('Произошла ошибка в попытке соединиться по АПИ');
                debugger;
            });
    }

    arrayUnique(arr) {
        return arr.filter((e, i, a)=>a.indexOf(e) === i)
    }

    createCurrenciesForSelects() {
        let length = this.state.rates.length;
        let currencies = [];
        let currency1 = [];
        let currency2 = [];

        for (let k = 0; k < length; k++) {
            currencies = this.state.rates[k].asset.split('/', 2);
            currency1[k] = currencies[0];
            currency2[k] = currencies[1];
        }

        const currency1Unique = this.arrayUnique(currency1);
        const currency2Unique = this.arrayUnique(currency2);

        return {
            currencies1: this.createOptionsForSelect(currency1Unique, 1),
            currencies2: this.createOptionsForSelect(currency2Unique, 2),
        };
    }

    createOptionsForSelect(arr, selectElementNumber) {
        const result = [];
        const length = arr.length;
        for (let k = 0; k < length; k++) {
            if (selectElementNumber === 2 && arr[k] === this.state.currency1Value) {
                result.push(
                    <option key={k} value={arr[k]} disabled>{arr[k]}</option>
                );
            } else {
                result.push(
                    <option key={k} value={arr[k]}>{arr[k]}</option>
                );
            }
        }

        return result;
    }

    numbersOnlySumChangeHandler(e) {
        const regexp = /^[0-9\b]+$/;

        if (e.target.value === '' || regexp.test(e.target.value)) {
            this.setState({sumValue: e.target.value})
        }
    }

    currency1ValueChangeHandler(e) {
        this.setState({currency1Value: e.target.value});
    }

    currency2ValueChangeHandler(e) {
        this.setState({currency2Value: e.target.value});
    }

    calculateFormSubmitHandler (e) {
        const length = this.state.rates.length;
        const toSearch = this.state.currency1Value + '/' + this.state.currency2Value;
        for(let i = 0; i < length; i++) {
            if (this.state.rates[i].asset === toSearch) {
                const sumValue = (this.state.rates[i].quote * this.state.sumValue).toFixed(2);
                this.setState({totalValue: sumValue});
                break;
            } else {
                this.setState({totalValue: undefined});
            }
        }
        
        e.preventDefault();
    }

    render() {
        const optionsSelect = this.createCurrenciesForSelects();

        return (
            <div className="tab-pane fade show active" id="nav-converter" role="tabpanel">
                <div className="container container-converter">
                    <div className="row row-converter header text-center">
                        <div className="col-12">Конвертация валют</div>
                    </div>
                    <div className="row row-converter">
                        <div className="col-12">
                            <div className="converter-area">
                                <div className="row">
                                    <div className="col-12 secondary-text">Сумма</div>
                                    <div className="col-12">
                                        <form onSubmit={this.calculateFormSubmitHandler}>
                                            <div className="row">
                                                <div className="col-lg-3">
                                                    <input type="text" className="form-control"
                                                           value={this.state.sumValue} onChange={this.numbersOnlySumChangeHandler} />
                                                </div>
                                                <div className="col-lg-4">
                                                    <div className="row">
                                                        <div className="col-lg-6 div-select-converter">
                                                            <select className="form-control" id="currencySelect1"
                                                                    value={this.state.currency1Value}
                                                                    onChange={this.currency1ValueChangeHandler}
                                                            >
                                                                <option/>
                                                                {optionsSelect.currencies1}
                                                            </select>
                                                        </div>
                                                        <div className="col-lg-6 div-select-converter">
                                                            <select className="form-control" id="currencySelect2"
                                                                    value={this.state.currency2Value}
                                                                    onChange={this.currency2ValueChangeHandler}
                                                            >
                                                                <option/>
                                                                {optionsSelect.currencies2}
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-lg-5">
                                                    <button type="submit" className="btn btn-block calc-btn">
                                                        Рассчитать
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            <div className="result-area">
                                <div className="row">
                                    <div className="col-12 secondary-text">{this.state.totalValue ? 'Итого:' : ''}</div>
                                    <div className="col-12 converter-result">{this.state.totalValue}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Converter;
