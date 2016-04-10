'use strict';
/**
 *  This is a pretty basic data store for handling the toggling of side bar.
 **/
import { EventEmitter } from 'fbemitter';
import dispatcher from '../dispatchers/dispatcher';
import navConstants from '../constants/navConstants';

var open = false;
var notifications = [];
function toggleOpen(){
  open = !open;
}
function addNotification(message){
  message.viewed = false;
  notifications.push(message);
}
function addNotifications(messages){
  console.log(messages);
  messages.forEach((message) => {
    message.viewed = false;
    notifications.push(message);
  });
}
class NavStore extends EventEmitter{
  sideBarIsOpen(){
    return open;
  }
  getNotifications(){
    return notifications;
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
      addNotification(payload.data);
      break;
    case navConstants.NOTIFICATIONS_RETRIEVED:
      addNotifications(payload.data);
      break;
  }
  navStore.emit(payload.actionType);
});

export default navStore;
