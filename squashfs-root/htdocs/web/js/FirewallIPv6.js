// Coding: timmy Hsieh 2013/02/04

var ROW_BASE = 1; // first number (for display)
var IsLoaded = false;
var TABLE_NAME = 'tblIPv6Firewall';
var TABLE_NAME2 = 'tblIPv6Firewall2';
var TABLE_NAME3 = 'tblIPv6Firewall3';
var NAME = 'name_'
var SOURCE = 'source_';
var DESTINATION = 'destination_';
var PROTOCOL = 'protocol_';
var SCHEDULE = 'schedule_';
var SOURCE_ADDRESSRANGE_START = 'sourceiprangestart_';
var SOURCE_ADDRESSRANGE_END = 'sourceiprangeend_';
var DESTINATION_ADDRESSRANGE_START = 'destinationiprangestart_';
var DESTINATION_ADDRESSRANGE_END = 'destinationiprangeend_';
var PORT_RANGE_START = 'portrangestart_';
var PORT_RANGE_END = 'portrangeend_';
var EDIT_ICON = 'editicon_';
var DELETE_ICON = 'delicon_';

// Value
var a, b, c, d, e, f, g, h, i, j ,k;
var Name_CheckList = [];

// Pop window Get Temp Information
var tmp_Name;
var tmp_Source;
var tmp_Destination;
var tmp_Protocol;
var tmp_Schedule;
var tmp_SourceAddressRangeStart;
var tmp_SourceAddressRangeEnd;
var tmp_DestinationAddressRangeStart;
var tmp_DestinationAddressRangeEnd;
var tmp_PortRangeStart;
var tmp_PortRangeEnd;
var IsLoaded = true;

function GetHNAPInfomation(Name, Schedule, Source, SourceAddressRangeStart, SourceAddressRangeEnd, Destination, DestinationAddressRangeStart, DestinationAddressRangeEnd, Protocol, PortRangeStart, PortRangeEnd)
{
	a = Name;
	b = Schedule;
	c = Source;
	d = SourceAddressRangeStart;
	e = SourceAddressRangeEnd;
	f = Destination;
	g = DestinationAddressRangeStart;
	h = DestinationAddressRangeEnd;
	i = Protocol;
	j = PortRangeStart;
	k = PortRangeEnd;
}

function myRowObject(one, two, three, four, five, six, seven, eight, nine, ten, eleven, twelve, thirteen)
{
	this.one = one;			// input Name
	this.two = two;			// input Schedule
	this.three = three;		// input Edit icon
	this.four = four;		// input Delete icon
	
	// Hidden Value
	this.five = five;
	this.six = six;
	this.seven = seven;
	this.eight = eight;
	this.nine = nine;
	this.ten = ten;
	this.eleven = eleven;
	this.twelve = twelve;
	this.thirteen = thirteen;
}

function AddRowToIndex()
{
	var tbl = document.getElementById(TABLE_NAME);
	tmp_Name = document.getElementById("FWv6_Name").value;
	
	// Clear all name
	for (var _clearName = 0; _clearName < Name_CheckList.length; _clearName ++)
	{
		Name_CheckList[_clearName] = null;
	}
	
	// Save all name
	var getName_Row = 0;
	for (var _getName = 1; _getName <= Total_FirewallRules; _getName ++)
	{
		Name_CheckList[getName_Row] = tbl.rows[_getName].cells[0].childNodes[0].innerText;
		console.log(Name_CheckList[getName_Row] + " ,length: " + Name_CheckList.length);
		getName_Row ++;
	}
	
	// Check Name
	for (var _checkName = 0; _checkName < Name_CheckList.length; _checkName ++)
	{
		console.log(Name_CheckList[_checkName] + " & " + tmp_Name);
		if (tmp_Name == Name_CheckList[_checkName])
		{
			alert("Name cannot be the same.");
			return "Error";
		}
	}
	
	var tmp_FWv6_SourceIPRange = document.getElementById("FWv6_SourceIPRange").value;
	var tmp_FWv6_DestinationIPRange = document.getElementById("FWv6_DestinationIPRange").value;
	var tmp_FWv6_PortRange = document.getElementById("FWv6_PortRange").value;
	
	var split_FWv6_SourceIPRange = tmp_FWv6_SourceIPRange.split(/[\s-]+/);
	d = split_FWv6_SourceIPRange[split_FWv6_SourceIPRange.length - 2];
	e = split_FWv6_SourceIPRange[split_FWv6_SourceIPRange.length - 1];
	
	var split_FWv6_DestinationIPRange = tmp_FWv6_DestinationIPRange.split(/[\s-]+/);
	g = split_FWv6_DestinationIPRange[split_FWv6_DestinationIPRange.length - 2];
	h = split_FWv6_DestinationIPRange[split_FWv6_DestinationIPRange.length - 1];
	
	var split_FWv6_PortRange = tmp_FWv6_PortRange.split(/[\s-]+/);
	j = split_FWv6_PortRange[split_FWv6_PortRange.length - 2];
	k = split_FWv6_PortRange[split_FWv6_PortRange.length - 1];
	
	var get_ScheduleValue = document.getElementById("select_FWv6_Schedule");
	
	a = document.getElementById("FWv6_Name").value;
	b = get_ScheduleValue.options[get_ScheduleValue.selectedIndex].text;
	c = document.getElementById("select_FWv6_SourceInterface").value;
	f = document.getElementById("select_FWv6_DestinationInterface").value;	
	i = document.getElementById("select_FWv6_Protocol").value;
	
	// Source Interface
	switch (c)
	{
		case "1":
			c = "WAN";
			break;
		case "2":
			c = "LAN";
			break;
		default:
			alert("Bad Request - Source Interface");
			break;
	}
	
	// Destination Interface
	switch (f)
	{
		case "1":
			f = "WAN";
			break;
		case "2":
			f = "LAN";
			break;
		default:
			alert("Bad Request - Destination Interface");
			break;
	}
	
	// Protocol Type
	switch (i)
	{
		case "1":
			i = "TCP";
			break;
		case "2":
			i = "UDP";
			break;
		case "3":
			i = "Any";
			break;
		default:
			alert("Bad Request - Protocol Type");
			break;
	}
	
	addRowToTable(null);
	Total_FirewallRules += 1;
	check_TotalRule(Limit_FirewallRules, Total_FirewallRules);
	return "Success";
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
		
		// Name
		var cell_0 = row.insertCell(0);
		var Input1 = document.createElement('label');
		Input1.setAttribute('id', NAME + iteration);
		Input1.setAttribute('size', '10');
		Input1.innerHTML = a;
		cell_0.appendChild(Input1);

		// Schedule
		var cell_1 = row.insertCell(1);
		var Input2 = document.createElement('label');
		Input2.setAttribute('id', SCHEDULE + iteration);
		Input2.setAttribute('size', '10');
		if (b == "Always")
		{
			b = I18N("j", "Always");
		}
		Input2.innerHTML = b;
		cell_1.appendChild(Input2);
		
		
		// Input Edit Icon
		var cell_2 = row.insertCell(2);
		var Input3 = document.createElement('img');
		Input3.setAttribute('src', 'image/edit_btn.gif');
		Input3.setAttribute('width', '28');
		Input3.setAttribute('height', '28');
		Input3.setAttribute('id', EDIT_ICON + iteration);
		Input3.setAttribute('style', 'cursor:pointer');
		Input3.onclick = function () { editData(iteration) };
		cell_2.appendChild(Input3);
		
		// Input Delete Icon
		var cell_3 = row.insertCell(3);
		var Input4 = document.createElement('img');
		Input4.setAttribute('src', 'image/trash.gif');
		Input4.setAttribute('width', '41');
		Input4.setAttribute('height', '41');
		Input4.setAttribute('id', DELETE_ICON + iteration);
		Input4.setAttribute('style', 'cursor:pointer');
		Input4.onclick = function () { deleteCurrentRow(this) };
		cell_3.appendChild(Input4);
		
		// Other Value, Invisible!
		var cell_4 = row.insertCell(4);
		var cell_5 = row.insertCell(5);
		var cell_6 = row.insertCell(6);
		var cell_7 = row.insertCell(7);
		var cell_8 = row.insertCell(8);
		var cell_9 = row.insertCell(9);
		var cell_10 = row.insertCell(10);
		var cell_11 = row.insertCell(11);
		var cell_12 = row.insertCell(12);
		
		var Input5 = document.createElement('label');
		var Input6 = document.createElement('label');
		var Input7 = document.createElement('label');
		var Input8 = document.createElement('label');
		var Input9 = document.createElement('label');
		var Input10 = document.createElement('label');
		var Input11 = document.createElement('label');
		var Input12 = document.createElement('label');
		var Input13 = document.createElement('label');
		
		Input5.setAttribute('id', SOURCE + iteration);
		Input6.setAttribute('id', SOURCE_ADDRESSRANGE_START + iteration);
		Input7.setAttribute('id', SOURCE_ADDRESSRANGE_END + iteration);
		Input8.setAttribute('id', DESTINATION + iteration);
		Input9.setAttribute('id', DESTINATION_ADDRESSRANGE_START + iteration);
		Input10.setAttribute('id', DESTINATION_ADDRESSRANGE_END + iteration);
		Input11.setAttribute('id', PROTOCOL + iteration);
		Input12.setAttribute('id', PORT_RANGE_START + iteration);
		Input13.setAttribute('id', PORT_RANGE_END + iteration);
		
		Input5.innerHTML = c;
		Input6.innerHTML = d;
		Input7.innerHTML = e;
		Input8.innerHTML = f;
		Input9.innerHTML = g;
		Input10.innerHTML = h;
		Input11.innerHTML = i;
		Input12.innerHTML = j;
		Input13.innerHTML = k;
		
		// Debug Mode
		Input5.style.display = "none";
		Input6.style.display = "none";
		Input7.style.display = "none";
		Input8.style.display = "none";
		Input9.style.display = "none";
		Input10.style.display = "none";
		Input11.style.display = "none";
		Input12.style.display = "none";
		Input13.style.display = "none";
		
		cell_4.appendChild(Input5);
		cell_5.appendChild(Input6);
		cell_6.appendChild(Input7);
		cell_7.appendChild(Input8);
		cell_8.appendChild(Input9);
		cell_9.appendChild(Input10);
		cell_10.appendChild(Input11);
		cell_11.appendChild(Input12);
		cell_12.appendChild(Input13);

		row.myRow = new myRowObject(Input1, Input2, Input3, Input4, Input5, Input6, Input7, Input8, Input9, Input10, Input11, Input12, Input13);
		
		a = null;
		b = null;
		c = null;
		d = null;
		e = null;
		f = null;
		g = null;
		h = null;
		i = null;
		j = null;
		k = null;
	}
}

function editDataGet(id)
{
	var tbl = document.getElementById(TABLE_NAME);
	var tmp_editName = tbl.rows[id].childNodes[0].childNodes[0].innerHTML;
	var tmp_editSchedule = tbl.rows[id].childNodes[1].childNodes[0].innerHTML;
	var tmp_editSource = tbl.rows[id].childNodes[4].childNodes[0].innerHTML;
	var tmp_editSourceAddressRangeStart = tbl.rows[id].childNodes[5].childNodes[0].innerHTML;
	var tmp_editSourceAddressRangeEnd = tbl.rows[id].childNodes[6].childNodes[0].innerHTML;
	var tmp_editDestination = tbl.rows[id].childNodes[7].childNodes[0].innerHTML;
	var tmp_editDestinationAddressRangeStart = tbl.rows[id].childNodes[8].childNodes[0].innerHTML;
	var tmp_editDestinationAddressRangeEnd = tbl.rows[id].childNodes[9].childNodes[0].innerHTML;
	var tmp_editProtocol = tbl.rows[id].childNodes[10].childNodes[0].innerHTML;
	var tmp_editPortRangeStart = tbl.rows[id].childNodes[11].childNodes[0].innerHTML;
	var tmp_editPortRangeEnd = tbl.rows[id].childNodes[12].childNodes[0].innerHTML;
	
	document.getElementById("FWv6_EditName").value = tmp_editName;
	document.getElementById("FWv6_EditSourceIPRange").value = tmp_editSourceAddressRangeStart + "-" + tmp_editSourceAddressRangeEnd;
	document.getElementById("FWv6_EditDestinationIPRange").value = tmp_editDestinationAddressRangeStart + "-" + tmp_editDestinationAddressRangeEnd;
	document.getElementById("FWv6_EditPortRange").value = tmp_editPortRangeStart + "-" + tmp_editPortRangeEnd;
	
	var getScheduleStatus = document.getElementById("select_FWv6_EditSchedule");
	for (var i = 0; i <= Total_ScheduleRules; i ++)
	{
		if(getScheduleStatus.options[i].text === tmp_editSchedule)
		{
			$("#select_FWv6_EditSchedule").selectbox('detach');
			$("#select_FWv6_EditSchedule").val(i);
			$("#select_FWv6_EditSchedule").selectbox({width:170});
			$("#select_FWv6_EditSchedule").selectbox('attach');
			break;
		}
	}
	
	switch (tmp_editSource)
	{
		case "Interface":
			$("#select_FWv6_EditSourceInterface").selectbox('detach');
			$("#select_FWv6_EditSourceInterface").val('0');
			$("#select_FWv6_EditSourceInterface").selectbox({width:170});
			$("#select_FWv6_EditSourceInterface").selectbox('attach');
			break;
		case "WAN":
			$("#select_FWv6_EditSourceInterface").selectbox('detach');
			$("#select_FWv6_EditSourceInterface").val('1');
			$("#select_FWv6_EditSourceInterface").selectbox({width:170});
			$("#select_FWv6_EditSourceInterface").selectbox('attach');
			break;
		case "LAN":
			$("#select_FWv6_EditSourceInterface").selectbox('detach');
			$("#select_FWv6_EditSourceInterface").val('2');
			$("#select_FWv6_EditSourceInterface").selectbox({width:170});
			$("#select_FWv6_EditSourceInterface").selectbox('attach');
			break;
		default:
			alert("Debugging Mode - tmp_editSource");
			break;
	}
	
	switch (tmp_editDestination)
	{
		case "Interface":
			$("#select_FWv6_EditDestinationInterface").selectbox('detach');
			$("#select_FWv6_EditDestinationInterface").val('0');
			$("#select_FWv6_EditDestinationInterface").selectbox({width:170});
			$("#select_FWv6_EditDestinationInterface").selectbox('attach');
			break;
		case "WAN":
			$("#select_FWv6_EditDestinationInterface").selectbox('detach');
			$("#select_FWv6_EditDestinationInterface").val('1');
			$("#select_FWv6_EditDestinationInterface").selectbox({width:170});
			$("#select_FWv6_EditDestinationInterface").selectbox('attach');
			break;
		case "LAN":
			$("#select_FWv6_EditDestinationInterface").selectbox('detach');
			$("#select_FWv6_EditDestinationInterface").val('2');
			$("#select_FWv6_EditDestinationInterface").selectbox({width:170});
			$("#select_FWv6_EditDestinationInterface").selectbox('attach');
			break;
		default:
			alert("Debugging Mode - tmp_editDestination");
			break;
	}
	
	switch (tmp_editProtocol)
	{
		case "Protocol":
			$("#select_FWv6_EditProtocol").selectbox('detach');
			$("#select_FWv6_EditProtocol").val('0');
			$("#select_FWv6_EditProtocol").selectbox({width:170});
			$("#select_FWv6_EditProtocol").selectbox('attach');
			break;
		case "TCP":
			$("#select_FWv6_EditProtocol").selectbox('detach');
			$("#select_FWv6_EditProtocol").val('1');
			$("#select_FWv6_EditProtocol").selectbox({width:170});
			$("#select_FWv6_EditProtocol").selectbox('attach');
			break;
		case "UDP":
			$("#select_FWv6_EditProtocol").selectbox('detach');
			$("#select_FWv6_EditProtocol").val('2');
			$("#select_FWv6_EditProtocol").selectbox({width:170});
			$("#select_FWv6_EditProtocol").selectbox('attach');
			break;
		case "ANY":
			$("#select_FWv6_EditProtocol").selectbox('detach');
			$("#select_FWv6_EditProtocol").val('3');
			$("#select_FWv6_EditProtocol").selectbox({width:170});
			$("#select_FWv6_EditProtocol").selectbox('attach');
			break;
		default:
			alert("Debugging Mode - tmp_editProtocol");
			break;
	}
	
	tmp_Name = tmp_editName;
	tmp_Source = tmp_editSource;
	tmp_Destination = tmp_editDestination;
	tmp_Protocol = tmp_editProtocol;
	tmp_Schedule = tmp_editSchedule;
	tmp_SourceAddressRangeStart = tmp_editSourceAddressRangeStart;
	tmp_SourceAddressRangeEnd = tmp_editSourceAddressRangeEnd;
	tmp_DestinationAddressRangeStart = tmp_editDestinationAddressRangeStart;
	tmp_DestinationAddressRangeEnd = tmp_editDestinationAddressRangeEnd;
	tmp_PortRangeStart = tmp_editPortRangeStart;
	tmp_PortRangeEnd = tmp_editPortRangeEnd;
	
	setIteration(id);
}

function assignRowToIndex(id)
{
	var tbl = document.getElementById(TABLE_NAME);
	var edit_Name = document.getElementById("FWv6_EditName").value;
	
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
		for (var _getName = 1; _getName <= Total_FirewallRules; _getName ++)
		{
			// console.log("-------------------->" + tmp_ID);
			if (id == _getName)
			{
				Name_CheckList[getName_Row] = edit_Name;
			}
			else
			{
				Name_CheckList[getName_Row] = tbl.rows[_getName].cells[0].childNodes[0].innerText;
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
		
		tbl.rows[id].childNodes[0].childNodes[0].innerHTML = document.getElementById("FWv6_EditName").value;
	}
	
	var tmp_FWv6_EditSourceIPRange = document.getElementById("FWv6_EditSourceIPRange").value;
	var tmp_FWv6_EditDestinationIPRange = document.getElementById("FWv6_EditDestinationIPRange").value;
	var tmp_FWv6_EditPortRange = document.getElementById("FWv6_EditPortRange").value;
	
	var split_FWv6_EditSourceIPRange = tmp_FWv6_EditSourceIPRange.split(/[\s-]+/);
	var get_EditSourceAddressRangeStart = split_FWv6_EditSourceIPRange[split_FWv6_EditSourceIPRange.length - 2];
	var get_EditSourceAddressRangeEnd = split_FWv6_EditSourceIPRange[split_FWv6_EditSourceIPRange.length - 1];
	
	var split_FWv6_EditDestinationIPRange = tmp_FWv6_EditDestinationIPRange.split(/[\s-]+/);
	var get_EditDestinationAddressRangeStart = split_FWv6_EditDestinationIPRange[split_FWv6_EditDestinationIPRange.length - 2];
	var get_EditDestinationAddressRangeEnd = split_FWv6_EditDestinationIPRange[split_FWv6_EditDestinationIPRange.length - 1];
	
	var split_FWv6_EditPortRange = tmp_FWv6_EditPortRange.split(/[\s-]+/);
	var get_EditPortRangeStart = split_FWv6_EditPortRange[split_FWv6_EditPortRange.length - 2];
	var get_EditPortRangeEnd = split_FWv6_EditPortRange[split_FWv6_EditPortRange.length - 1];
	
	var get_EditName = document.getElementById("FWv6_EditName").value;
	var get_EditScheduleName = document.getElementById("select_FWv6_EditSchedule");
	var get_EditSchedule = get_EditScheduleName.options[get_EditScheduleName.selectedIndex].text;
	var get_EditSource = document.getElementById("select_FWv6_EditSourceInterface").value;
	var get_EditDestination = document.getElementById("select_FWv6_EditDestinationInterface").value;
	var get_EditProtocol = document.getElementById("select_FWv6_EditProtocol").value;
	
	tbl.rows[id].childNodes[0].childNodes[0].innerHTML = get_EditName;
	
	if (get_EditSchedule == "Always")
	{
		get_EditSchedule = I18N("j", "Always");
	}
	tbl.rows[id].childNodes[1].childNodes[0].innerHTML = get_EditSchedule;
	tbl.rows[id].childNodes[5].childNodes[0].innerHTML = get_EditSourceAddressRangeStart;
	tbl.rows[id].childNodes[6].childNodes[0].innerHTML = get_EditSourceAddressRangeEnd;
	tbl.rows[id].childNodes[8].childNodes[0].innerHTML = get_EditDestinationAddressRangeStart;
	tbl.rows[id].childNodes[9].childNodes[0].innerHTML = get_EditDestinationAddressRangeEnd;
	tbl.rows[id].childNodes[11].childNodes[0].innerHTML = get_EditPortRangeStart;
	tbl.rows[id].childNodes[12].childNodes[0].innerHTML = get_EditPortRangeEnd;

	switch (get_EditSource)
	{
		case "1":
			tbl.rows[id].childNodes[4].childNodes[0].innerHTML = "WAN";
			break;
		case "2":
			tbl.rows[id].childNodes[4].childNodes[0].innerHTML = "LAN";
			break;
		default:
			alert("Debugging Mode - tmp_Source");
			break;
	}
	
	switch (get_EditDestination)
	{
		case "1":
			tbl.rows[id].childNodes[7].childNodes[0].innerHTML = "WAN";
			break;
		case "2":
			tbl.rows[id].childNodes[7].childNodes[0].innerHTML = "LAN";
			break;
		default:
			alert("Debugging Mode - tmp_Destination");
			break;
	}
	
	switch (get_EditProtocol)
	{
		case "1":
			tbl.rows[id].childNodes[10].childNodes[0].innerHTML = "TCP";
			break;
		case "2":
			tbl.rows[id].childNodes[10].childNodes[0].innerHTML = "UDP";
			break;
		case "3":
			tbl.rows[id].childNodes[10].childNodes[0].innerHTML = "Any";
			break;
		default:
			alert("Debugging Mode - tmp_Protocol");
			break;
	}
	
	check_TotalRule(Limit_FirewallRules, Total_FirewallRules);
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

		Total_FirewallRules -= 1;
		check_TotalRule(Limit_FirewallRules, Total_FirewallRules);
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
	tbl.rows[count].childNodes[2].childNodes[0].onclick = function() { editData(count) };
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
				tbl.tBodies[0].rows[i].myRow.one.id = NAME + count;
				tbl.tBodies[0].rows[i].myRow.two.id = SCHEDULE + count;
				
				// Extra Value
				tbl.tBodies[0].rows[i].myRow.five.id = SOURCE + count;
				tbl.tBodies[0].rows[i].myRow.six.id = SOURCE_ADDRESSRANGE_START + count;
				tbl.tBodies[0].rows[i].myRow.seven.id = SOURCE_ADDRESSRANGE_END + count;
				tbl.tBodies[0].rows[i].myRow.eight.id = DESTINATION + count;
				tbl.tBodies[0].rows[i].myRow.nine.id = DESTINATION_ADDRESSRANGE_START + count;
				tbl.tBodies[0].rows[i].myRow.ten.id = DESTINATION_ADDRESSRANGE_END + count;
				tbl.tBodies[0].rows[i].myRow.eleven.id = PROTOCOL + count;
				tbl.tBodies[0].rows[i].myRow.twelve.id = PORT_RANGE_START + count;
				tbl.tBodies[0].rows[i].myRow.thirteen.id = PORT_RANGE_END + count;
				
				changeRowIndex(count);
				count++;
				
			}
		}
	}
}

function check_TotalRule(Limit_FirewallRules, Total_FirewallRules)
{
	var IsFull = Limit_FirewallRules - Total_FirewallRules;
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