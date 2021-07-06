import React, { Component } from 'react'
import { Table, DatePicker, Select, Radio, Button, InputNumber, Upload, message } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import './timesheet.css';
import axios from 'axios'
import moment from 'moment';
const dateFormat = 'DD MMMM YYYY';

const { Option } = Select;
const ALLOW_FILES = new Set(['image/JPEG', 'application/pdf',
'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
'application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword'
])
const columns = [
    {
        title: 'Day',
        dataIndex: 'dayStr',
        key: 'dayStr',
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
        title: 'Floating Day/Holiday/Vacation',
        dataIndex: 'holidayGroup',
        key: 'holidayGroup',
    },
];

function disabledDate(current) {
    // Can not select days before today and today
    return (current.toDate().getDay() !== 6);
}

function getEndDate(_today = new Date()) {
    var today = _today
    var days = Math.abs(today.getDay() - 6)
    today.setDate(today.getDate() + days)
    console.log(moment(today).format(dateFormat))
    return today
}

// const NASelect = <Select style={{ width: 120 }} defaultValue='N/A' disabled></Select>
// const zeroHourSelect = <Select style={{ width: 120 }} defaultValue={0.00} disabled></Select>
const approveOptionList = ['Approved timesheet', 'unapproved timesheet'];
const holidayOption = [
    //  Floating Day/Holiday/Vacation/default
    { label: 'Default', value: 0 },
    { label: 'Floating Day', value: 1 },
    { label: 'Holiday', value: 2 },
    { label: 'Vacation', value: 3 },
];
const holidayOptionDis = [
    //  Floating Day/Holiday/Vacation/default
    { label: 'Default', value: 0, disabled: true },
    { label: 'Floating Day', value: 1, disabled: true },
    { label: 'Holiday', value: 2, disabled: true  },
    { label: 'Vacation', value: 3, disabled: true },
];
const workHourData = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 'NA']

export default class Timesheet extends Component {

    approveSelect = <Select style={{ width: 200 }} defaultValue='Approved timesheet' onChange={(e) => this.approveSelectChange('1111', e)}>{approveOptionList.map((item, index) => <Option value={item} >{item}</Option>)}</Select>

    approveSelectChange(id, e) {
        console.log(id)
    }

    weekDayworkHourChange(rowId) {
        console.log(rowId)
    }

    weekDayStartSelect = (rowId) => {
        return (
        <Select style={{ width: 120 }} 
            defaultValue={(rowId !== 0 && rowId !== 6) ? 9 : 'NA'}
            onChange={(value) => this.startChange(rowId, value)}>
                {
                    workHourData.map(item =>
                    <Option value={item}>{item === 'NA'? item : item + ':00'}</Option>)
                }
        </Select>)
    }

    startChange(rowId, value) {
        let preRow = { ...this.state.rows }
        if (preRow[rowId] === undefined) { 
            console.log("undefined row"); 
            return; 
        }
        preRow[rowId].startTimeMeta = value;
        let newWorkHour = 0;
        if(preRow[rowId].endTimeMeta === 'NA' || preRow[rowId].startTimeMeta === 'NA'){
            newWorkHour = 0;
        }
        else{
            newWorkHour = preRow[rowId].endTimeMeta - value < 0 ? 0 : preRow[rowId].endTimeMeta - value;
        }
        preRow[rowId].workHourMeta = newWorkHour;
        preRow[rowId].totalHours = <InputNumber min={0} max={40} disabled={true} value={newWorkHour} />
        this.setState({ preRow }, () => {
            this.calTotalBillCopo()
        });
    }



    weekDayEndSelect = (rowId) => {
        return <Select style={{ width: 120 }} defaultValue={(rowId !== 0 && rowId !== 6) ? 17 : 'NA'}
            onChange={(value) => this.endChange(rowId, value)}>{
                workHourData.map(item =>
                    <Option value={item}>{item === 'NA'? item : item + ':00'}</Option>)}
        </Select>
    }

    endChange(rowId, value) {
        let preRow = { ...this.state.rows }
        if (preRow[rowId] === undefined) { console.log("undefined row"); return }
        preRow[rowId].endTimeMeta = value
        let newWorkHour = 0;
        if(preRow[rowId].endTimeMeta === 'NA' || preRow[rowId].startTimeMeta === 'NA'){
            newWorkHour = 0;
        }
        else{
            newWorkHour = value - preRow[rowId].startTimeMeta < 0 ? 0 : value - preRow[rowId].startTimeMeta
        }
        preRow[rowId].workHourMeta = newWorkHour
        preRow[rowId].totalHours = <InputNumber min={0} max={40} disabled={true} value={newWorkHour} />
        this.setState({ preRow }, () => {
            this.calTotalBillCopo()
        });
    }

    dataPickerChange(value) {
        if (value != null) {
            console.log(value.toDate())
            this.setState({ endDate: value.toDate()}, () => this.updateArrayBySelectingDate())
        }
    }

    holidayValueChange(rowId, e) {
        console.log("holiday meta change: ", e.target.value)
        let preRow = { ...this.state.rows }
        if (preRow[rowId] === undefined) { console.log("undefined row"); return }
        preRow[rowId].holidayMeta = e.target.value
        preRow[rowId].holidayGroup = <Radio.Group
            options={holidayOption}
            onChange={(value) => { this.holidayValueChange(rowId, value) }}
            value={e.target.value}
            optionType="default"
            buttonStyle="solid" />
        this.setState(preRow)
    }


    updateArrayBySelectingDate = () => {
        this.setState({ rows: [] }, () => {
            this.updateDateArray();
        });
    }

    updateDateArray = () => {

        //get the end date of the week, which is Saturday
        const dateObj = new Date(this.state.endDate);
        //go back to last Sunday
        dateObj.setDate(dateObj.getDate() - 6);

        //start traversal
        console.log("updating arr ", this.state.endDate)
        let today = dateObj
        let arr = []
        let i = 1
        let monToday = moment(today).format('MM/DD/YYYY');
        let momentEndDate = moment(this.state.endDate).format('MM/DD/YYYY');

        while (monToday <= momentEndDate) {
            let day = today.getDay();
            let startMeta = 9
            let endMeta = 17
            let workHourMeta = 8
            let startSelector = this.weekDayStartSelect(i - 1)
            let endSelector = this.weekDayEndSelect(i - 1)

            if (day === 6 || day === 0) {
                startMeta = 0
                endMeta = 0
                workHourMeta = 0
            }

            arr.push({
                key: i,
                day: day,
                dayStr: moment(today).format('dddd'),
                date: moment(today).format('MM/DD/YYYY'),
                startTime: startSelector,
                endingTime: endSelector,
                totalHours: null,
                holidayMeta: 0,
                startTimeMeta: startMeta,
                endTimeMeta: endMeta,
                workHourMeta: workHourMeta,
                holidayGroup: null
            })

            i++;
            today.setDate(today.getDate() + 1);
            monToday = moment(today).format('MM/DD/YYYY')
        }

        this.setState({ rows: arr }, () => {
            for (let i = 0; i < this.state.rows.length; i++) {
                let isHoliday = false
                if (this.state.rows[i].day === 0 || this.state.rows[i].day === 6) {
                    isHoliday = true
                }
                this.state.rows[i].holidayGroup = <Radio.Group
                    options={isHoliday ? holidayOptionDis : holidayOption}
                    onChange={(value) => { this.holidayValueChange(i, value) }}
                    value={isHoliday ? 2 : this.state.rows[i].holidayMeta}
                    optionType="default"
                    buttonStyle="solid"
                />
                this.state.rows[i].totalHours = <InputNumber min={0} max={40} disabled={true} value={this.state.rows[i].workHourMeta} />
            }
            console.log("changing data", this.state.rows)
        });

        //console.log("changing data", this.state.rows)
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.rows !== prevState.rows) {
            console.log("rows change", this.state.rows)
            this.calTotalBillCopo()
        }
    }

    calTotalBillCopo() {
        let workHourCount = 0;
        let billCount = 0;
        for (let i = 0; i < this.state.rows.length; i++) {
            workHourCount += this.state.rows[i].workHourMeta
            console.log("calculating hours on day: ", this.state.rows[i].day)
            if (this.state.rows[i].day !== 0 && this.state.rows[i].day !== 6) {
                billCount += 8
            }
        }
        this.setState({ totalBill: billCount, totalComposite: workHourCount })
    }

    componentDidMount() {
        this.updateDateArray();
        //this.getTimesheetData();
    }

    constructor(props) {

        super(props);
        this.state = {
            endDate: getEndDate(),
            rows: [],
            fileList: [],
            totalBill: 40,
            totalComposite: 40,
        };
    }

    submitFile = () => {
        console.log(this.state)
        const formData = new FormData();
        //for single file upload
        formData.append('file', this.state.fileList[0]);
        //add another parameter other than the file
        formData.set("a", 1);
        axios({
            method: 'post',
            url: 'http://localhost:9000/core/test/fileUploadWithForm',
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data'
            },
          })
            .then((response) => {
                console.log(response)
            })
            .catch((error) => {
                console.log(error)
        })
    }

    beforeUpload = (file) => {
        if (!ALLOW_FILES.has(file.type)) {
            message.error(`${file.name} can not be uploaded, only allow PDF, JPEG, Word, Excel files`);
            return false
        }
        
        console.log(file)
        let files = [file];
        this.setState({
            fileList: [...files]
        })
        return false;
   };

    handleChange = (info) => {
        if (info.file.status === 'uploading') {

          return;
        }
        if (info.file.status === 'done') {
          
        }
    };

    render() {
        return (
            <div>
                Week Ending: <DatePicker defaultValue={moment(moment(this.state.endDate).format(dateFormat), dateFormat)} format={dateFormat} disabledDate={disabledDate} onChange={value => this.dataPickerChange(value)} />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                Total Billing Hours:<InputNumber min={0} max={168} disabled={true} value={this.state.totalBill} defaultValue={40} />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                Tolal Compensated Hours:<InputNumber min={0} max={168} disabled={true} value={this.state.totalComposite} defaultValue={40} />
                <br/>
                <Button style={{float: 'right'}} onClick={this.setDefault}>Set Default</Button>
                <br/>
                <br/>
                <Table dataSource={this.state.rows} columns={columns} pagination={false}  />
                {this.approveSelect}
                &nbsp;
                <Upload 
                    onChange={this.handleChange}
                    beforeUpload={this.beforeUpload}>
                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                </Upload>
                <br/>
                <Button onClick={this.submitData}>Save</Button>
            </div>
        )
    }

    submitData = () => {
        console.log(this.state)
        let endDate = moment(this.state.endDate).format('MM/DD/YYYY');
        console.log(endDate)
        const formData = new FormData();
        //for single file upload
        if(this.state.fileList.length > 0)
            formData.append('file', this.state.fileList[0]);
        //add another parameter other than the file
        formData.set("endDate", endDate);
        let days = []
        this.state.rows.forEach(item => {
            let newItem = {
                'date': item.date,
                'startingHour': item.startTimeMeta,
                'endingHour': item.endTimeMeta,
                'name': item.dayStr,
                'isFloatingDay': item.holidayMeta === 1,
                'isHoliday': item.holidayMeta === 2,
                'isVacation': item.holidayMeta === 3
            };
            days.push(newItem)
            formData.set(item.dayStr, JSON.stringify(newItem))
        })
        
        //console.log(this.state.rows[1].holidayMeta)
        axios({
            method: 'post',
            url: 'http://localhost:9000/core/timesheet/addTimesheet',
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data'
            },
          })
            .then((response) => {
                console.log(response)
            })
            .catch((error) => {
                console.log(error)
        })
    }

    setDefault = () => {
        this.updateArrayBySelectingDate()
    }

    getTimesheetData = () => {
        axios({
            method: 'get',
            url: 'http://localhost:9000/core/timesheet/timesheetList?username=zack&year=2021',
          })
            .then((response) => {
                console.log(response)
                this.updateData(response.data)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    updateData = (data) => {
        let week = data.week;
        let dataArr = [];

        //saturday
        const dateObj = new Date(week.weekEnding);
        let saturdayDate = moment(dateObj).format('MM/DD/YYYY');
        let Saturday = {
            date: saturdayDate,
            dayStr: 'Saturday',
            key: 1,
            startTime: moment(new Date(week.saturday.startingTime.value)).format('hh:mm'),
            endingTime: moment(new Date(week.saturday.endingTime.value)).format('hh:mm'),
            workHourMeta: (week.saturday.endingTime.value - week.saturday.startingTime.value) / (1000 * 60 * 60 ),
            isFloating: week.saturday.floatingDay,
            isHoliday: week.saturday.holiday,
            isVacation: week.saturday.vacation,
        }
        dataArr.push(Saturday)

        //friday
        dateObj.setDate(dateObj.getDate() - 1)
        let fridayDate = moment(dateObj).format('MM/DD/YYYY')
        let Friday = {
            date: fridayDate,
            dayStr: 'Friday',
            key: 2,
            startTime: moment(new Date(week.friday.startingTime.value)).format('hh:mm'),
            endingTime: moment(new Date(week.friday.endingTime.value)).format('hh:mm'),
            workHourMeta: (week.friday.endingTime.value - week.friday.startingTime.value) / (1000 * 60 * 60 ),
            isFloating: week.friday.floatingDay,
            isHoliday: week.friday.holiday,
            isVacation: week.friday.vacation,
        }
        dataArr.push(Friday)

        //thursday
        dateObj.setDate(dateObj.getDate() - 1)
        let thursdayDate = moment(dateObj).format('MM/DD/YYYY')
        let Thursday = {
            date: thursdayDate,
            dayStr: 'Thursday',
            key: 3,
            startTime: moment(new Date(week.thursday.startingTime.value)).format('hh:mm'),
            endingTime: moment(new Date(week.thursday.endingTime.value)).format('hh:mm'),
            workHourMeta: (week.thursday.endingTime.value - week.thursday.startingTime.value) / (1000 * 60 * 60 ),
            isFloating: week.thursday.floatingDay,
            isHoliday: week.thursday.holiday,
            isVacation: week.thursday.vacation,
        }
        dataArr.push(Thursday)

        //wednesday
        dateObj.setDate(dateObj.getDate() - 1)
        let wednesdayDate = moment(dateObj).format('MM/DD/YYYY')
        let Wednesday = {
            date: wednesdayDate,
            dayStr: 'Wednesday',
            key: 4,
            startTime: moment(new Date(week.wednesday.startingTime.value)).format('hh:mm'),
            endingTime: moment(new Date(week.wednesday.endingTime.value)).format('hh:mm'),
            workHourMeta: (week.wednesday.endingTime.value - week.wednesday.startingTime.value) / (1000 * 60 * 60 ),
            isFloating: week.wednesday.floatingDay,
            isHoliday: week.wednesday.holiday,
            isVacation: week.wednesday.vacation,
        }
        dataArr.push(Wednesday)


        //tuesday
        dateObj.setDate(dateObj.getDate() - 1)
        let tuesdayDate = moment(dateObj).format('MM/DD/YYYY')
        let Tuesday = {
            date: tuesdayDate,
            dayStr: 'Tuesday',
            key: 5,
            startTime: moment(new Date(week.tuesday.startingTime.value)).format('hh:mm'),
            endingTime: moment(new Date(week.tuesday.endingTime.value)).format('hh:mm'),
            workHourMeta: (week.tuesday.endingTime.value - week.tuesday.startingTime.value) / (1000 * 60 * 60 ),
            isFloating: week.tuesday.floatingDay,
            isHoliday: week.tuesday.holiday,
            isVacation: week.tuesday.vacation,
        }
        dataArr.push(Tuesday)

        //monday
        dateObj.setDate(dateObj.getDate() - 1)
        let mondayDate = moment(dateObj).format('MM/DD/YYYY')
        let Monday = {
            date: mondayDate,
            dayStr: 'Monday',
            key: 6,
            startTime: moment(new Date(week.monday.startingTime.value)).format('hh:mm'),
            endingTime: moment(new Date(week.monday.endingTime.value)).format('hh:mm'),
            workHourMeta: (week.monday.endingTime.value - week.monday.startingTime.value) / (1000 * 60 * 60 ),
            isFloating: week.monday.floatingDay,
            isHoliday: week.monday.holiday,
            isVacation: week.monday.vacation,
        }
        dataArr.push(Monday)

        //sunday
        dateObj.setDate(dateObj.getDate() - 1)
        let sundayDate = moment(dateObj).format('MM/DD/YYYY')
        let Sunday = {
            date: sundayDate,
            dayStr: 'Sunday',
            key: 7,
            startTime: moment(new Date(week.sunday.startingTime.value)).format('hh:mm'),
            endingTime: moment(new Date(week.sunday.endingTime.value)).format('hh:mm'),
            workHourMeta: (week.sunday.endingTime.value - week.sunday.startingTime.value) / (1000 * 60 * 60 ),
            isFloating: week.sunday.floatingDay,
            isHoliday: week.sunday.holiday,
            isVacation: week.sunday.vacation,
        }
        dataArr.push(Sunday)
        
        this.setState({ rows: dataArr }, () => {
            for (let i = 0; i < this.state.rows.length; i++) {
                let item = this.state.rows[i];
                let holidayValue = item.isFloating ? 1 : (item.isHoliday? 2 : (item.isVacation? 3: 0))
                this.state.rows[i].holidayGroup = <Radio.Group
                    options={holidayOptionDis}
                    value={holidayValue}
                    buttonStyle="solid"
                />
                this.state.rows[i].totalHours = <InputNumber min={0} max={40} disabled={true} value={this.state.rows[i].workHourMeta} />
            }
        });

    }
}
