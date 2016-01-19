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
    this.state = {stats : null, eventsManaging : [], publicEvents : [], privateEvents : []};
  }
  updateView(field){
    var state = this.state;
    switch(field){
      case "stats":
        state[field] = statsStore.getStats();
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
    statsStore.addListener(statsConstants.STATS_RETRIEVED, this.updateView.bind(this, "stats"));
    eventsStore.addListener(eventsConstants.EVENTS_MANAGING_RETRIEVED, this.updateView.bind(this, "eventsManaging"));
    eventsStore.addListener(eventsConstants.PUBLIC_EVENTS_RETRIEVED, this.updateView.bind(this, "publicEvents"));
    statsActions.getStats();
    eventsActions.getPublicEvents(0);
    eventsActions.getEventsManaging(0);

  }
  render(){
    var {stats, eventsManaging, publicEvents, privateEvents} = this.state;
    var widgets, eventsManagingTable, publicEventsTable, privateEventsTable;
    if(stats != null){
      widgets = (
        <div className="row">
          <div className="col-sm-6 col-md-3">
            <NumbersWidget color="blue" faIcon="fa-unlock" value={stats.totalPublicEventsAvailable}
              text="Total Public Events Available"/>
          </div>
          <div className="col-sm-6 col-md-3">
            <NumbersWidget color="red" faIcon="fa-lock" value={stats.totalPrivateEventsAvailable}
              text="Total Private Events Available"/>
          </div>
          <div className="col-sm-6 col-md-3">
            <NumbersWidget color="green" faIcon="fa-check-square" value={stats.publicEventsCheckedIn}
              text="Public Events Checked Into"/>
          </div>
          <div className="col-sm-6 col-md-3">
            <NumbersWidget color="orange" faIcon="fa-check-circle" value={stats.privateEventsCheckedIn}
              text="Private Events Checked Into"/>
          </div>
        </div>
      );
    }
    var managing = []
    for(var i = 0; i < eventsManaging.length; i++){
      managing.push(eventsManaging[i].event);
    }
    eventsManagingTable = (
      <div className="col-md-6">
        <EventsTableWidget title="Events Managing" faIcon="fa-user" events={managing}/>
      </div>
    );
    publicEventsTable = (
      <div className="col-md-6">
        <EventsTableWidget title="All Public Events" faIcon="fa-users" events={publicEvents}/>
      </div>
    );
    privateEventsTable = (
      <div className="col-md-6">
        <EventsTableWidget title="Private Events Attending" faIcon="fa-user-secret" events={privateEvents}/>
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
