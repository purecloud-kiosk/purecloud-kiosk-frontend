'use strict';
import React, { Component } from 'react';
import Modal from './Modal';
import CreateEventForm from './CreateEventForm';
import * as navActions from '../actions/navActions';
import history from '../history/history';
import * as eventsActions from "../actions/eventsActions";
import eventsStore from "../stores/eventsStore";
import eventsConstants from "../constants/eventsConstants";
export default class Calendar extends Component{
  constructor(props){
    super(props);
    this.state = {
      'calendarEventListener' : null,
      'selectedDate' :  null
    };
  }

  componentDidMount(){
    this.state.calendarEventListener = eventsStore.addListener(eventsConstants.CAL_EVENTS_FETCHED, this.loadEvents.bind(this));

    console.log('init calendar');
    var self = this;
    $('#calendar').fullCalendar({
      'eventLimit' : 3,
      'height' : $('.main-content').height() - 50,
      'windowResize': (view) => {
        $('#calendar').fullCalendar('option' , 'height',  $('.main-content').height() - 50);
      },
      'customButtons' : {
        'customPrev' : {
          'text' : 'prev',
          'click' : () => {
              $('#calendar').fullCalendar('prev');
              self.retrieveEvents();
          }
        },
        'customNext' : {
          'text' : 'next',
          'click' : () => {
              $('#calendar').fullCalendar('next');
              self.retrieveEvents();
          }
        },
        'customMonth' : {
          'text' : 'month',
          'click' : () => {
              $('#calendar').fullCalendar('changeView', 'month');
              self.retrieveEvents();
          }
        },
        'customAgendaWeek' : {
          'text' : 'week',
          'click' : () => {
              $('#calendar').fullCalendar('changeView', 'agendaWeek');
              self.retrieveEvents();
          }
        },
        'refresh' : {
          'text' : 'refresh',
          'click' : () => {self.retrieveEvents();}
        }
      },
      'header': {
          'left': 'customPrev,customNext,refresh',
          'center': 'title',
          'right': 'customMonth,customAgendaWeek,agendaDay'
      },
      'eventClick' : (calEvent, jsEvent, view) => {
        console.log(calEvent.title);
        eventsActions.setCurrentEvent(calEvent.event);
        navActions.routeToPage('event');
      },
      'dayClick' : (date) => {
        console.log('clicked');
        var state = self.state;
        state.selectedDate = date.format();
        self.setState(state);
        $('#createEventModal').modal('show');
      }
    });

    $('#createEventModal').on('hidden.bs.modal', () =>{
      setTimeout(() => this.retrieveEvents(), 2000);
    });
    $('#createEventModal').on('shown.bs.modal', (e) => {
      $('#eventTitleInput').focus();
    });
    this.state.before = Date.now() + (24*14*60*60*1000);
    this.state.after = Date.now() - (24*14*60*60*1000);
    eventsActions.getCalendarEvents(this.state.before, this.state.after);
    //$('#calendar').fullCalendar('changeView', 'basicWeek');
  }
  retrieveEvents(){
    $('#calendar').fullCalendar('removeEvents');
    var view = $('#calendar').fullCalendar('getView');
    eventsActions.getCalendarEvents(view.end.format('MM/DD/YYYY'), view.start.format('MM/DD/YYYY'));
  }
  componentWillUnmount(){

    console.log(this.state.calendar);
    $('#calendar').fullCalendar('destroy');
    this.state.calendarEventListener.remove();
  }
  loadEvents(){
    var events = eventsStore.getCalendarEvents();
    var calEvents = [];
    var time = Date.now();
    for(var i = 0; i < events.length; i++){
      var event = {
        'title' : events[i].title,
        'id' : events[i].id,
        'start' : events[i].startDate,
        'end' : events[i].endDate,
        'event' : events[i]
      };
      if(events[i].private)
        event.color = 'red';
      calEvents.push(event);
    }
    console.log(Date.now() - time);
    this.state.source = calEvents;
    $('#calendar').fullCalendar('addEventSource', this.state.source);
    console.log($('#calendar').fullCalendar('getView'));
  }
  render(){
    var alert = (
      <div className="alert alert-info animated fadeInDown">
        <a href="#" className="close" data-dismiss="alert" aria-label="close">&times;</a>
        Click on an empty spot on the calendar to create an event.
      </div>
    );
    return (
      <div className='calendar-content'>
        {alert}
        <div id='calendar-wrapper' className='animated fadeInDown'>
          <div id='calendar'></div>
        </div>
        <Modal id='createEventModal' title='Create Event'>
          <CreateEventForm/>
        </Modal>
      </div>
    );
  }
}
