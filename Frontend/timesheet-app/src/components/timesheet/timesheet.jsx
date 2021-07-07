import React, { Component } from 'react'
import { Table, DatePicker, Select, Radio, Button, InputNumber, Upload, message } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import './timesheet.css';
import axios from 'axios'
import moment from 'moment';
import jwt from 'jwt-decode'

const dateFormat = 'MM/DD/YYYY';

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
    { label: 'Holiday', value: 2, disabled: true  },
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

    approveSelect = () => {
        return (<Select style={{ width: 200 }} 
                defaultValue='Approved timesheet'
                disabled={this.state.currentOperation === 'View'}
                onChange={(e) => this.approveSelectChange('1111', e)}>
            {approveOptionList.map((item, index) => <Option value={item} >{item}</Option>)}
        </Select>)
    }

    approveSelectChange(id, e) {
        console.log(id)
    }

    weekDayworkHourChange(rowId) {
        console.log(rowId)
    }

    weekDayStartSelect = (rowId, defaultVal = -1) => {
        return (
        <Select style={{ width: 120 }} 
            defaultValue={defaultVal === -1? ((rowId !== 0 && rowId !== 6) ? 9 : 'NA') : defaultVal}
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



    weekDayEndSelect = (rowId, defaultVal = -1) => {
        return (
        <Select style={{ width: 120 }} 
            defaultValue={defaultVal === -1 ? ((rowId !== 0 && rowId !== 6) ? 17 : 'NA') : defaultVal}
            onChange={(value) => this.endChange(rowId, value)}
            >
            {
                workHourData.map(item =>
                    <Option value={item}>{item === 'NA'? item : item + ':00'}</Option>)
            }
        </Select>)
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
            this.setState(
                { endDate: value.toDate()
            }, 
            () => this.updateArrayBySelectingDate(moment(value.toDate()).format('MM/DD/YYYY')))
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
        this.setState(preRow, () => {this.calTotalBillCopo()})
    }


    updateArrayBySelectingDate = (value) => {
        this.setState({ rows: [] }, () => {
            //this.updateDateArray();
            this.getTimesheetData(this.state.username, value);
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

        arr = arr.reverse()

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
        let compensated = 0;
        let billCount = 0;
        //console.log(this.state.rows)
        for (let i = 0; i < this.state.rows.length; i++) {
            //for weekdays
            if (this.state.rows[i].day !== 0 && this.state.rows[i].day !== 6) {
                if(this.state.rows[i].holidayMeta !== 1 && this.state.rows[i].holidayMeta !== 2 && this.state.rows[i].holidayMeta !== 3){
                    billCount += this.state.rows[i].workHourMeta
                }
                else{
                    compensated += 8
                }
            }
            //for weekends
            else{
                billCount += this.state.rows[i].workHourMeta
            }
        }
        compensated += billCount;
       // billCount += weekendHours;
        this.setState({ totalBill: billCount, totalComposite: compensated })
    }

    componentDidMount() {
        let token = localStorage.getItem('token');
        let decodedusername = jwt(token).sub.split(',')[1].substring(jwt(token).sub.split(',')[1].lastIndexOf("=") + 1, jwt(token).sub.split(',')[1].lastIndexOf("}"));
        this.setState({username: decodedusername});
        console.log(decodedusername)
        this.getTimesheetData();
    }

    constructor(props) {
        super(props);
        console.log(props)
        this.state = {
            isUpdating: false,
            currentOperation: 'Add',
            endDate: props.EndDate? props.EndDate: getEndDate(),
            rows: [],
            fileList: [],
            totalBill: 40,
            totalComposite: 40,
            username: '',
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
                <Button style={{float: 'right'}} onClick={this.setDefault} disabled={this.state.currentOperation === 'View'}>Set Default</Button>
                <br/>
                <br/>
                <Table dataSource={this.state.rows} columns={columns} pagination={false}  />
                <br/>
                {this.approveSelect()}
                &nbsp;
                <Upload 
                    onChange={this.handleChange}
                    beforeUpload={this.beforeUpload}>
                    <Button icon={<UploadOutlined />} disabled={this.state.currentOperation === 'View'}>Click to Upload</Button>
                </Upload>
                <br/>
                <Button onClick={this.submitData} disabled={this.state.currentOperation === 'View'}>Save</Button>
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
        formData.set("username", this.state.username);
        //let days = []
        this.state.rows.forEach(item => {
            let newItem = {
                'date': item.date,
                'startingHour': item.startTimeMeta,
                'endingHour': item.endTimeMeta,
                'name': item.dayStr,
                'isFloatingDay': item.holidayMeta === 0? false: (item.holidayMeta  === 1? true: (item.isFloating?item.isFloating: false)),
                'isHoliday': item.holidayMeta === 0? false: (item.holidayMeta === 2? true: (item.isHoliday?item.isHoliday: false)),
                'isVacation': item.holidayMeta === 0? false: (item.holidayMeta === 3? true: (item.isVacation?item.isVacation: false))
            };
            //days.push(newItem)
            console.log(newItem)
            formData.set(item.dayStr, JSON.stringify(newItem))
        })
        
        //if the user is updating a timesheet
        if(this.state.currentOperation === 'Update'){
            axios({
                method: 'post',
                url: 'http://localhost:9000/core/timesheet/updateTimesheet',
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
            })
                .then((response) => {
                    console.log(response);
                    if(response.data.result === true)
                        message.success('Timesheet updated successfully');
                    else
                    message.error('Ops, something went wrong.');
                })
                .catch((error) => {
                    console.log(error)
            })
        }
        else{
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
                    if(response.data.result === true)
                        message.success('Timesheet added successfully');
                    else
                        message.error('Ops, something went wrong.');
                })
                .catch((error) => {
                    console.log(error)
            })
        }
    }

    setDefault = () => {
        
        if(this.state.currentOperation === "Update"){
            var {userName} = this.props;
            let template = {username: userName,
                            Sunday:'',
                            Monday:'',
                            Tuesday:'',
                            Wednesday:'',
                            Thursday:'',
                            Friday:'',
                            Saturday:'',
                            };
            this.state.rows.forEach((item,index) => {
                let newDay = {
                    'startingHour': item.startTimeMeta,
                    'endingHour': item.endTimeMeta,
                    'isFloatingDay': item.holidayMeta === 0? false: (item.holidayMeta  === 1? true: false),
                    'isHoliday': item.holidayMeta === 0? false: (item.holidayMeta === 2? true: false),
                    'isVacation': item.holidayMeta === 0? false: (item.holidayMeta === 3? true: false)
                };
                
                if(index == 0){
                    template.Sunday = newDay;
                } else if(index == 1){
                    template.Monday = newDay;
                } else if(index == 2){
                    template.Tuesday = newDay;
                } else if(index == 3){
                    template.Wednesday = newDay;
                } else if(index == 4){
                    template.Thursday = newDay;
                } else if(index == 5){
                    template.Friday = newDay;
                } else if(index == 6){
                    template.Saturday = newDay;
                }
                index +=1;
            })
            console.log(template);
            axios({
                method: 'post',
                url: 'http://localhost:9000/core/test/updateTemplate',
                data: template,
            })
            
        }
    }

    getTimesheetData = (username = 'zack', endDate = '07/10/2021') => {
        axios({
            method: 'get',
            url: 'http://localhost:9000/core/timesheet/getWeek?username=' + username + '&endDate=' + endDate,
          })
            .then((response) => {
                console.log(response)
                //updateDateArray
                if(!response.data.week){
                    this.setState({currentOperation: "Add"}, () => this.updateDateArray());
                }
                else if(response.data.week.status === "Approved"){
                    this.setState({currentOperation: "View"}, 
                        () => this.updateDataForView(response.data));
                }
                else{
                    this.setState({currentOperation: "Update"}, 
                        () => this.updateDataForEdit(response.data));
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    //update data for view
    updateDataForView = (data) => {
        let week = data.week;
        let dataArr = [];

        //saturday
        const dateObj = new Date(week.weekEnding);
        let saturdayDate = moment(dateObj).format('MM/DD/YYYY');
        let Saturday = {
            date: saturdayDate,
            dayStr: 'Saturday',
            key: 1,
            startTime: week.saturday.startingTime > 0? week.saturday.startingTime + ":00": "NA",
            endingTime: week.saturday.endingTime > 0? week.saturday.endingTime + ":00": "NA",
            workHourMeta: week.saturday.endingTime - week.saturday.startingTime,
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
            startTime: week.friday.startingTime > 0? week.friday.startingTime + ":00": "NA",
            endingTime: week.friday.endingTime > 0? week.friday.endingTime + ":00": "NA",
            workHourMeta: week.friday.endingTime - week.friday.startingTime,
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
            startTime: week.thursday.startingTime > 0? week.thursday.startingTime + ":00": "NA",
            endingTime: week.thursday.endingTime > 0? week.thursday.endingTime + ":00": "NA",
            workHourMeta: week.thursday.endingTime - week.thursday.startingTime,
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
            startTime: week.wednesday.startingTime > 0? week.wednesday.startingTime + ":00": "NA",
            endingTime: week.wednesday.endingTime > 0? week.wednesday.endingTime + ":00": "NA",
            workHourMeta: week.wednesday.endingTime - week.wednesday.startingTime,
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
            startTime: week.tuesday.startingTime > 0? week.tuesday.startingTime + ":00": "NA",
            endingTime: week.tuesday.endingTime > 0? week.tuesday.endingTime + ":00": "NA",
            workHourMeta: week.tuesday.endingTime - week.tuesday.startingTime,
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
            startTime: week.monday.startingTime > 0? week.monday.startingTime + ":00": "NA",
            endingTime: week.monday.endingTime > 0? week.monday.endingTime + ":00": "NA",
            workHourMeta: week.monday.endingTime - week.monday.startingTime,
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
            startTime: week.sunday.startingTime > 0? week.sunday.startingTime + ":00": "NA",
            endingTime: week.sunday.endingTime > 0? week.sunday.endingTime + ":00": "NA",
            workHourMeta: week.sunday.endingTime - week.sunday.startingTime,
            isFloating: week.sunday.floatingDay,
            isHoliday: week.sunday.holiday,
            isVacation: week.sunday.vacation,
        }
        dataArr.push(Sunday)
        
        this.setState({ rows: dataArr }, () => {
            for (let i = 0; i < this.state.rows.length; i++) {
                let item = this.state.rows[i];
                let holidayValue = 
                    (i === 0 || i === 6)? 2: (item.isFloating ? 1 : (item.isHoliday? 2 : (item.isVacation? 3: 0)))
                this.state.rows[i].holidayGroup = <Radio.Group
                    options={holidayOptionDis}
                    value={holidayValue}
                    buttonStyle="solid"
                />
                this.state.rows[i].totalHours = <InputNumber min={0} max={40} disabled={true} value={this.state.rows[i].workHourMeta} />
            }
        });

    }

    //update data for edit
    updateDataForEdit = (data) => {
        let week = data.week;
        let dataArr = [];

        //saturday
        const dateObj = new Date(week.weekEnding);
        let saturdayDate = moment(dateObj).format('MM/DD/YYYY');
        let Saturday = {
            date: saturdayDate,
            dayStr: 'Saturday',
            key: 1,
            startTime: this.weekDayStartSelect(0, week.saturday.startingTime),
            endingTime: this.weekDayEndSelect(0, week.saturday.endingTime),
            workHourMeta: week.saturday.endingTime - week.saturday.startingTime,
            startTimeMeta: week.saturday.startingTime,
            endTimeMeta: week.saturday.endingTime,
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
            startTime: this.weekDayStartSelect(1, week.friday.startingTime),
            endingTime: this.weekDayEndSelect(1, week.friday.endingTime),
            workHourMeta: week.friday.endingTime - week.friday.startingTime,
            startTimeMeta: week.friday.startingTime,
            endTimeMeta: week.friday.endingTime,
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
            startTime: this.weekDayStartSelect(2, week.thursday.startingTime),
            endingTime: this.weekDayEndSelect(2, week.thursday.endingTime),
            workHourMeta: week.thursday.endingTime - week.thursday.startingTime,
            startTimeMeta: week.thursday.startingTime,
            endTimeMeta: week.thursday.endingTime,
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
            startTime: this.weekDayStartSelect(3, week.wednesday.startingTime),
            endingTime: this.weekDayEndSelect(3, week.wednesday.endingTime),
            workHourMeta: week.wednesday.endingTime - week.wednesday.startingTime,
            startTimeMeta: week.wednesday.startingTime,
            endTimeMeta: week.wednesday.endingTime,
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
            startTime: this.weekDayStartSelect(4, week.tuesday.startingTime),
            endingTime: this.weekDayEndSelect(4, week.tuesday.endingTime),
            workHourMeta: week.tuesday.endingTime - week.tuesday.startingTime,
            startTimeMeta: week.tuesday.startingTime,
            endTimeMeta: week.tuesday.endingTime,
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
            startTime: this.weekDayStartSelect(5, week.monday.startingTime),
            endingTime: this.weekDayEndSelect(5, week.monday.endingTime),
            workHourMeta: week.monday.endingTime - week.monday.startingTime,
            startTimeMeta: week.monday.startingTime,
            endTimeMeta: week.monday.endingTime,
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
            startTime: this.weekDayStartSelect(6, week.sunday.startingTime),
            endingTime: this.weekDayEndSelect(6, week.sunday.endingTime),
            workHourMeta: week.sunday.endingTime - week.sunday.startingTime,
            startTimeMeta: week.sunday.startingTime,
            endTimeMeta: week.sunday.endingTime,
            isFloating: week.sunday.floatingDay,
            isHoliday: week.sunday.holiday,
            isVacation: week.sunday.vacation,
        }
        dataArr.push(Sunday)
        
        this.setState({ rows: dataArr }, () => {
            for (let i = 0; i < this.state.rows.length; i++) {

                let item = this.state.rows[i];
                let holidayValue = 
                    (i === 0 || i === 6)? 2 : (item.isFloating ? 1 : (item.isHoliday? 2 : (item.isVacation? 3: 0)))

                this.state.rows[i].holidayGroup = <Radio.Group
                    options={(i ===0 || i === 6) ? holidayOptionDis : holidayOption}
                    onChange={(value) => { this.holidayValueChange(i, value) }}
                    value={holidayValue}
                    optionType="default"
                    buttonStyle="solid"
                />
                this.state.rows[i].totalHours = <InputNumber min={0} max={24 * 7} disabled={true} value={this.state.rows[i].workHourMeta} />
            }
        });

    }
}
