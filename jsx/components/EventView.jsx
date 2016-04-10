"use strict";
import React, { Component } from "react";

import * as eventActions from "../actions/eventActions";
import * as statsActions from "../actions/statsActions";
import * as navActions from "../actions/navActions";
import eventsStore from "../stores/eventsStore";
import eventsConstants from "../constants/eventsConstants";
import statsStore from "../stores/statsStore";
import navStore from "../stores/navStore";
import navConstants from "../constants/navConstants";
import statsConstants from "../constants/statsConstants";
import Chart from "./Chart";
import TickerWidget from "./TickerWidget";
import Modal from "./Modal";
import InviteTableWidget from "./InviteTableWidget";

export default class EventView extends Component {
  constructor(props){
    super(props);
    this.state = {
      'event' : eventsStore.getCurrentEvent(),
      'files' : [],
      'stats' : null,
      'checkIns' : null,
      'chartOptions' : {
        'segmentShowStroke' : true,
        'segmentStrokeColor' : '#fff',
        'segmentStrokeWidth' : 2,
        'animationEasing' : 'easeOutBounce',
        'animateRotate' : true,
        'animateScale' : false,
        'maintainAspectRatio': false,
        'responsive': true,
        'scaleType' : 'date',
        'bezierCurveTension' : 0.1,
        'useUTC' : false,
        'scaleStartValue' : 1
      }
    };
  }
  componentDidMount(){
    console.log('current event in event view');
    console.log(this.state.event);

    this.state.eventStatsListener = statsStore.addListener(statsConstants.EVENT_STATS_RETRIEVED, this.updateStats.bind(this));
    this.state.eventsStoreListener = eventsStore.addListener(eventsConstants.EVENT_DELETED, navActions.routeToPage.bind(this));
    this.state.getEventCheckInsListener = eventsStore.addListener(eventsConstants.EVENT_CHECKINS_RETRIEVED, this.updateCheckIns.bind(this));
    this.state.eventFilesListener = eventsStore.addListener(eventsConstants.EVENT_FILES_RETRIEVED, this.updateEventFiles.bind(this));
    this.state.refreshListener = navStore.addListener(navConstants.REFRESH, this.refreshView.bind(this));
    this.refreshView();
    $('.banner').error(this.onBannerError.bind(this));
    $('.thumbnail').error(this.onThumbnailError.bind(this));
  }
  refreshView(){
    console.log('refreshing');
    var state = this.state;
    state.event = eventsStore.getCurrentEvent();
    this.setState(state);
    statsActions.getEventStats(this.state.event.id);
    eventActions.getEventCheckIns(this.state.event.id);
    eventActions.getEventFiles(this.state.event.id);
  }
  updateEventFiles(){
    let state = this.state;
    state.files = eventsStore.getEventFiles();
    this.setState(state);

  }
  componentWillUnmount(){
    this.state.eventStatsListener.remove();
    this.state.eventsStoreListener.remove();
    this.state.getEventCheckInsListener.remove();
    this.state.eventFilesListener.remove();
  }
  handleEventUpdated(page){
    eventActions.setUpdateFlag(true);
    navActions.routeToPage("create");
  }
  handleEditButtonClicked(){

  }
  handleDeleteButtonClick(){
    eventActions.deleteEvent({'eventID': this.state.event.id});
  }
  onBannerError(){
    let state = this.state;
    state.event.imageUrl = 'https://unsplash.it/1920/1080';
    this.setState(state);
  }
  onThumbnailError(){
    let state = this.state;
    state.event.thumbnailUrl = 'https://unsplash.it/400/400';
    this.setState(state);
  }

  updateStats(){
    let state = this.state;
    state.stats = statsStore.getEventStats();
    this.setState(state);
  }
  updateCheckIns(){
    let state = this.state;
    state.checkIns = eventsStore.getCheckIns();
    this.setState(state);
  }
  openDescModal(){
    $('#descriptionModal').modal('show');
  }
  openChartModal(){
    setTimeout(()=>{
      window.dispatchEvent(new Event('resize'));
    },500);
    $('#scatterChartModal').modal('show');
  }

  render(){
    let {event, files, stats, checkIns, chartOptions} = this.state;
    console.log('about to render');
    console.log(event);
    console.log(files);
    let view, checkInWidget, inviteWidget, invitedCheckInsWidget, lineWidget, fileWidget, manageButton;
    let privacy = "public";

    if(event != null){
      if(event.private && stats != null){
        privacy = "private";
        let chartData = [{
            name: 'Percentage',
            colorByPoint: true,
            data: [
              {
                name: 'Not Checked In',
                y: stats.checkInStats.notCheckedIn
              },
              {
                name: 'Checked In',
                y: stats.checkInStats.checkedIn,
                sliced: true,
                selected: true
              }
            ]
        }];
        if(stats.inviteStats !== undefined){
          let inviteData = [{
              name: 'Percentage',
              colorByPoint: true,
              data: [
                {
                  name: 'Yes',
                  y: stats.inviteStats.yes,
                  sliced: true,
                  selected: true
                },
                {
                  name: 'No',
                  y: stats.inviteStats.no
                },
                {
                  name: 'Maybe',
                  y: stats.inviteStats.maybe
                },
                {
                  name: 'Pending',
                  y: stats.inviteStats.unknown,
                  sliced: true,
                  selected: true
                }
              ]
          }];
          invitedCheckInsWidget = (
              <InviteTableWidget />
          );
          inviteWidget = (
            <div className="col-sm-6 col-md-4">
              <div className='widget'>
                <div className='widget-header'>
                  Invite Pie Chart
                </div>
                <div className='widget-body medium no-padding'>
                    <Chart id='invitePieChart' type='doughnut' chartData={inviteData}/>
                </div>
              </div>
            </div>
          );
        }
        checkInWidget = (
          <div className="col-sm-6 col-md-4">
            <div className='widget'>
              <div className='widget-header'>
                Check In Pie Chart
              </div>
              <div className='widget-body medium no-padding'>
                  <Chart id='checkInPieChart' chartData={chartData}/>
              </div>
            </div>
          </div>
        );
      }
      else if(stats !== null){ // public, so show ticker instead
        checkInWidget = (
          <div className='col-sm-6 col-md-4'>
            <TickerWidget value={stats.checkInStats.checkedIn}/>
          </div>
        );
      }
      if(stats !== null){
        console.log(stats);
        if(stats.userType === 'admin' || stats.userIsManager){
          manageButton = (
            <div className="update-button">
              <button className= "btn btn-primary pull-right" onClick={this.handleEventUpdated.bind(this, "create")}> Update Event
              {this.props.event}</button>
            </div>
          );
        }
      }

      let lineData = {
        data : []
      };
      if(checkIns !== null){
        let count = 1;
        checkIns.forEach((checkIn) => {
          if(checkIn.timestamp !== undefined){
            lineData.data.push([
              new Date(checkIn.timestamp).getTime() / 1000, count
            ]);
          }
          count++;
        });
      }
      lineWidget = (<Chart id='checkInLineChart' header='Check Ins' type='scatter' chartData={lineData}/>)
      event.imageUrl = event.imageUrl || 'https://unsplash.it/1920/1080';
      event.thumbnailUrl = event.thumbnailUrl || 'https://unsplash.it/1920/1080';
      if(files.length > 0){
        var rows = [];
        files.forEach((file)=> {
          rows.push(
            <tr className='animated fadeInLeft' key={file.title}>
              <td><a href={file.url} download>{file.fileName}</a></td>
              <td>{moment(file.uploadDate).format('LL')}</td>
            </tr>
          )
        })
        fileWidget = (
          <div className="col-sm-6 col-md-4">
            <div className='widget'>
              <div className='widget-header'>
                Event Files
              </div>
              <div className='widget-body medium no-padding'>
                <table className='table table-hover'>
                  <thead>
                    <tr>
                      <th>File Name</th>
                      <th>Upload Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      }
      view = (
        <div className="animated fadeInUp">
          <div className="event-container">
            {manageButton}
            <img className="banner" src={event.imageUrl} onerror="console.log('error')"></img>
            <div className="row">
              <div className="event-details-container">
                <div className="pull-left thumbnail-container">
                  <img className="thumbnail"  src={event.thumbnailUrl}></img>
                </div>
                <div className="event-details">
                  <div className="title">
                    <h4 className='word-break-all'>{event.title}</h4>
                    <p>Start Date: {moment(event.startDate).format('LLL')}</p>
                    <p>End Date: {moment(event.endDate).format('LLL')}</p>
                    <p className='word-break-all'>Location: {event.location}</p>
                    <p>This event is {privacy}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {fileWidget}
          <div className="col-sm-6 col-md-4">
            <div className="widget">
              <div className="widget-header">
                <i className="fa fa-user"></i>
                Description
                 <a className="btn btn-primary btn-sm pull-right text-center" onClick={this.openDescModal.bind(this)}>
                  <i className="fa fa-cog fa-lg"></i> Expand
                </a>
              </div>
              <div className="widget-body medium no-padding">
                <div className="text-body">
                  <p>
                    {event.description.split('\n').map((item) => {
                      return <span>{item}<br/></span>
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {checkInWidget}
          {inviteWidget}
          <div className="col-sm-6 col-md-4">
            <div className='widget'>
              <div className='widget-header'>
                <i className="fa fa-user"></i>
                Check In Chart
                 <a className="btn btn-primary btn-sm pull-right text-center" onClick={this.openChartModal.bind(this)}>
                  <i className="fa fa-cog fa-lg"></i> Expand
                </a>
              </div>
              <div className='widget-body medium no-padding'>
                  {lineWidget}
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-md-4">
              {invitedCheckInsWidget}
          </div>
          <div className="delete-button">
            <button className= "btn btn-primary pull-right" onClick={this.handleDeleteButtonClick.bind(this)}> Delete Event
            </button>
          </div>
        </div>
      );
    }
    return(
      <div>
        {view}
        <Modal id='descriptionModal' title="Event Description">
          {event.description.split('\n').map((item) => {
            return <span>{item}<br/></span>
          })}
        </Modal>
        <Modal id='scatterChartModal' title="Check In Chart">
          <div id='chartHolder' style={{'width' : '100%', 'height' : '400px'}}>
            {lineWidget}
          </div>
        </Modal>
        <Modal id='editModal' title='Event Settings'>

        </Modal>
      </div>
    );
  }
}
