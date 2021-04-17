HTTP/1.1 200 OK
Content-Type: text/xml; charset=utf-8

<?
echo "\<\?xml version='1.0' encoding='utf-8'\?\>";

include "/htdocs/phplib/xnode.php";
include "/htdocs/webinc/config.php";
include "/htdocs/phplib/trace.php"; 

$result = "OK";
$enable = get("",$nodebase."Enabled");
$enable_gz = get("",$nodebase."GZ_Enabled");

$path_guest = XNODE_getpathbytarget("", "phyinf", "uid", $WLAN1_GZ, 0);
$guest_is_active = query($path_guest."/active");	

TRACE_debug("SetSmartconnectSettings - enable = ".$enable);
TRACE_debug("SetSmartconnectSettings - enable_gz = ".$enable_gz);

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
}

fwrite("w",$ShellPath, "#!/bin/sh\n");
fwrite("a",$ShellPath, "echo \"[$0]-->Smart Connect Change\" > /dev/console\n");
if($result=="OK")
{
	fwrite("a",$ShellPath, "service SMARTCONNECT restart > /dev/console\n");
}
else
{
	fwrite("a",$ShellPath, "echo \"We got a error in setting, so we do nothing...\" > /dev/console");
}
?>
