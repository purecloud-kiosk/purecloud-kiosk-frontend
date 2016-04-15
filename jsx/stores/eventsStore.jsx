"use strict";
/**
 *  This is a pretty basic data store for handling the toggling of side bar.
 **/
import { EventEmitter } from "fbemitter";
import dispatcher from "../dispatchers/dispatcher";
import eventsConstants from "../constants/eventsConstants";

// start out as null
var publicEvents = null;
var privateEvents = null;
var eventsManaging = null;
var pastEventsManaged = null;
var queryResults = null;
var calendarEvents = null;
var eventCheckIns = null;
var checkInCountArray = [];

function setPrivateEvents(events){
  privateEvents = events;
}
function setPublicEvents(events){
  publicEvents = events;
}
function setEventsManaging(events){
  eventsManaging = events;
}
function setPastEventsManaged(events){
  pastEventsManaged = events;
}
function setUpdateFlag(bool){
  updateFlag = bool;
}
function setSearchResults(query){
  queryResults = query;
}
function setCalendarEvents(events){
  calendarEvents = events;
}
function setCheckInCountArray(countArray){
  checkInCountArray = countArray;
}


class EventsStore extends EventEmitter{
  getPublicEvents(){
    return publicEvents;
  }
  getPrivateEvents(){
    return privateEvents;
  }
  getUpcomingEventsManaging(){
    return eventsManaging;
  }
  getPastEventsManaged(){
    return pastEventsManaged;
  }
  eventSearchResults(){
    return queryResults;
  }
  getCalendarEvents(){
    return calendarEvents;
  }
  getCheckInCountArray(){
    return checkInCountArray;
  }
}

var eventsStore = new EventsStore();

// register for data from dispatcher
dispatcher.register(function(payload){
  switch(payload.actionType){
    case eventsConstants.UPCOMING_EVENTS_MANAGING_RETRIEVED:
      setEventsManaging(payload.data);
      break;
    case eventsConstants.PAST_EVENTS_MANAGING_RETRIEVED:
      setPastEventsManaged(payload.data);
      break;
    case eventsConstants.PUBLIC_EVENTS_RETRIEVED:
      setPublicEvents(payload.data);
      break;
    case eventsConstants.PRIVATE_EVENTS_RETRIEVED:
      setPrivateEvents(payload.data);
      break;
    case eventsConstants.EVENT_SEARCHED:
      setSearchResults(payload.data);
      break;
    case eventsConstants.CAL_EVENTS_FETCHED:
      setCalendarEvents(payload.data);
      break;
    default:
      //no op
        break;
  }
  // event created will still be emitted
  eventsStore.emit(payload.actionType);
});

export default eventsStore;
