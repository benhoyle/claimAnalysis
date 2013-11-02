function parseClaim(string) {
	var charSet = [";", ","];
	var stringArray = new Array();
	var new_position = 0;
	
	while (new_position!=-1)
	{
		new_position = findChar(string, charSet);
		alert("NP: " + new_position);
		if (new_position == -1) {
			stringArray.push(string);
		} else {
			stringArray.push(string.slice(0, new_position+1));
			string = string.slice(new_position+1, string.length);
		}
	}
	buildTable(stringArray);
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

function buildTable(stringarray) {
	//Create a table element
	table = document.createElement("table");
	
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
		checkbox.setAttribute("value", j);
		
		//Add checkbox to cell
		tdcheck.appendChild(checkbox);
		
		//Add cell to row
		tr.appendChild(tdcheck);
		
		//Add row to table
		table.appendChild(tr);
		}
	document.body.appendChild(table);
}