'use strict';
/**
 *  This is a pretty basic data store for handling the toggling of side bar.
 **/
import { EventEmitter } from 'fbemitter';
import dispatcher from '../dispatchers/dispatcher';
import statsConstants from '../constants/statsConstants';
import navConstants from '../constants/navConstants';
var userStats = null, eventStats = {};

function setUserStats(statistics){
  userStats = statistics;
}
function setEventStats(statistics){
  eventStats = statistics;
}

class StatsStore extends EventEmitter{
  getUserStats(){
    return userStats;
  }
  getEventStats(){
    return eventStats;
  }
}

var statsStore = new StatsStore();

// register for data from dispatcher
dispatcher.register(function(payload){
  switch(payload.actionType){
    case statsConstants.USER_STATS_RETRIEVED:
      setUserStats(payload.data);
      break;
    case statsConstants.EVENT_STATS_RETRIEVED:
      setEventStats(payload.data);
      break;
    case navConstants.NOTIFICATION_RECIEVED:
      console.log('stats store got this too');
      console.log(payload);
      if(payload.data.message.action === 'EVENT_CREATED'){ // public event
          console.log('incremented');
          userStats.totalPublicEventsAvailable++;
      }
      else if (payload.data.message.action === 'EVENT_INVITE'){ // private event
          userStats.totalPrivateEventsAvailable++;
      }
      break;
  }
  statsStore.emit(payload.actionType);
});

export default statsStore;
