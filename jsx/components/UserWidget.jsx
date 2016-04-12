import React, {
  Component
} from 'react';
import * as eventActions from '../actions/eventActions';
import eventsStore from '../stores/eventsStore';
import eventsConstants from '../constants/eventsConstants';

import Modal from "./Modal";
/**
 *  This is a generic user widget that lists users.
 **/
export default class UserWidget extends Component{
  constructor(props){
    super(props);
    console.log(props);
    this.state = {
      'users' : this.props.users
    };
  }
  componentDidMount(){

  }
  componentWillReceiveProps(newProps){
    console.log('got new props');
    this.state.users = newProps.users;
    this.setState(this.state);
  }
  handleRowClick(user){
    eventActions.getUser(user.personID);
    $('#userModal').modal('show');
  }
  showUser(){

  }
  render(){
    console.log('USER WIDGET');
    console.log(this.state.users);
    const {title, faIcon, emptyMsg} = this.props;
    const {users} = this.state;
    let content, rows;
    if(users.length === 0){
      content = emptyMsg;
    }
    else{
      rows = (
        users.map((user) => {
          return (
            <tr className='animated fadeInLeft' key={user.personID} onClick={this.handleRowClick.bind(this, user)}>
              <td>{user.name}</td>
              <td>{user.email}</td>
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
              </tr>
            </thead>
            <tbody>
              {rows}
            </tbody>
          </table>
        </div>
      ) ;
    }
    return (
      <div className='col-md-4 col-sm-6 col-lg-3'>
        <div className='widget animated fadeInDown'>
          <div className='widget-header'>
            <i className={'fa ' + faIcon}></i>
            {title}
          </div>
          <div className='widget-body medium no-padding'>
            {content}
          </div>
        </div>
      </div>
    );
  }
}