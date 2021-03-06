import React, {
  Component
} from 'react';
import i18next from 'i18next';
import * as eventActions from '../actions/eventActions';
import * as navActions from '../actions/navActions';
import eventDetailsStore from '../stores/eventDetailsStore';
import eventsConstants from '../constants/eventsConstants';
import LoadingIcon from './LoadingIcon';
import Modal from "./Modal";
import statsStore from '../stores/statsStore';
/**
 *  This is a generic user widget that lists users.
 **/
export default class ManagerWidget extends Component{
  constructor(props){
    super(props);
    console.log(props);
    this.state = {
      'event' : this.props.event,
      'users' : this.props.users,
      'showManagerStatus' : this.props.showManagerStatus,
      'removeOnDelete' : this.props.removeOnDelete
    };
  }
  componentDidMount(){
    this.state.errorListener =
      eventDetailsStore.addListener(eventsConstants.ERROR, this.onRemoveFailed.bind(this));
    this.state.onRemoveListener =
      eventDetailsStore.addListener(eventsConstants.ATTENDEE_ADDED, this.onAttendeeAdded.bind(this));
    this.state.onAddListener =
      eventDetailsStore.addListener(eventsConstants.ATTENDEE_REMOVED, this.onAttendeeRemoved.bind(this));
  }
  componentWillReceiveProps(newProps){
    console.log('got new props');
    this.state.users = newProps.users;
    this.setState(this.state);
  }
  handleAddClicked(user){
    console.log(user);
    console.log(this.state);
    eventActions.addAttendee({
      'eventID' : this.state.event.id,
      'attendee' : {
        'personID' : user.personID,
        'email' : user.email,
        'name' : user.name,
        'image' : user.image,
        'orgGuid' : this.state.event.orgGuid
      }
    });
  }
  onAttendeeAdded(){
    console.log('added');
    let attendee = eventDetailsStore.getAddedAttendee();
    this.state.users.some((user) => {
      if(user.personID === attendee.personID){
        user.invited = true;
        return true;
      }
    })
    if(this.props.removeOnDelete){
      this.state.users.unshift(attendee);
    }
    this.setState(this.state);
  }
  removeAttendee(){
    let user = this.state.currentUser;
    console.log(this.state);
    $('#removeCheck').modal('hide');
    eventActions.removeAttendee({
      'eventID' : this.state.event.id,
      'personID' : user.personID
    });
  }
  onRemoveFailed(){
    let error = eventsStore.getError();
    if(JSON.parse(error.responseText).code === 600){
      $('#lastManager').modal('show');
    }
  }
  onAttendeeRemoved(){
    console.log('on removed called');
    let personID = eventDetailsStore.getRemovedAttendee();
    let index;
    for(let i = 0; i < this.state.users.length; i++){
      console.log(this.state.users[i]);
      if(this.state.users[i].personID === personID){
        this.state.users[i].invited = false;
        index = i;
        break;
      }
    }
    if(this.props.removeOnDelete){
      if(index !== undefined)
        this.state.users.splice(index, 1);
    }
    this.setState(this.state);
  }
  handleRemoveClicked(user){
    console.log(user);
    console.log(this.state);
    this.state.currentUser = user;
    console.log(statsStore.getUserStats());
    this.removeAttendee(user);

  }
  render(){
    const {title, faIcon, emptyMsg, showManagerStatus} = this.props;
    const {users} = this.state;
    let content, rows;
    if(users.length === 0){
      content = emptyMsg;
    }
    else{
      rows = (
        users.map((user) => {
          let inviteButton;
          console.log(user.name);
          console.log(user);

          if(user.eventManager === true){
            inviteButton = i18next.t('EVENT_MANAGER');
          }
          else if(this.props.removeOnDelete){
            inviteButton = (
              <button className='btn btn-danger' onClick={this.handleRemoveClicked.bind(this, user)}>
                {i18next.t('REMOVE')}
              </button>
            )
          }
          else if(user.invited === undefined){
            inviteButton = <LoadingIcon/>
          }
          else if(user.invited === true){
            inviteButton = (
              <button className='btn btn-danger' onClick={this.handleRemoveClicked.bind(this, user)}>
                {i18next.t('REMOVE')}
              </button>
            )
          }
          else{ // not a manager, show add button
            inviteButton = (
              <button className='btn btn-info' onClick={this.handleAddClicked.bind(this, user)}>
                {i18next.t('INVITE')}
              </button>
            );
          }
          let image = user.image;
          if(image === undefined || image === null)
            image = 'img/avatar.jpg';
          return (
            <tr className='animated fadeInLeft' key={user.personID}>
              <td>
                <img width='30px' height='30px' src={image}></img>
              </td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                {inviteButton}
              </td>
            </tr>
          );
        })
      );
      content = (
        <div className='table-responsive'>
          <table className='table table-hover'>
            <thead>
              <tr>
                <th>{i18next.t('IMAGE')}</th>
                <th>{i18next.t('NAME')}</th>
                <th>{i18next.t('EMAIL')}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows}
            </tbody>
          </table>
        </div>
      );
    };
    return (
      <div className='widget'>
        <div className='widget-header'>
          <i className={'fa ' + faIcon}></i>
          {title}
        </div>
        <div className='widget-body large no-padding'>
          {content}
        </div>
      </div>
    );
  }
}
