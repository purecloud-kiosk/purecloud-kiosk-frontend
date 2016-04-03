'use strict';
import React, {Component} from 'react';
import * as eventsActions from '../actions/eventsActions';
import eventsStore from '../stores/eventsStore';
import eventsConstants from '../constants/eventsConstants';
import DatePicker from './DatePicker';
import ImageCropper from './ImageCropper';
import Modal from "./Modal";

var NotificationSystem = require('react-notification-system');
export default class Events extends Component {
		constructor(props) {
			super(props);
			var event = this.props.event || {};
			this.notificationSystem = null;
    	this.state = {
    		//outside the event variables important to time/date/success
    		success : false,
    		//event variable
    		event : {
    			title : event.title || null,
    			startDate: event.startDate || 0,
					endDate : event.endDate || 0,
    			location : event.location || null,
    			private : event.private || false,
    			description : event.description || null,
    			imageUrl :  event.imageUrl || null,
    			thumbnailUrl : event.thumbnailUrl || null
    		}
				//event : null
    	};
  	}
  	// after component successfully rendered
  	componentDidMount(){
  		if(eventsStore.updateIsSet()){
   			var event = eventsStore.getCurrentEvent();
   			//add listener
				console.log('updating');
   			this.state.eventStatsListener = eventsStore.addListener(eventsConstants.EVENT_UPDATED, this.handleEventUpdatedSuccessfully.bind(this));
   			this.notificationSystem = this.refs.notificationSystem;
   			console.log(this.notificationSystem);
   			//var event = eventsStore.getCurrentEvent();
   			//add event data
   			var state = this.state;

   			state.event = event;
				// convert to local
				var startDate = moment.utc(event.startDate).toDate();
				state.startDate = moment(startDate).format('LL');
				state.startTime = moment(startDate).format('LT');
   			this.setState(state);
   		}
   		else{
   			this.state.eventStatsListener = eventsStore.addListener(eventsConstants.EVENT_CREATED, this.handleEventCreatedSuccessfully.bind(this));
   			this.notificationSystem = this.refs.notificationSystem;
   			console.log(this.notificationSystem);
				var state = this.state;
				state.event.startDate = this.props.startDate;
				console.log('form rerendered');
				this.setState(state);
   		}
   		this.state.eventsStoreListener = eventsStore.addListener(eventsConstants.IMAGE_THUMB_STORED, this.handleImageThumbUploadedSuccessfully.bind(this));   		
		this.state.eventsStoreListener = eventsStore.addListener(eventsConstants.IMAGE_URL_STORED, this.handleImageUrlUploadedSuccessfully.bind(this));	
			$('#privacy-checkbox').bootstrapSwitch({
				'onText' : 'Private',
				'offText' : 'Public',
				'onColor' : 'danger',
				'offColor' : 'primary',
				'state' : this.state.event.private,
				'onSwitchChange': (event, state) => {
					console.log('before ' + this.state.event.private);
					console.log('after');
					console.log(state);
					this.state.event.private = state;
				}
			});

  	}
  	componentWillUnmount(){
  		this.state.eventsStoreListener.remove();
  		this.state.eventStatsListener.remove();
			$("#privacy-checkbox").bootstrapSwitch('destroy');
  	}
  	handleEventUpdated(){
  		//fill this in
  		console.log("event successfully updated");
  	}
  	//function for create
  	handleEventCreatedSuccessfully(){

  		console.log("event successfully created");
  		//reset the state
  		this.clear();
  		this.notificationSystem.addNotification({
    	 	message: 'Event successfully created',
     		position: 'bc',
     		level: 'success'
    	});
  	}
  	handleImageThumbUploadedSuccessfully(){

  		console.log("image successfully uploaded");
  		//reset the state
  		//this.clear();
  		var state = this.state;
  		state.event.thumbnailUrl = eventsStore.getThumbImageCrop();
  		this.setState(state);
  		this.notificationSystem.addNotification({
    	 	message: 'Image successfully uploaded',
     		position: 'bc',
     		level: 'success'
    	});
    	$("#blah").attr("src", "");
  	}
  	handleImageUrlUploadedSuccessfully(){

  		console.log("image successfully uploaded");
  		//reset the state
  		//this.clear();
  		var state = this.state;
  		state.event.imageUrl = eventsStore.getUrlImageCrop();
  		this.setState(state);
  		this.notificationSystem.addNotification({
    	 	message: 'Image successfully uploaded',
     		position: 'bc',
     		level: 'success'
    	});
    	console.log($('#blah'));
    	$("#blah").attr("src", "");
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
		this.state.event.startDate = moment(this.state.startDate + " " +  this.state.startTime).format();
		this.state.event.endDate = new Date(this.state.event.startDate).getTime() + (60*60*1000);
		console.log('handleButtonClick');
		console.log('this is the event data that is getting sent off');
		console.log(this.state.event);
		if(eventsStore.updateIsSet()){
			this.state.event.eventID = this.state.event.id;
			eventsActions.updateEvent(this.state.event);
		}
		else{
			eventsActions.createEvent(this.state.event);
		}
	}
	handleEventUpdatedSuccessfully(){
 		console.log("event successfully updated");
 		this.clear();
 		//debugger;

 		//this.setState(state);
 		//debugger;
 		this.notificationSystem.addNotification({
   	 	message: 'Event successfully updated',
    		position: 'bc',
   		level: 'success'
   	});
   	console.log('notification');
  }
	handlePrivacyChange(){
		console.log('Privacy Radio was pressed');
	}
	handleDateChange(key, format, dateMoment){
		this.state[key] = dateMoment.format(format);
	}
	clear(){
		var state = this.state;
 		state.success = true;
 		state.event = {
 			'title' : null,
 			'date': 0,
 			'location' : null,
			'description' : '',
 			'private' : false,
 			'description' : null,
			'imageUrl' : null,
 			'thumbnailUrl' : null
 		}
 		//debugger;
 		this.setState(state);
	}
	componentWillReceiveProps(newProps){
		console.log('got some new props yo');
		if(newProps.startDate !== null){
			var date = newProps.startDate.split('|');
			this.state.startDate = date[0];
			this.state.startTime = date[1];
			$('#privacy-checkbox').bootstrapSwitch('state', false);
			this.clear();
		}
	}
	//method to save image
	saveImage(){
		//do that son!
		console.log($('#blah').cropper('getCroppedCanvas'));
		$('#blah').cropper('getCroppedCanvas').toBlob((blob) => {
		  var formData = new FormData();
		  formData.append('fileType', this.state.imageType);
		  console.log(blob);
		  formData.append('file', blob);
		  console.log(formData);
			eventsActions.uploadImage(formData, this.state.imageType);
		}, "image/png");

	}
	// openDescModal(){
 //    $('#imageModal').modal('show');
	//   }
	  openImageModal(type){
	    setTimeout(()=>{
	      window.dispatchEvent(new Event('resize'));
	    },500);
	    this.state.imageType = type;
	    console.log(this.state.imageType);
	    $('#imageModal').modal('show');
	  }
	render(){
		var {event, success, date, mode, format, inputFormat, startDate} = this.state;
		var iCropper;
		var temporaryImage;
		var style = {
	  		NotificationItem: { // Override the notification item
	   		DefaultStyle: { // Applied to every notification, regardless of the notification level
	    	margin: '10px 5px 2px 1px'
	    },
	    success: { // Applied only to the success notification item
	     // borderTop: '2px solid ' + defaultColors.success.hex,
	     // backgroundColor: 'grey',
	     borderTop: '2px solid ' + "#55A9C6",
	      color: 'black'
	    }
	  }
	}
	console.log('privacy ' + event.private)
	return (
		<div className='form-container'>
			<form className = 'form-all'>
				<div>
					<label className ='form-title'>Title</label>
					<input id='eventTitleInput' className='form-control' value={event.title} onChange={this.handleChange('title')}/>
				</div>
				<br/>
				<div>
					<label className='form-title'>Privacy</label>
					<div id='switch-wrapper'>
						<input type='checkbox' id='privacy-checkbox' checked={event.private}/>
					</div>

				</div>
				<div >
					<label className ='form-date'>Start Date</label>
					<DatePicker id='startDate' type='date' date={this.state.startDate} onChange={this.handleDateChange.bind(this, 'startDate', 'LL')}/>
				</div>
				<div>
					<label className ='form-time'>Start Time</label>
					<DatePicker id='startTime' type='time' date={this.state.startTime} onChange={this.handleDateChange.bind(this, 'startTime', 'LT')}/>
				</div>
				<div >
					<label className ='form-location'>Location</label>
					<input className='form-control' value={event.location} onChange={this.handleChange('location')}/>
				</div>
				
				
			    <div className= 'form-image-thumb'>
			      <label className='form-image-thumb'>Thumbnail Image</label>
			      <div className='input-group'>
				      <input type="text" className="form-control" value={event.thumbnailUrl} onChange={this.handleChange('thumbnailUrl')}/>
				      <span className="input-group-btn">
				        <button className="btn btn-default" type="button" onClick={this.openImageModal.bind(this, 'thumbnail')}>Crop Image</button>
				      </span>
			      </div>
			    </div>
				<div className= 'form-image-banner'>
			      <label className='form-image-banner'>Banner Image</label>
			      <div className='input-group'>
				      <input type="text" className="form-control" value={event.imageUrl} onChange={this.handleChange('imageUrl')}/>
				      <span className="input-group-btn">
				        <button className="btn btn-default" type="button" onClick={this.openImageModal.bind(this, 'banner')}>Crop Image</button>
				      </span>
			      </div>
			    </div>  				
				<div >
					<label className= 'form-description'>Description of Event</label>
					<textarea className='form-control' rows='3' value={event.description}  onChange={this.handleChange('description')}/>
				</div>
				<div>
					<label className = 'form-submit'></label>
					<button className ="btn btn-primary" type = 'button'  onClick={this.handleButtonClick.bind(this)}>Submit</button>
				</div>
				<div>
  				  <NotificationSystem ref='notificationSystem' style={style}/>
  			</div>
			</form>
			<Modal id='imageModal' title="Thumbnail">
		          <div id='selectImage' style={{'width' : '100%', 'height' : '400px'}}>
		            <div>
					<ImageCropper />
					<button className="btn btn-primary btn-sm pull-right text-center" type = "button" onClick={this.saveImage.bind(this)}>Save Image</button>

					</div>
		          </div>
		    </Modal>
		</div>
		);
	}
}
					// <div>
					// 	<a className="btn btn-primary btn-sm pull-right text-center" onClick={this.openImageModal.bind(this)}>Crop Image
					// 	</a>
					// </div>