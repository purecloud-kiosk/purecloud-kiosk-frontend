'use strict';
import React, { Component } from 'react';
import Modal from './Modal';
import CreateEventForm from './CreateEventForm';
import * as navActions from '../actions/navActions';
import history from '../history/history';
import * as eventActions from "../actions/eventActions";
import eventsStore from "../stores/eventsStore";
import eventsConstants from "../constants/eventsConstants";


export default class ManageView extends Component{
  constructor(props){
    super(props);
    this.state = {
      'event' : eventsStore.getCurrentEvent(),
      'menu' : {
        'edit' : true,
        'managers' : false
      },
      'view' : false
    };
  }
  componentDidMount(){
  }
  componentWillUnmount(){
  }
  menuItemClicked(key){
    let state = this.state;
    Object.keys(state.menu).forEach((menuKey) =>{
      state.menu[menuKey] = false;
    });
    state.menu[key] = true;
    switch(key){
      case 'edit':
        break;
      case 'managers':
        break;
    }
    this.setState(state);
  }
  render(){
    const {event, menu} = this.state;
    return (
      <div className='text-body'>
        <h2>Event Management Dashboard</h2>
        <h4>Event: {event.title}</h4>
        <div className='col-sm-3'>
          <label>Options Menu</label>
            <ul className="nav nav-pills nav-stacked">
              <li className={menu.edit ? 'active' : ''}><a onClick={this.menuItemClicked.bind(this, 'edit')}>Edit Event Details</a></li>
              <li className={menu.managers ? 'active' : ''}><a onClick={this.menuItemClicked.bind(this, 'managers')}>Event Managers</a></li>
            </ul>
        </div>
        <div className='col-sm-9'>
          <CreateEventForm event={event} update={true}/>
        </div>
      </div>
    );
  }
}
