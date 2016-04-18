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
var eventCheckIns = [];
var bulkCheckIns = [];
var removedManager = null;
var addedManager = null;
var removedAttendee = null;
var addedAttendee = null;
var invites = [];
var error = null;
var currentEvent = null;
var updateFlag = false;
var addedFile = null;
var removedFileID = null;
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
function addMessage(notification){
  eventFeed.unshift(notification);
}
function removeMessage(notification){
  console.log(notification);
  let index;
  for(index = 0; index < eventFeed.length; index++){
    console.log('|')
    console.log(eventFeed[index].id);
    console.log(notification.message.content);
    if(eventFeed[index].id === notification.message.content)
      break;
  }
  console.log(eventFeed.splice(index, 1));
  console.log(index);
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
function setAddedFile(file){
  addedFile = file;
}
function setRemovedFileID(id){
  removedFileID = id;
}
function setError(e){
  error = e;
}
function addCheckIn(data){
  eventCheckIns.push(data.message.content);
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
  getAddedFile(){
    return addedFile;
  }
  getRemovedFileID(){
    return removedFileID;
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
      setImageThumbCrop(payload.data.url);
      break;
    case eventsConstants.IMAGE_URL_STORED:
      setImageUrlCrop(payload.data.url);
      break;
    case eventsConstants.EVENT_FEED_RETRIEVED:
      setEventFeed(payload.data);
      break;
    case eventsConstants.EVENT_MESSAGE_RECEIVED:
      addMessage(payload.data);
      break;
    case eventsConstants.EVENT_MESSAGE_REMOVED:
      removeMessage(payload.data);
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
    case eventsConstants.NEW_CHECKIN_RETRIEVED:
      addCheckIn(payload.data);
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
    case eventsConstants.FILE_ADDED:
      setAddedFile(payload.data);
      break;
    case eventsConstants.FILE_REMOVED:
      console.log('removed!');
      setRemovedFileID(payload.data);
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
