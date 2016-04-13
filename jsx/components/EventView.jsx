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
import FeedInput from './FeedInput';
import Modal from "./Modal";
import InviteTableWidget from "./InviteTableWidget";
import webSocket from '../websocket/socket';
import CreateEventForm from './CreateEventForm';
import UserWidget from './UserWidget';
export default class EventView extends Component {
  constructor(props){
    super(props);
    this.state = {
      'event' : eventsStore.getCurrentEvent(),
      'files' : [],
      'stats' : null,
      'checkIns' : null,
      'user' : null,
      'feed' : [],
      'managers' : [],
      'message' : "",
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
    webSocket.subscribe(this.state.event.id);
    this.state.eventStatsListener = statsStore.addListener(statsConstants.EVENT_STATS_RETRIEVED, this.updateStats.bind(this));
    this.state.deleteListener = eventsStore.addListener(eventsConstants.EVENT_DELETED, navActions.routeToPage.bind(this));
    this.state.getEventCheckInsListener = eventsStore.addListener(eventsConstants.EVENT_CHECKINS_RETRIEVED, this.updateCheckIns.bind(this));
    this.state.eventFilesListener = eventsStore.addListener(eventsConstants.EVENT_FILES_RETRIEVED, this.updateEventFiles.bind(this));
    this.state.refreshListener = navStore.addListener(navConstants.REFRESH, this.refreshView.bind(this));
    this.state.eventMessageListener = eventsStore.addListener(eventsConstants.EVENT_MESSAGE_RECEIVED, this.setFeed.bind(this));
    this.state.eventFeedListener = eventsStore.addListener(eventsConstants.EVENT_FEED_RETRIEVED, this.setFeed.bind(this));
    this.state.userListener = eventsStore.addListener(eventsConstants.USER_RETRIEVED, this.showUser.bind(this));
    this.refreshView();
    $('.banner').error(this.onBannerError.bind(this));
    $('.thumbnail').error(this.onThumbnailError.bind(this));
  }
  showUser(){
    console.log('called');
    let state = this.state;
    state.user = eventsStore.getCurrentUser();
    this.setState(state);
  }
  setFeed(){
    console.log('feed set');
    let state = this.state;
    state.feed = eventsStore.getEventFeed();
    console.log(state.feed);
    this.setState(state);
  }
  refreshView(){
    console.log('refreshing');
    var state = this.state;
    state.event = eventsStore.getCurrentEvent();
    statsActions.getEventStats(state.event.id);
    eventActions.getEventCheckIns(state.event.id);
    setTimeout(() => {
      eventActions.getEventFiles(state.event.id);
      eventActions.getEventFeed(state.event.id);
    },1500);
    this.setState(state);

  }
  updateEventFiles(){
    let state = this.state;
    state.files = eventsStore.getEventFiles();
    this.setState(state);
  }
  componentWillUnmount(){
    webSocket.unsubscribe(this.state.event.id);
    this.state.eventStatsListener.remove();
    this.state.deleteListener.remove();
    this.state.getEventCheckInsListener.remove();
    this.state.eventFilesListener.remove();
    this.state.refreshListener.remove();
  }
  handleEventUpdated(){
    eventActions.setUpdateFlag(true);
    // open modal here
      setTimeout(()=>{
        window.dispatchEvent(new Event('resize'));
      },500);
      $('#updateModal').modal('show');
    }

  handleDeleteButtonClick(){
    console.log(this.state.event.id);
    this.state.event.eventID = this.state.event.id;
    $('#deleteModal').modal('hide');
    $('#manageModal').modal('hide');
    eventActions.deleteEvent({'eventID': this.state.event.eventID});

  }
  openDeleteModal(){
      console.log("this was called");
      setTimeout(()=>{
        window.dispatchEvent(new Event('resize'));
      },500);
      $('#deleteModal').modal('show');
    }
  handleChangedMind(){
    console.log("ok");
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
  openFeedModal(){
    $('#feedModal').modal('show');
  }
  openManageModal(){
      console.log("this was called");
      setTimeout(()=>{
        window.dispatchEvent(new Event('resize'));
      },500);
      $('#manageModal').modal('show');
    }
  handleInvites(){
    console.log("invites will be mailed");
  }
  navToManageView(){
    navActions.routeToPage('manage');
  }
  render(){
    const {event, files, stats, checkIns, chartOptions, feed, managers} = this.state;
    console.log(managers);
    console.log('about to render');
    console.log(event);
    console.log(files);
    let view, checkInWidget, inviteWidget, invitedCheckInsWidget, eventFeed, checkInChart,
      lineWidget, fileWidget, descriptionWidget, feedWidget, feedInput,  manageButton;
    let privacy = "public";
    if(event != null){
      descriptionWidget = (
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
      );
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
            <div className="col-sm-6 col-md-4 ">
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
          <div className="col-sm-6 col-md-4 ">
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
          <div className='col-sm-6 col-md-4 '>
            <TickerWidget value={stats.checkInStats.checkedIn}/>
          </div>
        );
      }
      // regardless of whether the event is private or not
      if(stats !== null){
        if(statsStore.getUserStats().userType === 'admin' || stats.userIsManager){
          feedInput = (<FeedInput eventID={this.state.event.id}/>);
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
      checkInChart = (<Chart id='checkInLineChart' header='Check Ins' type='scatter' chartData={lineData}/>);
      lineWidget = (
        <div className="col-sm-6 col-md-4 ">
          <div className='widget animated fadeInDown'>
            <div className='widget-header'>
              <i className="fa fa-user"></i>
              Check In Chart
               <a className="btn btn-primary btn-sm pull-right text-center" onClick={this.openChartModal.bind(this)}>
                <i className="fa fa-cog fa-lg"></i> Expand
               </a>
            </div>
            <div className='widget-body medium no-padding'>
              {checkInChart}
            </div>
          </div>
        </div>
      )

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
          <div className="col-sm-6 col-md-4 ">
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
      if(feed.length === 0){
        eventFeed = (
          <div className='text-center'>
            <h4>No messages have been published to the Event Feed</h4>
          </div>
        );
      }
      else{
        eventFeed = (
          <div>
            {feed.map((data) => {
              return (
                <blockquote className='animated fadeInLeft' key={data.id}>
                  <p className='text-size-medium'>{data.message.content}</p>
                  <footer>{data.posterName} on {moment(data.datePosted).format('LLL')}</footer>
                </blockquote>
              );
            })}
          </div>
        );
      }
      feedWidget = (
        <div className="col-sm-6 col-md-4">
          <div className='widget'>
            <div className='widget-header'>
              <i className="fa fa-user"></i>
              Event Feed
               <a className="btn btn-primary btn-sm pull-right text-center" onClick={this.openFeedModal.bind(this)}>
                <i className="fa fa-cog fa-lg"></i> Expand
              </a>
            </div>
            <div className='widget-body medium no-padding'>
              {eventFeed}
            </div>
          </div>
        </div>
      );
      view = (
        <div className="animated fadeInUp">
          <div className="event-container">
            <div className="update-button">
                <button className= "btn btn-primary pull-right" onClick={this.navToManageView.bind(this)}> Manage Event
                {this.props.event}</button>
            </div>
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
          {descriptionWidget}
          {feedWidget}
          {fileWidget}
          {checkInWidget}
          {inviteWidget}
          {lineWidget}
        </div>
      );
    }
    /*
    <div className="col-sm-6 col-md-4 ">
        {invitedCheckInsWidget}
    </div>
    */
    console.log('about to complete render');
    let userModalContent = (
      <div>
        <div>Empty</div>
      </div>
    );
    if(this.state.user !== null){
      console.log(this.state.user);
      let image = '/img/avatar.jpg';
      if(this.state.user.res.images !== undefined)
        image = this.state.user.res.images.profile[0].ref.x200;
      userModalContent = (
        <div className='text-center'>
          <h2>{this.state.user.res.general.name[0].value}</h2>
          <img src={image} width='200px' height='200px'></img>
          <h4>Email: {this.state.user.res.primaryContactInfo.email[0].ref}</h4>
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
        <Modal id='scatterChartModal' title="Check In Chart" size='modal-lg'>
          <div id='chartHolder' style={{'width' : '100%', 'height' : '400px'}}>
            {checkInChart}
          </div>
        </Modal>
        <Modal id='feedModal' title='Event Feed'>
          {feedInput}
          <div className='feedHolder'>
            {eventFeed}
          </div>
        </Modal>
        <Modal id="manageModal" title = "Manage Events">
            <div id='selectManage' style={{'width' : '100%', 'height' : '400px'}}>
              <div>
                <button className = "btn btn-primary btn-sm pull-left text-center" type = "button" onClick = {this.openDeleteModal.bind(this)}>Delete Event</button>
                <button className = "btn btn-primary btn-sm text-center" type = "button" onClick = {this.handleEventUpdated.bind(this)}>Update Event</button>
                  <div>The purpose of this modal is to allow for management of events</div>
                  <div>
                    Please attend the events you are asked to attend.
                  </div>
                  <InviteTableWidget/>
                  <button className="btn btn-primary btn-sm pull-right text-center" type = "button" onClick = {this.handleInvites.bind(this)}>Invite Org Attendees</button>
                </div>
            </div>

        </Modal>
        <Modal id="deleteModal" title = "Delete Event">
            <div id='selectDelete' style={{'width' : '100%', 'height' : '50px'}}>
              <div>
                <div> Do you want to delete this event?</div>
                <button className = "btn btn-primary btn-sm pull-left text-center" type = "button" onClick = {this.handleDeleteButtonClick.bind(this)}>Yes</button>
                <button className = "btn btn-primary btn-sm pull-left text-center" type = "button" onClick = {this.handleChangedMind()}>NO</button>
              </div>
            </div>
        </Modal>
        <Modal id="userModal" title = "User">
          {userModalContent}
        </Modal>
      </div>
    );
  }
}

/*

*/
