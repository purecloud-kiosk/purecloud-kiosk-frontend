'use strict';
import React, { Component } from 'react';
import Modal from './Modal';
import CreateEventForm from './CreateEventForm';
import * as navActions from '../actions/navActions';
import history from '../history/history';
import * as eventActions from "../actions/eventActions";
import eventsStore from "../stores/eventsStore";
import eventsConstants from "../constants/eventsConstants";
import i18next from 'i18next';
export default class Calendar extends Component{
  constructor(props){
    super(props);
    this.state = {
      'calendarEventListener' : null,
      'selectedDate' :  null
    };
  }

  componentDidMount(){
    this.state.calendarEventListener =
      eventsStore.addListener(eventsConstants.CAL_EVENTS_FETCHED, this.loadEvents.bind(this));
    console.log('init calendar');
    var self = this;
    $('#calendar').fullCalendar({
      'eventLimit' : 3,
      'allDaySlot' : false,
      'timezone' : 'local',
      'height' : $('.main-content').height() - 50,
      'windowResize': (view) => {
        $('#calendar').fullCalendar('option' , 'height',  $('.main-content').height() + 100);
      },
      'customButtons' : {
        'customPrev' : {
          'text' : i18next.t('PREV'),
          'click' : () => {
              $('#calendar').fullCalendar('prev');
              self.retrieveEvents();
          }
        },
        'customNext' : {
          'text' : i18next.t('NEXT'),
          'click' : () => {
              $('#calendar').fullCalendar('next');
              self.retrieveEvents();
          }
        },
        'customMonth' : {
          'text' : i18next.t('MONTH'),
          'click' : () => {
              $('#calendar').fullCalendar('changeView', 'month');
              self.retrieveEvents();
          }
        },
        'customAgendaWeek' : {
          'text' : i18next.t('WEEK'),
          'click' : () => {
              $('#calendar').fullCalendar('changeView', 'agendaWeek');
              self.retrieveEvents();
          }
        },
        'customAgendaWeek' : {
          'text' : i18next.t('DAY'),
          'click' : () => {
              $('#calendar').fullCalendar('changeView', 'agendaDay');
              self.retrieveEvents();
          }
        },
        'refresh' : {
          'text' : i18next.t('REFRESH'),
          'click' : () => {self.retrieveEvents();}
        }
      },
      'header': {
          'left': 'customPrev,customNext,refresh',
          'center': 'title',
          'right': 'customMonth,customAgendaWeek,customDay'
      },
      'eventClick' : (calEvent, jsEvent, view) => {
        console.log(calEvent.title);
        eventActions.setCurrentEvent(calEvent.event);
        navActions.routeToPage('event');
      },
      'dayClick' : (date) => {
        if(date.isAfter(moment().subtract(1, 'day'))){
          var state = self.state;
          state.selectedDate = date;
          //state.selectedDate = date.format('LL') + '|' + date.format('LT');
          self.setState(state);
          console.log(self.state);
          $('#createEventModal').modal('show');
        }
      },
      'dayRender' :  (date, cell) => {
        if(date.isAfter(moment())){
          cell.css('background', '#FFFFFF');
        }
      }
    });

    $('#createEventModal').on('hidden.bs.modal', () =>{
      this.retrieveEvents();
    });
    $('#createEventModal').on('shown.bs.modal', (e) => {
      $('#eventTitleInput').focus();
    });
    this.retrieveEvents();
    //$('#calendar').fullCalendar('changeView', 'basicWeek');
  }
  retrieveEvents(){
    $('#calendar').fullCalendar('removeEvents');
    var view = $('#calendar').fullCalendar('getView');
    eventActions.getCalendarEvents(view.end.format('MM/DD/YYYY'), view.start.format('MM/DD/YYYY'));
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
  createEvent(){
    eventActions.submitForm();
  }
  render(){
    var {selectedDate} = this.state;
    var alert = (
      <div className="alert alert-info animated fadeInDown">
        <a href="#" className="close" data-dismiss="alert" aria-label="close">&times;</a>
        {i18next.t('CALENDAR_ALERT')}
      </div>
    );
    console.log('rerendered');
    console.log(selectedDate);
    return (
      <div className='calendar-content'>
        {alert}
        <div id='calendar-wrapper' className='animated fadeInDown'>
          <div id='calendar'></div>
        </div>
        <Modal id='createEventModal' title='Create Event' size='modal-lg' submitCallback={this.createEvent.bind(this)}>
          <CreateEventForm startDate={selectedDate} hideButton={true}/>
        </Modal>
      </div>
    );
  }
}
