<? include "/htdocs/phplib/html.php";
if($Remove_XML_Head_Tail != 1)	{HTML_hnap_200_header();}

$sch_reboot = "/device/schedule_reboot";
$result = "OK";
?>
<? if($Remove_XML_Head_Tail != 1)	{HTML_hnap_xml_header();}?>
	<GetScheduleRebootResponse xmlns="http://purenetworks.com/HNAP1/">
		<GetScheduleRebootResult><?=$result?></GetScheduleRebootResult>
<?
		$start_hour = cut(get("", $sch_reboot."/start"), 0, ":");
		$start_min = cut(get("", $sch_reboot."/start"), 1, ":");
		$end_hour = cut(get("", $sch_reboot."/end"), 0, ":");
		$end_min = cut(get("", $sch_reboot."/end"), 1, ":");

		if(get("", $sch_reboot."/format")=="24")
		{
			$ScheduleTimeFormat = "true";
			$StartTimeMidDate = "false";
			$EndTimeMidDate = "false";
		}
		else
		{
			$ScheduleTimeFormat = "false";
			if($start_hour >= 12)
			{
				$start_hour = $start_hour -12;
				$end_hour = $end_hour -12;
				$StartTimeMidDate = "true";
				$EndTimeMidDate = "true";
			}
			else if($end_hour >= 12)
			{
				$end_hour = $end_hour -12;
				$StartTimeMidDate = "false";
				$EndTimeMidDate = "true";
			}
			else
			{
				$StartTimeMidDate = "false";
				$EndTimeMidDate = "false";
			}
		}

		echo "\t\t<Schedule>\n";
		echo "\t\t\t<ScheduleName></ScheduleName>\n";

		echo "\t\t\t<ScheduleInfo>\n";
		echo "\t\t\t\t<ScheduleDate>".query($sch_reboot."/date")."</ScheduleDate>\n";
		echo "\t\t\t\t<ScheduleAllDay>false</ScheduleAllDay>\n";
		echo "\t\t\t\t<ScheduleTimeFormat>".$SchduleTimeFormat."</ScheduleTimeFormat>\n";

		echo "\t\t\t\t<ScheduleStartTimeInfo>\n";
		echo "\t\t\t\t\t<TimeHourValue>".$start_hour."</TimeHourValue>\n";
		echo "\t\t\t\t\t<TimeMinuteValue>".$start_min."</TimeMinuteValue>\n";
		echo "\t\t\t\t\t<TimeMidDateValue>".$StartTimeMidDate."</TimeMidDateValue>\n";
		echo "\t\t\t\t</ScheduleStartTimeInfo>\n";

		echo "\t\t\t\t<ScheduleEndTimeInfo>\n";
		echo "\t\t\t\t\t<TimeHourValue>".$end_hour."</TimeHourValue>\n";
		echo "\t\t\t\t\t<TimeMinuteValue>".$end_min."</TimeMinuteValue>\n";
		echo "\t\t\t\t\t<TimeMidDateValue>".$EndTimeMidDate."</TimeMidDateValue>\n";
		echo "\t\t\t\t</ScheduleEndTimeInfo>\n";
		echo "\t\t\t</ScheduleInfo>\n";

		echo "\t\t</Schedule>\n";
?>
	</GetScheduleRebootResponse>
<? if($Remove_XML_Head_Tail != 1)	{HTML_hnap_xml_tail();}?>
