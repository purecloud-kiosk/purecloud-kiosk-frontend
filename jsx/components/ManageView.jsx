'use strict';
import React, { Component } from 'react';
import Modal from './Modal';
import CreateEventForm from './CreateEventForm';
import * as navActions from '../actions/navActions';
import * as eventActions from '../actions/eventActions';
import eventsConstants from '../constants/eventsConstants';
import history from '../history/history';
import eventsStore from '../stores/eventsStore';
import ManageEventManagersView from './ManageEventManagersView';

export default class ManageView extends Component{
  constructor(props){
    super(props);
    this.state = {
      'event' : eventsStore.getCurrentEvent(),
      'menu' : {
        'edit' : true,
        'managers' : false,
        'invites' : false
      },
      'view' : 'edit'
    };
  }
  componentDidMount(){
  
    this.state.eventsStoreListener = eventsStore.addListener(eventsConstants.EVENT_DELETED, navActions.routeToPage.bind(this));
    
  }
  componentWillUnmount(){
    this.state.eventsStoreListener.remove();
  }
  openDeleteModal(){
      console.log("this was called");
      setTimeout(()=>{
        window.dispatchEvent(new Event('resize'));
      },500);
      $('#deleteModal').modal('show');
    }
  handleChangedMind(){
    console.log("Handle close was called");
    $('#deleteModal').modal('hide');

  }  
  handleDeleteButtonClick(page){
    event = eventsStore.getCurrentEvent();
    var state = this.state;
    state.event = event;
    this.setState(state);
    console.log(this.state.event.id);
    this.state.event.eventID = this.state.event.id;
    eventActions.deleteEvent({'eventID': this.state.event.eventID});
    $('#deleteModal').modal('hide');
    navActions.routeToPage("dash");
   
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
    switch(view){
      case 'edit':
        mainContent = (<CreateEventForm event={event} update={true}/>);
        break;
      case 'managers':
        mainContent = (<ManageEventManagersView event={event}/>);
        break;
      case 'invites':
        mainContent = (<div></div>);
    }
    if(event.private){
      invitesButton = (
        <li className={menu.invites ? 'active' : ''}>
          <a onClick={this.menuItemClicked.bind(this, 'edit')}>
            Invites
          </a>
        </li>
      )
    }
    return (
      <div className='text-body'>
        <div className='col-md-12'>
          <div className='display-block'>
            <div className='col-md-1'></div>
            <div className='col-md-10'>
              <h2>Event Management Dashboard</h2>
              <h4>Event: {event.title}</h4>
            </div>
            <div className='col-md-1'></div>
          </div>
        </div>
        <div className='col-md-12'>
          <div className='col-md-1'></div>
          <div className='col-md-3'>
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
              <li className={menu.delete ? 'active' : ''}>
                <a onClick={this.openDeleteModal.bind()}>
                  Delete Event
                </a>
              </li>
              {invitesButton}
            </ul>
          </div>
          <div className='col-md-7'>
            <div className='col-md-12'>{mainContent}</div>
          </div>
          <div className='col-md-1'></div>
        </div>
        <Modal id="deleteModal" title = "Delete Event">
            <div id='selectDelete' style={{'width' : '100%', 'height' : '50px'}}>
              <div>
                <div> Do you want to delete this event?</div>
                <button className = "btn btn-primary btn-sm pull-left text-center" type = "button" onClick = {this.handleDeleteButtonClick.bind(this, "dash")}>Yes</button>
                <button className = "btn btn-primary btn-sm pull-left text-center" type = "button" onClick = {this.handleChangedMind.bind(this)}>NO</button>
              </div>
            </div>
        </Modal>
      </div>
    );
  }
}
