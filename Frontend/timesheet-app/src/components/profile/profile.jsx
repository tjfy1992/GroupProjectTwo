import React, { Component } from 'react'
import './profile.css';
import { UserOutlined } from '@ant-design/icons';
import axios from 'axios'

import { Form, Input, Button, Typography, Avatar } from 'antd';

  const { Title } = Typography;

export default class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            phone: '',
            email: '',
            address: ''
        };
    }

    testGet = () => {
        axios({
            method: 'get',
            url: 'http://localhost:9000/core/test/profile',
        })
        .then((response) => {
            console.log(response)
        })
        .catch((error) => {
            console.log(error)
        })
    }

    testData = (e) => {
        e.preventDefault();
        this.testGet();
    };

    saveUpdate = (e) => {
        e.preventDefault();
        axios({
            method: 'post',
            url: 'http://localhost:9000/core/test/updateprofile',
            data: {
                phone: this.state.phone,
                email: this.state.email,
                address: this.state.address
            }
            })
            .then((response) => {
                localStorage.setItem('phone', response.data.user.phone);
                localStorage.setItem('email', response.data.user.email);
                localStorage.setItem('address', response.data.user.address);
                console.log(response)
            })
            .catch((error) => {
                console.log(error)
        })
    };

    handlePhoneChange = (e) => {
        this.setState({phone: e.target.value});
    }

    handleEmailChange = (e) => {
        this.setState({email: e.target.value});
    }

    handleAddressChange = (e) => {
        this.setState({address: e.target.value});
    }

    render() {

        return (
            <div style={{textAlign: "left"}}>
                <Avatar size={64} icon={<UserOutlined />} />
                <Form labelCol={{ span: 9 }} wrapperCol={{ span: 5, offset: 9 }} layout="horizontal">
                    <Form.Item>
                        <Title level={5}>Contact</Title>
                    </Form.Item>
                    <Form.Item>
                        <Input placeholder="Phone Number" onChange={this.handlePhoneChange} />
                    </Form.Item>
                        
                    <Form.Item>
                        <Input placeholder="E-mail" onChange={this.handleEmailChange} />
                    </Form.Item>
                    <Form.Item>
                        <Input.TextArea rows={4} placeholder="Address" onChange={this.handleAddressChange} />
                    </Form.Item>

                    <Form.Item>
                        <Title level={5}>Emergency Contact 1</Title>
                    </Form.Item>
                    <Form.Item>
                        <Input placeholder="Name" />
                    </Form.Item>
                    <Form.Item>
                        <Input placeholder="Phone Number" />
                    </Form.Item>
                        
                    <Form.Item>
                        <Title level={5}>Emergency Contact 2</Title>
                    </Form.Item>
                    <Form.Item>
                        <Input placeholder="Name" />
                    </Form.Item>
                    <Form.Item>
                        <Input placeholder="Phone Number" />
                    </Form.Item>

                    <Form.Item style={{textAlign: "center"}}>
                        <Button type="primary" htmlType="submit" className="login-form-button" onClick={this.saveUpdate}>Save</Button>
                    </Form.Item>
                </Form>
            </div>
        )
    }
}
