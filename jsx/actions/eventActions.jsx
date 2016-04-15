'use strict';
/**
 *  Actions related to Navigation
 **/
import dispatcher from '../dispatchers/dispatcher';
import requestConstants from '../constants/requestConstants'
import eventsConstants from '../constants/eventsConstants';

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
    url : 'api/events/public?limit='+ limit +'&page=' + page,
    method : 'GET',
    headers : {
      'Authorization' : 'bearer ' + requestConstants.AUTH_TOKEN
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
    url : 'api/events/private?limit='+ limit +'&page=' + page,
    method : 'GET',
    headers : {
      'Authorization' : 'bearer ' + requestConstants.AUTH_TOKEN
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

export function getUpcomingEventsManaging(limit, page){
  $.ajax({
    url : 'api/events/managing?upcoming=true&limit='+ limit +'&page=' + page,
    method : 'GET',
    headers : {
      'Authorization' : 'bearer ' + requestConstants.AUTH_TOKEN
    }
  }).done(function(data){
    console.log(data);
    dispatcher.dispatch({
      actionType : eventsConstants.UPCOMING_EVENTS_MANAGING_RETRIEVED,
      data : data
    });
  }).fail(function(error){
    console.log(error);
  });
}
export function getPastEventsManaged(limit, page){
  $.ajax({
    url : 'api/events/managing?upcoming=false&sort=desc&limit='+ limit +'&page=' + page,
    method : 'GET',
    headers : {
      'Authorization' : 'bearer ' + requestConstants.AUTH_TOKEN
    }
  }).done(function(data){
    console.log(data);
    dispatcher.dispatch({
      actionType : eventsConstants.PAST_EVENTS_MANAGING_RETRIEVED,
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
	console.log(event);
	 $.ajax({
	    url : 'api/events/create',
	    method : 'POST',
	    data : event,
	    headers : {
	      'Authorization' : 'bearer ' + requestConstants.AUTH_TOKEN
	    }
	  }).done(function(data){
	  	console.log('Response from Create : ');
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
  console.log('updating: ');
  console.log(event);
  console.log(requestConstants.AUTH_TOKEN);
  $.ajax({
    url: 'api/events/update',
    method : 'POST',
    data : event,
    headers : {
      "Authorization" : "bearer " + requestConstants.AUTH_TOKEN
    }
  }).done(function(data){
    console.log('Response from Update : ');
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
export function searchEvents(query){
  $.ajax({
    url : 'api/events/searchEvents',
    method : 'GET',
    data: query,
    headers : {
      'Authorization' : 'bearer ' + requestConstants.AUTH_TOKEN
    }
  }).done(function(data){
    console.log(data);
    dispatcher.dispatch({
      actionType : eventsConstants.EVENT_SEARCHED,
      data : data
    });
  }).fail(function(error){
    console.log(error);
  });
}

export function getCalendarEvents(before, after){
  console.log('sending');
  $.ajax({
    url: 'api/events/getEvents',
    method : 'GET',
    data : {
      'before' : before,
      'after' : after
    },
    headers : {
      "Authorization" : "bearer " + requestConstants.AUTH_TOKEN
    }
  }).done(function(data){
    console.log(data);
    dispatcher.dispatch({
      actionType : eventsConstants.CAL_EVENTS_FETCHED,
      data : data
    });
  }).fail(function(error){
    console.log("ERROR : ");
    console.log(error);
  });

}
export function deleteEvent(event){
  console.log('deleting: ');
  console.log(event);
  console.log(requestConstants.AUTH_TOKEN);
  $.ajax({
    url: 'api/events/remove',
    method : 'POST',
    data : event,
    headers : {
      "Authorization" : "bearer " + requestConstants.AUTH_TOKEN
    }
  }).done(function(data){
    console.log('Response from Delete : ');
    console.log(data);
    dispatcher.dispatch({
      actionType : eventsConstants.EVENT_DELETED,
      data : data
    });
  }).fail(function(error){
    console.log("ERROR : ");
    console.log(error);
  });
}

export function getEventCheckIns(event){
  $.ajax({
    url: 'api/events/getEventAttendees?checkedIn=true&eventID=' + event,
    method : 'GET',
    headers : {
      "Authorization" : "bearer " + requestConstants.AUTH_TOKEN
    }
  }).done(function(data){
    console.log(data);
    dispatcher.dispatch({
      actionType : eventsConstants.EVENT_CHECKINS_RETRIEVED,
      data : data
    });
  }).fail(function(error){
    console.log("ERROR : ");
    console.log(error);
  });
}

export function getMultipleEventCheckInCounts(eventIDs){
  $.ajax({
    url: 'api/events/getMultipleEventCheckInCounts?eventIDs=' + eventIDs,
    method : 'GET',
    headers : {
      "Authorization" : "bearer " + requestConstants.AUTH_TOKEN
    }
  }).done(function(data){
    console.log(data);
    dispatcher.dispatch({
      actionType : eventsConstants.EVENT_CHECKIN_COUNTS_RETRIEVED,
      data : data
    });
  }).fail(function(error){
    console.log("ERROR : ");
    console.log(error);
  });
}

export function getEventFiles(eventID){
  $.ajax({
    url: 'api/file/getEventFiles?eventID=' + eventID,
    method : 'GET',
    headers : {
      "Authorization" : "bearer " + requestConstants.AUTH_TOKEN
    }
  }).done(function(data){
    console.log(data);
    dispatcher.dispatch({
      actionType : eventsConstants.EVENT_FILES_RETRIEVED,
      data : data
    });
  }).fail(function(error){
    console.log("ERROR : ");
    console.log(error);
  });
}

export function getEventFeed(eventID){
  console.log('GETTING FEED');
  $.ajax({
    url: 'api/notification/event?eventID=' + eventID,
    method : 'GET',
    headers : {
      "Authorization" : "bearer " + requestConstants.AUTH_TOKEN
    }
  }).done(function(data){
    console.log('GOT THE DATA!!!!!');
    dispatcher.dispatch({
      actionType : eventsConstants.EVENT_FEED_RETRIEVED,
      data : data
    });
  }).fail(function(error){
    console.log("ERROR : ");
    console.log(error);
  });
}

export function postToEventFeed(eventID, message){
  $.ajax({
    url: 'api/events/postMessage',
    method : 'POST',
    data : {
      'eventID' : eventID,
      'message' : message
    },
    headers : {
      "Authorization" : "bearer " + requestConstants.AUTH_TOKEN
    }
  }).done(function(data){
    console.log('sent!')
    dispatcher.dispatch({
      actionType : eventsConstants.MESSAGE_SENT,
      data : data
    });
  }).fail(function(error){
    console.log("ERROR : ");
    console.log(error);
  });
}
export function dispatchEventMessage(message){
  console.log('dispatching')
  dispatcher.dispatch({
    actionType: eventsConstants.EVENT_MESSAGE_RECEIVED,
    data: message
  });
}

export function uploadImage(formData, fileType){
  $.ajax('/api/file/upload', {
    method: "POST",
    data: formData,
    processData: false,
    contentType: false,
    headers : {
      "Authorization" : "bearer " + requestConstants.AUTH_TOKEN
    },
    success: function (data) {
      console.log(data);
      //temporaryImage = data;
      console.log('Upload success');
      let actionType;
      if (fileType == "banner"){
        actionType = eventsConstants.IMAGE_URL_STORED;
      }
      else{
        actionType = eventsConstants.IMAGE_THUMB_STORED;
      }
      dispatcher.dispatch({
        actionType: actionType,
        data: data
      });
    },
    error: function () {
      console.log('Upload error');
    }
  });
}

export function submitForm(){
  dispatcher.dispatch({
    actionType: eventsConstants.SUBMIT_FORM,
  });
}


export function getEventManagers(eventID){
  $.ajax({
    url: 'api/events/getManagers?getAll=true&eventID=' + eventID,
    method : 'GET',
    headers : {
      "Authorization" : "bearer " + requestConstants.AUTH_TOKEN
    }
  }).done(function(data){
    console.log('sent!')
    dispatcher.dispatch({
      actionType : eventsConstants.EVENT_MANAGERS_RETRIEVED,
      data : data
    });
  }).fail(function(error){
    console.log("ERROR : ");
    console.log(error);
  });
}

export function bulkRetrieveCheckIns(event, personIDs){
  $.ajax({
    url: 'api/events/bulkRetrieveCheckIns?eventID='+event+'&personIDs=' + personIDs,
    method : 'GET',
    headers : {
      "Authorization" : "bearer " + requestConstants.AUTH_TOKEN
    }
  }).done(function(data){
    console.log('recieved data from server');
    console.log(data);
    dispatcher.dispatch({
      actionType : eventsConstants.BULK_CHECKINS_RETRIEVED,
      data : data
    });
  }).fail(function(error){
    console.log("ERROR : ");
    console.log(error);
  });
}

export function getUser(personID){
  $.ajax({
    url: 'api/purecloud/retrievePerson?personID=' + personID,
    method : 'GET',
    headers : {
      "Authorization" : "bearer " + requestConstants.AUTH_TOKEN
    }
  }).done(function(data){
    dispatcher.dispatch({
      actionType : eventsConstants.USER_RETRIEVED,
      data : data
    });
  }).fail(function(error){
    console.log("ERROR : ");
    console.log(error);
  });
}


export function addEventManager(userData){
  return $.ajax({
    url: 'api/events/addEventManager',
    method : 'POST',
    data : userData,
    headers : {
      "Authorization" : "bearer " + requestConstants.AUTH_TOKEN
    }
  }).done((data) => {
    dispatcher.dispatch({
      'actionType' : eventsConstants.MANAGER_ADDED,
      'data' : userData.manager
    });
  }).fail((data) => {
    dispatcher.dispatch({
      'actionType' : eventsConstants.ERROR,
      'data' : data
    });
  });;
}

export function removeEventManager(options){
  return $.ajax({
    url: 'api/events/removeEventManager',
    method : 'POST',
    data : {
      'eventID' : options.eventID,
      'managerID' : options.managerID
    },
    headers : {
      "Authorization" : "bearer " + requestConstants.AUTH_TOKEN
    }
  }).done((data) => {
    dispatcher.dispatch({
      'actionType' : eventsConstants.MANAGER_REMOVED,
      'data' : options.managerID
    });
  }).fail((data) => {
    dispatcher.dispatch({
      'actionType' : eventsConstants.ERROR,
      'data' : data
    });
  });
}

export function getEventInvites(event){
  $.ajax({
    url: 'api/events/getEventAttendees?&eventID=' + event,
    method : 'GET',
    headers : {
      "Authorization" : "bearer " + requestConstants.AUTH_TOKEN
    }
  }).done(function(data){
    dispatcher.dispatch({
      actionType : eventsConstants.EVENT_INVITES_RETRIEVED,
      data : data
    });
  }).fail(function(error){
    console.log("ERROR : ");
    console.log(error);
  });
}

export function addAttendee(userData){
  return $.ajax({
    url: 'api/events/addPrivateAttendee',
    method : 'POST',
    data : userData,
    headers : {
      "Authorization" : "bearer " + requestConstants.AUTH_TOKEN
    }
  }).done((data) => {
    dispatcher.dispatch({
      'actionType' : eventsConstants.ATTENDEE_ADDED,
      'data' : userData.attendee
    });
  }).fail((data) => {
    dispatcher.dispatch({
      'actionType' : eventsConstants.ERROR,
      'data' : data
    });
  });;
}

export function removeAttendee(options){
  return $.ajax({
    url: 'api/events/removePrivateAttendee',
    method : 'POST',
    data : {
      'eventID' : options.eventID,
      'personID' : options.personID
    },
    headers : {
      "Authorization" : "bearer " + requestConstants.AUTH_TOKEN
    }
  }).done((data) => {
    dispatcher.dispatch({
      'actionType' : eventsConstants.ATTENDEE_REMOVED,
      'data' : options.personID
    });
  }).fail((data) => {
    dispatcher.dispatch({
      'actionType' : eventsConstants.ERROR,
      'data' : data
    });
  });
}
