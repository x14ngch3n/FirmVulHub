
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
	
	data.addRowToHTML('tblPortForwarding');
	
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
		
		if((this.list[i].ipAddress == newdata.ipAddress) &&
		    (this.list[i].tcpPort == newdata.tcpPort) &&
			(this.list[i].udpPort == newdata.udpPort) &&
			(this.list[i].schedule == newdata.schedule))
		{
			alert(I18N("j","Rule cannot be the same."));
			return false;	
		}

		var PortStrArr1 = this.list[i].tcpPort.split(",");
		var PortStrArr2 = newdata.tcpPort.split(",");
		var PortRange1;
		var PortRangeStart1;
		var PortRangeEnd1;
		var PortRange2;
		var PortRangeStart2;
		var PortRangeEnd2;		
		for(var j = 0; j < PortStrArr1.length; j++) //for multi (tcp) port number
		{
			for(var k = 0; k < PortStrArr2.length; k++)
			{
				if(PortStrArr1[j].match("-") == "-" && PortStrArr2[k].match("-") == "-")
				{
					PortRange1 = PortStrArr1[j].split("-");
					PortRangeStart1	= parseInt(PortRange1[0], 10);
					PortRangeEnd1	= parseInt(PortRange1[1], 10);
					PortRange2 = PortStrArr2[k].split("-");
					PortRangeStart2	= parseInt(PortRange2[0], 10);
					PortRangeEnd2	= parseInt(PortRange2[1], 10);
					if((PortRangeStart2 <= PortRangeEnd1) && (PortRangeStart1 <= PortRangeEnd2))
					{
						alert(I18N("j","The TCP ports are overlapping."));
						return false;	
					}
				}	
				else if(PortStrArr1[j].match("-") == "-")
				{
					PortRange1 = PortStrArr1[j].split("-");
					PortRangeStart1	= parseInt(PortRange1[0], 10);
					PortRangeEnd1	= parseInt(PortRange1[1], 10);
					if((PortRangeStart1 <= parseInt(PortStrArr2[k], 10)) && (parseInt(PortStrArr2[k], 10) <= PortRangeEnd1))
					{
						alert(I18N("j","The TCP ports are overlapping."));
						return false;	
					}
				}
				else if(PortStrArr2[k].match("-") == "-")
				{
					PortRange2 = PortStrArr2[k].split("-");
					PortRangeStart2	= parseInt(PortRange2[0], 10);
					PortRangeEnd2	= parseInt(PortRange2[1], 10);
					if((PortRangeStart2 <= parseInt(PortStrArr1[j], 10)) && (parseInt(PortStrArr1[j], 10) <= PortRangeEnd2))
					{
						alert(I18N("j","The TCP ports are overlapping."));
						return false;	
					}
				}
				else
				{
					if(parseInt(PortStrArr1[j], 10) == parseInt(PortStrArr2[k], 10))
					{
						alert(I18N("j","The TCP ports are overlapping."));
						return false;	
					}
				}					
			}
		}
		var PortStrArr3 = this.list[i].udpPort.split(",");
		var PortStrArr4 = newdata.udpPort.split(",");
		var PortRange3;
		var PortRangeStart3;
		var PortRangeEnd3;
		var PortRange4;
		var PortRangeStart4;
		var PortRangeEnd4;
		for(var m = 0; m < PortStrArr3.length; m++) //for multi (udp) port number
		{
			for(var n = 0; n < PortStrArr4.length; n++)
			{
				if(PortStrArr3[m].match("-") == "-" && PortStrArr4[n].match("-") == "-")
				{
					PortRange3 = PortStrArr3[m].split("-");
					PortRangeStart3	= parseInt(PortRange3[0], 10);
					PortRangeEnd3	= parseInt(PortRange3[1], 10);
					PortRange4 = PortStrArr4[n].split("-");
					PortRangeStart4	= parseInt(PortRange4[0], 10);
					PortRangeEnd4	= parseInt(PortRange4[1], 10);
					if((PortRangeStart4 <= PortRangeEnd3) && (PortRangeStart3 <= PortRangeEnd4))
					{
						alert(I18N("j","The UDP ports are overlapping."));
						return false;	
					}
				}	
				else if(PortStrArr3[m].match("-") == "-")
				{
					PortRange3 = PortStrArr3[m].split("-");
					PortRangeStart3	= parseInt(PortRange3[0], 10);
					PortRangeEnd3	= parseInt(PortRange3[1], 10);
					if((PortRangeStart3 <= parseInt(PortStrArr4[n], 10)) && (parseInt(PortStrArr4[n], 10) <= PortRangeEnd3))
					{
						alert(I18N("j","The UDP ports are overlapping."));
						return false;	
					}
				}
				else if(PortStrArr4[n].match("-") == "-")
				{
					PortRange4 = PortStrArr4[n].split("-");
					PortRangeStart4	= parseInt(PortRange4[0], 10);
					PortRangeEnd4	= parseInt(PortRange4[1], 10);
					if((PortRangeStart4 <= parseInt(PortStrArr3[m], 10)) && (parseInt(PortStrArr3[m], 10) <= PortRangeEnd4))
					{
						alert(I18N("j","The UDP ports are overlapping."));
						return false;	
					}
				}
				else
				{
					if(parseInt(PortStrArr3[m], 10) == parseInt(PortStrArr4[n], 10))
					{
						alert(I18N("j","The UDP ports are overlapping."));
						return false;	
					}
				}					
			}
		}
	}
	return true;
}

Datalist.prototype.length = function(){
	return this.list.length;
}

//constructor
function Data(name, ipAddress, tcpPort, udpPort, schedule){
	this.name = name;
	this.ipAddress = ipAddress;
	this.tcpPort = this.reassemblePort(tcpPort);
	this.udpPort = this.reassemblePort(udpPort);
	this.schedule = this.parseScheduleName(schedule);
	
	this.setEnable("true");
}


Data.prototype = 
{
	//property
	rowid:null,
	enable:null,
	name:null,
	ipAddress:null,
	tcpPort:null,
	udpPort:null,
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
		var checked_value = document.getElementById('pf'+this.rowid).checked;
		this.enable = checked_value;
	},
	
	reassemblePort : function(port)
	{
		var rangeValue = port.split(",");
		var outputString = "";
		
		if(port == "")
		{
			return outputString;
		}
		
		for(var i = 0; i < rangeValue.length; i++)
		{
			if(i > 0)
			{
				outputString += ",";
			}
		
			var portValue = rangeValue[i].split("-");
			
			outputString += parseInt(portValue[0], 10);
			if(isNaN(portValue[1]) == false)
			{
				outputString += "-" + parseInt(portValue[1], 10);
			}
		}
		return outputString;
	},
	
	showEnable : function()
	{
		var outputString;
		var checkedString = "";
		
		if(this.enable == "true")
			checkedString = "checked";
		
		outputString = '<input id=pf'+this.rowid+' type="checkbox" onChange="datalist.list['+this.rowid+'].setEnableValue()" '+checkedString+'/>';
	
		return outputString;
	},
	
	showName: function()
	{
		return HTMLEncode(this.name);
	},
	
	showTCPPort : function()
	{
		if(this.tcpPort == "")
		{
			return "N/A";
		}
		else
		{
			return this.tcpPort;
		}
	},
	
	showUDPPort : function()
	{
		if(this.udpPort == "")
		{
			return "N/A";
		}
		else
		{
			return this.udpPort;
		}
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
	
		outputString = "<td>" + this.showEnable() + "</td>";
		outputString += "<td>" + this.showName() + "</td>";
		outputString += "<td>" + this.ipAddress + "</td>";
		outputString += "<td>" + this.showTCPPort() + "</td>";
		outputString += "<td>" + this.showUDPPort() + "</td>";
		outputString += "<td>" + this.showSchedule() + "</td>";
		outputString += "<td><img src='image/edit_btn.gif' width=28 height=28 style='cursor:pointer' onclick='editData("+this.rowid+")'/></td>";
		outputString += "<td><img src='image/trash.gif' width=41 height=41 style='cursor:pointer' onclick='deleteData("+this.rowid+")'/></td>";
	
		object.html(outputString);
		return;
	}
}
