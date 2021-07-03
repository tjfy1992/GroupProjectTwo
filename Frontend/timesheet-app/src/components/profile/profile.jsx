import React, { Component } from 'react'
import './profile.css';
import { UserOutlined } from '@ant-design/icons';

import { Form, Input, Button, Typography, Avatar } from 'antd';

  const { Title } = Typography;

export default class Profile extends Component {

    render() {

        return (
            <div style={{textAlign: "left"}}>
                <Avatar size={64} icon={<UserOutlined />} />
                <Form
                    labelCol={{ span: 9 }}
                    wrapperCol={{ span: 5, offset: 9 }}
                    layout="horizontal">

                        <Form.Item>
                            <Title level={5}>Contact</Title>
                        </Form.Item>
                        <Form.Item>
                            <Input placeholder="Phone Number" />
                        </Form.Item>
                        
                        <Form.Item>
                            <Input placeholder="E-mail" />
                        </Form.Item>
                        <Form.Item>
                            <Input.TextArea rows={4} placeholder="Address"/>
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
                            <Button type="primary" htmlType="submit" className="login-form-button">Save</Button>
                        </Form.Item>
                </Form>
            </div>
        )
    }
}
