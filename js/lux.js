/*---------------- AJAX FUNCTIONS ------------------*/
(Ajax("../Lux/Assets/query.php", {"query":{"type":"card"}}
	,function(data){
		console.log("initial query");
		console.log(data);
		if(data[0] == "Access Code is invalid or has Expired"){
        		window.location = "/PhonicsAdmin/index.html";
		}
	}));

/* 
 * Makes the AJAX calls to Lux specifically
 * Handles the Authorization stuff as well, 
 * so that the user does not have to
 */
function Ajax(urlCall, data, callback){ // done and functional
	var url = getJsonFromUrl();
        var http = new XMLHttpRequest();
        http.onreadystatechange=function(){
                if(http.readyState==4 && http.status==200){
                        console.log(http.responseText);
                        callback(JSON.parse(http.responseText));
                }
        }
	console.log(JSON.stringify(data) + " ?access_token="+url.access_token);
        
	urlBase = "http://demo.philadelphiagamelab.org/Lux/";
        http.open("POST", urlBase + urlCall + "?access_token="+url.access_token, true);
        http.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        http.send(JSON.stringify(data));
}
/* This is the function that needs to be used when uploading a file 
 * To the server, it is not possible to simply use the AJAX function 
 * above, because it does not have the file handler
 */
function AjaxUpload(fileHandler, name){// done and functional
     	if(fileHandler.files[0].set != undefined && fileHandler.files[0].set){
		return;
	}	
	var url = getJsonFromUrl();
        var http = new XMLHttpRequest();
        http.onreadystatechange=function(){
                if(http.readyState==4 && http.status==200){
                        console.log("UPLOADED---------------");
			console.log(http.responseText);
                }
        }
     	
	/* Create a FormData instance */
      	var formData = new FormData();

	/* Display the progress of the upload */
	http.upload.onprogress = function(e) {
	    if (e.lengthComputable) {
	      var percentComplete = (e.loaded / e.total) * 100;
	      console.log(percentComplete + '% uploaded');
	    }
	  };

      	formData.append("file", fileHandler.files[0]);
      	formData.append("name", name);
	
	/* Send the Request to the server */
        urlBase = "http://demo.philadelphiagamelab.org/Lux/";
        http.open("POST", urlBase + "Upload/upload.php?access_token="+url.access_token);
      	http.send(formData);  /* Send to server */ 
}
/*
 * This function can be used to display an image that is stored on 
 * the local machine. For instance, in the case of an upload.
 */
function displayImage(fileHandler, imageArea){
	if ( window.FileReader ) {
	  reader = new FileReader();
	  reader.onloadend = function (e) { 
		var list = fileHandler.parentNode,
		li   = document.createElement("li"),
		img  = document.createElement("img");
		img.src = e.target.result;
		li.appendChild(img);
		imageArea.appendChild(li);
	  };
	  reader.readAsDataURL(fileHandler.files[0]);
	}
}

/* Pretty self explanitory */
function getJsonFromUrl() {// done and functional
  var query = location.search.substr(1);
  var result = {};
  query.split("&").forEach(function(part) {
    var item = part.split("=");
    result[item[0]] = decodeURIComponent(item[1]);
  });
  return result;
}
var url = getJsonFromUrl();
if(!url.hasOwnProperty("access_token")){
        window.location = "/PhonicsAdmin/index.html";
}else{
	document.getElementById("lbuilder").href += "?access_token="+url.access_token;
	document.getElementById("wbuilder").href += "?access_token="+url.access_token;
	document.getElementById("sbuilder").href += "?access_token="+url.access_token;
}


/* This function sets up what is needed for the audio recording to 
 * take place. It first builds an audioContext, and then a mediaStreamSource,
 * and then it spawns a worker to do that actual recording stuff
 */
var recorder;
$(function() {
/*
  var playbackRecorderAudio = function (recorder, context) {
    recorder.getBuffer(function (buffers) {
      var source = context.createBufferSource();
      source.buffer = context.createBuffer(1, buffers[0].length, 44100);
      source.buffer.getChannelData(0).set(buffers[0]);
      source.buffer.getChannelData(0).set(buffers[1]);
      source.connect(context.destination);
      source.start();
    });
  }
*/
  navigator.webkitGetUserMedia({"audio": true}, function(stream) {

    var audioContext = new AudioContext() || new webkitAudioContext();
    var mediaStreamSource = audioContext.createMediaStreamSource( stream );
   // mediaStreamSource.connect( audioContext.destination );

    recorder = new Recorder(mediaStreamSource, {
      workerPath: "js/script/lib/recorderjs/recorderWorker.js"
    });

  },
  function(error){}); 
})
/*
 * This function can be used to display an image that is stored on 
 * the local machine. For instance, in the case of an upload.
 */
function displayImage(fileHandler, imageArea){
	if ( window.FileReader ) {
	  reader = new FileReader();
	  reader.onloadend = function (e) { 
		var list = fileHandler.parentNode,
		li   = document.createElement("li"),
		img  = document.createElement("img");
		img.src = e.target.result;
		li.appendChild(img);
		imageArea.appendChild(li);
	  };
	  reader.readAsDataURL(fileHandler.files[0]);
	}
}

/* 
 * Puts the current file name in the place 
 * of the label. if it is not in the expected position, 
 * it will search the surounding positions. Otherwise 
 * it will error out and not make a change. 
 */
function fileSelected(element){
	console.log("File Selected");
	var splitWord = "";
	if(element.tagName == "INPUT"){
		splitWord = element.files[0].name.split('\\');
        	//element.nextSibling.innerHTML = "Click to Select File";
	}else{
		if(element.previousSibling.tagName == "INPUT"){
			splitWord = element.previousSibling.files[0].name.split('\\');
			splitWord = element.previousSibling.files[0].set = false;
		}else if(element.previousSibling.previousSibling.tagName == "INPUT"){
			splitWord = element.previousSibling.previousSibling.files[0].name.split('\\');
			splitWord = element.previousSibling.previousSibling.files[0].set = false;
		}else if(element.nextSibling.tagName == "INPUT"){
			splitWord = element.nextSibling.files[0].name.split('\\');
			splitWord = element.nextSibling.files[0].set = false;
		}else{
			console.log(element);
		}
	}
	if(element.tagName == "LABEL"){
        	element.innerHTML = splitWord[splitWord.length-1];
	}else if(element.nextSibling.nextSibling.tagName == "LABEL"){
        	element.nextSibling.nextSibling.innerHTML = splitWord[splitWord.length-1];
	}else if(element.nextSibling.tagName == "LABEL"){
        	element.nextSibling.innerHTML = splitWord[splitWord.length-1];
	}else if(element.nextSibling.nextSibling.nextSibling.tagName == "LABEL"){
        	element.nextSibling.nextSibling.nextSibling.innerHTML = splitWord[splitWord.length-1];
	}else{
		console.log("ERROR: CANNOT FIND THE LABEL FOR THIS INPUT");
	}
}
/* Checks to see if an element is a label or an input
 * then finds the input that is appropriate to that
 * label, and clicks it.
 */
function clickPrevious(element){
	if(element.tagName == "LABEL"){
		if(element.previousSibling.previousSibling.tagName == "INPUT"){
		// if 2 before is an input, click it. 
			element.previousSibling.previousSibling.click();
		}else if(element.previousSibling.tagName == "INPUT"){
		// if 1 before is an input, click it. 
			element.previousSibling.click();
		}else if(element.previousSibling.previousSibling.previousSibling.tagName == "INPUT"){
		// if 3 before is an input, click it
			element.previousSibling.previousSibling.previousSibling.click();
		}
	}
}

// This function needs to prevent the window from popping up on 
// an audio recording. Or force it to pop-up the appropriate thing.  
function clickIt(element, dontClick){
	// Needs to click or not click the element
	if(element.tagName != "INPUT" && !dontClick){
	// if the element is a label, and (click), 
		clickPrevious(element);
	}else if(element.tagName == "INPUT" && dontClick){
	// if the element is an input && dont click.	
		window.event.preventDefault();
		window.event.stopImmediatePropagation();
	}else if(element.tagName == "INPUT" && !dontClick){
		var clickEvent = element.onclick;
		element.onclick = function(){ return true;};
		element.click();
		element.onclick = clickEvent;
	}
}

function closeModal(callback){
	if($("#simple-modal-overlay")[0] != undefined){
		$("#simple-modal-overlay")[0].remove();
	}
	if($("#simple-modal")[0] != undefined){
		$("#simple-modal")[0].remove();
	}
	callback();
}

/* If it is not an audio recording, then just click the
 * closest previous input. 
 * If it is an audio box, then prevent the input from being clicked
 * then pop-up a dialog to see if they want to record
 */
function clickPrevious(element, audio){
	if(audio != undefined && audio){
	// this is an audio upload section
		// pop-up to ask if they would like to use the audio functionalityy
		// or upload a file.
		console.log("Prompting for recording");
		clickIt(element, true);
		var SM = new SimpleModal({"btn_ok":"Confirm Recording", draggable:false});
	        SM.show({
	        	"model":"confirm",
	        	"callback": function(){
				closeModal(function(){
					console.log("retrieving audio recording");
					retrieveAudio(element);
				});
	        	},
			"closeButton":false,
			"close":function(){
				closeModal(function(){
					console.log("Uploading Instead");
					// TODO: THIS SHOULD TRIGGER THE FILE SELECTION DIALOG
					clickIt(element, false);
				});
			},
	        	"title":"Confirm Audio",
	            	"contents":"Would you like to use the Microphone? If you would rather upload a file- press cancel."
		});
	}else{
	// this is an image upload section. 
		//clickIt(element, false);
	}
}
/*
 * Pop-up a recording dialog and wait for the user to finish 
 * with the recording before doing anything. 
 */
function retrieveAudio(element){
	recorder.clear();
	recorder.record();
	//setTimeout(function(){ stopRecording(element) }, 5000);
	// This should not be a timeout, it should be a "click to stop recording thingy";
		var SM2 = new SimpleModal({"btn_ok":"Stop Recording", draggable:false});
	        SM2.show({
	        	"model":"confirm",
	        	"callback": function(){
				closeModal(function(){
					console.log("Stopping the Audio recording");
	        			stopRecording(element);	
				});
	        	},
			"closeButton":false,
			"close":function(){
				closeModal(function(){
					console.log("Not Uploading or Recording");
				});
			},
	        	"title":"Recording Audio",
	            	"contents":"Audio is recording..."
		});
}
/*Stops the audio recording and then 
 * runs an Override function that is 
 * built into word.js and builder.js
 * seperately 
 */
function stopRecording(element){
	console.log("STOPING THE RECORDING");
	recorder.stop();
	recorder.exportWAV(function(wav) {
		exportAudio(element, wav);
		fileSelected(element);
	});
}


// Random object sorting algorithm that no one needs:
//
//
function objSort(obj, param) {
  var temp_array = [];
  var temp_array2 = [];
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      temp_array.push(key);
      temp_array2.push(obj[key][param]);
    }
  }
    temp_array.sort(function(a,b){
		return obj[a][param] - obj[b][param];
	});
  var temp_obj = {};
  for (var i=0; i<temp_array.length; i++) {
    temp_obj[temp_array[i]] = obj[temp_array[i]];
  }
  return temp_obj;
};
