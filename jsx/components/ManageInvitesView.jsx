import React,{
  Component
} from 'react';
import * as eventActions from "../actions/eventActions";
import * as pureCloudActions from '../actions/pureCloudActions';
import eventDetailsStore from "../stores/eventDetailsStore";
import pureCloudStore from '../stores/pureCloudStore';
import eventsConstants from "../constants/eventsConstants";
import pureCloudConstants from '../constants/pureCloudConstants';
import UserWidget from './UserWidget';
import PeopleTypeAhead from './PeopleTypeAhead';
import ManagerWidget from './ManagerWidget';
import InviteWidget from './InviteWidget';
export default class EventManagerView extends Component{
  constructor(props){
    super(props);
    console.log('Eventmanager')
    console.log(this.props.event);
    this.state = {
      'event' : this.props.event,
      'userSearchResults' : [],
      'invites' : []
    };
  }
  componentDidMount(){
    this.state.eventManagerListener =
      eventDetailsStore.addListener(eventsConstants.EVENT_INVITES_RETRIEVED, this.updateEventInvites.bind(this));
    this.state.pureCloudSearchListener =
      pureCloudStore.addListener(pureCloudConstants.USER_SEARCH_RETRIEVED, this.updateSearchResults.bind(this));
    this.state.bulkCheckInListener =
      eventDetailsStore.addListener(eventsConstants.BULK_CHECKINS_RETRIEVED, this.updateInviteStatus.bind(this));
    eventActions.getEventInvites(this.state.event.id);
    pureCloudActions.searchUsers('');
  }
  componentWillUnmount(){
    this.state.eventManagerListener.remove();
    this.state.pureCloudSearchListener.remove();
    this.state.bulkCheckInListener.remove();
  }
  updateSearchResults(){
    let state = this.state;
    let personIDs = '';
    state.userSearchResults = pureCloudStore.getSearchResults();
    state.userSearchResults = state.userSearchResults.map((user) => {
      personIDs += user._id + ',';
      let data = {
        'name' : user.general.name[0].value,
        'email' : user.primaryContactInfo.email[0].ref,
        'personID' : user._id,
        'eventManager' : null,
        'image' : user._id,
        'orgGuid'  : state.event.orgGuid
      };
      if(user.images !== undefined)
        data.image = user.images.profile[0].ref.x200;
      return data;
    });
    console.log('sending personIDs');
    console.log(personIDs);
    eventActions.bulkRetrieveCheckIns(this.state.event.id, personIDs);
    this.setState(state);
  }
  updateInviteStatus(){
    let state = this.state;
    let invites = eventDetailsStore.getBulkRetrievedCheckIns();
    let ids = [];
    for(let i = 0; i < invites.length; i++){
      ids.push(invites[i].personID);
    }
    state.userSearchResults.forEach((user) => {
      let index = ids.indexOf(user.personID) ;
      if(index !== -1){
        user.invited = true;
        user.eventManager = invites[index].eventManager;
      }
      else{
        user.invited = false;
      }
    });
    this.setState(state);
  }
  updateEventInvites(){
    let state = this.state;
    state.invites = eventDetailsStore.getInvites();
    console.log('recieved invites');
    console.log(this.state.invites);
    this.setState(state);
  }
  render(){
    const {userSearchResults, invites, event} = this.state;
    return (
      <div className='col-sm-12'>
        <PeopleTypeAhead id='inviteTypeAhead'/>
        <InviteWidget title='Search Results' event={event} users={userSearchResults}/>
        <InviteWidget title='Event Attendees' event={event} users={invites} removeOnDelete={true}/>
      </div>
    );
  }
}
