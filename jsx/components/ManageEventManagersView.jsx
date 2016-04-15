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
export default class EventManagerView extends Component{
  constructor(props){
    super(props);
    console.log('Eventmanager')
    console.log(this.props.event);
    this.state = {
      'event' : this.props.event,
      'managers' : [],
      'managerSearchResults' : []
    };
  }
  componentDidMount(){
    this.state.eventManagerListener =
      eventDetailsStore.addListener(eventsConstants.EVENT_MANAGERS_RETRIEVED, this.updateEventManagers.bind(this));
    this.state.pureCloudSearchListener =
      pureCloudStore.addListener(pureCloudConstants.USER_SEARCH_RETRIEVED, this.updateSearchResults.bind(this));
    this.state.bulkCheckInListener =
      eventDetailsStore.addListener(eventsConstants.BULK_CHECKINS_RETRIEVED, this.updateManagerStatus.bind(this));
    eventActions.getEventManagers(this.state.event.id);
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
    state.managerSearchResults = pureCloudStore.getSearchResults();
    state.managerSearchResults = state.managerSearchResults.map((user) => {
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
    eventActions.bulkRetrieveCheckIns(this.state.event.id, personIDs);
    this.setState(state);
  }
  updateManagerStatus(){
    console.log('Updated')
    let state = this.state;
    let managers = eventDetailsStore.getBulkRetrievedCheckIns();
    let ids = [];
    managers.forEach((manager) => {
      if(manager.eventManager)
        ids.push(manager.personID);
    });
    state.managerSearchResults.forEach((user) => {
      console.log(user);
      if(ids.indexOf(user.personID) != -1)
        user.eventManager = true;
      else
        user.eventManager = false;
    });
    this.setState(state);
  }
  updateEventManagers(){
    let state = this.state;
    state.managers = eventDetailsStore.getEventManagers();
    this.setState(state);
  }
  render(){
    const {managerSearchResults, managers, event} = this.state;
    return (
      <div className='col-sm-12'>
        <PeopleTypeAhead id='managerTypeAhead'/>
        <ManagerWidget title='Search Results'
          event={event} users={managerSearchResults}/>
        <ManagerWidget title='Event Managers' event={event} users={managers} removeOnDelete={true}/>
      </div>
    );
  }
}
