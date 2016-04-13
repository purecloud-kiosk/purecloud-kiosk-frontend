'use strict';
/**
 *  Actions related to Navigation
 **/
import dispatcher from '../dispatchers/dispatcher';
import requestConstants from '../constants/requestConstants'
import pureCloudConstants from '../constants/pureCloudConstants';
import history from '../history/history';

export function searchUsers(query){
  $.ajax({
    url : 'api/purecloud/searchPeople?q=' + query,
    method : 'GET',
    headers : {
      'Authorization' : 'bearer ' + requestConstants.AUTH_TOKEN
    }
  }).done(function(data){
    console.log(data);
    dispatcher.dispatch({
      actionType : pureCloudConstants.USER_SEARCH_RETRIEVED,
      data : data
    });
  }).error(function(error){
    console.log(error);
  });
}
