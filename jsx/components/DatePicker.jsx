'use strict';
import React, { Component } from 'react';

export default class DatePicker extends Component{
  constructor(props){
    super(props);
    this.state = {'id' : props.id};
  }
  componentDidMount(){
    console.log(this.props);
    const {id, type, date} = this.props;
    var options = {};
    switch(type){
      case 'time':
        this.state.format = 'LT'
        options.date = false;
        options.shortTime = true;
        options.format = 'h:mmA'
        break;
      case 'date':
        options.time = false;
        options.minDate = new Date();
        options.format = 'LL'
        break;
    }
    $('#' + this.state.id).bootstrapMaterialDatePicker(options);
    $('#' + this.state.id).on('change',(event, date) => {
      this.props.onChange(date);
    });
  }
  componentWillUnmount(){
    console.log('unmounting')
    $('#' + this.state.id).bootstrapMaterialDatePicker('destroy');
  }
  render(){
    return (
      <div>
          <input id={this.state.id} className='form-control' value={this.props.date}/>
      </div>

    );
  }
}
