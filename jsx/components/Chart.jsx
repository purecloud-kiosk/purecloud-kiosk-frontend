'use strict';
import React, { Component } from 'react';
import i18next from 'i18next';
import navStore from '../stores/navStore';
import * as navActions from '../actions/navActions';
import * as eventActions from '../actions/eventActions';
import eventsStore from '../stores/eventsStore';
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
    console.log(eventsStore.getPastEventsManaged());
    if(this.props.type === 'bar'){
      function handleClick(index){
        console.log(index);
        console.log('click handler');
        console.log(eventsStore.getPastEventsManaged()[index]);
        eventActions.setCurrentEvent(eventsStore.getPastEventsManaged()[index]);
        navActions.routeToPage('event');
      }
      for(let i = 0; i < this.props.chartData.data.length; i++){
        console.log('applying handler ' + i);
        $('#pastEvent' + i).click(handleClick.bind(this, i));
      }
    }
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
    if(this.props.type === 'bar'){
      for(let i = 0; i < this.props.chartData.data.length; i++){
        console.log('removing handler');
        $('#pastEvent' + i).off();
      }
    }
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
      case 'bar':
        let index = 0;
        chartOptions = {
            chart: {
              renderTo : this.state.id,
                type: 'column'
            },
            title: {
                text: '',
            },
            xAxis: {
                categories: chartData.categories,
                crosshair: true,
                labels : {
                  formatter : function(){
                    console.log('xaxis');
                    console.log(this);
                    let i = index % eventsStore.getPastEventsManaged().length;
                    index++;
                    return '<a id="pastEvent' + i + '" class="clickable">' + this.value +'</a>';
                  },
                  useHTML : true
                },

            },
            yAxis: {
                min: 0,
                title: {
                    text: i18next.t("CHECK_IN_COUNTS")
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
                name: i18next.t("CHECK_INS"),
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
