HTTP/1.1 200 OK
Content-Type: text/xml; charset=utf-8

<?
echo "\<\?xml version='1.0' encoding='utf-8'\?\>";
include "/htdocs/phplib/xnode.php";
include "/htdocs/phplib/trace.php";
include "/htdocs/webinc/config.php";
include "/htdocs/phplib/phyinf.php";
$nodebase="/runtime/hnap/SetFacebookWiFiRegister/";

$ACTION = get("", $nodebase."FacebookWiFiRegister");
if ($ACTION == "true")
{
	unlink("/var/run/wifidog_status");
	event("REGISTER_WIFIDOG");
	$result = "OK";
}
else if ($ACTION == "false")
{
		if(isfile("/var/run/wifidog_status")==1)
		{
			$wifidog_st = fread("","/var/run/wifidog_status");
			$gwname	=	scut(scut($wifidog_st, 0, ""), 0, "gwname:");
			$gwid	=	scut(scut($wifidog_st, 1, ""), 0, "gwid:");
			$secret	=	scut(scut($wifidog_st, 2, ""), 0, "gwsecret:");
			$status	=	scut(scut($wifidog_st, 3, ""), 0, "status:");
			if($status == "success")
			{
				set("/wifidog/gwname", $gwname);
				set("/wifidog/gwid", $gwid);
				set("/wifidog/gwsecret", $secret);
				$result = "OK";
			}
			else	{$result = "ERROR_StatusFail";}
		}
		else	{$result = "ERROR_NoStatusFile";}
}
else	{$result = "ERROR_UnknowAction";}

?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
	<soap:Body>
		<SetFacebookWiFiRegisterResponse xmlns="http://purenetworks.com/HNAP1/">
			<SetFacebookWiFiRegisterResult><?=$result?></SetFacebookWiFiRegisterResult>
		</SetFacebookWiFiRegisterResponse>
	</soap:Body>
</soap:Envelope>
