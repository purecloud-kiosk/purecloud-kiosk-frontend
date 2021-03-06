'use strict';
import React, { Component } from 'react';
import * as statsActions from '../actions/statsActions';
import * as eventActions from '../actions/eventActions';
import * as navActions from '../actions/navActions';
import statsStore from '../stores/statsStore';
import navStore from '../stores/navStore';
import navConstants from '../constants/navConstants';
import statsConstants from '../constants/statsConstants';
import i18next from 'i18next';
import Modal from './Modal';

export default class HeaderBar extends Component {
  constructor(props){
    super(props);
    this.state = {
      'stats' : null,
      'notificationMessages' : [],
      'breadcrumbs' : navStore.getBreadcrumbs()
    };
  }
  componentDidMount(){
    this.state.statsListener = statsStore.addListener(statsConstants.USER_STATS_RETRIEVED, this.updateStats.bind(this));
    this.state.notificationListener =
          navStore.addListener(navConstants.NOTIFICATION_RECIEVED, this.addNotification.bind(this));
    this.state.initialNotificationListener =
          navStore.addListener(navConstants.NOTIFICATIONS_RETRIEVED, this.addNotification.bind(this));
    this.state.breadcrumbsListener = navStore.addListener(navConstants.BREADCRUMBS_CHANGE, this.updateBreadcrumbs.bind(this));
    $('#notification-anchor').click(() => {
      this.setNotifications();
    });
    $('#lang-select').val(i18next.language || 'en'); // fallback is en
  }
  onLangChange(e){
    navActions.changeLanguage(e.target.value);
  }
  addNotification(){
    console.log('adding notifications');
    let state = this.state;
    state.notificationMessages = navStore.getNotifications();
    this.setState(state);
  }
  componentWillUnmount(){
    $('#notification-anchor').off();
    this.state.statsListener.remove();
  }
  updateStats(){
    var state = this.state;
    state.stats = statsStore.getUserStats();
    this.setState(state);
  }
  resetCount(){
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
  openLangModal(){
    $('#langModal').modal('show');
  }
  updateBreadcrumbs(){
    this.state.breadcrumbs = navStore.getBreadcrumbs();
    this.setState(this.state);
  }
  setNotifications(){
    console.log('notification called');
    this.state.notificationMessages.forEach((notification) => {
      notification.viewed  = true;
    });
    this.setState(this.state);
  }
  render(){
    let {stats, notificationMessages, breadcrumbs} = this.state;
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
            {i18next.t('NO_NOTIFICATIONS')}
          </a>
        </li>
      );
    }
    else{
      newNotificationCount = 0;
      notificationMessages.forEach((notification) => {
        let nMsg;
        console.log(notification);
        let isNew;
        if(notification.viewed === false){
          newNotificationCount++;
          isNew = <strong>New:</strong>
        }
        if(notification.message.action === "EVENT_INVITE"){
          nMsg = (
              <a className='notification-message' onClick={this.onNotificationClick.bind(this,notification.message)}>
                {isNew} You were invited to <strong>{notification.message.content.title}</strong>
              </a>
          );
        }
        else{
          nMsg = (
              <a className='notification-message' onClick={this.onNotificationClick.bind(this,notification.message)}>
                {isNew} {i18next.t('EVENT_WITH_TITLE')} <strong>{notification.message.content.title}</strong> {i18next.t('CREATED')}
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
                <li className='link'><a href='https://apps.mypurecloud.com/directory/'>{i18next.t('PROFILE')}</a></li>
                <li className='divider'></li>
                <li className='link'><a onClick={this.openLangModal.bind(this)}>{i18next.t('LANGUAGE')}</a></li>
                <li className='divider'></li>
                <li className='link'><a href='https://login.mypurecloud.com/logout'>{i18next.t('LOGOUT')}</a></li>
              </ul>
            </div>
            <div className='item dropdown'>
             <a id='notification-anchor' onClick={this.setNotifications.bind(this)} className='dropdown-toggle col-sm-8' data-toggle='dropdown'>
               <span className='fa-stack'>
                 <i id='notification' className='fa fa-bell-o'></i>
                 <strong id='notification-count' className='fa-stack-1x'>{newNotificationCount}</strong>
               </span>
              </a>
              <ul className='notification-menu dropdown-menu dropdown-menu-right'>
                <li className='dropdown-header'>{i18next.t('NOTIFICATIONS')}</li>
                <li className='divider'></li>
                {notifications}
              </ul>
            </div>
          </div>
          <div className='meta'>
            <div className='page'>
              {i18next.t('DASHBOARD')}
            </div>
            <div className='breadcrumb-links'>
              {i18next.t(breadcrumbs)}
            </div>
          </div>
        </div>
        <Modal id='langModal' title={i18next.t('LANG_SELECT')} cancelText='close'>
          <div className='lang-content'>
            <div className="form-group">
              <label for="sel1">{i18next.t('SELECT_PREFERRED_LANG')}</label>
              <select className="form-control" id="lang-select" onChange={this.onLangChange.bind(this)}>
                <option>en</option>
                <option>test</option>
              </select>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}
