'use strict';
import React, { Component } from 'react';

export default class TickerWidget extends Component {
  constructor(props){
    super(props);
    this.state = {
      value : props.value,
      odometer : null
    };
  }
  componentWillReceiveProps(newProps){
    this.state.value = newProps.value;
    this.state.odometer.update(newProps.value);
    this.setState(newProps);
  }

  componentDidMount(){
    let state = this.state;
    state.odometer = new Odometer({
      el: document.querySelector('.checked-in-odometer'),
      value : 0
    });
    setTimeout( function(){
      state.odometer.update(value);
    }, 500);
    this.setState(state);
  }
  render(){
    return(
      <div className='widget'>
        <div className='widget-header'>
          <i className='fa fa-ticket'></i>Checked In
        </div>
        <div className='widget-body medium no-padding'>
          <div className='ticker-container'>
            <div className='ticker'>
              <span className='checked-in-odometer'>0</span><br/>
              <span>people checked into this event</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
