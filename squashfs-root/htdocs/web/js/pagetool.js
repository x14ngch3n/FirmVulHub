function initialDetectRouterConnection(value)
{
	var DetectPopMessage = "";
	if (value == "Home")	{	DetectPopMessage += "<div id=\"dialogBox\" style=\"width:616px\">";	}
	else					{DetectPopMessage += "<div class=\"dialogBox\" style=\"width:616px\">";	}
	DetectPopMessage += "<table class=\"myCreatePop_table\" border=\"0\" cellspacing=\"0\" id=\"RouterConnectionTable\">";
	DetectPopMessage += "<tbody>";
	DetectPopMessage += "<tr><td colspan=\"3\"><div class =\"popTitle\">" + I18N("j", "Router Not Found") + "</div></td></tr>";
	DetectPopMessage += "<tr><td id=\"save_td\" colspan=\"4\"><center><div id=\"Save_edit_pop_btn\" style=\"cursor:pointer\" tabindex=\"12\" onclick=\"CheckHTMLStatus('');\">" + I18N("j", "Retry") + "</div></center></td></tr>";
	DetectPopMessage += "</tbody>";
	DetectPopMessage += "</table>";
	DetectPopMessage += "</div>";
	
	document.getElementById("DetectRouterConnection").innerHTML = DetectPopMessage;
}

function save_button_changed()
{
	changeFlag = true;
	document.getElementById("Save_Disable_btn").style.display = "none";
	document.getElementById("Save_btn").style.display = "block";
	changeTimeoutAction();
}

function SetCheckBoxEnable(id, init, ckstatus)
{
	var stren = I18N("j", "Enabled");
	var strdis = I18N("j", "Disabled");
	
	SetCheckBox(id, stren, strdis, ckstatus, init);
}

function SetCheckBoxAllow(id, init, ckstatus)
{
	var stren = I18N("j", "Allowed");
	var strdis = I18N("j", "Blocked");
	
	SetCheckBox(id, stren, strdis, ckstatus, init);
}

function SetCheckBox(id, stren, strdis, ckstatus, init)
{
	var checkbox = id+"_ck";
	var now_check;
	var status;
	
	if(init)
	{
		now_check = ckstatus;
		now_check?status=false:status=true;
	}
	else
	{
		now_check = document.getElementById(checkbox).checked;
		now_check?status=true:status=false;
		save_button_changed();
	}
	
	if(status)
	{
		document.getElementById(id).className = "checkbox_off";
		document.getElementById(id).innerHTML = '<input type="checkbox" id="'+checkbox+'" name="'+checkbox+'" checked>'+strdis;
		document.getElementById(checkbox).checked = false;
	}
	else
	{
		document.getElementById(id).className = "checkbox_on";
		document.getElementById(id).innerHTML = '<input type="checkbox" id="'+checkbox+'" name="'+checkbox+'" checked>'+stren;
		document.getElementById(checkbox).checked = true;
	}
}

/////////////////////////////////////////////////////////////////////
function presetCheckBox(id, ck)
{
	var targetId = 	document.getElementById(id);
	var checkboxId =  id +'_ck';
	
	if(ck == true) {
		var enable = I18N("j","Enabled");
	//	document.getElementById(checkboxId).checked = true;
		$("#"+id).attr("class", "checkbox_on");
		targetId.innerHTML='<input type="checkbox" name=' + id + ' id=' + checkboxId + ' checked>'+enable;
		document.getElementById(checkboxId).checked = true;
	}else {	
		var disable = I18N("j","Disabled");
	//	document.getElementById(checkboxId).checked = false;
		$("#"+id).attr("class", "checkbox_off");
		targetId.innerHTML='<input type="checkbox" name=' + id + ' id=' + checkboxId + ' checked>'+disable;
		document.getElementById(checkboxId).checked = false;
	}	
}

function showAdv(id) 
{	
	var block = document.getElementById(id);
	//alert("showAdv1");
	if(block.style.display == "none" || block.style.display == "") {
		//alert("block");
		block.style.display = "block";
	} else {
		//alert("none");
		block.style.display = "none";
	}
	//alert("showAdv2");
	changeTimeoutAction();
}

function showOnlineHelp(str)	
{
		var helpString = encodeURIComponent(str);
		var modelInfo = JSON.parse(sessionStorage.getItem('modelInfomation'));	
		var hwVer = modelInfo.hwVer.charAt(0) + "x";
	
		var helpURL = "http://dcms.dlink.com.tw/"+localStorage.language +"/" 
							+ modelInfo.modelName + "/" 
							+ hwVer + "/"
							+ currentDevice.helpVer +"/"
							+ helpString;
	
		window.open(helpURL);	
	}

function redirectPage(whichPage)
{
	var Host_Name = sessionStorage.getItem('RedirectUrl');
	
	if(whichPage != null)
		Host_Name = whichPage;
	
	if(Host_Name == null)
		Host_Name = "/";

	self.location.href = Host_Name;	
}