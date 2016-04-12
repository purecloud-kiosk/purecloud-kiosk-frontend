'use strict';
import React, { Component } from 'react';
import * as navActions from '../actions/navActions';
import * as eventActions from '../actions/eventActions';

import LoadingIcon from './LoadingIcon';

export default class EventsTable extends Component {
  constructor(props){
    super(props);
  }
  componentDidMount(){
     $('[data-toggle="tooltip"]').tooltip();
  }
  handleRowClick(eventNum){
    eventActions.setCurrentEvent(this.props.events[eventNum]);
    navActions.routeToPage('event');
  }
  render(){
    var {title, events, faIcon, loading} = this.props;
    var rows = [], content;
    if(events === null || loading){
      content = (<LoadingIcon/>);
    }
    else{
      for(var i = 0; i < events.length; i++){
        rows.push(
          <tr className='animated fadeInLeft' key={events[i].title} onClick={this.handleRowClick.bind(this, i)}>
            <td>{events[i].title}</td>
            <td>{moment(events[i].startDate).format('LT')}</td>
            <td>{events[i].location}</td>
          </tr>
        );
      }
      if(rows.length == 0){ // there is no data
        content = (<div className='text-center'><p>There are no events to show</p></div>);
      }
      else{
        content = (
          <div className='table-responsive'>
            <table className='table table-hover'>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Date</th>
                  <th>Location</th>
                </tr>
              </thead>
              <tbody>
                {rows}
              </tbody>
            </table>
          </div>
        );
      }
    }
    return(
      <div className='event-table'>
        <div className='widget animated fadeInDown'>
          <div className='widget-header'>
            <i className={'fa ' + faIcon}></i>
            {title}
          </div>
          <div className={'widget-body ' + this.props.size +  ' no-padding'}>
            {content}
          </div>
        </div>
      </div>
    );
  }
}
