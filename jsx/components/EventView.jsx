"use strict";
import React, { Component } from "react";
import i18next from 'i18next';
import * as eventActions from "../actions/eventActions";
import * as statsActions from "../actions/statsActions";
import * as navActions from "../actions/navActions";
import eventsStore from "../stores/eventsStore";
import eventDetailsStore from "../stores/eventDetailsStore";
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
import FileWidget from './FileWidget';
import EventFeed from './EventFeed';
import EmbeddedMap from './EmbeddedMap';
import CheckInTable from './CheckInTable';
import Histogram from './Histogram';
export default class EventView extends Component {
  constructor(props){
    super(props);
    this.state = {
      'event' : eventDetailsStore.getCurrentEvent(),
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
  // on mount, add all of the listeners needed for the view to function
  componentDidMount(){
    console.log('mounting the event view');
    this.addListeners();
    console.log(this.state.event);
    this.refreshView();
  }
  addListeners(){
    webSocket.subscribe(this.state.event.id);
    this.state.eventStatsListener = statsStore.addListener(statsConstants.EVENT_STATS_RETRIEVED, this.updateStats.bind(this));
    this.state.deleteListener = eventsStore.addListener(eventsConstants.EVENT_DELETED, navActions.routeToPage.bind(this));
    this.state.getEventCheckInsListener = eventDetailsStore.addListener(eventsConstants.EVENT_CHECKINS_RETRIEVED, this.updateCheckIns.bind(this));
    this.state.eventFilesListener = eventDetailsStore.addListener(eventsConstants.EVENT_FILES_RETRIEVED, this.updateEventFiles.bind(this));
    this.state.refreshListener = navStore.addListener(navConstants.REFRESH, this.remount.bind(this));
    this.state.eventMessageListener = eventDetailsStore.addListener(eventsConstants.EVENT_MESSAGE_RECEIVED, this.setFeed.bind(this));
    this.state.eventFeedListener = eventDetailsStore.addListener(eventsConstants.EVENT_FEED_RETRIEVED, this.setFeed.bind(this));
    this.state.userListener = eventDetailsStore.addListener(eventsConstants.USER_RETRIEVED, this.showUser.bind(this));
    this.state.messageRemovedListener = eventDetailsStore.addListener(eventsConstants.EVENT_MESSAGE_REMOVED, this.setFeed.bind(this));
    this.state.bulkCheckInsListener=
      eventDetailsStore.addListener(eventsConstants.NEW_CHECKINS_AVAILABLE, this.retrieveCheckIns.bind(this));
    this.state.incomingCheckInListener =
      eventDetailsStore.addListener(eventsConstants.NEW_CHECKIN_RETRIEVED, this.updateCheckIns.bind(this, true));
    $('.banner').error(this.onBannerError.bind(this));
    $('.thumbnail').error(this.onThumbnailError.bind(this));
    console.log(this.state);
    this.setState(this.state);
  }
  removeListeners(){
    console.log('removing listeners');
    webSocket.unsubscribe(this.state.event.id);
    // old
    this.state.eventStatsListener.remove();
    this.state.deleteListener.remove();
    this.state.getEventCheckInsListener.remove();
    this.state.eventFilesListener.remove();
    this.state.refreshListener.remove();
    this.state.eventMessageListener.remove();
    this.state.eventFeedListener.remove();
    this.state.userListener.remove();
    this.state.messageRemovedListener.remove();
    this.state.bulkCheckInsListener.remove()
    this.state.incomingCheckInListener.remove();
    this.setState(this.state);
  }
  showUser(){
    console.log('called');
    let state = this.state;
    state.user = eventDetailsStore.getCurrentUser();
    this.setState(state);
  }
  retrieveCheckIns(){
    console.log('Retrieving more checkins');
    console.log(this.state.event);
    eventActions.getEventCheckIns(this.state.event.id);
    statsActions.getEventStats(this.state.event.id);
  }
  setFeed(){
    console.log('feed set');
    let state = this.state;
    state.feed = eventDetailsStore.getEventFeed();
    console.log(state.feed);
    this.setState(state);
  }
  remount(){
    this.removeListeners();
    this.state.event = eventDetailsStore.getCurrentEvent();
    this.addListeners();
    this.refreshView();
  }
  refreshView(){
    console.log('refreshing');
    var state = this.state;
    state.event = eventDetailsStore.getCurrentEvent();
    state.stats = null;
    state.files = [];
    state.feed = [];
    state.managers = [];
    state.message = '';
    state.checkIns = null;
    this.setState(state);
    console.log(state.event.id);
    statsActions.getEventStats(state.event.id);
    eventActions.getEventCheckIns(state.event.id);
    setTimeout(() => {
      eventActions.getEventFiles(state.event.id);
      eventActions.getEventFeed(state.event.id);
    },1500);
  }
  updateEventFiles(){
    let state = this.state;
    state.files = eventDetailsStore.getEventFiles();
    this.setState(state);
  }
  componentWillUnmount(){
    console.log('unmounting the event view');
    this.removeListeners();
  }
  handleEventUpdated(){
    eventActions.setUpdateFlag(true);
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
    console.log('new stats came up')
    let state = this.state;
    state.stats = statsStore.getEventStats();
    this.setState(state);
  }

  updateCheckIns(increment){
    let state = this.state;
    state.checkIns = eventDetailsStore.getCheckIns();
    if(increment){
      state.stats.checkInStats.checkedIn++;
    }
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
  openMapModal(){
    $('#mapModal').modal('show');
  }
  openCheckInModal(){
    $('#checkInModal').modal('show');
  }
  navToManageView(){
    navActions.routeToPage('manage');
  }
  openHistogramModal(){
    setTimeout(()=>{
      window.dispatchEvent(new Event('resize'));
    },500);
    $('#histogramModal').modal('show');
  }
  render(){
    const {event, files, stats, checkIns, chartOptions, feed, managers} = this.state;
    console.log(managers);
    console.log('about to render');
    console.log(event);
    console.log(files);
    let view, checkInWidget, checkInTable, tickerWidget, checkInPieChart, invitePieChart, mapWidget, eventFeed, checkInChart,
      lineWidget, barWidget, histogram, fileWidget, descriptionWidget, feedWidget, feedInput,  manageButton;
    let privacy = i18next.t('PUBLIC_EVENT');
    if(event != null){
      descriptionWidget = (
        <div className="col-sm-6 col-md-4">
          <div className="widget">
            <div className="widget-header">
              <i className="fa fa-user"></i>
              {i18next.t('DESCRIPTION')}
               <a className="btn btn-primary btn-sm pull-right text-center" onClick={this.openDescModal.bind(this)}>
                <i className="fa fa-cog fa-lg"></i> {i18next.t('EXPAND')}
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
        privacy = i18next.t("PRIVATE_EVENT");
        let chartData = [{
            name: i18next.t('PERCENTAGE'),
            colorByPoint: true,
            data: [
              {
                name: i18next.t('NOT_CHECKED_IN'),
                y: stats.checkInStats.notCheckedIn
              },
              {
                name: i18next.t('CHECKED_IN'),
                y: stats.checkInStats.checkedIn,
                sliced: true,
                selected: true
              }
            ]
        }];
        if(stats.inviteStats !== undefined){
          let inviteData = [{
              name: i18next.t('PERCENTAGE'),
              colorByPoint: true,
              data: [
                {
                  name: i18next.t('YES'),
                  y: stats.inviteStats.yes,
                  sliced: true,
                  selected: true
                },
                {
                  name: i18next.t('NO'),
                  y: stats.inviteStats.no
                },
                {
                  name: i18next.t('MAYBE'),
                  y: stats.inviteStats.maybe
                },
                {
                  name: i18next.t('PENDING'),
                  y: stats.inviteStats.unknown,
                  sliced: true,
                  selected: true
                }
              ]
          }];
          invitePieChart = (
            <div className="col-sm-6 col-md-4 ">
              <div className='widget'>
                <div className='widget-header'>
                  {i18next.t('INVITE_PIE_CHART')}
                </div>
                <div className='widget-body medium no-padding'>
                    <Chart id='invitePieChart' type='doughnut' chartData={inviteData}/>
                </div>
              </div>
            </div>
          );
        }
        checkInPieChart = (
          <div className="col-sm-6 col-md-4 ">
            <div className='widget'>
              <div className='widget-header'>
                {i18next.t('CHECK_IN_PIE_CHART')}
              </div>
              <div className='widget-body medium no-padding'>
                  <Chart id='checkInPieChart' chartData={chartData}/>
              </div>
            </div>
          </div>
        );
      }
      // regardless of whether the event is private or not
      if(stats !== null){
        tickerWidget = (
          <div className='col-sm-6 col-md-4'>
            <TickerWidget id={'a'+event.id} value={stats.checkInStats.checkedIn}/>
          </div>
        );
        if(statsStore.getUserStats().userType === 'admin' || stats.userIsManager){
          feedInput = (<FeedInput eventID={this.state.event.id}/>);
          manageButton = (
            <button className= "btn btn-primary pull-right" onClick={this.navToManageView.bind(this)}>
              {i18next.t('MANAGE_EVENT')}
            </button>
          );
        }
      }
      let lineData = {
        data : []
      };
      if(checkIns !== null){
        let count = 1;
        histogram = <Histogram checkIns={checkIns}/>;
        //timeseries = <Timeseries checkIns={checkIns}/>
        barWidget = (
          <div className="col-sm-6 col-md-4">
            <div className='widget'>
              <div className='widget-header'>
                <i className="fa fa-map"></i>
                {i18next.t('Check In Histogram')}
                 <a className="btn btn-primary btn-sm pull-right text-center" onClick={this.openHistogramModal.bind(this)}>
                  <i className="fa fa-cog fa-lg"></i> {i18next.t('EXPAND')}
                </a>
              </div>
              <div className='widget-body medium no-padding'>
                {histogram}
              </div>
            </div>
          </div>
        );
      }
      checkInWidget = (
        <div className="col-sm-6 col-md-4 ">
          <div className='widget animated fadeInDown'>
            <div className='widget-header'>
              <i className="fa fa-user"></i>
              {i18next.t('EVENT_CHECK_INS')}
               <a className="btn btn-primary btn-sm pull-right text-center" onClick={this.openCheckInModal.bind(this)}>
                <i className="fa fa-cog fa-lg"></i> {i18next.t('EXPAND')}
               </a>
            </div>
            <div className='widget-body medium no-padding'>
              <CheckInTable checkIns={checkIns}/>
            </div>
          </div>
        </div>
      );
      event.imageUrl = event.imageUrl || 'https://unsplash.it/1920/1080';
      event.thumbnailUrl = event.thumbnailUrl || 'https://unsplash.it/1920/1080';
      if(files.length > 0){
        fileWidget = (
          <div className='col-sm-6 col-md-4'>
            <FileWidget files={files} size='medium'/>
          </div>
        );
      }
      if(feed.length === 0){
        eventFeed = (
          <div className='text-center'>
            <h5>{i18next.t('NO_EVENT_FEED_MESSAGES')}</h5>
          </div>
        );
      }
      else{
        eventFeed = (
          <EventFeed feed={feed}
            managerAccess={statsStore.getUserStats().userType === 'admin' || stats.userIsManager}/>
        );
      }
      feedWidget = (
        <div className="col-sm-6 col-md-4">
          <div className='widget'>
            <div className='widget-header'>
              <i className="fa fa-user"></i>
              {i18next.t('EVENT_FEED')}
               <a className="btn btn-primary btn-sm pull-right text-center" onClick={this.openFeedModal.bind(this)}>
                <i className="fa fa-cog fa-lg"></i> {i18next.t('EXPAND')}
              </a>
            </div>
            <div className='widget-body medium no-padding'>
              {eventFeed}
            </div>
          </div>
        </div>
      );
      mapWidget = (
        <div className="col-sm-6 col-md-4">
          <div className='widget'>
            <div className='widget-header'>
              <i className="fa fa-map"></i>
              {i18next.t('Event Location')}
               <a className="btn btn-primary btn-sm pull-right text-center" onClick={this.openMapModal.bind(this)}>
                <i className="fa fa-cog fa-lg"></i> {i18next.t('EXPAND')}
              </a>
            </div>
            <div className='widget-body medium no-padding'>
              <EmbeddedMap location={event.location}/>
            </div>
          </div>
        </div>
      );
      view = (
        <div className="animated fadeInUp">
          <div className="event-container">
            <div className="update-button">
              {manageButton}
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
                    <p>{i18next.t('START_DATE')} {moment(event.startDate).format('LLL')}</p>
                    <p>{i18next.t('END_DATE')} {moment(event.endDate).format('LLL')}</p>
                    <p className='word-break-all'>Location: {event.location}</p>
                    <p>{privacy}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {descriptionWidget}
          {mapWidget}
          {feedWidget}
          {fileWidget}
          {tickerWidget}
          {checkInPieChart}
          {invitePieChart}
          {checkInWidget}
          {barWidget}
        </div>
      );
      //          {lineWidget}
    }
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

        <Modal id='feedModal' title='Event Feed'>
          {feedInput}
          <div className='feedHolder'>
            {eventFeed}
          </div>
        </Modal>
        <Modal id="userModal" title = "User">
          {userModalContent}
        </Modal>
        <Modal id="checkInModal" title = "Check Ins">
          <div className='map-container'>
            <CheckInTable checkIns={checkIns}/>
          </div>
        </Modal>
        <Modal id="mapModal" title="Event Location" cancelText='Close' size='modal-lg'>
          <div className='map-container'>
            <EmbeddedMap location={event.location}/>
          </div>
        </Modal>
        <Modal id="histogramModal" title="Event Location" cancelText='Close' size='modal-lg'>
          <div id='chartHolder' style={{'width' : '100%', 'height' : '400px'}}>
            {histogram}
          </div>
        </Modal>
      </div>
    );
  }
}

/*

*/
