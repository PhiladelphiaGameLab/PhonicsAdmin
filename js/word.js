function hasError(){
	// check that all required are there
	var error = false;
	var inputs = document.getElementsByClassName("Required");
	for(var i =0; i<inputs.length; i++){
		if(inputs[i].value != "" || inputs[i].value != undefined){
			inputs[i].parentNode.className = "form-group has-success";
		}else{
			if(inputs[i].files != undefined || !inputs[i].files[0].set){
				inputs[i].parentNode.className = "form-group has-error";
				error = true;
			}else{
				inputs[i].parentNode.className = "form-group has-success";
			}
		}
	}
	return error;
}
function clearWord(){
	// Clear the words
	var inputs = document.getElementsByTagName("INPUT");
	for(var i =0; i<inputs.length; i++){
		inputs[i].value = "";
		if(inputs[i].files != undefined){
			inputs[i].nextSibling.nextSibling.innerHTML = "Click to Select File";
			inputs[i].files[0] = {set:false};
		}
		inputs[i].parentNode.className = "form-group";
	}
}
function submitWord(element){
	if(!hasError()){
		var word = document.getElementsByClassName("word")[0];
		var syllable = document.getElementsByClassName("syllable")[0];
		var pron = document.getElementsByClassName("pron")[0];
		var image = document.getElementsByClassName("image")[0];
		var audio = document.getElementsByClassName("audio")[0];
		var update = {	
				"type":"word"
				,"word":word.value.toLowerCase()
				,"syllable":syllable.value.toLowerCase()
				,"pron":pron.value
			};
		var d = new Date();
		var n = d.getTime();
		if(image.files.length > 0 || image.files[0] != undefined){
			var name =  n.toString() + (Math.floor(Math.random()*100000000000)).toString() + image.files[0].name;
			update.image = "http://demo.philadelphiagamelab.org/uploads/" + name;
			AjaxUpload(image, name);
		}
		if(audio.files.length > 0 || audio.files[0] != undefined){
			var name =  n.toString() + (Math.floor(Math.random()*100000000000)).toString() + audio.files[0].name;
			update.audio = name;
			AjaxUpload(audio, name);
		}
		Ajax("Assets/upsert.php", {query:{"word":word.value}, update:update},
			function(){
				clearWord();
			});
	}
}
function append(element){
	var unicode = element.innerHTML;
	var input = document.getElementsByClassName("pron")[0];
	input.value += unicode;
	input.focus();
}
function appendDot(element){
	var unicode = element.innerHTML;
	var input = document.getElementsByClassName("syllable")[0];
	input.value += unicode;
	input.focus();
	
}
function fillWord(){
	var word = document.getElementsByClassName("word")[0];
	Ajax("Assets/query.php", {query:{type:"word", "word":word.value.toLowerCase()}},
	function(data){
		if(data[1].length == 0){
			document.getElementsByClassName("syllable")[0].value =  "";
			document.getElementsByClassName("pron")[0].value = "";
					document.getElementsByClassName("audio")[0].value = "";
					document.getElementsByClassName("audio_label")[0].innerHTML = "Click to Select File";
					document.getElementsByClassName("audio")[0].files[0] = {set:false};
					
					document.getElementsByClassName("image")[0].value = "";
					document.getElementsByClassName("image_label")[0].innerHTML = "Click to Select File";
					document.getElementsByClassName("image")[0].files[0] = {set:false};
		}else{
			for(key in data[1]){
				console.log("Setting Attributes");
					document.getElementsByClassName("audio")[0].value = "";
					document.getElementsByClassName("audio_label")[0].innerHTML = "Click to Select File";
					document.getElementsByClassName("audio")[0].files[0] = {set:false};
					
					document.getElementsByClassName("image")[0].value = "";
					document.getElementsByClassName("image_label")[0].innerHTML = "Click to Select File";
					document.getElementsByClassName("image")[0].files[0] = {set:false};
				document.getElementsByClassName("syllable")[0].value =  data[1][key]["syllable"];
				document.getElementsByClassName("pron")[0].value = data[1][key]["pron"];
				if(data[1][key]["audio"] != undefined && document.getElementsByClassName("audio")[0].files.length == 0){
					document.getElementsByClassName("audio")[0].files[0] = {"name": data[1][key]["audio"], set:true};
					document.getElementsByClassName("audio_label")[0].innerHTML = data[1][key]["audio"].substring(24);
				}
				if(data[1][key]["image"] != undefined && document.getElementsByClassName("image")[0].files.length == 0){
					document.getElementsByClassName("image")[0].files[0] = {"name": data[1][key]["image"], set:true};
					document.getElementsByClassName("image_label")[0].innerHTML = data[1][key]["image"].substring(24);
				}
			}

		}
	     });
}


/*************************/
/*************************/
/*************************/
/* AUDIO RECORDING STUFF */
/*************************/
/*************************/
/*************************/
function exportAudio(element, wav){
	// need to save this to the right place instead of uploading
	document.getElementsByClassName("audio")[0].files[0] = wav;
	var word = document.getElementsByClassName("word")[0].value;
	document.getElementsByClassName("audio")[0].files[0].name = word+"_custom.wav";
	document.getElementsByClassName("audio")[0].files[0].set = false;
}
