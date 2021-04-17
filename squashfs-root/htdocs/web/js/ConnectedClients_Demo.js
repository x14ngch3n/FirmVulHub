var array2Dv;
var array2DvMF;
var array2DvNM;
var Total_Clients = 0;
var Total_MacFilterList = 0;
var Total_Device = 0;
var Current_MacFilterList = 0;
var Time_ClientList;
var Get__MACAddress;
var Get__DeviceName;
var Get__NickName;
var Get__ReserveIP;
var Get__SetNickNameMark;
var SetNickName;
var Check_Flag;
var Client_Type = "Host";
var tmpXML_SetClientInfo;
var tmpXML_SetMACFilters2;
var IPCam_address = "";

///* ############################## For Demo ############################## *///
/**/	var Time_ClientUpdate;												/**/
/**/	var Time_ClientSamrtPlugWatt;										/**/
/**/	var NowAudioMute = "";												/**/
/**/	var NowSmartPlugSW = "";											/**/
/**/	function UpdateClientInfo()											/**/
/**/	{																	/**/
/**/		var xml_GetClientinfo2 = HNAP.GetXMLAsync("GetClientInfoStatusDemo", null, "GetValue", function(xml)		{	}	);
/**/		Time_ClientUpdate = window.clearInterval(Time_ClientUpdate);	/**/
/**/		Time_ClientUpdate = setTimeout("UpdateClientInfo()", 2000);		/**/
/**/	}																	/**/
///* ###################################################################### *///

function PreGetHNAP()	{	HNAP.GetXMLAsync("SetClientInfoDemo", null, "GetXML", function(xml)		{	PreGetHNAP_2(xml)	});	}
function PreGetHNAP_2(result_xml)	{	if (result_xml != null)	{	tmpXML_SetClientInfo = result_xml;	HNAP.GetXMLAsync("SetMACFilters2", null, "GetXML", function(xml)	{	PreGetHNAP_3(xml)	});}	}
function PreGetHNAP_3(result_xml)	{	if (result_xml != null)	{	tmpXML_SetMACFilters2 = result_xml;	}	}
function Get_ClientInfo(c_type)
{
	Client_Type = c_type;
	Time_GetConnectionUpTime = window.clearInterval(Time_GetConnectionUpTime);
	Time_GetConnectionUpTime_IPv6 = window.clearInterval(Time_GetConnectionUpTime_IPv6);
	HNAP.GetXMLAsync("GetMultipleHNAPs", null, "GetXML", function(xml)	{	GetResult_CI(xml)	});
}
function GetResult_CI(result_xml)
{
	if (result_xml != null)
	{
		result_xml.Set("GetMultipleHNAPs/GetClientInfoDemo");
		result_xml.Set("GetMultipleHNAPs/GetMACFilters2");
		HNAP.SetXMLAsync("GetMultipleHNAPs", result_xml, function(xml)	{	GetResult2_CI(xml);	});
	}
	else	{	if (DebugMode == 1)	{	alert("[!!GetXML Error!!] Function: GetResult_CI");	}	}
}
function GetResult2_CI(result_xml)
{
	var GetResult2_CI = result_xml.Get("GetMultipleHNAPsResponse/GetMultipleHNAPsResult");
	if (GetResult2_CI == "OK")
	{
		var count = 0, CheckCount = 0, TotalCount = 0;
		Total_Clients = result_xml.Get("GetMultipleHNAPsResponse/GetClientInfoDemoResponse/ClientInfoLists/ClientInfo#");
		Total_MacFilterList = result_xml.Get("GetMultipleHNAPsResponse/GetMACFilters2Response/MACList/MACInfo#");
		Total_Device = Total_Clients + Total_MacFilterList;
		///* ############################## For Demo ##############################	//*/
		/**/	array2Dv = new Array2DVar(Total_Device, 20);						/**/
		/**/	// array2Dv = new Array2DVar(Total_Device, 11);						/**/
		///* ######################################################################	//*/
		if (Client_Type == "Host")
		{
			for (var i = 1; i <= Total_Clients; i ++)
			{
				var GetClientType = result_xml.Get("GetMultipleHNAPsResponse/GetClientInfoDemoResponse/ClientInfoLists/ClientInfo:" + i + "/Type");
				if (GetClientType == "LAN" || GetClientType == "WiFi_2.4G" || GetClientType == "WiFi_5G")
				{
					array2Dv[count][10] = result_xml.Get("GetMultipleHNAPsResponse/GetClientInfoDemoResponse/ClientInfoLists/ClientInfo:" + i + "/Type");
					array2Dv[count][0] = result_xml.Get("GetMultipleHNAPsResponse/GetClientInfoDemoResponse/ClientInfoLists/ClientInfo:" + i + "/DeviceName");
					array2Dv[count][1] = result_xml.Get("GetMultipleHNAPsResponse/GetClientInfoDemoResponse/ClientInfoLists/ClientInfo:" + i + "/MacAddress");
					array2Dv[count][2] = result_xml.Get("GetMultipleHNAPsResponse/GetClientInfoDemoResponse/ClientInfoLists/ClientInfo:" + i + "/IPv4Address");
					array2Dv[count][3] = result_xml.Get("GetMultipleHNAPsResponse/GetClientInfoDemoResponse/ClientInfoLists/ClientInfo:" + i + "/IPv6Address");
					array2Dv[count][9] = result_xml.Get("GetMultipleHNAPsResponse/GetClientInfoDemoResponse/ClientInfoLists/ClientInfo:" + i + "/NickName");
					array2Dv[count][5] = result_xml.Get("GetMultipleHNAPsResponse/GetClientInfoDemoResponse/ClientInfoLists/ClientInfo:" + i + "/ReserveIP");
					
					///* ################################################################################ For Demo ################################################################################	//*/
					/**/	array2Dv[count][12] = result_xml.Get("GetMultipleHNAPsResponse/GetClientInfoDemoResponse/ClientInfoLists/ClientInfo:" + i + "/SupportedAction/Audio");					/**/
					/**/	array2Dv[count][13] = result_xml.Get("GetMultipleHNAPsResponse/GetClientInfoDemoResponse/ClientInfoLists/ClientInfo:" + i + "/SupportedAction/Audio_DLNA");				/**/
					/**/	array2Dv[count][14] = result_xml.Get("GetMultipleHNAPsResponse/GetClientInfoDemoResponse/ClientInfoLists/ClientInfo:" + i + "/SupportedAction/Audio_AirPlay");			/**/
					/**/	array2Dv[count][15] = result_xml.Get("GetMultipleHNAPsResponse/GetClientInfoDemoResponse/ClientInfoLists/ClientInfo:" + i + "/SupportedAction/Audio_Mute");				/**/
					/**/	array2Dv[count][16] = result_xml.Get("GetMultipleHNAPsResponse/GetClientInfoDemoResponse/ClientInfoLists/ClientInfo:" + i + "/SupportedAction/SmartPlug");				/**/
					/**/	array2Dv[count][17] = result_xml.Get("GetMultipleHNAPsResponse/GetClientInfoDemoResponse/ClientInfoLists/ClientInfo:" + i + "/SupportedAction/SmartPlug_Watt");			/**/
					/**/	array2Dv[count][18] = result_xml.Get("GetMultipleHNAPsResponse/GetClientInfoDemoResponse/ClientInfoLists/ClientInfo:" + i + "/SupportedAction/SmartPlug_SW");			/**/
					/**/	array2Dv[count][19] = result_xml.Get("GetMultipleHNAPsResponse/GetClientInfoDemoResponse/ClientInfoLists/ClientInfo:" + i + "/SupportedAction/SmartPlug_Name");			/**/
					///* ##########################################################################################################################################################################	//*/
					
					var split_ClientMacAddress = array2Dv[count][1].split(/[\s:]+/);
					var get_SplitClientMacAddress1 = split_ClientMacAddress[split_ClientMacAddress.length - 6];
					var get_SplitClientMacAddress2 = split_ClientMacAddress[split_ClientMacAddress.length - 5];
					var get_SplitClientMacAddress3 = split_ClientMacAddress[split_ClientMacAddress.length - 4];
					var FullStr_ClientMacAddress = get_SplitClientMacAddress1 + ":" + get_SplitClientMacAddress2 + ":" + get_SplitClientMacAddress3;
					var Str_toUpperCase = FullStr_ClientMacAddress.toUpperCase();
					
					///* ######################################## For Demo ########################################	//*/
					/**/	var CheckDeviceType = array2Dv[count][0];												/**/
					/**/	if (CheckDeviceType.search("DSP") != -1)		{	array2Dv[count][11] = "DSP";	}	/**/
					/**/	else if (CheckDeviceType.search("DNS") != -1)	{	array2Dv[count][11] = "DNS";	}	/**/
					/**/	else if (CheckDeviceType.search("DCS") != -1)	{	array2Dv[count][11] = "DCS";	}	/**/
					/**/	else if (CheckDeviceType.search("DCH") != -1)	{	array2Dv[count][11] = "DCH";	}	/**/
					/**/	else											{	array2Dv[count][11] = "None";	}	/**/
					///* ##########################################################################################	//*/
					
					if (allText.match(Str_toUpperCase) == Str_toUpperCase)
					{
						var StrIndexOfNumber = allText.indexOf(Str_toUpperCase) + 9;
						var StrIndexOfNumber_ToString = allText.slice(StrIndexOfNumber, StrIndexOfNumber + 16);
						array2Dv[count][4] = StrIndexOfNumber_ToString;
					}
					else	{	array2Dv[count][4] = "Unknown Vendor";	}
					if (array2Dv[count][3] == "")	{	array2Dv[count][3] = "";	}
					
					count ++;
				}
			}
		}
		if (Client_Type == "Guest")
		{
			for (var i = 1; i <= Total_Clients; i ++)
			{
				var GetClientType = result_xml.Get("GetMultipleHNAPsResponse/GetClientInfoDemoResponse/ClientInfoLists/ClientInfo:" + i + "/Type");
				if (GetClientType == "WiFi_2.4G_Guest" || GetClientType == "WiFi_5G_Guest")
				{
					array2Dv[count][10] = result_xml.Get("GetMultipleHNAPsResponse/GetClientInfoDemoResponse/ClientInfoLists/ClientInfo:" + i + "/Type");
					array2Dv[count][0] = result_xml.Get("GetMultipleHNAPsResponse/GetClientInfoDemoResponse/ClientInfoLists/ClientInfo:" + i + "/DeviceName");
					array2Dv[count][1] = result_xml.Get("GetMultipleHNAPsResponse/GetClientInfoDemoResponse/ClientInfoLists/ClientInfo:" + i + "/MacAddress");
					array2Dv[count][2] = result_xml.Get("GetMultipleHNAPsResponse/GetClientInfoDemoResponse/ClientInfoLists/ClientInfo:" + i + "/IPv4Address");
					array2Dv[count][3] = result_xml.Get("GetMultipleHNAPsResponse/GetClientInfoDemoResponse/ClientInfoLists/ClientInfo:" + i + "/IPv6Address");
					array2Dv[count][9] = result_xml.Get("GetMultipleHNAPsResponse/GetClientInfoDemoResponse/ClientInfoLists/ClientInfo:" + i + "/NickName");
					array2Dv[count][5] = result_xml.Get("GetMultipleHNAPsResponse/GetClientInfoDemoResponse/ClientInfoLists/ClientInfo:" + i + "/ReserveIP");
					
					///* ################################################################################ For Demo ################################################################################	//*/
					/**/	array2Dv[count][12] = result_xml.Get("GetMultipleHNAPsResponse/GetClientInfoDemoResponse/ClientInfoLists/ClientInfo:" + i + "/SupportedAction/Audio");					/**/
					/**/	array2Dv[count][13] = result_xml.Get("GetMultipleHNAPsResponse/GetClientInfoDemoResponse/ClientInfoLists/ClientInfo:" + i + "/SupportedAction/Audio_DLNA");				/**/
					/**/	array2Dv[count][14] = result_xml.Get("GetMultipleHNAPsResponse/GetClientInfoDemoResponse/ClientInfoLists/ClientInfo:" + i + "/SupportedAction/Audio_AirPlay");			/**/
					/**/	array2Dv[count][15] = result_xml.Get("GetMultipleHNAPsResponse/GetClientInfoDemoResponse/ClientInfoLists/ClientInfo:" + i + "/SupportedAction/Audio_Mute");				/**/
					/**/	array2Dv[count][16] = result_xml.Get("GetMultipleHNAPsResponse/GetClientInfoDemoResponse/ClientInfoLists/ClientInfo:" + i + "/SupportedAction/SmartPlug");				/**/
					/**/	array2Dv[count][17] = result_xml.Get("GetMultipleHNAPsResponse/GetClientInfoDemoResponse/ClientInfoLists/ClientInfo:" + i + "/SupportedAction/SmartPlug_Watt");			/**/
					/**/	array2Dv[count][18] = result_xml.Get("GetMultipleHNAPsResponse/GetClientInfoDemoResponse/ClientInfoLists/ClientInfo:" + i + "/SupportedAction/SmartPlug_SW");			/**/
					/**/	array2Dv[count][19] = result_xml.Get("GetMultipleHNAPsResponse/GetClientInfoDemoResponse/ClientInfoLists/ClientInfo:" + i + "/SupportedAction/SmartPlug_Name");			/**/
					///* ##########################################################################################################################################################################	//*/
					
					var split_ClientMacAddress = array2Dv[count][1].split(/[\s:]+/);
					var get_SplitClientMacAddress1 = split_ClientMacAddress[split_ClientMacAddress.length - 6];
					var get_SplitClientMacAddress2 = split_ClientMacAddress[split_ClientMacAddress.length - 5];
					var get_SplitClientMacAddress3 = split_ClientMacAddress[split_ClientMacAddress.length - 4];
					var FullStr_ClientMacAddress = get_SplitClientMacAddress1 + ":" + get_SplitClientMacAddress2 + ":" + get_SplitClientMacAddress3;
					var Str_toUpperCase = FullStr_ClientMacAddress.toUpperCase();
					
					///* ######################################## For Demo ########################################	//*/
					/**/	var CheckDeviceType = array2Dv[count][0];												/**/
					/**/	if (CheckDeviceType.search("DSP") != -1)		{	array2Dv[count][11] = "DSP";	}	/**/
					/**/	else if (CheckDeviceType.search("DNS") != -1)	{	array2Dv[count][11] = "DNS";	}	/**/
					/**/	else if (CheckDeviceType.search("DCS") != -1)	{	array2Dv[count][11] = "DCS";	}	/**/
					/**/	else if (CheckDeviceType.search("DCH") != -1)	{	array2Dv[count][11] = "DCH";	}	/**/
					/**/	else											{	array2Dv[count][11] = "None";	}	/**/
					///* ##########################################################################################	//*/
					
					if (allText.match(Str_toUpperCase) == Str_toUpperCase)
					{
						var StrIndexOfNumber = allText.indexOf(Str_toUpperCase) + 9;
						var StrIndexOfNumber_ToString = allText.slice(StrIndexOfNumber, StrIndexOfNumber + 16);
						array2Dv[count][4] = StrIndexOfNumber_ToString;
					}
					else	{	array2Dv[count][4] = "Unknown Vendor";	}
					if (array2Dv[count][3] == "")	{	array2Dv[count][3] = "";	}
					
					count ++;
				}
			}
		}
		
		if (Total_MacFilterList >= 1)
		{
			for (var j = 0; j < Total_Device; j ++)
			{
				for (var k = 1; k <= Total_MacFilterList; k ++)
				{
					var tmpMAC = result_xml.Get("GetMultipleHNAPsResponse/GetMACFilters2Response/MACList/MACInfo:" + k + "/MacAddress");
					if (tmpMAC == array2Dv[j][1])
					{
						if (array2Dv[j][10] == "LAN")
						{
							///* #################### For Demo ####################	//*/
							/**/	switch (array2Dv[j][11])						/**/
							/**/	{												/**/
							/**/		case "DCH":									/**/
							/**/		case "DSP":									/**/
							/**/		case "DNS":									/**/
							/**/		case "DCS":									/**/
							/**/		case "None":								/**/
							/**/			array2Dv[j][6] = I18N("j", "Blocked");	/**/
							/**/			array2Dv[j][7] = "#FF0000";				/**/
							/**/			array2Dv[j][8] = "link_IconX_Block";	/**/
							/**/			break;									/**/
							/**/	}												/**/
							///* ##################################################	//*/
							// array2Dv[j][6] = I18N("j", "Blocked");
							// array2Dv[j][7] = "#FF0000";
							// array2Dv[j][8] = "link_IconE_Block";
						}
						else if (array2Dv[j][10] == "WiFi_2.4G" || array2Dv[j][10] == "WiFi_5G" || array2Dv[j][10] == "WiFi_2.4G_Guest" || array2Dv[j][10] == "WiFi_5G_Guest")
						{
							///* #################### For Demo ####################	//*/
							/**/	switch (array2Dv[j][11])						/**/
							/**/	{												/**/
							/**/		case "DCH":									/**/
							/**/		case "DSP":									/**/
							/**/		case "DNS":									/**/
							/**/		case "DCS":									/**/
							/**/		case "None":								/**/
							/**/			array2Dv[j][6] = I18N("j", "Blocked");	/**/
							/**/			array2Dv[j][7] = "#FF0000";				/**/
							/**/			array2Dv[j][8] = "link_IconX_Block";	/**/
							/**/			break;									/**/
							/**/	}												/**/
							///* ##################################################	//*/
							// array2Dv[j][6] = I18N("j", "Blocked");
							// array2Dv[j][7] = "#FF0000";
							// array2Dv[j][8] = "link_IconW_Block";
						}
						break;
					}
					else
					{
						if (array2Dv[j][10] == "LAN")
						{
							///* #################### For Demo ####################	//*/
							/**/	switch (array2Dv[j][11])						/**/
							/**/	{												/**/
							/**/		case "DCH":									/**/
							/**/			array2Dv[j][6] = I18N("j", "Allowed");	/**/
							/**/			array2Dv[j][7] = "#000000";				/**/
							/**/			array2Dv[j][8] = "link_IconDCH_Allow";	/**/
							/**/			break;									/**/
							/**/		case "DSP":									/**/
							/**/			array2Dv[j][6] = I18N("j", "Allowed");	/**/
							/**/			array2Dv[j][7] = "#000000";				/**/
							/**/			array2Dv[j][8] = "link_IconDSP_Allow";	/**/
							/**/			break;									/**/
							/**/		case "DNS":									/**/
							/**/			array2Dv[j][6] = I18N("j", "Allowed");	/**/
							/**/			array2Dv[j][7] = "#000000";				/**/
							/**/			array2Dv[j][8] = "link_IconDNS_Allow";	/**/
							/**/			break;									/**/
							/**/		case "DCS":									/**/
							/**/			array2Dv[j][6] = I18N("j", "Allowed");	/**/
							/**/			array2Dv[j][7] = "#000000";				/**/
							/**/			array2Dv[j][8] = "link_IconDCS_Allow";	/**/
							/**/			break;									/**/
							/**/		case "None":								/**/
							/**/			array2Dv[j][6] = I18N("j", "Allowed");	/**/
							/**/			array2Dv[j][7] = "#000000";				/**/
							/**/			array2Dv[j][8] = "link_IconE_Allow";	/**/
							/**/			break;									/**/
							/**/	}												/**/
							///* ##################################################	//*/
							// array2Dv[j][6] = I18N("j", "Allowed");
							// array2Dv[j][7] = "#000000";
							// array2Dv[j][8] = "link_IconE_Allow";
						}
						else if (array2Dv[j][10] == "WiFi_2.4G" || array2Dv[j][10] == "WiFi_5G" || array2Dv[j][10] == "WiFi_2.4G_Guest" || array2Dv[j][10] == "WiFi_5G_Guest")
						{
							///* #################### For Demo ####################	//*/
							/**/	switch (array2Dv[j][11])						/**/
							/**/	{												/**/
							/**/		case "DCH":									/**/
							/**/			array2Dv[j][6] = I18N("j", "Allowed");	/**/
							/**/			array2Dv[j][7] = "#000000";				/**/
							/**/			array2Dv[j][8] = "link_IconDCH_Allow";	/**/
							/**/			break;									/**/
							/**/		case "DSP":									/**/
							/**/			array2Dv[j][6] = I18N("j", "Allowed");	/**/
							/**/			array2Dv[j][7] = "#000000";				/**/
							/**/			array2Dv[j][8] = "link_IconDSP_Allow";	/**/
							/**/			break;									/**/
							/**/		case "DNS":									/**/
							/**/			array2Dv[j][6] = I18N("j", "Allowed");	/**/
							/**/			array2Dv[j][7] = "#000000";				/**/
							/**/			array2Dv[j][8] = "link_IconDNS_Allow";	/**/
							/**/			break;									/**/
							/**/		case "DCS":									/**/
							/**/			array2Dv[j][6] = I18N("j", "Allowed");	/**/
							/**/			array2Dv[j][7] = "#000000";				/**/
							/**/			array2Dv[j][8] = "link_IconDCS_Allow";	/**/
							/**/			break;									/**/
							/**/		case "None":								/**/
							/**/			array2Dv[j][6] = I18N("j", "Allowed");	/**/
							/**/			array2Dv[j][7] = "#000000";				/**/
							/**/			array2Dv[j][8] = "link_IconW_Allow";	/**/
							/**/			break;									/**/
							/**/	}												/**/
							///* ##################################################	//*/
							// array2Dv[j][6] = I18N("j", "Allowed");
							// array2Dv[j][7] = "#000000";
							// array2Dv[j][8] = "link_IconW_Allow";
						}
					}
				}
			}
		}
		else
		{
			for (var j = 0; j < Total_Device; j ++)
			{
				if (array2Dv[j][10] == "LAN")
				{
					///* #################### For Demo ####################	//*/
					/**/	switch (array2Dv[j][11])						/**/
					/**/	{												/**/
					/**/		case "DCH":									/**/
					/**/			array2Dv[j][6] = I18N("j", "Allowed");	/**/
					/**/			array2Dv[j][7] = "#000000";				/**/
					/**/			array2Dv[j][8] = "link_IconDCH_Allow";	/**/
					/**/			break;									/**/
					/**/		case "DSP":									/**/
					/**/			array2Dv[j][6] = I18N("j", "Allowed");	/**/
					/**/			array2Dv[j][7] = "#000000";				/**/
					/**/			array2Dv[j][8] = "link_IconDSP_Allow";	/**/
					/**/			break;									/**/
					/**/		case "DNS":									/**/
					/**/			array2Dv[j][6] = I18N("j", "Allowed");	/**/
					/**/			array2Dv[j][7] = "#000000";				/**/
					/**/			array2Dv[j][8] = "link_IconDNS_Allow";	/**/
					/**/			break;									/**/
					/**/		case "DCS":									/**/
					/**/			array2Dv[j][6] = I18N("j", "Allowed");	/**/
					/**/			array2Dv[j][7] = "#000000";				/**/
					/**/			array2Dv[j][8] = "link_IconDCS_Allow";	/**/
					/**/			break;									/**/
					/**/		case "None":								/**/
					/**/			array2Dv[j][6] = I18N("j", "Allowed");	/**/
					/**/			array2Dv[j][7] = "#000000";				/**/
					/**/			array2Dv[j][8] = "link_IconE_Allow";	/**/
					/**/			break;									/**/
					/**/	}												/**/
					///* ##################################################	//*/
					// array2Dv[j][6] = I18N("j", "Allowed");
					// array2Dv[j][7] = "#000000";
					// array2Dv[j][8] = "link_IconE_Allow";
				}
				else if (array2Dv[j][10] == "WiFi_2.4G" || array2Dv[j][10] == "WiFi_5G" || array2Dv[j][10] == "WiFi_2.4G_Guest" || array2Dv[j][10] == "WiFi_5G_Guest")
				{
					///* #################### For Demo ####################	//*/
					/**/	switch (array2Dv[j][11])						/**/
					/**/	{												/**/
					/**/		case "DCH":									/**/
					/**/			array2Dv[j][6] = I18N("j", "Allowed");	/**/
					/**/			array2Dv[j][7] = "#000000";				/**/
					/**/			array2Dv[j][8] = "link_IconDCH_Allow";	/**/
					/**/			break;									/**/
					/**/		case "DSP":									/**/
					/**/			array2Dv[j][6] = I18N("j", "Allowed");	/**/
					/**/			array2Dv[j][7] = "#000000";				/**/
					/**/			array2Dv[j][8] = "link_IconDSP_Allow";	/**/
					/**/			break;									/**/
					/**/		case "DNS":									/**/
					/**/			array2Dv[j][6] = I18N("j", "Allowed");	/**/
					/**/			array2Dv[j][7] = "#000000";				/**/
					/**/			array2Dv[j][8] = "link_IconDNS_Allow";	/**/
					/**/			break;									/**/
					/**/		case "DCS":									/**/
					/**/			array2Dv[j][6] = I18N("j", "Allowed");	/**/
					/**/			array2Dv[j][7] = "#000000";				/**/
					/**/			array2Dv[j][8] = "link_IconDCS_Allow";	/**/
					/**/			break;									/**/
					/**/		case "None":								/**/
					/**/			array2Dv[j][6] = I18N("j", "Allowed");	/**/
					/**/			array2Dv[j][7] = "#000000";				/**/
					/**/			array2Dv[j][8] = "link_IconW_Allow";	/**/
					/**/			break;									/**/
					/**/	}												/**/
					///* ##################################################	//*/
					// array2Dv[j][6] = I18N("j", "Allowed");
					// array2Dv[j][7] = "#000000";
					// array2Dv[j][8] = "link_IconW_Allow";
				}
			}
		}
/*		
		if (Total_MacFilterList >= 1)
		{
			for (var i = 1; i <= Total_MacFilterList; i ++)
			{
				var Flag_check = 0;
				var MFDevice = result_xml.Get("GetMultipleHNAPsResponse/GetMACFilters2Response/MACList/MACInfo:" + i + "/DeviceName");
				var MFMAC = result_xml.Get("GetMultipleHNAPsResponse/GetMACFilters2Response/MACList/MACInfo:" + i + "/MacAddress");
				for (var i = 0; i < count; i ++)
				{
					var tmpMAC = MFMAC;
					if (tmpMAC == array2Dv[i][1])	{	Flag_check = 1;	}
				}
				
				if (Flag_check != 1)
				{
					array2Dv[count][0] = MFDevice;
					array2Dv[count][1] = MFMAC;
					array2Dv[count][2] = "";
					array2Dv[count][3] = "";
					array2Dv[count][4] = "";
					array2Dv[count][5] = "";
					array2Dv[count][6] = I18N("j", "Blocked");
					array2Dv[count][7] = "#FF0000";
					array2Dv[count][8] = "link_IconX_Block";
					array2Dv[count][9] = "";
					array2Dv[count][10] = "";
					count ++;
				}
				CheckCount ++;
			}
		}*/
		ShowClient_List(count);
	}
	else	{	if (DebugMode == 1)	{	alert("[!!GetXML Error!!] Function: GetResult2_CI");	}	}
}
function ShowClient_List(val)
{
	var tmp = "";
	var print_Count = 0;
	var TCWithMF = val;
	tmp = "<table class=\"block\" border=\"0\" ondragstart=\"return false\" onselectstart=\"return false\" width=\"900px\">";
	tmp += "<tbody>";
	tmp += "<tr>";
	
	if (val != 0)
	{
		document.getElementById("Client_Info").style.display = "none";
		document.getElementById("Client_Group").style.display = "table-row";
		
		for (var i = 1; i <= TCWithMF; i ++)
		{
			var Get_ClientName = array2Dv[print_Count][0];
			var Get_ClientMacAddress = array2Dv[print_Count][1];
			var Get_ClientIPV4Address = array2Dv[print_Count][2];
			var Get_ClientIPV6Address = array2Dv[print_Count][3];
			var Get_ClientVendor = array2Dv[print_Count][4];
			// var Get_ClientReservationIP = array2Dv[print_Count][5];
			var Get_ClientMacFilter = array2Dv[print_Count][6];
			var Get_FontColor = array2Dv[print_Count][7];
			var Get_CSSBackGround = array2Dv[print_Count][8];
			var Get_ClientNickName = array2Dv[print_Count][9];
			
			///* ############################## For Demo ##############################	//*/
			/**/	var Get_ClientDeviceType = array2Dv[print_Count][11];				/**/
			/**/	var Get_Audio = array2Dv[print_Count][12];							/**/
			/**/	var Get_AudioDLNA = "true";		//array2Dv[print_Count][13];		/**/
			/**/	var Get_AudioAirPlay = "true";	//array2Dv[print_Count][14];		/**/
			/**/	var Get_AudioMute = array2Dv[print_Count][15];						/**/
			/**/	var Get_SmartPlug = array2Dv[print_Count][16];						/**/
			/**/	var Get_SmartPlugWatt = array2Dv[print_Count][17];					/**/
			/**/	var Get_SmartPlugSW = array2Dv[print_Count][18];					/**/
			/**/	var Get_SmartPlugName = array2Dv[print_Count][19];					/**/
			///* #####################################################################	//*/
			
			if (typeof(Get_ClientMacAddress) == "undefined" || Get_ClientMacAddress.length == 0)	{	break;	}
			if (Get_ClientName == 0)		{	Get_ClientName = "Unknown";	}
			if (Get_ClientNickName != 0)	{	Get_ClientName = Get_ClientNickName;	}
			
			if (i % 3 != 0)
			{
				ClientNumber = i;
				
				///* #################################################################################################### For Demo ####################################################################################################	//*/
				/**/	switch (Get_ClientDeviceType)
				/**/	{
				/**/		case "DCH":
				/**/			tmp += "<td>";
				/**/			tmp += "<div class =\"client_DeviceTag\" style=\"cursor:pointer\" onclick=\"changeClass(this);client_DeviceConfig(" + ClientNumber + ")\">";
				/**/			tmp += "<div class =\"front side\">";
				/**/			tmp += "<div class =\"" + Get_CSSBackGround + "\"></div>";
				/**/			tmp += "<div class =\"client_Info\">";
				/**/			tmp += "<div class =\"client_Name\">" + Get_ClientName + "</div>";
				/**/			tmp += "<div class =\"client_EditImage\" onclick=\"event.cancelBubble=true;client_EditMember(" + ClientNumber + ")\" style=\"cursor:pointer\"></div>";
				/**/			tmp += "<div class =\"client_Vender\">" + Get_ClientVendor + "</div>";
				/**/			tmp += "<div class =\"client_IPv4Address\">" + Get_ClientIPV4Address + "</div>";
				/**/			tmp += "<div class =\"client_IPv6Address\">" + Get_ClientIPV6Address + "</div>";
				/**/			if (Get_ClientMacFilter == "Allowed")	{	tmp += "<div class =\"client_Access\">" + I18N("j", "Access") + ": " + "<font color=\"" + Get_FontColor + "\">" +Get_ClientMacFilter + "</font></div>";	}
				/**/			else									{	tmp += "<div class =\"client_Access\">" + I18N("j", "Access") + ": " + "<B><font color=\"" + Get_FontColor + "\">" +Get_ClientMacFilter + "</font><B></div>";	}
				/**/			tmp += "</div>";
				/**/			tmp += "</div>";
				/**/			tmp += "<div class =\"back side\">";
				/**/			if (Get_AudioDLNA == "false" && Get_AudioAirPlay == "false")	{	tmp += "<div class =\"client_AudioSwitch_disable\" onclick=\"event.cancelBubble=true;AudioSwitchBtn(this," + ClientNumber + ")\"></div>";	}
				/**/			else
				/**/			{
				/**/				if (Get_AudioMute == "false" || Get_AudioMute == "")	{	tmp += "<div class =\"client_AudioSwitch\" onclick=\"event.cancelBubble=true;AudioSwitchBtn(this," + ClientNumber + ", 'false'" + ")\"></div>";		}
				/**/				else							{	tmp += "<div class =\"client_AudioSwitch_off\" onclick=\"event.cancelBubble=true;AudioSwitchBtn(this," + ClientNumber + ", 'true'" + ")\"></div>";	}
				/**/			}
				/**/			tmp += "<div class =\"client_AccessPointInfo\">";
				/**/			tmp += "<div class =\"client_AccessPointName\">" + Get_ClientName + "</div>";
				/**/			tmp += "<div class =\"client_AccessPointFunction\">" + "Audio Renderer" + ":" + "</div>";
				/**/			if (Get_AudioDLNA == "true" && Get_AudioAirPlay == "true")	{	tmp += "<div id=\"enableAudioRenderer\" class=\"checkbox_on\" style=\"position:relative;top:15px;\" onclick=\"event.cancelBubble=true;btnClickEvent(this, " + ClientNumber + ")\"><input type=\"checkbox\" name=\"enableAudioRenderer\" id=\"enableAudioRenderer_ck\" checked></input></div>";	}
				/**/			else	{	tmp += "<div id=\"enableAudioRenderer\" class=\"checkbox_off\" style=\"position:relative;top:15px;\" onclick=\"event.cancelBubble=true;btnClickEvent(this, " + ClientNumber + ")\"><input type=\"checkbox\" name=\"enableAudioRenderer\" id=\"enableAudioRenderer_ck\"></input></div>";	}
				/**/			tmp += "</div>";
				/**/			tmp += "</div>";
				/**/			tmp += "</div>";
				/**/			tmp += "</div>";
				/**/			tmp += "</td>";
				/**/			break;
				/**/		case "DNS":
				/**/			tmp += "<td>";
				/**/			tmp += "<div class =\"client_DeviceTag\" onclick=\"openWebUI(" + ClientNumber + ")\" style=\"cursor:pointer\">";
				/**/			tmp += "<div class =\"front\">";
				/**/			tmp += "<div class =\"" + Get_CSSBackGround + "\"></div>";
				/**/			tmp += "<div class =\"client_Info\">";
				/**/			tmp += "<div class =\"client_Name\">" + Get_ClientName + "</div>";
				/**/			tmp += "<div class =\"client_EditImage\" onclick=\"event.cancelBubble=true;client_EditMember(" + ClientNumber + ")\" style=\"cursor:pointer\"></div>";
				/**/			tmp += "<div class =\"client_Vender\">" + Get_ClientVendor + "</div>";
				/**/			tmp += "<div class =\"client_IPv4Address\">" + Get_ClientIPV4Address + "</div>";
				/**/			tmp += "<div class =\"client_IPv6Address\">" + Get_ClientIPV6Address + "</div>";
				/**/			if (Get_ClientMacFilter == "Allowed")	{	tmp += "<div class =\"client_Access\">" + I18N("j", "Access") + ": " + "<font color=\"" + Get_FontColor + "\">" +Get_ClientMacFilter + "</font></div>";	}
				/**/			else									{	tmp += "<div class =\"client_Access\">" + I18N("j", "Access") + ": " + "<B><font color=\"" + Get_FontColor + "\">" +Get_ClientMacFilter + "</font><B></div>";	}
				/**/			tmp += "</div>";
				/**/			tmp += "</div>";
				/**/			tmp += "</td>";
				/**/			break;
				/**/		case "DCS":
				/**/			tmp += "<td>";
				/**/			tmp += "<div class =\"client_DeviceTag\" onclick=\"openWebUI(" + ClientNumber + ")\" style=\"cursor:pointer\">";
				/**/			tmp += "<div class =\"front\">";
				/**/			tmp += "<div class =\"" + Get_CSSBackGround + "\"></div>";
				/**/			tmp += "<div class =\"client_Info\">";
				/**/			tmp += "<div class =\"client_Name\">" + Get_ClientName + "</div>";
				/**/			tmp += "<div class =\"client_EditImage\" onclick=\"event.cancelBubble=true;client_EditMember(" + ClientNumber + ")\" style=\"cursor:pointer\"></div>";
				/**/			tmp += "<div class =\"client_Vender\">" + Get_ClientVendor + "</div>";
				/**/			tmp += "<div class =\"client_IPv4Address\">" + Get_ClientIPV4Address + "</div>";
				/**/			tmp += "<div class =\"client_IPv6Address\">" + Get_ClientIPV6Address + "</div>";
				/**/			if (Get_ClientMacFilter == "Allowed")	{	tmp += "<div class =\"client_Access\">" + I18N("j", "Access") + ": " + "<font color=\"" + Get_FontColor + "\">" +Get_ClientMacFilter + "</font></div>";	}
				/**/			else									{	tmp += "<div class =\"client_Access\">" + I18N("j", "Access") + ": " + "<B><font color=\"" + Get_FontColor + "\">" +Get_ClientMacFilter + "</font><B></div>";	}
				/**/			tmp += "</div>";
				/**/			tmp += "</div>";
				/**/			tmp += "</td>";
				/**/			break;
				/**/		case "DSP":
				/**/			tmp += "<td>";
				/**/			tmp += "<div class =\"client_DeviceTag\" style=\"cursor:pointer\" onclick=\"changeClass(this);client_DeviceConfig(" + ClientNumber + ")\">";
				/**/			tmp += "<div class =\"front side\">";
				/**/			tmp += "<div class =\"" + Get_CSSBackGround + "\"></div>";
				/**/			tmp += "<div class =\"client_Info\">";
				/**/			if (Get_SmartPlugName != "")	{	tmp += "<div class =\"client_Name\">" + Get_SmartPlugName + "</div>";	}
				/**/			else							{	tmp += "<div class =\"client_Name\">" + Get_ClientName + "</div>";		}
				/**/			tmp += "<div class =\"client_EditImage\" onclick=\"event.cancelBubble=true;client_EditMember(" + ClientNumber + ")\" style=\"cursor:pointer\"></div>";
				/**/			tmp += "<div class =\"client_Vender\">" + Get_ClientVendor + "</div>";
				/**/			tmp += "<div class =\"client_IPv4Address\">" + Get_ClientIPV4Address + "</div>";
				/**/			tmp += "<div class =\"client_IPv6Address\">" + Get_ClientIPV6Address + "</div>";
				/**/			if (Get_ClientMacFilter == "Allowed")	{	tmp += "<div class =\"client_Access\">" + I18N("j", "Access") + ": " + "<font color=\"" + Get_FontColor + "\">" +Get_ClientMacFilter + "</font></div>";	}
				/**/			else									{	tmp += "<div class =\"client_Access\">" + I18N("j", "Access") + ": " + "<B><font color=\"" + Get_FontColor + "\">" +Get_ClientMacFilter + "</font><B></div>";	}
				/**/			tmp += "</div>";
				/**/			tmp += "</div>";
				/**/			tmp += "<div class =\"back side\">";
				/**/			if (Get_SmartPlugSW == "")	{	tmp += "<div class =\"client_PowerButton_off\" onclick=\"event.cancelBubble=true;SmartPlugPowerBtn(this," + ClientNumber + ", 'false'" + ")\"></div>";	}
				/**/			else
				/**/			{
				/**/				if (Get_SmartPlugSW == "true")	{	tmp += "<div class =\"client_PowerButton\" onclick=\"event.cancelBubble=true;SmartPlugPowerBtn(this," + ClientNumber + ", 'true'" + ")\"></div>";	}
				/**/				else							{	tmp += "<div class =\"client_PowerButton_off\" onclick=\"event.cancelBubble=true;SmartPlugPowerBtn(this," + ClientNumber + ", 'false'" + ")\"></div>";	}
				/**/			}
				/**/			tmp += "<div class =\"client_SmartPlugInfo\">";
				/**/			tmp += "<div class =\"client_SmartPlugName\">" + Get_ClientName + "</div>";
				/**/			tmp += "<div class =\"watt_Image\"></div>";
				/**/			if (Get_SmartPlugSW == "true")	{	tmp += "<div class =\"watt_Value\" id=\"watt_Value\">" + Get_SmartPlugWatt + "w" + "</div>";	}
				/**/			else							{	tmp += "<div class =\"watt_Value\" id=\"watt_Value\">" + "0w" + "</div>";	}
				/**/			tmp += "</div>";
				/**/			tmp += "</div>";
				/**/			tmp += "</div>";
				/**/			tmp += "</div>";
				/**/			tmp += "</td>";
				/**/			break;
				/**/		case "None":
				/**/			tmp += "<td>";
				/**/			tmp += "<div class =\"client_DeviceTag\" style =\"cursor:default\">";
				/**/			tmp += "<div class =\"front_B side\">";
				/**/			tmp += "<div class =\"" + Get_CSSBackGround + "\"></div>";
				/**/			tmp += "<div class =\"client_Info\">";
				/**/			tmp += "<div class =\"client_Name\">" + Get_ClientName + "</div>";
				/**/			tmp += "<div class =\"client_EditImage\" onclick=\"client_EditMember(" + ClientNumber + ")\" style=\"cursor:pointer\"></div>";
				/**/			tmp += "<div class =\"client_Vender\">" + Get_ClientVendor + "</div>";
				/**/			tmp += "<div class =\"client_IPv4Address\">" + Get_ClientIPV4Address + "</div>";
				/**/			tmp += "<div class =\"client_IPv6Address\">" + Get_ClientIPV6Address + "</div>";
				/**/			if (Get_ClientMacFilter == "Allowed")	{	tmp += "<div class =\"client_Access\">" + I18N("j", "Access") + ": " + "<font color=\"" + Get_FontColor + "\">" +Get_ClientMacFilter + "</font></div>";	}
				/**/			else									{	tmp += "<div class =\"client_Access\">" + I18N("j", "Access") + ": " + "<B><font color=\"" + Get_FontColor + "\">" +Get_ClientMacFilter + "</font><B></div>";	}
				/**/			tmp += "</div>";
				/**/			tmp += "</div>";
				/**/			tmp += "</td>";
				/**/			break;
				/**/	}
				///* #################################################################################################################################################################################################################	//*/
				// tmp += "<td>";
				// tmp += "<div class =\"client_Tag\" style =\"cursor:default\">";
				// tmp += "<div class =\"" + Get_CSSBackGround + "\"></div>";
				// tmp += "<div class =\"client_Info\">";
				// tmp += "<div class =\"client_Name\">" + Get_ClientName + "</div>";
				// tmp += "<div class =\"client_EditImage\" onclick =\"client_EditMember(" + ClientNumber + ")\" style =\"cursor:pointer\"></div>";
				// tmp += "<div class =\"client_Vender\">" + Get_ClientVendor + "</div>";
				// tmp += "<div class =\"client_IPv4Address\">" + Get_ClientIPV4Address + "</div>";
				// tmp += "<div class =\"client_IPv6Address\">" + Get_ClientIPV6Address + "</div>";
				// if (Get_ClientMacFilter == "Allowed")	{	tmp += "<div class =\"client_Access\">" + I18N("j", "Access") + ": " + "<font color =\"" + Get_FontColor + "\">" +Get_ClientMacFilter + "</font></div>";	}
				// else									{	tmp += "<div class =\"client_Access\">" + I18N("j", "Access") + ": " + "<B><font color =\"" + Get_FontColor + "\">" +Get_ClientMacFilter + "</font><B></div>";	}
				// tmp += "</div>";
				// tmp += "</div>";
				// tmp += "</td>";
			}
			else
			{
				ClientNumber = i;
				
				///* #################################################################################################### For Demo ####################################################################################################	//*/
				/**/	switch (Get_ClientDeviceType)
				/**/	{
				/**/		case "DCH":
				/**/			tmp += "<td>";
				/**/			tmp += "<div class =\"client_DeviceTag\" style=\"cursor:pointer\" onclick=\"changeClass(this);client_DeviceConfig(" + ClientNumber + ")\">";
				/**/			tmp += "<div class =\"front side\">";
				/**/			tmp += "<div class =\"" + Get_CSSBackGround + "\"></div>";
				/**/			tmp += "<div class =\"client_Info\">";
				/**/			tmp += "<div class =\"client_Name\">" + Get_ClientName + "</div>";
				/**/			tmp += "<div class =\"client_EditImage\" onclick=\"event.cancelBubble=true;client_EditMember(" + ClientNumber + ")\" style=\"cursor:pointer\"></div>";
				/**/			tmp += "<div class =\"client_Vender\">" + Get_ClientVendor + "</div>";
				/**/			tmp += "<div class =\"client_IPv4Address\">" + Get_ClientIPV4Address + "</div>";
				/**/			tmp += "<div class =\"client_IPv6Address\">" + Get_ClientIPV6Address + "</div>";
				/**/			if (Get_ClientMacFilter == "Allowed")	{	tmp += "<div class =\"client_Access\">" + I18N("j", "Access") + ": " + "<font color=\"" + Get_FontColor + "\">" +Get_ClientMacFilter + "</font></div>";	}
				/**/			else									{	tmp += "<div class =\"client_Access\">" + I18N("j", "Access") + ": " + "<B><font color=\"" + Get_FontColor + "\">" +Get_ClientMacFilter + "</font><B></div>";	}
				/**/			tmp += "</div>";
				/**/			tmp += "</div>";
				/**/			tmp += "<div class =\"back side\">";
				/**/			if (Get_AudioDLNA == "false" && Get_AudioAirPlay == "false")	{	tmp += "<div class =\"client_AudioSwitch_disable\" onclick=\"event.cancelBubble=true;AudioSwitchBtn(this," + ClientNumber + ")\"></div>";	}
				/**/			else
				/**/			{
				/**/				if (Get_AudioMute == "false" || Get_AudioMute == "")	{	tmp += "<div class =\"client_AudioSwitch\" onclick=\"event.cancelBubble=true;AudioSwitchBtn(this," + ClientNumber + ", 'false'" + ")\"></div>";		}
				/**/				else							{	tmp += "<div class =\"client_AudioSwitch_off\" onclick=\"event.cancelBubble=true;AudioSwitchBtn(this," + ClientNumber + ", 'false'" + ")\"></div>";	}
				/**/			}
				/**/			tmp += "<div class =\"client_AccessPointInfo\">";
				/**/			tmp += "<div class =\"client_AccessPointName\">" + Get_ClientName + "</div>";
				/**/			tmp += "<div class =\"client_AccessPointFunction\">" + "Audio Renderer" + ":" + "</div>";
				/**/			if (Get_AudioDLNA == "true" && Get_AudioAirPlay == "true")	{	tmp += "<div id=\"enableAudioRenderer\" class=\"checkbox_on\" style=\"position:relative;top:15px;\" onclick=\"event.cancelBubble=true;btnClickEvent(this, " + ClientNumber + ")\"><input type=\"checkbox\" name=\"enableAudioRenderer\" id=\"enableAudioRenderer_ck\" checked></input></div>";	}
				/**/			else	{	tmp += "<div id=\"enableAudioRenderer\" class=\"checkbox_off\" style=\"position:relative;top:15px;\" onclick=\"event.cancelBubble=true;btnClickEvent(this, " + ClientNumber + ")\"><input type=\"checkbox\" name=\"enableAudioRenderer\" id=\"enableAudioRenderer_ck\"></input></div>";	}
				/**/			
				/**/			tmp += "</div>";
				/**/			tmp += "</div>";
				/**/			tmp += "</div>";
				/**/			tmp += "</div>";
				/**/			tmp += "</td>";
				/**/			tmp += "</tr>";
				/**/			break;
				/**/		case "DNS":
				/**/			tmp += "<td>";
				/**/			tmp += "<div class =\"client_DeviceTag\" onclick=\"openWebUI(" + ClientNumber + ")\" style=\"cursor:pointer\">";
				/**/			tmp += "<div class =\"front\">";
				/**/			tmp += "<div class =\"" + Get_CSSBackGround + "\"></div>";
				/**/			tmp += "<div class =\"client_Info\">";
				/**/			tmp += "<div class =\"client_Name\">" + Get_ClientName + "</div>";
				/**/			tmp += "<div class =\"client_EditImage\" onclick=\"event.cancelBubble=true;client_EditMember(" + ClientNumber + ")\" style=\"cursor:pointer\"></div>";
				/**/			tmp += "<div class =\"client_Vender\">" + Get_ClientVendor + "</div>";
				/**/			tmp += "<div class =\"client_IPv4Address\">" + Get_ClientIPV4Address + "</div>";
				/**/			tmp += "<div class =\"client_IPv6Address\">" + Get_ClientIPV6Address + "</div>";
				/**/			if (Get_ClientMacFilter == "Allowed")	{	tmp += "<div class =\"client_Access\">" + I18N("j", "Access") + ": " + "<font color=\"" + Get_FontColor + "\">" +Get_ClientMacFilter + "</font></div>";	}
				/**/			else									{	tmp += "<div class =\"client_Access\">" + I18N("j", "Access") + ": " + "<B><font color=\"" + Get_FontColor + "\">" +Get_ClientMacFilter + "</font><B></div>";	}
				/**/			tmp += "</div>";
				/**/			tmp += "</div>";
				/**/			tmp += "</td>";
				/**/			tmp += "</tr>";
				/**/			break;
				/**/		case "DCS":
				/**/			tmp += "<td>";
				/**/			tmp += "<div class =\"client_DeviceTag\" onclick=\"openWebUI(" + ClientNumber + ")\" style=\"cursor:pointer\">";
				/**/			tmp += "<div class =\"front\">";
				/**/			tmp += "<div class =\"" + Get_CSSBackGround + "\"></div>";
				/**/			tmp += "<div class =\"client_Info\">";
				/**/			tmp += "<div class =\"client_Name\">" + Get_ClientName + "</div>";
				/**/			tmp += "<div class =\"client_EditImage\" onclick=\"event.cancelBubble=true;client_EditMember(" + ClientNumber + ")\" style=\"cursor:pointer\"></div>";
				/**/			tmp += "<div class =\"client_Vender\">" + Get_ClientVendor + "</div>";
				/**/			tmp += "<div class =\"client_IPv4Address\">" + Get_ClientIPV4Address + "</div>";
				/**/			tmp += "<div class =\"client_IPv6Address\">" + Get_ClientIPV6Address + "</div>";
				/**/			if (Get_ClientMacFilter == "Allowed")	{	tmp += "<div class =\"client_Access\">" + I18N("j", "Access") + ": " + "<font color=\"" + Get_FontColor + "\">" +Get_ClientMacFilter + "</font></div>";	}
				/**/			else									{	tmp += "<div class =\"client_Access\">" + I18N("j", "Access") + ": " + "<B><font color=\"" + Get_FontColor + "\">" +Get_ClientMacFilter + "</font><B></div>";	}
				/**/			tmp += "</div>";
				/**/			tmp += "</div>";
				/**/			tmp += "</td>";
				/**/			tmp += "</tr>";
				/**/			break;
				/**/		case "DSP":
				/**/			tmp += "<td>";
				/**/			tmp += "<div class =\"client_DeviceTag\" style=\"cursor:pointer\" onclick=\"changeClass(this);client_DeviceConfig(" + ClientNumber + ")\">";
				/**/			tmp += "<div class =\"front side\">";
				/**/			tmp += "<div class =\"" + Get_CSSBackGround + "\"></div>";
				/**/			tmp += "<div class =\"client_Info\">";
				/**/			if (Get_SmartPlugName != "")	{	tmp += "<div class =\"client_Name\">" + Get_SmartPlugName + "</div>";	}
				/**/			else							{	tmp += "<div class =\"client_Name\">" + Get_ClientName + "</div>";		}
				/**/			tmp += "<div class =\"client_EditImage\" onclick=\"event.cancelBubble=true;client_EditMember(" + ClientNumber + ")\" style=\"cursor:pointer\"></div>";
				/**/			tmp += "<div class =\"client_Vender\">" + Get_ClientVendor + "</div>";
				/**/			tmp += "<div class =\"client_IPv4Address\">" + Get_ClientIPV4Address + "</div>";
				/**/			tmp += "<div class =\"client_IPv6Address\">" + Get_ClientIPV6Address + "</div>";
				/**/			if (Get_ClientMacFilter == "Allowed")	{	tmp += "<div class =\"client_Access\">" + I18N("j", "Access") + ": " + "<font color=\"" + Get_FontColor + "\">" +Get_ClientMacFilter + "</font></div>";	}
				/**/			else									{	tmp += "<div class =\"client_Access\">" + I18N("j", "Access") + ": " + "<B><font color=\"" + Get_FontColor + "\">" +Get_ClientMacFilter + "</font><B></div>";	}
				/**/			tmp += "</div>";
				/**/			tmp += "</div>";
				/**/			tmp += "<div class =\"back side\">";
				/**/			if (Get_SmartPlugSW == "")	{	tmp += "<div class =\"client_PowerButton_off\" onclick=\"event.cancelBubble=true;SmartPlugPowerBtn(this," + ClientNumber + ", 'false'" + ")\"></div>";	}
				/**/			else
				/**/			{
				/**/				if (Get_SmartPlugSW == "true")	{	tmp += "<div class =\"client_PowerButton\" onclick=\"event.cancelBubble=true;SmartPlugPowerBtn(this," + ClientNumber + ", 'true'" + ")\"></div>";	}
				/**/				else							{	tmp += "<div class =\"client_PowerButton_off\" onclick=\"event.cancelBubble=true;SmartPlugPowerBtn(this," + ClientNumber + ", 'false'" + ")\"></div>";	}
				/**/			}
				/**/			
				/**/			tmp += "<div class =\"client_SmartPlugInfo\">";
				/**/			tmp += "<div class =\"client_SmartPlugName\">" + Get_ClientName + "</div>";
				/**/			tmp += "<div class =\"watt_Image\"></div>";
				/**/			
				/**/			if (Get_SmartPlugSW == "true")	{	tmp += "<div class =\"watt_Value\" id=\"watt_Value\">" + Get_SmartPlugWatt + "w" + "</div>";	}
				/**/			else						{	tmp += "<div class =\"watt_Value\" id=\"watt_Value\">" + "0w" + "</div>";	}
				/**/			
				/**/			tmp += "</div>";
				/**/			tmp += "</div>";
				/**/			tmp += "</div>";
				/**/			tmp += "</div>";
				/**/			tmp += "</td>";
				/**/			tmp += "</tr>";
				/**/			break;
				/**/		case "None":
				/**/			tmp += "<td>";
				/**/			tmp += "<div class =\"client_DeviceTag\" style =\"cursor:default\">";
				/**/			tmp += "<div class =\"front_B side\">";
				/**/			tmp += "<div class =\"" + Get_CSSBackGround + "\"></div>";
				/**/			tmp += "<div class =\"client_Info\">";
				/**/			tmp += "<div class =\"client_Name\">" + Get_ClientName + "</div>";
				/**/			tmp += "<div class =\"client_EditImage\" onclick=\"client_EditMember(" + ClientNumber + ")\" style=\"cursor:pointer\"></div>";
				/**/			tmp += "<div class =\"client_Vender\">" + Get_ClientVendor + "</div>";
				/**/			tmp += "<div class =\"client_IPv4Address\">" + Get_ClientIPV4Address + "</div>";
				/**/			tmp += "<div class =\"client_IPv6Address\">" + Get_ClientIPV6Address + "</div>";
				/**/			if (Get_ClientMacFilter == "Allowed")	{	tmp += "<div class =\"client_Access\">" + I18N("j", "Access") + ": " + "<font color=\"" + Get_FontColor + "\">" +Get_ClientMacFilter + "</font></div>";	}
				/**/			else									{	tmp += "<div class =\"client_Access\">" + I18N("j", "Access") + ": " + "<B><font color=\"" + Get_FontColor + "\">" +Get_ClientMacFilter + "</font><B></div>";	}
				/**/			tmp += "</div>";
				/**/			tmp += "</div>";
				/**/			tmp += "</td>";
				/**/			tmp += "</tr>";
				/**/			break;
				/**/	}
				///* #################################################################################################################################################################################################################	//*/
				// tmp += "<td>";
				// tmp += "<div class =\"client_Tag\" style =\"cursor:default\">";
				// tmp += "<div class =\"" + Get_CSSBackGround + "\"></div>";
				// tmp += "<div class =\"client_Info\">";
				// tmp += "<div class =\"client_Name\">" + Get_ClientName + "</div>";
				// tmp += "<div class =\"client_EditImage\" onclick=\"client_EditMember(" + ClientNumber + ")\" style=\"cursor:pointer\"></div>";
				// tmp += "<div class =\"client_Vender\">" + Get_ClientVendor + "</div>";
				// tmp += "<div class =\"client_IPv4Address\">" + Get_ClientIPV4Address + "</div>";
				// tmp += "<div class =\"client_IPv6Address\">" + Get_ClientIPV6Address + "</div>";
				// if (Get_ClientMacFilter == "Allowed")	{	tmp += "<div class =\"client_Access\">" + I18N("j", "Access") + ": " + "<font color=\"" + Get_FontColor + "\">" +Get_ClientMacFilter + "</font></div>";			}
				// else									{	tmp += "<div class =\"client_Access\">" + I18N("j", "Access") + ": " + "<B><font color=\"" + Get_FontColor + "\">" +Get_ClientMacFilter + "</font><B></div>";	}
				// tmp += "</div>";
				// tmp += "</div>";
				// tmp += "</td>";
				// tmp += "</tr>";
			}
			print_Count ++;
		}
		
		if (Total_Device % 3 == 1)
		{
			tmp += "<td>";
			tmp += "</td>";
			tmp += "</tr>";
		}
	}
	else
	{
		if (val == 0)
		{
			document.getElementById("Client_Info").style.display = "table-row";
			document.getElementById("Client_Group").style.display = "none";
		}
	}
	
	tmp += "</tbody>";
	tmp += "</table>";
	document.getElementById("Client_Group").innerHTML = tmp;
	///* ############################## For Demo ##############################	//*/
	// eval("Get_" + HXHR + ".onreadystatechange = function()	{	if (Get_" + HXHR + ".readyState == 4)
	/**/	// presetCheckBox("enableAudioRenderer", true);						/**/
	///* ######################################################################	//*/
	clearTimeout(Time_ClientList);
	Time_ClientList = setTimeout("ClearAndRenew()", 3000);
}

function client_EditMember(GetValue)
{
	document.getElementById("editPop").style.display = "inline";
	var Get_ClientName = array2Dv[GetValue - 1][0];
	var Get_ClientMacAddress = array2Dv[GetValue - 1][1];
	var Get_ClientIPV4Address = array2Dv[GetValue - 1][2];
	var Get_ClientIPV6Address = array2Dv[GetValue - 1][3];
	var Get_ClientVendor = array2Dv[GetValue - 1][4];
	var Get_ClientReservationIP = array2Dv[GetValue - 1][5];
	var Get_ClientMacFilter = array2Dv[GetValue - 1][6];
	var Get_ClientNickName = array2Dv[GetValue - 1][9];
	var Get_ClientStatus = array2Dv[GetValue - 1][8];
	
	if (Get_ClientStatus != "link_IconX_Block")
	{
		document.getElementById("client_Name").disabled = false;
		document.getElementById("show_Vendor").style.display = "table-row";
		document.getElementById("show_IPAddress").style.display = "table-row";
		document.getElementById("show_MACAddress").style.display = "none";
		document.getElementById("show_ReserveIP").style.display = "table-row";
		
		if (Get_ClientNickName != 0)	{	document.getElementById("client_Name").value = Get_ClientNickName;	}
		else							{	document.getElementById("client_Name").value = Get_ClientName;		}
		
		document.getElementById("Name_TimmyCheck").value = Get_ClientName;
		document.getElementById("client_IPAddress").value = Get_ClientIPV4Address;
		document.getElementById("show_IPAddress").style.display = "table-row";
		document.getElementById("client_MACAddress").innerHTML = Get_ClientMacAddress;
		
		if (Get_ClientVendor != 0)	{	document.getElementById("client_Vendor").innerHTML = Get_ClientVendor;	}
		else						{	document.getElementById("client_Vendor").innerHTML = "N/A";				}
		
		if (Get_ClientReservationIP != 0)
		{
			presetCheckBox("enableReserveIP", true);
			document.getElementById("TimmyCheckBox2").checked = true;
		}
		else
		{
			presetCheckBox("enableReserveIP", false);
			document.getElementById("TimmyCheckBox2").checked = false;
		}
		
		var getAllowedString = I18N("j", "Allowed");
		if (Get_ClientMacFilter == getAllowedString)
		{
			presetCheckBox("enableAccess", true);
			document.getElementById("TimmyCheckBox").checked = true;
		}
		else
		{
			presetCheckBox("enableAccess", false);
			document.getElementById("TimmyCheckBox").checked = false;
		}
	}
	else
	{
		document.getElementById("client_Name").disabled = true;
		document.getElementById("show_Vendor").style.display = "none";
		document.getElementById("show_IPAddress").style.display = "none";
		document.getElementById("show_MACAddress").style.display = "table-row";
		document.getElementById("show_ReserveIP").style.display = "none";
		
		if (Get_ClientNickName != 0)	{	document.getElementById("client_Name").value = Get_ClientNickName;	}
		else							{	document.getElementById("client_Name").value = Get_ClientName;		}
		
		document.getElementById("Name_TimmyCheck").value = Get_ClientName;
		document.getElementById("client_MACAddress").innerHTML = Get_ClientMacAddress;
		
		if (Get_ClientReservationIP != 0)
		{
			presetCheckBox("enableReserveIP", true);
			document.getElementById("TimmyCheckBox2").checked = true;
		}
		else
		{
			presetCheckBox("enableReserveIP", false);
			document.getElementById("TimmyCheckBox2").checked = false;
		}
		
		var getAllowedString = I18N("j", "Allowed");
		if (Get_ClientMacFilter == getAllowedString)
		{
			presetCheckBox("enableAccess", true);
			document.getElementById("TimmyCheckBox").checked = true;
		}
		else
		{
			presetCheckBox("enableAccess", false);
			document.getElementById("TimmyCheckBox").checked = false;
		}
	}
}
function closeEditPOP()	{	HNAP.GetXMLAsync("GetClientInfoDemoResponse", null, "GetValue", function(xml)	{	GetResult_GCI_1(xml)	});	}
function GetResult_GCI_1(result_xml)
{
	var GetResult_GCI_1 = result_xml.Get("GetClientInfoDemoResponse/GetClientInfoResult");
	if (GetResult_GCI_1 == "OK")
	{
		if (valueChanged == 1)
		{
			Get__MACAddress = document.getElementById("client_MACAddress").innerHTML;
			Get__DeviceName = document.getElementById("client_Name").value;
			Get__NickName = document.getElementById("Name_TimmyCheck").value;
			Get__ReserveIP = document.getElementById("client_IPAddress").value;
			Get__SetNickNameMark;
			var NickNameListCounter = 1;
			SetNickName = 1;
			Check_Flag = 0;
			array2DvNM = new Array2DVar(Total_Device, 3);
			for (var n = 0; n < Total_Device; n ++)
			{
				array2DvNM[n][0] = result_xml.Get("GetClientInfoDemoResponse/ClientInfoLists/ClientInfo:" + NickNameListCounter + "/MacAddress");
				array2DvNM[n][1] = result_xml.Get("GetClientInfoDemoResponse/ClientInfoLists/ClientInfo:" + NickNameListCounter + "/NickName");
				array2DvNM[n][2] = result_xml.Get("GetClientInfoDemoResponse/ClientInfoLists/ClientInfo:" + NickNameListCounter + "/ReserveIP");
				NickNameListCounter ++;
			}
			
			var xml_SetClientInfo = tmpXML_SetClientInfo;
			for (var m = 0; m < Total_Device; m ++)
			{
				if (Get__MACAddress == array2DvNM[m][0])	{	Check_Flag = 1;	}
				
				if (Check_Flag == 1)
				{
					if (Get__DeviceName != 0)
					{
						xml_SetClientInfo.Set("SetClientInfoDemo/ClientInfoLists/ClientInfo:" + SetNickName + "/MacAddress", Get__MACAddress);
						if (Get__DeviceName == Get__NickName)	{	xml_SetClientInfo.Set("SetClientInfo/ClientInfoLists/ClientInfo:" + SetNickName + "/NickName", "");					}
						else									{	xml_SetClientInfo.Set("SetClientInfo/ClientInfoLists/ClientInfo:" + SetNickName + "/NickName", Get__DeviceName);	}
						if (document.getElementById("TimmyCheckBox2").checked == true)	{	xml_SetClientInfo.Set("SetClientInfo/ClientInfoLists/ClientInfo:" + SetNickName + "/ReserveIP", Get__ReserveIP);	}
						else															{	xml_SetClientInfo.Set("SetClientInfo/ClientInfoLists/ClientInfo:" + SetNickName + "/ReserveIP", "");				}
					}
					else
					{
						xml_SetClientInfo.Set("SetClientInfoDemo/ClientInfoLists/ClientInfo:" + SetNickName + "/MacAddress", Get__MACAddress);
						xml_SetClientInfo.Set("SetClientInfoDemo/ClientInfoLists/ClientInfo:" + SetNickName + "/NickName", "");
						if (document.getElementById("TimmyCheckBox2").checked == true)	{	xml_SetClientInfo.Set("SetClientInfo/ClientInfoLists/ClientInfo:" + SetNickName + "/ReserveIP", Get__ReserveIP);	}
						else															{	xml_SetClientInfo.Set("SetClientInfo/ClientInfoLists/ClientInfo:" + SetNickName + "/ReserveIP", "");				}
					}
					SetNickName ++;
				}
				Check_Flag = 0;
			}
			HNAP.SetXMLAsync("SetClientInfoDemo", xml_SetClientInfo, function(xml)	{	GetResult_GCI_2(xml);	});
		}
		else	{	HNAP.GetXMLAsync("GetMACFilters2", null, "GetValue", function(xml)	{	GetResult_GCI_3(xml)	});	}
	}
	else	{	if (DebugMode == 1)	{	alert("[!!GetXML Error!!] Function: GetResult_GCI_1");	}	}
}
function GetResult_GCI_2(result_xml)
{
	var GetResult_GCI_2 = result_xml.Get("SetClientInfoDemoResponse/SetClientInfoDemoResult");
	if (GetResult_GCI_2 == "OK")	{	HNAP.GetXMLAsync("GetMACFilters2", null, "GetValue", function(xml)	{	GetResult_GCI_3(xml)	});	}
	else	{	if (DebugMode == 1)	{	alert("[!!GetXML Error!!] Function: GetResult_GCI_2");	}	}
}
function GetResult_GCI_3(result_xml)
{
	var GetResult_GCI_3 = result_xml.Get("GetMACFilters2Response/GetMACFilters2Result");
	if (GetResult_GCI_3 == "OK")
	{
		var xml_SetMacFilter = tmpXML_SetMACFilters2;
		var CheckCount = 0;
		var GetMacFilterListNumber = result_xml.Get("GetMACFilters2Response/MACList/MACInfo#");
		if (GetMacFilterListNumber > 0)
		{
			array2DvMF = new Array2DVar(GetMacFilterListNumber, 3);
			// 載入目前的 MacFilter List 並寫到陣列中
			for (var i = 1; i <= GetMacFilterListNumber; i ++)
			{
				array2DvMF[CheckCount][0] = result_xml.Get("GetMACFilters2Response/MACList/MACInfo:" + i + "/DeviceName");
				array2DvMF[CheckCount][1] = result_xml.Get("GetMACFilters2Response/MACList/MACInfo:" + i + "/MacAddress");
				CheckCount ++;
			}
		}
		// 如果 List 沒半個，你是第一個要設為黑名單的行為：
		if (GetMacFilterListNumber == 0 && document.getElementById("TimmyCheckBox").checked == false)
		{
			var Set_Client_MACAddress = document.getElementById("client_MACAddress").innerHTML;
			var Set_Client_Description = document.getElementById("client_Name").value;
			xml_SetMacFilter.Set("SetMACFilters2/Enabled", "true");
			xml_SetMacFilter.Set("SetMACFilters2/IsAllowList", "true");
			xml_SetMacFilter.Set("SetMACFilters2/MACList/MACInfo:1/MacAddress", Set_Client_MACAddress);
			xml_SetMacFilter.Set("SetMACFilters2/MACList/MACInfo:1/DeviceName", Set_Client_Description);
			HNAP.SetXMLAsync("SetMACFilters2", xml_SetMacFilter, function(xml)	{	GetResult_GCI_4(xml);	});
		}
		// 如果 List 超過一個(以上)，你是要設在黑名單最後面的行為：
		else if (GetMacFilterListNumber >= 1 && document.getElementById("TimmyCheckBox").checked == false)
		{
			var Set_Client_MACAddress = document.getElementById("client_MACAddress").innerHTML;
			var Set_Client_Description = document.getElementById("client_Name").value;
			var Competence = 999;
			var SetCounter = 1;
			// 檢查是否為重複的MacAddress，假如是，權限不變，假如不存在，權限提升
			for (var i = 0; i < GetMacFilterListNumber; i ++)
			{
				if (Set_Client_MACAddress == array2DvMF[i][1])	{	Competence = 999;	}
				else											{	Competence = 1000;	break;	}
			}
			xml_SetMacFilter.Set("SetMACFilters2/Enabled", "true");
			xml_SetMacFilter.Set("SetMACFilters2/IsAllowList", "true");
			if (Competence == 1000)
			{
				for (var j = 1; j <= GetMacFilterListNumber; j ++)
				{
					xml_SetMacFilter.Set("SetMACFilters2/MACList/MACInfo:" + SetCounter + "/MacAddress", array2DvMF[SetCounter - 1][1]);
					xml_SetMacFilter.Set("SetMACFilters2/MACList/MACInfo:" + SetCounter + "/DeviceName", array2DvMF[SetCounter - 1][0]);
					SetCounter ++;
				}
				xml_SetMacFilter.Set("SetMACFilters2/MACList/MACInfo:" + SetCounter + "/MacAddress", Set_Client_MACAddress);
				xml_SetMacFilter.Set("SetMACFilters2/MACList/MACInfo:" + SetCounter + "/DeviceName", Set_Client_Description);
				HNAP.SetXMLAsync("SetMACFilters2", xml_SetMacFilter, function(xml)	{	GetResult_GCI_4(xml);	});
			}
			else	{	ClearAndRenew();	}
		}
		// 如果 List 超過一個，我要解除黑名單的話，行為：
		else if (GetMacFilterListNumber > 1 && document.getElementById("TimmyCheckBox").checked == true)
		{
			var Set_Client_MACAddress = document.getElementById("client_MACAddress").innerHTML;
			var Set_Client_Description = document.getElementById("client_Name").value;
			var Competence = 999;
			var SetCounter = 1;
			var Flag_Last = 0;
			// 檢查MacAddress是否存在於MacFilterList中，如果是，權限提升，若否，不變
			for (var i = 0; i < GetMacFilterListNumber; i ++)
			{
				if (Set_Client_MACAddress == array2DvMF[i][1])
				{
					if (i == GetMacFilterListNumber - 1)	{	Flag_Last = 1;	GetMacFilterListNumber = GetMacFilterListNumber - 1;	}
					console.log('權限提升!!');
					Competence = 1000;
					break;
				}
			}
			
			xml_SetMacFilter.Set("SetMACFilters2/Enabled", "true");
			xml_SetMacFilter.Set("SetMACFilters2/IsAllowList", "true");
			if (Competence == 1000)
			{
				if (Flag_Last == 1)
				{
					for (var k = 0 ; k < GetMacFilterListNumber; k ++)
					{
						console.log(k);
						xml_SetMacFilter.Set("SetMACFilters2/MACList/MACInfo:" + SetCounter + "/MacAddress", array2DvMF[parseInt(SetCounter - 1)][1]);
						xml_SetMacFilter.Set("SetMACFilters2/MACList/MACInfo:" + SetCounter + "/DeviceName", array2DvMF[parseInt(SetCounter - 1)][0]);
						SetCounter ++;
					}
					xml_SetMacFilter.Set("SetMACFilters2/MACList/MACInfo:" + SetCounter + "/MacAddress", "");
					xml_SetMacFilter.Set("SetMACFilters2/MACList/MACInfo:" + SetCounter + "/DeviceName", "");
					Flag_Last = 0;
				}
				else
				{
					var tmp_Count = 0;
					array2DvMF_a = new Array2DVar(GetMacFilterListNumber, 3);
					for (var i = 0; i < GetMacFilterListNumber; i ++)
					{
						array2DvMF_a[tmp_Count][0] = array2DvMF[i][0];
						array2DvMF_a[tmp_Count][1] = array2DvMF[i][1];
						if (Set_Client_MACAddress != array2DvMF[i][1])	{	tmp_Count ++;	}
						console.log(array2DvMF_a[tmp_Count][0] + "," + array2DvMF_a[tmp_Count][1]);
					}
					GetMacFilterListNumber = GetMacFilterListNumber - 1;
					
					for (var k = 0 ; k < GetMacFilterListNumber; k ++)
					{
						console.log(k);
						xml_SetMacFilter.Set("SetMACFilters2/MACList/MACInfo:" + SetCounter + "/MacAddress", array2DvMF_a[k][1]);
						xml_SetMacFilter.Set("SetMACFilters2/MACList/MACInfo:" + SetCounter + "/DeviceName", array2DvMF_a[k][0]);
						SetCounter ++;
					}
					xml_SetMacFilter.Set("SetMACFilters2/MACList/MACInfo:" + SetCounter + "/MacAddress", "");
					xml_SetMacFilter.Set("SetMACFilters2/MACList/MACInfo:" + SetCounter + "/DeviceName", "");
				}
				HNAP.SetXMLAsync("SetMACFilters2", xml_SetMacFilter, function(xml)	{	GetResult_GCI_4(xml);	});
			}
			else	{	ClearAndRenew();	}
		}
		// 如果 List 只有一個，我要解除黑名單的話，行為：
		else if (GetMacFilterListNumber == 1 && document.getElementById("TimmyCheckBox").checked == true)
		{
			var Set_Client_MACAddress = document.getElementById("client_MACAddress").innerHTML;
			var Set_Client_Description = document.getElementById("client_Name").value;
			var Competence = 999;
			var SetCounter = 1;
			// 檢查MacAddress是否存在於MacFilterList中，如果是，權限提升，若否，不變
			for (var i = 0; i < GetMacFilterListNumber; i ++)
			{
				if (Set_Client_MACAddress == array2DvMF[i][1])	{	Competence = 1000;	break;	}
			}
			
			if (Competence == 1000)
			{
				xml_SetMacFilter.Set("SetMACFilters2/Enabled", "true");
				xml_SetMacFilter.Set("SetMACFilters2/IsAllowList", "false");
				xml_SetMacFilter.Set("SetMACFilters2/MACList/MACInfo/MacAddress", "");
				xml_SetMacFilter.Set("SetMACFilters2/MACList/MACInfo/DeviceName", "");
				HNAP.SetXMLAsync("SetMACFilters2", xml_SetMacFilter, function(xml)	{	GetResult_GCI_4(xml);	});
			}
			else	{	ClearAndRenew();	}
		}
		else	{	ClearAndRenew();	}
		document.getElementById("editPop").style.display = "none";
	}
	else	{	if (DebugMode == 1)	{	alert("[!!GetXML Error!!] Function: GetResult_GCI_3");	}	}
}
function GetResult_GCI_4(result_xml)
{
	var GetResult_GCI_4 = result_xml.Get("SetMACFilters2Response/SetMACFilters2Result");
	if (GetResult_GCI_4 == "OK")	{	ClearAndRenew();	}
	else	{	if (DebugMode == 1)	{	alert("[!!GetXML Error!!] Function: GetResult_GCI_4");	}	}
}
function clearCreateRulePOP()	{	document.getElementById("editPop").style.display = "none";	}
function clearCreateRulePOP_IPCam()	{	document.getElementById("editPop2").style.display = "none";	}
function ClearAndRenew()
{
	if (GetFlagD == true && GetFlagE == false)
	{
		clearTimeout(Time_ClientList);
		Get_ClientInfo(Client_Type);
	}
	else if (GetFlagD == false && GetFlagE == true)
	{
		clearTimeout(Time_ClientList);
		Get_ClientInfo(Client_Type);
	}
	else if (GetFlagD == false && GetFlagE == false)
	{
		document.getElementById("client_btn_Guest").setAttribute("class", "v4v6_linkstyle_2");
		document.getElementById("client_btn_Host").setAttribute("class", "v4v6_linkstyle_1");
		clearTimeout(Time_ClientList);
	}
	else
	{
		document.getElementById("client_btn_Guest").setAttribute("class", "v4v6_linkstyle_2");
		document.getElementById("client_btn_Host").setAttribute("class", "v4v6_linkstyle_1");
		clearTimeout(Time_ClientList);
	}
}
function detect_KeyValue(e)
{
	var key = window.event ? e.keyCode : e.which;
	if (key == 13)	{	checkIPCamPW(IPCam_address);	}
}
function Set_Param(str)
{
	if (str == "Host")
	{
		document.getElementById("client_btn_Guest").setAttribute("class", "v4v6_linkstyle_2");
		document.getElementById("client_btn_Host").setAttribute("class", "v4v6_linkstyle_1");
		GetFlagD = true;
		GetFlagE = false;
	}
	else if (str == "Guest")
	{
		document.getElementById("client_btn_Guest").setAttribute("class", "v4v6_linkstyle_1");
		document.getElementById("client_btn_Host").setAttribute("class", "v4v6_linkstyle_2");
		GetFlagD = false;
		GetFlagE = true ;
	}
}

function Array2DVar(x, y)
{
	this.length = x;
	this.x = x;
	this.y = y;
	for(var i = 0; i < this.length; i++)	{	this[i] = new Array(y);	}
}
function changeClass(element)
{
	if (element.className == "client_DeviceTag")	{	element.className += " rotated";			}
	else											{	element.className = "client_DeviceTag";		}
}
function SmartPlugPowerBtn(element, val, val2)
{
	val = parseInt(val);
	var Mac = array2Dv[val - 1][1];
	var Nick = array2Dv[val - 1][19];
	var RevIP = array2Dv[val - 1][5];
	var xml_SetClientInfo = HNAP.GetXML("SetClientInfoDemo");
	xml_SetClientInfo.Set("SetClientInfoDemo/ClientInfoLists:1/ClientInfo/MacAddress", Mac);
	if (NowSmartPlugSW == "")
	{
		if (val2 == "true")
		{
			Time_ClientSamrtPlugWatt = window.clearInterval(Time_ClientSamrtPlugWatt);
			document.getElementById("watt_Value").innerHTML = "0w";
			xml_SetClientInfo.Set("SetClientInfoDemo/ClientInfoLists/ClientInfo:1/SupportedAction/AudioMute", "");
			xml_SetClientInfo.Set("SetClientInfoDemo/ClientInfoLists/ClientInfo:1/SupportedAction/AudioEnable", "");
			xml_SetClientInfo.Set("SetClientInfoDemo/ClientInfoLists/ClientInfo:1/SupportedAction/SmartPlugEnable", "false");
			element.className = "client_PowerButton_off";
			NowSmartPlugSW = "false";
			var xml_SetClientInfoResult = HNAP.SetXML("SetClientInfo", xml_SetClientInfo);
		}
		else
		{
			Time_ClientSamrtPlugWatt = window.clearInterval(Time_ClientSamrtPlugWatt);
			xml_SetClientInfo.Set("SetClientInfoDemo/ClientInfoLists/ClientInfo:1/SupportedAction/AudioMute", "");
			xml_SetClientInfo.Set("SetClientInfoDemo/ClientInfoLists/ClientInfo:1/SupportedAction/AudioEnable", "");
			xml_SetClientInfo.Set("SetClientInfoDemo/ClientInfoLists/ClientInfo:1/SupportedAction/SmartPlugEnable", "true");
			element.className = "client_PowerButton";
			NowSmartPlugSW = "true";
			var xml_SetClientInfoResult = HNAP.SetXML("SetClientInfoDemo", xml_SetClientInfo);
			Time_ClientSamrtPlugWatt = setTimeout("UpdateSmartPlugWatt(" + val + ")", 5000);
		}
	}
	else
	{
		if (NowSmartPlugSW == "true")
		{
			Time_ClientSamrtPlugWatt = window.clearInterval(Time_ClientSamrtPlugWatt);
			document.getElementById("watt_Value").innerHTML = "0w";
			xml_SetClientInfo.Set("SetClientInfoDemo/ClientInfoLists/ClientInfo:1/SupportedAction/AudioMute", "");
			xml_SetClientInfo.Set("SetClientInfoDemo/ClientInfoLists/ClientInfo:1/SupportedAction/AudioEnable", "");
			xml_SetClientInfo.Set("SetClientInfoDemo/ClientInfoLists/ClientInfo:1/SupportedAction/SmartPlugEnable", "false");
			element.className = "client_PowerButton_off";
			NowSmartPlugSW = "false";
			var xml_SetClientInfoResult = HNAP.SetXML("SetClientInfoDemo", xml_SetClientInfo);
		}
		else
		{
			Time_ClientSamrtPlugWatt = window.clearInterval(Time_ClientSamrtPlugWatt);
			xml_SetClientInfo.Set("SetClientInfoDemo/ClientInfoLists/ClientInfo:1/SupportedAction/AudioMute", "");
			xml_SetClientInfo.Set("SetClientInfoDemo/ClientInfoLists/ClientInfo:1/SupportedAction/AudioEnable", "");
			xml_SetClientInfo.Set("SetClientInfoDemo/ClientInfoLists/ClientInfo:1/SupportedAction/SmartPlugEnable", "true");
			element.className = "client_PowerButton";
			NowSmartPlugSW = "true";
			var xml_SetClientInfoResult = HNAP.SetXML("SetClientInfoDemo", xml_SetClientInfo);
			Time_ClientSamrtPlugWatt = setTimeout("UpdateSmartPlugWatt(" + val + ")", 5000);
		}
	}
}
function AudioSwitchBtn(element, val, val2)
{
	val = parseInt(val);
	var Mac = array2Dv[val - 1][1];
	var Nick = array2Dv[val - 1][19];
	var RevIP = array2Dv[val - 1][5];
	var xml_SetClientInfo = HNAP.GetXML("SetClientInfoDemo");
	xml_SetClientInfo.Set("SetClientInfoDemo/ClientInfoLists:1/ClientInfo/MacAddress", Mac);
	if (NowAudioMute == "")
	{
		if (val2 == "true")
		{
			xml_SetClientInfo.Set("SetClientInfoDemo/ClientInfoLists/ClientInfo:1/SupportedAction/AudioMute", "false");
			xml_SetClientInfo.Set("SetClientInfoDemo/ClientInfoLists/ClientInfo:1/SupportedAction/AudioEnable", "");
			xml_SetClientInfo.Set("SetClientInfoDemo/ClientInfoLists/ClientInfo:1/SupportedAction/SmartPlugEnable", "");
			element.className = "client_AudioSwitch";
			NowAudioMute = "false";
		}
		else
		{
			xml_SetClientInfo.Set("SetClientInfoDemo/ClientInfoLists/ClientInfo:1/SupportedAction/AudioMute", "true");
			xml_SetClientInfo.Set("SetClientInfoDemo/ClientInfoLists/ClientInfo:1/SupportedAction/AudioEnable", "");
			xml_SetClientInfo.Set("SetClientInfoDemo/ClientInfoLists/ClientInfo:1/SupportedAction/SmartPlugEnable", "");
			element.className = "client_AudioSwitch_off";
			NowAudioMute = "true";
		}
	}
	else
	{
		if (NowAudioMute == "true")
		{
			xml_SetClientInfo.Set("SetClientInfoDemo/ClientInfoLists/ClientInfo:1/SupportedAction/AudioMute", "false");
			xml_SetClientInfo.Set("SetClientInfoDemo/ClientInfoLists/ClientInfo:1/SupportedAction/AudioEnable", "");
			xml_SetClientInfo.Set("SetClientInfoDemo/ClientInfoLists/ClientInfo:1/SupportedAction/SmartPlugEnable", "");
			element.className = "client_AudioSwitch";
			NowAudioMute = "false";
		}
		else
		{
			xml_SetClientInfo.Set("SetClientInfoDemo/ClientInfoLists/ClientInfo:1/SupportedAction/AudioMute", "true");
			xml_SetClientInfo.Set("SetClientInfoDemo/ClientInfoLists/ClientInfo:1/SupportedAction/AudioEnable", "");
			xml_SetClientInfo.Set("SetClientInfoDemo/ClientInfoLists/ClientInfo:1/SupportedAction/SmartPlugEnable", "");
			element.className = "client_AudioSwitch_off";
			NowAudioMute = "true";
		}
	}
	var xml_SetClientInfoResult = HNAP.SetXML("SetClientInfoDemo", xml_SetClientInfo);
}
function client_DeviceConfig(GetValue)	{	clearTimeout(Time_ClientList);	}
function openWebUI(val)
{
	val = parseInt(val);
	var checkName = array2Dv[val - 1][0].substring(0,3);
	switch (checkName)
	{
		case "DNS":
			window.open("http://" + array2Dv[val - 1][2], "_blank");
			break;
		case "DCS":
			document.getElementById("ipcam_client").innerHTML = "";
			document.getElementById("IPCam_PW").value = "";
			document.getElementById("ipcampw").style.display = "table-row";
			document.getElementById("ipcamcheck").style.display = "table-row";
			document.getElementById("editPop2").style.display = "inline";
			document.getElementById("IPCam_Name").innerHTML = array2Dv[val - 1][0];
			document.getElementById("IPCam_address").value = array2Dv[val - 1][2];
			IPCam_address = document.getElementById("IPCam_address").value;
			break;
		case "DCH":
		case "DSP":
		case "None":
			break;
	}
}

function checkIPCamPW(addr)
{
	var CurrentIP = location.host;
	var IPCamDeviceIP = addr;
	var CurrentWanPort = "";
	var deviceIP = "";
	var devicePort = "";
	var IsWanIP = false;
	document.getElementById("ipcampw").style.display = "none";
	document.getElementById("ipcamcheck").style.display = "none";
	if (CurrentIP.search(".local") != -1 || CurrentIP.search("192.168") != -1)	{	deviceIP = "http://" + document.getElementById("IPCam_address").value + ":80";	}
	else
	{
		var xml_GetWanSettings = HNAP.GetXML("GetWanSettings");
		var xml_GetVirtualServerSettings = HNAP.GetXML("GetVirtualServerSettings");
		
		var getIPAddress = xml_GetWanSettings.Get("GetWanSettingsResponse/IPAddress");
		var GetVS_ListNumber = xml_GetVirtualServerSettings.Get("GetVirtualServerSettingsResponse/VirtualServerList/VirtualServerInfo#");
		for (var i = 1; i <= GetVS_ListNumber; i ++)
		{
			var GetVS_LocalIPAddress = xml_GetVirtualServerSettings.Get("GetVirtualServerSettingsResponse/VirtualServerList/VirtualServerInfo:" + i + "/LocalIPAddress");

			if (IPCamDeviceIP == GetVS_LocalIPAddress)
			{
				devicePort = xml_GetVirtualServerSettings.Get("GetVirtualServerSettingsResponse/VirtualServerList/VirtualServerInfo:" + i + "/ExternalPort");
				deviceIP = "http://" + getIPAddress + ":" + devicePort;
				IsWanIP = true;
			}
		}
	}
	var devicePW = document.getElementById("IPCam_PW").value;
	devicePW = Base64.encode("admin:") + Base64.encode(devicePW);
	var tmp = "";
	tmp = "<table border=\"0\" cellspacing=\"0\" cellpadding=\"0\">";
	tmp += "<tr>";
	tmp += "<td bgcolor=\"black\"><font color=\"white\"><label id=\"deviceName\"></label><br></font></td>";
	tmp += "</tr>";
	tmp = "<table border=\"0\" cellspacing=\"0\" cellpadding=\"0\">";
	tmp += "<tr>";
	tmp += "<td colspan=2 align=center bgcolor=\"white\">";
	tmp += "<applet name=\"cvcs\" codeBase=\"" + deviceIP + "\" archive=\"vplug.jar\" code=\"vplug.class\" width=480 height=360>";
	if (IsWanIP == false)	{	tmp += "<param name=\"RemotePort\" value=80>";	}
	else					{	tmp += "<param name=\"RemotePort\" value=\"" + devicePort + "\">";	}
	tmp += "<param name=\"Timeout\" value=5000>";
	tmp += "<param name=\"RotateAngle\" value=0>";
	tmp += "<param name=\"PreviewFrameRate\" value=2>";
	tmp += "<param name=\"Algorithm\" value=\"1\">";
	tmp += "<param name=\"DeviceSerialNo\" value=\"" + devicePW + "\">";
	tmp += "</applet>";
	tmp += "</td>";
	tmp += "</tr>";
	tmp += "</table>";
	tmp += "</table>";
	document.getElementById("ipcam_client").innerHTML = tmp;
}

function btnClickEvent(element, val)
{
	val = parseInt(val);
	var Mac = array2Dv[val - 1][1];
	var Nick = array2Dv[val - 1][9];
	var RevIP = array2Dv[val - 1][5];
	var AudioDLNA = array2Dv[val - 1][13];
	var AudioAirPlay = array2Dv[val - 1][14];
	var AudioMute = array2Dv[val - 1][15];
	var checkboxId =  element.id +'_ck';
	if (element.className == "checkbox_on")
	{
		var disable = I18N("j","Disabled");
		element.className = "checkbox_off";
		element.innerHTML='<input type="checkbox" name=' + element.id + ' id=' + checkboxId + ' checked>'+disable;
		document.getElementById(checkboxId).checked = false;
	}
	else
	{
		var enable = I18N("j","Enabled");
		element.className = "checkbox_on";
		element.innerHTML='<input type="checkbox" name=' + element.id + ' id=' + checkboxId + ' checked>'+enable;
		document.getElementById(checkboxId).checked = true;
	}
}

function UpdateSmartPlugWatt(val)
{
	var xml_Get_Clientinfo = HNAP.GetXML("GetClientInfoDemo");
	
	for (var i = 1; i <= Total_Clients; i ++)
	{
		var GetClientName = xml_Get_Clientinfo.Get("GetClientInfoDemoResponse/ClientInfoLists/ClientInfo:" + i + "/DeviceName");
		if (GetClientName == "DSP-W215")
		{
			var Watts = xml_Get_Clientinfo.Get("GetClientInfoDemoResponse/ClientInfoLists/ClientInfo:" + i + "/SupportedAction/SmartPlug_Watt");
			if (Watts != "")	{	document.getElementById("watt_Value").innerHTML = Watts + "w";	}
			break;
		}
	}
	Time_ClientSamrtPlugWatt = window.clearInterval(Time_ClientSamrtPlugWatt);
	Time_ClientSamrtPlugWatt = setTimeout("UpdateSmartPlugWatt('0')", 5000);
}