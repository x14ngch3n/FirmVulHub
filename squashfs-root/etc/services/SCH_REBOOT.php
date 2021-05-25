<?
include "/htdocs/phplib/trace.php";

fwrite("w",$START, "#!/bin/sh\n");
fwrite("w",$STOP,  "#!/bin/sh\n");

function startcmd($cmd)	{fwrite(a,$_GLOBALS["START"], $cmd."\n");}
function stopcmd($cmd)	{fwrite(a,$_GLOBALS["STOP"], $cmd."\n");}
function error($errno)	{startcmd("exit ".$errno); stopcmd( "exit ".$errno);}

// Ref XNODE_getschedule2013cmd()
function getScheduleRebootcmd($sch_reboot)
{
	$sch_cmd = "schedule_2013";
	$sch_comma = "";
	$sch_all = "";
	$sch = "";
	$cross_day = 0;
	$day = 0;

	$start = get("", $sch_reboot."/start");
	$end = get("", $sch_reboot."/end");

	//Transfer 09 to 9 and so on
	$start_hour = dec2strf('%d', cut($start, 0, ":"));
	$start_min = dec2strf('%d', cut($start, 1, ":"));

	//Cross a next day
	if($end == "24:00")
	{
		$cross_day = 1;
		$end_hour = 0;
		$end_min = 0;
	}
	else
	{
		$end_hour = dec2strf('%d', cut($end, 0, ":"));
		$end_min = dec2strf('%d', cut($end, 1, ":"));
	}

	$date = get("", $sch_reboot."/date");
	if($date == "") { return "stop"; }
	else if($date == "0") //every day
	{
		$i = 0;
		while($i < 7)
		{
			$day = $i;
			
			$start = $day."-".$start_hour."-".$start_min;

			if($cross_day == 1) { $day = $day + 1; }
			if($day == 7) { $day = 0; }

			$end = $day."-".$end_hour."-".$end_min;

			$sch = $start.",".$end;
			$sch = $sch_comma.$sch;
			$sch_comma = ",";
			$sch_all = $sch_all.$sch;

			$i = $i + 1;
		}
	}
	else
	{
		// 7 is sunday in HNAP Spec. and 0 is sunday in Seattle.
		if($date == "7") { $day = 0; }
		else             { $day = $date; }
		
		$start = $day."-".$start_hour."-".$start_min;

		if($cross_day == 1) { $day = $day + 1; }
		if($day == 7) { $day = 0; }

		$end = $day."-".$end_hour."-".$end_min;

		$sch = $start.",".$end;
		$sch_all = $sch_all.$sch;
	}

	$sch_cmd = $sch_cmd.' "'.$sch_all.'"';
	return $sch_cmd;
}

// Main entrypoint
$sch_reboot_path = "/device/schedule_reboot";

startcmd("service SCH_REBOOT_ACTIVE ".getScheduleRebootcmd($sch_reboot_path));

error(0);
?>
