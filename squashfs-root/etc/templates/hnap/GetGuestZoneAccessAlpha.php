<? include "/htdocs/phplib/html.php";
if($Remove_XML_Head_Tail != 1)
{
	HTML_hnap_200_header();
	HTML_hnap_xml_header();
}
?>
<GetGuestZoneAccessAlphaResponse xmlns="http://purenetworks.com/HNAP1/">
	<GetGuestZoneAccessAlphaResult>OK</GetGuestZoneAccessAlphaResult>
<?
function cmd($c)
{ echo $c."\n"; }

$nodepath = "/acl/obfilter3";

$policy = get("x", $nodepath."/policy");
cmd("\t<Policy>".$policy."</Policy>");

$cnt = get("x", $nodepath."/count");
cmd("\t<GuestZoneAccessLists>");
foreach ($nodepath."/entry")
{
	if ($InDeX > $cnt)
	{ break; }
	$enable = get("x", $nodepath."/entry:".$InDeX."/enable");
	if ($enable == "1")
		{$enable = "True"; }
	else
		{ $enable = "False"; }

	$startIP = get("x", $nodepath."/entry:".$InDeX."/dst/host/start");
	$endIP = get("x", $nodepath."/entry:".$InDeX."/dst/host/end");

	cmd("\t<GuestZoneAccess>");
	cmd("\t\t<Enable>".$enable."</Enable>");
	cmd("\t\t<StartIP>".$startIP."</StartIP>");
	cmd("\t\t<EndIP>".$endIP."</EndIP>");
	cmd("\t</GuestZoneAccess>");
}
cmd("\t</GuestZoneAccessLists>");
?></GetGuestZoneAccessAlphaResponse>
<? if($Remove_XML_Head_Tail != 1)	{HTML_hnap_xml_tail();}?>
