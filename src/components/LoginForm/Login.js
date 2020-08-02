import React, { Component } from 'react';
import classNames from 'classnames';
import './Login.css';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loginState: false,
            loginValue: '',
            passwordValue: '',
            errorMsg: ''
        };

        this.handleChangeLogin = this.handleChangeLogin.bind(this);
        this.handleChangePass = this.handleChangePass.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChangeLogin(e) {
        this.validateFields('login', e.target.value);
        this.setState({
            loginValue: e.target.value
        });
    }

    handleChangePass(e) {
        this.validateFields('password', e.target.value);
        this.setState({
            passwordValue: e.target.value
        });
    }

    setLoginStatus() {
        this.setState({loginState: true});
    }

    handleSubmit(e) {
        fetch('http://130.211.109.15/api.php', {
            method: 'POST',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({  // test@mail.ru  TestPassword123_
                action: "login",
                login: this.state.loginValue,
                password: this.state.passwordValue,
            })
        })
            .then(response => {
                return response.json();
            })
            .then(json => {
                if (json.type !== 0) {
                    if (json.result === 'ok') {
                        this.setLoginStatus();
                        this.props.updateData(this.state.loginState)
                    } else if (json.result === 'error') {
                        this.setState({errorMsg: json.error});
                    } else {
                        this.setState({errorMsg: 'Произошла неизвестная ошибка'});
                    }
                }
            })
            .catch(error => {
                console.log(error);
                this.setState({errorMsg: 'Произошла неизвестная ошибка'});
                debugger;
            });
        e.preventDefault();
    }

    validateFields(fieldName, value) {
        let errorMsg = '';
        let loginValid, passwordValid;

        switch(fieldName) {
            case 'login':
                loginValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
                errorMsg = loginValid ? '' : 'Логин не валидный';
                break;
            case 'password':
                passwordValid = value.match(/^([0-9A-Za-z_]){7,}$/i);
                errorMsg = passwordValid ? '': 'Пароль не валидный';
                break;
            default:
                break;
        }

        this.setState({errorMsg: errorMsg});
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-6 ">
                        <div className="header-first">TEST SPA app</div>
                    </div>
                </div>
                <div className="row justify-content-center padding-top-8-pr">
                    <div className="col-md-6">
                        <div className="rectangle-1 text-center">Вход в личный кабинет</div>
                        <form className="rectangle-2" onSubmit={this.handleSubmit}>
                            <div className="form-group col-md-6 margin-auto padding-top-70">
                                <label htmlFor="login">Логин</label>
                                <input type="text" id="login"
                                       className={classNames("form-control", (this.state.errorMsg === '') ? "" : "is-invalid")}
                                       value={this.state.loginValue} onChange={this.handleChangeLogin} />
                            </div>

                            <div className="form-group col-md-6 margin-auto padding-top-20">
                                <label htmlFor="password">Пароль</label>
                                <input type="password" id="password"
                                       className={classNames("form-control", (this.state.errorMsg === '') ? "" : "is-invalid")}
                                       value={this.state.passwordValue} onChange={this.handleChangePass} />
                            </div>

                            <div className="col-md-6 margin-auto padding-top-50">
                                <button type="submit" className="btn btn-block submit-btn">Вход&nbsp;&#8594;</button>
                            </div>
                            <div className="error-msg text-center padding-top-10">{this.state.errorMsg}</div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;
