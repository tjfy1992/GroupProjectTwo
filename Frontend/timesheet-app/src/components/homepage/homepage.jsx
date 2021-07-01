import React, { Component } from 'react'
import { Tabs } from 'antd';
import { Card } from 'antd';
import Profile from '../profile/profile';
import Summary from '../summary/summary';
import Timesheet from '../timesheet/timesheet';

const { TabPane } = Tabs;

export default class Homepage extends Component {
    render() {
        return (
            <div className="site-card-border-less-wrapper">
                <Card title="Time Sheet home page" bordered={false} style={{ width: "70%", height: 500, margin: "0 auto" }}>
                    <this.Demo/>
                </Card>
            </div>  
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
}
