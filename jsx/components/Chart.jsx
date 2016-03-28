'use strict';
import React, { Component } from 'react';
import navStore from '../stores/navStore';
import * as eventsActions from '../actions/eventsActions';
import navConstants from '../constants/navConstants';

export default class PieChartWidget extends Component {
  constructor(props){
    super(props);
    this.state = {
      'id' : (Math.random() + 1).toString(36).substring(7)
    };
  }
  componentDidMount(){
    this.state.width = $('#' + this.state.id).width();
    console.log(this.state);
    this.renderChart(this.props);
    var self = this;
    this.state.navListener = navStore.addListener(navConstants.SIDEBAR_TOGGLED, ()=> {
      setTimeout(() => {
          self.renderChart(self.props);
      }, 500);
    });
  }
  componentWillReceiveProps(newProps){
    this.renderChart(newProps);
  }
  componentWillUnmount(){
    this.state.chart.destroy();
  }
  renderChart(props){
    console.log('rendering!');
    const {type, chartData, options} = props;
    var optns;
    if(options === undefined){
      optns = {
        segmentShowStroke : true,
        segmentStrokeColor : '#fff',
        segmentStrokeWidth : 2,
        animationEasing : 'easeOutBounce',
        animateRotate : true,
        animateScale : false,
        maintainAspectRatio: false,
        responsive: true
      }
    }
    else{
      optns = options;
    }
    if(this.state.chart !== undefined){
      this.state.chart.destroy();
      $('#' + this.state.id).off('click');
    }
    let pieChartCtx = $('#' + this.state.id).get(0).getContext('2d');
    switch(type){
      case 'scatter':
        this.state.chart = new Chart(pieChartCtx).Scatter(chartData, optns);
        var self = this;
        $('#' + this.state.id).click((evt) => {
          console.log(self.state.chart);
          var activePoints = self.state.chart.getPointsAtEvent(evt);
          if(activePoints[0] !== undefined){
            console.log(chartData[0].data[activePoints[0].value - 1].checkIn);
          }
        });
        break;
      case 'doughnut':
        this.state.chart = new Chart(pieChartCtx).Doughnut(chartData, optns);
        break;
      default:
        this.state.chart = new Chart(pieChartCtx).Pie(chartData, optns);
    }
  }
  render(){
    return(
      <div className='chart-container'>
        <canvas id={this.state.id} className='chart'></canvas>
      </div>
    );
  }
}
