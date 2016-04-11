'use strict';
import React, { Component } from 'react';
import { Router, Route, IndexRoute } from 'react-router';
import navConstants from '../constants/navConstants';
import requestConstants from '../constants/requestConstants';
import navStore from '../stores/navStore';
import statsStore from '../stores/statsStore';
import * as navActions from '../actions/navActions';
import * as eventActions from '../actions/eventActions';
import history from '../history/history';
// import components
import SideBar from './SideBar';
import HeaderBar from './HeaderBar';
import DashView from './DashView';
import EventView from './EventView';
import CreateEventView from './CreateEventForm';
import EventSearch from "./EventSearch";
import Calendar from "./Calendar";

import NotificationSystem from 'react-notification-system';
import webSocket from '../websocket/socket';
export default class App extends Component{
  constructor(props){
    super(props);
    this.state = {
      'isOpen' : navStore.sideBarIsOpen()
    };
  }
  updateToggle(){
    this.setState({
      isOpen : navStore.sideBarIsOpen()
    });
  }
  componentDidMount(){
    navActions.getNotifications();
    navStore.addListener(navConstants.SIDEBAR_TOGGLED, this.updateToggle.bind(this));
    $('.dropdown-toggle').dropdown();
    webSocket.init(this.refs.notificationSystem);
  }
  render(){
    return (
      <div id='page-wrapper' className={this.state.isOpen ? 'open' : null}>
        <NotificationSystem ref="notificationSystem" />
        <SideBar/>
        <div id='content-wrapper'>
          <div className='page-content'>
            <HeaderBar/>
            <div className='main-content'>
              <Router history={history}>
                <Route path='/'>
                  <IndexRoute component={DashView}/>
                  <Route path="dash" component={DashView}/>
                  <Route path="event" component={EventView}/>
                  <Route path="create" component={CreateEventView}/>
                  <Route path="search" component={EventSearch}/>
                  <Route path="calendar" component={Calendar}/>
                </Route>
              </Router>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
