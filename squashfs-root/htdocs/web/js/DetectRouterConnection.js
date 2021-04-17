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