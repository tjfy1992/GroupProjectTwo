import React, { Component } from 'react'

import {
    Form,
    Input,
    Button,
    Select,
    Cascader,
    DatePicker,
    InputNumber,
    Switch,
  } from 'antd';

export default class Profile extends Component {
    render() {
        return (
            <div style={{textAlign: "center"}}>
                <Form
                    labelCol={{ span: 9 }}
                    wrapperCol={{ span: 5 }}
                    layout="horizontal">
                        <Form.Item label="Input">
                            <Input />
                        </Form.Item>
                        <Form.Item label="Select">
                            <Select>
                                <Select.Option value="demo">Demo</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="Cascader">
                            <Cascader
                                options={[
                                {
                                    value: 'zhejiang',
                                    label: 'Zhejiang',
                                    children: [
                                    {
                                        value: 'hangzhou',
                                        label: 'Hangzhou',
                                    },
                                    ],
                                },
                                ]}
                            />
                        </Form.Item>
                        <Form.Item label="DatePicker">
                            <DatePicker />
                        </Form.Item>
                        <Form.Item label="InputNumber">
                            <InputNumber />
                        </Form.Item>
                        <Form.Item label="Switch">
                            <Switch />
                        </Form.Item>
                        <Form.Item label="Button">
                            <Button>Button</Button>
                        </Form.Item>
                </Form>
            </div>
        )
    }
}
