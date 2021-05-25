// Coding : Timmy Hsieh 2013/01/15

var ROW_BASE = 1; // first number (for display)
var IsLoaded = false;
var TABLE_NAME = 'tblPortForwarding';
var TABLE_NAME2 = 'tblPortForwarding2';
var TABLE_NAME3 = 'tblPortForwarding3';
var STATUS = 'status_'
var NAME = 'name_';
var TCP_PORT = 'tcpport_';
var UDP_PORT = 'udpport_';
var LOCAL_IP = 'localip_';
var SCHEDULE = 'schedule_';
var EDIT_ICON = 'editicon_';
var DELETE_ICON = 'delicon_';

// Value
var a, b, c, d, e, f;
var Name_CheckList = [];

// Pop Window Get Temp Information
var tmp_Name;
var tmp_LocalIP;
var tmp_TCPPort;
var tmp_UDPPort;
var tmp_Schedule;
var IsLoaded = true;

function GetHNAPInformation(Status, Name, LocalIP, TCPPort, UDPPort, Schedule)
{
	a = Status;
	b = Name;
	c = LocalIP;
	d = TCPPort;
	e = UDPPort;
	f = Schedule;
}

function myRowObject(one, two, three, four, five, six, seven, eight)
{
	this.one = one;			// input Status
	this.two = two;			// input Name
	this.three = three;		// input Local IP
	this.four = four;		// input TCP Port
	this.five = five;		// input UDP Port
	this.six = six;			// input Schedule
	this.seven = seven;		// input Edit icon
	this.eight = eight;		// input Delete icon
}
function addRowToTable(num)
{
	if (IsLoaded)
	{
		var tbl = document.getElementById(TABLE_NAME);
		var nextRow = tbl.tBodies[0].rows.length;
		var iteration = nextRow + ROW_BASE;
		if (num == null)
		{
			num = nextRow;
		}
		else
		{
			iteration = num + ROW_BASE;
		}
		// add the Row
		var row = tbl.tBodies[0].insertRow(num);
		
		// Status
		var cell_0 = row.insertCell(0);
		var Input1 = document.createElement('input');
		Input1.setAttribute('type', 'checkbox');
		Input1.setAttribute('id', STATUS + iteration);
		
		switch (a)
		{
			case "true":
				Input1.checked = true;
				break;
			case "false":
				Input1.checked = false;
				break;
			default:
				alert("Bad request!");
				break;
		}

		cell_0.appendChild(Input1);
		
		// Name
		var cell_1 = row.insertCell(1);
		var Input2 = document.createElement('label');
		Input2.setAttribute('id', NAME + iteration);
		Input2.setAttribute('size', '10');
		Input2.innerHTML = b;
		cell_1.appendChild(Input2);
		
		// Local IP
		var cell_2 = row.insertCell(2);
		var Input3 = document.createElement('label');
		Input3.setAttribute('id', LOCAL_IP + iteration);
		Input3.setAttribute('size', '10');
		Input3.innerHTML = c;
		cell_2.appendChild(Input3);

		// TCP Port
		var cell_3 = row.insertCell(3);
		var Input4 = document.createElement('label');
		Input4.setAttribute('id', TCP_PORT + iteration);
		Input4.setAttribute('size', '10');
		
		if (d != "")
		{
			Input4.innerHTML = d;
		}
		else
		{
			Input4.innerHTML = "N/A";
		}
		
		cell_3.appendChild(Input4);
		
		// UDP Port
		var cell_4 = row.insertCell(4);
		var Input5 = document.createElement('label');
		Input5.setAttribute('id', UDP_PORT + iteration);
		Input5.setAttribute('size', '10');
		Input5.innerHTML = e;
		cell_4.appendChild(Input5);
		
		if (e != "")
		{
			Input5.innerHTML = e;
		}
		else
		{
			Input5.innerHTML = "N/A";
		}

		// Schedule
		var cell_5 = row.insertCell(5);
		var Input6 = document.createElement('label');
		Input6.setAttribute('id', SCHEDULE + iteration);
		Input6.setAttribute('size', '10');
		Input6.innerHTML = f;
		cell_5.appendChild(Input6);
			
		// Input Edit Icon
		var cell_6 = row.insertCell(6);
		var Input7 = document.createElement('img');
		Input7.setAttribute('src', 'image/edit_btn.gif');
		Input7.setAttribute('width', '28');
		Input7.setAttribute('height', '28');
		Input7.setAttribute('id', EDIT_ICON + iteration);
		Input7.setAttribute('style', 'cursor:pointer');
		Input7.onclick = function () { editData(iteration) };
		cell_6.appendChild(Input7);
		
		// Input Delete Icon
		var cell_7 = row.insertCell(7);
		var Input8 = document.createElement('img');
		Input8.setAttribute('src', 'image/trash.gif');
		Input8.setAttribute('width', '41');
		Input8.setAttribute('height', '41');
		Input8.setAttribute('id', DELETE_ICON + iteration);
		Input8.setAttribute('style', 'cursor:pointer');
		Input8.onclick = function () { deleteCurrentRow(this) };
		cell_7.appendChild(Input8);

		row.myRow = new myRowObject(Input1, Input2, Input3, Input4, Input5, Input6, Input7, Input8);
		
		a = null;
		b = null;
		c = null;
		d = null;
		e = null;
		f = null;
	}
}
function AddRowToIndex()
{
	var tbl = document.getElementById(TABLE_NAME);
	tmp_Name = document.getElementById("pf_Name").value;
	
	// Clear all name
	for (var _clearName = 0; _clearName < Name_CheckList.length; _clearName ++)
	{
		Name_CheckList[_clearName] = null;
	}
	
	// Save all name
	var getName_Row = 0;
	for (var _getName = 1; _getName <= Total_PortForwardingRules; _getName ++)
	{
		Name_CheckList[getName_Row] = tbl.rows[_getName].cells[1].childNodes[0].innerText;
		// console.log(Name_CheckList[getName_Row] + " ,length: " + Name_CheckList.length);
		getName_Row ++;
	}
	
	// Check Name
	for (var _checkName = 0; _checkName < Name_CheckList.length; _checkName ++)
	{
		// console.log(Name_CheckList[_checkName] + " & " + tmp_Name);
		if (tmp_Name == Name_CheckList[_checkName])
		{
			alert("Name cannot be the same.");
			return "Error";
		}
	}
	
	var getScheduleStatus = document.getElementById("pf_Schedule");
	a = "true";
	b = document.getElementById("pf_Name").value;
	c = document.getElementById("pf_LocalIP").value;
	
	var string_Split_d = document.getElementById("pf_TCPPort").value;
	var string_Split_e = document.getElementById("pf_UDPPort").value;
	d = string_Split_d.replace(/\s/g, "");
	e = string_Split_e.replace(/\s/g, "");
	f = getScheduleStatus.options[getScheduleStatus.selectedIndex].text;
	
	addRowToTable(null);
	Total_PortForwardingRules += 1;
	check_TotalRule(Limit_TotalPortForwardingRules, Total_PortForwardingRules);
	return "Success";
}
function editDataGet(id)
{
	var tbl = document.getElementById(TABLE_NAME);
	var tmp_editName = tbl.rows[id].childNodes[1].childNodes[0].innerHTML;
	var tmp_editLocalIP = tbl.rows[id].childNodes[2].childNodes[0].innerHTML;
	var tmp_editTCPPort = tbl.rows[id].childNodes[3].childNodes[0].innerHTML;
	var tmp_editUDPPort = tbl.rows[id].childNodes[4].childNodes[0].innerHTML;
	var tmp_editSchedule = tbl.rows[id].childNodes[5].childNodes[0].innerHTML;
	
	document.getElementById("edit_pf_Name").value = tmp_editName;
	document.getElementById("pf_EditLocalIP").value = tmp_editLocalIP;
	
	if (tmp_editTCPPort == "N/A")
	{
		document.getElementById("pf_EditTCPPort").value = "";
	}
	else
	{
		document.getElementById("pf_EditTCPPort").value = tmp_editTCPPort;
	}
	
	if (tmp_editUDPPort == "N/A")
	{
		document.getElementById("pf_EditUDPPort").value = "";
	}
	else
	{
		document.getElementById("pf_EditUDPPort").value = tmp_editUDPPort;
	}
	
	var getScheduleStatus = document.getElementById("pf_EditSchedule");
	for (var i = 0; i <= Total_ScheduleRules; i ++)
	{
		if(getScheduleStatus.options[i].text === tmp_editSchedule)
		{
			$("#pf_EditSchedule").selectbox('detach');
			$("#pf_EditSchedule").val(i);
			$("#pf_EditSchedule").selectbox('attach');
			break;
		}
	}
	
	tmp_Name = tmp_editName;
	tmp_LocalIP = tmp_editLocalIP;
	tmp_TCPPort = tmp_editTCPPort;
	tmp_UDPPort = tmp_editUDPPort;
	tmp_Schedule = tmp_editSchedule;

	setIteration(id);
}
function assignRowToIndex(id)
{
	var tbl = document.getElementById(TABLE_NAME);
	var edit_Name = document.getElementById("edit_pf_Name").value;
	
	// console.log("this name is: " + edit_Name + " , and row id is: " + id);
	if (edit_Name != "")
	{
		// Clear all name
		for (var _clearName = 0; _clearName < Name_CheckList.length; _clearName ++)
		{
			Name_CheckList[_clearName] = null;
			// console.log(Name_CheckList[_clearName]);
		}
		
		// Save all name
		var getName_Row = 0;
		for (var _getName = 1; _getName <= Total_PortForwardingRules; _getName ++)
		{
			// console.log("-------------------->" + tmp_ID);
			if (id == _getName)
			{
				Name_CheckList[getName_Row] = edit_Name;
			}
			else
			{
				Name_CheckList[getName_Row] = tbl.rows[_getName].cells[1].childNodes[0].innerText;
			}
			
			// console.log(Name_CheckList[getName_Row] + " ,length: " + Name_CheckList.length);
			getName_Row ++;
		}
		
		// Check Name
		for (var _checkName = 0; _checkName < Name_CheckList.length; _checkName ++)
		{
			// console.log(Name_CheckList[_checkName] + " & " + edit_Name);
			if (edit_Name == Name_CheckList[_checkName])
			{
				if (_checkName == id - 1)
				{
					continue;
				}
				else
				{
					alert("Name cannot be the same.");
					return "Error";
				}
			}
		}
		
		tbl.rows[id].childNodes[0].childNodes[0].innerHTML = document.getElementById("edit_pf_Name").value;
	}
	
	var get_EditName = document.getElementById("edit_pf_Name").value;
	var get_EditLocalIP = document.getElementById("pf_EditLocalIP").value;
	var get_EditTCPPortValue = document.getElementById("pf_EditTCPPort").value;
	var get_EditUDPPortValue = document.getElementById("pf_EditUDPPort").value;
	var get_FinalEditTCPPortValue = get_EditTCPPortValue.replace(/\s/g, "");
	var get_FinalEditUDPPortValue = get_EditUDPPortValue.replace(/\s/g, "");
	var get_EditSchedule = document.getElementById("pf_EditSchedule");
	var get_ScheduleStatus = get_EditSchedule.options[get_EditSchedule.selectedIndex].text;
	
	// console.log("get_EditTCPPortValue: " + get_EditTCPPortValue + "\ntmp_TCPPort: " + tmp_TCPPort );
	tbl.rows[id].childNodes[1].childNodes[0].innerHTML = get_EditName;
	tbl.rows[id].childNodes[2].childNodes[0].innerHTML = get_EditLocalIP;
	tbl.rows[id].childNodes[5].childNodes[0].innerHTML = get_ScheduleStatus;
	
	if (get_EditTCPPortValue == "")
	{
		tbl.rows[id].childNodes[3].childNodes[0].innerHTML = "N/A";
	}
	else
	{
		tbl.rows[id].childNodes[3].childNodes[0].innerHTML = get_FinalEditTCPPortValue;
	}
	
	if (get_EditUDPPortValue == "")
	{
		tbl.rows[id].childNodes[4].childNodes[0].innerHTML = "N/A";
	}
	else
	{
		tbl.rows[id].childNodes[4].childNodes[0].innerHTML = get_FinalEditUDPPortValue;
	}

	check_TotalRule(Limit_TotalPortForwardingRules, Total_PortForwardingRules);
	return "Success";
}
function deleteCurrentRow(obj)
{
	if (IsLoaded)
	{
		var delRow = obj.parentNode.parentNode;
		var tbl = delRow.parentNode.parentNode;
		var rIndex = delRow.sectionRowIndex;
		var rowArray = new Array(delRow);
		deleteRows(rowArray);
		reorderRows(tbl, rIndex);

		Total_PortForwardingRules -= 1;
		check_TotalRule(Limit_TotalPortForwardingRules, Total_PortForwardingRules);
		save_button_changed();
	}
}
function OnChangeName(num)
{
	tmp_Name = num;
}
function OnChangeTCPPort(num)
{
	tmp_TCPPort = num;
}
function OnChangeUDPPort(num)
{
	tmp_UDPPort = num;
}
function OnChangeLocalIP(num)
{
	tmp_LocalIP = num;
}
function deleteRows(rowObjArray)
{
	if (IsLoaded)
	{
		for (var i = 0; i < rowObjArray.length; i ++)
		{
			var rIndex = rowObjArray[i].sectionRowIndex;
			rowObjArray[i].parentNode.deleteRow(rIndex);
		}
	}
}
function changeRowIndex(count)
{
	// Change Index List
	var tbl = document.getElementById(TABLE_NAME);
	tbl.rows[count].childNodes[6].childNodes[0].onclick = function() { editData(count) };
}
function reorderRows(tbl, startingIndex)
{
	var tbl = document.getElementById(TABLE_NAME);
	if (IsLoaded)
	{
		if (tbl.tBodies[0].rows[startingIndex])
		{
			var count = startingIndex + ROW_BASE;
			for (var i = startingIndex; i < tbl.tBodies[0].rows.length; i ++)
			{
				tbl.tBodies[0].rows[i].myRow.one.id = STATUS + count;
				tbl.tBodies[0].rows[i].myRow.two.id = NAME + count;
				tbl.tBodies[0].rows[i].myRow.three.id = LOCAL_IP + count;
				tbl.tBodies[0].rows[i].myRow.four.id = TCP_PORT + count;
				tbl.tBodies[0].rows[i].myRow.five.id = UDP_PORT + count;
				tbl.tBodies[0].rows[i].myRow.six.id = SCHEDULE + count;
				changeRowIndex(count);
				count++;
			}
		}
	}
}
function check_TotalRule(Limit_TotalPortForwardingRules, Total_PortForwardingRules)
{
	var IsFull = Limit_TotalPortForwardingRules - Total_PortForwardingRules;
	document.getElementById("RemainingRules").innerHTML = IsFull;
	
	if (IsFull == 0)
	{
		document.getElementById("createButton").disabled = true;
	}
	else
	{
		document.getElementById("createButton").disabled = false;
	}
}