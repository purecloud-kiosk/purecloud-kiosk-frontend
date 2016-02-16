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
export function setUpdateFlag(bool){
  dispatcher.dispatch({
      actionType : eventsConstants.FLAG_UPDATE_SET,
      data : bool

    });
}
export function getPublicEvents(limit, page){
  $.ajax({
    url : "api/events/public?limit="+ limit +"&page=" + page,
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
  }).fail(function(error){
    console.log(error);
  });
}

export function getPrivateEvents(limit, page){
  $.ajax({
    url : "api/events/private?limit="+ limit +"&page=" + page,
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
  }).fail(function(error){
    console.log(error);
  });
}

export function getEventsManaging(limit, page){
  $.ajax({
    url : "api/events/managing?limit="+ limit +"&page=" + page,
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
  }).fail(function(error){
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
	  }).fail(function(error){
      debugger;
	  	console.log("ERROR : ");
	    console.log(error);
	  });
}
export function updateEvent(event){
  console.log("updating: ");
  console.log(event);
  console.log(requestConstants.AUTH_TOKEN);
  $.ajax({
    url: "api/events/update",
    method : "POST",
    data : event,
    headers : {
      "Authorization" : "bearer " + requestConstants.AUTH_TOKEN
    }
  }).done(function(data){
    console.log("Response from Update : ");
    console.log(data);
    setUpdateFlag(false);
    dispatcher.dispatch({
      actionType : eventsConstants.EVENT_UPDATED,
      data : data
    });
  }).fail(function(error){
    console.log("ERROR : ");
    console.log(error);
  });

}
