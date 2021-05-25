<?
include "/htdocs/phplib/xnode.php";
include "/etc/services/PHYINF/phywifi.php";

function startcmd($cmd)      
{
	fwrite(a,$_GLOBALS["START"], $cmd."\n");
}

function try_scan_ssid_freq($uid)
{
	$freq = get_phyinf_freq($uid);
	if($freq == "2.4" || $freq == "5")
		return; //it has freq information, we don't need to scan ssid

	startcmd('sh /etc/events/SITESURVEY.sh');	
}

fwrite("w",$START, "#!/bin/sh\n");
fwrite("w", $STOP, "#!/bin/sh\n");

if(is_active("WIFISTA-1.1") == 1)
{
	try_scan_ssid_freq("WIFISTA-1.1");
}

fwrite("a",$START,	
	"service PHYINF.WIFISTA-1.1 start\n".
	"service PHYINF.WIFISTA-1.2 start\n"
	);
	
fwrite("a",$STOP,
	"service PHYINF.WIFISTA-1.2 stop\n".
	"service PHYINF.WIFISTA-1.1 stop\n"
	);

fwrite("a",$START,	"exit 0\n");
fwrite("a", $STOP,	"exit 0\n");
?>
