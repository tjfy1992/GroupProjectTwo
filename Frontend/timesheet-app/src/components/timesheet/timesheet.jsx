import React, { Component } from 'react'
import { Table, DatePicker, Select, Checkbox, Radio, Button } from "antd";
import moment from 'moment';
const dateFormat = 'DD MMMM YYYY';
const { Option } = Select;
var dataSource = [];
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
const NASelect = <Select style={{ width: 120 }} defaultValue='N/A' disabled></Select>
const zeroHourSelect = <Select style={{ width: 120 }} defaultValue={0.00} disabled></Select>
const TimeList = []
const vacationOptions = []
const approveOptionList = ['Approved timesheet', 'unapproved timesheet'];
const workHourData = [0.00, 1.00, 2.00, 3.00, 4.00, 5.00, 6.00, 7.00, 8.00, 9.00, 10.00, 11.00, 12.00, 13.00, 14.00, 15.00, 16.00, 17.00, 18.00, 19.00, 20.00, 21.00, 22.00, 23.00, 24.00]


export default class Timesheet extends Component {


    checkBox = <Checkbox ></Checkbox>
    approveSelect = <Select style={{ width: 200 }} defaultValue='Approved timesheet' onChange={(e) => this.approveSelectChange('1111',e)}>{approveOptionList.map((item, index) => <Option value={item} >{item}</Option>)}</Select>
    
    approveSelectChange(id, e) {
        console.log(id)
    }

    weekDayworkHourChange(rowId) {
        console.log(rowId)
    }

   
    weekDayworkHourSelect = (rowId) => {return <Select style={{ width: 120 }} defaultValue={0.00} onChange={() => this.weekDayworkHourChange(rowId)}>{workHourData.map(item =>
        <Option value={item}>{item}</Option>)}
        </Select>
    }

    weekDayStartSelect = <Select style={{ width: 120 }} defaultValue={'N/A'}>{TimeList}</Select>
    weekDayEndSelect = <Select style={{ width: 120 }} defaultValue={'N/A'}>{TimeList}</Select>
    
    

    dataPickerChange(value) {
        if (value != null) {
            console.log(value.toDate())
            this.setState({ endDate: value.toDate() })
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
            console.log(today.getDay())
            var startSelector = (today.getDay() == 6 || today.getDay() == 0) ? NASelect : this.weekDayStartSelect
            var endSelector = (today.getDay() == 6 || today.getDay() == 0) ? NASelect : this.weekDayEndSelect
            var workHourSelect = (today.getDay() == 6 || today.getDay() == 0) ? zeroHourSelect : this.weekDayworkHourSelect(i - 1)
            arr.push({
                key: i,
                day: moment(today).format('dddd'),
                date: moment(today).format('MM/DD/YYYY'),
                startTime: startSelector,
                endingTime: endSelector,
                totalHours: workHourSelect,
                floatingDay: this.checkBox,
                holiday: this.checkBox,
                vacation: this.checkBox,
            })
            i++;
            today.setDate(today.getDate() + 1);
            monToday = moment(today).format('MM/DD/YYYY')
        }
        this.setState({ rows: arr })

        console.log("changing data", this.state.rows)
    }
    handleChange() {

    }
    componentDidUpdate(prevProps, prevState) {
        if (this.state.endDate != prevState.endDate) {
            this.updateDateArray()
        }
        if (this.state.rows != prevState.rows) {
            // this.updateDateArray()
        }
    }

    componentDidMount() {
        this.updateDateArray()
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
                Week Engding: <DatePicker defaultValue={moment(moment(this.state.endDate).format(dateFormat), dateFormat)} format={dateFormat} onChange={value => this.dataPickerChange(value)} />

                Total Billing Hours:
                Tolal Compensated Hours:
                <Button>Set Default</Button>
                <Table dataSource={this.state.rows} columns={columns} />;
                {this.approveSelect}
                <Button>Choose File</Button>
                <Button>Save</Button>
            </div>
        )
    }
}
