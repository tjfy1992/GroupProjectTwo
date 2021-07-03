import React, { Component } from 'react'
import { Result, Button } from 'antd';
import PropTypes from 'prop-types';

export default class ErrorPage extends Component {

    static contextTypes = {
        router: PropTypes.object.isRequired,
    }

    render() {
        return (
            <div>
                <Result
                    status="404"
                    title="404"
                    subTitle="Sorry, the page you visited does not exist."
                    extra={<Button type="primary" onClick={this.backToHome}>Back Home</Button>}
                />
            </div>
        )
    }

    backToHome = () => {
        this.props.history.push('/home');
    }
}
