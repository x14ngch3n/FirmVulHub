<? include "/htdocs/phplib/html.php";
if($Remove_XML_Head_Tail != 1)	{HTML_hnap_200_header();}

$result = "OK";

$hnap_path = "/runtime/hnap/SetGuestZoneAccessAlpha";
$db_path = "/acl/obfilter3";
$policy = get("x", $hnap_path."/Policy");

if ($policy != "ACCEPT" && $policy != "DENY")
	{ $result = "ERROR"; }

if ($result == "OK")
{
	// Set the default policy.
	set ($db_path."/policy", $policy);

	//Clear all original rules.
	$cnt = get("", $db_path."/count");
	while ($cnt > 0)
	{
		del ($db_path."/entry");
		$cnt = $cnt -1;
	}

	// Copy entries from hnap to our dbnode.
	set ($db_path."/seqno", "1");
	$cnt = 0;
	foreach ($hnap_path."/GuestZoneAccessLists/GuestZoneAccess")
	{
		// Set seqno and count.
		$cnt = $cnt + 1;
		set ($db_path."/seqno", $cnt +1);
		set ($db_path."/count", $cnt);

		if ($policy == "ACCEPT") { $policy = "ACCEPT"; }
		else if ($policy == "DENY") { $policy = "DROP" ; }

		// Get information in hnap.
		$enable = get("x", "Enable");
		$startIP = get("x", "StartIP");
		$endIP = get("x", "EndIP");

		// Transfer true/false format.
		if ($enable == "True") { $enable = "1"; }
		else { $enable = "0"; }

		// Set to dbnode.
		set ($db_path."/entry:".$cnt."/uid", "FWL-".$cnt);
		set ($db_path."/entry:".$cnt."/enable", $enable);
		set ($db_path."/entry:".$cnt."/policy", $policy);
		set ($db_path."/entry:".$cnt."/protocol", "ALL");
		set ($db_path."/entry:".$cnt."/src/inf","LAN-2" );
		set ($db_path."/entry:".$cnt."/dst/host/start", $startIP);
		set ($db_path."/entry:".$cnt."/dst/host/end", $endIP);
	}
}

if ($result == "OK")
{
	fwrite("a",$ShellPath, "event DBSAVE > /dev/console\n");
	fwrite("a",$ShellPath, "service IPTOBF restart > /dev/console\n");
	fwrite("a",$ShellPath, "xmldbc -s /runtime/hnap/dev_status '' > /dev/console\n");
	set("/runtime/hnap/dev_status", "ERROR");
}

?>
<? if($Remove_XML_Head_Tail != 1)	{HTML_hnap_xml_header();}?>
		<SetGuestZoneAccessAlphaResponse>
			<SetGuestZoneAccessAlphaResult><?=$result?></SetGuestZoneAccessAlphaResult>
		</SetGuestZoneAccessAlphaResponse>
<? if($Remove_XML_Head_Tail != 1)	{HTML_hnap_xml_tail();}?>
