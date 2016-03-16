"use strict";
import React, {Component} from "react";
import * as eventsActions from "../actions/eventsActions";
import eventsStore from "../stores/eventsStore";
import eventsConstants from "../constants/eventsConstants";
//initialize variables
var FileInput = require('react-file-input');
import NumbersWidget from './NumbersWidget';
import EventsTableWidget from './EventsTableWidget';

export default class EventSearch extends Component {
	constructor(props) {
		super(props);
    	this.state = {
    		eventSearchResults : [],
    		//outside the event variables important to time/date/success
    		
    		//success : false,
    		//query variable
    		query : {
    			query : null,
    			limit : 25,
    			page : 0,
    			private : false,
    			upcoming : true,
    			managing : true
    		}

    	};
  	}
  	setSearchResults(){
  		//set the search results
  		console.log("event successfully searched");
  	}
  	handleButtonClick(){

			//handleEventUpdateEvent (){
			console.log(this.state.query);
			eventsActions.eventSearchResults(this.state.query);
			//eventsActions.createEvent(this.state.event);
	}
  	componentDidMount(){
  		var self = this;
  		$('#option1').change(function(){
  			self.state.query.private = null;
  		});
  		$('#option2').change(function(){
  			self.state.query.private = true;
  		});
  		$('#option3').change(function(){
  			self.state.query.private = false;
  		});
  		this.state.eventStatsListener = eventsStore.addListener(eventsConstants.EVENT_SEARCHED, this.retrieveEventsSuccessfully.bind(this));
  		  this.state.eventsManagingListener = eventsStore.addListener(eventsConstants.EVENTS_MANAGING_RETRIEVED, this.updateView.bind(this, 'eventsManaging'));

  		statsActions.getUserStats();
    	eventsActions.getEventsManaging(10, 0);
  	}
  	componentWillUnmount(){
  		$('#option1').unbind();
  		$('#option2').unbind();
  		$('#option3').unbind();
  		this.state.eventStatsListener.remove();
  	}
	retrieveEventsSuccessfully(){
		console.log("event successfully retrieved");
		var state = this.state;
		state.eventSearchResults = eventsStore.eventSearchResults();
		this.setState(state);
	}
	// handleBtnChange(value){
	// 	console.log("wow");
	// 	var state = this.state;
	// 	if (value != null) {
	// 			state.query.private = value;
	// 	} else {
	// 		state.query.private = null;
	// 	}
	// 	console.log(state.query.private);

	// }
	handleRadio(){
		console.log('radio');
	}
	handleChange(key) {
		return function(query){
			console.log(query);
			console.log(this.state.query.private);
			var state = this.state;
			state.query[key] = query.target.value;
			this.setState(state);
		}.bind(this);
	}
	updateView(field){
    	var state = this.state;
		state = eventsStore.eventSearchResults();

    	this.setState(state);
  }
	render() { 
		var {query, limit, page, upcoming, managing} = this.state.query;
		var {stats, eventsFound} = this.state.query;
    	var widgets, eventsSearchTable;
		eventsSearchTable = (
	      <div className='col-md-6'>
	        <EventsTableWidget title='Search Results' faIcon='fa-user' events={this.state.eventSearchResults}/>
	      </div>
	    );
		return(

			<div>
				<form>
					<div className="col-md-10">
						<label className ="form-search">Event Search</label>
							<div className='col-md-10'>
								<label className ='form-query'>query</label>
									<input className='form-control' value={query} onChange={this.handleChange('query')} >
									</input>
							</div>
							<div className='col-md-10'>
								<label className ='form-limit'>limit</label>
									<input className='form-control' value={limit} onChange={this.handleChange('limit')} >
									</input>
							</div>
							<div className='col-md-10'>
								<label className ='form-page'>page</label>
									<input className='form-control' value={page} onChange={this.handleChange('page')} >
									</input>
							</div>
							<div className="btn-group" data-toggle= "buttons">
								<label className ='btn btn-primary active'>
									<input type="radio" name="Both" id="option1" value='both' defaultChecked={this.state.query.private === null}/> Both
								  </label>
								  <label className="btn btn-primary">
								    <input type="radio" name="Both" id="option2" defaultChecked={this.state.query.private === true} /> Private
								  </label>
								  <label className="btn btn-primary">
								    <input type="radio" name="Both" id="option3" defaultChecked={this.state.query.private === false}/> Public
								  </label>
							</div>
							<div className='col-md-10'>
								<label className = 'form-submit'></label>
									<button className ="btn btn-primary" type = 'button'  onClick={this.handleButtonClick.bind(this)}>Submit</button>
							</div>
							<div className='tables'>
					          {eventsSearchTable}
					          
					        </div>
							
					</div>
				</form>
			</div>
			);
	}
}			

/*
							<div className='col-md-10'>
								<label className ='form-upcoming'>Upcoming</label>
									<input type = 'checkbox' defaultChecked={query.upcoming}  onClick={this.handleCheckBoxChange.bind(this)} />
							</div>
							<div className='col-md-10'>
								<label className ='form-managing'>Managing</label>
									<input type = 'checkbox' defaultChecked={query.managing}  onClick={this.handleCheckBoxChange.bind(this)} />
							</div>
							*/



				/*
				componentDidMount(){
		$('#blah').cropper({
			responsive:true,
  		aspectRatio: 16 / 9,
  		crop: function(e) {
    // Output the result data for cropping image.
   		 console.log(e.x);
		  console.log(e.y);
		  console.log(e.width);
		  console.log(e.height);
		  console.log(e.rotate);
		    console.log(e.scaleX);
		    console.log(e.scaleY);
		  }
		});
	}


	readURL(input) {
		console.log('called');
		console.log(input.target.files[0]);
        if (input.target.files && input.target.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
            	console.log(e.target.result);
                $('#blah')
                    .attr('src', e.target.result)
                    .width(300)
                    .height(300);
            };

            reader.readAsDataURL(input.target.files[0]);
        }
    }
							<div>
								<FileInput accept=".png,.gif" onChange={this.readURL.bind(this)} />

								<img id="blah" src="#" alt="your image" />
							</div>
				<div>
				<img id="image" src="img/avatar.jpg"/>
				</div>
				*/


