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
            address: '',
            emergencyContact1Name: '',
            emergencyContact1Phone: '',
            emergencyContact2Name: '',
            emergencyContact2Phone: '',
            userProfile1: [],
            userProfiles: this.props.userProfile,
        };
    }

    // componentDidMount() {
    //     axios.get('http://localhost:9000/core/test/profile')
    //       .then(res => {
    //         const userProfile1 = res.data;
    //         this.setState({ userProfile1 });
    //       })
    //   }

    // testData = (e) => {
    //     console.log(this.state.userProfiles);
    //     console.log(this.state.userProfiles.user);
    // };

    saveUpdate = (e) => {
        e.preventDefault();
        axios({
            method: 'post',
            url: 'http://localhost:9000/core/test/updateprofile',
            data: {
                phone: this.state.phone,
                email: this.state.email,
                address: this.state.address,
                emergencyContact1Name: this.state.emergencyContact1Name,
                emergencyContact1Phone: this.state.emergencyContact1Phone,
                emergencyContact2Name: this.state.emergencyContact2Name,
                emergencyContact2Phone: this.state.emergencyContact2Phone,
            }
            })
            .then((response) => {
                localStorage.setItem('phone', response.data.user.phone);
                localStorage.setItem('email', response.data.user.email);
                localStorage.setItem('address', response.data.user.address);
                localStorage.setItem('emergencyContact1Name', response.data.user.emergencyContact1Name);
                localStorage.setItem('emergencyContact1Phone', response.data.user.emergencyContact1Phone);
                localStorage.setItem('emergencyContact2Name', response.data.user.emergencyContact2Name);
                localStorage.setItem('emergencyContact2Phone', response.data.user.emergencyContact2Phone);
                console.log(response);
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

    handleEmergencyContact1NameChange = (e) => {
        this.setState({emergencyContact1Name: e.target.value});
    }

    handleEmergencyContact1PhoneChange = (e) => {
        this.setState({emergencyContact1Phone: e.target.value});
    }

    handleEmergencyContact2NameChange = (e) => {
        this.setState({emergencyContact2Name: e.target.value});
    }

    handleEmergencyContact2PhoneChange = (e) => {
        this.setState({emergencyContact2Phone: e.target.value});
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
                        <Input placeholder={this.state.userProfiles.user.phone} onChange={this.handlePhoneChange} />
                    </Form.Item>
                        
                    <Form.Item>
                        <Input placeholder={this.state.userProfiles.user.email} onChange={this.handleEmailChange} />
                    </Form.Item>
                    <Form.Item>
                        <Input.TextArea rows={4} placeholder={this.state.userProfiles.user.address} onChange={this.handleAddressChange} />
                    </Form.Item>

                    <Form.Item>
                        <Title level={5}>Emergency Contact 1</Title>
                    </Form.Item>
                    <Form.Item>
                        <Input placeholder={this.state.userProfiles.user.emergencyContacts[0].firstName + ' ' + this.state.userProfiles.user.emergencyContacts[0].lastName} onChange={this.handleEmergencyContact1NameChange} />
                    </Form.Item>
                    <Form.Item>
                        <Input placeholder={this.state.userProfiles.user.emergencyContacts[0].phone} onChange={this.handleEmergencyContact1PhoneChange} />
                    </Form.Item>
                        
                    <Form.Item>
                        <Title level={5}>Emergency Contact 2</Title>
                    </Form.Item>
                    <Form.Item>
                        <Input placeholder={this.state.userProfiles.user.emergencyContacts[1].firstName + ' ' + this.state.userProfiles.user.emergencyContacts[1].lastName} onChange={this.handleEmergencyContact2NameChange} />
                    </Form.Item>
                    <Form.Item>
                        <Input placeholder={this.state.userProfiles.user.emergencyContacts[1].phone} onChange={this.handleEmergencyContact2NameChange} />
                    </Form.Item>

                    <Form.Item style={{textAlign: "center"}}>
                        <Button type="primary" htmlType="submit" className="login-form-button" onClick={this.saveUpdate}>Save</Button>
                    </Form.Item>

                </Form>
                
            </div>
        )
    }
}

