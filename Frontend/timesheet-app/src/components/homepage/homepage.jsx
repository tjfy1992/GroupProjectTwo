import React, { Component } from 'react'
import { Tabs } from 'antd';
import { Card } from 'antd';
import Profile from '../profile/profile';
import Summary from '../summary/summary';
import Timesheet from '../timesheet/timesheet';
import { Layout, Menu } from 'antd';
import PropTypes from 'prop-types';

const { Header, Content, Footer } = Layout;

const { TabPane } = Tabs;
const { SubMenu } = Menu;

export default class Homepage extends Component {

    static contextTypes = {
        router: PropTypes.object.isRequired,
    }

    constructor(props) {
        super(props);
        this.state = {
            username: ''
        };
    }

    componentDidMount(){
        this.setState({username: localStorage.getItem('username')});
    }

    render() {
        return (

            <Layout>
                <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
                    <div className="logo" />
                    <Menu theme="dark" mode="horizontal" style={{float: 'left'}} >
                        <span>Welcome to Smart Time sheet</span>
                    </Menu>
                    <Menu theme="dark" mode="horizontal" style={{float: 'right'}} >
                        <SubMenu key="SubMenu" title={this.state.username}>
                            <Menu.Item key="setting:1" onClick={this.logout}>Log out</Menu.Item>
                        </SubMenu>
                    </Menu>
                </Header>
                <Content className="site-layout" style={{ padding: '0 50px', marginTop: 74 }}>
                    <div className="site-card-border-less-wrapper">
                        <Card bordered={false} style={{ width: "80%", height: 800, margin: "0 auto" }}>
                            <this.Demo/>
                        </Card>
                    </div>  
                </Content>
                <Footer style={{ textAlign: 'center' }}>Group project 2 ©2021 Created by Zhongqiu</Footer>
            </Layout>
        )
    }

    Demo = () => (
        <Tabs defaultActiveKey="1" onChange={this.callback} type="card">
          <TabPane tab="Summary" key="1">
            <Summary/>
          </TabPane>

          <TabPane tab="Timesheet" key="2">
            <Timesheet/>
          </TabPane>

          <TabPane tab="Profile" key="3">
            <Profile/>
          </TabPane>
        </Tabs>
    );

    callback = (key) => {
        console.log(key);
    }

    logout = (item, key, keyPath, domEvent) => {
        localStorage.clear();
        this.props.history.push('/');
    }
}
