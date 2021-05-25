
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

Datalist.prototype.editData = function(id, newValue){
	var rowNum = this.getRowNum(id);
	this.list[rowNum].website = newValue;

	return true;
}

Datalist.prototype.deleteData = function(id){
	var rowNum = this.getRowNum(id);
	this.list.splice(rowNum, 1);
	
	$("#tr"+id).remove();
}

Datalist.prototype.push = function(data){

	data.setRowid(this.maxrowid);
	this.list.push(data);
	
	this.maxrowid++;
	
	data.addRowToHTML('tblWebsiteFilter');
	
	return true;
}

Datalist.prototype.length = function(){
	return this.list.length;
}

//constructor
function Data(website){
	this.website = website;

}


Data.prototype = 
{
	//property
	rowid:null,
	website:null,
	
	//method
	setRowid : function(rowid)
	{
		this.rowid = rowid;
	},
	
	showWebsite: function()
	{
		var outputString = "";
	
		if(this.website == null)
		{
			outputString = '<input type="text" size="120" id="website'+this.rowid +'" onchange="datalist.editData('+this.rowid+', this.value);"'+'onkeydown="changeTimeoutAction();"/>';
		}
		else
		{
			outputString = '<input type="text" size="120" id="website'+this.rowid +'" value="'+ this.website +'" onchange="datalist.editData('+this.rowid+', this.value);"'+'onkeydown="changeTimeoutAction();"/>'; 
		}
	
		return outputString;
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
	
		outputString = "<td>" + this.showWebsite() + "</td>";
		outputString += "<td><img src='image/trash.gif' width=41 height=41 style='cursor:pointer' onclick='deleteData("+this.rowid+")'/></td>";
	
		object.html(outputString);
		return;
	}
}