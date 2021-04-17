#!/bin/sh
<?
include "/htdocs/phplib/trace.php"; 
include "/htdocs/phplib/xnode.php";
include "/htdocs/phplib/phyinf.php";
include "/htdocs/phplib/inf.php";

$WIFIDOGCONF = "/var/etc/wifidog_status.conf";

function confcmd($cmd)	{fwrite("a", $_GLOBALS["WIFIDOGCONF"], $cmd."\n");}

anchor("/wifidog");
$gwname = query("gwname");
$gwvendorkey = query("gwvendorkey");
$gwinterface = "br1";

if ($gwname=="")
{
	$mode = query("/device/router/mode"); if ($mode!="1W1L") $mode = "1W2L";
	$lanmac = PHYINF_gettargetmacaddr($mode, "ETH-1");
	$gwname = query("/device/gw_name")."-".$lanmac;
}

fwrite("w",$WIFIDOGCONF, "# WiFiDog Configuration file\n");
confcmd("GatewayName ".$gwname);
confcmd("GatewayVendorKey ".$gwvendorkey);
confcmd("GatewayHwVer ".query("/runtime/device/hardwareversion"));
confcmd("GatewaySwVer ".query("/runtime/device/firmwareversion"));
confcmd("GatewayInterface ".$gwinterface);
confcmd("AuthServer {\n\tHostname graph.facebook.com\n\tVerifyPeer no\n\tSSLAvailable yes\n\tPath /wifiauth/\n}");

echo "rm -f /var/run/wifidog_status\n";
echo "wifidog -r -c ".$WIFIDOGCONF."\n";
echo "rm -f ".$WIFIDOGCONF."\n";

echo "exit 0";
?>
