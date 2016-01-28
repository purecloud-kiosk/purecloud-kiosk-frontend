"use strict";
import React, { Component } from "react";

import * as statsActions from "../actions/statsActions";
import * as eventsActions from "../actions/eventsActions";
import statsStore from "../stores/statsStore";
import eventsStore from "../stores/eventsStore";
import statsConstants from "../constants/statsConstants";
import eventsConstants from "../constants/eventsConstants";
import NumbersWidget from "./NumbersWidget";
import EventsTableWidget from "./EventsTableWidget";

export default class Dash extends Component {
  constructor(props){
    super(props);
    this.state = {
      stats : statsStore.getUserStats(),
      eventsManaging : eventsStore.getEventsManaging(),
      publicEvents : eventsStore.getPublicEvents(),
      privateEvents : eventsStore.getPrivateEvents()
    };
  }
  updateView(field){
    var state = this.state;
    switch(field){
      case "stats":
        state[field] = statsStore.getUserStats();
        break;
      case "eventsManaging":
        state[field] = eventsStore.getEventsManaging();
        break;
      case "publicEvents":
        state[field] = eventsStore.getPublicEvents();
        break;
      case "privateEvents":
        state[field] = eventsStore.getPrivateEvents();
        break;
    }
    this.setState(state);
  }
  componentDidMount(){
    console.log("dash mounted");
    this.state.userStatsListener = statsStore.addListener(statsConstants.USER_STATS_RETRIEVED, this.updateView.bind(this, "stats"));
    this.state.eventsManagingListener = eventsStore.addListener(eventsConstants.EVENTS_MANAGING_RETRIEVED, this.updateView.bind(this, "eventsManaging"));
    this.state.publicEventsListener = eventsStore.addListener(eventsConstants.PUBLIC_EVENTS_RETRIEVED, this.updateView.bind(this, "publicEvents"));
    this.state.privateEventsListener = eventsStore.addListener(eventsConstants.PRIVATE_EVENTS_RETRIEVED, this.updateView.bind(this, "privateEvents"));
    statsActions.getUserStats();
    eventsActions.getPublicEvents(10, 0);
    eventsActions.getEventsManaging(10, 0);
    eventsActions.getPrivateEvents(10, 0);
  }
  componentWillUnmount(){
    console.log("dash unmounting...");
    //this.state.userStatsListener.remove();
    this.state.eventsManagingListener.remove();
    this.state.publicEventsListener.remove();
    this.state.privateEventsListener.remove();
  }
  render(){
    var {stats, eventsManaging, publicEvents, privateEvents} = this.state;
    var widgets, eventsManagingTable, publicEventsTable, privateEventsTable;
    if(stats != null){
      widgets = (
        <div className="row">
          <div className="col-sm-6 col-md-3">
            <NumbersWidget id="1" color="blue" faIcon="fa-unlock" value={stats.totalPublicEventsAvailable}
              text="Total Public Events Available"/>
          </div>
          <div className="col-sm-6 col-md-3">
            <NumbersWidget id="2" color="red" faIcon="fa-lock" value={stats.totalPrivateEventsAvailable}
              text="Total Private Events Available"/>
          </div>
          <div className="col-sm-6 col-md-3">
            <NumbersWidget id="3" color="green" faIcon="fa-check-square" value={stats.publicEventsCheckedIn}
              text="Public Events Checked Into"/>
          </div>
          <div className="col-sm-6 col-md-3">
            <NumbersWidget id="4" color="orange" faIcon="fa-check-circle" value={stats.privateEventsCheckedIn}
              text="Private Events Checked Into"/>
          </div>
        </div>
      );
    }
    eventsManagingTable = (
      <div className="col-md-6">
        <EventsTableWidget title="Events Managing" faIcon="fa-user" events={eventsManaging}/>
      </div>
    );
    publicEventsTable = (
      <div className="col-md-6">
        <EventsTableWidget title="All Public Events" faIcon="fa-users" events={publicEvents}/>
      </div>
    );
    privateEventsTable = (
      <div className="col-md-6">
        <EventsTableWidget title="Private Events" faIcon="fa-user-secret" events={privateEvents}/>
      </div>
    );
    return(
      <div>
        <div className="widgets">
          {widgets}
        </div>
        <div className="tables">
          {eventsManagingTable}
          {publicEventsTable}
          {privateEventsTable}
        </div>
      </div>
    );
  }
}
