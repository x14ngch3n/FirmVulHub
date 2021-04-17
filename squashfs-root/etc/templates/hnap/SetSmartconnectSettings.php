HTTP/1.1 200 OK
Content-Type: text/xml; charset=utf-8

<?
echo "\<\?xml version='1.0' encoding='utf-8'\?\>";

include "/htdocs/phplib/xnode.php";
include "/htdocs/webinc/config.php";

$result = "OK";
$enable = get("","/runtime/hnap/SetSmartconnectSettings/Enabled");
$enable_gz = get("","/runtime/hnap/SetSmartconnectSettings/GZ_Enabled");

$path_guest = XNODE_getpathbytarget("", "phyinf", "uid", $WLAN1_GZ, 0);
$guest_is_active = query($path_guest."/active");	

$old_enable = query("/device/features/smartconnect");
$vlan_enable = query("/device/vlan/active");

if($enable == "true")
{
	set("/device/features/smartconnect", 1);
	if ($enable_gz == "true")
	{
		set("/device/features/smartconnect_gz", 1);
	}
	else
	{
		if($guest_is_active == 1)
			set("/device/features/smartconnect_gz", 1);
		else
			set("/device/features/smartconnect_gz", 0);
	}
}
else
{
	set("/device/features/smartconnect", 0);
	set("/device/features/smartconnect_gz", 0);
}

if($FEATURE_VLAN == "1" && $FEATURE_VLAN_SSID == "1" && $vlan_enable == "1" && $old_enable != $enable)
	$result = "REBOOT";

fwrite("w",$ShellPath, "#!/bin/sh\n");
fwrite("a",$ShellPath, "echo [$0] > /dev/console\n");
fwrite("a",$ShellPath, "event DBSAVE > /dev/console\n");
fwrite("a",$ShellPath, "xmldbc -k \"HNAP_SMARTCONNECT\"\n");
fwrite("a",$ShellPath, "xmldbc -t \"HNAP_SMARTCONNECT:3:service SMARTCONNECT restart\"\n");
//fwrite("a",$ShellPath, "service SMARTCONNECT restart > /dev/console\n");
fwrite("a",$ShellPath, "xmldbc -s /runtime/hnap/dev_status '' > /dev/console\n");
set("/runtime/hnap/dev_status", "ERROR");

?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
<soap:Body>
<SetSmartconnectSettingsResponse xmlns="http://purenetworks.com/HNAP1/">
	<SetSmartconnectSettingsResult><?=$result?></SetSmartconnectSettingsResult>
</SetSmartconnectSettingsResponse>
</soap:Body>
</soap:Envelope>

