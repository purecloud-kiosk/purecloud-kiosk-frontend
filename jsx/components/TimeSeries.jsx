'use strict';
import React, { Component } from 'react';
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
      'checkIns' : props.checkIns,
      'chart' : null
    };
  }
  componentDidMount(){
    this.state.width = $('#' + this.state.id).width();
    console.log(this.state);
    this.renderChart(this.props.checkIns);
    var self = this;
    this.state.navListener = navStore.addListener(navConstants.SIDEBAR_TOGGLED, ()=> {
      setTimeout(() => {
          self.renderChart(self.props);
      }, 500);
    });
  }
  componentWillReceiveProps(newProps){

  }

  shouldComponentUpdate(nextProps, nextState){
    return nextProps.length > this.state.checkIns.length;
  }
  calculateData(checkIns){
    console.log(checkIns);
    // checkIns.forEach((checkIn) => {
    //   if(checkIn.timestamp !== undefined){
    //     lineData.data.push([
    //       new Date(checkIn.timestamp).getTime(), count
    //     ]);
    //   }
    //   count++;
    // });
    // round each date to the current date
    let fiveMin = 15 * 60 * 1000;
    let intervals = checkIns.map((checkIn) => {
      let date = new Date(checkIn.timestamp);
      //console.log(minute.startOf('minute').valueOf());
      console.log(new Date(Math.round((date.getTime()/fiveMin) * fiveMin)));
      return new Date(Math.round(date.getTime()/fiveMin) * fiveMin).getTime();
      //return minute.startOf('minute').valueOf();
    });
    console.log(intervals);
    // reduce the data, the inital value of prev is an array
    let reduce = intervals.reduce((prev, current) => {
      console.log(prev);
      console.log(current);
      if(prev !== undefined){
        if(prev[current] === undefined){
          prev[current] = 1;
        }
        else{
          prev[current]++;
        }
      }
      return prev;
    }, []);
    console.log('reduced result')
    console.log(reduce);
    let values = [];
    for(let key in reduce){
      values.push({
        x : Number(key),
        y : reduce[key],
        pointDate : Number(key)
      });
    }
    return values;
  }
  renderChart(checkIns){
    let chartOptions = {
          chart: {
            renderTo : this.state.id,
            zoomType : 'x'
          },
          title: {
              text: 'Check In Time series'
          },
          xAxis: {
              type : 'datetime',
              minRange : 1,
          },
          subtitle: {
            text: document.ontouchstart === undefined ?
              'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
          },
          yAxis: {
              title: {
                  text: 'Check In Counts'
              }
          },
          // tooltip: {
          //     headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
          //     pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
          //         '<td style="padding:0"><b>{point.y} check ins</b></td></tr>',
          //     footerFormat: '</table>',
          //     shared: true,
          //     useHTML: true
          // },
          legend: {
            enabled: false
        },
          plotOptions: {
          area: {
              fillColor: {
                  linearGradient: {
                      x1: 0,
                      y1: 0,
                      x2: 0,
                      y2: 1
                  },
                  stops: [
                      [0, Highcharts.getOptions().colors[0]],
                      [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                  ]
              },
              marker: {
                  radius: 2
              },
              lineWidth: 1,
              states: {
                  hover: {
                      lineWidth: 1
                  }
              },
              threshold: null
          }
        },
          series: [{
              name: 'Check Ins',
              type: 'area',
              pointInterval : 15*  60 * 1000,
              data: chartData.data
          }]
      };
    let chart = new Highcharts.Chart(chartOptions);
    this.state.chart = chart;

    this.setState(this.state);
  }

  render(){
    // <canvas id={this.state.id} className='chart'></canvas>
    return(
      <div id={this.state.id} className='chart-container'/>
    );
  }
}