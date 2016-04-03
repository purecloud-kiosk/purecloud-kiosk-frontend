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
 var temporaryImage;
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
export function eventSearchResults(query){
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
    url: 'api/events/getEventCheckIns?eventID=' + event,
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
  })
}
export function uploadImage(formData, fileType){
  $.ajax('/api/events/uploadImage', {
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
      if (fileType == "banner"){
        dispatcher.dispatch({
        actionType: eventsConstants.IMAGE_URL_STORED,
        data: data
      });
      }
      else{
        dispatcher.dispatch({
        actionType: eventsConstants.IMAGE_THUMB_STORED,
        data: data
      });
      }

    },
    error: function () {
      console.log('Upload error');
    }
  });
}
