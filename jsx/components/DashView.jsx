'use strict';
import React, { Component } from 'react';

import * as statsActions from '../actions/statsActions';
import * as eventActions from '../actions/eventActions';
import statsStore from '../stores/statsStore';
import eventsStore from '../stores/eventsStore';
import statsConstants from '../constants/statsConstants';
import eventsConstants from '../constants/eventsConstants';
import NumbersWidget from './NumbersWidget';
import EventsTableWidget from './EventsTableWidget';
import Chart from './Chart';

export default class Dash extends Component {
  constructor(props){
    super(props);
    this.state = {
      stats : statsStore.getUserStats(),
      eventsManaging : eventsStore.getUpcomingEventsManaging(),
      publicEvents : eventsStore.getPublicEvents(),
      privateEvents : eventsStore.getPrivateEvents(),
      barChartData : null,
      showChart : false
    };
  }
  updateView(field){
    var state = this.state;
    switch(field){
      case 'stats':
        state[field] = statsStore.getUserStats();
        break;
      case 'pastEventsManaged':
        state[field] = eventsStore.getPastEventsManaged();
        let mostRecentEvents = eventsStore.getPastEventsManaged();
        let eventIDs = '';
        mostRecentEvents.forEach((event) => {
          eventIDs = eventIDs.concat(event.id + ',')
        });
        eventActions.getMultipleEventCheckInCounts(eventIDs);
        break;
      case 'eventsManaging':
        state[field] = eventsStore.getUpcomingEventsManaging();
        break;
      case 'publicEvents':
        state[field] = eventsStore.getPublicEvents();
        break;
      case 'privateEvents':
        state[field] = eventsStore.getPrivateEvents();
        break;
      case 'barChartData':
        var chartData = {
          categories: [],
          data: []
        };
        let checkInCountArray = eventsStore.getCheckInCountArray();
        for(let i = 0; i < checkInCountArray.length; i++){
          chartData.categories.push(this.state.pastEventsManaged[i].title);
          chartData.data.push(checkInCountArray[i].checkInCount);
        }
        state[field] = chartData;
        break;
    }
    this.setState(state);
  }
  componentDidMount(){
    this.state.userStatsListener = statsStore.addListener(statsConstants.USER_STATS_RETRIEVED, this.updateView.bind(this, 'stats'));
    this.state.eventsManagingListener = eventsStore.addListener(eventsConstants.UPCOMING_EVENTS_MANAGING_RETRIEVED, this.updateView.bind(this, 'eventsManaging'));
    this.state.pastEventsManagedListener = eventsStore.addListener(eventsConstants.PAST_EVENTS_MANAGING_RETRIEVED, this.updateView.bind(this, 'pastEventsManaged'));
    this.state.publicEventsListener = eventsStore.addListener(eventsConstants.PUBLIC_EVENTS_RETRIEVED, this.updateView.bind(this, 'publicEvents'));
    this.state.privateEventsListener = eventsStore.addListener(eventsConstants.PRIVATE_EVENTS_RETRIEVED, this.updateView.bind(this, 'privateEvents'));
    this.state.checkInCountsListener = eventsStore.addListener(eventsConstants.EVENT_CHECKIN_COUNTS_RETRIEVED, this.updateView.bind(this, 'barChartData'));
    statsActions.getUserStats();
    eventActions.getPublicEvents(10, 0);
    eventActions.getUpcomingEventsManaging(10, 0);
    eventActions.getPrivateEvents(10, 0);
    eventActions.getPastEventsManaged(10,0);
  }
  componentDidUpdate(){
    window.dispatchEvent(new Event('resize'));
  }
  componentWillUnmount(){
    this.state.userStatsListener.remove();
    this.state.eventsManagingListener.remove();
    this.state.pastEventsManagedListener.remove();
    this.state.publicEventsListener.remove();
    this.state.privateEventsListener.remove();
    this.state.checkInCountsListener.remove();
  }

  render(){
    const {stats, eventsManaging, publicEvents, privateEvents, barChartData} = this.state;
    var widgets, eventsManagingTable, publicEventsTable, privateEventsTable, barChart;
    if(stats != null){
      widgets = (
        <div className='row'>
          <div className='col-sm-6 col-md-3'>
            <NumbersWidget id='1' color='blue' faIcon='fa-unlock' value={stats.totalPublicEventsAvailable}
              text='Upcoming Public Events'/>
          </div>
          <div className='col-sm-6 col-md-3'>
            <NumbersWidget id='2' color='red' faIcon='fa-lock' value={stats.totalPrivateEventsAvailable}
              text='Upcoming Private Events Available'/>
          </div>
          <div className='col-sm-6 col-md-3'>
            <NumbersWidget id='3' color='green' faIcon='fa-check-square' value={stats.publicEventsCheckedIn}
              text='Total Public Events Checked Into'/>
          </div>
          <div className='col-sm-6 col-md-3'>
            <NumbersWidget id='4' color='orange' faIcon='fa-check-circle' value={stats.privateEventsCheckedIn}
              text='Total Private Events Checked Into'/>
          </div>
        </div>
      );
    }
    eventsManagingTable = (
      <div className='col-md-6'>
        <EventsTableWidget title='Upcoming Events You Are Managing' faIcon='fa-user' events={eventsManaging}/>
      </div>
    );
    publicEventsTable = (
      <div className='col-md-6'>
        <EventsTableWidget title='Upcoming Public Events' faIcon='fa-users' events={publicEvents}/>
      </div>
    );
    privateEventsTable = (
      <div className='col-md-6'>
        <EventsTableWidget title='Upcoming Private Events' faIcon='fa-user-secret' events={privateEvents}/>
      </div>
    );
    if(barChartData !== null){
      if(barChartData.data[0].length !== 0){
        barChart = (
          <div className="col-md-12">
            <div className='widget'>
              <div className='widget-header'>
                Bar Chart
              </div>
              <div className='widget-body large no-padding'>
                  <Chart type='bar' chartData={barChartData}/>
              </div>
            </div>
          </div>
        );
      }
    }
    return(
      <div>
        <div className='widgets'>
          {widgets}
        </div>
        <div className='tables'>
          {barChart}
          {eventsManagingTable}
          {publicEventsTable}
          {privateEventsTable}
        </div>
      </div>
    );
  }
}
