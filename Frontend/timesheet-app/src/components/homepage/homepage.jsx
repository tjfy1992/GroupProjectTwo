import React, { Component } from 'react'
import { Tabs } from 'antd';
import { Card } from 'antd';
import Profile from '../profile/profile';
import Summary from '../summary/summary';
import Timesheet from '../timesheet/timesheet';
import { Layout, Menu } from 'antd';
import PropTypes from 'prop-types';
import axios from 'axios'

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
            username: '',
            activeTab: "1"
        };
    }

    componentDidMount(){
        this.testGet();
        this.setState({username: localStorage.getItem('username')});
    }

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
        <Tabs activeKey={this.state.activeTab} onChange={this.changeTab} type="card">
          <TabPane tab="Summary" key="1">
            <Summary goto={this.changeTab}/>
          </TabPane>

          <TabPane tab="Timesheet" key="2">
            <Timesheet />
          </TabPane>

          <TabPane tab="Profile" key="3">
            <Profile/>
          </TabPane>
        </Tabs>
    );

    changeTab = (activeKey) => {
        console.log(activeKey);
        this.setState({
          activeTab: activeKey
        });
    }

    logout = (item, key, keyPath, domEvent) => {
        localStorage.clear();
        this.props.history.push('/');
    }
}
