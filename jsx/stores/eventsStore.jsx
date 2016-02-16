"use strict";
/**
 *  This is a pretty basic data store for handling the toggling of side bar.
 **/
import { EventEmitter } from "fbemitter";
import dispatcher from "../dispatchers/dispatcher";
import eventsConstants from "../constants/eventsConstants";

var publicEvents = [];
var privateEvents = [];
var eventsManaging = [];
var currentEvent = null;
var updateFlag = false;

function setPrivateEvents(events){
  privateEvents = events;
}
function setPublicEvents(events){
  publicEvents = events;
}
function setEventsManaging(events){
  eventsManaging = events;
}

function setCurrentEvent(event){
  currentEvent = event;
}

function storeCreatedEvent(event){
  createEvent = event;
}
function setUpdateFlag(bool){
  updateFlag = bool;
}

class EventsStore extends EventEmitter{
  getPublicEvents(){
    return publicEvents;
  }
  getPrivateEvents(){
    return privateEvents;
  }
  getEventsManaging(){
    return eventsManaging;
  }
  getCurrentEvent(){
    return currentEvent;
  }
  updateIsSet(){
    return updateFlag;
  }
}

var eventsStore = new EventsStore();

// register for data from dispatcher
dispatcher.register(function(payload){
  switch(payload.actionType){
    case eventsConstants.EVENTS_MANAGING_RETRIEVED:
      setEventsManaging(payload.data);
      break;
    case eventsConstants.PUBLIC_EVENTS_RETRIEVED:
      setPublicEvents(payload.data);
      break;
    case eventsConstants.PRIVATE_EVENTS_RETRIEVED:
      setPrivateEvents(payload.data);
      break;
    case eventsConstants.CURRENT_EVENT_SET:
      setCurrentEvent(payload.data);
      break;
      //case event is being updated
      case eventsConstants.FLAG_UPDATE_SET:
      setUpdateFlag(payload.data);
      break;
    default:
      //no op
        break;
  }
  // event created will still be emitted
  eventsStore.emit(payload.actionType);
});

export default eventsStore;
