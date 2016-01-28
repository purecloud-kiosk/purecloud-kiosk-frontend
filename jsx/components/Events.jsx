"use strict";
import React, {Component} from "react";
import * as eventsActions from "../actions/eventsActions";
import eventsStore from "../stores/eventsStore";
import eventsConstants from "../constants/eventsConstants";
//initialize variables
var DatePicker = require("react-date-picker");
var TimePicker = require("react-time-picker");
//var Popup = require('react-popup');
export default class Events extends Component {
	constructor(props) {
		super(props);
    	this.state = {
    		initialTimeValue : '8:15:00',
    		initialDate : "string",
    		success : false,
    		event : {
    			title : null,
    			date: 0,
    			location : null,
    			private : false,
    			description : null,
    			image_url : null,
    			thumbnail_url : null
    		}

    	};
  	}
  	// after component successfully rendered
  	componentDidMount(){
  		eventsStore.addListener(eventsConstants.EVENT_CREATED, this.handleEventCreatedSuccessfully.bind(this));
  	}
  	
  	handleEventCreatedSuccessfully(){
  		console.log("event successfully created");
  		var state = this.state;
  		state.success = true;
  		this.setState(state);
  	}
	handleChange(key) {
		return function(event){
			console.log(event.target.value);
			var state = this.state;
			state.event[key] = event.target.value;
			this.setState(state);
		}.bind(this);
	}

	handleCheckBoxChange(){
		var state = this.state;
		state.event.private = !state.event.private;
		console.log(state.event.private);
		this.setState(state);
	}
	//this should pass var to the Actions

	handleButtonClick(){
		this.state.event.date = this.state.initialDate + " " + this.state.initialTimeValue;
		console.log(event.date);
		console.log("handleButtonClick");
		eventsActions.createEvent(this.state.event);
	}
	dateOnChange(newDate, moment) {
		console.log("DateOnChange");
		//code goes here
		var state = this.state;
		console.log(newDate);
		this.state.initialDate = newDate;
		this.setState(state);
	}
	
	handleTimeChange(newTime){
		console.log(newTime);
		var state = this.state;
		this.state.initialTimeValue = newTime;
		this.setState(state);
	}
render(){
	var {event, success, date, mode, format, inputFormat} = this.state;
	var value = null;
	var picker;
	var message;
	if(success){
		message = (
			<div>
			Event was created successfully!
			</div>
		);
	}
	date = Date.now();
	
	return (
	//form with text boxes and button to submit
		<div>
			<form>
				<div className="col-md-8">
				<label className ="form-title">Event Title</label>
					<input className="form-control" value={event.title} onChange={this.handleChange("title")} >
					</input>
				</div>
				<div className="col-md-8">
				<label className ="form-date">Date</label>
					 <DatePicker minDate="2016-01-01" date={date} onChange={this.dateOnChange.bind(this)} >
					</DatePicker>
				</div>
				<div className="col-md-8">
				<label className ="form-date-selected">Date Selected</label>
					 <input className="form-control" value={this.state.initialDate} onChange={this.handleChange("date")} >
					</input>
				</div>
				<div className="col-md-8">
				<label className ="form-time">Time</label>
					<TimePicker value={this.state.initialTimeValue} onChange={this.handleTimeChange.bind(this)}>
					</TimePicker>
				</div>
				<div className="col-md-8">
				<label className ="form-location">Location</label>
					<input className="form-control" value={event.location} onChange={this.handleChange("location")} >
					</input>
				</div>
				<div className="col-md-8">
				<label className= "form-image">Image</label>
					<input className="form-control" value={event.image_url}  onChange={this.handleChange("image_url")} >
					</input>
				</div>
				<div className="col-md-8">
				<label className ="form-private">Private</label>
					<input type = "checkbox" defaultChecked={event.private}  onClick={this.handleCheckBoxChange.bind(this)} />
				</div>
				<div className="col-md-8">
				<label className= "form-description">Description of Event</label>
					<textarea className="form-control" rows="3" value={event.description}  onChange={this.handleChange("description")}>
					</textarea>
				</div>
				<div className="col-md-8">
				<label className = "form-submit"></label>
					<button type = "button"  onClick={this.handleButtonClick.bind(this)}>Submit</button>
				</div>

			</form>
			{message}
		</div>
		
		
		);
}
}