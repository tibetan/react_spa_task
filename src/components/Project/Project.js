import React, {Component} from 'react';
import classNames from 'classnames';
import './Project.css';
import Converter from './TabsContent/Converter';
import CurrencyRates from './TabsContent/CurrencyRates';
import History from './TabsContent/History';

const CURRENCY_RATES_TAB = 'currency-rates';
const CONVERTER_TAB = 'converter';
const HISTORY_TAB = 'history';

class Project extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTabName: CURRENCY_RATES_TAB
        };

        this.btnExitHandler = this.btnExitHandler.bind(this);
    }

    btnExitHandler(e) {
        this.setLogoutStatus();
        this.props.updateData(this.state.loginState);
        e.preventDefault();
    }

    setLogoutStatus() {
        this.setState({loginState: false});
    }

    tabClickHandler(tabName) {
        this.setState({activeTabName: tabName})
    }

    render() {
        let tabContent;
        if (this.state.activeTabName === CONVERTER_TAB) {
            tabContent = <Converter/>;
        } else if (this.state.activeTabName === HISTORY_TAB) {
            tabContent = <History />;
        } else {
            tabContent = <CurrencyRates />;
        }

        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-6 ">
                        <div className="header-first">TEST SPA app</div>
                    </div>
                    <form className="col-md-6 text-right" onSubmit={this.btnExitHandler}>
                        <button type="submit" className="header-first text-center btn-exit">Выход</button>
                    </form>
                </div>
                <div className="row justify-content-center padding-top-8-pr">
                    <div className="col-md-8">
                        <nav>
                            <div className="nav nav-tabs nav-project-tabs">
                                <span className={classNames("nav-item nav-link text-center", (this.state.activeTabName === CURRENCY_RATES_TAB) ? 'active' : '')}
                                      data-toggle="tab" role="tab"
                                      onClick={() => this.tabClickHandler(CURRENCY_RATES_TAB)}>Курсы валют</span>

                                <span className={classNames("nav-item nav-link text-center", (this.state.activeTabName === CONVERTER_TAB) ? 'active' : '')}
                                      data-toggle="tab" role="tab"
                                      onClick={() => this.tabClickHandler(CONVERTER_TAB)}>Конвертор</span>

                                <span className={classNames("nav-item nav-link text-center", (this.state.activeTabName === HISTORY_TAB) ? 'active' : '')}
                                      data-toggle="tab" role="tab"
                                      onClick={() => this.tabClickHandler(HISTORY_TAB)}>История</span>
                            </div>
                        </nav>
                        <div className="tab-content" id="nav-tab-content">
                            {tabContent}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Project;
