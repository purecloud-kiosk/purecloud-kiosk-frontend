'use strict';
import React, { Component } from 'react';
import * as navActions from '../actions/navActions';
import * as eventsActions from '../actions/eventsActions';
import * as dateConverter from '../utils/dateConverter';
export default class PieChartWidget extends Component {
  constructor(props){
    super(props);
  }
  componentDidMount(){
    console.log('mounted Chart');
    var {checkedIn, notCheckedIn} = this.props;
    var data = [
      {
          'value': notCheckedIn,
          'color':'#55A9C6',
          'highlight': '#FF5A5E',
          'label': 'Not Checked In'
      },
      {
          'value': checkedIn,
          'color': '#0F465D',
          'highlight': '#5AD3D1',
          'label': 'Checked In'
      }
    ];
    var options = {
      segmentShowStroke : true,
      segmentStrokeColor : '#fff',
      segmentStrokeWidth : 2,
      animationEasing : 'easeOutBounce',
      animateRotate : true,
      animateScale : false,
      maintainAspectRatio: false,
      responsive: true
    }
    setTimeout( function(){ // this prevents it from having issues with being responsive
      var pieChartCtx = $('#piechart').get(0).getContext('2d');
      new Chart(pieChartCtx).Pie(data,options);
    }, 500);
  }
  render(){
    return(
      <div className='widget'>
        <div className='widget-header'>
          <ul className='pie-legend'>
            <li>Checked In </li>
            <li>Not Checked In</li>
          </ul>
        </div>
        <div className='widget-body medium no-padding'>
          <div className='chart-container'>
            <canvas id='piechart'></canvas>
          </div>
        </div>
      </div>
    );
  }
}
