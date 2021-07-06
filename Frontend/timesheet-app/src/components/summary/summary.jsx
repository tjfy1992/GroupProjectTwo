import React, { Component } from 'react'
import {Popover, Button, Table, Tag, Space, Badge,Tooltip} from 'antd';
import {InfoCircleTwoTone} from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';


const columns = [
  {
    title: 'WeekEnding',
    dataIndex: 'weekEnding',
    key: 'weekEnding',

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
          if (submissionStatus === 'Incomplete' && record.approvalStatus === 'N/A') {
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
        text: 'N/A',
        value: 'N/A',
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
      let color = approvalStatus.length === 3 ? 'gray' : 'green';
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
      var fcomment = record.usedfloatingday+' floating days required\r';
      var vcomment = record.usedvacationday+' vacation days required\r';
      var hcomment = record.holiday+' holidays included\r';
      var freminder = 'Total floating days left ' + fdayleft +' days\r';
      var vreminder = 'Total vacation days left ' + vdayleft +' days\r';
      finalreminder += record.usedfloatingday == 0? '':freminder+'. ';
      finalreminder += record.usedvacationday == 0? '':vreminder+'. ';
      finalcomment += record.usedfloatingday == 0? '':fcomment+'. ';
      finalcomment += record.usedvacationday == 0? '':vcomment+'. ';
      finalcomment += record.holiday === 0? '':hcomment+'. ';
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
      count: 1,
      show: "Show More",
      userInfos: [],
    };
  }


  
    handleShowMore = () => {
      if (this.state.tempsummarys.length - this.state.count < 2 && this.state.count !== this.state.tempsummarys.length ) {
        this.setState({
          count: this.state.tempsummarys.length,
          show: "Hide All",
        });
      } else if(this.state.count === this.state.tempsummarys.length){
        this.setState({
          count: 1,
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
    
    console.log(this.renderRawData());

  }

  renderRawData =() =>{
    var arys = [];
    this.state.tempsummarys
      .slice(0, this.state.count)
      .forEach((sheet,index) => {
        var ary = {Year: '',weekEnding : "", totalHours : 0, submissionStatus : '', approvalStatus : '', option : '', usedfloatingday: 0, holiday :'', usedvacationday : 0};
        ary.Year = sheet.year;
        ary.usedfloatingday = 3-sheet.remainingFloatingDays;
        ary.holiday = 0;
        ary.usedvacationday = 3-sheet.remainingVacationDays;
        if(sheet.submissionStatus != undefined){
          ary.submissionStatus = sheet.submissionStatus;
        } else {
          ary.submissionStatus = 'Incomplete';
        }
        if(sheet.approvalStatus != undefined){
          ary.approvalStatus = sheet.approvalStatus;
        } else {
          ary.approvalStatus = 'Not approved';
        }
        if (ary.submissionStatus === "Completed") {
          ary.option = (
            <a onClick={this.handleOption(sheet,'view')}>
            {" "}
            View
          </a>
          );
        } else if (ary.submissionStatus === "Incomplete") {
          ary.option = (
            <a onClick={this.handleOption(sheet,'edit')}>
              {" "}
              Edit
            </a>
          );
        } else {
          ary.option = (
            <a onClick={this.handleOption(sheet,'edit')}>
              {" "}
              Start
            </a>
          );
        }
        sheet.weeks.forEach((week,index) => {
          console.log(week);
          if(week.weekEnding != undefined){
            ary.weekEnding = moment(week.weekEnding).format('MM/DD/YYYY');
          } 
          if (week.sunday.startingTime.value != undefined){
            var tempend = new Date(moment(week.sunday.endingTime.value));
            var tempstart = new Date(moment(week.sunday.startingTime.value));
            ary.totalHours += tempend.getHours()-tempstart.getHours();;
          }
          if (week.monday.startingTime.value != undefined){
            var tempend = new Date(moment(week.monday.endingTime.value));
            var tempstart = new Date(moment(week.monday.startingTime.value));
            ary.totalHours += tempend.getHours()-tempstart.getHours();
          }
          if (week.tuesday.startingTime.value != undefined){
            var tempend = new Date(moment(week.tuesday.endingTime.value));
            var tempstart = new Date(moment(week.tuesday.startingTime.value));
            ary.totalHours += tempend.getHours()-tempstart.getHours();
          }
          if (week.wednesday.startingTime.value != undefined){
            var tempend = new Date(moment(week.wednesday.endingTime.value));
            var tempstart = new Date(moment(week.wednesday.startingTime));
            ary.totalHours += tempend.getHours()-tempstart.getHours();
          }
          if (week.thursday.startingTime.value != undefined){
            var tempend = new Date(moment(week.thursday.endingTime));
            var tempstart = new Date(moment(week.thursday.startingTime));
            ary.totalHours += tempend.getHours()-tempstart.getHours();
          }
          if (week.friday.startingTime.value != undefined){
            var tempend = new Date(moment(week.friday.endingTime));
            var tempstart = new Date(moment(week.friday.startingTime));
            ary.totalHours += tempend.getHours()-tempstart.getHours();
          }
          if (week.saturday.startingTime.value != undefined){
            var tempend = new Date(moment(week.saturday.endingTime));
            var tempstart = new Date(moment(week.saturday.startingTime));
            ary.totalHours += tempend.getHours()-tempstart.getHours();
          }
          index += 1;
          return (week,ary.totalHours);
        })
        console.log(index);
        arys.push(ary)
        return (
          sheet
        );
    return;

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
    console.log(summary.weekEnding);
    if(option === 'view'){
      this.props.delivery('view',summary.weekEnding)
      this.props.goto('2');
    } else {
      this.props.delivery('edit',summary.weekEnding)
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
