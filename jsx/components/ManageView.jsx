'use strict';
import React, { Component } from 'react';
import Modal from './Modal';
import CreateEventForm from './CreateEventForm';
import * as navActions from '../actions/navActions';
import history from '../history/history';
import eventDetailsStore from '../stores/eventDetailsStore';

import ManageEventManagersView from './ManageEventManagersView';
import ManageInvitesView from './ManageInvitesView';
export default class ManageView extends Component{
  constructor(props){
    super(props);
    this.state = {
      'event' : eventDetailsStore.getCurrentEvent(),
      'menu' : {
        'edit' : true,
        'managers' : false,
        'invites' : false
      },
      'view' : 'edit'
    };
  }
  menuItemClicked(key){
    let state = this.state;
    Object.keys(state.menu).forEach((menuKey) =>{
      state.menu[menuKey] = false;
    });
    state.menu[key] = true;
    state.view = key;
    this.setState(state);
  }
  render(){
    const {event, menu, data, view} = this.state;
    let mainContent, invitesButton;
    // swap views
    switch(view){
      case 'edit':
        mainContent = (<CreateEventForm event={event} update={true}/>);
        break;
      case 'managers':
        mainContent = (<ManageEventManagersView event={event}/>);
        break;
      case 'invites':
        mainContent = (<ManageInvitesView event={event}/>);
        break;
    }
    // show invites button if the event is private
    if(event.private){
      invitesButton = (
        <li className={menu.invites ? 'active' : ''}>
          <a onClick={this.menuItemClicked.bind(this, 'invites')}>
            Invites
          </a>
        </li>
      )
    }
    return (
      <div className='text-body'>
        <div className='col-md-12'>
          <div className='display-block'>
            <div className='col-md-10 col-md-offset-1'>
              <h2>Event Management Dashboard</h2>
              <h4>Event: {event.title}</h4>
            </div>
            <div className='col-md-1'></div>
          </div>
        </div>
        <div className='col-md-12'>
          <div className='col-md-3 col-md-offset-1'>
            <label>Options Menu</label>
            <ul className="nav nav-pills nav-stacked">
              <li className={menu.edit ? 'active' : ''}>
                <a onClick={this.menuItemClicked.bind(this, 'edit')}>
                  Edit Event Details
                </a>
              </li>
              <li className={menu.managers ? 'active' : ''}>
                <a onClick={this.menuItemClicked.bind(this, 'managers')}>
                  Event Managers
                </a>
              </li>
              {invitesButton}
            </ul>
          </div>
          <div className='col-md-7'>
            <div className='col-md-12'>{mainContent}</div>
          </div>
        </div>

      </div>
    );
  }
}
