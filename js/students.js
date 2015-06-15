
var studentRow;
var studentTable;
/* 
 * Sets Global Variables by making a copy, also runs the loadAllLessons() 
 * function, which pulls old lessons from the database
 */
window.onload=function(){
	console.log("======= WINDOW LOADED =========");
	document.getElementById("sbuilder").href += "?access_token="+url.access_token;
	document.getElementById("wbuilder").href += "?access_token="+url.access_token;
	document.getElementById("lbuilder").href += "?access_token="+url.access_token;
	studentRow = document.getElementsByClassName("defaultrow")[0].cloneNode(true);
	studentTable = document.getElementsByClassName("lessonbody")[0];
	
}

function displayLessons() {
	var email = document.getElementById('studentemail').value;
	// Make 10 Ajax calls to Lux
	// finish by calling createNewRow 50 times.
	clearRows();
	Ajax("Users/query.php", {query:{"email": email}}, 
		function(data){
			if(data[1].length != 0){
				// get the user's id
				Ajax("Scoreboard/getOtherUser.php", {"userID":Object.keys(data[1])[0]},
				//Ajax("Scoreboard/getOtherUser.php", {"userID":"54b3f7b898cac76ee552e272"},
				function(data){
					if(data[1] != null && data[1].length != 0){
						var lessons = data[1].lessons;
						for(var i =0; i<lessons.length; i++){
							(function(id, score, last_mod){
								Ajax("Assets/query.php", {id:id},
									function(data){
										Ajax("Assets/query.php", {query:{type:"card", lesson_id:id}},
										function(cards){
											var numCards = Object.keys(cards[1]).length;
											if(data[1] != null && data[1].length != 0){
												createNewRow(data[1].name, 100*(score/(numCards*5)), new Date(last_mod).toLocaleString());
											}
										});
								});
							})(lessons[i].lesson_id, lessons[i].score, lessons[i].last_time_modified);
						}
					}
				});
			}
	});
}
function clearRows(){
	var rows = document.getElementsByClassName("addedRow");
	for(var i=0; i<rows.length;i++){
		studentTable.removeChild(rows[i]);
	}
}
function createNewRow(name, score, numCards) {
	var studentRow2 = studentRow.cloneNode(true);
	studentRow2.style.display = "table-row";
	studentRow2.getElementsByClassName("lessonname")[0].innerHTML = name;
	studentRow2.getElementsByClassName("lessonscore")[0].innerHTML = score + "%";
	studentRow2.getElementsByClassName("lessoncards")[0].innerHTML = numCards;
	studentRow2.className = (score == 100)? "addedRow success" : ((score < 10)? "addedRow warning" : "addedRow danger");
	studentTable.appendChild(studentRow2);
}
