<?
include "/htdocs/phplib/trace.php";
include "/htdocs/phplib/xnode.php";

function startcmd($cmd)	{fwrite(a,$_GLOBALS["START"], $cmd."\n");}
function stopcmd($cmd)	{fwrite(a,$_GLOBALS["STOP"], $cmd."\n");} 

fwrite(w,$_GLOBALS["START"], "#!/bin/sh\n");
fwrite(w,$_GLOBALS["STOP"], "#!/bin/sh\n"); 

startcmd("service UPNPAV stop");
startcmd("service ITUNES stop");
startcmd("service NETATALK stop");
startcmd("service SAMBA stop");
//startcmd("phpsh /etc/scripts/webaccess_map.php");
startcmd("service WEBACCESS stop");

startcmd("service UPNPAV start");
startcmd("service ITUNES start");
startcmd("service NETATALK start");
startcmd("service SAMBA start");
/* when usb mount/umount need to update web file access map table, UI don't need */ 
startcmd("phpsh /etc/scripts/webaccess_map.php");
startcmd("service WEBACCESS start");


$disk_back = "/runtime/device/storage";
$dev_entry = $disk_back."/disk";
$count = get("x", $disk_back."/count");

//usb usage monitor 
TRACE_debug("kick USB_USAGE_MONITOR");
event("KILL_USB_USAGE_MONITOR");
startcmd("event KILL_USB_USAGE_MONITOR remove default");
startcmd("event START_USB_USAGE_MONITOR remove default");

if($count == "0" && $count != "")  //no disk
{
	return 0;
}
else
{
	TRACE_debug("trigger USB_USAGE_MONITOR");
	startcmd("event KILL_USB_USAGE_MONITOR add \"xmldbc -k USB_STORAGE_MONITOR\"");
	startcmd("event START_USB_USAGE_MONITOR add \"xmldbc -t USB_STORAGE_MONITOR:60:'phpsh /etc/scripts/usb_usage_monitor.php'\"");
	startcmd("event START_USB_USAGE_MONITOR");
}

?>
