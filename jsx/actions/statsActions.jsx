"use strict";
/**
 *  Actions related to Navigation
 **/
import dispatcher from "../dispatchers/dispatcher";
import requestConstants from "../constants/requestConstants"
import statsConstants from "../constants/statsConstants";
import history from "../history/history";

export function getStats(){
  $.ajax({
    url : "api/stats/me",
    method : "GET",
    headers : {
      "Authorization" : "bearer " + requestConstants.AUTH_TOKEN
    }
  }).done(function(data){
    console.log(data);
    dispatcher.dispatch({
      actionType : statsConstants.STATS_RETRIEVED,
      data : data
    });
  }).error(function(error){
    console.log(error);
  });

}

export function routeToPage(page){
  history.replaceState(null, page);
}
