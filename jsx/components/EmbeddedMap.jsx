import React, {Component} from 'react';
import requestConstants from '../constants/requestConstants';
export default class EmbeddedMap extends Component{
  constructor(props){
    super(props);
  }
  render(){
    return (
      <iframe className='map' frameborder="0"
        src={"https://www.google.com/maps/embed/v1/place?q=" + this.props.location + "&key=" + requestConstants.GOOGLE_API_KEY}
        allowfullscreen>
      </iframe>
    );
  }
}
