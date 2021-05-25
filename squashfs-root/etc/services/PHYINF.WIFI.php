<?
include "/htdocs/phplib/xnode.php";
include "/htdocs/webinc/config.php";

function startcmd($cmd) {fwrite(a,$_GLOBALS["START"], $cmd."\n");}
function stopcmd($cmd)  {fwrite(a,$_GLOBALS["STOP"], $cmd."\n");}

function schcmd($uid)
{
	/* Get schedule setting */
	$base = XNODE_getpathbytarget("", "phyinf", "uid", $uid, 0);
	$sch = query($base."/schedule");
	if ($sch=="")	{$cmd = "start";}
	else	{$cmd = XNODE_getschedule2013cmd($sch);}
	//The schedule in WIFI is not in the schedule DB node.
	if ($cmd=="")   {$cmd = "start";}
	return $cmd;
}

/********************************************************************/
fwrite("w",$START, "#!/bin/sh\n");
fwrite("w", $STOP, "#!/bin/sh\n");

    /* 2015/1/20 To Add BRCM AirTime Fairness feature -Start */

    $wifia0_phy=XNODE_getpathbytarget("","phyinf","uid","BAND5G-1.1");
	if(query($wifia0_phy."/active")==1){  ///5G is active
		if(query("/wifi/function/BAND5G/atf")==1 && query("/wifi/function/BAND5G/nar")==1){
		startcmd("nvram set wl0_atf=1\n"."nvram set wl0_nar=1 \n"); //set wifia0 function state up
	}else{
		startcmd("nvram set wl0_atf=0\n"."nvram set wl0_nar=0 \n"); //set wifia0 function state close
		}
	}
    $wifig0_phy=XNODE_getpathbytarget("","phyinf","uid","BAND24G-1.1");
	if(query($wifig0_phy."/active")==1){  //2.4G is active
		if(query("/wifi/function/BAND24G/atf")==1 && query("/wifi/function/BAND24G/nar")==1){
			startcmd("nvram set wl1_atf=1\n"."nvram set wl1_nar=1 \n"); //set  wifig0 function state up
		}else{
			startcmd("nvram set wl1_atf=0\n"."nvram set wl1_nar=0 \n"); //set  wifig0 function state close
		}
	}
        /* 2015/1/20 To Add BRCM AirTime Fairness feature -End */
if(query("/device/layout")=="router")
{
	fwrite("a",$START,	
		"service PHYINF.BAND24G ".schcmd("BAND24G-1.1")."\n".
		"service PHYINF.BAND5G ".schcmd("BAND5G-1.1")."\n"
		);
	
	fwrite("a",$STOP,
		"service PHYINF.BAND24G stop\n".
		"service PHYINF.BAND5G stop\n"
		);
	/* smart connect */
	$smart_en = query("/device/features/smartconnect");
	if($smart_en=="1")
	{
		fwrite("a",$START,
			"xmldbc -k SMARTCONNECT_START\n".
			"xmldbc -k EAPD_START\n".			
			"xmldbc -t \"SMARTCONNECT_START:30:gbsd > /dev/console\"\n".
			"xmldbc -t \"EAPD_START:30:eapd > /dev/console\"\n"		
			);
		fwrite("a",$STOP,
			"killall gbsd\n".
			"killall eapd\n"
			);		
	}
}
else if(query("/device/layout")=="bridge")
{
	fwrite("a",$START,"service PHYINF.WIFI-REPEATER ".schcmd("WIFI-REPEATER")."\n");	
	fwrite("a",$STOP,"service PHYINF.WIFI-REPEATER stop\n");	
}

fwrite("a",$START,	"exit 0\n");
fwrite("a",$STOP,	"exit 0\n");
?>
