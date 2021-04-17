<? include "/htdocs/phplib/html.php";
if($Remove_XML_Head_Tail != 1)	{HTML_hnap_200_header();}

$result = "OK";

?>
<? if($Remove_XML_Head_Tail != 1)	{HTML_hnap_xml_header();}?>
		<GetFacebookWiFiSettingsResponse xmlns="http://purenetworks.com/HNAP1/">
			<GetFacebookWiFiSettingsResult><?=$result?></GetFacebookWiFiSettingsResult>
			<Enabled><?echo map("/wifidog/enable", "1", "true", "*", "false");?></Enabled>
			<guestzoneenable><?echo map("/wifidog/guestzoneenable", "1", "true", "*", "false");?></guestzoneenable>
			<gwname><?echo get("x", "/wifidog/gwname");?></gwname>
			<gwvendorkey><?echo get("x", "/wifidog/gwvendorkey");?></gwvendorkey>
			<gwid><?echo get("x", "/wifidog/gwid");?></gwid>
			<gwsecret><?echo get("x", "/wifidog/gwsecret");?></gwsecret>
		</GetFacebookWiFiSettingsResponse>
<? if($Remove_XML_Head_Tail != 1)	{HTML_hnap_xml_tail();}?>