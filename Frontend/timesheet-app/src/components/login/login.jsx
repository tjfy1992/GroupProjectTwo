import React, { Component } from 'react'
import './login.css';
import axios from 'axios'
import PropTypes from 'prop-types';

export default class Login extends Component {

    static contextTypes = {
        router: PropTypes.object.isRequired,
    }

    componentDidMount(){
        let token = localStorage.getItem('token');
        if(token != null){
            this.props.history.push('/home');
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        };
    }

    submitLogin = (e) => {
        e.preventDefault();
        //  this.testGet();
        //  this.testPost();
        axios({
            method: 'post',
            url: 'http://localhost:9999/user/login',
            data: {
                username: this.state.username,
                password: this.state.password
            }
          })
            .then((response) => {
                localStorage.setItem('token', response.data.JWT_TOKEN);
                localStorage.setItem('username', response.data.user.username);
                this.props.history.push('/home');
                console.log(response)
            })
            .catch((error) => {
                console.log(error)
        })
    };

    testGet = () => {
        axios({
            method: 'get',
            url: 'http://localhost:9000/composite/testClientGet',
          })
            .then((response) => {
                console.log(response)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    testPost = () => {
        axios({
            method: 'post',
            url: 'http://localhost:9000/composite/testClientPost',
            data: {
              firstName: 'Fred',
              lastName: 'Flintstone'
            }
          })
            .then((response) => {
                console.log(response)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    handleUsernameChange = (e) => {
        this.setState({username: e.target.value});
    }

    handlePasswordChange = (e) => {
        this.setState({password: e.target.value});
    }

    render() {
        return (
            <div id="loginDiv">
                <div className="login">
                <h2>Smart Time sheet</h2>
                <div className="login_box">
                    <input type="text" name='name' id='name' required value={this.state.username} onChange={this.handleUsernameChange}  />
                    <label htmlFor="name" >Username</label>
                </div>

                <div className="login_box">    
                    <input type="password" name='pwd' id='pwd' required="required"  value={this.state.password} onChange={this.handlePasswordChange} />
                    <label htmlFor="pwd">Password</label>
                </div>
                    <a href="#" onClick={this.submitLogin}>
                        Log In
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                    </a>
                </div>
            </div>
        )
    }
}
