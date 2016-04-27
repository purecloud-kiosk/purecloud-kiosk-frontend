'use strict';
import React, { Component } from 'react';
import i18next from 'i18next';
import Modal from './Modal';
import CreateEventForm from './CreateEventForm';
import * as navActions from '../actions/navActions';
import * as eventActions from '../actions/eventActions';
import * as eventsConstants from '../constants/eventsConstants';
import history from '../history/history';
import eventDetailsStore from '../stores/eventDetailsStore';
import ManageEventManagersView from './ManageEventManagersView';
import ManageInvitesView from './ManageInvitesView';
export default class FileWidget extends Component{
  constructor(props){
    super(props);
    this.state = {
      'event' : eventDetailsStore.getCurrentEvent(),
      'files' : this.props.files,
      'remove' : this.props.remove
    };
  }
  componentDidMount(){

  }
  componentWillReceiveProps(newProps){
    console.log('new props for file widget');
    this.state.files = newProps.files;
    this.setState(this.state);
  }
  handleRemoveButtonClicked(file){
    eventActions.removeFile(file.id);
  }

  render(){
    const {files, remove} = this.state;
    let removeHeader;
    if(remove){
      removeHeader = (<th></th>)
    }
    let rows = files.map((file)=> {
      let removeButton;
      if(remove){
        removeButton = (
          <td>
            <button className='btn btn-danger' onClick={this.handleRemoveButtonClicked.bind(this, file)}>{i18next.t('REMOVE')}</button>
          </td>
        );
      }
      console.log(file);
      return (
        <tr className='animated fadeInLeft' key={file.id}>
          <td><a href={file.url} download>{file.fileName}</a></td>
          <td>{moment(file.uploadDate).format('LLL')}</td>
          {removeButton}
        </tr>
      )
    });
    return (
      <div className='widget'>
        <div className='widget-header'>
          {i18next.t('EVENT_FILES')}
        </div>
        <div className={'widget-body no-padding ' + this.props.size}>
          <table className='table table-hover'>
            <thead>
              <tr>
                <th>{i18next.t('FILE_NAME')}</th>
                <th>{i18next.t('UPLOAD_DATE')}</th>
                {removeHeader}
              </tr>
            </thead>
            <tbody>
              {rows}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
