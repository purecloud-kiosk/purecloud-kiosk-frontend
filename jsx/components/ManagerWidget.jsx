import React, {
  Component
} from 'react';
import * as eventActions from '../actions/eventActions';
import eventsStore from '../stores/eventsStore';
import eventsConstants from '../constants/eventsConstants';
import LoadingIcon from './LoadingIcon';
import Modal from "./Modal";
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
      'showManagerStatus' : this.props.showManagerStatus
    };
  }
  componentWillReceiveProps(newProps){
    console.log('got new props');
    this.state.users = newProps.users;
    this.setState(this.state);
  }
  handleAddClicked(user){
    eventActions.addEventManager({
      'eventID' : this.state.event.id,
      'manager' : {
        'personID' : user.personID,
        'email' : user.email,
        'name' : user.name,
        'image' : user.image,
        'orgGuid' : this.state.event.orgGuid
      }
    }).done((data) => {
      user.eventManager = 'added';
    }).fail((error) => {
      console.log(error);
      user.eventManager = 'unable';
    }).always(()=>{
      this.setState(this.state);
    });
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
            managerButton = 'Already a manager'
          }
          else{ // false
            managerButton = (<button className='btn btn-primary' onClick={this.handleAddClicked.bind(this, user)}>Add Manager</button>)
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
                <th>Manager</th>
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
      <div className='widget animated fadeInDown'>
        <div className='widget-header'>
          <i className={'fa ' + faIcon}></i>
          {title}
        </div>
        <div className='widget-body medium no-padding'>
          {content}
        </div>
      </div>
    );
  }
}
