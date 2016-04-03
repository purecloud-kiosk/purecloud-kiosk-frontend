'use strict';
import React, { Component } from 'react';
import * as statsActions from '../actions/statsActions';
import statsStore from '../stores/statsStore';
import statsConstants from '../constants/statsConstants';

export default class HeaderBar extends Component {
  constructor(props){
    super(props);
    this.state = {stats : null};
  }
  componentDidMount(){
    this.state.statsListener = statsStore.addListener(statsConstants.USER_STATS_RETRIEVED, this.updateStats.bind(this));
  }
  componentWillUnmount(){
    this.state.statsListener.remove();
  }
  updateStats(){
    var state = this.state;
    state.stats = statsStore.getUserStats();
    this.setState(state);
  }
  render(){
    var {stats} = this.state;
    if(stats == null)
      stats = {'name': '', 'organization' : '', 'image' : '/img/avatar.jpg'};
    else if(stats.image == null)
      stats.image = '/img/avatar.jpg';
    console.log(stats.image);
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
             <a href='javascript:void(0);' className='dropdown-toggle' data-toggle='dropdown'>
                <i id='notification' className='fa fa-bell-o'></i>
              </a>
              <ul className='dropdown-menu dropdown-menu-right'>
                <li className='dropdown-header'>Notifications</li>
                <li className='divider'></li>
                <li><a href='javascript:void(0);'>Server Down!</a></li>
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
