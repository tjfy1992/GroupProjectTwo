import React, { Component } from 'react'
import {Popover, Button, Table, Tag, Space, Badge,Tooltip} from 'antd';
import {InfoCircleTwoTone} from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
import emitter from "../../Domain/ev"

const columns = [
  {
    title: 'WeekEnding',
    dataIndex: 'weekEnding',
    key: 'weekEnding',
    sorter: (a, b) => new Date(b.weekEnding) - new Date(a.weekEnding),
  },
  {
    title: 'Total Hours',
    dataIndex: 'totalHours',
    key: 'totalHours',
  },
  {
    title: 'Submission Status',
    dataIndex: 'submissionStatus',
    filters: [

      {
        text: 'Incomplete',
        value: 'Incomplete',
      },
      {
        text: 'Completed',
        value: 'Completed',
      },
    ],
    key: 'submissionStatus',
    render: (submissionStatus,record)=>{
          var text,badge;
          let color = 'gray';
          if (submissionStatus === 'Incomplete' && record.approvalStatus === 'Pending') {
            text = <span>Items due: Proof of Approved TimeSheet</span>;
            badge = <InfoCircleTwoTone  twoToneColor="#eb2f96"/>;
            color = 'geekblue';
          } else if (submissionStatus === 'Incomplete' && record.approvalStatus === 'Not approved'){
            text = <span>Approval denied by Admin, please  contact your HR manager</span>;
            badge = <InfoCircleTwoTone  twoToneColor="#eb2f96"/>;
            color = 'geekblue';
          }
          if (submissionStatus === 'Completed') {
            color = 'green';
          }
          return (
            <div>
            <Tag color={color} key={submissionStatus}>
              {submissionStatus.toUpperCase()}
            </Tag>
            <Tooltip title={text} color="geekblue" key={text}>
            <Badge count={0} dot>
              {badge}
            </Badge>
            </Tooltip>
            </div>
          );
          },

    onFilter: (value, record) => record.submissionStatus.indexOf(value) === 0,
  },
  {
    title: 'Approval Status',
    key: 'approvalStatus',
    dataIndex: 'approvalStatus',
    filters: [
      {
        text: 'Pending',
        value: 'Pending',
      },
      {
        text: 'Not approved',
        value: 'Not approved',
      },
      {
        text: 'Approved',
        value: 'Approved',
      },
    ],
    
    render: (approvalStatus) => {
      let color = approvalStatus.length === 7 ? 'gray' : 'green';
      if (color ==='gray') {


      }
      
      if (approvalStatus === 'Not approved') {
        color = 'volcano';
      }
          return (
            <Tag color={color} key={approvalStatus}>
              {approvalStatus.toUpperCase()}
            </Tag>
          );
          }

  ,
    onFilter: (value, record) => record.approvalStatus.indexOf(value) === 0,
  },
  {
    title: 'Option',
    key: 'option',
    dataIndex: 'option',
    // render: (record) => {
    //   var text;
    //   if(record.submissionStatus === 'Completed'){
    //     text = <a>View</a>;
    //     return( <Space size="middle">
    //     {text}
    //   </Space>
    //  )
    //   } else {
    //     text = <a>Edit</a>;
    //     return( <Space size="middle">
    //     {text}
    //   </Space>
    //  )
    //   }
    // },
  },
  {
    title: 'Comments',
    key: 'Comments',
    render: (record) => {

      var fdayleft = 3-record.usedfloatingday;
      var vdayleft = 3-record.usedvacationday;
      var comment = '',reminder = '',badge = '',finalreminder = '',finalcomment = '';
      var fcomment = record.requiredfloatingday+' floating days required\r';
      var vcomment = record.requiredvacationday+' vacation days required\r';
      var hcomment = record.holiday+' holidays included\r';
      var freminder = 'Total floating days left ' + fdayleft +' days\r';
      var vreminder = 'Total vacation days left ' + vdayleft +' days\r';

      finalreminder += record.requiredfloatingday == 0? '':freminder+'. ';
      finalreminder += record.requiredvacationday == 0? '':vreminder+'. ';
      finalcomment += record.requiredfloatingday == 0? '':fcomment+'. ';
      finalcomment += record.requiredvacationday == 0? '':vcomment+'. ';
      finalcomment += record.holiday === 0? '':hcomment+'. ';

      if(fdayleft < 0 || vdayleft <0){
        finalcomment = 'You have insufficient Floatring/Vacation Days in this year.\r';
        finalreminder = 'Please check the comment for details. \r'
      }
      if (finalcomment !== '') {
        comment = finalcomment;
        reminder = finalreminder;
        badge = <InfoCircleTwoTone  twoToneColor="#eb2f96"/>;
      } 
      return (
        <div>
        <a>{comment}</a>
        <Tooltip title={reminder} color="geekblue" key={reminder}>
        <Badge count={0} dot>
          {badge}
        </Badge>
        </Tooltip>
        </div>
      );
   }
  },
];
  


export default class Summary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tempsummarys:[],
      summarycolumns:[],
      count: 2,
      show: "Show More",
      userInfos: [],
    };
  }


  
    handleShowMore = () => {
      if (this.state.tempsummarys.length - this.state.count < 2 && this.state.count !== this.state.tempsummarys.length+1 ) {
        this.setState({
          count: this.state.tempsummarys.length+1,
          show: "Hide All",
        });
      } else if(this.state.count === this.state.tempsummarys.length+1){
        this.setState({
          count: 2,
          show: "Show More",
        });
      } else {
        this.setState({
          count: this.state.count+2,
          show: "Show More",
        });
      }
    };

   componentDidMount=()=> {
    this.setState({summarycolumns: columns});
    this.componentDidUpdate(this.props);
  }

  componentDidUpdate (prevProps) {
    if(prevProps.userInfo != this.props.userInfo || !prevProps){
      this.setState({userInfos: this.props.userInfo},()=>{ this.setState({tempsummarys: this.state.userInfos.user.timeSheets})})
    }
    
    console.log(this.props.userInfo);

  }

  renderRawData =() =>{
    var arys = [];
    this.state.tempsummarys
      .forEach((sheet,index) => {
        var ary = {Year: '',weekEnding : "", totalHours : 0, submissionStatus : '', approvalStatus : '', option : '', usedfloatingday: 0, holiday :0, usedvacationday : 0, requiredfloatingday: 0, requiredvacationday: 0};
        ary.usedfloatingday = 3-sheet.remainingFloatingDays;
        ary.holiday = 0;
        ary.usedvacationday = 3-sheet.remainingVacationDays;
        sheet.weeks
        .slice(0, this.state.count)
        .forEach((week,index) => {
        ary = {Year: '',weekEnding : "", totalHours : 0, submissionStatus : '', approvalStatus : '', option : '', usedfloatingday: ary.usedfloatingday, holiday :0, usedvacationday : ary.usedvacationday, requiredfloatingday: 0, requiredvacationday: 0}          
        ary.Year = sheet.year;
        console.log(ary.usedfloatingday,ary.usedvacationday,ary.holiday);
        if(week.status === "Pending"){
          ary.submissionStatus = 'Incomplete';
        } else if(week.status === 'Approved'){
          ary.submissionStatus = 'Completed';
        } else {
          week.status = 'N/A'
          ary.submissionStatus = 'Not Started';
        }
        if(week.status != ''){
          ary.approvalStatus = week.status;
        } else {
          ary.approvalStatus = 'Not approved';
        }
        if (ary.submissionStatus === "Completed") {
          ary.option = (
            <a onClick={this.handleOption(week,'view')}>
            {" "}
            View
          </a>
          );
        } else if (ary.submissionStatus === "Incomplete") {
          ary.option = (
            <a onClick={this.handleOption(week,'edit')}>
              {" "}
              Edit
            </a>
          );
        } else {
          ary.option = (
            <a onClick={this.handleOption(week,'edit')}>
              {" "}
              Start
            </a>
          );
        }
          ary.totalHours=0
          if(week.weekEnding != undefined){
            ary.weekEnding='';
            var date = new Date(week.weekEnding);
            ary.weekEnding=((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + date.getFullYear();
          } 
          if (week.sunday.startingTime != -1){
            ary.totalHours += week.sunday.endingTime-week.sunday.startingTime;
          }
          if (week.monday.startingTime != -1){
            ary.totalHours += week.monday.endingTime-week.monday.startingTime;
          }
          if (week.tuesday.startingTime != -1){
            ary.totalHours += week.tuesday.endingTime-week.tuesday.startingTime;
          }
          if (week.wednesday.startingTime!= -1){
            ary.totalHours += week.wednesday.endingTime-week.wednesday.startingTime;
          }
          if (week.thursday.startingTime != -1){
            ary.totalHours += week.thursday.endingTime-week.thursday.startingTime;
          }
          if (week.friday.startingTime!= -1){
            ary.totalHours += week.friday.endingTime-week.friday.startingTime;
          }
          if (week.saturday.startingTime!= -1){
            ary.totalHours += week.saturday.endingTime-week.saturday.startingTime;
          }
          if (week.sunday.holiday == false){
            if(week.sunday.floatingDay == true){
              ary.requiredfloatingday +=1;
            } else if (week.sunday.vacation == true){
              ary.requiredvacationday +=1;
            }
          } else {
              ary.holiday += 1;
          }
          if (week.monday.holiday == false){
            if(week.monday.floatingDay == true){
              ary.requiredfloatingday +=1;
            } else if (week.monday.vacation == true){
              ary.requiredvacationday +=1;
            }
          } else {
              ary.holiday += 1;
          }
          if (week.tuesday.holiday == false){
            if(week.tuesday.floatingDay == true){
              ary.requiredfloatingday +=1;
            } else if (week.tuesday.vacation == true){
              ary.requiredvacationday +=1;
            }
          } else {
              ary.holiday += 1;
          }
          if (week.wednesday.holiday == false){
            if(week.wednesday.floatingDay == true){
              ary.requiredfloatingday +=1;
            } else if (week.wednesday.vacation == true){
              ary.requiredvacationday +=1;
            }
          } else {
              ary.holiday += 1;
          }
          if (week.thursday.holiday == false){
            if(week.thursday.floatingDay == true){
              ary.requiredfloatingday +=1;
            } else if (week.thursday.vacation == true){
              ary.requiredvacationday +=1;
            }
          } else {
              ary.holiday += 1;
          }
          if (week.friday.holiday == false){
            if(week.friday.floatingDay == true){
              ary.requiredfloatingday +=1;
            } else if (week.friday.vacation == true){
              ary.requiredvacationday +=1;
            }
          } else {
              ary.holiday += 1;
          }
          if (week.saturday.holiday == false){
            if(week.saturday.floatingDay == true){
              ary.requiredfloatingday +=1;
            } else if (week.saturday.vacation == true){
              ary.requiredvacationday +=1;
            }
          } else {
              ary.holiday += 1;
          }

        console.log(ary.requiredfloatingday);
        console.log(ary.requiredvacationday);
          index += 1;
          arys.push(ary)
          // ary = {Year: '',weekEnding : "", totalHours : 0, submissionStatus : '', approvalStatus : '', option : '', usedfloatingday: 0, holiday :0, usedvacationday : 0};
          return (week,ary.totalHours);
        })
        // sheet.remainingFloatingDays -= ary.requiredfloatingday;
        // sheet.remainingVacationDays -= ary.requiredvacationday;

        return (
          sheet
        );
      }
      
      )
      return (arys)
  }

  // renderWeekData() {
  //   let weekEndsAt = '';
  //   return this.state.weeks
  //     .map((day,index) => {
      

  //       switch (index) {
  //         case 0:
  //           weekEndsAt = day.weekEnding;
  //           return;
  //         case 1:
  //           day.day = "Sunday";
  //           break;
  //         case 2:
  //           day.day = "Monday";
  //           break;
  //         case 3:
  //           day.day = "Tuesday";
  //           break;
  //         case 4:
  //           day.day = "Wednesday";
  //           break;
  //         case 5:
  //           day.day = "Thursday";
  //           break;
  //         case 6:
  //           day.day = "Friday";
  //           break;
  //         case 7:
  //           day.day = "Saturday";
  //       }
  //       day.date = moment(weekEndsAt).subtract(7-index,'days').format('MM/DD/YYYY');
  //       if(day.startingTime !== ''){
  //         var tempend = new Date(day.endingTime);
  //         var tempstart = new Date(day.startingTime);
  //         day.totalHours = tempend.getHours()-tempstart.getHours();
  //         day.startingTimes = moment(day.startingTime).format('LT');
  //       }
  //       if(day.endingTime !== ''){
  //         day.endingTimes = moment(day.endingTime).format('LT');
  //       }
  //       index = index + 1;
  //       return (
  //         day
  //       );
  //     }

  //     )
  // }


  handleOption = (summary,option) => (event) => {
    emitter.emit("summaryMsg", summary.weekEnding)
    if(option === 'view'){
      this.props.delivery('view',summary.weekEnding)
      console.log('view',summary.weekEnding)
      this.props.goto('2');
    } else {
      this.props.delivery('edit',summary.weekEnding)
      console.log('edit',summary.weekEnding)
      this.props.goto('2');
    }

  };

  // renderTableData =() => {
    
  //   return this.state.summarys
  //     .slice(0, this.state.count)
  //     .map((summary, index) => {
  //       if (summary.submissionStatus === "Completed") {
  //         summary.option = (
  //           <a onClick={this.handleOption(summary,'view')}>
  //           {" "}
  //           View
  //         </a>
  //         );
  //       } else if (summary.submissionStatus === "Incomplete") {
  //         summary.option = (
  //           <a onClick={this.handleOption(summary,'edit')}>
  //             {" "}
  //             Edit
  //           </a>
  //         );
  //       } else {
  //         summary.option = (
  //           <a onClick={this.handleOption(summary,'edit')}>
  //             {" "}
  //             Start
  //           </a>
  //         );
  //       }
  //       return (
  //         summary
  //       );
  //     });
  // }

    render() {
        return (
            <div>
                <Table columns={this.state.summarycolumns} dataSource={this.renderRawData()}  pagination={{ position: ['none', 'none'] }}/>
                <Button type="primary" shape="round" onClick={this.handleShowMore}>
                {this.state.show}
                </Button>
            </div>
        )
        
    }
}
