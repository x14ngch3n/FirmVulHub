<?
include "/htdocs/phplib/trace.php";

fwrite("w",$START, "#!/bin/sh\n");
fwrite("w",$STOP,  "#!/bin/sh\n");

function startcmd($cmd)	{fwrite(a,$_GLOBALS["START"], $cmd."\n");}
function stopcmd($cmd)	{fwrite(a,$_GLOBALS["STOP"], $cmd."\n");}
function error($errno)	{startcmd("exit ".$errno); stopcmd( "exit ".$errno);}

$sch_reboot_path = "/device/schedule_reboot";
$time_path = "/runtime/time";

$time_state = query("/runtime/device/timestate");

if($time_state != "SUCCESS")
{
	startcmd("# Time state not ready!");
}
else
{
	//Get schedule time
	$start = get("", $sch_reboot_path."/start");
	$end = get("", $sch_reboot_path."/end");

	//Transfer 09 to 9 and so on
	$start_hour = dec2strf('%d', cut($start, 0, ":"));
	$start_min = dec2strf('%d', cut($start, 1, ":"));

	//Get current time
	$current_time = get("", $time_path."/time");

	$curr_hour = dec2strf('%d', cut($current_time, 0, ":"));
	$curr_min = dec2strf('%d', cut($current_time, 1, ":"));

	startcmd("# sch start ".$start_hour.":".$start_min);
	startcmd("# current time ".$curr_hour.":".$curr_min);
	if($start_hour == $curr_hour && $start_min == $curr_min)
	{
		startcmd("event REBOOT");
	}
}

error(0);
?>
