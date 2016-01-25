"use strict";
import React, { Component } from "react";

export default class TickerWidget extends Component {
  constructor(props){
    super(props);
  }
  componentDidMount(){
    var {value} = this.props;
    var odometer = new Odometer({
      el: document.querySelector(".checked-in-odometer"),
      value : 0
    });
    setTimeout( function(){
      odometer.update(value);
    }, 500);

  }
  render(){
    return(
      <div className="widget animated fadeInUp">
        <div className="widget-header">
          <i className="fa fa-ticket"></i>Checked In
        </div>
        <div className="widget-body medium no-padding">
          <div className="ticker-container">
            <div className="ticker">
              <span className="checked-in-odometer">0</span><br/>
              <span>people checked into this event</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
