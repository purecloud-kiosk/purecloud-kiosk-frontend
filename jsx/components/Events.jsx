'use strict';
import React, {Component} from 'react';
import * as eventsActions from '../actions/eventsActions';
import eventsStore from '../stores/eventsStore';
import eventsConstants from '../constants/eventsConstants';
//initialize variables
var DatePicker = require('react-date-picker');
var TimePicker = require('react-time-picker');
//var ReactDOM = require('react-dom');
var NotificationSystem = require('react-notification-system');
export default class Events extends Component {
	constructor(props) {
		super(props);
		var event = this.props.event;
		this.notificationSystem = null;
    	this.state = {
    		//outside the event variables important to time/date/success
    		initialTimeValue : '8:15:00',
    		initialDate : '',
    		success : false,
    		//event variable
    		event : {
    			title : null,
    			startDate: 0,
					endDate : 0,
    			location : null,
    			private : false,
    			description : null,
    			imageUrl : null,
    			thumbnailUrl : null
    		}

    	};
  	}
  	// after component successfully rendered
  	componentDidMount(){
  		eventsStore.addListener(eventsConstants.EVENT_CREATED, this.handleEventCreatedSuccessfully.bind(this));
  		this.notificationSystem = this.refs.notificationSystem;
  	}

  	handleEventUpdated(){
  		//fill this in
  		console.log("event successfully updated");
  	}
  	//function for create
  	handleEventCreatedSuccessfully(){
  		
  		console.log("event successfully created");
  		//reset the state
  		var state = this.state;
  		state.success = true;
  		initialTimeValue : '8:15:00';
    	initialDate : '';
  		state.event = {
				title : null,
				startDate: 0,
				endDate : 0,
				location : null,
				private : false,
				description : null,
				imageUrl : null,
				thumbnailUrl : null
			}
  		this.setState(state);
  		this.notificationSystem.addNotification({
    	 	message: 'Event successfully created',
     		position: 'bc',
     		level: 'success'
    	});
  	}

	handleChange(key) {
		return function(event){
			console.log(event.target.value);
			var state = this.state;
			state.event[key] = event.target.value;
			this.setState(state);
		}.bind(this);
	}
	//function for the checkbox, so it changes privacy
	handleCheckBoxChange(){
		var state = this.state;
		state.event.private = !state.event.private;
		console.log(state.event.private);
		this.setState(state);
	}
	//this should pass var to the Actions

	handleButtonClick(){
		this.state.event.startDate = this.state.initialDate + ' ' + this.state.initialTimeValue;
		console.log(event.startDate);
		console.log('handleButtonClick');
		eventsActions.createEvent(this.state.event);
		if(eventsStore.updateIsSet()){
			//handleEventUpdateEvent (){
			console.log(this.state.event);
			//event._id = Object._id;
			console.log(this.state.event._id);
			//set the event _id for accessing existing event
			this.state.event.eventID = this.state.event._id;
			eventsActions.updateEvent(this.state.event);
			
		}

		else{
			//else event is a new event and starts with a new _id
			eventsActions.createEvent(this.state.event);
		}
			
	}
	dateOnChange(newDate, moment) {
		console.log('DateOnChange');
		//code goes here
		//set state
		var state = this.state;
		console.log(newDate);
		//send date back from date-picker
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
		var style = {
	  		NotificationItem: { // Override the notification item
	   		DefaultStyle: { // Applied to every notification, regardless of the notification level
	    	margin: '10px 5px 2px 1px'

	    },
	    success: { // Applied only to the success notification item
	     // borderTop: '2px solid ' + defaultColors.success.hex,
	     // backgroundColor: 'grey',
	      color: 'black'
	    }
	  }
	}
	date = Date.now();

	return (
	//form with text boxes and button to submit

		<div>
			<form className = 'form-all'>
				<div className='col-md-10'>
				<label className ='form-title'>Event Title</label>
					<input className='form-control' value={event.title} onChange={this.handleChange('title')} >
					</input>
				</div>
				<div className='col-md-10'>
				<label className ='form-date'>Date</label>
					 <DatePicker minDate='2016-01-01' date={date} onChange={this.dateOnChange.bind(this)} >
					</DatePicker>
				</div>
				<div className='col-md-10'>
				<label className ='form-date-selected'>Date Selected</label>
					 <input className='form-control' value={this.state.initialDate} onChange={this.handleChange('date')} >
					</input>
				</div>
				<div className='col-md-10'>
				<label className ='form-time'>Time</label>
					<TimePicker value={this.state.initialTimeValue} onChange={this.handleTimeChange.bind(this)}>
					</TimePicker>
				</div>
				<div className='col-md-10'>
				<label className ='form-location'>Location</label>
					<input className='form-control' value={event.location} onChange={this.handleChange('location')} >
					</input>
				</div>
				<div className='col-md-10'>
				<label className= 'form-image'>Image</label>
					<input className='form-control' value={event.image_url}  onChange={this.handleChange('imageUrl')} >
					</input>
				</div>
				<div className='col-md-10'>
				<label className= 'form-space'></label>
				</div>
				<div className='col-md-10'>
				<label className ='form-private'>Private</label>
					<input type = 'checkbox' defaultChecked={event.private}  onClick={this.handleCheckBoxChange.bind(this)} />
				</div>
				<div className='col-md-10'>
				<label className= 'form-description'>Description of Event</label>
					<textarea className='form-control' rows='3' value={event.description}  onChange={this.handleChange('description')}>
					</textarea>
				</div>
				<div className='col-md-10'>
				<label className = 'form-submit'></label>
					<button type = 'button'  onClick={this.handleButtonClick.bind(this)}>Submit</button>
				</div>
				<div>
      				  <NotificationSystem ref='notificationSystem' style={style}/>
      			</div>
			</form>

		</div>


		);
}
}
