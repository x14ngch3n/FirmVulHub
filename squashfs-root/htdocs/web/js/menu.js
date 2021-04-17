var menu_Check_Settings		= 0;
var menu_Check_Advanced		= 0;
var menu_Check_Management	= 0;

function initialMenu()
{
	var HNAP_menu = new HNAP_XML(); //Declare the HNAP_menu object due to some programs which use this function didn¡¦t declare HNAP object first.

	var devicemode = "GatewayWithWiFi";
	if(sessionStorage.getItem('devicemode')===null)
	{
		var xml_GetDeviceFeature = HNAP_menu.GetXML("GetDeviceFeatureAlpha");
		var xml_GetOperationMode = HNAP_menu.GetXML("GetOperationMode");

		var feature_apclient = xml_GetDeviceFeature.Get("GetDeviceFeatureAlphaResponse/FeatureAPClient");
		var feature_repeater = xml_GetDeviceFeature.Get("GetDeviceFeatureAlphaResponse/FeatureRepeater");
		var device_layout = xml_GetOperationMode.Get("GetOperationModeResponse/OperationModeList/CurrentOPMode");

		if(device_layout=="WirelessBridge")
		{
			if(feature_apclient=="true") devicemode = "WiFiAPClient";
			else if(support_repeater=="true") devicemode = "WiFiRepeater";
		}
	}
	else
		devicemode = sessionStorage.getItem('devicemode');

	var menu;
	if(devicemode=="WiFiAPClient")
	{
		menu = "<ul>";
		menu 		+= "	<li class='parent' onmouseover='this.className=\"parentOn\"' onmouseout='this.className=\"parent\"'><a id='menu_Settings' href='#'>"+I18N("j", "Settings")+"</a>";
		menu 		+= "		<ul>";
		menu 		+= "			<li><a href='javascript:CheckHTMLStatus(\"Internet\");' onclick='return confirmExit();'>"+I18N("j", "Internet(WAN)")+"</a></li>";
		menu 		+= "			<li><a href='javascript:CheckHTMLStatus(\"WiFi\");' onclick='return confirmExit()'>"+I18N("j", "Wireless(Wi-Fi)")+"</a></li>";
		menu 		+= "		</ul>";
		menu 		+= "	</li>";
		menu 		+= "	<li class='parent' onmouseover='this.className=\"parentOn\"' onmouseout='this.className=\"parent\"'><a id='menu_Management' href='#'>"+I18N("j", "Management")+"</a>";
		menu 		+= "		<ul>";
		menu 		+= "			<li><a href='javascript:CheckHTMLStatus(\"Time\");' onclick='return confirmExit()'>"+I18N("j", "Time & Schedule")+"</a></li>";
		menu 		+= "			<li><a href='javascript:CheckHTMLStatus(\"SystemLog\");' onclick='return confirmExit()'>"+I18N("j", "System Log")+"</a></li>";
		menu 		+= "			<li><a href='javascript:CheckHTMLStatus(\"Admin\");' onclick='return confirmExit()'>"+I18N("j", "System Admin")+"</a></li>";
		menu 		+= "			<li><a href='javascript:CheckHTMLStatus(\"UpdateFirmware\");' onclick='return confirmExit()'>"+I18N("j", "Upgrade")+"</a></li>";
		menu 		+= "			<li><a href='javascript:CheckHTMLStatus(\"Statistics\");' onclick='return confirmExit()'>"+I18N("j", "Statistics")+"</a></li>";
		menu 		+= "		</ul>";
		menu 		+= "	</li>";
		menu 		+= "</ul>";
	}
	else
	{
		menu = "<ul>";
		menu 		+= "	<li><a id='menu_Home' href='javascript:CheckHTMLStatus(\"Home\");'>"+I18N("j", "Home")+"</a></li>";
		menu 		+= "	<li class='parent' onmouseover='this.className=\"parentOn\"' onmouseout='this.className=\"parent\"'><a id='menu_Settings' href='#'>"+I18N("j", "Settings")+"</a>";
		menu 		+= "		<ul>";
		menu 		+= "			<li><a href='javascript:CheckHTMLStatus(\"Wizard_Manual\");' onclick='return confirmExit()'>"+I18N("j", "Wizard")+"</a></li>";
		menu 		+= "			<li><a href='javascript:CheckHTMLStatus(\"Internet\");' onclick='return confirmExit();'>"+I18N("j", "Internet(WAN)")+"</a></li>";
		menu 		+= "			<li><a href='javascript:CheckHTMLStatus(\"WiFi\");' onclick='return confirmExit()'>"+I18N("j", "Wireless(Wi-Fi)")+"</a></li>";
		menu 		+= "			<li><a href='javascript:CheckHTMLStatus(\"Network\");' onclick='return confirmExit()'>"+I18N("j", "Network(LAN)")+"</a></li>";
		menu 		+= "			<li><a href='javascript:CheckHTMLStatus(\"SharePort\");' onclick='return confirmExit()'>"+I18N("j", "SharePort")+"</a></li>";
		menu 		+= "			<li><a href='javascript:CheckHTMLStatus(\"Mydlink\");' onclick='return confirmExit()'>"+I18N("j", "mydlink")+"</a></li>";
		menu 		+= "		</ul>";
		menu 		+= "	</li>";
	menu 		+= "	<li class='parent' onmouseover='this.className=\"parentOn\"' onmouseout='this.className=\"parent\"'><a id='menu_Advanced' href='#'>"+I18N("j", "Features")+"</a>";
		menu 		+= "		<ul>";
		menu 		+= "			<li><a href='javascript:CheckHTMLStatus(\"QoS\");' onclick='return confirmExit()'>"+I18N("j", "QoS Engine")+"</a></li>";
		menu 		+= "			<li><a href='javascript:CheckHTMLStatus(\"Firewall\");' onclick='return confirmExit()'>"+I18N("j", "Firewall")+"</a></li>";
		menu 		+= "			<li><a href='javascript:CheckHTMLStatus(\"PortForwarding\");' onclick='return confirmExit()'>"+I18N("j", "Port Forwarding")+"</a></li>";
		menu 		+= "			<li><a href='javascript:CheckHTMLStatus(\"WebsiteFilter\");' onclick='return confirmExit()'>"+I18N("j", "Website Filter")+"</a></li>";
		menu 		+= "			<li><a href='javascript:CheckHTMLStatus(\"StaticRoute\");' onclick='return confirmExit()'>"+I18N("j", "Static Route")+"</a></li>";
		menu 		+= "			<li><a href='javascript:CheckHTMLStatus(\"DynamicDNS\");' onclick='return confirmExit()'>"+I18N("j", "Dynamic DNS")+"</a></li>";
		menu 		+= "			<li><a href='javascript:CheckHTMLStatus(\"VPN\");' onclick='return confirmExit()'>"+I18N("j", "Quick VPN")+"</a></li>";
		menu 		+= "		</ul>";
		menu 		+= "	</li>";
		menu 		+= "	<li class='parent' onmouseover='this.className=\"parentOn\"' onmouseout='this.className=\"parent\"'><a id='menu_Management' href='#'>"+I18N("j", "Management")+"</a>";
		menu 		+= "		<ul>";
		menu 		+= "			<li><a href='javascript:CheckHTMLStatus(\"Time\");' onclick='return confirmExit()'>"+I18N("j", "Time & Schedule")+"</a></li>";
		menu 		+= "			<li><a href='javascript:CheckHTMLStatus(\"SystemLog\");' onclick='return confirmExit()'>"+I18N("j", "System Log")+"</a></li>";
	menu 		+= "			<li><a href='javascript:CheckHTMLStatus(\"Admin\");' onclick='return confirmExit()'>"+I18N("j", "System Admin")+"</a></li>";
		menu 		+= "			<li><a href='javascript:CheckHTMLStatus(\"UpdateFirmware\");' onclick='return confirmExit()'>"+I18N("j", "Upgrade")+"</a></li>";
		menu 		+= "			<li><a href='javascript:CheckHTMLStatus(\"Statistics\");' onclick='return confirmExit()'>"+I18N("j", "Statistics")+"</a></li>";
		menu 		+= "		</ul>";
		menu 		+= "	</li>";
		menu 		+= "</ul>";
	}
	document.getElementById("menu").innerHTML = menu;
}

function CheckClickStatus(menuId)
{
	switch (menuId)
	{
		case "m_Settings":
			if (menu_Check_Settings == 0)	{	document.getElementById("m_Settings").className = "parent";	menu_Check_Settings = 1;	}
			else	{	document.getElementById("m_Settings").className = "parentOn";	menu_Check_Settings = 0;	}
			break;
		case "m_Advanced":
			if (menu_Check_Advanced == 0)	{	document.getElementById("m_Advanced").className = "parent";	menu_Check_Advanced = 1;	}
			else	{	document.getElementById("m_Advanced").className = "parentOn";	menu_Check_Advanced = 0;	}
			break;
		case "m_Management":
			if (menu_Check_Management == 0)	{	document.getElementById("m_Management").className = "parent";	menu_Check_Management = 1;	}
			else	{	document.getElementById("m_Management").className = "parentOn";	menu_Check_Management = 0;	}
			break;
	}
}
function setMenu(menuId)
{
	if (localStorage.getItem('language') == "ru-ru")	{	document.getElementById(menuId).style.background = "url(./image/navigation_bg6.gif?v=20160226193446) right top no-repeat";	}
	else	{	document.getElementById(menuId).style.background = "url(./image/navigation_bg5.gif?v=20160226193446) right top no-repeat";	}
}

function CheckHTMLStatus(URLString)
{
	if (URLString != "")
	{
		$.ajax({
			"cache" : false,
			"url" : URLString + ".html",
			"timeout" : 5000,
			"type" : "GET",
			"error" : function() { document.getElementById("DetectRouterConnection").style.display = "inline"; },
			"success" : function(data) { document.getElementById("DetectRouterConnection").style.display = "none"; self.location.href = URLString + ".html"; }
		});
	}
	else
	{
		$.ajax({
			"cache" : false,
			"url" : "./js/CheckConnection",
			"timeout" : 5000,
			"type" : "GET",
			"error" : function() { document.getElementById("DetectRouterConnection").style.display = "inline"; },
			"success" : function(data) { document.getElementById("DetectRouterConnection").style.display = "none"; }
		});
	}
}