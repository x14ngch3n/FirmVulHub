HTTP/1.1 200 OK
Content-Type: text/xml; charset=utf-8

<?
echo "\<\?xml version='1.0' encoding='utf-8'\?\>";
include "/htdocs/webinc/config.php";
include "/htdocs/phplib/xnode.php";

$nodebase = "/runtime/hnap/SetScheduleReboot";
$node_sch_info = $nodebase."/Schedule/ScheduleInfo";
$sch_reboot = "/device/schedule_reboot";
$result = "OK";

/*
$date = ""  -> means Never
      = 0   -> every day
      = 1~7 -> each day
*/
$date = get("", $node_sch_info."/ScheduleDate");
if($date < 0 || $date > 7) { $date = ""; }
set($sch_reboot."/date", $date);

if($date != "")
{
	if (get("", $node_sch_info."/ScheduleAllDay") == "false")
	{
		$start_hour = get("", $node_sch_info."/ScheduleStartTimeInfo/TimeHourValue");
		$start_min = get("", $node_sch_info."/ScheduleStartTimeInfo/TimeMinuteValue");

		//end time should more than start time
		$end_hour = $start_hour;
		$end_min = $start_min + 1;
		if($end_min == 60) { $end_min = "00"; $end_hour = $end_hour + 1; }

		if (get("", $node_sch_info."/ScheduleTimeFormat") == "true")
		{
			/* 24 hours */
			set($sch_reboot."/format", 24);
		}
		else
		{
			/* 12 hours */
			set($sch_reboot."/format", 12);

			$start_mid = get("", $node_sch_info."/ScheduleStartTimeInfo/TimeMidDateValue");
			if ($start_mid == "true") //PM
			{
				$start_hour = $start_hour + 12;
			}
			else if ($start_mid == "false") //AM
			{
				if ($end_mid == "true") //PM
				{$end_hour = $end_hour + 12;}
			}
		}
		$start_time = $start_hour.":".$start_min;
		$end_time = $end_hour.":".$end_min;
		set($sch_reboot."/start", $start_time);
		set($sch_reboot."/end", $end_time);
	}
	else { $result = "ERROR_BAD_ScheduleInfo"; }
}

fwrite("w",$ShellPath, "#!/bin/sh\n");
fwrite("a",$ShellPath, "echo \"[$0]-->Schedule Settings\" > /dev/console\n");
if($result == "OK" || $result == "REBOOT")
{
	fwrite("a",$ShellPath, "event DBSAVE > /dev/console\n");
	fwrite("a",$ShellPath, "service SCH_REBOOT restart > /dev/console\n");
	fwrite("a",$ShellPath, "xmldbc -s /runtime/hnap/dev_status '' > /dev/console\n");
	set("/runtime/hnap/dev_status", "ERROR");
}
else
{
	fwrite("a",$ShellPath, "echo \"We got a error in setting, so we do nothing...\" > /dev/console");
}

?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns:xsd="http://www.w3.org/2001/XMLSchema"
	xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
	<soap:Body>
	<SetScheduleRebootResponse xmlns="http://purenetworks.com/HNAP1/">
	<SetScheduleRebootResult><?=$result?></SetScheduleRebootResult>
	</SetScheduleRebootResponse>
	</soap:Body>
</soap:Envelope>
