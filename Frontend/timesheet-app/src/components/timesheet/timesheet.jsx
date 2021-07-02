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

function onChange() {
    console.log("date change");
}
function getEndDate() {
    var today = new Date()
    var days = Math.abs(today.getDay() - 6)
    today.setDate(today.getDate() + days)
    console.log(moment(today).format(dateFormat))
    return today
}


export default class Timesheet extends Component {
   
    updateEndDate() {
        this.setState({endDate: getEndDate()})
        this.updateDateArray()
    }
    updateDateArray() {
        var today = new Date()
        var arr = []
        var i = 1
        console.log("today is: ",today)
        console.log("end date is: ", this.state.endDate)
        console.log(today < this.state.endDate)
        while (today <= this.state.endDate) { 
           
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
            console.log("today is: ",today)
            console.log("end date is: ", this.state.endDate) 
        }
        this.setState({rows: arr})
        console.log("initialting", this.state.rows)
    }

    componentDidMount() {
        this.updateEndDate();
      //  this.initDateArray();
       
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
                {/* <h4>Week Ending {this.state.endDate}</h4> */}
            
                <DatePicker defaultValue={moment(moment(this.state.endDate).format(dateFormat), dateFormat)} format={dateFormat} onChange={onChange} />
                {/* <Table dataSource={dataSource} columns={columns} />; */}
                <Table dataSource={this.state.rows} columns={columns} />;
            </div>
        )
    }
}
