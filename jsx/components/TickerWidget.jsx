'use strict';
import React, { Component } from 'react';

export default class TickerWidget extends Component {
  constructor(props){
    super(props);
    this.state = {
      id : props.id,
      value : props.value,
      odometer : null
    };
  }
  componentWillReceiveProps(newProps){
    if(this.state.odometer !== null){
      console.log('updating ticker');
      console.log(this.state);
      console.log(newProps);
      this.state.value = newProps.value;
      this.state.odometer.update(newProps.value);
      this.setState(this.state);
    }
  }
  componentWillUnmount(){
    console.log('ticker component is unmounting');
    this.state.value = 0;
  }
  componentDidMount(){
    let state = this.state;
    state.odometer = new Odometer({
      el: document.querySelector('#' + state.id),
      value : 0
    });
    setTimeout( function(){
      state.odometer.update(state.value);
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
              <span id={this.state.id} className='checked-in-odometer'>0</span><br/>
              <span>people checked into this event</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
