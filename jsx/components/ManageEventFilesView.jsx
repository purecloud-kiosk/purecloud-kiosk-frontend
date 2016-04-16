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
      'formData' : null
    };
  }
  componentDidMount(){
    this.state.eventFilesListener =
      eventDetailsStore.addListener(eventsConstants.EVENT_FILES_RETRIEVED, this.updateEventFiles.bind(this));
    this.state.fileAddedListener =
      eventDetailsStore.addListener(eventsConstants.FILE_ADDED, this.addFile.bind(this));
    this.state.fileRemovalListener =
      eventDetailsStore.addListener(eventsConstants.FILE_REMOVED, this.onFileRemoved.bind(this));
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
    if(this.state.formData === null){
      alert('nope');
    }
    else{
      eventActions.uploadImage(this.state.formData, 'event');
    }
  }
  render(){
    const {files} = this.state;
    return (
      <div>
        <h4>Event File Upload</h4>
        <form class="form-inline" onSubmit={(e) => {e.preventDefault()}}>
          <div class="form-group">
            <label for="fileInput">File</label>
            <FileInput id='fileInput' placeholder='Click here to select your file' className='file-input form-control' accept='*' onChange={this.readFile.bind(this)}/>
          </div>
          <button type="submit" class="btn btn-primary" onClick={this.uploadFile.bind(this)}>Upload File</button>
        </form>
        <FileWidget files={files} size='large' remove={true}/>
      </div>
    );
  }
}
