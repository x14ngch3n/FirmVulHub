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

Datalist.prototype.editData = function(id, newdata){
	if(this.checkData(newdata, id) == false)
	{
		return false;
	}

	newdata.setRowid(id);
	this.list.splice(id,1,newdata);

	newdata.setDataToRow($("#tr"+newdata.rowid));
	return true;
}

Datalist.prototype.deleteData = function(id){
	this.list.splice(id, 1);

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
	data.addRowToHTML('tblIPassociate');

	return true;
}

Datalist.prototype.checkData = function(newdata, id){
	var i;

	//check
	for(i = 0; i < this.list.length; i++)
	{
		if(i == id)
			continue;

		if((this.list[i].ipAddressStart == newdata.ipAddressStart)&& (this.list[i].ipAddressEnd == newdata.ipAddressEnd))
		{
			alert(I18N("j","Rule cannot be the same."));
			return false;
		}
	}
	return true;
}
Datalist.prototype.length = function(){
	return this.list.length;
}

//constructor
function Data(name, ipAddressRange, ipenable){

	this.name = name;
	this.ipAddressRange = ipAddressRange;
	var IParray = this.parseRange(ipAddressRange);
	this.ipAddressStart = IParray[0];
	this.ipAddressEnd = IParray[1];
	if(ipenable == "True" || ipenable == "true")
	{
		this.setEnable("true");
	}else
	{
		this.setEnable("false");
	}
}


Data.prototype =
{
	//property
	rowid:null,
	enable:null,
	name:null,
	ipAddressStart:null,
	ipAddressEnd:null,

	//method
	setRowid : function(rowid)
	{
		this.rowid = rowid;
	},

	setEnable : function(enable)
	{
		this.enable = enable;
	},

	parseRange: function(input)
	{
		var output = new Array;

		output = input.split('-');

		if((output[0] == null) || (output[0] == ""))
		{
			output[0] = output[1];
			output[1] = null;
		}
		return output;
	},
	showEnable : function()
	{
		var outputString;
		var checkedString = "";
		var inverseChecked = "true";

		if(this.enable == "true")
		{
			checkedString = "checked";
			inverseChecked = "false";
		}else
		{
			checkedString = "";
			inverseChecked = "true";
		}
		outputString = '<input type="checkbox" onChange="datalist.list['+this.rowid+'].setEnable(\''+inverseChecked+'\')" '+checkedString+'/>';

		return outputString;
	},
	showName: function()
	{
		return encode_char_text(this.name);

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
		outputString += "<td>" + this.ipAddressStart + "-" + this.ipAddressEnd + "</td>";
		outputString += "<td><img src='image/edit_btn.gif' width=28 height=28 style='cursor:pointer' onclick='editData("+this.rowid+")'/></td>";
		object.html(outputString);
		return;
	},
	createRange : function(start, end)
	{
		var outputString = start;

		if((end != "") && (end != null))
		{
			outputString += "-"+end;
		}
		return outputString;
	}
}
