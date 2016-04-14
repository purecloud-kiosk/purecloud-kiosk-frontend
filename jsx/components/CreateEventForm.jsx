'use strict';
import React, {Component} from 'react';
import * as eventActions from '../actions/eventActions';
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
			var imageEither = null;


    	this.state = {
    		startDate : moment(event.startDate).format('LL') || null,
    		startTime : moment(event.startDate).format('LT') || null,
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
    		},
				update : this.props.update || false
				//event : null
    	};
  	}
  	// after component successfully rendered
  	componentDidMount(){
			this.state.submitListener = eventsStore.addListener(eventsConstants.SUBMIT_FORM, this.handleSubmit.bind(this));
  		if(this.state.update){
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
			// seems to not render properly without this...
			$('#privacy-checkbox').bootstrapSwitch('_width');
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
  	handleImageThumbUploadedSuccessfully(id){

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
    	console.log($('#'+ id));
    	$('#'+ id).attr("src", "");
  	}
  	handleImageUrlUploadedSuccessfully(id){

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
    	console.log($('#'+ id));
    	$('#'+ id).attr("src", "");
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
	handleSubmit(){
		this.handleButtonClick();
	}
	handleButtonClick(){
		this.state.event.startDate = moment(this.state.startDate + " " +  this.state.startTime).format();
		this.state.event.endDate = new Date(this.state.event.startDate).getTime() + (60*60*1000);
		console.log('handleButtonClick');
		console.log('this is the event data that is getting sent off');
		console.log(this.state.event);
		if(this.state.update){
			this.state.event.eventID = this.state.event.id;
			eventActions.updateEvent(this.state.event);
		}
		else{
			eventActions.createEvent(this.state.event);
		}
	}
	handleEventUpdatedSuccessfully(){
 		console.log("event successfully updated");
 		if(!this.props.update){
			this.clear();
		}
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
 			'stateDate': null,
 			'endDate' : null,
 			'location' : null,
 			'private' : false,
 			'description' : null,
			'imageUrl' : null,
 			'thumbnailUrl' : null
 		}
 		//debugger;
 		this.setState(state);
	}
	componentWillReceiveProps(newProps){
		//console.log('got some new props yo');
		if(newProps.startDate !== undefined){
			var date = newProps.startDate.split('|');
			this.state.startDate = date[0];
			this.state.startTime = date[1];
			$('#privacy-checkbox').bootstrapSwitch('state', false);
			this.clear();
		}
	}
	//method to save image
	saveImage(id){
		//do that son!
		console.log($('#'+ id).cropper('getCroppedCanvas'));
		$('#'+ id).cropper('getCroppedCanvas').toBlob((blob) => {
		  var formData = new FormData();
			formData.append('fileName', this.state.imageType);
		  formData.append('fileType', this.state.imageType);
		  console.log(blob);
		  formData.append('file', blob);
		  console.log(formData);
			eventActions.uploadImage(formData, this.state.imageType);
		}, "image/png");
	}
	saveImage2(id){
		//do that son!
		console.log($('#'+ id).cropper('getCroppedCanvas'));
		$('#'+ id).cropper('getCroppedCanvas').toBlob((blob) => {
		  var formData = new FormData();
			formData.append('fileName', this.state.imageType);
		  formData.append('fileType', this.state.imageType);
		  console.log(blob);
		  formData.append('file', blob);
		  console.log(formData);
			eventActions.uploadImage(formData, this.state.imageType);
		}, "image/png");
	}
  openImageModal(type){
    setTimeout(()=>{
      window.dispatchEvent(new Event('resize'));
    },500);
    this.state.imageType = type;
    this.setState(this.state);
    console.log(this.state.imageType);
    $('#imageModal').modal('show');
  }
  openImageModal2(type){
    setTimeout(()=>{
      window.dispatchEvent(new Event('resize'));
    },500);
    this.state.imageType = type;
    this.setState(this.state);
    console.log(this.state.imageType);
    $('#imageModal2').modal('show');
  }
	render(){
		const {event, success, date, mode, format, inputFormat, startDate} = this.state;
		const {hideButton} = this.props;
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
	let submit = (
		<div>
			<label className = 'form-submit'></label>
			<button className ="btn btn-primary" type = 'button'  onClick={this.handleButtonClick.bind(this)}>Submit</button>
		</div>
	);
	if(hideButton){
		submit = null;
	}
	return (
		<div className='form-container'>
			<form className='form-all'>
				<div>
					<label className ='form-title'>Title</label>
					<input id='eventTitleInput' className='form-control' value={event.title} onChange={this.handleChange('title')}/>
				</div>
				<div>
					<label className='form-title'>Privacy</label>
					<div id='switch-wrapper'>
						<input type='checkbox' id='privacy-checkbox' checked={event.private}/>
					</div>
				</div>
				<div>
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

				<br/>
		    <div className= 'form-image-thumb'>
		      <label className='form-image-thumb'>Thumbnail Image</label>
		      <div className='input-group'>
			      <input type="text" className="form-control" value={event.thumbnailUrl} onChange={this.handleChange('thumbnailUrl')}/>
			      <span className="input-group-btn">
			        <button className="btn btn-default" type="button" onClick={this.openImageModal.bind(this, 'thumbnail')}>Crop Image</button>
			      </span>
		      </div>
		    </div>
				<br/>
				<div className= 'form-image-banner'>
		      <label className='form-image-banner'>Banner Image</label>
		      <div className='input-group'>
			      <input type="text" className="form-control" value={event.imageUrl} onChange={this.handleChange('imageUrl')}/>
			      <span className="input-group-btn">
			        <button className="btn btn-default" type="button" onClick={this.openImageModal.bind(this, 'banner')}>Crop Image</button>
			      </span>
		      </div>
		    </div>
				<div>
					<label className= 'form-description'>Description of Event</label>
					<textarea className='form-control' value={event.description}  onChange={this.handleChange('description')}/>
				</div>
				{submit}
				<div>
  				  <NotificationSystem ref='notificationSystem' style={style}/>
  			</div>

			</form>
			<Modal id='imageModal' title="Thumbnail">
       			 <div style={{'width' : '100%', 'height' : '400px'}}>
					<ImageCropper id='thumbCropper' type = {this.state.imageType} ></ImageCropper>
					<div className>
						<button className="btn btn-primary btn-sm pull-right text-center" type = "button" onClick={this.saveImage.bind(this, 'thumbCropper')}>Save Image</button>
       			 	</div>
       			 </div>
	   		</Modal>
		    <Modal id='imageModal2' title="Banner">
	       		 <div style={{'width' : '100%', 'height' : '400px'}}>
						<ImageCropper id='bannerCropper' type = {this.state.imageType} > </ImageCropper>
						<div className>
							<button className="btn btn-primary btn-sm pull-right text-center" type = "button" onClick={this.saveImage2.bind(this, 'bannerCropper')}>Save Image</button>
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
