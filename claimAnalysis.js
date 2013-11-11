function parseClaim(string) {
	var charSet = [";", ","];
	var stringArray = new Array();
	var new_position = 0;
	
	while (new_position!=-1)
	{
		new_position = findChar(string, charSet);
		if (new_position == -1) {
			stringArray.push(string);
		} else {
			stringArray.push(string.slice(0, new_position+1));
			string = string.slice(new_position+1, string.length);
		}
	}
	buildTable(stringArray, true);
	addJoinSplitButtons();
	//Store stringArray in localStorage
	localStorage.stringArray = JSON.stringify(stringArray);
}

function findChar(string, charSet) {
	//use string.indexOf([char]) to find first position
	//returns either lowest character position of an element in the set or -1 if no element is detected
	
	var lowestPosition = 9999;
	for (charVal in charSet)
	{
		position = string.indexOf(charSet[charVal]);
		//Check to see if position is lowest in the set
		if (position!=-1) {
			if (position<lowestPosition) {
				lowestPosition = position;
			}
		}
	}
	if (lowestPosition!=9999) {
		return lowestPosition;
	} else {
		//No characters detected
		return -1;
	}
}

function buildTable(stringarray, createnewdiv) {
	//stringarray = array of string portions; createnewdiv = true (new div and table) or false - replace pre-existing div called divtable with table called claimtable
	
	if (createnewdiv==false) {
		//Retrieve existing elements
		olddiv = document.getElementById("divtable");
		oldtable = document.getElementById("claimtable");
	} else {
		//Create a new div element to hold the table
		divtable = document.createElement("div");
		divtable.setAttribute("id", "divtable");
		divtable.appendChild(document.createElement("hr"));
	}
	
	
	//Create a table element
	table = document.createElement("table");
	table.setAttribute("id", "claimtable");
	
	//Get length of string array
	rows = stringarray.length;
	//Loop for esch row
	for (j=0;j<rows;j++)
		{ 
		//Create a row element
		tr = document.createElement("tr");
		  
		//Create a cell for the string portion
		td = document.createElement("td");
		td.setAttribute("id", j); //Set an id to the string index value
		td.textContent = stringarray[j];
		
		//Add the cell to the row
		tr.appendChild(td);
		
		//Create a cell for a check box
		tdcheck = document.createElement("td");
		
		//Create a checkbox
		checkbox = document.createElement("input");
		checkbox.setAttribute("type", "checkbox");
		checkbox.setAttribute("name", "checked");
		checkbox.setAttribute("id", "checkbox"+j);
		
		//Add checkbox to cell
		tdcheck.appendChild(checkbox);
		
		//Add cell to row
		tr.appendChild(tdcheck);
		
		//Add row to table
		table.appendChild(tr);
		}
	
	if (createnewdiv == true) {
		divtable.appendChild(table);
		document.body.appendChild(divtable);
	} else {
		olddiv.replaceChild(table, oldtable);
	}
	
}

function addJoinSplitButtons() {
	//Create div to hold buttons
	divbuttons = document.createElement("div");
	divbuttons.setAttribute("id", "divjoinsplit");
	//Create join button
	joinbutton = document.createElement("button");
	joinbutton.textContent = "Join";
	joinbutton.setAttribute("id", "joinbutton");
	joinbutton.setAttribute("onclick", "joinStringPortion()");
	//Create spilt button
	splitbutton = document.createElement("button");
	splitbutton.textContent = "Split";
	splitbutton.setAttribute("id", "splitbutton");
	splitbutton.setAttribute("onclick", "splitStringPortion()");
	divbuttons.appendChild(joinbutton);
	divbuttons.appendChild(splitbutton);
	divbuttons.appendChild(document.createElement("br"));
	divbuttons.appendChild(document.createElement("hr"));
	document.body.appendChild(divbuttons);
	
	divbuttons = document.createElement("div");
	divbuttons.setAttribute("id", "divPA");
	//Create build PA table button
	PAbutton = document.createElement("button");
	PAbutton.textContent = "Build Prior Art Comparison Table";
	PAbutton.setAttribute("id", "PAbutton");
	PAbutton.setAttribute("onclick", "buildPATable()");
	NOCs = document.createElement("input");
	NOCs.setAttribute("type", "text");
	NOCs.setAttribute("id", "NOC");
	NOClabel = document.createElement("label");
	NOClabel.setAttribute("for", "NOC");
	NOClabel.textContent = "Enter number of citations to compare:";
	//Add buttons to div
	divbuttons.appendChild(NOClabel);
	divbuttons.appendChild(NOCs);
	divbuttons.appendChild(document.createElement("br"));
	divbuttons.appendChild(PAbutton);
	divbuttons.appendChild(document.createElement("hr"));
	document.body.appendChild(divbuttons);
}

function joinStringPortion() {
	var stringArray = JSON.parse(localStorage.stringArray);
	var size = stringArray.length;
	var checkedArray = new Array();
	var joinedString = "";
	
	//Get checkboxes that are checked
	for (var i = 0; i < size; i++) {
		checkbox = document.getElementById("checkbox"+i);
		if (checkbox.checked == true) {
			checkedArray.push(i);
			//Build joinedString in this loop to use if later checks are passed
			joinedString = joinedString.concat(stringArray[i]);
		}
	}
	
	//Loop through created array of checkedboxes
	var nonconsec = false;
	var checkedsize = checkedArray.length;
	//Check checkboxes are consecutive else alert & exit
	if (checkedsize > 1) {
		for (var j = 0; j < (checkedsize-1); j++) {
			if ((checkedArray[j+1]-checkedArray[j])>1) {
				nonconsec = true;
			}
		}
	} else {
		alert("Select two or more consecutive checkboxes to join");
	}
	if (nonconsec == true) {
		alert("Select two or more consecutive checkboxes to join");
	} else {
		//rebuild string array
		var stringtochange = new Array();
		stringtochange.push(joinedString);
		stringArray = rebuildStringArray(stringArray, checkedArray, stringtochange);
		
	}
	localStorage.stringArray = JSON.stringify(stringArray);
	//rebuild table
	buildTable(stringArray, false);
}

function rebuildStringArray(stringArray, checkedArray, stringtochange) {
	//Initialise new stringArray
	var new_stringArray = new Array();
	var size = stringArray.length;
	
	//alert(stringArray+"\n"+checkedArray+"\n"+joinedString);
	//Loop through
	for (var k = 0; k < size; k++) {
		if (k==checkedArray[0]) {
			if (stringtochange.length > 1) {
				//Then we are splitting
				new_stringArray.push(stringtochange[0]);
				new_stringArray.push(stringtochange[1]);
			} else {
				//We are merging
				new_stringArray.push(stringtochange[0]);
			}
		} else {
			if (stringtochange.length > 1) {
				//Then we are splitting
				new_stringArray.push(stringArray[k]);
			} else {
				//We are merging
				if (checkedArray.indexOf(k)==-1) {
					new_stringArray.push(stringArray[k]);
				} 
			}
			
		}
	}
	return new_stringArray;
}


function splitStringPortion() {
	var stringArray = JSON.parse(localStorage.stringArray);
	var checkedArray = new Array();

	//Determine which checkbox is checked
	for (var i = 0; i < stringArray.length; i++) {
		checkbox = document.getElementById("checkbox"+i);
		//alert("CB: " + checkbox.value + "; Checked: " + checkbox.checked);
		if (checkbox.checked == true) {
			checkedArray.push(i);
		}
	}
	if (checkedArray.length > 1) {
		//If more than 2 boxes are checked return an error
		alert("Please select a single feature");
	} else {
		//Add text input box with text from selected string portion
		splitdiv = document.createElement("div");
		splitdiv.setAttribute("id", "splitdiv");
		textbox = document.createElement("textarea");
		textbox.setAttribute("id","splittextbox");
		textbox.setAttribute("style", style="height:10em; width:100%");
		textbox.textContent = stringArray[checkedArray[0]];
		splitbutton = document.createElement("button");
		splitbutton.setAttribute("onclick", "splitAtCursor()");
		splitbutton.textContent = "Split Into New Feature at Cursor";
		//Also cancel button?
		splitdiv.appendChild(textbox);
		splitdiv.appendChild(splitbutton);
		splitdiv.appendChild(document.createElement("hr"));
		divbuttons = document.getElementById("divjoinsplit");
		divbuttons.appendChild(splitdiv);
		localStorage.checkedArray = JSON.stringify(checkedArray);
	}
}

function splitAtCursor() {
	var textarea = document.getElementById("splittextbox");
	var stringArray = JSON.parse(localStorage.stringArray);
	var checkedArray = JSON.parse(localStorage.checkedArray);
	delete localStorage.checkedArray;
	//Get cursor position for spilt
	var cursorposition = textarea.selectionStart;
	//Split into two string portions based on cursor position
	var stringtochange = new Array();
	stringtochange.push(stringArray[checkedArray[0]].slice(0, cursorposition));
	stringtochange.push(stringArray[checkedArray[0]].slice(cursorposition, stringArray[checkedArray[0]].length));
	//Rebuild string arrays
	stringArray = rebuildStringArray(stringArray, checkedArray, stringtochange);
		
	localStorage.stringArray = JSON.stringify(stringArray);
	//rebuild table
	buildTable(stringArray, false);
	
	//Get splitdiv
	var splitdiv = document.getElementById("splitdiv");
	//Get parent
	divbuttons = document.getElementById("divjoinsplit");
	//Delete splitdiv
	divbuttons.removeChild(splitdiv);
		
}

function buildPATable() {
	//alert("Here");
	NOC = document.getElementById("NOC");
	//alert(NOC.value);
	var noofcitations = Number(NOC.value);
	//alert(noofcitations);
	//stringarray = array of string portions; createnewdiv = true (new div and table) or false - replace pre-existing div called divtable with table called claimtable
	var stringarray = JSON.parse(localStorage.stringArray);
	//Create a new div element to hold the table
	divtable = document.createElement("div");
	divtable.setAttribute("id", "divPAtable");
	
	
	//Create a table element
	table = document.createElement("table");
	table.setAttribute("id", "PAtable");
	
	//var colcount = 1 + noofcitations*3;
	//Create a header row
	tr = document.createElement("tr");
	thfeatures = document.createElement("th");
	thfeatures.textContent = "Features";
	tr.appendChild(thfeatures);
	//alert("Here");
	for (var j = 0; j < noofcitations; j++) {
		thPresent = document.createElement("th");
		thPresent.textContent = "Present in D"+(j+1)+"?";
		tr.appendChild(thPresent);
	}
	for (var j = 0; j < noofcitations; j++) {
		thReasonPresent = document.createElement("th");
		thReasonPresent.textContent = "Reason Why Feature is Present in D"+(j+1);
		tr.appendChild(thReasonPresent);
		thReasonAbsent = document.createElement("th");
		thReasonAbsent.textContent = "Reason Why Feature is Absent from D"+(j+1);
		tr.appendChild(thReasonAbsent);
	}
	table.appendChild(tr);
	//alert("Here");
	//Get length of string array
	rows = stringarray.length;
	//Loop for each row
	for (var j=0;j<rows;j++)
	{ 
		//Create a row element
		tr = document.createElement("tr");
		  
		//Create a cell for the string portion
		td = document.createElement("td");
		td.setAttribute("id", j); //Set an id to the string index value
		td.textContent = stringarray[j];
		
		//Add the cell to the row
		tr.appendChild(td);
		for (var k = 0; k < noofcitations; k++) {
			//Create a cell for a check box
			tdcheck = document.createElement("td");
		
			//Create a checkbox
			checkbox = document.createElement("input");
			checkbox.setAttribute("type", "checkbox");
			checkbox.setAttribute("name", "checked");
			checkbox.setAttribute("id", "D"+(k+1)+"checkbox"+j);
		
			//Add checkbox to cell
			tdcheck.appendChild(checkbox);
		
			//Add cell to row
			tr.appendChild(tdcheck);
		}
		for (var k = 0; k < noofcitations; k++) {
		//And add two blank cells
			for (var m = 0; m < 2; m++) {
				td = document.createElement("td");
				textarea = document.createElement("textarea");
				textarea.setAttribute("id", "D"+(k+1)+"_textarea"+m+"_feature"+j);
				td.appendChild(textarea);
				tr.appendChild(td);
			}
		}
		//Add row to table
		table.appendChild(tr);
		}
	
	divtable.appendChild(table);
	document.body.appendChild(divtable);
	
}