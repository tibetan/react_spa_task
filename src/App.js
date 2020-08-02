import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Login from './components/LoginForm/Login.js';
import Project from './components/Project/Project';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {loginState: false};
    }

    updateData = (value) => {
        this.setState({loginState: value})
    };

    render() {
        if (this.state.loginState === true) {
            return <Project updateData={this.updateData} />;
        }
        return <Login updateData={this.updateData} />;
    }
}

export default App;
