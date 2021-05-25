
//data list
function Datalist()
{
	this.list = new Array();
	this.maxrowid = 0;
}

Datalist.prototype .getData = function(rowid){
	var i;
	var data;
	
	for(i = 0; i < this.list.length; i++)
	{
		data = this.list[i];
		if(data.rowid == rowid)
		{
			break;
		}
	}
	
	//assume data exist
	return data;
}

Datalist.prototype .getRowNum = function(rowid){
	var rowNum = 0;
	for(rowNum = 0; rowNum < this.list.length; rowNum++)
	{
		if(rowid == this.list[rowNum].rowid)
		{
			break;
		}
	}
	return rowNum;
}

Datalist.prototype.editData = function(id, newdata){
	var rowNum = this.getRowNum(id);
	
	if(this.checkData(newdata, rowNum) == false)
	{
		return false;
	}
	
	newdata.setRowid(id);
	this.list.splice(rowNum,1,newdata);
	
	newdata.setDataToRow($("#tr"+newdata.rowid));
	return true;
}

Datalist.prototype.deleteData = function(id){
	var rowNum = this.getRowNum(id);

	this.list.splice(rowNum, 1);
	
	$("#tr"+id).remove();
}

Datalist.prototype.push = function(data){
	if(this.checkData(data, null) == false)
	{
		return false;
	}

	data.setRowid(this.maxrowid);
	this.list.push(data);
	
	this.maxrowid++;
	
	data.addRowToHTML('tblSchedule');
	
	return true;
}

Datalist.prototype.checkData = function(newdata, rowNum){
	var i;
	var checkName;
	var formula = /#[0-9]$/;
	var name;
	var counter = 0;
	
	//check
	if(newdata.name.replace(/\s/g, "") == "")
	{
		newdata.name = "NewRule";
		name = newdata.name;
		counter = 1;
	}
	
	for(i = 0; i < this.list.length; i++)
	{
		if(i == rowNum)
			continue;

		checkName = this.list[i].name;
		if(formula.test(checkName))
		{
			var nameArray = checkName.split("#");
			name = nameArray[0];
			var num = parseInt(nameArray[1], 10);
			if(newdata.name == name)
			{
				if(counter <= num)
				{
					counter = num+1;
				}
			}
			else if(formula.test(newdata.name))
			{
				var newDataNameArray = newdata.name.split("#");
				if(newDataNameArray[0] == name)
				{
					counter = parseInt(newDataNameArray[1], 10);
					if(num == counter)
					{
						counter++;
					}
				}
			}
		}
		else if(newdata.name == checkName)
		{
			name = newdata.name;
			counter = 1;
		}

	}
	
	if((newdata.name == "NewRule")||(newdata.name == "Always"))
	{
		newdata.name = name+"#"+counter;
		if(counter == 0)
		{
			counter++;
		}
	}
	
	if(counter > 0)
	{
		newdata.name = name+"#"+counter;
	}
	return true;
}

Datalist.prototype.length = function(){
	return this.list.length;
}

//constructor
function RuleObj()
{
	this.list = new Array();
	this.timeArray = new Array(7);
	
	for(var i = 0; i < 7; i++)
	{
		this.timeArray[i] = new Array(24);
	}
}

RuleObj.prototype = 
{
	//property
	list:null,
	rowid:null,
	name: null,
	tmpDate:null,
	
	//method
	setRowid : function(rowid)
	{
		this.rowid = rowid;
	},
	
	setName: function(name)
	{
		this.name = name;
	},
	
	length : function(){
		return this.list.length;
	},
	
	push : function(data)
	{
		this.list.push(data);
		return true;
	},

	remove : function(id)
	{
		this.list.splice(id, 1);
	},
		
	showName: function()
	{
		return HTMLEncode(this.name);
	},
	
	addRowToHTML : function(table)
	{
		var outputString;
		
		outputString = "<tr id='tr"+ this.rowid + "'></tr>"
		
		var selector = "#"+table+"> tbody";
		$(selector).append(outputString);
		
		this.setDataToRow($("#tr"+this.rowid));
		return;
	},
	
	setDataToRow : function(object)
	{
		var outputString;
	
		outputString = "<td>" + this.showName() + "</td>";
		outputString += "<td>" + this.showSchedule() + "</td>";
		outputString += "<td><img src='image/edit_btn.gif' width=28 height=28 style='cursor:pointer' onclick='editData("+this.rowid+")'/></td>";
		outputString += "<td><img src='image/trash.gif' width=41 height=41 style='cursor:pointer' onclick='deleteData("+this.rowid+")'/></td>";
	
		object.html(outputString);
		return;
	},
	
	showTimeRange: function(date)
	{
		var display1 = new DisplayTime();
		var dateString = "";
		var start = -1;
		var end = -1;
		
		switch(date+1)
		{
			case 1: dateString = "#Monday ";break;
			case 2: dateString = "#Tuesday ";break;
			case 3: dateString = "#Wednesday ";break;
			case 4: dateString = "#Thursday ";break;
			case 5: dateString = "#Friday ";break;
			case 6: dateString = "#Saturday ";break;
			case 7: dateString = "#Sunday ";break;
		}
		$(dateString + ".display").remove();
		$(dateString + ".sprite").remove();
		
		for(var i = 0; i < 24; i++)
		{
			if((start < 0)&&(this.timeArray[date][i] == 1))
			{
				start = i;
			}
			
			if(start >= 0)
			{
				if(this.timeArray[date][i] != 1)
				{
					end = i;
				}
				else if(i == 23)
				{
					end = 24;
				}
			}
		
			if((start >= 0) && (end >= 0))
			{
				if((end-start) > 3)
				{
					$(dateString +".week li").eq(start).append(display1);
					display1.innerHTML = start + ":00 - " + end + ":00";
					display1 = new DisplayTime();
				}
				var spriteBtn = new SpriteBtn();
				$(dateString +".week li").eq(end-1).append(spriteBtn);
				start = -1;
				end = -1;			
			}
		}

	}
}

function TimeSet(date, start, end){
	this.date = date;
	this.start = start;
	this.end = end;
}

TimeSet.prototype = 
{
	//property
	date:null,
	start:null,
	end:null,
}

RuleObj.prototype.showSchedule = function()
{
	var outputString = "";
	var weekString = "";
	var previousDate = "";
	var allDayCounter = 0;
	
	for(var i = 0; i < this.list.length; i++)
	{		
		if(previousDate == this.list[i].date)
		{
			outputString += ", ";
		}
		else
		{
			if(i > 0)
			{
				outputString += "<br>";
			}

			switch (this.list[i].date)
			{
				case 1:	weekString = "Monday";		break;
				case 2:	weekString = "Tuesday";		break;
				case 3:	weekString = "Wednesday";	break;
				case 4:	weekString = "Thursday";	break;
				case 5:	weekString = "Friday";		break;
				case 6:	weekString = "Saturday";	break;
				case 7:	weekString = "Sunday";		break;
			}
			
			outputString += I18N("j", weekString) + " : ";
			previousDate = this.list[i].date;
		}
	
		if((this.list[i].start == 0) && (this.list[i].end == 24))
		{
			outputString += I18N("j", "All Day");
			allDayCounter++;
		}
		else
		{
			outputString += this.list[i].start + ":00 - " + this.list[i].end + ":00";
		}
	}
	if(allDayCounter == 7)
	{
		outputString = I18N("j", "All Week");
	}
	
	return outputString;
}

RuleObj.prototype.makeTimeSet = function()
{
	var start = -1;
	var end = -1;
	var timeSet = null;
	
	this.list = new Array();	//renew array

	for(var date = 0; date < 7; date++)
	{
		for(var i = 0; i < 24; i++)
		{
			if((start < 0)&&(this.timeArray[date][i] == 1))
			{
				start = i;
			}
					
			if(start >= 0)
			{
				if(this.timeArray[date][i] != 1)
				{
					end = i;
				}
				else if(i == 23)
				{
					end = 24;
				}
			}
		
			if((start >= 0) && (end >= 0))
			{
				timeSet = new TimeSet(date+1, start, end);
				this.list.push(timeSet);
				timeSet = null;
				start = -1;
				end = -1;
			}
		}
	}

	return;
}