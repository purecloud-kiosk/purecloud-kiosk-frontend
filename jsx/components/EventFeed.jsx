
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
      'managerAccess' : this.props.managerAccess,
      'feed' : this.props.feed,
    };
  }
  componentDidMount(){
    // handle item removed event
  }
  handleRemoveButtonClicked(data){
    console.log(data);
    eventActions.removeEventMessage(data.id);
  }
  render(){
    const {managerAccess, feed} = this.state;
    return (
      <div>
        {feed.map((data) => {
          let removeButton;
          if(managerAccess){
            removeButton = (
              <button className='pull-right btn btn-danger'
                onClick={this.handleRemoveButtonClicked.bind(this, data)}>
                x
              </button>
            );
          }
          return (
            <blockquote className='animated fadeInLeft' key={data.id}>
              {removeButton}
              <p className='text-size-medium notification-message'>{data.message.content}</p>
              <footer>{data.posterName} on {moment(data.datePosted).format('LLL')}</footer>
            </blockquote>
          );
        })}
      </div>
    );
  }
}
