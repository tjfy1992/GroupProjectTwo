import React, { Component } from 'react'
import { Table, DatePicker, version } from "antd";
import moment from 'moment';
const dateFormat = 'DD MMMM YYYY';
var dataSource = [
    {
        key: '1',
        day: "m",
        date: "11",
        startTime: "1",
        endingTime:"1",
        totalHours:"1",
        floatingDay:"1",
        holiday:   "1",
        vacation: "1",
    },
    {
        key: 'i',
        day: "m",
        date: "11",
        startTime: "1",
        endingTime:"1",
        totalHours:"1",
        floatingDay:"1",
        holiday:   "1",
        vacation: "1",
    }
];
const columns = [
    {
        title: 'Day',
        dataIndex: 'day',
        key: 'day',
    },
    {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
    },
    {
        title: 'Starting Time',
        dataIndex: 'startTime',
        key: 'startTime',
    },
    {
        title: 'Ending Time',
        dataIndex: 'endingTime',
        key: 'endingTime',
    },
    {
        title: 'Total Hours',
        dataIndex: 'totalHours',
        key: 'totalHours',
    },
    {
        title: 'Floating Day',
        dataIndex: 'floatingDay',
        key: 'floatingDay',
    },
    {
        title: 'Holiday',
        dataIndex: 'holiday',
        key: 'holiday',
    },
    {
        title: 'Vacation',
        dataIndex: 'vacation',
        key: 'vacation',
    },
];


function getEndDate(_today = new Date()) {
    var today = _today
    var days = Math.abs(today.getDay() - 6)
    today.setDate(today.getDate() + days)
    console.log(moment(today).format(dateFormat))
    return today
}


export default class Timesheet extends Component {

    dataPickerChange(value) {
        if (value != null) {
            console.log(value.toDate())
            this.setState({endDate: value.toDate()})
        }
    }

    updateDateArray() {
        var today = new Date()
        var arr = []
        var i = 1
        var monToday = moment(today).format('MM/DD/YYYY');
        
        var momentEndDate = moment(this.state.endDate).format('MM/DD/YYYY');
        if (moment(momentEndDate).diff(moment(monToday), 'days') > 7) {
            console.log("more than!!!")
            today.setDate(this.state.endDate.getDate() - 6)
            monToday = moment(today).format('MM/DD/YYYY');
        } 
        console.log(monToday)
        while (monToday <= momentEndDate) { 
            console.log("i is: ", i)
            arr.push({
                key: i,
                day: moment(today).format('dddd'),
                date: moment(today).format('MM/DD/YYYY'),
                startTime: "1",
                endingTime:"1",
                totalHours:"1",
                floatingDay:"1",
                holiday:   "1",
                vacation: "1",
            })
            i++;
            today.setDate(today.getDate() + 1); 
            monToday = moment(today).format('MM/DD/YYYY')
        }
        this.setState({rows: arr})
        
        console.log("changing data", this.state.rows)
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.endDate != prevState.endDate) {
            this.updateDateArray()
        }
    }

    componentDidMount() {
        
    }
    
    constructor(props) {
        
        super(props);
        this.state = {
            endDate: getEndDate(),
            rows: dataSource
        };
    }

    render() {
        return (

            <div>
                <p>This is timesheet tab</p>
                <DatePicker defaultValue={moment(moment(this.state.endDate).format(dateFormat), dateFormat)} format={dateFormat} onChange={value => this.dataPickerChange(value)}/>
                <Table dataSource={this.state.rows} columns={columns} />;
            </div>
        )
    }
}
