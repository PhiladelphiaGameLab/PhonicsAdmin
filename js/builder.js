var newlesson;
var newcard;
var suggestion;
/* 
 * Sets Global Variables by making a copy, also runs the loadAllLessons() 
 * function, which pulls old lessons from the database
 */
window.onload=function(){
	console.log("======= WINDOW LOADED =========");
	loadAllLessons();
	newlesson = document.getElementsByClassName("lessonpanel")[0].cloneNode(true);
	newcard = document.getElementsByClassName("thiscard")[0].cloneNode(true);
	suggestion = document.getElementsByClassName("suggestion")[0];
}

/*
 * This Function is used in conjunction with checkWords
 * and simply verifies that all the required fields that
 * are being displayed are also not left blank.
 *
 * Another way to do this is to check if the field is 
 * of the same class as the first element (CTX)
 * but I did not do it that way.
 *
 * @cardspace = The Individual Card with all the fields. 
 * \@req[] = All the required fields. 
 */
function allRequired(cardspace){
	console.log("======= Checking Required =========");
	var req = cardspace.getElementsByClassName("Required");
	for(var i=0; i<req.length; i++){
		if(req[i].style.display != "none"){
			console.log(req[i].value == "" || req[i].value == undefined);
			if(req[i].value == undefined || req[i].value == ""){
				if(req[i].files == undefined || req[i].files[0] == undefined || req[i].files[0].set == undefined){
					return false;
				}
			}
		}
	}
	return true;
}
/*
 * Add Word takes the copy of the default word, which is taken at the begining
 * and adds it to whatever the current wordspace is. Subtract removes 
 * The last word in the deck. 
 */
function addWord(element){
	console.log("======= Adding A Word =========");
	var wordspace = element.parentNode.getElementsByClassName("wordspace")[0];
	wordspace.appendChild(newcard.cloneNode(true));
}
function subWord(element){
	console.log("======= Subtracting A Word =========");
	var wordspace = element.parentNode.getElementsByClassName("wordspace")[0];
	if(wordspace.childNodes.length > 1){
		wordspace.removeChild(wordspace.childNodes[wordspace.childNodes.length-1]);
	}
}
function wordExists(element){
	console.log("=======Word Existance=========");
	Ajax("../Lux/Assets/query.php", {query:{type:"word", word: element.value.toLowerCase()}},
	     function(data){
		if(data[1].length == 0){
			console.log("There is no data found");
			element.style.borderColor = "#a94442";
		}else{
			console.log("There is data found");
			element.style.borderColor = "#3c763d";
		}
	});
	var suggested = element.parentNode.getElementsByClassName("suggested")[0];			
	var newSuggestion = suggestion.cloneNode(true);	
	newSuggestion.style.display = "block";
	suggested.innerHTML = '';
	Ajax("../Lux/Assets/query.php", {query:{type:"word", word: {'$regex':"^"+element.value.toLowerCase()+".*"}}},
	     function(data){
		if(data[1].length != 0 && element.value != ""){
			var index = 0;
			for(key in data[1]){
				index++;
				if(data[1][key].word != element.value || Object.keys(data[1]).length > 1){
					var thisSuggestion = newSuggestion.cloneNode(true);
					thisSuggestion.innerHTML = data[1][key].word;
					thisSuggestion.onclick = function(){
						console.log("Changing Word");
						console.log(this.innerHTML);
						element.value = this.innerHTML;
						changeTitle(element);
						suggested.innerHTML = '';
						wordExists(element);
					}
					suggested.appendChild(thisSuggestion);
				}
				if(index > 3){break;}
			}
		}
	});
	
}
/* This gets the wordspace, and then gets all the cards in that space
 * It then loops through each card, and gets the wordspace (the word on that card)
 * it checks that all the required fields are available, and that 
 * the word is not blank if it is required... 
 * if the word is not blank, it checks the database for that word
 * and saves the word document into the attributes of the card
 */
function checkWords(element){
	console.log("=======Checking Words=========");
	var wordspace = element.parentNode.parentNode.getElementsByClassName("wordspace")[0]; // get the wordspace associated with the card
	var cards = wordspace.getElementsByClassName("thiscard"); // get all the cards
	for(var i=0; i < cards.length; i++){ // loop all the cards that have been added
		var cardword = cards[i].getElementsByClassName("cardword")[0]; // get the word on the card
		// if the card is not shown, then it is not required.
		if(!allRequired(cards[i]) || ( cardword.style.display != "none" && cardword.value == "")){
			// thats not ok
			cards[i].className = "thiscard form-group has-error";
		}else if(cardword.style.display == "none"){ // verify that the word should be shown
			// thats fine, verify this one 
			cards[i].className = "thiscard form-group has-success";
		}else{
			(function(currentCard, card_word){ // create a function that holds the scope for us.
			Ajax("../Lux/Assets/query.php", {query:{type:"word", word: card_word.value.toLowerCase()}},
			     function(data){
				if(data[1].length == 0){
					console.log("There is no data found");
					currentCard.className = "thiscard form-group has-error";
				}else{
					console.log("Data was found");
					for(key in data[1]){
						console.log("Setting Attributes");
						card_word.setAttribute("syllable", data[1][key]["syllable"]);
						card_word.setAttribute("pron", data[1][key]["pron"]);
						var audio = currentCard.getElementsByClassName("cardaudio")[0];	
						if(data[1][key]["audio"] != undefined && audio.files.length == 0 && audio.files[0] == undefined){// && audio.files[0].recorded != true){
							console.log(".....................................Audio file found on server, no audio file found in browser");
							audio.files[0] = {"name":data[1][key]["audio"], "set":true};
							currentCard.getElementsByClassName("cardaudio_label")[0].innerHTML = data[1][key]["audio"];	
						}else if(data[1][key]["audio"] == undefined){
							console.log(".....................................NO Audio file found on server");
							audio.files[0] = {"set":false};
							currentCard.getElementsByClassName("cardaudio_label")[0].innerHTML = "Click to Select File";	
						}else{
							console.log(audio.files[0]); 
						}
						var image = currentCard.getElementsByClassName("cardimage0")[0];
						if(image.files.length == 0 && image.files[0] == undefined){
							if(data[1][key]["image"] != undefined){
								image.files[0] = {"name":data[1][key]["image"], "set":true};
								currentCard.getElementsByClassName("cardimage0_label")[0].innerHTML = data[1][key]["audio"];	
							}else if(data[1][key]["image"] == undefined){
								console.log(data[1][key]);
								image.files[0] = {"set":false};
								currentCard.getElementsByClassName("cardimage0_label")[0].innerHTML = "Click to Select File";	
							}
						}
					}
					console.log("Changing This Cards format");
					console.log(currentCard);
					currentCard.className = "thiscard form-group has-success";
				}
			     });
			})(cards[i], cardword);
	      
		}
	}	
}

/* 
 * This simply finds the wordspace and verifies that nothing is marked as "has-error"
 * because if it does have error, then we don't want to submit it. 
 */
function verifyCheck(element){
	console.log("======= Verifying Check =========");
	var wordspace = element.parentNode.parentNode.getElementsByClassName("wordspace")[0]; // get the wordspace associated with the card	
	if(wordspace.getElementsByClassName("has-error").length != 0){
		return false;
	}else{
		return true;
	}
}
/*
 * Takes the element and Removes the entire Lesson
 * Also deletes it from the page when it deletes it from the database
 */
function removeLesson(element, lux){
	console.log("=======Removing a Lesson=========");
	var fullLesson = element.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
	var id = fullLesson.getElementsByClassName("lesson-name")[0].id;
	fullLesson.parentNode.removeChild(fullLesson);
	if(lux){
		Ajax("../Lux/Assets/upsert.php", {"id":id},
			function(data){
				// lesson has been remove from db
			});
		Ajax("../Lux/Assets/upsert.php", {query:{"lesson_id":id}},
			function(data){
				// lesson has been remove from db
			});
	}
}

/*
 * Hides any elements in the array given
 * Not terribly useful, but still. 
 */
function hideElements(array, hidden){// done and functional
	console.log("=======Hiding A Card Type=========");
        for(var i = 0; i < array.length; i++){
                array[i].style.display = hidden;
                array[i].value = "";
		if(array[i].nodeName.toLowerCase() === 'select' && hidden == 'block'){
                	array[i].value = "0";
                }
		if(array[i].files != undefined && hidden == 'block'){
                	array[i].value = "";
			array[i].files[0] = {"set":false};
			array[i].nextSibling.nextSibling.innerHTML = "Click to Select File";
		}
        }
}
/*
 * Sees what the current card type is and hides any elements
 * in thiscard which are not of the same type
 */
function changeCardType(element){// done and functional
	console.log("=======Changing Card Type=========");
        console.log("Card Type Changed to " + element.value);
	for(var i=0; i<element.options.length; i++){
        	hideElements(element.parentNode.getElementsByClassName(element.options[i].value), "none");
        }
	hideElements(element.parentNode.getElementsByClassName(element.value), "block");
}

/* 
 * Loops through all the lessons that are stored in the database
 * and loads them into the page by calling appendLesson().
 * Finishes by calling addNewLesson() to add the blank lesson.
 */
function loadAllLessons(){
	console.log("========Loading All Lessons==========");

	// Query the database for all the lessons 
	Ajax("../Lux/Assets/query.php", {query:{type:"lesson"}}, 
	function(data){
		var obj = data[1];
		// loop all the lessons
		if(obj.length != 0){
			for(var key in obj){
				appendLesson(obj[key], key, true);
			}
		}
		addNewLesson();
	});
}
function addLessonPanel(key, collapsed){

	// clone the default panel and make it visible
	var defaultpanel = newlesson.cloneNode(true);
	defaultpanel.style.display = "block";
	//defaultpanel.className = "panel-default";
	
	// Set up the Panel to be collapasble
	//defaultpanel.getElementsByClassName("panel-heading")[0].id = "heading"+key; //headingOne
	
	// Set up the Header To control a colapse
	defaultpanel.getElementsByClassName("lesson-name")[0].id = key;
	defaultpanel.getElementsByClassName("lesson-name")[0].href = "#collapse"+key; // #collapseOne
	//defaultpanel.getElementsByClassName("lesson-name")[0].setAttribute("aria-controls", "collapse"+key); //collapseOne
	
	// Set the Panel Variables 
	defaultpanel.getElementsByClassName("panel-collapse")[0].id = "collapse"+key; // collapseOne
	//defaultpanel.getElementsByClassName("panel-collapse")[0].setAttribute("aria-labeledby", "heading"+key); // headingOne
	if(!collapsed){
		defaultpanel.getElementsByClassName("panel-collapse")[0].className += " in";
	}
	return defaultpanel;
}

/*
 * Takes the blank lesson and tacks it to the top of the 
 * lessongroup
 *
 * TODO: Some Settings may need to be adjusted 
 */
function addNewLesson(){ 
	if(document.getElementById("New") != undefined){
		return;
	}
	console.log("===========Adding a New Lesson=========");
	// clone the default panel and make it visible
	var defaultpanel = addLessonPanel("New", false);
	var defaultgroup = document.getElementsByClassName("panel-group")[0];

	// Set the Lesson Title
	defaultpanel.getElementsByClassName("lesson-name")[0].innerHTML = "New Lesson";
	defaultpanel.getElementsByClassName("wordspace")[0].style.display = "block";
	defaultpanel.getElementsByClassName("lesson-delete")[0].style.display = "none";
	defaultpanel.getElementsByClassName("lesson-submit")[0].innerHTML = "Submit Lesson";
	
	//defaultpanel.getElementsByClassName("panel-body")[0].style.display = "block";
	//toggleCard(defaultpanel.getElementsByClassName("lesson-name")[0]);
	defaultgroup.insertBefore(defaultpanel, defaultgroup.childNodes[0]);
	console.log("-------- collapsing a new system --------");
	console.log(defaultpanel.getElementsByClassName("lesson-name")[0]);
	return defaultpanel.getElementsByClassName("lesson-name")[0];
}
function changeTitle(element){
	console.log("=========== Changing The Card Title =========");
	element.parentNode.getElementsByClassName("newcardtitle")[0].innerHTML = element.value;
}
function toggleCard(element){
	console.log("=========== Toggling The Card =========");
	if(element.parentNode.style.display != "none"){
		element.parentNode.style.display = "none";
		var name = document.createElement("DIV");
		var nameIn = document.createElement("LABEL");
		nameIn.className = "control-label";
		nameIn.innerHTML = element.innerHTML+"<br/>";
		nameIn.onclick = function(){
				name.parentNode.removeChild(name);
				element.parentNode.style.display = "block";
			};	
		name.appendChild(document.createElement("HR"));
		name.appendChild(nameIn);
		name.appendChild(document.createElement("HR"));
		element.parentNode.parentNode.insertBefore(name, element.parentNode);
	}else{
		//element.parentNode.style.display = "none";
	}
}
/* 
 * Takes the lesson and builds a lesson object to be 
 * submitted, then adds the two default cards to the deck
 * and the loops through all the cards and saves them
 * Finally, it adds the lesson to the stack, and adds a new 
 * space for a blank lesson.
 *
 * TODO: if the lesson already exists, we need to strip it 
 * from the database and just insert a new lesson on top 
 */
function submitLesson(element){
	console.log("=======Submitting A Lesson=========");
	console.log(element.parentNode.parentNode);
	if(!allRequired(element.parentNode.parentNode)){
		element.parentNode.parentNode.className = "col-lg-6 has-error";
		return false; 
	}else{
		element.parentNode.parentNode.className = "col-lg-6 has-success";
	 	//return true;	// these returns are used for testing 
	}
	checkWords(element.parentNode);
	if(!verifyCheck(element.parentNode)){
		return false;
	}
	var fullLesson = element.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
	var id = fullLesson.getElementsByClassName("lesson-name")[0].id;
	console.log(fullLesson);
	console.log(id);
	if(id != undefined && id != ""){
		Ajax("../Lux/Assets/upsert.php", {"id":id},
			function(data){
				// lesson has been remove from db
			});
		Ajax("../Lux/Assets/upsert.php", {query:{"lesson_id":id}},
			function(data){
				// lesson has been remove from db
			});
	}
	update = {type:"lesson"};
	update.name = fullLesson.getElementsByClassName("lessonname")[0].value; 	
	update.image_link = fullLesson.getElementsByClassName("lessonimage")[0].value; 	
	update.tier = fullLesson.getElementsByClassName("lessontier")[0].value; 	
	update.class = fullLesson.getElementsByClassName("lessonclass")[0].value; 	
	update.summary = fullLesson.getElementsByClassName("lessonsum")[0].value; 	
	var id = fullLesson.parentNode.getElementsByClassName("lesson-name").id;
	data = {};
	if(id != undefined){
		data.query = {"id":id}
	}
	data.update = update;
	(function(datum, updater,full_lesson, elem){
	Ajax("../Lux/Assets/upsert.php", datum, function(data){
		Ajax("../Lux/Assets/query.php", {query:{type:"lesson", name:updater.name}},function(data){
			for(var key in data[1]){
				// insert complete and intro card
					var update2 = {
						cardType:"lessonIntroPage"
						,type:"card"
						,lesson_id:key
						,name:updater.name
						,summary:updater.summary
						,order:0
					}
					console.log("--------INSERTING DEFAULTS--------");
					Ajax("../Lux/Assets/upsert.php", {update:update2}, function(data){});
					update2.cardType = "lessonComplete";
					update2.order = full_lesson.getElementsByClassName("thiscard").length + 1;
					Ajax("../Lux/Assets/upsert.php", {update:update2}, function(data){});
				// insert other cards
				for(var index = 0; index < full_lesson.getElementsByClassName("thiscard").length; index++){
					submitcards(full_lesson.getElementsByClassName("thiscard")[index], index, key);
				}
				// clear out the lesson
				setTimeout(function(){
					removeLesson(elem, false);
					appendLesson(data[1][key], key, true);
					// Adding new lesson to page
					console.log("----------------- ADDING BLANK LESSON -------------------------");
					var newLesson = addNewLesson();

					setTimeout(function(){
						//accordianCollapse(newLesson);
					}, 500);
				}, 400);
			}
		});
	});})(data, update, fullLesson, element);
}
function titleexists(element){
	console.log("Finding title");
	var title = element.value;
	var sameTitle = Array.prototype.slice.call(document.getElementsByClassName(element.className)).filter(function(el){
			return (el.value == element.value);
		     });
	if(sameTitle.length > 1){
		console.log("changing Title");
		element.value += "+";
	}
	
}
function accordianCollapse(element){
	console.log("=========== Toggling The Lesson =========");
	// get the group
	var parentName = element.getAttribute("data-parent");
	var panelgroup = document.getElementById(parentName);
	var panels = Array.prototype.slice.call(panelgroup.getElementsByClassName("panel-collapse")).filter(function(el){
			return (el.getAttribute("data-parent") == parentName);
		     });
	// set all the other panels to be collapsed
	for(var i=0; i<panels.length; i++){
		panels[i].className = "panel-collapse collapse";
		panels[i].style.display = "none";
	}
	// set this panel to be open
	//document.getElementById(element.href.substring(1)).className += " in";
}
/*
 * Loads the Lesson Values from the database onto the appropriate form
 */
function setLessonValues(panel, obj){
	console.log("=======Setting Lesson Values========");
	panel.getElementsByClassName("lessonname")[0].value = obj["name"] != undefined ? obj["name"] : ""; 	
	panel.getElementsByClassName("lessonimage")[0].value = obj["image_link"] != undefined ? obj["image_link"] : "./images/ACORN.png"; 	
	panel.getElementsByClassName("lessontier")[0].value = obj["tier"] != undefined ? obj["tier"] : 1; 	
	panel.getElementsByClassName("lessonclass")[0].value = obj["class"] != undefined ? obj["class"] : 1; 	
	panel.getElementsByClassName("lessonsum")[0].value = obj["summary"] != undefined ? obj["summary"] : ""; 	
}
/*
 * Appends the appropriate lesson onto the panelgroup
 * by creating a new panel and then filling in all 
 * the values for that panel. 
 *
 * TODO: Some Settings May need to be Adjusted
 */
function appendLesson(obj, key, end){ //done 
	console.log("===========Appending Lesson=========");

	// clone the default panel and make it visible
	var defaultpanel = addLessonPanel(key, true);
	var defaultgroup = document.getElementsByClassName("panel-group")[0];

	// Set the Lesson Title
	defaultpanel.getElementsByClassName("lesson-name")[0].innerHTML = obj["name"];
	defaultpanel.getElementsByClassName("lesson-name")[0].className += " collapsed";
	
	// Add all the values to the panel that reflect the lesson
	setLessonValues(defaultpanel, obj);
	// Add all the cards in that lesson	
	// remove default card
	var wordspace = defaultpanel.getElementsByClassName("wordspace")[0];
	wordspace.removeChild(wordspace.getElementsByClassName("thiscard")[0]);
	Ajax("../Lux/Assets/query.php", {query:{type:"card", lesson_id: key}},
		function(data){
			var obj = data[1];
			var sortedObject = objSort(obj, "order");
			for(var key in sortedObject){
				setCardValues(defaultpanel, sortedObject[key], key);
			}
		});
		
	// Append the Child node  
	if(end){
		defaultgroup.appendChild(defaultpanel);	
	}else{
		defaultgroup.insertBefore(defaultpanel, defaultgroup.childNodes[0]);
	}
}

function pushCard(element, direction){
	var card = element.parentNode;
	var cardClone = card.cloneNode(true);
	var summary = card.getElementsByClassName("cardsum")[0].value;
	var cardGroup = element.parentNode.parentNode;
	if(direction == 1){
		// up
		if(card.previousSibling != undefined){
			var newCard = cardGroup.insertBefore(cardClone, card.previousSibling)
			newCard.getElementsByClassName("cardsum")[0].value = summary;
			cardGroup.removeChild(card);
		}
	}else{
		// down
		if(card.nextSibling != undefined){
			if(card.nextSibling.nextSibling != undefined){
				// insert between
				var newCard = cardGroup.insertBefore(cardClone, card.nextSibling.nextSibling);
				newCard.getElementsByClassName("cardsum")[0].value = summary;
				cardGroup.removeChild(card);
			}else{
				// append
				var newCard = cardGroup.appendChild(cardClone);
				newCard.getElementsByClassName("cardsum")[0].value = summary;
				cardGroup.removeChild(card);
			}
		}
	}

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
	element.parentNode.getElementsByClassName("cardaudio")[0].files[0] = wav;
	var word = element.parentNode.getElementsByClassName("cardword")[0].value;
	element.parentNode.getElementsByClassName("cardaudio")[0].files[0].name = word+"_custom.wav";
	element.parentNode.getElementsByClassName("cardaudio")[0].files[0].recorded = true;
	element.parentNode.getElementsByClassName("cardaudio")[0].files[0].set = false;
}
