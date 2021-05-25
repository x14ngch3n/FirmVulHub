
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
	
	data.addRowToHTML('tblVirtualServer');
	
	return true;
}

Datalist.prototype.checkData = function(newdata, rowNum){
	var i;
	
	//check
	for(i = 0; i < this.list.length; i++)
	{
		if(i == rowNum)
			continue;
	
		if(this.list[i].name == newdata.name)
		{
			alert(I18N("j","Name cannot be the same."));
			return false;
		}
		
		if(	(this.list[i].protocol == newdata.protocol) ||
			(this.list[i].protocol == "Both") || (newdata.protocol == "Both")
		  )
		{
			if(	(this.list[i].externalPort == newdata.externalPort) &&
			(this.list[i].internalPort == newdata.internalPort) &&
				(this.list[i].schedule == newdata.schedule)
			  )
		{
			alert(I18N("j","Rule cannot be the same."));
			return false;	
		}		
	}
	}
	return true;
}

Datalist.prototype.length = function(){
	return this.list.length;
}

//constructor
function Data(name, ipAddress, protocol, protocolNum, externalPort, internalPort, schedule){
	var externalNum = parseInt(externalPort, 10);
	var internalNum = parseInt(internalPort, 10);

	this.name = name;
	this.ipAddress = ipAddress;
	this.externalPort = isNaN(externalNum)?"":externalNum;
	this.internalPort = isNaN(internalNum)?"":internalNum;
	this.schedule = this.parseScheduleName(schedule);
	
	this.setEnable("true");
	this.setProtocol(protocol, protocolNum);
}

Data.prototype = 
{
	//property
	rowid:null,
	enable:null,
	name:null,
	ipAddress:null,
	protocol:null,
	protocolNum:null,
	externalPort:null,
	internalPort:null,
	schedule:null,
	
	//method
	setRowid : function(rowid)
	{
		this.rowid = rowid;
	},
	
	setEnable : function(enable)
	{
		this.enable = enable;
	},
	
	setEnableValue: function()
	{
		var checked_value = document.getElementById('vs'+this.rowid).checked;
		this.enable = checked_value;
	},
	
	setProtocol : function(protocol, num)
	{
		this.protocolNum = num;
		
		switch(num)
		{
			case "6":
				this.protocol = "TCP";
				break;
			case "17":
				this.protocol = "UDP";
				break;
			case "256":
				this.protocol = "Both";
				break;
			default:
				this.protocol = "Other";
				this.protocolNum = num;
				break;
		}
	},
	
	showEnable : function()
	{
		var outputString;
		var checkedString = "";
		
		if(this.enable == "true")
			checkedString = "checked";
		
		outputString = '<input id=vs'+this.rowid+' type="checkbox" onChange="datalist.list['+this.rowid+'].setEnableValue()" '+checkedString+'/>';
	
		return outputString;
	},
	
	showName: function()
	{
		return HTMLEncode(this.name);
	
	},
	
	showExternalPort : function()
	{
		return this.externalPort;
	},
	
	showInternalPort : function()
	{
		return this.internalPort;
	},
	
	showSchedule : function()
	{
		if((this.schedule == "Always")||(this.schedule == ""))
		{
			return I18N("j", "Always");
		}
		else
		{
			return HTMLEncode(this.schedule);
		}
	},
	
	parseScheduleName: function(scheduleName)
	{
		var name = scheduleName;
		
		if((name.toLowerCase() == "always") || (name == ""))
		{
			name = "Always";
		}
		return name;
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
	
		outputString = "<td>" + this.showEnable() + "</input></td>";
		outputString += "<td>" + this.showName() + "</td>";
		outputString += "<td>" + this.ipAddress + "</td>";
		outputString += "<td>" + this.protocol + "</td>";
		outputString += "<td>" + this.showExternalPort() + "</td>";
		outputString += "<td>" + this.showInternalPort() + "</td>";
		outputString += "<td>" + this.showSchedule() + "</td>";
		outputString += "<td><img src='image/edit_btn.gif' width=28 height=28 style='cursor:pointer' onclick='editData("+this.rowid+")'/></td>";
		outputString += "<td><img src='image/trash.gif' width=41 height=41 style='cursor:pointer' onclick='deleteData("+this.rowid+")'/></td>";
	
		object.html(outputString);
		return;
	}
}
