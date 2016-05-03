'use strict';
import React, { Component } from 'react';
import i18next from 'i18next';
import navStore from '../stores/navStore';
import * as eventActions from '../actions/eventActions';
import navConstants from '../constants/navConstants';
Highcharts.setOptions({                                            // This is for all plots, change Date axis to local timezone
    global : {
        useUTC : false
    }
});
export default class Histogram extends Component {
  constructor(props){
    super(props);
    this.state = {
      'id' : (Math.random() + 1).toString(36).substring(7),
      'checkInIntervals' : props.checkInIntervals,
      'chart' : null,
      'chartData' : null
    };
  }
  componentDidMount(){
    this.state.width = $('#' + this.state.id).width();
    console.log(this.state);
    this.renderChart(this.state.checkInIntervals);
    var self = this;
    this.state.navListener = navStore.addListener(navConstants.SIDEBAR_TOGGLED, ()=> {
      setTimeout(() => {
          let width = $('#' + self.state.id).width();
          let height = $('#' + self.state.id).height();
          self.state.chart.setSize(width, height);
      }, 300);
    });
  }
  componentWillUnmount(){
    this.state.navListener.remove();
  }
  componentWillReceiveProps(newProps){
    console.log('New Props for histogram');
    console.log(newProps);
    // if(this.state.chart !== null){
    //   if(this.state.checkIns.length < newProps.checkIns.length){
    //     this.state.checkIns = newProps.checkIns;
    //     this.state.chart.series[0].setData(this.calculateData(this.state.checkIns), true);
    //   }
    // }
    this.state.checkInIntervals = newProps.checkInIntervals;
    this.state.chart.series[0].setData(this.convertData(this.state.checkInIntervals), true);
  }

  shouldComponentUpdate(nextProps, nextState){
    //return nextProps.length != this.state.checkIns.length;
    return true;
  }
  convertData(data){
    let chartData = [];
    Object.keys(data).forEach((key) => {
      chartData.push([Number(key), data[key]]);
    });
    console.log(chartData);
    return chartData;
  }
  renderChart(checkInIntervals){
    let chartData = this.convertData(checkInIntervals);
    let chartOptions = {
        chart: {
          renderTo : this.state.id,
            type: 'column'
        },
        title: {
            text: ''
        },
        xAxis: {
            startOnTick : true,
            labels : {
              formatter : function(){
                return moment(this.value).format('LLL');
              }
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: i18next.t('CHECK_IN_COUNTS')
            },
            tickInterval : 1,
        },
        tooltip: {
            // headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            // pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            //     '<td style="padding:0"><b>{point.y} check ins</b></td></tr>',
            // footerFormat: '</table>',
            formatter : function(){
              return  '<span style="font-size:10px">' + moment(this.x).format('LLL') + '</span><table>'
                + '<tr><td style="padding:0">+ ' + this.series.name + ': </td>' +
                    '<td style="padding:0"><b>' + this.y +  ' check ins</b></td></tr>';
            },
            // shared: true,
            // useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            name: i18next.t('CHECK_INS'),
            pointInterval : 15 * 60 * 1000,
            data: chartData
        }]
    };
    let chart = new Highcharts.Chart(chartOptions);
    this.state.chart = chart;
    this.state.chartData = chartData;
    this.setState(this.state);
  }

  render(){
    // <canvas id={this.state.id} className='chart'></canvas>
    return(
      <div id={this.state.id} className='chart-container'/>
    );
  }
}
