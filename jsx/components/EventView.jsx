"use strict";
import React, { Component } from "react";

import * as eventsActions from "../actions/eventsActions";
import * as statsActions from "../actions/statsActions";
import * as navActions from "../actions/navActions";
import eventsStore from "../stores/eventsStore";
import eventsConstants from "../constants/eventsConstants";
import statsStore from "../stores/statsStore";
import statsConstants from "../constants/statsConstants";
import Chart from "./Chart";
import TickerWidget from "./TickerWidget";
import Modal from "./Modal";

export default class EventView extends Component {
  constructor(props){
    super(props);
    this.state = {
      'event' : eventsStore.getCurrentEvent(),
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
        'bezierCurveTension' : 0.1
      }
    };
  }
  componentDidMount(){
    this.state.eventStatsListener = statsStore.addListener(statsConstants.EVENT_STATS_RETRIEVED, this.updateStats.bind(this));
    this.state.eventsStoreListener = eventsStore.addListener(eventsConstants.EVENT_DELETED, navActions.routeToPage.bind(this));
    this.state.getEventCheckInsListener = eventsStore.addListener(eventsConstants.EVENT_CHECKINS_RETRIEVED, this.updateCheckIns.bind(this));
    statsActions.getEventStats(this.state.event.id);
    eventsActions.getEventCheckIns(this.state.event.id);
    $('.banner').error(this.onBannerError.bind(this));
    $('.thumbnail').error(this.onThumbnailError.bind(this));
  }
  componentWillUnmount(){
    this.state.eventStatsListener.remove();
    //this.state.eventsStoreListener.remove();
  }
  handleEventUpdated(page){
    eventsActions.setUpdateFlag(true);
    navActions.routeToPage("create");
  }

  handleEditButtonClicked(){

  }

  handleDeleteButtonClick(){
    this.state.event.eventID = this.state.event.id;
    eventsActions.deleteEvent({'eventID': this.state.event.eventID});
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
    console.log("updating stats");
    console.log(state);
    this.setState(state);
  }
  updateCheckIns(){
    let state = this.state;
    state.checkIns = eventsStore.getCheckIns();
    console.log(state);
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
    let {event, stats, checkIns, chartOptions} = this.state;
    let view, checkInWidget, inviteWidget, lineWidget;
    let privacy = "public";
    console.log(stats);
    if(event != null){
      if(event.private && stats != null){
        privacy = "private";
        let chartData = [
          {
              'value': stats.checkInStats.notCheckedIn,
              'color':'#FF3333',
              'highlight': '#FF0000',
              'label': 'Not Checked In'
          },
          {
              'value': stats.checkInStats.checkedIn,
              'color': '#0F465D',
              'highlight': '#5AD3D1',
              'label': 'Checked In'
          }
        ];
        if(stats.inviteStats !== undefined){
          let inviteData = [
            {
                'value': stats.inviteStats.unknown,
                'color':'#666666',
                'highlight': '#4D4D4D',
                'label': 'Pending'
            },
            {
                'value': stats.inviteStats.yes,
                'color': '#0F465D',
                'highlight': '#5AD3D1',
                'label': 'Attending'
            },
            {
                'value': stats.inviteStats.no,
                'color': '#FF3333',
                'highlight': '#FF0000',
                'label': 'Not attending'
            },
            {
                'value': stats.inviteStats.maybe,
                'color': '#ff9933',
                'highlight': '#ff6600',
                'label': 'Possibly Attending'
            }
          ];
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
      let lineData = [{
        'label' : 'Check In',
        'strokeColor' : '#5AD3D1',
        'pointColor' : '#5AD3D1',
        'pointStrokeColor' : '#5AD3D1',
        'data' : []
      }];
      if(checkIns !== null){
        let count = 1;
        checkIns.forEach((checkIn) => {
          console.log(checkIn);
          if(checkIn.timestamp !== undefined){
            console.log(new Date(checkIn.timestamp));
            console.log(new Date());
            lineData[0].data.push({
              'x' : new Date(checkIn.timestamp),
              'y' : count,
              'checkIn' : checkIn
            });
          }
          count++;
        });
        console.log(lineData[0]);
      }
      lineWidget = (<Chart id='checkInLineChart' header='Check Ins' type='scatter' chartData={lineData} options={chartOptions}/>)
      event.imageUrl = event.imageUrl || 'https://unsplash.it/1920/1080';
      event.thumbnailUrl = event.thumbnailUrl || 'https://unsplash.it/1920/1080';

      view = (
        <div className="animated fadeInUp">
          <div className="event-container">
            <div className="update-button">
              <button className= "btn btn-primary pull-right" onClick={this.handleEventUpdated.bind(this, "create")}> Update Event
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
                    <h4>{event.title}</h4>
                    <p>Start Date: {moment(event.startDate).format('LLL')}</p>
                    <p>End Date: {moment(event.endDate).format('LLL')}</p>
                    <p>Location: {event.location}</p>
                    <p>This event is {privacy}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
