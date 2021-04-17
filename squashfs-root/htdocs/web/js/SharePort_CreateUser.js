// Coding : Timmy Hsieh 2012/12/12

var ROW_BASE = 1; // first number (for display)
var IsLoaded = false;
var TABLE_NAME = 'tblUserList';
var TABLE_NAME2 = 'tblUserList2';
var TABLE_NAME3 = 'tblUserList3';
var USER_NUMBER = 'usernumber_';
var USER_NAME = 'username_';
var USER_PASSWORD = 'userpassword_';
var ACCESS_PATH = 'accesspath_';
var USER_PROMISSION = 'userpromission_';
var EDIT_ICON = 'editicon_';
var DELETE_ICON = 'delicon_';

// Value
var a, b ,c ,d ,e;

// Pop Window Get Temp Information
var tmp_Iteration;
var tmp_UserName;
var tmp_UserPassword;
var tmp_AccessPath;
var tmp_UserPromission;

var tmp_add_UserName;
var tmp_add_UserPassword;
var tmp_add_AccessPath;
var tmp_add_UserPromission;
var tmp_ID;
var IsLoaded = true;

function GetHNAPInformatiom(ListNum, UserName, UserPassword, AccessPath, UserPromission)
{
	a = ListNum;
	b = UserName;
	c = UserPassword;
	d = AccessPath;
	e = UserPromission;
}

function myRowObject(one, two, three, four, five, six)
{
	this.one = one;			// input User Name
	this.two = two;			// input User AccessPath
	this.three = three;		// input User Promission
	this.four = four;		// input Edit icon
	this.five = five;		// input Delete icon
	this.six = six;			// input User Password
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
		
		// User Name
		var cell_0 = row.insertCell(0);
		var Input1 = document.createElement('label');
		Input1.setAttribute('id', USER_NAME + iteration);
		Input1.setAttribute('size', '10');
		Input1.innerHTML = b;
		cell_0.appendChild(Input1);
		
		// Access Path
		var cell_1 = row.insertCell(1);
		var Input2 = document.createElement('label');
		Input2.setAttribute('id', ACCESS_PATH + iteration);
		Input2.setAttribute('size', '50');
		d = d.replace("/", "");
		if (d == DefaultDirectory_RootP || d == DefaultDirectory_Path || d == "root" || d == "/root")	{	Input2.innerHTML = I18N("j", "root");	}
		else	{	Input2.innerHTML = d;					}
		
		cell_1.appendChild(Input2);
		
		// User Promission
		var cell_2 = row.insertCell(2);
		var Input3 = document.createElement('label');
		Input3.setAttribute('id', USER_PROMISSION + iteration);
		Input3.setAttribute('size', '10');
		if (e == "true")
		{
			Input3.innerHTML = I18N("j", "Read/Write");
		}
		else
		{
			Input3.innerHTML = I18N("j", "Read Only");
		}
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

		// Hide password to get
		var cell_5 = row.insertCell(5);
		var Input6 = document.createElement('label');
		Input6.setAttribute('id', USER_PASSWORD + iteration);
		Input6.setAttribute('size', '10');
		Input6.innerHTML = c;
		Input6.setAttribute('style', 'display:none');
		cell_5.appendChild(Input6);
		
		row.myRow = new myRowObject(Input1, Input2, Input3, Input4, Input5, Input6);
		
		b = null;
		c = null;
		d = null;
		e = null;
	}
}
function AddRowToIndex()
{
	var tbl = document.getElementById(TABLE_NAME);
	var nowUserName = document.getElementById("shareport_UserName").value;
	
	for(var i = 2; i <= Total_User + 1; i ++)
	{
		if (nowUserName === tbl.rows[i].childNodes[0].childNodes[0].innerHTML)
		{
			alert("Username can not be the same");
			return "Error";
		}
	}
	
	if (nowUserName == "")
	{
		alert("Username can not be null");
		return "Error";
	}
	b = document.getElementById("shareport_UserName").value;
	c = document.getElementById("shareport_Password").value;
	d = document.getElementById("shareport_Folder").value;
	if (document.getElementById("shareport_Permission").value == "1")
	{
		e = "false";
	}
	else
	{
		e = "true";
	}
	
	if (d == '')
	{
		alert("Error! Value cannot be null.");
		return "Error";
	}
	else
	{
		addRowToTable(null);
		Total_User += 1;
		check_TotalUser(Limit_TotalUser, Total_User);
	}
	
	// Clear
	document.getElementById("shareport_UserName").value = "";
	document.getElementById("shareport_Password").value = "";
	document.getElementById("shareport_Permission").value = "1";
	document.getElementById("shareport_Folder").value = "";
	return "Success";
}
function editDataGet(id)
{
	var tbl = document.getElementById(TABLE_NAME);
	var tmp_b = tbl.rows[id].childNodes[0].childNodes[0].innerHTML;
	var tmp_c = tbl.rows[id].childNodes[5].childNodes[0].innerHTML;
	var tmp_d = tbl.rows[id].childNodes[1].childNodes[0].innerHTML;
	var tmp_e = tbl.rows[id].childNodes[2].childNodes[0].innerHTML;
	document.getElementById("edit_UserName").value = tmp_b;
	document.getElementById("edit_Password").value = tmp_c;
	document.getElementById("edit_Folder").value = tmp_d;
	if (tmp_e == I18N("j", "Read Only"))
	{
		$("#edit_Permission").selectbox('detach');
		$("#edit_Permission").val('1');
		$("#edit_Permission").selectbox('attach');
		tmp_UserPromission = "1";
	}
	else
	{
		$("#edit_Permission").selectbox('detach');
		$("#edit_Permission").val('2');
		$("#edit_Permission").selectbox('attach');
		tmp_UserPromission = "2";
	}
	tmp_UserName = tmp_b;
	tmp_Password = tmp_c;
	tmp_AccessPath = tmp_d;

	setIteration(id);
	tmp_ID = id;
}
function assignRowToIndex(id)
{
	var tbl = document.getElementById(TABLE_NAME);
	var edit_Name = document.getElementById("edit_UserName").value;
	
	if (edit_Name != "")
	{
		for(var i = 2; i <= Total_User + 1; i ++)
		{
			// console.log(tmp_ID + " & " + i);
			if (edit_Name === tbl.rows[i].childNodes[0].childNodes[0].innerHTML)
			{
				if (tmp_ID == i)
				{
					continue;
				}
				else
				{
				// alert("Username can not be the same");
					return "Error";
				}
			}
		}
	}
	
	
	tbl.rows[id].childNodes[0].childNodes[0].innerHTML = document.getElementById("edit_UserName").value;
	
	if (document.getElementById("edit_Folder").value == DefaultDirectory_Path)	{	tbl.rows[id].childNodes[1].childNodes[0].innerHTML = I18N("j", "root");								}
	else																		{	tbl.rows[id].childNodes[1].childNodes[0].innerHTML = document.getElementById("edit_Folder").value;	}
	
	if (tmp_UserPromission == "1")
	{
		tbl.rows[id].childNodes[2].childNodes[0].innerHTML = I18N("j", "Read Only");
	}
	else
	{
		tbl.rows[id].childNodes[2].childNodes[0].innerHTML = I18N("j", "Read/Write");
	}
	
	tbl.rows[id].childNodes[5].childNodes[0].innerHTML = document.getElementById("edit_Password").value;
	
	check_TotalUser(Limit_TotalUser, Total_User);
	
	return tmp_ID;
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
		
		Total_User -= 1;
		check_TotalUser(Limit_TotalUser, Total_User);
		save_button_changed();
	}
}
function OnChangeUserName(num)
{
	tmp_UserName = num;
}
function OnChangeFolder(num)
{
	tmp_AccessPath = num;
}
function OnChangePermission(num)
{
	tmp_UserPromission = num;
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
				tbl.tBodies[0].rows[i].myRow.one.id = USER_NAME + count; // input text
				tbl.tBodies[0].rows[i].myRow.two.id = ACCESS_PATH + count; // input text
				tbl.tBodies[0].rows[i].myRow.three.id = USER_PROMISSION + count; // input text
				tbl.tBodies[0].rows[i].myRow.four.id = EDIT_ICON + count; // input text
				tbl.tBodies[0].rows[i].myRow.five.id = DELETE_ICON + count; // input text
				tbl.tBodies[0].rows[i].myRow.six.id = USER_PASSWORD + count; // input text
				changeRowIndex(count);
				count++;
			}
		}
	}
}
function check_TotalUser(Limit_TotalUser, Total_User)
{
	var IsFull = Limit_TotalUser - Total_User;
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
