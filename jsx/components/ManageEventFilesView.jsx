'use strict';
import React, { Component } from 'react';
import Modal from './Modal';
import CreateEventForm from './CreateEventForm';
import * as navActions from '../actions/navActions';
import * as eventActions from '../actions/eventActions';
import eventsConstants from '../constants/eventsConstants';
import history from '../history/history';
import eventDetailsStore from '../stores/eventDetailsStore';
import ManageEventManagersView from './ManageEventManagersView';
import ManageInvitesView from './ManageInvitesView';
import FileWidget from './FileWidget';
import FileInput from 'react-file-input';
export default class ManageView extends Component{
  constructor(props){
    super(props);
    this.state = {
      'event' :this.props.event,
      'files' : [],
      'formData' : null,
      'buttonActive' : true
    };
  }
  componentDidMount(){
    this.state.eventFilesListener =
      eventDetailsStore.addListener(eventsConstants.EVENT_FILES_RETRIEVED, this.updateEventFiles.bind(this));
    this.state.fileAddedListener =
      eventDetailsStore.addListener(eventsConstants.FILE_ADDED, this.addFile.bind(this));
    this.state.fileRemovalListener =
      eventDetailsStore.addListener(eventsConstants.FILE_REMOVED, this.onFileRemoved.bind(this));
    this.state.fileErrorListener =
      eventDetailsStore.addListener(eventsConstants.ERROR, this.onFileError.bind(this));
    eventActions.getEventFiles(this.state.event.id);
  }
  componentWillUnmount(){
    this.state.eventFilesListener.remove();
    this.state.fileAddedListener.remove();
  }
  onFileRemoved(){
    let index;
    let removedFileID = eventDetailsStore.getRemovedFileID();
    for(let i = 0; i < this.state.files.length; i++){
      if(this.state.files[i] === removedFileID){
        index = i;
        break;
      }
    }
    this.state.files.splice(index, 1);
    this.setState(this.state);
  }
  updateEventFiles(){
    this.state.files = eventDetailsStore.getEventFiles();
    this.setState(this.state);
  }
  addFile(){
    this.state.files.push(eventDetailsStore.getAddedFile());
    this.state.buttonActive = true;
    this.setState(this.state);
  }
  readFile(input){
    if (input.target.files && input.target.files[0]){
        // handle everything here
        var formData = new FormData();
  			formData.append('fileName', input.target.files[0].name);
  		  formData.append('fileType', 'eventFile');
        formData.append('eventID' , this.state.event.id);
        formData.append('file', input.target.files[0]);
        this.state.formData = formData;
    }
  }
  uploadFile(){
    let state = this.state;
    if(state.buttonActive){
      if(state.formData === null){
        alert('nope');
      }
      else{
        state.buttonActive = false;
        eventActions.uploadImage(state.formData, 'event');
      }
    }
    this.setState(state);
  }
  render(){
    const {files, buttonActive} = this.state;
    let active = buttonActive ? 'active' : '';
    return (
      <div>
        <h4>File Upload</h4>
        <form className="form-inline" onSubmit={(e) => {e.preventDefault()}}>
          <div className="form-group" id='file-form'>
            <label for="fileInput">File</label>
            <FileInput className='form-control' name='event-file-input'
              placeholder='Click here to select your file' className='form-control'
              accept='*' onChange={this.readFile.bind(this)}/>
            <br></br>
            <button type="button" className={"btn btn-primary " + active}  onClick={this.uploadFile.bind(this)}>Upload File</button>
          </div>
        </form>
        <FileWidget files={files} size='large' remove={true}/>
      </div>
    );
  }
}
