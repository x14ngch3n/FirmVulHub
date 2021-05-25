<?
include "/htdocs/phplib/xnode.php";

function IP6TWAN_build_command($name)
{
	fwrite(w, $_GLOBALS["START"],
		"#!/bin/sh\n".
		"ip6tables -F FWD.".$name."\n".
		"ip6tables -F INP.".$name."\n"
		);

	$iptcmd = "ip6tables -t nat -A PRE.".$name;
	$path = XNODE_getpathbytarget("", "inf", "uid", $name, 0);
	if ($path!="")
	{
		/* FIREWALL */
		$security = query("/device/simple_security");
		
		fwrite("a",$_GLOBALS["START"],"ip6tables -F FWD.".$name."\n");
		fwrite("a",$_GLOBALS["START"],"ip6tables -F INP.".$name."\n");
		
		$ingress_filter = query("/device/ingress_filtering");
		fwrite("a",$_GLOBALS["START"],"ip6tables -A FWD.".$name." -j FIREWALL\n");
		if($security>0 || $ingress_filter>0) fwrite("a",$_GLOBALS["START"],"ip6tables -A FWD.".$name." -j FWD.SMPSECURITY.".$name."\n");
		fwrite("a",$_GLOBALS["START"],"ip6tables -A FWD.".$name." -j FIREWALL_POLICY\n");
	}

	fwrite("w", $_GLOBALS["STOP"],
		"#!/bin/sh\n".
//		"ip6tables -F FWD.".$name."\n".
//		"ip6tables -F INP.".$name."\n".
		"exit 0\n"
		);
}

?>
