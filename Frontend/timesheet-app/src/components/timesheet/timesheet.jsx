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

function disabledDate(current) {
    // Can not select days before today and today
    return ((current.toDate().getDay() != 0 && current.toDate().getDay() != 6));
}

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

//const approveOptionList = ['Approved timesheet', 'unapproved timesheet'];
const workHourData = [0.00, 1.00, 2.00, 3.00, 4.00, 5.00, 6.00, 7.00, 8.00, 9.00, 10.00, 11.00, 12.00, 13.00, 14.00, 15.00, 16.00, 17.00, 18.00, 19.00, 20.00, 21.00, 22.00, 23.00, 24.00]


export default class Timesheet extends Component {

    floatCheckBox = (rowId) => {return <Checkbox id={rowId} checked={this.state.rows[0] === undefined ? true : false} onChange={(e)=>this.checkBoxChanged(e, rowId, 1)}></Checkbox>}
    // floatCheckBox = (rowId) => {return <Checkbox id={rowId} checked={this.state.rows[rowId] === undefined ? true : this.state.rows[rowId].holidayMeta == 1 ? false : false} onChange={(e)=>this.checkBoxChanged(e, rowId, 1)}></Checkbox>}
  
    // floatCheckBox = (rowId) => {return <Checkbox ></Checkbox>}
    holidayCheckBox = (rowId) => {return <Checkbox onChange={this.checkBoxChanged(rowId, 2)}></Checkbox>}

    vacationcheckBox = (rowId) => {return <Checkbox checked={this.state.rows[rowId] != undefined && this.state.rows[rowId].holidayMeta == 1} onChange={(e) => this.checkBoxChanged(rowId, 3)}></Checkbox>}

    //checkBoxChanged(e, rowId, holidayMeta) {
    checkBoxChanged = (e, rowId, holidayMeta) => {
        console.log("row is", rowId)
        console.log("row is", this.state.rows[rowId])
        let preRow = {...this.state.rows}
        if (preRow[rowId] == undefined) {console.log("undefined row"); return}
        preRow[rowId].holidayMeta = holidayMeta
        this.setState({preRow})
        console.log("changed", this.state.rows[rowId].holidayMeta)
    }

    approveSelect = <Select style={{ width: 200 }} defaultValue='Approved timesheet' onChange={(e) => this.approveSelectChange('1111',e)}>{approveOptionList.map((item, index) => <Option value={item} >{item}</Option>)}</Select>
    
    approveSelectChange(id, e) {
        console.log(id)
    }

    weekDayworkHourChange(rowId) {
        console.log(rowId)
    }


    weekDayworkHourSelect = (rowId) => {return <Select style={{ width: 120 }} defaultValue={8} onChange={() => this.weekDayworkHourChange(rowId)}>{workHourData.map(item =>
        <Option value={item}>{item}</Option>)}
        </Select>
    }

    weekDayStartSelect = (rowId) => { return <Select style={{ width: 120 }} defaultValue={9}>{
        workHourData.map(item => 
        <Option value={item}>{item}</Option>)}
    </Select>
    }

    weekDayEndSelect = (rowId) => { return <Select style={{ width: 120 }} defaultValue={17}>{
        workHourData.map(item =>
        <Option value={item}>{item}</Option>)}
    </Select>
    }
    

    dataPickerChange(value) {
        if (value != null) {
            console.log(value.toDate())
            this.setState({ endDate: value.toDate() })
        }
    }

    updateDateArray() {
        console.log("updating arr ", this.state.endDate)
        let today = new Date()
        let arr = []
        let i = 1
        let monToday = moment(today).format('MM/DD/YYYY');
        let momentEndDate = moment(this.state.endDate).format('MM/DD/YYYY');
        if (moment(momentEndDate).diff(moment(monToday), 'days') > 7) {
            console.log("more than!!!")
            today.setDate(this.state.endDate.getDate() - 6)
            monToday = moment(today).format('MM/DD/YYYY');
        }
        console.log(monToday)
        while (monToday <= momentEndDate) {
            console.log("i is: ", i)
            console.log(today.getDay())
            let day = today.getDay();
            let startMeta = 9
            let endMeta = 17
            let workHourMeta = 8
            let startSelector = (() => {return this.weekDayStartSelect(i - 1)})()
            let workHourSelect = (() => {return this.weekDayworkHourSelect(i - 1)})()
            let endSelector = (() => {return this.weekDayEndSelect(i - 1)})()
            

            if (day == 6 || day == 0) {
                startSelector = NASelect
                endSelector = NASelect
                workHourSelect = zeroHourSelect
                startMeta = 0
                endMeta = 0
                workHourMeta = 0
            }

            arr.push({
                key: i,
                day: moment(today).format('dddd'),
                date: moment(today).format('MM/DD/YYYY'),
                startTime: startSelector,
                endingTime: endSelector,
                totalHours: workHourSelect,
                floatingDay: ((i) => {return this.floatCheckBox(i - 1)})(i),
                holiday: this.holidayCheckBox(i - 1),
                vacation: this.vacationcheckBox(i - 1),
                holidayMeta: 0,
                startTimeMeta: startMeta,
                endTimeMeta: endMeta,
                workHourMeta: workHourMeta
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
            console.log(this.state.rows)
            // this.state.rows.forEach( (value, index) => {

            // }
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
                Week Engding: <DatePicker defaultValue={moment(moment(this.state.endDate).format(dateFormat), dateFormat)} format={dateFormat} disabledDate={disabledDate} onChange={value => this.dataPickerChange(value)} />

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
