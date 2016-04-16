'use strict';
import React, { Component } from 'react';
import * as statsActions from '../actions/statsActions';
import * as eventActions from '../actions/eventActions';
import * as navActions from '../actions/navActions';
import statsStore from '../stores/statsStore';
import navStore from '../stores/navStore';
import navConstants from '../constants/navConstants';
import statsConstants from '../constants/statsConstants';

export default class HeaderBar extends Component {
  constructor(props){
    super(props);
    this.state = {'stats' : null, 'notificationMessages' : []};
  }
  componentDidMount(){
    this.state.statsListener = statsStore.addListener(statsConstants.USER_STATS_RETRIEVED, this.updateStats.bind(this));
    this.state.notificationListener =
          navStore.addListener(navConstants.NOTIFICATION_RECIEVED, this.addNotification.bind(this));
    this.state.initialNotificationListener =
          navStore.addListener(navConstants.NOTIFICATIONS_RETRIEVED, this.addNotification.bind(this));
  }
  addNotification(){
    console.log('adding notifications');
    let state = this.state;
    state.notificationMessages = navStore.getNotifications();
    this.setState(state);
  }
  componentWillUnmount(){
    this.state.statsListener.remove();
  }
  updateStats(){
    var state = this.state;
    state.stats = statsStore.getUserStats();
    this.setState(state);
  }
  resetCount(){
    let state = this.state;
    console.log(state.notificationMessages);
    state.notificationMessages.forEach((notification) => {
      notification.viewed = true;
    });
    this.setState(state);
  }
  onNotificationClick(message){
    console.log('clicked');
    console.log(message);
    switch(message.action){
      case "EVENT_CREATED":
        eventActions.setCurrentEvent(message.content);
        navActions.routeToPage('event');
        navActions.refresh();
        break;
    }
  }
  render(){
    let {stats, notificationMessages} = this.state;
    let notifications= [];
    let newNotificationCount = null;
    if(stats == null) // fill with empty data if null
      stats = {'name': '', 'organization' : '', 'image' : '/img/avatar.jpg'};
    else if(stats.image == null)
      stats.image = '/img/avatar.jpg';
    console.log(stats.image);
    // make notifications
    if(notificationMessages.length === 0){
      notifications.push(
        <li className='notification-message'>
          <a href='javascript:void(0);'>
            No new notifications
          </a>
        </li>
      );
    }
    else{
      newNotificationCount = 0;
      notificationMessages.forEach((notification) => {
        let nMsg;
        if(notification.viewed === false){
          newNotificationCount++;
          nMsg = (
              <a className='notification-message'
                onClick={this.onNotificationClick.bind(this,notification.message)}>
                An event with the title <strong>{notification.message.content.title}</strong> has been created
              </a>
          );
        }
        else{
          nMsg = (
              <a className='notification-message' onClick={this.onNotificationClick.bind(this,notification.message)}>
                <strong>New:</strong>
                An event with the title <strong>{notification.content.title}</strong> has been created
              </a>
          );
        }
        notifications.push(nMsg);
        notifications.push(<li className='divider'></li>);
      });
      notifications.pop(); // pop that last divider off
      newNotificationCount = newNotificationCount === 0 ? null : newNotificationCount;
    }
    return (
      <div className='row header'>
        <div className='col-xs-12'>
          <div className='user pull-right'>
            <div className='item dropdown'>
              <a href='javascript:void(0);' className='dropdown-toggle' data-toggle='dropdown'>
                <img src={stats.image} onerror='this.onerror = null; this.src="/dist/img/avatar.jpg"'/>
              </a>
              <ul className='dropdown-menu dropdown-menu-right'>
                <li className='dropdown-header'>{stats.name}</li>
                <li className='divider'></li>
                <li className='link'><a href='https://apps.mypurecloud.com/directory/'>Profile</a></li>
                <li className='divider'></li>
                <li className='link'><a href='https://login.mypurecloud.com/logout'>Logout</a></li>
              </ul>
            </div>
            <div className='item dropdown'>
             <a id='notification-anchor' href='javascript:void(0);' className='dropdown-toggle col-sm-8' data-toggle='dropdown'>
               <span className='fa-stack'>
                 <i id='notification' className='fa fa-bell-o'></i>
                 <strong id='notification-count' className='fa-stack-1x'>{newNotificationCount}</strong>
               </span>
              </a>
              <ul className='notification-menu dropdown-menu dropdown-menu-right'>
                <li className='dropdown-header'>Notifications</li>
                <li className='divider'></li>
                {notifications}
              </ul>
            </div>
          </div>
          <div className='meta'>
            <div className='page'>
              {stats.organization} Dashboard
            </div>
            <div className='breadcrumb-links'>
              Home / Dashboard
            </div>
          </div>
        </div>
      </div>
    );
  }
}
