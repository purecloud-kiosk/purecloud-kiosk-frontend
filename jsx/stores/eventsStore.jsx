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
var currentEvent = null;
var updateFlag = false;
var queryResults = null;
var calendarEvents = null;
var eventCheckIns = null;
var checkInCountArray = null;
var eventFiles = null;
var ThumbImage = null;
var UrlImage = null;
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
function setCurrentEvent(event){
  currentEvent = event;
}

function storeCreatedEvent(event){
  createEvent = event;
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
function setCheckIns(checkIns){
  eventCheckIns = checkIns;
}
function setImageThumbCrop(tempImage){
  ThumbImage = tempImage;
}
function setImageUrlCrop(tempImage){
  UrlImage = tempImage;
}

function setCheckInCountArray(countArray){
  checkInCountArray = countArray;
}

function setEventFiles(files){
  eventFiles = files;
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
  getCurrentEvent(){
    return currentEvent;
  }
  getCheckIns(){
    return eventCheckIns;
  }
  updateIsSet(){
    return updateFlag;
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
  getEventFiles(){
    return eventFiles;
  }
  getThumbImageCrop(){
    return ThumbImage;
  }
  getUrlImageCrop(){
    return UrlImage;
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
    case eventsConstants.CURRENT_EVENT_SET:
      setCurrentEvent(payload.data);
      break;
    case eventsConstants.FLAG_UPDATE_SET:
      setUpdateFlag(payload.data);
      break;
    case eventsConstants.EVENT_SEARCHED:
      setSearchResults(payload.data);
      break;
    case eventsConstants.EVENT_CHECKINS_RETRIEVED:
      setCheckIns(payload.data);
      break;
    case eventsConstants.EVENT_CHECKIN_COUNTS_RETRIEVED:
      setCheckInCountArray(payload.data);
      break;
    case eventsConstants.EVENT_FILES_RETRIEVED:
      console.log('right here');
      setEventFiles(payload.data);
      break;
    case eventsConstants.CAL_EVENTS_FETCHED:
      setCalendarEvents(payload.data);
      break;
    case eventsConstants.IMAGE_THUMB_STORED:
      setImageThumbCrop(payload.data.imageUrl);
      break;
      case eventsConstants.IMAGE_URL_STORED:
      setImageUrlCrop(payload.data.imageUrl);
      break;
    default:
      //no op
        break;
  }
  // event created will still be emitted
  eventsStore.emit(payload.actionType);
});

export default eventsStore;
