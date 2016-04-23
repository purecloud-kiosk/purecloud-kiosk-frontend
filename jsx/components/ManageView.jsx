'use strict';
import React, { Component } from 'react';
import i18next from 'i18next';
import Modal from './Modal';
import CreateEventForm from './CreateEventForm';
import * as navActions from '../actions/navActions';
import * as eventActions from '../actions/eventActions';
import eventsConstants from '../constants/eventsConstants';
import history from '../history/history';
import eventDetailsStore from '../stores/eventDetailsStore';
import eventsStore from '../stores/eventsStore';
import ManageEventManagersView from './ManageEventManagersView';
import ManageInvitesView from './ManageInvitesView';
import ManageEventFilesView from './ManageEventFilesView';
export default class ManageView extends Component{
  constructor(props){
    super(props);
    this.state = {
      'event' : eventDetailsStore.getCurrentEvent(),
      'menu' : {
        'edit' : true,
        'managers' : false,
        'invites' : false,
        'files' : false
      },
      'view' : 'edit'
    };
  }
  componentDidMount(){
    //listener for delete
    this.state.eventsStoreListener = eventsStore.addListener(eventsConstants.EVENT_DELETED, navActions.routeToPage.bind(this));

  }
  componentWillUnmount(){
    this.state.eventsStoreListener.remove();
  }
  //this is the call to open modal to delete event
  openDeleteModal(){
      console.log("delete modal was called");
      setTimeout(()=>{
        window.dispatchEvent(new Event('resize'));
      },500);
      $('#deleteModal').modal('show');
    }
  //this simply releases the delete modal
  handleChangedMind(){
    console.log("Handle close was called");
    $('#deleteModal').modal('hide');

  }
  //the event is deleted using the event id
  handleDeleteButtonClick(page){
    event = eventDetailsStore.getCurrentEvent();
    var state = this.state;
    state.event = event;
    this.setState(state);
    console.log(this.state.event.id);
    this.state.event.eventID = this.state.event.id;
    eventActions.deleteEvent({'eventID': this.state.event.eventID});
    $('#deleteModal').modal('hide');
    //then routed to dash view
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
      case 'files':
        mainContent = (<ManageEventFilesView event={event}/>);
        break;
    }
    // show invites button if the event is private
    if(event.private){
      invitesButton = (
        <li className={menu.invites ? 'active' : ''}>
          <a onClick={this.menuItemClicked.bind(this, 'invites')}>
            {i18next.t('INVITES')}
          </a>
        </li>
      )
    }
    return (
      <div>
        <div className='col-md-12'>
          <div className='display-block'>
            <div className='col-md-10 col-md-offset-1'>
              <h2>{i18next.t('EVENT_MANAGEMENT_DASHBOARD')}</h2>
              <h4>{i18next.t('EVENT')} {event.title}</h4>
            </div>
            <div className='col-md-1'></div>
          </div>
        </div>
        <div className='col-md-12'>
          <div className='col-md-3 col-md-offset-1'>
            <label>{i18next.t('OPTIONS_MENU')}</label>
            <ul className="nav nav-pills nav-stacked">
              <li className={menu.edit ? 'active' : ''}>
                <a onClick={this.menuItemClicked.bind(this, 'edit')}>
                  {i18next.t('EDIT_EVENT_DETAILS')}
                </a>
              </li>
              <li className={menu.files ? 'active' : ''}>
                <a onClick={this.menuItemClicked.bind(this, 'files')}>
                  {i18next.t('FILES')}
                </a>
              </li>
              <li className={menu.managers ? 'active' : ''}>
                <a onClick={this.menuItemClicked.bind(this, 'managers')}>
                  {i18next.t('EVENT_MANAGERS')}
                </a>
              </li>
              <li className={menu.delete ? 'active' : ''}>
                <a onClick={this.openDeleteModal.bind()}>
                  {i18next.t('DELETE_EVENT')}
                </a>
              </li>
              {invitesButton}
            </ul>
          </div>
          <div className='col-md-7'>
            <div className='col-md-12'>{mainContent}</div>
          </div>
        </div>
        <Modal id="deleteModal" title = "Delete Event" submitText={i18next.t('YES')}
          submitCallback={this.handleDeleteButtonClick.bind(this, "dash")} cancelText='No'>
                <div>{i18next.t('DELETE_WARNING')}</div>
        </Modal>
      </div>
    );
  }
}
