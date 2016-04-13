'use strict';
import React, { Component } from 'react';
import Modal from './Modal';
import CreateEventForm from './CreateEventForm';
import * as navActions from '../actions/navActions';
import history from '../history/history';
import * as eventActions from "../actions/eventActions";
import eventsStore from "../stores/eventsStore";
import pureCloudStore from '../stores/pureCloudStore';
import eventsConstants from "../constants/eventsConstants";
import pureCloudConstants from '../constants/pureCloudConstants';
import UserWidget from './UserWidget';
import PeopleTypeAhead from './PeopleTypeAhead';
import ManagerWidget from './ManagerWidget';

export default class ManageView extends Component{
  constructor(props){
    super(props);
    this.state = {
      'event' : eventsStore.getCurrentEvent(),
      'menu' : {
        'edit' : true,
        'managers' : false
      },
      'data':{
        'managers' : [],
        'managerSearchResults' : []
      },
      'view' : 'edit'
    };
  }
  componentDidMount(){
    this.state.eventManagerListener =
      eventsStore.addListener(eventsConstants.EVENT_MANAGERS_RETRIEVED, this.updateEventManagers.bind(this));
    this.state.pureCloudSearchListener =
      pureCloudStore.addListener(pureCloudConstants.USER_SEARCH_RETRIEVED, this.updateManagerSearchResults.bind(this));
    this.state.bulkCheckInListener =
      eventsStore.addListener(eventsConstants.BULK_CHECKINS_RETRIEVED, this.updateManagerStatus.bind(this));
    eventActions.getEventManagers(this.state.event.id);
  }
  updateManagerSearchResults(){
    let state = this.state;
    let personIDs = '';
    state.data.managerSearchResults = pureCloudStore.getSearchResults();
    state.data.managerSearchResults = state.data.managerSearchResults.map((user) => {
      personIDs += user._id + ',';
      let data = {
        'name' : user.general.name[0].value,
        'email' : user.primaryContactInfo.email[0].ref,
        'personID' : user._id,
        'eventManager' : null,
        'image' : user._id,
        'orgGuid'  : state.event.orgGuid
      };
      if(user.images !== undefined)
        data.image = user.images.profile[0].ref.x200;
      return data;
    });
    console.log('sending personIDs');
    eventActions.bulkRetrieveCheckIns(this.state.event.id, personIDs);
    this.setState(state);
  }
  updateManagerStatus(){
    console.log('Updated')
    let state = this.state;
    let managers = eventsStore.getBulkRetrievedCheckIns();
    let ids = [];
    managers.forEach((manager) => {
      if(manager.eventManager)
        ids.push(manager.personID);
    });
    state.data.managerSearchResults.forEach((user) => {
      console.log(user);
      if(ids.indexOf(user.personID) != -1)
        user.eventManager = true;
      else
        user.eventManager = false;
    });
    this.setState(state);
  }
  updateEventManagers(){
    let state = this.state;
    state.data.managers = eventsStore.getEventManagers();
    this.setState(state);
  }
  componentWillUnmount(){
    this.state.eventManagerListener.remove();
    this.state.pureCloudSearchListener.remove();
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
    let mainContent;
    switch(view){
      case 'edit':
        mainContent = (
          <div className=''>
            <CreateEventForm event={event} update={true}/>
          </div>
        );
        break;
      case 'managers':
        mainContent = (
          <div className='col-sm-12'>
            <PeopleTypeAhead id='managerTypeAhead'/>
            <ManagerWidget title='Search Results' event={event} users={data.managerSearchResults}/>
            <UserWidget title='Event Managers' users={data.managers}/>
          </div>
        );
        break;
    }
    return (
      <div className='text-body'>
        <div className='col-sm-12'>
          <div className='display-block'>
            <div className='col-sm-1'></div>
            <div className='col-sm-10'>
              <h2>Event Management Dashboard</h2>
              <h4>Event: {event.title}</h4>
            </div>
            <div className='col-sm-1'></div>
          </div>
        </div>
        <div className='col-sm-12'>
          <div className='col-sm-1'></div>
          <div className='col-sm-3'>
            <label>Options Menu</label>
              <ul className="nav nav-pills nav-stacked">
                <li className={menu.edit ? 'active' : ''}><a onClick={this.menuItemClicked.bind(this, 'edit')}>Edit Event Details</a></li>
                <li className={menu.managers ? 'active' : ''}><a onClick={this.menuItemClicked.bind(this, 'managers')}>Event Managers</a></li>
              </ul>
          </div>
          <div className='col-sm-7'>
            {mainContent}
          </div>
          <div className='col-sm-1'></div>
        </div>

      </div>
    );
  }
}
