'use strict';

import i18next from "i18next";
import requestConstants from "../constants/requestConstants";
import navConstants from '../constants/navConstants';
import * as navActions from '../actions/navActions';
import * as eventActions from '../actions/eventActions';
import statsStore from '../stores/statsStore';
import config from '../../config.json';
// init this.socket connection and handle all routing of events here
class WebSocket{
  constructor(){
    this.socket =  io(config.socketEndpoint);
    this.socket.on('connect', () => {
      console.log('connection made!!!!!!!!!!!!!!!!!!!!!!!!!!');
      this.socket.emit('auth', {'token': requestConstants.AUTH_TOKEN});
    });
  }
  init(notificationSystem){
    this.notificationSystem = notificationSystem;
    console.log('socket init');
    this.socket.emit('auth', {'token': requestConstants.AUTH_TOKEN});
    this.socket.on('subResponse', () => {
      console.log('subbed to channel');
    });
    this.socket.on('subError', (error) => {
      console.log(error);
    });
    this.socket.on('EVENT', (notification) => {
      console.log(notification);
      eventActions.dispatchEventNotification(notification);
    });
    this.socket.on('ORG', (notification) => {
      console.log("ORG notification");
      console.log('notification');
      if(notification.posterID !== statsStore.getUserStats().personID &&
      moment(new Date()).isBefore(new Date(notification.message.content.endDate))){
        navActions.dispatchOrgNotification(notification);
        console.log(this.notificationSystem);
        let message;
        if(notification.message.action === "EVENT_INVITE"){
          message = {
            'message': i18next.t('EVENT_INVITE'),
            'position': 'tr',
            'level': 'info',
            'action': {
              'label': i18next.t('VIEW_EVENT'),
              'callback': () => {
                eventActions.setCurrentEvent(notification.message.content);
                navActions.routeToPage('event');
                navActions.refresh();
              }
            }
          };
        }
        else{
          this.notificationSystem.addNotification({
            'message': i18next.t('EVENT_CREATED'),
            'position': 'tr',
            'level': 'info',
            'action': {
              'label': i18next.t('VIEW_EVENT'),
              'callback': () => {
                eventActions.setCurrentEvent(notification.message.content);
                navActions.routeToPage('event');
                navActions.refresh();
              }
            }
          });
        }
      }
    });
    this.socket.on('disconnect', () => {
      console.log('socket disconnected');
    });
    this.socket.on('reconnect', () => {
      console.log('reconnected');
    });
  }
  subscribe(eventID){
    this.socket.emit('sub', eventID);
  }
  unsubscribe(eventID){
    this.socket.emit('unsub', eventID);
  }
}

var webSocket = new WebSocket();
module.exports = webSocket;
