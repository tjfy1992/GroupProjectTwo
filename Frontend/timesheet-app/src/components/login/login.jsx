import React, { Component } from 'react'
import './login.css';

export default class Login extends Component {

    submitLogin = (e) => {
        e.preventDefault();
        console.log('The link was clicked.');
      };

    render() {
        return (
            <div id="loginDiv">
                <div className="login">
                <h2>Smart Time sheet</h2>
                <div className="login_box">
                    <input type="text" name='name' id='name' required  />
                    <label htmlFor="name" >Username</label>
                </div>

                <div className="login_box">    
                    <input type="password" name='pwd' id='pwd' required="required"/>
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
