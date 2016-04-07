'use strict';
import React, { Component } from 'react';
import { Router, Route, IndexRoute } from 'react-router';
import navConstants from '../constants/navConstants';
import navStore from '../stores/navStore';
import history from '../history/history';
// import components
import SideBar from './SideBar';
import HeaderBar from './HeaderBar';
import DashView from './DashView';
import EventView from './EventView';
import CreateEventView from './CreateEventForm';
import EventSearch from "./EventSearch";
import Calendar from "./Calendar";
import requestConstants from '../constants/requestConstants';
export default class App extends Component{
  constructor(props){
    super(props);
    this.state = {
      isOpen : navStore.sideBarIsOpen()
    };

  }
  updateToggle(){
    console.log('listener called');
    console.log(navStore.sideBarIsOpen());
    this.setState({
      isOpen : navStore.sideBarIsOpen()
    });
  }
  componentDidMount(){
    navStore.addListener(navConstants.SIDEBAR_TOGGLED, this.updateToggle.bind(this));
    $('.dropdown-toggle').dropdown();
    // init socket connection
    var socket = io('http://localhost:8080/ws');
    socket.on('connect', ()=>{
      console.log('connected');
      socket.emit('auth', {'token': requestConstants.AUTH_TOKEN});
      setTimeout(() => {
        socket.emit('sub', '570191f469105817273dbabf');
      }, 5000);
      socket.on('subResponse', ()=> {
        console.log('subbed');
      });
      socket.on('error', (error)=> {
        console.log(error);
      });
      socket.on('disconnect', () => {
        console.log('disconnected');
      });
      socket.on('reconnect', () => {
        console.log('reconnected');
      });
    });
  }
  render(){
    return (
      <div id='page-wrapper' className={this.state.isOpen ? 'open' : null}>
        <SideBar/>
        <div id='content-wrapper'>
          <div className='page-content'>
            <HeaderBar/>
            <div className='main-content'>
              <Router history={history}>
                <Route path='/'>
                  <IndexRoute component={DashView} />
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
