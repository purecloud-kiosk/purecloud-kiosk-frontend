'use strict';
/**
 *  Actions related to Navigation
 **/
import dispatcher from '../dispatchers/dispatcher';
import requestConstants from '../constants/requestConstants';
import navConstants from '../constants/navConstants';
import history from '../history/history';
/**
 *  Dispatches to the navStore that the sidebar has been toggled
 **/
export function toggleSideBar(){
  dispatcher.dispatch({
    actionType : navConstants.SIDEBAR_TOGGLED
  });
}
/**
 *  replaces the state of the application's history (in other words, swaps pages)
 **/
export function routeToPage(page){
  // TODO: push state and maintain states
  history.replaceState(null, page);
  $('.main-content').scrollTop(0);
}

export function getNotifications(){
  $.ajax({
    url : 'api/notification/org',
    method : 'GET',
    headers : {
      'Authorization' : 'bearer ' + requestConstants.AUTH_TOKEN
    }
  }).done(function(data){
    console.log(data);
    dispatcher.dispatch({
      actionType : navConstants.NOTIFICATIONS_RETRIEVED,
      data : data
    });
  }).error(function(error){
    console.log(error);
  });
}

export function dispatchOrgNotification(message){
  dispatcher.dispatch({
    actionType: navConstants.NOTIFICATION_RECIEVED,
    data: message
  });
}

export function refresh(){
  dispatcher.dispatch({
    actionType: navConstants.REFRESH
  });
}
