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
import LoadingIcon from './LoadingIcon';
import i18next from 'i18next';

export default class ManageView extends Component{
  constructor(props){
    super(props);
    this.state = {
      'event' :this.props.event,
      'files' : [],
      'formData' : null,
      'buttonActive' : false,
      'fileLoading' : false,
      'inputKey' : (Math.random() + 1).toString(36).substring(7)
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
      eventDetailsStore.addListener(eventsConstants.FILE_ERROR, this.onFileError.bind(this));
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
    this.state.buttonActive = false;
    this.state.fileLoading = false;
    this.state.inputKey = (Math.random() + 1).toString(36).substring(7);
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
        this.state.buttonActive = true;
        this.setState(this.state);
    }
  }
  uploadFile(){
    let state = this.state;
    if(state.buttonActive){
      if(state.formData === null){

      }
      else{
        state.buttonActive = false;
        state.fileLoading = true;
        eventActions.uploadImage(state.formData, 'event');
      }
    }
    this.setState(state);
  }
  onFileError(){
    this.state.buttonActive = true;
    this.setState(this.state);
  }
  render(){
    const {files, buttonActive, fileLoading, inputKey} = this.state;
    let active = buttonActive ? '' : 'disabled';
    let loadingIcon;
    if(fileLoading)
      loadingIcon = <LoadingIcon/>;
    return (
      <div>
        <h4>File Upload</h4>
        <form id='file-input-form' className="form-inline" onSubmit={(e) => {e.preventDefault()}}>
          <div className="form-group" id='file-form'>
            <label for="fileInput">File</label>
            <FileInput className='form-control' name='event-file-input'
              placeholder='Click here to select your file' id='event-file-input'
              accept='*' onChange={this.readFile.bind(this)}
              key={inputKey}/>
            <br></br>
            <button type="button" className={"btn btn-primary " + active}  onClick={this.uploadFile.bind(this)}>{i18next.t('UPLOAD_FILE')}</button>
            {loadingIcon}
          </div>
        </form>
        <FileWidget files={files} size='large' remove={true}/>
      </div>
    );
  }
}
