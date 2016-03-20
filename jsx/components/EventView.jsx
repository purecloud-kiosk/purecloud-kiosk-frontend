"use strict";
import React, { Component } from "react";

import * as eventsActions from "../actions/eventsActions";
import * as statsActions from "../actions/statsActions";
import * as navActions from "../actions/navActions";
import eventsStore from "../stores/eventsStore";
import eventsConstants from "../constants/eventsConstants";
import statsStore from "../stores/statsStore";
import statsConstants from "../constants/statsConstants";
import PieChartWidget from "./PieChartWidget";
import TickerWidget from "./TickerWidget";


export default class EventView extends Component {
  constructor(props){
    super(props);
    this.state = {event : eventsStore.getCurrentEvent(), stats : null};
  }
  componentDidMount(){
    this.state.eventStatsListener = statsStore.addListener(statsConstants.EVENT_STATS_RETRIEVED, this.updateStats.bind(this));
    statsActions.getEventStats(this.state.event.id);
    this.state.eventsStoreListener = eventsStore.addListener(eventsConstants.EVENT_DELETED, navActions.routeToPage.bind(this));
    console.log(this.state.event);
    var self = this;
    //this.state.eventStatsListener = statsStore.addListener(eventsConstants.EVENT_DELETED, this.updateStats.bind(this));
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


  handleDeleteButtonClick(){
    this.state.event.eventID = this.state.event.id;
    eventsActions.deleteEvent({'eventID': this.state.event.eventID});
  }
  onBannerError(){
    console.log('error with image');
    var state = this.state;
    state.event.imageUrl = 'https://unsplash.it/1920/1080';
    this.setState(state);
  }
  onThumbnailError(){
    var state = this.state;
    state.event.thumbnailUrl = 'https://unsplash.it/400/400';
    this.setState(state);
  }

  updateStats(){
    var state = this.state;
    state.stats = statsStore.getEventStats();
    console.log("updating stats");
    console.log(state);
    this.setState(state);
  }
  render(){
    var {event, stats} = this.state;

    var view, checkInWidget;
    var privacy = "public";
    console.log(stats);

    if(event != null){
      if(event.private && stats != null){
        privacy = "private";
        checkInWidget = (
          <PieChartWidget checkedIn={stats.checkedIn} notCheckedIn={stats.notCheckedIn}/>
        );
      }
      else if(stats != null){ // public, so show ticker instead
        checkInWidget = (
          <TickerWidget value={stats.checkedIn}/>
        );
      }
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
                 <a className="btn btn-primary btn-sm pull-right text-center">
                  <i className="fa fa-cog fa-lg"></i> Expand
                </a>
              </div>
              <div className="widget-body medium no-padding">
                <div className="text-body">
                  <p>{event.description}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-md-4">
            {checkInWidget}
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
      </div>
    );
  }
}
