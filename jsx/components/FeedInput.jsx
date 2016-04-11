
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
import webSocket from '../websocket/socket';

export default class EventView extends Component {
  constructor(props){
    super(props);
    this.state = {
      'message' : '',
      'eventID' : this.props.eventID
    };
  }
  handleMessageChange(event){
    let state= this.state;
    state.message = event.target.value;
    this.setState(state);
  }
  handleSubmit(){
    let state = this.state;
    eventActions.postToEventFeed(state.eventID, state.message);
    state.message = '';
    this.setState(state);
  }
  render(){
    return(
      <form className="form-horizontal message-form">
        <div className="form-group">
          <div className='input-group'>
            <input type="text" className="form-control" value={this.state.message} onChange={this.handleMessageChange.bind(this)}/>
            <span className="input-group-btn">
              <button className="btn btn-default" type="button"
                disabled={this.state.message.length === 0} onClick={this.handleSubmit.bind(this)}>
                Post Message
              </button>
            </span>
          </div>
        </div>
      </form>
    );
  }
}
