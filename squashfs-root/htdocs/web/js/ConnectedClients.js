
//data list
function Datalist()
{
	this.list = new Array();
	this.maxrowid = 0;
}

Datalist.prototype =
{
	get length(){
		return this.list.length;
	},
	
	set length(val){
		if(parseInt(val, 10) >= 0)
			this.list.length = parseInt(val,10);
	}
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

Datalist.prototype .getDataRowNumByMac = function(mac){
	var i;
	var data = null;
	var rowNum = null;
	var macLower = mac.toLowerCase();
	
	for(i = 0; i < this.list.length; i++)
	{
		data = this.list[i];
		if(data.MacAddress.toLowerCase() == macLower)
		{
			rowNum = i;
			break;
		}
	}
	
	//assume data exist
	return rowNum;
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

	this.list[rowNum].IPv4Address = newdata.IPv4Address;
	this.list[rowNum].IPv6Address = newdata.IPv6Address;
	this.list[rowNum].Type = newdata.Type;
	this.list[rowNum].DeviceName = newdata.DeviceName;
	this.list[rowNum].NickName = newdata.NickName;
	this.list[rowNum].ReserveIP = newdata.ReserveIP;
	this.list[rowNum].Vendor = newdata.Vendor;
	this.list[rowNum].ScheduleName = newdata.ScheduleName;
	this.list[rowNum].MacfilterEnabled = newdata.MacfilterEnabled;
	this.list[rowNum].Status = newdata.Status;	

	return true;
}

Datalist.prototype.deleteData = function(id){
	var rowNum = this.getRowNum(id);
	this.list.splice(rowNum, 1);
}

Datalist.prototype.push = function(data){
	data.setRowid(this.maxrowid);
	this.list.push(data);
	
	this.maxrowid++;

	//sort
	this.list.sort(function(a,b){

		function getPriority(type)
		{
			if(type == "LAN")
			{
				return 0;
			}
			else if(type.toUpperCase().indexOf("WIFI_") >= 0)
			{
				return 1;
			}
			else
			{
				return 2;
			}
		};

		return getPriority(a.Type) - getPriority(b.Type);
	});

	return true;
}

//constructor
function Data(macAddress, ipv4Address, ipv6Address, type, deviceName, nickName, reserveIP){
	this.MacAddress = macAddress;
	this.IPv4Address = ipv4Address;
	this.IPv6Address = ipv6Address;
	this.Type = type;
	this.DeviceName = deviceName;
	this.NickName = nickName;
	this.ReserveIP = reserveIP;
	
	this.Vendor = getVendor(macAddress);
	
	//mac filter
	this.ScheduleName;
	this.MacfilterEnabled = false;
	this.Status = false;
}


Data.prototype = 
{
	//method
	get NickName(){
		if(this._NickName == "")
			return this.DeviceName;
		
		return this._NickName;
	},
	
	set NickName(val){
		this._NickName = val;
		if(val == this.DeviceName)
			this._NickName = "";
	},
	
	setRowid : function(rowid)
	{
		this.rowid = rowid;
	},
	
	showClientInfo: function()
	{
		var self = this;
		var name = self.NickName;
		var macFilterString = "";
		var fontColor;
		var cssBackGround = "link_IconE_";	//default type = LAN
		var nameCSS = "client_Name";
		var ipv4Address = self.IPv4Address;
			
		//Add tag
		if(self.Type == "New")
		{
			var outputString = "<td>"
				   + '<div class ="client_add_Tag" onclick ="addData()" style ="cursor:pointer">'
				   + "</div>"
				   +"</td>";
			return outputString;
		}

		if (typeof(self.MacAddress) == "undefined" || self.MacAddress.length == 0)
		{
			return "";
		}
		if (name == "")
		{
			name = "Unknown";
		}
			
		var objType = self.Type.toUpperCase();
		if (objType == "WIFI_2.4G" || objType == "WIFI_5G" || objType == "WIFI_2.4G_GUEST" || objType == "WIFI_5G_GUEST")
		{
			cssBackGround = "link_IconW_";
		}
		else if(objType == "OFFLINE")
		{
			cssBackGround = "link_Offline_";
			nameCSS += " client_Name_Offline";
			ipv4Address = self.ReserveIP;
		}
		
		if(self.MacfilterEnabled)
		{
			macFilterString = I18N("j", "Enabled");
			fontColor = "#FF0000";
			if((self.Type == "Blocked")||(self.Status))
			{
				cssBackGround += "Block";
			}
			else
			{
				cssBackGround += "Allow";
			}
		}
		else
		{
			macFilterString = I18N("j", "Disabled");
			fontColor = "#000000";
			cssBackGround += "Allow";
		}

		if(self.Vendor.length > 22)	var VendorDisplay = self.Vendor.substr(0, 19) + "...";
		else						var VendorDisplay = self.Vendor;

		var outputString = "<td>"
			   + '<div class ="client_Tag" style ="cursor:default">'
			   + '<div class ="' + cssBackGround + '"></div>'
			   + '<div class ="client_Info">'
			   + '<div class ="' + nameCSS + '">' + name + '</div>'
			   + '<div class ="client_EditImage" onclick ="editData(' + self.rowid + ')" style ="cursor:pointer"></div>'
			   + '<div class ="client_Vender">' + VendorDisplay + '</div>'
			   + '<div class ="client_IPv4Address">' + ipv4Address + '</div>'
			   + '<div class ="client_IPv6Address" id="IPv6Address_Client_' + self.rowid + '" title="'+ self.IPv6Address +'">' + self.IPv6Address + '</div>'
			   + '<div class ="client_Access">' + I18N("j", "Parental Control") + ': <font color ="' + fontColor + '">' +macFilterString + '</font></div>'
			   + "</div>"
			   + "</div>"
			   +"</td>";
			
		return outputString;
	}

}

var tmpXML_ScheduleCnt;
var Client_Type = "Host";

var datalist = new Datalist();

function Base92(input)
{
        var BASE = 92;

        function getCharCode(i)
        {
                if((i+35) == 92)        //skip '\'  (ASCII 92)
                        return '!';
                return String.fromCharCode(i+35);
        }

        var Q = Math.floor(input/BASE);
        var R = input%BASE;
        var str = "";

        if(Q >= BASE)
        {
                str += Base92(Q);
        }
        else
        {
                str += getCharCode(Q);
        }

        str += getCharCode(R);
        return str;
}
function getVendor(mac)
{
        var unknown = "Unknown Vendor";
        var str;

        if((typeof macList == 'undefined')||(macList == ""))
                return unknown;


        var macUnit = mac.split(':');
        var L1 = Base92(parseInt(macUnit[0], 16));
        var L2 = Base92(parseInt(macUnit[1]+macUnit[2], 16));
        if (typeof macList[L1] == 'undefined' || typeof macList[L1][L2] == 'undefined')
                str = unknown;
        else
                str = macList[L1][L2];

        return decode_char_text(str);
}

function Get_ClientInfo()
{
	var deferred = $.Deferred();
	var clientInfo = new SOAPGetClientInfoResponse();
	var macfilterInfo = new SOAPGetMACFilters2Response();
	var soapAction = new SOAPAction();
	var clientinfo_query = soapAction.sendSOAPAction("GetClientInfo", null, clientInfo);
	var macfilter_query = null;
	
	if(currentState == "clientInfo")	//get client details
	{
		macfilter_query = soapAction.sendSOAPAction("GetMACFilters2", null, macfilterInfo);
	}
	//type Host or Guest
	$.when(clientinfo_query, macfilter_query).done(function(obj)
	{
		//remove disconnected client
		for(var row in datalist.list)
		{
			var obj = datalist.list[row];
			var found = false;
			if(obj.Type == "Blocked")
				continue;

			for(var clientUnit in clientInfo.ClientInfoLists.ClientInfo)
			{
				var client = clientInfo.ClientInfoLists.ClientInfo[clientUnit];
				if(client.MacAddress.toLowerCase() == obj.MacAddress.toLowerCase())
				{
					found = true;
					break;
				}
			}	
			if(found == false)
			{
				datalist.deleteData(obj.rowid);
			}
			//Remove the DHCP reservation card add in data list.
			if(obj.Type == "New")
			{
				datalist.deleteData(obj.rowid);
			}
		}
		//update client
		for(var clientUnit in clientInfo.ClientInfoLists.ClientInfo)
		{
			var client = clientInfo.ClientInfoLists.ClientInfo[clientUnit];
			var data = new Data(client.MacAddress, client.IPv4Address, client.IPv6Address, client.Type, client.DeviceName, client.NickName, client.ReserveIP);
			var rowNum = datalist.getDataRowNumByMac(client.MacAddress);
			if(rowNum != null)	//update
			{
				datalist.editData(datalist.list[rowNum].rowid, data);
			}
			else	//new push
			{
				datalist.push(data);
			}

		}
		//Add the DHCP reservation card add in data list.
		var data_add_DHCP_reservation = new Data("", "", "", "New", "", "", "");
		datalist.push(data_add_DHCP_reservation);
		
		if(currentState == "clientInfo")
		{
			var hasMacfilter = false;

			//remove disconnected macfilter
			for(var row in datalist.list)
			{
				var obj = datalist.list[row];
				var found = false;
				if(obj.Type != "Blocked")
					continue;

				for(var macfilterUnit in macfilterInfo.MACList.MACInfo)
				{
					var macfilter = macfilterInfo.MACList.MACInfo[macfilterUnit];
					if(macfilter.MacAddress.toLowerCase() == obj.MacAddress.toLowerCase())
					{
						found = true;
						break;
					}
				}
				if(found == false)
				{
					datalist.deleteData(obj.rowid);
				}
			}
			//update macfilter
			for(var macfilterUnit in macfilterInfo.MACList.MACInfo)
			{
				var macfilter = macfilterInfo.MACList.MACInfo[macfilterUnit];
				
				//search client list
				var rowNum = datalist.getDataRowNumByMac(macfilter.MacAddress);
				if(rowNum != null)
				{
					datalist.list[rowNum].MacfilterEnabled = true;
					datalist.list[rowNum].ScheduleName = decode_char_text(macfilter.ScheduleName);
					if(macfilter.Status == "true" || (macfilter.ScheduleName == "" && macfilter.Status == "false"))
					{
						datalist.list[rowNum].Status = true;
						datalist.list[rowNum].Type = "Blocked";
						hasMacfilter = true;
					}
				}
				else
				{
					var data = new Data(macfilter.MacAddress, "", "", "LAN", macfilter.DeviceName, "", "");
					data.MacfilterEnabled = true;
					data.ScheduleName = decode_char_text(macfilter.ScheduleName);
					data.Type = "Blocked";
					if(macfilter.Status == "true")
						data.Status = true;
					datalist.push(data);
					hasMacfilter = true;
				}

			}
			showClientTypeBtn("block", hasMacfilter);
			showClientLists(Client_Type);
		}
		//show count
		$("#Total_ConnectedClients").html(clientInfo.ClientInfoLists.ClientInfo.length);

		deferred.resolve();
	});
	
	return deferred.promise();
}

function showClientLists(type)
{
	$(document).tooltip("disable");
	$(document).tooltip("enable");

	var column = 0;
	var clientItemsHTML = '<table class="block" border="0" ondragstart="return false" onselectstart="return false" width="900px">'
	+ '<tbody><tr style="height:120px">';
	for(var row in datalist.list)
	{
		var obj = datalist.list[row];
		if(type == "Guest")
		{
			if (obj.Type.toLowerCase().indexOf("guest") < 0)
			{
				continue;
			}
		}
		else if(type == "Host")
		{
			if (obj.Type.toLowerCase().indexOf("guest") >= 0)
			{
				continue;
			}
			if (obj.Type == "Blocked")
			{
				continue;
			}
		}
		else if(type == "Blocked")
		{
			//if (obj.MacfilterEnabled == false)
			if(obj.Type != "Blocked")
			{
				continue;
			}
		}
		column++;

		clientItemsHTML += obj.showClientInfo();

		if(column % 3 == 0)
		{
			clientItemsHTML += "</tr><tr>";
		}
	}
	clientItemsHTML += "</tr></tbody>";

	$("#Client_Group").html(clientItemsHTML);
	
	if(column>0)
	{
		$("#Client_Info").hide();
	}
	else if(type == "Blocked")	//no Blocked list, maybe all deleted
	{
		showClientTypeBtn("block", false);
		showClientLists("Host");
	}
	else
	{
		$("#Client_Info").show();
	}
	$("#Client_Group").css("display", "table-row");
}

function addData()
{
	$("#popTitle").html(I18N("j", "Add Rule"));
	$("#check_btn").attr("class", "styled_button_dis").prop("disabled", true)
	.off('click').click(function()
	{
		closeAddPOP();
	});

	$("#show_Vendor").hide();
	$("#client_MACAddress").hide();
	$("#show_editMac").show();
	$("#show_IPAdr").hide();

	$("#show_IPAdrReserve").hide();
	$("#enableReserveIP").prop("checked", false);

	$("#enableAccess").prop("checked", false);
	$("#show_Schedule").hide();

	$("#editPop").show();

	editType = false;
	editID = "";

	document.getElementById("MACAddress_Info").innerHTML= "";
	document.getElementById("IPAdrReserve_Info").innerHTML= "";
	document.getElementById("show_IPAdrReserveAlerInfo").style.display = "none";
}

function editData(id)
{
	changeTimeoutAction();
	$("#popTitle").html(I18N("j", "Edit Rule"));
	$("#editPop").show();
	$("#check_btn").attr("class", "styled_button_dis").prop("disabled", true)
	.off('click').click(function()
	{
		closeEditPOP(id);
	});
	
	$("#show_Vendor").show();
	$("#client_MACAddress").show();
	$("#show_editMac").hide();
	$("#show_IPAdr").show();

	//insert data to pop form
	var data = datalist.getData(id);
	var ipString = data.IPv4Address;
	
	document.getElementById("MACAddress_Info").innerHTML= "";
	document.getElementById("IPAdrReserve_Info").innerHTML= "";
	document.getElementById("client_IPAdrReserve").value = data.ReserveIP;
	document.getElementById("client_MACAddress").innerHTML = data.MacAddress;
	$("#client_Name").val(data.NickName);

	if(ipString == "")
	{
		ipString = I18N("j", "Not Available");
	}
	$("#client_IPAdr").html(ipString);
		
	if(data.ReserveIP == ""){
		document.getElementById("show_IPAdrReserve").style.display = "none";
		document.getElementById("show_IPAdrReserveAlerInfo").style.display = "none";
		document.getElementById("show_IPAdr").style.display = "table-row";
		$("#enableReserveIP").prop("checked", false);
	}
	else{
		document.getElementById("show_IPAdrReserve").style.display = "table-row";
		document.getElementById("show_IPAdrReserveAlerInfo").style.display = "none";
		document.getElementById("show_IPAdr").style.display = "none";
		$("#enableReserveIP").prop("checked", true);
	}

	if (data.Vendor != "")
	{
		document.getElementById("client_Vendor").innerHTML = data.Vendor;
	}
	else
	{
		document.getElementById("client_Vendor").innerHTML = "N/A";
	}
		
	if (data.MacfilterEnabled == false)
	{
		$("#enableAccess").prop("checked", false);
		document.getElementById("show_Schedule").style.display = "none";
	}
	else
	{
		$("#enableAccess").prop("checked", true);
		document.getElementById("show_Schedule").style.display = "table-row";
		$("#schedule").selectbox('detach');
		$("#schedule").val('Always');
		if (data.ScheduleName != "")
		{
			for (var i = 1; i <= tmpXML_ScheduleCnt; i ++)
			{
				if(schedule.options[i].value === data.ScheduleName)
				{
					$("#schedule").val(schedule.options[i].value);
					break;
				}
			}
		}
		$("#schedule").selectbox('attach');
	}
}

function closeEditPOP(id)
{
	changeTimeoutAction();
	var reverseIP_enabled = $("#enableReserveIP").prop("checked");
	var reserveIP =$("#client_IPAdrReserve").val();
	var name = $("#client_Name").val();
	var macfilter_enabled = $("#enableAccess").prop("checked");
	var schedule = $("#schedule").val();
	
	$("#check_btn").attr("class", "styled_button_dis").prop("disabled", true);
	
	var data = datalist.getData(id);
	data.NickName = name;
	
	if(reverseIP_enabled && (reserveIP != ""))
	{
		if(!COMM_ValidV4Format(reserveIP) || !COMM_ValidV4Addr(reserveIP)){
			document.getElementById("IPAdrReserve_Info").innerHTML= I18N("j","err_address_Check");
			document.getElementById("show_IPAdrReserveAlerInfo").style.display = "none";
			return;
		}
		else
		{
			data.ReserveIP = reserveIP;
		}
	}
	else
	{
		data.ReserveIP = "";
	}
	
	data.MacfilterEnabled = macfilter_enabled;
	if(macfilter_enabled)
	{
		data.ScheduleName = schedule;
	}
	else
	{
		data.ScheduleName = "";
	}
	datalist.editData(data.rowid,data);
	
	//store client into Device
	var soapAction = new SOAPAction();
	var setClientInfo = new SOAPSetClientInfo();
	var client = new SOAPClientInfo();
	client.MacAddress = data.MacAddress;
	client.NickName = data.NickName;
	client.ReserveIP = data.ReserveIP;
	setClientInfo.ClientInfoLists.push(client);
	var setClientResult = soapAction.sendSOAPAction("SetClientInfo", setClientInfo, null);

	setClientResult.done(function(obj){
		if(obj.SetClientInfoResult == "ERROR_RESERVEIP_CONFLICT")
		{
			alert(I18N("j", "IP address cannot be the same."));
			$("#check_btn").attr("class", "styled_button_dis").prop("disabled", true);
		}
		else if(obj.SetClientInfoResult == "ERROR_RESERVEIP_TOO_MANY")
		{
			alert(I18N("j", "The maximum number of permitted DHCP reservations has been exceeded."));
			$("#check_btn").attr("class", "styled_button_dis").prop("disabled", true);
		}
		else
		{
			//set client info OK, store mac filter into Device
			var soapAction = new SOAPAction();
			var setMacFilters2 = new SOAPSetMACFilters2();
			
			for(var i in datalist.list)
			{
				if(datalist.list[i].MacfilterEnabled)
				{	
					var client = new SOAPMacInfo();
					client.MacAddress = datalist.list[i].MacAddress;
					client.ScheduleName = encode_char_text(datalist.list[i].ScheduleName);
					setMacFilters2.MACList.push(client);
				}
			}
			var result = soapAction.sendSOAPAction("SetMACFilters2", setMacFilters2, null);

			result.done(function(obj){
				if(obj.SetMACFilters2Result == "ERROR_MACLIST_TOO_MANY")
					{
						alert(I18N("j", "The rules exceed maximum."));
						$("#check_btn").attr("class", "styled_button_dis").prop("disabled", true);
					}
			});

			resetRulePOP();
		}
	});

}

function closeAddPOP()
{
	var reverseIP_enabled = $("#enableReserveIP").prop("checked");
	var reserveIP =$("#client_IPAdrReserve").val();
	var name = $("#client_Name").val();
	var macfilter_enabled = $("#enableAccess").prop("checked");
	var schedule = $("#schedule").val();
	var mac = $("#client_editMac").val();

	$("#check_btn").attr("class", "styled_button_dis").prop("disabled", true);

	if(reverseIP_enabled && (reserveIP != ""))
	{
		if(!COMM_ValidV4Format(reserveIP) || !COMM_ValidV4Addr(reserveIP)){
			document.getElementById("IPAdrReserve_Info").innerHTML= I18N("j","err_address_Check");
			return;
		}
	}

	if(COMM_IsMAC(mac) == false)
	{
		document.getElementById("MACAddress_Info").innerHTML= I18N("j","err_Check_Mac");
		return;
	}
	for(var row in datalist.list)
	{
		var obj = datalist.list[row];
		if(obj.MacAddress.toLowerCase() == mac.toLowerCase())
		{
			document.getElementById("MACAddress_Info").innerHTML= I18N("j","err_mac_conflict");
			return;
		}
	}

	//store client into Device
	var soapAction = new SOAPAction();
	var clientResult = null;
	var macfilterResult = null;
	var tmp = 0 ;

	if(reverseIP_enabled)
	{
		var setClientInfo = new SOAPSetClientInfo();
		var client = new SOAPClientInfo();
		client.MacAddress = mac;
		client.NickName = encode_char_text(name);
		client.ReserveIP = reserveIP;
		setClientInfo.ClientInfoLists.push(client);

		clientResult = soapAction.sendSOAPAction("SetClientInfo", setClientInfo, null);

		clientResult.done(function(obj){
			if(obj.SetClientInfoResult == "ERROR_RESERVEIP_CONFLICT")
			{
				alert(I18N("j", "IP address cannot be the same."));
				$("#check_btn").attr("class", "styled_button_s").prop("disabled", false);
				tmp = 1;
			}
			else if(obj.SetClientInfoResult == "ERROR_RESERVEIP_TOO_MANY")
			{
				alert(I18N("j", "The maximum number of permitted DHCP reservations has been exceeded."));
				$("#check_btn").attr("class", "styled_button_dis").prop("disabled", true);
				tmp = 1;
			}
		});
	}


	//set client info OK, store mac filter into Device
	if(macfilter_enabled)
	{
		var setMacFilters2 = new SOAPSetMACFilters2();

		for(var i in datalist.list)
		{
			if(datalist.list[i].MacfilterEnabled)
			{
				var client = new SOAPMacInfo();
				client.DeviceName = datalist.list[i].DeviceName;
				client.MacAddress = datalist.list[i].MacAddress;
				client.ScheduleName = encode_char_text(datalist.list[i].ScheduleName);
				setMacFilters2.MACList.push(client);
			}
		}
		var newClient = new SOAPMacInfo();
		newClient.DeviceName = encode_char_text(name);
		newClient.MacAddress = mac;
		newClient.ScheduleName = encode_char_text(schedule);
		setMacFilters2.MACList.push(newClient);

		macfilterResult = soapAction.sendSOAPAction("SetMACFilters2", setMacFilters2, null);
		
		macfilterResult.done(function(obj){
			if(obj.SetMACFilters2Result == "ERROR_MACLIST_TOO_MANY")
			{
				alert(I18N("j", "The rules exceed maximum."));
				$("#check_btn").attr("class", "styled_button_dis").prop("disabled", true);
				tmp = 1;
			}
		});
	}

	$.when(clientResult, macfilterResult).done(function(obj)
	{
		if(tmp == 0)
			resetRulePOP();
	});
}

function clearCreateRulePOP()
{
	changeTimeoutAction();
	resetRulePOP();
}

function resetRulePOP()
{
	//renew GUI
	Get_ClientInfo().done(function(){
		$("#editPop").hide();
		$("input").val('');
		
		$("select").selectbox('detach');
		$("#schedule").val('Always');
		$("select").selectbox('attach');
	});
}

function getClientList(str)
{
	if (str == "Host")
	{
		$("#client_btn_Blocked").attr("class", "v4v6_linkstyle_2");
		$("#client_btn_Guest").attr("class", "v4v6_linkstyle_2");
		$("#client_btn_Host").attr("class", "v4v6_linkstyle_1");
	}
	else if (str == "Guest")
	{
		$("#client_btn_Blocked").attr("class", "v4v6_linkstyle_2");
		$("#client_btn_Guest").attr("class", "v4v6_linkstyle_1");
		$("#client_btn_Host").attr("class", "v4v6_linkstyle_2");
	}
	else	//Blocked
	{
		$("#client_btn_Blocked").attr("class", "v4v6_linkstyle_1");
		$("#client_btn_Guest").attr("class", "v4v6_linkstyle_2");
		$("#client_btn_Host").attr("class", "v4v6_linkstyle_2");
	}
	
	Client_Type = str;
	Get_ClientInfo();
}

function setEvents(){
	$("#enableReserveIP").on("change", function(event){
		//buttonStyleChange();
		if($(this).prop("checked"))
		{
			$("#show_IPAdrReserve").show();
			if($("#client_IPAdrReserve").val() != "")
			{	
				buttonStyleChange();
			}
		}
		else
		{	
			buttonStyleChange();
			$("#show_IPAdrReserve").hide();
		}
	});

	$("#enableAccess").on("change", function(event){
		buttonStyleChange();
		if($(this).prop("checked"))
		{
			$("#show_Schedule").show();
		}
		else
		{
			$("#show_Schedule").hide();
		}
	});
}