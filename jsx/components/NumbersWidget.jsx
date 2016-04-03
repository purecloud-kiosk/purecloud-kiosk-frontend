'use strict';
import React, { Component } from 'react';

export default class Widget extends Component {
  constructor(props){
    super(props);
    this.state = {
      'id' : props.id,
      'value' : props.value,
      'text' : props.text,
      'color' : props.color,
      'faIcon' : props.faIcon,
    };
  }
  componentDidMount(){
    var odometer = new Odometer({
      el: document.querySelector('#numberWidget' + this.state.id),
      value : 0
    });
    var state = this.state;
    state.odometer = odometer;
    odometer.update(this.state.value);
    this.setState(state);
  }
  componentWillReceiveProps(newProps){
    var state = this.state;
    state.id = newProps.id;
    state.faIcon = newProps.faIcon;
    state.value = newProps.value;
    state.text = newProps.text;
    state.color = newProps.color;
    state.odometer.update(state.value);
    this.setState(state);

  }
  render(){
    var {text, faIcon, color, id} = this.state;
    console.log('rendered');
    return(
      <div className='widget animated fadeInDown'>
        <div className='widget-body'>
          <div className={'widget-icon pull-left ' + color}>
            <i className={'fa ' + faIcon}></i>
          </div>
          <div className='title'><span id={'numberWidget' + id}>0</span></div>
          <div className='comment'>{text}</div>
        </div>
      </div>
    );
  }
}
