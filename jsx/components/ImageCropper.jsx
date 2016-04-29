"use strict";
import React, {Component} from "react";
import * as eventActions from "../actions/eventActions";
import eventsStore from "../stores/eventsStore";
import eventsConstants from "../constants/eventsConstants";
//initialize variables
var FileInput = require('react-file-input');
import NumbersWidget from './NumbersWidget';
import EventsTableWidget from './EventsTableWidget';
import CreateEventForm from './CreateEventForm';
//var id = "bannerCropper";
export default class ImageCropper extends Component {
	constructor(props){
		super(props);
		//var id = this.props.id || {};
		let image = this.props.image;
		console.log('cropper constructor');
		this.state = {
			image : undefined,
			id : this.props.id,
			fileSelected : false,
			loading : false,
			key : (Math.random() + 1).toString(36).substring(7)
		};
		console.log(this.state);
	}
	componentWillReceiveProps(newProps){
		console.log('cropper new props');
		if(newProps.image !== this.state.image){
			console.log(newProps.image);
			console.log(this.state.image);
			console.log('key change');
			//this.state.key = (Math.random() + 1).toString(36).substring(7);
		}
		this.setState(this.state);
	}
	componentDidUpdate(){
		console.log(this.state.fileSelected);
		//this.initCropper();
	}
	componentDidMount(){
		$(window).on('resize', () => {
			console.log('cropper resize');
			$('#'+ this.state.id).cropper('reset');
		});
		console.log('mounted');
		this.initCropper();
	}
	initCropper(){
		console.log('init called');
		console.log(this.state.id);
		if(this.state.id === "bannerCropper"){
			$('#'+ this.state.id).cropper({
				responsive: true,
				aspectRatio: 1.618,
				scaleX: 1,
				scaleY: 1,
				minCanvasHeight : 200,
				minContainerHeight :400
			});
		} else {
			$('#'+ this.state.id).cropper({
				responsive: true,
				aspectRatio: 1,
				scaleX: 1,
				scaleY: 1,
				minCanvasHeight : 200,
				minContainerHeight : 400
			});
		}
	}
	readURL(input) {
		console.log('called');
		console.log(this.state);
		const {id} = this.state;
    if (input.target.files && input.target.files[0]) {
        var reader = new FileReader();
        reader.onload = (e) => {
          $('#'+ this.state.id ).cropper("replace", e.target.result);
					this.state.fileSelected = true;
					this.setState(this.state);
					eventActions.emitCropperStateChange(this.state.id);
        };
        reader.readAsDataURL(input.target.files[0]);
    }
	}

	render() {
		console.log(this.state);
		return(
			<div>
				<div className="file-input2">
					<FileInput  className='file-input' accept=".png,.gif,.jpeg,.jpg" onChange={this.readURL.bind(this)} />
					 <img id={this.state.id} className='hide-element' width='100%' height='400px' src={this.state.image} alt="your image" />
				</div>
			</div>
		);
	}
}
/*


*/
