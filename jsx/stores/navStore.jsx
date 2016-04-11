'use strict';
/**
 *  This is a pretty basic data store for handling the toggling of side bar.
 **/
import { EventEmitter } from 'fbemitter';
import dispatcher from '../dispatchers/dispatcher';
import navConstants from '../constants/navConstants';

var open = false;
var orgNotifications = [];
function toggleOpen(){
  open = !open;
}
function addOrgNotification(message){
  message.viewed = false;
  orgNotifications.unshift(message);
}
function setOrgNotifications(messages){
  orgNotifications = messages.reverse();
}
class NavStore extends EventEmitter{
  sideBarIsOpen(){
    return open;
  }
  getNotifications(){
    return orgNotifications;
  }
}

var navStore = new NavStore();

// register for data from dispatcher
dispatcher.register(function(payload){
  switch(payload.actionType){
    case navConstants.SIDEBAR_TOGGLED:
      toggleOpen();
      break;
    case navConstants.NOTIFICATION_RECIEVED:
      addOrgNotification(payload.data);
      break;
    case navConstants.NOTIFICATIONS_RETRIEVED:
      setOrgNotifications(payload.data);
      break;
  }
  navStore.emit(payload.actionType);
});

export default navStore;
