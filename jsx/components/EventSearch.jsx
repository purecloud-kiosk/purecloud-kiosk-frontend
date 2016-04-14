"use strict";
import React, {Component} from "react";
import * as eventActions from "../actions/eventActions";
import eventsStore from "../stores/eventsStore";
import eventsConstants from "../constants/eventsConstants";
//initialize variables
var FileInput = require('react-file-input');
import NumbersWidget from './NumbersWidget';
import EventsTableWidget from './EventsTableWidget';
import EventTypeAhead from './EventTypeAhead';
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
	componentDidMount(){
		this.state.eventStatsListener =
			eventsStore.addListener(eventsConstants.EVENT_SEARCHED, this.retrieveEventsSuccessfully.bind(this));
	}
	componentWillUnmount(){
		this.state.eventStatsListener.remove();
	}
	retrieveEventsSuccessfully(){
		console.log('got search results');
		var state = this.state;
		state.loading = false;
		state.eventSearchResults = eventsStore.eventSearchResults();
		this.setState(state);
	}
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
	onPrivacyChange(e){
		console.log(e.target.value);
		this.state.query.private = e.target.value;
		this.setState(this.state);
	}
	onManagementChange(e){
		console.log(e.target.value);
		this.state.query.managing = e.target.value;
		this.setState(this.state);
	}
	onUpcomingChange(e){
		console.log(e.target.value);
		this.state.query.upcoming = e.target.value;
		this.setState(this.state);
	}
	render() {
		var {query, limit, page, upcoming, managing} = this.state.query;
		var {stats, eventsFound} = this.state.query;
    	var widgets;
		return(
			<div>
					<div className='col-md-1'></div>
					<div className="col-md-10">
						<h4>Event Search</h4>
			      <div className='input-group'>
							<EventTypeAhead id='eventTypeAhead' query={this.state.query}/>
			      </div>
						<br></br>
						<div className="form-group">
						  <label for="privacySelect">Privacy</label>
						  <select className="form-control" id="privacySelect" onChange={this.onPrivacyChange.bind(this)}>
						    <option value={undefined}>Private and Public</option>
						    <option value={true}>Private only</option>
						    <option value={false}>Public only</option>
						  </select>
						</div>
						<div className="form-group">
						  <label for="managementSelect">Management</label>
						  <select className="form-control" id="managementSelect" onChange={this.onManagementChange.bind(this)}>
						    <option value={undefined}>All events</option>
						    <option value={true}>Events managing only</option>
						    <option value={false}>Events not managing only</option>
						  </select>
						</div>
						<div className="form-group">
						  <label for="upcomingSelect">Upcoming</label>
						  <select className="form-control" id="upcomingSelect" onChange={this.onUpcomingChange.bind(this)}>
						    <option value={undefined}>Upcoming and past events</option>
								<option value={true}>Upcoming events</option>
						    <option value={false}>Past events only</option>
						  </select>
						</div>
			      <EventsTableWidget title='Search Results' loading={this.state.loading} size='large'  faIcon='fa-user' events={this.state.eventSearchResults}/>
					</div>
					<div className='col-md-1'></div>
			</div>
			);
	}
}
