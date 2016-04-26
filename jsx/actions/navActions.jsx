'use strict';
/**
 *  Actions related to Navigation
 **/
import dispatcher from '../dispatchers/dispatcher';
import requestConstants from '../constants/requestConstants';
import navConstants from '../constants/navConstants';
import history from '../history/history';
import i18next from 'i18next';

let currentPath = null;
history.listen(location => {
  console.log('path');
  console.log(location.pathname);
  currentPath = location.pathname;
});
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
  if("/" + page !== currentPath)
    history.pushState(null, page);
  $('.main-content').scrollTop(0);
}
export function goBack(){
  history.goBack();
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

export function changeLanguage(lang){
  i18next.changeLanguage(lang, (err, t) => {
    // resources have been loaded
    console.log('testing');
    console.log('Error :' + err);
    console.log(t);
    if(!err){
      localStorage.setItem('pureCloudKioskLang' , lang);
      dispatcher.dispatch({
        'actionType' : navConstants.LANG_CHANGED
      });
    }
    else{
      dispatcher.dispatch({
        'actionType' : 'error'
      });
    }
  });
}
