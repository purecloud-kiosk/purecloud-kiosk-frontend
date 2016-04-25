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
export default class PieChartWidget extends Component {
  constructor(props){
    super(props);
    this.state = {
      'id' : (Math.random() + 1).toString(36).substring(7),
      'type' : null,
      'chart' : null
    };
  }
  componentDidMount(){
    this.state.width = $('#' + this.state.id).width();
    console.log(this.state);
    this.renderChart(this.props);
    var self = this;
    this.state.navListener = navStore.addListener(navConstants.SIDEBAR_TOGGLED, ()=> {
      setTimeout(() => {
          //self.renderChart(self.props);
          //self.chart.redraw();
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
    // console.log('new props for chart');
    // if(this.shouldComponentUpdate(newProps, {})){
    //   if(this.state.type === 'scatter' || this.state.type === 'bar' || this.state.type === 'histogram'){
    //     this.state.chart.series[0].data = newProps.chartData.data;
    //   }
    //   else{
    //     this.state.chart.series = newProps.chartData;
    //   }
    //   // console.log('Drawing');
    //   // this.state.chart.redraw();
    // }
    //this.renderChart(newProps);
  }

  shouldComponentUpdate(nextProps, nextState){
    // let update = false;
    // if(nextProps.type === 'scatter' || nextProps.type === 'bar' || this.state.type === 'histogram')
    //   update =  nextProps.chartData.data.length != this.props.chartData.data.length
    // else {
    //   for(let i = 0; i < nextProps.chartData[0].data.length; i++){
    //     if(nextProps.chartData[0].data.y != this.props.chartData[0].data.y){
    //       update = true;
    //       break;
    //     }
    //   }
    // }
    // console.log('should chart update?' + update);
    // return update;
    return true;
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
    //let pieChartCtx = $('#' + state.id).get(0).getContext('2d');
    let chartOptions = null;
    switch(type){
      case 'scatter':
        console.log('chart data for scatter');
        console.log(chartData);
        chartOptions = {
            chart: {
              renderTo : this.state.id
            },
            title: {
                text: 'Check In Chart'
            },
            subtitle: {
                text: null
            },
            xAxis: {
                type: 'datetime',
                title: {
                    text: 'Check In Times'
                }
            },
            yAxis: {
                title: {
                    text: 'Check Ins'
                }
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                series: {
                    marker: {
                        enabled : true,
                        symbol : 'circle',
                        radius: 3
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
                  return 'Check In: <b>' + moment(this.x).format('LLL') + '</b>';
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
              renderTo : this.state.id,
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
          case 'timeseries':
            chartOptions = {
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
                    //pointInterval : 60 * 1000,
                    data: chartData.data
                }]
            };
            break;
      default:
        chartOptions = {
          chart: {
              renderTo : this.state.id,
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
    let chart = new Highcharts.Chart(chartOptions);
    chart.hasUserSize = false;
    this.state.chart = chart;
    //$('#' + this.state.id).highcharts(chartOptions);
    this.setState(state);
  }

  render(){
    // <canvas id={this.state.id} className='chart'></canvas>
    return(
      <div id={this.state.id} className='chart-container'/>
    );
  }
}
