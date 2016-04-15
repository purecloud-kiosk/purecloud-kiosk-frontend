import React, {
  Component
} from 'react';
import * as eventActions from '../actions/eventActions';
import * as navActions from '../actions/navActions';
import eventsStore from '../stores/eventsStore';
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
      eventsStore.addListener(eventsConstants.ERROR, this.onRemoveFailed.bind(this));
    this.state.onRemoveListener =
      eventsStore.addListener(eventsConstants.MANAGER_REMOVED, this.onManagerRemoved.bind(this));
    this.state.onAddListener =
      eventsStore.addListener(eventsConstants.MANAGER_ADDED, this.onManagerAdded.bind(this));
  }
  componentWillReceiveProps(newProps){
    console.log('got new props');
    this.state.users = newProps.users;
    this.setState(this.state);
  }
  handleAddClicked(user){
    console.log(user);
    console.log(this.state);
    eventActions.addEventManager({
      'eventID' : this.state.event.id,
      'manager' : {
        'personID' : user.personID,
        'email' : user.email,
        'name' : user.name,
        'image' : user.image,
        'orgGuid' : this.state.event.orgGuid
      }
    });
  }
  onManagerAdded(){
    let manager = eventsStore.getAddedManager();
    manager.eventManager = true;
    this.state.users.some((user) => {
      if(user.personID === manager.personID){
        user.eventManager = true;
        return true;
      }
    });
    if(this.props.removeOnDelete){
      this.state.users.unshift(manager);
    }
    this.setState(this.state);
  }
  removeEventManager(){
    let user = this.state.currentUser;
    $('#removeCheck').modal('hide');
    eventActions.removeEventManager({
      'eventID' : this.state.event.id,
      'managerID' : user.personID
    });
  }
  onRemoveFailed(){
    let error = eventsStore.getError();
    if(JSON.parse(error.responseText).code === 600){
      $('#lastManager').modal('show');
    }
  }
  onManagerRemoved(){
    let personID = eventsStore.getRemovedManager();
    let index;
    for(let i = 0; i < this.state.users.length; i++){
      if(this.state.users[i].personID === personID){
        index = i;
        this.state.users[i].eventManager = false;
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
    if(statsStore.getUserStats().personID === user.personID){
      $('#removeCheck').modal('show');
    }
    else{
      this.removeEventManager(user);
    }
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
          let managerButton;
          if(user.eventManager === null){
            managerButton = <LoadingIcon/>
          }
          else if(user.eventManager === 'added'){
            managerButton = 'Added';
          }
          else if(user.eventManager === 'unable'){
            managerButton = 'Unable to be added';
          }
          else if(user.eventManager === true){
            managerButton = (
              <button className='btn btn-danger' onClick={this.handleRemoveClicked.bind(this, user)}>
                Remove
              </button>
            );
          }
          else{ // not a manager, show add button
            managerButton = (
              <button className='btn btn-primary' onClick={this.handleAddClicked.bind(this, user)}>
                Add
              </button>
            );
          }
          return (
            <tr className='animated fadeInLeft' key={user.personID}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{managerButton}</td>
            </tr>
          );
        })
      );
      content = (
        <div className='table-responsive'>
          <table className='table table-hover'>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
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
        <Modal title='Warning' id='removeCheck' submitCallback={this.removeEventManager.bind(this)}
          submitText='Yes' cancelText='No'>
          Are you sure you want to remove your management privileges?
        </Modal>
        <Modal title='Warning' id='lastManager' cancelText='Okay'>
          There is only one manager for this event. Please either delete this event or
          pass management privileges to another user, then remove yourself.
        </Modal>
      </div>
    );
  }
}
