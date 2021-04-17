<? /* vi: set sw=4 ts=4: */
include "/htdocs/phplib/trace.php";
include "/htdocs/phplib/xnode.php";

function exec_cmd($cmd)
{
	TRACE_debug("exec_cmd=".$cmd);
    $ext_node="/runtime/usb_usage_monitor/ext_node";
    setattr($ext_node, "get", $cmd);
	$ret = get("x", $ext_node);
	del($ext_node);
	return $ret;
}

function kick_monitor()
{
	event("KILL_USB_USAGE_MONITOR");
}

function trigger_monitor($timeout)
{
	//$cmd = "xmldbc -t USB_USAGE_MONITOR:".$timeout.":\"/tmp/usb_usage_monitor.sh\"";
	event("START_USB_USAGE_MONITOR");
	//exec_cmd($cmd);
}

//kick_monitor();
$disk_back = "/runtime/device/storage";
$dev_entry = $disk_back."/disk";
$count = get("x", $disk_back."/count");

TRACE_debug("USB_USAGE_MONITOR");
if($count == "0")  //no disk
{
	return 0;
}
else
{
	TRACE_debug("USB_USAGE_MONITOR start");
	$idx=0;
	foreach($dev_entry)
	{
		$idx=$idx+1;
		
		foreach ($dev_entry.":".$idx."/entry")
		{
			$prefix = get("x", "prefix");
			$pid = get("x", "pid");
			if ($pid=="0"){	$dev = $prefix; }
			else { $dev = $prefix.$pid; }
			$cmd = "df|scut -p".$dev." -f2";
			$used=exec_cmd($cmd);
			$old_used= get("x", "space/used");
			if($old_used != $used){ set("space/used", $used); }
			TRACE_debug("used=".$used);
			$cmd = "df|scut -p".$dev." -f3";
			$available=exec_cmd($cmd);
			$old_available= get("x", "space/available");
			if($old_available != $available){ set("space/available", $available); }
			TRACE_debug("available=".$available);
		}
	}
	trigger_monitor(0);
}
?>
