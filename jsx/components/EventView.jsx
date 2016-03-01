"use strict";
import React, { Component } from "react";

import * as dateConverter from "../utils/dateConverter";
import * as eventActions from "../actions/eventsActions";
import * as statsActions from "../actions/statsActions";
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
    console.log(this.state.event);
    var self = this;
    $('.banner').error(this.onBannerError.bind(this));
    $('.thumbnail').error(this.onThumbnailError.bind(this));
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
  componentWillUnmount(){
    this.state.eventStatsListener.remove();
  }
  updateStats(){
    var state = this.state;
    state.stats = statsStore.getEventStats();
    this.setState(state);
  }
  render(){
    var {event, stats} = this.state;
    var view, checkInWidget;
    var privacy = "public";
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
            <img className="banner" src={event.imageUrl}></img>
            <div className="row">
              <div className="event-details-container">
                <div className="pull-left thumbnail-container">
                  <img className="thumbnail" src={event.thumbnailUrl} ></img>
                </div>
                <div className="event-details">
                  <div className="title">
                    <h4>{event.title}</h4>
                    <p>Start Date: {dateConverter.convertMillisToDate(event.startDate)}</p>
                    <p>End Date: {dateConverter.convertMillisToDate(event.endDate)}</p>
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
