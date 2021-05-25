// Coding : Timmy Hsieh 2013/02/25

var ROW_BASE = 1; // first number (for display)
var IsLoaded = false;
var TABLE_NAME = 'tblIPv6DynamicDNS';
var TABLE_NAME2 = 'tblIPv6DynamicDNS2';
var TABLE_NAME3 = 'tblIPv6DynamicDNS3';
var STATUS = 'status_'
var HOST_NAME = 'hostname_';
var IPV6_ADDRESS = 'ipv6address_';
var EDIT_ICON = 'editicon_';
var DELETE_ICON = 'delicon_';

// Value
var a, b, c;
var Name_CheckList = [];

// Pop Window Get Temp Information
var tmp_HostName;
var tmp_IPv6Address;
var IsLoaded = true;

function GetHNAPInformation(Status, HostName, IPAddress)
{
	a = Status;
	b = HostName;
	c = IPAddress;
}

function myRowObject(one, two, three, four, five)
{
	this.one = one;			// input Status
	this.two = two;			// input HostName
	this.three = three;		// input Address
	this.four = four;		// input Edit icon
	this.five = five;		// input Delete icon
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
			case "Enabled":
				Input1.checked = true;
				break;
			case "Disabled":
				Input1.checked = false;
				break;
			default:
				alert("Bad request!");
				break;
		}

		cell_0.appendChild(Input1);
		
		// Host Name
		var cell_1 = row.insertCell(1);
		var Input2 = document.createElement('label');
		Input2.setAttribute('id', HOST_NAME + iteration);
		Input2.setAttribute('size', '10');
		Input2.innerHTML = b;
		cell_1.appendChild(Input2);
		
		// IPv6 Address
		var cell_2 = row.insertCell(2);
		var Input3 = document.createElement('label');
		Input3.setAttribute('id', IPV6_ADDRESS + iteration);
		Input3.setAttribute('size', '10');
		Input3.innerHTML = c;
		cell_2.appendChild(Input3);

		// Input Edit Icon
		var cell_3 = row.insertCell(3);
		var Input4 = document.createElement('img');
		Input4.setAttribute('src', 'image/edit_btn.gif');
		Input4.setAttribute('width', '28');
		Input4.setAttribute('height', '28');
		Input4.setAttribute('id', EDIT_ICON + iteration);
		Input4.setAttribute('style', 'cursor:pointer');
		Input4.onclick = function () { editData(iteration) };
		cell_3.appendChild(Input4);
		
		// Input Delete Icon
		var cell_4 = row.insertCell(4);
		var Input5 = document.createElement('img');
		Input5.setAttribute('src', 'image/trash.gif');
		Input5.setAttribute('width', '41');
		Input5.setAttribute('height', '41');
		Input5.setAttribute('id', DELETE_ICON + iteration);
		Input5.setAttribute('style', 'cursor:pointer');
		Input5.onclick = function () { deleteCurrentRow(this) };
		cell_4.appendChild(Input5);

		row.myRow = new myRowObject(Input1, Input2, Input3, Input4, Input5);
		
		a = null;
		b = null;
		c = null;

	}
}
function AddRowToIndex()
{
	var tbl = document.getElementById(TABLE_NAME);
	tmp_Name = document.getElementById("dnsv6_HostName").value;
	
	// Clear all name
	for (var _clearName = 0; _clearName < Name_CheckList.length; _clearName ++)
	{
		Name_CheckList[_clearName] = null;
	}
	
	// Save all name
	var getName_Row = 0;
	for (var _getName = 1; _getName <= Total_DynamicDNSIPv6Rules; _getName ++)
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
	
	a = "Enabled";
	b = document.getElementById("dnsv6_HostName").value;
	c = document.getElementById("dnsv6_IPAddress").value;
	
	if (c == '')
	{
		alert("Error! Value cannot be null.");
		return "Error";
	}
	else
	{
		addRowToTable(null);
		Total_DynamicDNSIPv6Rules += 1;
		check_TotalRule(Limit_TotalDynamicDNSIPv6Rules, Total_DynamicDNSIPv6Rules);
	}
	
	return "Success";
}
function editDataGet(id)
{
	var tbl = document.getElementById(TABLE_NAME);
	var tmp_editHostName = tbl.rows[id].childNodes[1].childNodes[0].innerHTML;
	var tmp_editIPv6Address = tbl.rows[id].childNodes[2].childNodes[0].innerHTML;

	document.getElementById("dnsv6_EditHostName").value = tmp_editHostName;
	document.getElementById("dnsv6_EditIPAddress").value = tmp_editIPv6Address;
	
	tmp_HostName = tmp_editHostName;
	tmp_IPv6Address = tmp_editIPv6Address;
	
	setIteration(id);
}
function assignRowToIndex(id)
{
	var tbl = document.getElementById(TABLE_NAME);
	var edit_Name = document.getElementById("dnsv6_EditHostName").value;
	
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
		for (var _getName = 1; _getName <= Total_DynamicDNSIPv6Rules; _getName ++)
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
		
		tbl.rows[id].childNodes[0].childNodes[0].innerHTML = document.getElementById("dnsv6_EditHostName").value;
	}
	
	var get_EditHostName = document.getElementById("dnsv6_EditHostName").value;
	var get_EditIPv6Address = document.getElementById("dnsv6_EditIPAddress").value;

	if (get_EditHostName == "" || get_EditIPv6Address == "")
	{
		alert("Error! Value cannot be null.");
		return "Error";
	}
	else
	{
		var tbl = document.getElementById(TABLE_NAME);
		tbl.rows[id].childNodes[1].childNodes[0].innerHTML = get_EditHostName;
		tbl.rows[id].childNodes[2].childNodes[0].innerHTML = get_EditIPv6Address;
	}
	
	check_TotalRule(Limit_TotalDynamicDNSIPv6Rules, Total_DynamicDNSIPv6Rules);
	return "Success";
}
function deleteCurrentRow(obj)
{
	changeTimeoutAction();
	
	if (IsLoaded)
	{
		var delRow = obj.parentNode.parentNode;
		var tbl = delRow.parentNode.parentNode;
		var rIndex = delRow.sectionRowIndex;
		var rowArray = new Array(delRow);
		deleteRows(rowArray);
		reorderRows(tbl, rIndex);

		Total_DynamicDNSIPv6Rules -= 1;
		check_TotalRule(Limit_TotalDynamicDNSIPv6Rules, Total_DynamicDNSIPv6Rules);
		save_button_changed();
	}
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
	tbl.rows[count].childNodes[3].childNodes[0].onclick = function() { editData(count) };
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
				tbl.tBodies[0].rows[i].myRow.two.id = HOST_NAME + count;
				tbl.tBodies[0].rows[i].myRow.three.id = IPV6_ADDRESS + count;
				changeRowIndex(count);
				count++;
			}
		}
	}
}
function check_TotalRule(Limit_TotalDynamicDNSIPv6Rules, Total_DynamicDNSIPv6Rules)
{
	var IsFull = Limit_TotalDynamicDNSIPv6Rules - Total_DynamicDNSIPv6Rules;
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