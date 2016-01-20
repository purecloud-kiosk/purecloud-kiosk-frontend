"use strict";
/**
 *  Actions related to Navigation
 **/
import dispatcher from "../dispatchers/dispatcher";
import requestConstants from "../constants/requestConstants"
import eventsConstants from "../constants/eventsConstants";

/**
 *  NOTE : Requests should be moved into a Data access object 
 **/

export function getPublicEvents(page){
  $.ajax({
    url : "api/events/public?page=" + page,
    method : "GET",
    headers : {
      "Authorization" : "bearer " + requestConstants.AUTH_TOKEN
    }
  }).done(function(data){
    console.log(data);
    dispatcher.dispatch({
      actionType : eventsConstants.PUBLIC_EVENTS_RETRIEVED,
      data : data
    });
  }).error(function(error){
    console.log(error);
  });
}

export function getPrivateEvents(page){
  $.ajax({
    url : "api/events/private?page=" + page,
    method : "GET",
    headers : {
      "Authorization" : "bearer " + requestConstants.AUTH_TOKEN
    }
  }).done(function(data){
    console.log(data);
    dispatcher.dispatch({
      actionType : eventsConstants.PRIVATE_EVENTS_RETRIEVED,
      data : data
    });
  }).error(function(error){
    console.log(error);
  });
}

export function getEventsManaging(page){
  $.ajax({
    url : "api/events/managing?page=" + page,
    method : "GET",
    headers : {
      "Authorization" : "bearer " + requestConstants.AUTH_TOKEN
    }
  }).done(function(data){
    console.log(data);
    dispatcher.dispatch({
      actionType : eventsConstants.EVENTS_MANAGING_RETRIEVED,
      data : data
    });
  }).error(function(error){
    console.log(error);
  });
}

export function setCurrentEvent(event){
  dispatcher.dispatch({
    actionType : eventsConstants.CURRENT_EVENT_SET,
    data : event
  });
}

export function createEvent(event){
	console.log("Data we are sending: ");
	console.log(event);
	 $.ajax({
	    url : "api/events/create",
	    method : "POST",
	    data : event,
	    headers : {
	      "Authorization" : "bearer " + requestConstants.AUTH_TOKEN
	    }
	  }).done(function(data){
	  	console.log("Response from Create : ");
	    console.log(data);
	    dispatcher.dispatch({
	      actionType : eventsConstants.EVENT_CREATED,
	      data : data
	    });
	  }).error(function(error){
	  	console.log("ERROR : ");
	    console.log(error);
	  });
}
