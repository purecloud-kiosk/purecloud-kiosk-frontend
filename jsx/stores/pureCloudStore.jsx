'use strict';
/**
 *  This is a pretty basic data store for handling the toggling of side bar.
 **/
import { EventEmitter } from 'fbemitter';
import dispatcher from '../dispatchers/dispatcher';
import pureCloudConstants from '../constants/pureCloudConstants';

var searchResults = [];

function setSearchResults(results){
  searchResults = results.res;
}
class PureCloudStore extends EventEmitter{
  getSearchResults(){
    return searchResults;
  }
}

var pureCloudStore = new PureCloudStore();

// register for data from dispatcher
dispatcher.register(function(payload){
  switch(payload.actionType){
    case pureCloudConstants.USER_SEARCH_RETRIEVED:
      console.log('got payload of data');
      setSearchResults(payload.data);
      break;
  }
  pureCloudStore.emit(payload.actionType);
});

export default pureCloudStore;
