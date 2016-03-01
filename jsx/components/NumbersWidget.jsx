'use strict';
import React, { Component } from 'react';

export default class Widget extends Component {
  constructor(props){
    super(props);
  }
  componentDidMount(){
    console.log('Ticker ' + this.props.value);
    var odometer = new Odometer({
      el: document.querySelector('#numberWidget' + this.props.id),
      value : 0
    });
    odometer.update(this.props.value);
  }
  render(){
    var {text, faIcon, color, id} = this.props;
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
