'use strict';
import React, { Component } from 'react';
import navStore from '../stores/navStore';
import * as eventActions from '../actions/eventActions';
import navConstants from '../constants/navConstants';

export default class PieChartWidget extends Component {
  constructor(props){
    super(props);
    this.state = {
      'id' : (Math.random() + 1).toString(36).substring(7),
      'type' : null
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
    console.log('new props for chart');
    if(this.shouldComponentUpdate(newProps, {}))
      this.renderChart(newProps);
  }

  shouldComponentUpdate(nextProps, nextState){
    let update = false;
    if(nextProps.type === 'scatter' || nextProps.type === 'bar')
      update =  nextProps.chartData.data.length != this.props.chartData.data.length
    else {
      for(let i = 0; i < nextProps.chartData[0].data.length; i++){
        if(nextProps.chartData[0].data.y != this.props.chartData[0].data.y){
          update = true;
          break;
        }
      }
    }
    console.log('should chart update?' + update);
    return update;
  }
  renderChart(props){
    console.log('rendering!');
    const {type, chartData, options} = props;
    var optns;
    let state = this.state;
    this.state.type = type;
    if(options === undefined){
      optns = {
        segmentShowStroke : true,
        segmentStrokeColor : '#fff',
        segmentStrokeWidth : 2,
        animationEasing : 'easeOutBounce',
        animateRotate : true,
        animateScale : false,
        maintainAspectRatio: false,
        responsive: true,
        labelLength : 7
      }
    }
    else{
      optns = options;
    }
    if(state.chart !== undefined){
      state.chart.destroy();
      $('#' + state.id).off('click');
    }
    //let pieChartCtx = $('#' + state.id).get(0).getContext('2d');
    let chartOptions = null;
    switch(type){
      case 'scatter':
        console.log('chart data for scatter');
        console.log(chartData);
        chartOptions = {
            chart: {
              'type' : 'scatter'
            },
            title: {
                text: 'Check In Chart'
            },
            subtitle: {
                text: null
            },
            xAxis: {
                type: 'datetime',
            },
            yAxis: {
                title: {
                    text: 'Check In Times'
                }
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                scatter: {
                    marker: {
                        radius: 2
                    },
                    states: {
                        hover: {
                            enabled : true
                        }
                    }
                }
            },
            tooltip: {
                formatter: function(){
                  return 'Check In: <b>' + new Date(this.x) + '</b>';
                }
            },
            series: [{
                name: 'Check In',
                data: chartData.data
            }]
        };
        console.log(chartData.data);
        break;
      case 'bar':
        chartOptions = {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Most Recent Event Outcomes'
            },
            xAxis: {
                categories: chartData.categories,
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Check In Counts'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y} check ins</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            series: [{
                name: 'Check Ins',
                data: chartData.data
            }]
        };
        break;
      default:
        chartOptions = {
          chart: {
              plotBackgroundColor: null,
              plotBorderWidth: null,
              plotShadow: false,
              type: 'pie'
          },
          title: {
              text: null//'Browser market shares January, 2015 to May, 2015'
          },
          tooltip: {
              pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
          },
          plotOptions: {
              pie: {
                  allowPointSelect: true,
                  cursor: 'pointer',
                  dataLabels: {
                      enabled: true,
                      format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                      style: {
                          color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                      }
                  },
                  'showInLegend' : true
              }
          },
          series: chartData
      };
    }
    $('#' + this.state.id).highcharts(chartOptions);
    this.setState(state);
  }

  render(){
    // <canvas id={this.state.id} className='chart'></canvas>
    return(
      <div id={this.state.id} className='chart-container'/>
    );
  }
}
