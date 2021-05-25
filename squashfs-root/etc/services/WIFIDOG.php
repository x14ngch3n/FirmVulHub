<?
include "/htdocs/phplib/trace.php"; 
include "/htdocs/phplib/xnode.php";
include "/htdocs/phplib/phyinf.php";
include "/htdocs/phplib/inf.php";

$WIFIDOGCONF = "/var/etc/wifidog.conf";
$watchdog = "/var/run/wifidog_watchdog.sh";

fwrite("w",$START, "#!/bin/sh\n");
fwrite("w",$STOP,  "#!/bin/sh\n");

function startcmd($cmd)	{fwrite("a", $_GLOBALS["START"], $cmd."\n");}
function stopcmd($cmd)	{fwrite("a", $_GLOBALS["STOP"], $cmd."\n");}
function confcmd($cmd)	{fwrite("a", $_GLOBALS["WIFIDOGCONF"], $cmd."\n");}

anchor("/wifidog");
$enable = query("enable");
$guestzoneenable = query("guestzoneenable");
$gwname = query("gwname");
$gwvendorkey = query("gwvendorkey");
$gwid = query("gwid");
$gwsecret = query("gwsecret");
$gwinterface = "br1";

if ($guestzoneenable == "1")
{
if ($enable == "1")
{
	if ($gwname=="" || $gwvendorkey=="" || $gwid=="" || $gwsecret=="")
	{
		startcmd("echo \"missing wifidog comfig parameters.\"");
		startcmd("exit 1");
		stopcmd("exit 1");
	}
	else
	{
		fwrite("w",$WIFIDOGCONF, "# WiFiDog Configuration file\n");
		confcmd("GatewayName ".$gwname);
		confcmd("GatewayVendorKey ".$gwvendorkey);
		confcmd("GatewayHwVer ".query("/runtime/device/hardwareversion"));
		confcmd("GatewaySwVer ".query("/runtime/device/firmwareversion"));
		confcmd("GatewayID ".$gwid);
		confcmd("GatewaySecret ".$gwsecret);
		confcmd("GatewayInterface ".$gwinterface);
		confcmd("AuthServer {\n\tHostname graph.facebook.com\n\tVerifyPeer no\n\tSSLAvailable yes\n\tPath /wifiauth/\n}");
		confcmd("CheckInterval 300");
		confcmd("ClientTimeout 36");
		confcmd("FirewallRuleSet validating-users {\n\tFirewallRule allow to 0.0.0.0/0\n}");
		confcmd("FirewallRuleSet known-users {\n\tFirewallRule allow to 0.0.0.0/0\n}");
		confcmd("FirewallRuleSet unknown-users {\n\tFirewallRule allow udp port 53\n\tFirewallRule allow tcp port 53\n\tFirewallRule allow udp port 67\n\tFirewallRule allow tcp port 67\nFirewallRule allow tcp port 443\n}");
		confcmd("FirewallRuleSet locked-users {\n\t FirewallRule block to 0.0.0.0/0\n}");

		fwrite("w", $watchdog, "#!/bin/sh\n");
		fwrite("a", $watchdog, "while : do\n");
		fwrite("a", $watchdog, "wifidog -d 0 -f -c ".$WIFIDOGCONF."\n");
		fwrite("a", $watchdog, "sleep 1\n");
		fwrite("a", $watchdog, "killall -9 wifidog\n");
		fwrite("a", $watchdog, "sleep 1\ndone\nexit 0");
	
		startcmd("chmod +x ".$watchdog);
		startcmd($watchdog." &");

		stopcmd("killall wifidog_watchdog.sh");
		stopcmd("killall wifidog");
		stopcmd("sleep 2");
		stopcmd("killall -9 wifidog");
		stopcmd("rm -f ".$WIFIDOGCONF);
	}
}
}

startcmd("exit 0");
stopcmd("exit 0");

?>
