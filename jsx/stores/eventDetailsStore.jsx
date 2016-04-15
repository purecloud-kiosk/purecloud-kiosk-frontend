"use strict";
/**
 *  This is a pretty basic data store for handling the toggling of side bar.
 **/
import { EventEmitter } from "fbemitter";
import dispatcher from "../dispatchers/dispatcher";
import eventsConstants from "../constants/eventsConstants";

// data stores
var ThumbImage = null;
var UrlImage = null;
var eventFiles = null;
var eventManagers = [];
var eventFeed = [];
var user = null;
var bulkCheckIns = [];
var removedManager = null;
var addedManager = null;
var removedAttendee = null;
var addedAttendee = null;
var invites = [];
var error = null;
var currentEvent = null;
var updateFlag = false;

function setEventManagers(managers){
  eventManagers = managers;
}
function setUpdateFlag(flag){
  updateFlag = flag;
}
function setCurrentEvent(event){
  currentEvent = event;
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
function setEventFiles(files){
  eventFiles = files;
}
function setEventFeed(feed){
  eventFeed = feed.reverse();
}
function addMessage(message){
  eventFeed.unshift(message);
}
function setUser(newUser){
  user = newUser;
}
function setBulkCheckIns(checkIns){
  bulkCheckIns = checkIns;
}
function setRemovedManager(personID){
  removedManager = personID;
}
function setAddedManager(manager){
  addedManager = manager;
}
function setInvites(people){
  invites = people
}
function setAddedAttendee(user){
  addedAttendee = user;
}
function setRemovedAttendee(personID){
  removedAttendee = personID;
}
function setError(e){
  error = e;
}

class EventDetailsStore extends EventEmitter{
  getCurrentEvent(){
    return currentEvent;
  }
  getCheckIns(){
    return eventCheckIns;
  }
  updateIsSet(){
    return updateFlag;
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
  getEventFeed(){
    return eventFeed;
  }
  getEventManagers(){
    return eventManagers;
  }
  getCurrentUser(){
    return user;
  }
  getBulkRetrievedCheckIns(){
    return bulkCheckIns;
  }
  getRemovedManager(){
    return removedManager;
  }
  getAddedManager(){
    return addedManager;
  }
  getInvites(){
    return invites;
  }
  getAddedAttendee(){
    return addedAttendee;
  }
  getRemovedAttendee(){
    return removedAttendee;
  }
  getError(){
    return error;
  }
}

var eventDetailsStore = new EventDetailsStore();

// register for data from dispatcher
dispatcher.register(function(payload){
  switch(payload.actionType){
    case eventsConstants.CURRENT_EVENT_SET:
      setCurrentEvent(payload.data);
      break;
    case eventsConstants.FLAG_UPDATE_SET:
      setUpdateFlag(payload.data);
      break;
    case eventsConstants.EVENT_CHECKINS_RETRIEVED:
      setCheckIns(payload.data);
      break;
    case eventsConstants.EVENT_FILES_RETRIEVED:
      setEventFiles(payload.data);
      break;
    case eventsConstants.IMAGE_THUMB_STORED:
      setImageThumbCrop(payload.data.fileUrl);
      break;
    case eventsConstants.IMAGE_URL_STORED:
      setImageUrlCrop(payload.data.fileUrl);
      break;
    case eventsConstants.EVENT_FEED_RETRIEVED:
      setEventFeed(payload.data);
      break;
    case eventsConstants.EVENT_MESSAGE_RECEIVED:
      addMessage(payload.data);
      break;
    case eventsConstants.EVENT_MANAGERS_RETRIEVED:
      setEventManagers(payload.data);
      break;
    case eventsConstants.EVENT_INVITES_RETRIEVED:
      setInvites(payload.data);
      break;
    case eventsConstants.USER_RETRIEVED:
      setUser(payload.data);
      break;
    case eventsConstants.BULK_CHECKINS_RETRIEVED:
      setBulkCheckIns(payload.data);
      break;
    case eventsConstants.MANAGER_REMOVED:
      setRemovedManager(payload.data);
      break;
    case eventsConstants.MANAGER_ADDED:
      setAddedManager(payload.data);
      break;
    case eventsConstants.ATTENDEE_REMOVED:
      setRemovedAttendee(payload.data);
      break;
    case eventsConstants.ATTENDEE_ADDED:
      setAddedAttendee(payload.data);
      break;
    case eventsConstants.ERROR:
      setError(payload.data);
      break;
    default:
      //no op
        break;
  }
  // event created will still be emitted
  eventDetailsStore.emit(payload.actionType);
});

export default eventDetailsStore;
