HTTP/1.1 200 OK
Content-Type: text/xml; charset=utf-8

<?
echo "\<\?xml version='1.0' encoding='utf-8'\?\>";
include "/htdocs/webinc/config.php";
include "/htdocs/phplib/inet.php";

$nodebase = "/runtime/hnap/SetFacebookWiFiSettings/";
$result = "OK";

set("/wifidog/enable", map($nodebase."Enabled", "true", 1, "*", 0));
set("/wifidog/guestzoneenable", map($nodebase."guestzoneenable", "true", 1, "*", 0));

fwrite("w",$ShellPath, "#!/bin/sh\n");
fwrite("a",$ShellPath, "echo \"[$0]-->FacebookWiFi Settings\" > /dev/console\n");

if($result=="OK")
{
	fwrite("a",$ShellPath, "event DBSAVE > /dev/console\n");
	fwrite("a",$ShellPath, "service WIFIDOG restart > /dev/console\n");
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
		<SetFacebookWiFiSettingsResponse xmlns="http://purenetworks.com/HNAP1/">
			<SetFacebookWiFiSettingsResult><?=$result?></SetFacebookWiFiSettingsResult>
		</SetFacebookWiFiSettingsResponse>
	</soap:Body>
</soap:Envelope>