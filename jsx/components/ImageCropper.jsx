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
		this.state = {
			imgUrl : "img/no-image.png",
			id : this.props.id
			//id : null
		};
	}
	componentWillReceiveProps(newProps) {
    console.log('got some better props', newProps);
    //this.setState({id :this.newProps.id});
    	// this.props = {
    	// 	id : newProps.id
    	// };
   //  	if (newProps.type == "banner"){
   //  		iType = newProps.type;
	  //   } 
	  //   else{
	  //   	iType=newProps.type;
	  //   }

  	}
	componentDidMount(){

		//this.setState(id);
		// $('#blah').cropper({
		// 	responsive:true,
	 //  		aspectRatio: 16 / 9,
	 //  		crop: function(e) {
	 //    // Output the result data for cropping image.
	 //   		 console.log(e.x);
		// 	  console.log(e.y);
		// 	  console.log(e.width);
		// 	  console.log(e.height);
		// 	  console.log(e.rotate);
		//     console.log(e.scaleX);
		//     console.log(e.scaleY);
		//   }
		// });
	// 	$().cropper('getCroppedCanvas').toBlob(function (blob) {
	// 	  var formData = new FormData();

	// 	  formData.append('croppedImage', blob);

	// 	  $.ajax('/path/to/upload', {
	// 	    method: "POST",
	// 	    data: formData,
	// 	    processData: false,
	// 	    contentType: false,
	// 	    success: function () {
	// 	      console.log('Upload success');
	// 	    },
	// 	    error: function () {
	// 	      console.log('Upload error');
	// 	    }
	// 	  });
	// 	});
	}
	componentWillUnmount(){
  	
  	}

	readURL(input) {
		console.log('called');
		console.log(this.state);
		const {id} = this.state;
        if (input.target.files && input.target.files[0]) {
            var reader = new FileReader();
            reader.onload = (e) => {
            	//console.log(e.target.result);
    //         	$('#blah').cropper({
				//  	responsive:true,
    //        		 	aspectRatio: 16 / 9,
				//   crop: function(e) {
				//     // Output the result data for cropping image.
				//     console.log(e.x);
				//     console.log(e.y);
				//     console.log(e.width);
				//     console.log(e.height);
				//     console.log(e.rotate);
				//     console.log(e.scaleX);
				//     console.log(e.scaleY);
				//     ("replace", e.target.result);
				//   }
				// });
				console.log("called image type");
				console.log("the id is " + id);
				//$('#' + this.state.id).cropper("replace", "avatar.jpg");
				if(this.state.id == "bannerCropper"){
					$('#'+ this.state.id).cropper("setAspectRatio", 1.618);
					$('#'+ this.state.id).cropper({
					responsive: true,
					aspectRatio: 16/9,
					scaleX: 1,
					scaleY: 1
					});
				} else {
					$('#'+ this.state.id).cropper("setAspectRatio", 1.33333);
					$('#'+ this.state.id).cropper({
					responsive: true,
					aspectRatio: 3/4,
					scaleX: 1,
					scaleY: 1
					});
				}
                $('#'+ this.state.id ).cropper("replace", e.target.result);
            };
            reader.readAsDataURL(input.target.files[0]);
        }

	}

	render() {

    	var image;
		return(
			<div>
				<div className="file-input2">
					<FileInput className='file-input' accept=".png,.gif,.jpeg,.jpg" onChange={this.readURL.bind(this)} />
					<img id = {this.state.id} width='100%' height='400px' src={this.state.imgUrl} alt="your image" />
				</div>
			</div>
			);
	}

}
/*


*/
