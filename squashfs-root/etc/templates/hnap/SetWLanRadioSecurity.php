HTTP/1.1 200 OK
Content-Type: text/xml; charset=utf-8

<?
echo "\<\?xml version='1.0' encoding='utf-8'\?\>";
include "/htdocs/phplib/xnode.php";
include "/htdocs/phplib/encrypt.php";
include "/htdocs/webinc/config.php";
include "/htdocs/phplib/trace.php";

function bsd_wificonfig_from_24g($wlan, $src)
{
	$path_phyinf_wlan = XNODE_getpathbytarget("", "phyinf", "uid", $wlan, 0);
	$path_wlan_wifi = XNODE_getpathbytarget("/wifi", "entry", "uid", query($path_phyinf_wlan."/wifi"), 0);
	$path_phyinf_src = XNODE_getpathbytarget("", "phyinf", "uid", $src, 0);
	$path_src_wifi = XNODE_getpathbytarget("/wifi", "entry", "uid", query($path_phyinf_src."/wifi"), 0);

	$24g_encrtype = query($path_src_wifi."/encrtype");
	$24g_authtype   = query($path_src_wifi."/authtype");

	TRACE_debug("bsd_wificonfig_from_24g: wlan=".$wlan);
	TRACE_debug("bsd_wificonfig_from_24g: path_src_wifi=".$path_src_wifi);
	TRACE_debug("bsd_wificonfig_from_24g: 24g_encrtype=".$24g_encrtype);
	TRACE_debug("bsd_wificonfig_from_24g: 24g_authtype=".$24g_authtype);    

	if($24g_encrtype != "")
		set($path_wlan_wifi."/encrtype", $24g_encrtype);
	if($24g_authtype != "")
		set($path_wlan_wifi."/authtype", $24g_authtype);

	if($24g_encrtype != "NONE")
	{
		if($24g_encrtype == "WEP")
		{
			$24g_defKey = query($path_src_wifi."/nwkey/wep/defkey");
			$24g_key = query($path_src_wifi."/nwkey/wep/key:".$24g_defKey);

			if($24g_defKey != "")
				set($path_wlan_wifi."/nwkey/wep/defkey", $24g_defKey);
			if($24g_key != "")
				set($path_wlan_wifi."/nwkey/wep/key:".$24g_defKey, $24g_key);

			$size = get("", $path_src_wifi."/nwkey/wep/size");
			if($size != "")
				set($path_wlan_wifi."/nwkey/wep/size", $size);

			$ascii = get("", $path_src_wifi."/nwkey/wep/ascii");
			if($ascii != "")
				set($path_wlan_wifi."/nwkey/wep/ascii", $ascii);
		}
		else if($24g_authtype == "WPA+2PSK")
		{
			$24g_key = query($path_src_wifi."/nwkey/psk/key");
			$24g_passphrase = query($path_src_wifi."/nwkey/psk/passphrase");
			if($24g_key != "")
				set($path_wlan_wifi."/nwkey/psk/key", $24g_key);
			if($24g_passphrase != "")
				set($path_wlan_wifi."/nwkey/psk/passphrase", $24g_passphrase);
		}
	}
}
/*$nodebase="/runtime/hnap//SetWLanRadioSecurity/";

if( query($nodebase."RadioID") == "2.4GHZ" || query($nodebase."RadioID") == "RADIO_24GHz")
{	$path_phyinf_wlan = XNODE_getpathbytarget("", "phyinf", "uid", $WLAN1, 0);	}
if( query($nodebase."RadioID") == "5GHZ" || query($nodebase."RadioID") == "RADIO_5GHz")
{	$path_phyinf_wlan = XNODE_getpathbytarget("", "phyinf", "uid", $WLAN2, 0);	}
$path_wlan_wifi = XNODE_getpathbytarget("/wifi", "entry", "uid", query($path_phyinf_wlan."/wifi"), 0);

anchor($path_wlan_wifi);
$result = "REBOOT";
if( query($nodebase."RadioID") != "2.4GHZ" &&
	query($nodebase."RadioID") != "5GHZ" &&
	query($nodebase."RadioID") != "RADIO_24GHz" &&
	query($nodebase."RadioID") != "RADIO_5GHz" )
{
	
	$result = "ERROR_BAD_RADIOID";
}
else
*/

$nodebase="/runtime/hnap/SetWLanRadioSecurity/";
$RadioID = query($nodebase."RadioID");

$smartconnect_enable = query("/device/features/smartconnect");
$smartconnect_gz_enable = query("/device/features/smartconnect_gz");

if( $RadioID == "2.4GHZ" || $RadioID == "RADIO_24GHz" || $RadioID == "RADIO_2.4GHz"){
    $path_phyinf_wlan = XNODE_getpathbytarget("", "phyinf", "uid", $WLAN1, 0);
    $result = "OK";
}
else if( $RadioID == "5GHZ" || $RadioID == "RADIO_5GHz"){
    $path_phyinf_wlan = XNODE_getpathbytarget("", "phyinf", "uid", $WLAN2, 0);
    $result = "OK";
}
else if( $RadioID == "RADIO_2.4G_Guest" || $RadioID == "RADIO_2.4GHz_Guest"){
	$path_phyinf_wlan = XNODE_getpathbytarget("", "phyinf", "uid", $WLAN1_GZ, 0);
	$result = "OK";
} 
else if( $RadioID == "RADIO_5G_Guest" || $RadioID == "RADIO_5GHz_Guest"){
	$path_phyinf_wlan = XNODE_getpathbytarget("", "phyinf", "uid", $WLAN2_GZ, 0);
	$result = "OK";
}
else {$result = "ERROR_BAD_RADIOID";}


$path_wlan_wifi = XNODE_getpathbytarget("/wifi", "entry", "uid", query($path_phyinf_wlan."/wifi"), 0);
anchor($path_wlan_wifi);

if($result == "OK")
{
	if(query($nodebase."Enabled") == "false" )
	{
		set("encrtype","NONE");
		set("authtype","OPEN");
	}
	else
	{
		$type = query($nodebase."Type");
		$encrypt = query($nodebase."Encryption");
		$key = query($nodebase."Key");
		$key = AES_Decrypt128($key);
		$keyRenewal = query($nodebase."KeyRenewal");
		$radiusIP1 = query($nodebase."RadiusIP1");
		$radiusPort1 = query($nodebase."RadiusPort1");
		$radiusSecret1 = query($nodebase."RadiusSecret1");
		$radiusSecret1 = AES_Decrypt128($radiusSecret1);
		$radiusIP2 = query($nodebase."RadiusIP2");
		$radiusPort2 = query($nodebase."RadiusPort2");
		$radiusSecret2 = query($nodebase."RadiusSecret2");
		$radiusSecret2 = AES_Decrypt128($radiusSecret2);
		if( $type == "WEP-OPEN" || $type == "WEP-SHARED" || $type == "WEP-AUTO")
		{
			if( $encrypt == "WEP-64" )
			{
				$wepLen = 64;
			}
			else if( $encrypt == "WEP-128" )
			{
				$wepLen = 128;
			}
			else
			{
				$result = "ERROR_ENCRYPTION_NOT_SUPPORTED";
			}
			if( $type == "WEP-OPEN" )
			{
				$auth = "OPEN";
			}
			if( $type == "WEP-AUTO" )
			{
				$auth = "WEPAUTO";
			}			
			else
			{
				$auth = "SHARED";
			}
			//The WEP key should be 5 ASCII or 13 hex digits for 64 bit or 10 ASCII or 26 hex digits for 128 bit.
			if( $key == "" )
			{ $result = "ERROR_ILLEGAL_KEY_VALUE"; }
			else
			{
				$keyLen = strlen($key);
				if(isprint($key)==1 && $keyLen==5 && $wepLen==64) { $ascii = "1";}
				else if(isprint($key)==1 && $keyLen==13 && $wepLen==128) { $ascii = "1";}
				else if(isxdigit($key)==1 && $keyLen==10 && $wepLen==64) { $ascii = "0";}
				else if(isxdigit($key)==1 && $keyLen==26 && $wepLen==128) { $ascii = "0";}
				else {$result = "ERROR_ILLEGAL_KEY_VALUE";}
			}
			if($result == "OK")
			{
				set("wps/configured", "1");
				set("authtype", $auth);
				set("encrtype","WEP");
				set("nwkey/wep/size", $wepLen);
				set("nwkey/wep/ascii", $ascii);
				set("nwkey/wep/defkey", "1"); 
				$defKey = query("nwkey/wep/defkey");
				set("nwkey/wep/key:".$defKey, $key);
			}
		}
		else if( $type == "WPA-PSK" || $type == "WPA2-PSK" || $type == "WPAORWPA2-PSK" )
		{
			if( $keyRenewal == "" )
			{
				$result = "ERROR_KEY_RENEWAL_BAD_VALUE";
			}
			//more strict
			if( $keyRenewal < 60 || $keyRenewal > 7200 )
			{
				$result = "ERROR_KEY_RENEWAL_BAD_VALUE";
			}
			if( $key == "" )
			{
				$result = "ERROR_ILLEGAL_KEY_VALUE";
			}
			if( $encrypt != "TKIP" && $encrypt != "AES" && $encrypt != "TKIPORAES" )
			{
				$result = "ERROR_ENCRYPTION_NOT_SUPPORTED";
			}
			if( $type == "WPA-PSK" )
			{ $auth = "WPAPSK"; }
			else if( $type == "WPA2-PSK" )
			{ $auth = "WPA2PSK"; }
			else
			{ $auth = "WPA+2PSK"; }
			if( $encrypt == "TKIP" )
			{ $encrypttype = "TKIP"; }
			else if( $encrypt == "AES" )
			{ $encrypttype = "AES"; }
			else
			{ $encrypttype = "TKIP+AES"; }
			if($result == "OK")
			{
				set("wps/configured", "1");
				set("authtype",$auth);
				set("encrtype",$encrypttype);
				set("nwkey/wep/ascii","1");
				set("nwkey/psk/key",$key);
				set("nwkey/psk/passphrase", "1");
				set("nwkey/wpa/groupintv",$keyRenewal);
			}
		}
		else if( $type == "WPA-RADIUS" || $type == "WPA2-RADIUS" || $type == "WPAORWPA2-RADIUS" )
		{
			if( $keyRenewal == "" )
			{
				$result = "ERROR_KEY_RENEWAL_BAD_VALUE";
			}
			//more strict
			if( $keyRenewal < 60 || $keyRenewal > 7200 )
			{
				$result = "ERROR_KEY_RENEWAL_BAD_VALUE";
			}
			if( $encrypt != "TKIP" && $encrypt != "AES" && $encrypt != "TKIPORAES" )
			{
				$result = "ERROR_ENCRYPTION_NOT_SUPPORTED";
			}
			if( $radiusIP1 == "" || $radiusPort1 == "" || $radiusSecret1 == "" )
			{
				$result = "ERROR_BAD_RADIUS_VALUES";
			}
			if( $type == "WPA-RADIUS" )
			{ $auth = "WPA"; }
			else if( $type == "WPA2-RADIUS" )
			{ $auth = "WPA2"; }
			else
			{ $auth = "WPA+2"; }
			if( $encrypt == "TKIP" )
			{ $encrypttype = "TKIP"; }
			else if( $encrypt == "AES" )
			{ $encrypttype = "AES"; }
			else
			{ $encrypttype = "TKIP+AES"; }
			if($result == "OK")
			{
				set("wps/configured", "1");
				set("authtype",$auth);
				set("encrtype",$encrypttype);
				set("nwkey/wep/ascii","1");
				set("nwkey/eap/radius",$radiusIP1);
				set("nwkey/eap/port",$radiusPort1);
				set("nwkey/eap/secret",$radiusSecret1);
				set("nwkey/eap/radius2",$radiusIP2);
				set("nwkey/eap/port2",$radiusPort2);
				set("nwkey/eap/secret2",$radiusSecret2);
				set("nwkey/wpa/groupintv",$keyRenewal);
			}
		}
		else
		{
			$result = "ERROR_TYPE_NOT_SUPPORT";
		}
	}
}

if($smartconnect_enable == 1)
	bsd_wificonfig_from_24g($WLAN2, $WLAN1);
if($smartconnect_gz_enable == 1)
	bsd_wificonfig_from_24g($WLAN2_GZ, $WLAN1_GZ);

//---longlay(20131113), enable wps funcion by "encryption setting" and "broadcast SSID setting"
$encr_check_wlan1 = XNODE_getpathbytarget("", "phyinf", "uid", $WLAN1, 0);
$encr_check_wlan2 = XNODE_getpathbytarget("", "phyinf", "uid", $WLAN2, 0);
$encr_wifi_wlan1 = XNODE_getpathbytarget("/wifi", "entry", "uid", query($encr_check_wlan1."/wifi"), 0);
$encr_wifi_wlan2 = XNODE_getpathbytarget("/wifi", "entry", "uid", query($encr_check_wlan2."/wifi"), 0);

$wps=1;
if (query($encr_check_wlan1."/active")==1)
{
	if (query($encr_wifi_wlan1."/encrtype")=="WEP" || query($encr_wifi_wlan1."/encrtype")=="TKIP" || query($encr_wifi_wlan1."/ssidhidden")==1) {$wps=0;}
}
if (query($encr_check_wlan2."/active")==1)
{
	if (query($encr_wifi_wlan2."/encrtype")=="WEP" || query($encr_wifi_wlan2."/encrtype")=="TKIP" || query($encr_wifi_wlan2."/ssidhidden")==1) {$wps=0;}
}
if($encr_wifi_wlan1!=""){set($encr_wifi_wlan1."/wps/enable", $wps);}
if($encr_wifi_wlan2!=""){set($encr_wifi_wlan2."/wps/enable", $wps);}
//----longlay(20131113)

fwrite("w",$ShellPath, "#!/bin/sh\n");
fwrite("a",$ShellPath, "echo \"[$0]-->WLan Change\" > /dev/console\n");
if($result == "OK")
{
	fwrite("a",$ShellPath, "event DBSAVE > /dev/console\n");
	fwrite("a",$ShellPath, "xmldbc -k \"HNAP_".$SRVC_WLAN."\"\n");
	fwrite("a",$ShellPath, "xmldbc -t \"HNAP_".$SRVC_WLAN.":3:service ".$SRVC_WLAN." restart\"\n");
	fwrite("a",$ShellPath, "xmldbc -s /runtime/hnap/dev_status '' > /dev/console\n");
	set("/runtime/hnap/dev_status", "ERROR");
}
else
{
	fwrite("a",$ShellPath, "echo \"We got a error in setting, so we do nothing...\" > /dev/console");
}
?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <SetWLanRadioSecurityResponse xmlns="http://purenetworks.com/HNAP1/">
      <SetWLanRadioSecurityResult><?=$result?></SetWLanRadioSecurityResult>
    </SetWLanRadioSecurityResponse>
  </soap:Body>
</soap:Envelope>
