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
      'chart' : null,
      'chartData' : null
    };
  }
  componentDidMount(){
    this.state.width = $('#' + this.state.id).width();
    console.log(this.state);
    this.renderChart(this.state.checkIns);
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
    if(this.state.chart !== null){
      if(this.state.checkIns.length < newProps.checkIns.length){
        console.log('awww yessss');
        this.state.checkIns = newProps.checkIns;
        // let newData = [];
        // for(let i = this.state.checkIns.length; i < newProps.checkIns.length; i++){
        //   newData.push(newProps.checkIns[i])
        // }
        // console.log(this.state);
        // this.state.chartData = this.state.chartData.concat();
        // console.log(this.calculateData);
        // console.log(this.state.chartData);
        this.state.chart.series[0].setData(this.calculateData(this.state.checkIns), true);
      }
    }
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
    let chartData = this.calculateData(checkIns);
    let chartOptions = chartOptions = {
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
                console.log('xaxis');
                console.log(this);
                return moment(this.value).format('LLL');
              }
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Check In Counts'
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
            name: 'Check Ins',
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
