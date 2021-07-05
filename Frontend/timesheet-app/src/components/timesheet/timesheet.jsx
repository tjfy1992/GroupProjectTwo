import React, { Component } from 'react'
import { Table, DatePicker, Select, Checkbox, Radio, Button, InputNumber, Upload, message } from "antd";
import { UploadOutlined } from '@ant-design/icons';
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
    return (current.toDate().getDay() != 6);
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
    { label: 'Holiday', value: 2 },
    { label: 'Vacation', value: 3, disabled: true },
];
const workHourData = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]

export default class Timesheet extends Component {

    approveSelect = <Select style={{ width: 200 }} defaultValue='Approved timesheet' onChange={(e) => this.approveSelectChange('1111', e)}>{approveOptionList.map((item, index) => <Option value={item} >{item}</Option>)}</Select>

    approveSelectChange(id, e) {
        console.log(id)
    }

    weekDayworkHourChange(rowId) {
        console.log(rowId)
    }


    weekDayworkHourSelect = (rowId) => {
        return <Select style={{ width: 120 }} defaultValue={8} onChange={() => this.weekDayworkHourChange(rowId)}>{workHourData.map(item =>
            <Option value={item}>{item}</Option>)}
        </Select>
    }

    weekDayStartSelect = (rowId) => {
        return <Select style={{ width: 120 }} defaultValue={9} onChange={(value) => this.startChange(rowId, value)}>{
            workHourData.map(item =>
                <Option value={item}>{item + ':00'}</Option>)}
        </Select>
    }

    startChange(rowId, value) {
        console.log(rowId, "  ", value)
        let preRow = { ...this.state.rows }
        if (preRow[rowId] == undefined) { console.log("undefined row"); return }
        preRow[rowId].startMeta = value
        let newWorkHour = preRow[rowId].endTimeMeta - value < 0 ? 0 : preRow[rowId].endTimeMeta - value
        preRow[rowId].workHourMeta = newWorkHour
        preRow[rowId].totalHours = <InputNumber min={0} max={40} disabled={true} value={newWorkHour} />
        this.setState({ preRow }, () => {
            this.calTotalBillCopo()
        });
    }



    weekDayEndSelect = (rowId) => {
        return <Select style={{ width: 120 }} defaultValue={17}
            onChange={(value) => this.endChange(rowId, value)}>{
                workHourData.map(item =>
                    <Option value={item}>{item + ':00'}</Option>)}
        </Select>
    }

    endChange(rowId, value) {
        console.log(rowId, "  ", value)
        let preRow = { ...this.state.rows }
        if (preRow[rowId] == undefined) { console.log("undefined row"); return }
        preRow[rowId].endTimeMeta = value
        let newWorkHour = value - preRow[rowId].startTimeMeta < 0 ? 0 : value - preRow[rowId].startTimeMeta
        preRow[rowId].workHourMeta = newWorkHour
        preRow[rowId].totalHours = <InputNumber min={0} max={40} disabled={true} value={newWorkHour} />
        this.setState({ preRow }, () => {
            this.calTotalBillCopo()
        });
    }

    dataPickerChange(value) {
        if (value != null) {
            console.log(value.toDate())
            this.setState({ endDate: value.toDate() })
        }
    }

    holidayValueChange(rowId, e) {
        console.log("holiday meta change: ", e.target.value)
        let preRow = { ...this.state.rows }
        if (preRow[rowId] == undefined) { console.log("undefined row"); return }
        preRow[rowId].holidayMeta = e.target.value
        preRow[rowId].holidayGroup = <Radio.Group
            options={holidayOption}
            onChange={(value) => { this.holidayValueChange(rowId, value) }}
            value={e.target.value}
            optionType="button"
            buttonStyle="solid" />
        this.setState(preRow)
    }

    updateDateArray() {
        console.log("updating arr ", this.state.endDate)
        let today = new Date()
        let arr = []
        let i = 1
        let monToday = moment(today).format('MM/DD/YYYY');
        let momentEndDate = moment(this.state.endDate).format('MM/DD/YYYY');
        if (moment(momentEndDate).diff(moment(monToday), 'days') >= 7) {
            console.log("more than!!!")
            today.setDate(this.state.endDate.getDate() - 6)
            monToday = moment(today).format('MM/DD/YYYY');
        }
        console.log(monToday)
        while (monToday <= momentEndDate) {
            console.log("i is: ", i)
            console.log(monToday)
            console.log(momentEndDate)
            let day = today.getDay();
            let startMeta = 9
            let endMeta = 17
            let workHourMeta = 8
            let startSelector = (() => { return this.weekDayStartSelect(i - 1) })()
            let workHourSelect = (() => { return this.weekDayworkHourSelect(i - 1) })()
            let endSelector = (() => { return this.weekDayEndSelect(i - 1) })()

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
                if (this.state.rows[i].day == 0 || this.state.rows[i].day == 6) {
                    isHoliday = true
                }
                this.state.rows[i].holidayGroup = <Radio.Group
                    options={isHoliday ? holidayOptionDis : holidayOption}
                    onChange={(value) => { this.holidayValueChange(i, value) }}
                    value={isHoliday ? 2 : this.state.rows[i].holidayMeta}
                    optionType="button"
                    buttonStyle="solid"
                />
                this.state.rows[i].totalHours = <InputNumber min={0} max={40} disabled={true} value={this.state.rows[i].workHourMeta} />
            }
        });

        console.log("changing data", this.state.rows)
    }
    handleChange() {

    }
    componentDidUpdate(prevProps, prevState) {
        //console.log(this.state.rows)
        if (this.state.endDate != prevState.endDate) {
            this.updateDateArray()
        }

        if (this.state.rows != prevState.rows) {
            //alert(this.state.rows.length)
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
            if (this.state.rows[i].day != 0 && this.state.rows[i].day != 6) {
                billCount += 8
            }
        }
        this.setState({ totalBill: billCount, totalComposite: workHourCount })
    }

    componentDidMount() {
        this.updateDateArray()
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
                <p>This is timesheet tab</p>
                Week Engding: <DatePicker defaultValue={moment(moment(this.state.endDate).format(dateFormat), dateFormat)} format={dateFormat} disabledDate={disabledDate} onChange={value => this.dataPickerChange(value)} />

                Total Billing Hours:<InputNumber min={0} max={40} disabled={true} value={this.state.totalBill} defaultValue={40} />
                Tolal Compensated Hours:<InputNumber min={0} max={40} disabled={true} value={this.state.totalComposite} defaultValue={40} />
                <Button>Set Default</Button>
                <Table dataSource={this.state.rows} columns={columns} />;
                {this.approveSelect}
                <Upload 
                    onChange={this.handleChange}
                    beforeUpload={this.beforeUpload}>
                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                </Upload>
                <Button>Save</Button>
            </div>
        )
    }
}
