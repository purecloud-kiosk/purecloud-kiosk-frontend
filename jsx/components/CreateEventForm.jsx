'use strict';
import React, {Component} from 'react';
import i18next from "i18next";
import * as eventActions from '../actions/eventActions';
import eventsStore from '../stores/eventsStore';
import eventDetailsStore from '../stores/eventDetailsStore';
import eventsConstants from '../constants/eventsConstants';
import DatePicker from './DatePicker';
import ImageCropper from './ImageCropper';
import LoadingIcon from './LoadingIcon';
import Modal from "./Modal";

var NotificationSystem = require('react-notification-system');
export default class Events extends Component {
		constructor(props) {
			super(props);
			var event = this.props.event || {};
			this.notificationSystem = null;
			var imageEither = null;

		//set the set
    	this.state = {
    		startDate : moment(event.startDate).format('LL') || null,
    		startTime : moment(event.startDate).format('LT') || null,
    		// endDate : moment(event.endDate).format('LL') || null,
    		// endTime : moment(event.endDate).format('LT') || null,
    		//outside the event variables important to time/date/success
    		error : null,
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
				update : this.props.update || false,
				thumbModalKey : (Math.random() + 1).toString(36).substring(7),
				bannerModalKey : (Math.random() + 1).toString(36).substring(7),
				bannerLoading : false,
				thumbLoading : false,
				showBannerSave : false,
				showThumbSave : false
				//event : null
    	};
  	}
  	// after component successfully rendered
  	componentDidMount(){
  			//for submission

			var state = this.state;
   		//this case handles the update flag is set then do this part
  		if(this.state.update){
   			var event = eventDetailsStore.getCurrentEvent();
   			//add listener
			console.log('updating');
   			this.state.eventStatsListener = eventsStore.addListener(eventsConstants.EVENT_UPDATED, this.handleEventUpdatedSuccessfully.bind(this));
   			this.notificationSystem = this.refs.notificationSystem;
   			console.log(this.notificationSystem);
   			//var event = eventsStore.getCurrentEvent();
   			//add event data
   			state.event = event;
				// convert to local
			var startDate = moment.utc(event.startDate).toDate();
			state.startDate = moment(startDate).format('LL');
			state.startTime = moment(startDate).format('LT');
   			this.setState(state);
   		}
   		//else this is a new event
   		else{

				var state = this.state;
				state.event.startDate = this.props.startDate;
				console.log('form rerendered');
				this.setState(state);

   		}
   			//notification and listeners established
   			console.log(endDate);
			state.endDate = moment(state.event.endDate).format('LL');
			state.endTime = moment(state.event.endDate).format('LT');
			this.notificationSystem = this.refs.notificationSystem;
			this.state.submitListener = eventsStore.addListener(eventsConstants.SUBMIT_FORM, this.handleSubmit.bind(this));
			this.state.eventStatsListener = eventsStore.addListener(eventsConstants.EVENT_CREATED, this.handleEventCreatedSuccessfully.bind(this));
   		this.state.thumbnailListener = eventDetailsStore.addListener(eventsConstants.IMAGE_THUMB_STORED, this.handleImageThumbUploadedSuccessfully.bind(this));
			this.state.bannerListener = eventDetailsStore.addListener(eventsConstants.IMAGE_URL_STORED, this.handleImageUrlUploadedSuccessfully.bind(this));
			this.state.errorListener = eventDetailsStore.addListener(eventsConstants.ERROR, this.handleError.bind(this));
			this.state.cropperListener = eventDetailsStore.addListener(eventsConstants.CROPPER_CHANGE, this.onCropperChange.bind(this));
			$('#privacy-checkbox').bootstrapSwitch({
				'onText' : i18next.t('PRIVATE'),
				'offText' : i18next.t('PUBLIC'),
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
			this.setState(state);
  	}
  	//release the listeners
  	componentWillUnmount(){
			this.state.submitListener.remove();
	  		this.state.thumbnailListener.remove();
			this.state.bannerListener.remove();
	  		this.state.eventStatsListener.remove();
	  		this.state.errorListener.remove();
			$("#privacy-checkbox").bootstrapSwitch('destroy');
  	}
		onCropperChange(){
			if(eventDetailsStore.getCropperID() === 'bannerCropper')
				this.state.showBannerSave = true;
			else
				this.state.showThumbSave = true;
			this.setState(this.state);
		}
  	handleError(){
  		console.log('HANDLE ERROR');
  		this.state.error = eventDetailsStore.getError();
  		console.log(this.state.error);
  		console.log(this.state.error.responseJSON.code);
  		if (this.state.error.responseJSON.code == 33){
  			this.notificationSystem.addNotification({
	    	 	message: 'Event with same name aleady exists',
	     		position: 'bc',
	     		level: 'error'
    		});

  		} else if (this.state.error.responseJSON.code == 9){
  			this.notificationSystem.addNotification({
	    	 	message: 'Event end time needs to be after event start time',
	     		position: 'bc',
	     		level: 'error'
    		});

  		}
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
  	//image is uploaded successfully for a thumbnail
  	handleImageThumbUploadedSuccessfully(id){

  		console.log("image successfully uploaded");
  		//reset the state
  		//this.clear();
  		var state = this.state;
  		state.event.thumbnailUrl = eventDetailsStore.getThumbImageCrop();
			state.thumbLoading = false;
  		this.setState(state);
  		this.notificationSystem.addNotification({
    	 	message: 'Image successfully uploaded',
     		position: 'bc',
     		level: 'success'
    	});
    	console.log($('#'+ id));
    	$('#'+ id).attr("src", "");
			$('#imageModal').modal('hide');
  	}
  	//image is uploaded for a banner
  	handleImageUrlUploadedSuccessfully(id){

  		console.log("image successfully uploaded");
  		//reset the state
  		//this.clear();
  		var state = this.state;
  		state.event.imageUrl = eventDetailsStore.getUrlImageCrop();
			state.bannerLoading = false;
  		this.setState(state);
  		this.notificationSystem.addNotification({
    	 	message: i18next.t('SUCCESSFUL_IMAGE_UPLOAD'),
     		position: 'bc',
     		level: 'success'
    	});

    	console.log($('#'+ id));
    	$('#'+ id).attr("src", "");
			$('#imageModal2').modal('hide');
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
	//actions associated with handleButtonClick()
	handleButtonClick(){
		this.state.event.startDate = moment(this.state.startDate + " " +  this.state.startTime).format();
		this.state.event.endDate = moment(this.state.endDate + " " +  this.state.endTime).format();
		console.log('handleButtonClick');
		console.log('this is the event data that is getting sent off');
		console.log(this.state.event);
		if(this.state.error !== null){
			console.log("This is what Error is occurring");
			console.log(this.state.error);
		}
		if(this.state.update){
			this.state.event.eventID = this.state.event.id;
			eventActions.updateEvent(this.state.event);
		}
		else{
			eventActions.createEvent(this.state.event);
		}

	}
	//everything was updated successfully
	handleEventUpdatedSuccessfully(){
 		console.log("event successfully updated");
 		if(!this.props.update){
			this.clear();
		}
 		this.notificationSystem.addNotification({
   	 	message: i18next.t('SUCCESSFUL_EVENT_UPDATE'),
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
	//this method clears out the form besides the date and time
	clear(){
		var state = this.state;
 		state.success = true;
 		state.event = {
 			'title' : null,
 			'stateDate': null,
 			'endDate' : null,
 			'location' : null,
 			'private' : false,
 			'description' : '',
			'imageUrl' : null,
 			'thumbnailUrl' : null
 		};
		state.bannerModalKey = (Math.random() + 1).toString(36).substring(7);
		state.thumbModalKey = (Math.random() + 1).toString(36).substring(7);
		state.bannerLoading = false;
		state.thumbLoading = false;
		state.showBannerSave = false;
		state.showThumbSave = false;
 		//debugger;
 		this.setState(state);
	}
	//new props for entering the form
	componentWillReceiveProps(newProps){
		//console.log('got some new props yo');
		if(newProps.startDate !== undefined){
			// var date = newProps.startDate.split('|');
			// var date2 = newProps.startDate.split('|');
			let start = newProps.startDate;
			let end = moment(newProps.startDate).add(1, 'h');
			this.state.startDate =  moment(start).format('LL');
			this.state.startTime = moment(start).format('LT');
			this.state.endDate = moment(end).format('LL');
			this.state.endTime = moment(end).format('LT');
			$('#privacy-checkbox').bootstrapSwitch('state', false);
			this.clear();
		}
	}
	//method to save image
	//seperated into two different methods depending on whether it is a thumbnail
	saveImage(id){

		console.log($('#'+ id).cropper('getCroppedCanvas'));
		$('#'+ id).cropper('getCroppedCanvas').toBlob((blob) => {
		  var formData = new FormData();
			formData.append('fileName', this.state.imageType);
		  formData.append('fileType', this.state.imageType);
		  console.log(blob);
		  formData.append('file', blob);
		  console.log(formData);
			eventActions.uploadImage(formData, this.state.imageType);
			console.log(this.state.imageType);
			if(this.state.imageType === 'banner'){
				this.state.bannerLoading = true;
			}
			else{
				this.state.thumbLoading = true;
			}
			this.setState(this.state);
		}, "image/png");
	}

	//thumbnail open image modal
  openImageModal(type){
    setTimeout(()=>{
      window.dispatchEvent(new Event('resize'));
    },500);
    this.state.imageType = type;
    //this.setState(this.state);
    //console.log(this.state.imageType);
    $('#imageModal').modal('show');
  }
  //banner open image modal
  openImageModal2(type){
    setTimeout(()=>{
      window.dispatchEvent(new Event('resize'));
    },500);
    this.state.imageType = type;
    //this.setState(this.state);
    //console.log(this.state.imageType);
    $('#imageModal2').modal('show');
  }
  //the render method
	render(){
		const {event, success, date, mode, format, inputFormat,
			startDate, endDate, bannerLoading, thumbLoading,
			bannerModalKey, thumbModalKey, showBannerSave, showThumbSave} = this.state;
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
			<button className="btn btn-primary btn-block" type='button' onClick={this.handleButtonClick.bind(this)}>Submit</button>
			<br/>
			<br/>
		</div>

	);
	let banner, thumbnail;
	if(event.imageUrl !== null && event.imageUrl !== undefined && event.imageUrl.length > 0){
		banner = <img className='pull-right' width='80' height='60' src={event.imageUrl}></img>
	}
	if(event.thumbnailUrl !== null && event.thumbnailUrl !== undefined && event.thumbnailUrl.length > 0){
		thumbnail = <img className='pull-right'width='80' height='80' src={event.thumbnailUrl}></img>
	}
	if(hideButton){
		submit = null;
	}
	//the return: where HTML lives
	return (
		<div className='form-container'>
			<form className='form-all'>
				<div>
					<label className ='form-title'>{i18next.t('TITLE')}</label>
					<input id='eventTitleInput' className='form-control' value={event.title} onChange={this.handleChange('title')}/>
				</div>
				<div>
					<label className ='form-title'>{i18next.t('PRIVACY')}</label>
					<div id='switch-wrapper'>
						<input type='checkbox' id='privacy-checkbox' checked={event.private}/>
					</div>
				</div>
				<div>
					<label className ='form-title'>{i18next.t('START_DATE')}</label>
					<DatePicker id='startDate' type='date' date={this.state.startDate} onChange={this.handleDateChange.bind(this, 'startDate', 'LL')}/>
				</div>
				<div>
					<label className ='form-title'>{i18next.t('START_TIME')}</label>
					<DatePicker id='startTime' type='time' date={this.state.startTime} onChange={this.handleDateChange.bind(this, 'startTime', 'LT')}/>
				</div>
				<div>
					<label className ='form-title'>{i18next.t('END_DATE')}</label>
					<DatePicker id='endDate' type='date' date={this.state.endDate} onChange={this.handleDateChange.bind(this, 'endDate', 'LL')}/>
				</div>
				<div>
					<label className ='form-title'>{i18next.t('END_TIME')}</label>
					<DatePicker id='endTime' type='time' date={this.state.endTime} onChange={this.handleDateChange.bind(this, 'endTime', 'LT')}/>
				</div>
				<div >
					<label className ='form-title'>{i18next.t('LOCATION')}</label>
					<input className='form-control' value={event.location} onChange={this.handleChange('location')}/>
				</div>

				<br/>
		    <div className= 'form-image-thumb'>
		      <label className ='form-title'>{i18next.t('THUMBNAIL_IMAGE')}</label>
		      <div className='input-group'>
			      <input type="hidden" className="form-control" value={event.thumbnailUrl} onChange={this.handleChange('thumbnailUrl')}/>
			      <span className="input-group-btn">
			        <button className="btn btn-default" type="button" onClick={this.openImageModal.bind(this, 'thumbnail')}>Upload Image</button>
			      </span>
						{thumbnail}
		      </div>
		    </div>
				<br/>
				<div className= 'form-image-banner'>
		      <label className ='form-title'>{i18next.t('BANNER_IMAGE')}</label>
		      <div className='input-group'>
			      <input type="hidden" className="form-control" value={event.imageUrl} onChange={this.handleChange('imageUrl')}/>
			      <span className="input-group-btn">
			        <button className="btn btn-default" type="button" onClick={this.openImageModal2.bind(this, 'banner')}>Upload Image</button>
			      </span>
						{banner}
		      </div>
		    </div>
				<div>
					<label className ='form-title'>{i18next.t('DESCRIPTION_OF_EVENT')}</label>
					<textarea className='form-control description-textarea' value={event.description}
						rows='3' onChange={this.handleChange('description')}/>
				</div>
				<br/>
				<div className='text-center'>
					{submit}
				</div>
				<div>
  				  <NotificationSystem ref='notificationSystem' style={style}/>
  			</div>
			</form>
			<Modal id='imageModal' title="Thumbnail" cancelText='Close'
				submitButtonClass={showThumbSave ? '' : 'disabled'}
				submitText='Save'
				submitCallback={this.saveImage.bind(this, 'thumbCropper')}>
				<div className={thumbLoading ? '' : 'hide-element'} style={{'height' : '400px'}}>
					<div className='text-center image-loading-block'>
						Uploading Image
						<LoadingIcon/>
					</div>
				</div>
				<div  key={thumbModalKey} id='thumbCropperContainer' className={thumbLoading ? 'hide-element' : ''}>
					<ImageCropper id='thumbCropper' type ='' image={event.thumbnailUrl}></ImageCropper>
				</div>
	   	</Modal>
		  <Modal id='imageModal2' title="Banner" cancelText='Close'
				submitButtonClass={showBannerSave ? '' : 'disabled'}
				submitText='Save'
				submitCallback={this.saveImage.bind(this, 'bannerCropper')}>
				<div className={bannerLoading ? '' : 'hide-element'} style={{'height' : '400px'}}>
					<div className='text-center image-loading-block'>
						Uploading Image
						<LoadingIcon/>
					</div>
				</div>
				<div  key={bannerModalKey} id='bannerCropperContainer' className={bannerLoading ? 'hide-element' : ''}>
					<ImageCropper id='bannerCropper' type ='bannerCropper' image={event.imageUrl}> </ImageCropper>
				</div>
		  </Modal>
		</div>
		);
	}
}
