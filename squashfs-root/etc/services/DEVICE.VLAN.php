<?
//include "/htdocs/phplib/trace.php";
include "/htdocs/phplib/xnode.php";
include "/htdocs/phplib/phyinf.php";

fwrite("w",$START, "#!/bin/sh\n");
fwrite("w", $STOP, "#!/bin/sh\n");

function startcmd($cmd)	{fwrite(a,$_GLOBALS["START"], $cmd."\n");}
function stopcmd($cmd)	{fwrite(a,$_GLOBALS["STOP"], $cmd."\n");}
function acl_bwc_check()
{
	$acl_bwc_enable = 0;

	foreach ("/bwc/entry")
	{
		if (query("enable") == 1 && query("uid") != "" )
		{
			$acl_bwc_enable = 1;
		}
	}

	if(query("/acl/accessctrl/enable")=="1")
	{
		foreach ("/acl/accessctrl/entry")
		{
			if(query("enable") == "1")
			{
				$acl_bwc_enable = 1;
			}
		}
	}

	return $acl_bwc_enable;
}
function wifi_check($uid)
{
	$wifi_enable = 0;

	foreach("/phyinf")
	{
		if (query("active") == "1" && query("uid") == $uid )
		{
			$wifi_enable = 1;
		}
	}
	return $wifi_enable;
}
function is_pppoe($uid)
{
    $inf = XNODE_getpathbytarget("", "inf", "uid", $uid, 0);
    if($inf == "")
        return 0;

    if(get("x", $inf."/active") != 1)
        return 0;

    $inet_uid = get("x", $inf."/inet");
    if($inet_uid == "")
        return 0;

    $inet = XNODE_getpathbytarget("/inet", "entry", "uid", $inet_uid, 0);
    if($inet == "")
        return 0;

    $addrtype = get("x", $inet."/addrtype");
    if($addrtype == "ppp4")
        return 1;

    return 0;
}
function set_lan($dev,$mac)
{
	startcmd('ifconfig '.$dev.' hw ether '.$mac);
	startcmd('ifconfig '.$dev.' up');
	startcmd('brctl addif br0 '.$dev);
}
function setvlan($vid,$prio,$br_type,$br_num,$br_ip,$24Ginf,$5Ginf,$br_gz_type,$gz24inf,$gz5inf)
{
	$vlan_path	= "/device/vlan/lanport/";
	$lan1id = query($vlan_path."lan1");
	$lan2id = query($vlan_path."lan2");
	$lan3id = query($vlan_path."lan3");
	$lan4id = query($vlan_path."lan4");
	$nvram_ports="4 5*";
	$et_reg_val = 304;
	$et_prio_val = 0;
	$br_already_set = 0;
	if($prio=="none" || $prio=="0")
	{
		//Default priority or vlan priority disabled.
		$et_prio_val = 0;
	}
	else
	{
		if($prio=="1")		$et_prio_val =8192;
		else if($prio=="2")	$et_prio_val =16384;
		else if($prio=="3")	$et_prio_val =24576;
		else if($prio=="4")	$et_prio_val =32768;
		else if($prio=="5")	$et_prio_val =40960;
		else if($prio=="6")	$et_prio_val =49152;
		else if($prio=="7")	$et_prio_val =57344;
	}
	if($lan4id==$vid)
	{
		$et_prio_val += $vid;
		startcmd('et robowr 52 22 '.$et_prio_val);
		$nvram_ports = "3 ".$nvram_ports;
		$et_reg_val += 4104;
	}
	if($lan3id==$vid)
	{
		$et_prio_val += $vid;
		startcmd('et robowr 52 20 '.$et_prio_val);
		$nvram_ports = "2 ".$nvram_ports;
		$et_reg_val += 2052;
	}
	if($lan2id==$vid)
	{
		$et_prio_val += $vid;
		startcmd('et robowr 52 18 '.$et_prio_val);
		$nvram_ports = "1 ".$nvram_ports;
		$et_reg_val += 1026;
	}
	if($lan1id==$vid)
	{
		$et_prio_val += $vid;
		startcmd('et robowr 52 16 '.$et_prio_val);
		$nvram_ports = "0 ".$nvram_ports;
		$et_reg_val += 513;
	}
	if($et_reg_val > 304 || $br_type > 0 || $br_gz_type > 0)
	{//means LAN side or WiFi are using internet VLAN
		startcmd('nvram set vlan'.$vid.'hwname=et0');
		startcmd('nvram set vlan'.$vid.'ports="'.$nvram_ports.'"');
		stopcmd('nvram unset vlan'.$vid.'hwname');
		stopcmd('nvram unset vlan'.$vid.'ports');
		startcmd('et robowr 5 131 '.$et_reg_val);
		startcmd('et robowr 5 129 '.$vid);
		startcmd('et robowr 5 128 128');
		startcmd('vconfig add eth0 '.$vid);
		startcmd('ip link set eth0.'.$vid.' up');

		if($br_type > 0 || $br_gz_type > 0)
		{
			startcmd('brctl addbr '.$br_num);
			startcmd('brctl stp '.$br_num.' off');
			startcmd('brctl setfd '.$br_num.' 0');
			if($br_type == 3)
			{
				startcmd('brctl delif br0 '.$24Ginf);
				startcmd('brctl delif br0 '.$5Ginf);
				startcmd('brctl addif '.$br_num.' '.$24Ginf);
				startcmd('brctl addif '.$br_num.' '.$5Ginf);
				startcmd('ifconfig '.$br_num.' '.$br_ip.' netmask 255.255.255.255');
				startcmd('ip link set '.$br_num.' up');
				PHYINF_setup("ETH-".$br_num, "eth", $br_num);
				$br_already_set = 1;
				$q = XNODE_getpathbytarget("/runtime", "phyinf", "uid", "ETH-".$br_num, 0);
				if($q!="")
				{
					add($q."/bridge/port",	"BAND24G-1.1");
					add($q."/bridge/port",	"BAND5G-1.1");
				}

				stopcmd('brctl delif '.$br_num.' '.$24Ginf);
				stopcmd('brctl delif '.$br_num.' '.$5Ginf);
				stopcmd('brctl addif br0 '.$24Ginf);
				stopcmd('brctl addif br0 '.$5Ginf);
				
			}
			else if($br_type == 2)
			{
				startcmd('brctl delif br0 '.$5Ginf);
				startcmd('brctl addif '.$br_num.' '.$5Ginf);
				startcmd('ifconfig '.$br_num.' '.$br_ip.' netmask 255.255.255.255');
				startcmd('ip link set '.$br_num.' up');
				PHYINF_setup("ETH-".$br_num, "eth", $br_num);
				$br_already_set = 1;
				$q = XNODE_getpathbytarget("/runtime", "phyinf", "uid", "ETH-".$br_num, 0);
				if($q!="")
				{
					add($q."/bridge/port",	"BAND5G-1.1");
				}

				stopcmd('brctl delif '.$br_num.' '.$5Ginf);
				stopcmd('brctl addif br0 '.$5Ginf);
			}
			else if($br_type == 1)
			{
				startcmd('brctl delif br0 '.$24Ginf);
				startcmd('brctl addif '.$br_num.' '.$24Ginf);
				startcmd('ifconfig '.$br_num.' '.$br_ip.' netmask 255.255.255.255');
				startcmd('ip link set '.$br_num.' up');
				PHYINF_setup("ETH-".$br_num, "eth", $br_num);
				$br_already_set = 1;
				$q = XNODE_getpathbytarget("/runtime", "phyinf", "uid", "ETH-".$br_num, 0);
				if($q!="")
				{
					add($q."/bridge/port",	"BAND24G-1.1");
				}

				stopcmd('brctl delif '.$br_num.' '.$24Ginf);
				stopcmd('brctl addif br0 '.$24Ginf);
			}
			if($br_gz_type == 3)
			{
				startcmd('brctl delif br1 '.$gz24inf);
				startcmd('brctl delif br1 '.$gz5inf);
				startcmd('brctl addif '.$br_num.' '.$gz24inf);
				startcmd('brctl addif '.$br_num.' '.$gz5inf);
				if($br_already_set == 0)
				{
					startcmd('ifconfig '.$br_num.' '.$br_ip.' netmask 255.255.255.255');
					startcmd('ip link set '.$br_num.' up');
					PHYINF_setup("ETH-".$br_num, "eth", $br_num);
				}
				$q = XNODE_getpathbytarget("/runtime", "phyinf", "uid", "ETH-".$br_num, 0);
				if($q!="")
				{
					add($q."/bridge/port",  "BAND24G-1.2");
					add($q."/bridge/port",  "BAND5G-1.2");
				}

				stopcmd('brctl delif '.$br_num.' '.$gz24inf);
				stopcmd('brctl delif '.$br_num.' '.$gz5inf);
				stopcmd('brctl addif br1 '.$gz24inf);
				stopcmd('brctl addif br1 '.$gz5inf);
				
			}
			else if($br_gz_type == 2)
			{
				startcmd('brctl delif br1 '.$gz5inf);
				startcmd('brctl addif '.$br_num.' '.$gz5inf);
				if($br_already_set == 0)
				{
					startcmd('ifconfig '.$br_num.' '.$br_ip.' netmask 255.255.255.255');
					startcmd('ip link set '.$br_num.' up');
					PHYINF_setup("ETH-".$br_num, "eth", $br_num);
				}
				$q = XNODE_getpathbytarget("/runtime", "phyinf", "uid", "ETH-".$br_num, 0);
				if($q!="")
				{
					add($q."/bridge/port",	"BAND5G-1.2");
				}

				stopcmd('brctl delif '.$br_num.' '.$gz5inf);
				stopcmd('brctl addif br1 '.$gz5inf);
			}
			else if($br_gz_type == 1)
			{
				startcmd('brctl delif br1 '.$gz24inf);
				startcmd('brctl addif '.$br_num.' '.$gz24inf);
				if($br_already_set == 0)
				{
					startcmd('ifconfig '.$br_num.' '.$br_ip.' netmask 255.255.255.255');
					startcmd('ip link set '.$br_num.' up');
					PHYINF_setup("ETH-".$br_num, "eth", $br_num);
				}
				$q = XNODE_getpathbytarget("/runtime", "phyinf", "uid", "ETH-".$br_num, 0);
				if($q!="")
				{
					add($q."/bridge/port",	"BAND24G-1.2");
				}

				stopcmd('brctl delif '.$br_num.' '.$gz24inf);
				stopcmd('brctl addif br1 '.$gz24inf);
			}
			startcmd('brctl addif '.$br_num.' eth0.'.$vid);
			stopcmd('brctl delif '.$br_num.' eth0.'.$vid);
			stopcmd('ip link set '.$br_num.' down');
			stopcmd('brctl delbr '.$br_num);
		}
		if($prio!="none" && $prio!="0")
		{
				$map_index=0;
				while ($map_index < 8)
				{
					startcmd("vconfig set_egress_map eth0.".$vid." ".$map_index." ".$prio);
					$map_index++;
				}
		}
		stopcmd('ip link set eth0.'.$vid.' down');
		stopcmd('vconfig rem eth0.'.$vid);
	}
}
function set_internet_vlan_nvram($vid)
{
	$nvram_ports="4 5*";

	startcmd('nvram set vlan'.$vid.'hwname=et0');
	startcmd('nvram set vlan'.$vid.'ports="'.$nvram_ports.'"');
	stopcmd('nvram unset vlan'.$vid.'hwname');
	stopcmd('nvram unset vlan'.$vid.'ports');
}
function setWIFIvlan($vid,$wifi_uid,$wifi_vid,$val)
{
	if(wifi_check($wifi_uid) == 1 && $wifi_vid==$vid)
			return $val;
	else
			return 0;
}
function setWIFI_gz_vlan($vid,$wifi_uid,$wifi_vid,$host_uid,$val)
{
	if(wifi_check($host_uid) == 1 && wifi_check($wifi_uid) == 1 && $wifi_vid==$vid)
			return $val;
	else
			return 0;
}
function set_runtime_phyinf($eth_uid,$br_voip_num,$br_iptv_num,$wifi24G_uid,$wifi5G_uid)
{
	$wifi24G_node=1;
	$wifi5G_node=1;
	$p="";

	if($br_voip_num > 0 || $br_iptv_num > 0)
	{
		$p = XNODE_getpathbytarget("/runtime", "phyinf", "uid",$eth_uid, 0);

		if($br_voip_num == 3 || $br_iptv_num == 3)
		{
			$wifi24G_node=0;
			$wifi5G_node=0;
		}
		if($br_voip_num == 2 || $br_iptv_num == 2)
		{
			$wifi5G_node=0;
		}
		if($br_voip_num == 1 || $br_iptv_num == 1)
		{
			$wifi24G_node=0;
		}

		if($p!="")
		{
				del($p."/bridge/port:2");
				del($p."/bridge/port:1");
				if($wifi24G_node==1)	add($p."/bridge/port",	$wifi24G_uid);	
				if($wifi5G_node==1)		add($p."/bridge/port",	$wifi5G_uid);	
		}
	}
}
$vwlan_path	= "/device/vlan/wlanport/";
$vlanenable	= query("/device/vlan/active");
$vlan_prio_en	= query("/device/vlan/active_priority");
$mac_addr	= query("/runtime/devdata/lanmac");
$layout		= query("/device/layout");
$wirelessmode	= query("/device/wirelessmode");

$interid	= query("/device/vlan/interid");
$voipid		= query("/device/vlan/voipid");
$iptvid		= query("/device/vlan/iptvid");
$inter_priority	= query("/device/vlan/inter_priority");
$voip_priority	= query("/device/vlan/voip_priority");
$iptv_priority	= query("/device/vlan/iptv_priority");

$wlan01vid = query($vwlan_path."wlan01");
$wlan02vid = query($vwlan_path."wlan02");
$wlan01inf = "wifig0";
$wlan02inf = "wl0.1";
$wlan01uid = "BAND24G-1.1";
$wlan02uid = "BAND24G-1.2";
$wlan11vid = query($vwlan_path."wlan11");
$wlan12vid = query($vwlan_path."wlan12");
$wlan11inf = "wifia0";
$wlan12inf = "wl1.1";
$wlan11uid = "BAND5G-1.1";
$wlan12uid = "BAND5G-1.2";
$voip_br_num = "br2";
$voip_br_ip = "1.0.0.249";
$iptv_br_num = "br3";
$iptv_br_ip = "1.0.1.249";

$br_voip = 0;//0:none 1:2.4G 2:5G 3:BOTH
$br_iptv = 0;//0:none 1:2.4G 2:5G 3:BOTH
$br_voip_gz = 0;//Guest Zone  0:none 1:2.4G 2:5G 3:BOTH
$br_iptv_gz = 0;//Guest Zone  0:none 1:2.4G 2:5G 3:BOTH

$smartconnect = query("/device/features/smartconnect");

if($vlanenable == "1" && $layout == "router" && $wirelessmode == "WirelessRouter")
{
	$br_voip += setWIFIvlan($voipid,$wlan01uid,$wlan01vid,1);
	$br_iptv += setWIFIvlan($iptvid,$wlan01uid,$wlan01vid,1);
	
	if($smartconnect == "0")
	{
		$br_voip += setWIFIvlan($voipid,$wlan11uid,$wlan11vid,2);
		$br_iptv += setWIFIvlan($iptvid,$wlan11uid,$wlan11vid,2);
	}
	else
	{
		$br_voip += setWIFIvlan($voipid,$wlan11uid,$wlan01vid,2);
		$br_iptv += setWIFIvlan($iptvid,$wlan11uid,$wlan01vid,2);
	}
	
	set("/device/vlan/iptv_br",$br_iptv);//0:none 1:2.4G 2:5G 3:BOTH
	set("/device/vlan/voip_br",$br_voip);//0:none 1:2.4G 2:5G 3:BOTH

	//if host zone wifi is disabled, no need to check guest zone wifi.
	$br_voip_gz += setWIFI_gz_vlan($voipid,$wlan02uid,$wlan02vid,$wlan01uid,1);
	$br_iptv_gz += setWIFI_gz_vlan($iptvid,$wlan02uid,$wlan02vid,$wlan01uid,1);
	
	if($smartconnect == "0")
	{
		$br_voip_gz += setWIFI_gz_vlan($voipid,$wlan12uid,$wlan12vid,$wlan11uid,2);
		$br_iptv_gz += setWIFI_gz_vlan($iptvid,$wlan12uid,$wlan12vid,$wlan11uid,2);
	}
	else
	{
		$br_voip_gz += setWIFI_gz_vlan($voipid,$wlan12uid,$wlan02vid,$wlan11uid,2);
		$br_iptv_gz += setWIFI_gz_vlan($iptvid,$wlan12uid,$wlan02vid,$wlan11uid,2);
	}
	
	set("/device/vlan/iptv_gz_br",$br_iptv_gz);//0:none 1:2.4G 2:5G 3:BOTH
	set("/device/vlan/voip_gz_br",$br_voip_gz);//0:none 1:2.4G 2:5G 3:BOTH

	startcmd('nvram unset vlan2ports');
	set_internet_vlan_nvram($interid);

	if($vlan_prio_en!="1")
	{
		$voip_priority = "none";
		$iptv_priority = "none";
	}

	setvlan($voipid,$voip_priority,$br_voip,$voip_br_num,$voip_br_ip,$wlan01inf,$wlan11inf,$br_voip_gz,$wlan02inf,$wlan12inf);
	setvlan($iptvid,$iptv_priority,$br_iptv,$iptv_br_num,$iptv_br_ip,$wlan01inf,$wlan11inf,$br_iptv_gz,$wlan02inf,$wlan12inf);

	set_runtime_phyinf("ETH-1",$br_voip,$br_iptv,$wlan01uid,$wlan11uid);
	set_runtime_phyinf("ETH-2",$br_voip_gz,$br_iptv_gz,$wlan02uid,$wlan12uid);

}
else
{
	startcmd('echo "START.sh:VLAN is disabled" > /dev/console');
	stopcmd('echo "STOP.sh:VLAN is disabled" > /dev/console');
}

/* Done */
fwrite("a",$START, "exit 0\n");
fwrite("a", $STOP, "exit 0\n");
?>
