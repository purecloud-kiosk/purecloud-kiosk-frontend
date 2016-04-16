import requestConstants from "../constants/requestConstants";
import navConstants from '../constants/navConstants';
import * as navActions from '../actions/navActions';
import * as eventActions from '../actions/eventActions';
import statsStore from '../stores/statsStore';
// init this.socket connection and handle all routing of events here
class WebSocket{
  constructor(){
    this.socket =  io('http://localhost:8080/ws');//io('http://ec2-54-213-9-55.us-west-2.compute.amazonaws.com:8000/ws');
  }
  init(notificationSystem){
    this.notificationSystem = notificationSystem;
    this.socket.on('connect', ()=>{
      console.log('connected');
      this.socket.emit('auth', {'token': requestConstants.AUTH_TOKEN});
    });
    this.socket.on('subResponse', ()=> {
      console.log('subbed');
    });
    this.socket.on('subError', (error)=> {
      console.log(error);
    });
    this.socket.on('EVENT', (notification) => {
      console.log(notification);
      eventActions.dispatchEventNotification(notification);
    });
    this.socket.on('ORG', (notification) => {
      console.log("ORG");
      // org wide message, so just push to notification bar
      console.log(statsStore.getUserStats());
      if(data.posterID !== statsStore.getUserStats().personID &&
      moment(new Date()).isBefore(new Date(notification.message.content.endDate))){
        navActions.dispatchOrgNotification(data);
        this.notificationSystem.addNotification({
          'message': 'A new event was created!',
          'position': 'tr',
          'level': 'info',
          'action': {
            'label': 'View Event',
            'callback': () => {
              eventActions.setCurrentEvent(notification.message.content);
              navActions.routeToPage('event');
              navActions.refresh();
            }
          }
        });
      }
    });
    this.socket.on('disconnect', () => {
      console.log('disconnected');
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
