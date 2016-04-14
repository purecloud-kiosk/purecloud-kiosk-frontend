"use strict";
import React, {Component} from "react";
import * as eventActions from "../actions/eventActions";
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
    		query : {
    			query : null,
    			limit : 25,
    			page : 0,
    			private : undefined,
    			upcoming : undefined,
    			managing : undefined
    		},
				loading : false
    	};
  	}
  	setSearchResults(){
  		//set the search results
  		console.log("event successfully searched");
  	}

  	componentDidMount(){
  		this.state.eventStatsListener = eventsStore.addListener(eventsConstants.EVENT_SEARCHED, this.retrieveEventsSuccessfully.bind(this));
    	eventActions.getUpcomingEventsManaging(10, 0);
  	}
  	componentWillUnmount(){
  		$('#option1').unbind();
  		$('#option2').unbind();
  		$('#option3').unbind();
  		this.state.eventStatsListener.remove();
  	}
	retrieveEventsSuccessfully(){
		var state = this.state;
		state.loading = false;
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
	submitForm(e){
		e.preventDefault();
		this.handleButtonClick();
	}
	handleButtonClick(){
		let state = this.state;
		switch($('#privacyFilter input:radio:checked').val()){
			case 'private':
				state.query.private = true;
				break;
			case 'public':
				state.query.private = false;
				break;
			default:
				state.query.private = undefined;
				break;
		}
		switch($('#managingFilter input:radio:checked').val()){
			case 'managing':
				state.query.managing = true;
				break;
			case 'notManaging':
				state.query.managing = false;
				break;
			default:
				state.query.managing = undefined;
				break;
		}
		switch($('#upcomingFilter input:radio:checked').val()){
			case 'upcoming':
				state.query.upcoming = true;
				break;
			case 'past':
				state.query.upcoming = false;
				break;
			default:
				state.query.upcoming = undefined;
				break;
		}
		eventActions.searchEvents(state.query);
		console.log(state);
		state.loading = true;
		this.setState(state);
	}
	updateView(field){
    	var state = this.state;
			state = eventsStore.eventSearchResults();
    	this.setState(state);
  }
	render() {
		var {query, limit, page, upcoming, managing} = this.state.query;
		var {stats, eventsFound} = this.state.query;
    	var widgets;
		return(

			<div>
				<form onSubmit={this.submitForm.bind(this)}>
					<div className="col-sm-12">
						<h4>Event Search</h4>
			      <div className='input-group'>
				      <input type="text" className="form-control" placeholder='Enter your search query here...' onChange={this.handleChange('query')}/>
				      <span className="input-group-btn">
				        <button className="btn btn-default" type="button" onClick={this.handleButtonClick.bind(this)}>Search</button>
				      </span>
			      </div>
						<br></br>
						<div className='form-inline'>
							<label className='search-label'>Privacy</label>
							<div id='privacyFilter' className="btn-group" data-toggle= "buttons">
								<label className ='btn btn-primary active'>
									<input type="radio" name="Both" id="option1" value='both' defaultChecked={this.state.query.private === undefined}/> All
								</label>
							  <label className="btn btn-primary">
							    <input type="radio" name="Both" id="option2" value='private' defaultChecked={this.state.query.private === true} /> Private
							  </label>
							  <label className="btn btn-primary">
							    <input type="radio" name="Both" id="option3" value='public' defaultChecked={this.state.query.private === false}/> Public
							  </label>
							</div>
						</div>
						<br></br><br></br>
						<div className='form-inline'>
							<label className='search-label'>Managing</label>
							<div id='managingFilter' className="btn-group" data-toggle= "buttons">
								<label className ='btn btn-primary active'>
									<input type="radio" name="Manage" id="option1" value='both' defaultChecked={this.state.query.managing === undefined}/> Both
								</label>
								<label className ='btn btn-primary'>
									<input type="radio" name="Manage" id="option1" value='notManaging' defaultChecked={this.state.query.managing === false}/> Not Managing
								</label>
								<label className="btn btn-primary">
									<input type="radio" name="Manage" id="option2" value='managing' defaultChecked={this.state.query.managing === true} /> Managing
								</label>
							</div>
						</div>
						<br></br><br></br>

						<div className='form-horizontal'>
							<label className='search-label'>Upcoming</label>
								<div id='upcomingFilter' className="btn-group" data-toggle= "buttons">
									<label className ='btn btn-primary active'>
										<input type="radio" name="Upcoming" id="option1" value='both' defaultChecked={this.state.query.upcoming === undefined}/> All
									</label>
								  <label className="btn btn-primary">
								    <input type="radio" name="Upcoming" id="option2" value='past' defaultChecked={this.state.query.upcoming === false} /> Past
								  </label>
								  <label className="btn btn-primary">
								    <input type="radio" name="Upcoming" id="option3" value='upcoming' defaultChecked={this.state.query.upcoming === true}/> Upcoming
								  </label>
								</div>
						</div>

			      <EventsTableWidget title='Search Results' loading={this.state.loading} size='large'  faIcon='fa-user' events={this.state.eventSearchResults}/>
					</div>
				</form>
			</div>
			);
	}
}
