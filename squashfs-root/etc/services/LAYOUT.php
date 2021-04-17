<?
/* vi: set sw=4 ts=4:

	PORT	Switch Port	VID
	====	===========	===
	CPU		PORT5		1,2
	WAN		PORT4		2
	LAN1	PORT0		1
	LAN2	PORT1		1
	LAN3	PORT2		1
	LAN4	PORT3		1

NOTE:	We use VLAN 2 for WAN port, VLAN 1 for LAN ports.
		by David Hsieh <david_hsieh@alphanetworks.com>
		
	QoS      WAN
	=======	 =======
	enable   eth0.2
	disable  eth0
	
NOTE:	By default, the WAN interface is eth0 in dir868(for ctf),
	but this will lead to the download traffic limited by eth0,
	so we change WAN interface to eth0.2 when QoS enable
	sammy_hsu 2012/09/28
*/
include "/htdocs/phplib/xnode.php";
include "/htdocs/phplib/trace.php";
include "/htdocs/phplib/phyinf.php";

function startcmd($cmd)	{fwrite(a,$_GLOBALS["START"], $cmd."\n");}
function stopcmd($cmd)	{fwrite(a,$_GLOBALS["STOP"], $cmd."\n");}
function error($errno)	{startcmd("exit ".$errno); stopcmd("exit ".$errno);}

function vpn_check()
{
	$vpn_enable = 0;

	if(query("/vpn/ipsec/enable")=="1")
	{
		$vpn_enable = 1;
	}

	return $vpn_enable;
}
function acl_check()
{
	$acl_enable = 0;

	if(query("/acl/accessctrl/enable")=="1")
	{
		foreach ("/acl/accessctrl/entry")
		{
			if(query("enable") == "1")
			{
				$acl_enable = 1;
			}
		}
	}

	if(vpn_check()=="1")
	{
		$acl_enable = 1;
	}

	return $acl_enable;
}
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
function powerdown_lan()
{
	/*please check data sheet.Page 10h-14h: Address 00h-01h bit 11 is power down*/
	startcmd('et robowr 0x10 0x0 0x800');
	startcmd('et robowr 0x11 0x0 0x800');
	startcmd('et robowr 0x12 0x0 0x800');
	startcmd('et robowr 0x13 0x0 0x800');
}
function set_internet_vlan($vid)
{
	$vlan_path	= "/device/vlan/lanport/";
	$lan1id = query($vlan_path."lan1");
	$lan2id = query($vlan_path."lan2");
	$lan3id = query($vlan_path."lan3");
	$lan4id = query($vlan_path."lan4");
	$nvram_ports="5*";
	$et_reg_val = 304; //The VLAN-tagged Frame is allowed to be forwarded to ports 4,5

	if($lan4id==$vid)
	{
		$nvram_ports = "3 ".$nvram_ports;
	}
	if($lan3id==$vid)
	{
		$nvram_ports = "2 ".$nvram_ports;
	}
	if($lan2id==$vid)
	{
		$nvram_ports = "1 ".$nvram_ports;
	}
	if($lan1id==$vid)
	{
		$nvram_ports = "0 ".$nvram_ports;
	}
	startcmd('nvram set vlan1ports="'.$nvram_ports.'"');	/* Host zone (LAN ports) */
	startcmd('et robowr 5 131 '.$et_reg_val);
	startcmd('et robowr 5 129 '.$vid); //VLAN Table Address Index.
	startcmd('et robowr 5 128 128'); //initiate a read or write or cleartable command.
	startcmd('et robowr 52 24 '.$vid); //Default VLAN ID
}
function layout_bridge()
{
	SHELL_info($START, "LAYOUT: Start bridge layout ...");

	/* Clean up all of vlan's setting */
	$vlan_index=0;
	$vlan_num=16;
	while($vlan_index < $vlan_num)
	{
		startcmd("nvram set vlan".$vlan_index."ports=");
		$vlan_index++;
	}
	
	/* Start .......................................................................... */
	/* Config VLAN as bridge layout. */
	echo "echo Start bridge layout ... > /dev/console\n";
	$HZONE = "0 1 2 3 4 5*";
	$WZONE = "5*";

	startcmd('nvram set vlan1ports="'.$HZONE.'"');	/* Host zone (LAN ports) */

	/* Using WAN MAC address during bridge mode. */
	$mac = PHYINF_gettargetmacaddr("1BRIDGE", "ETH-1");
	if ($mac=="") $mac="00:de:fa:30:50:10";
	
	startcmd("nvram set et0macaddr=".$mac);	/* Host zone (LAN ports) */
	
	if (acl_bwc_check() == 0)
	{
		startcmd("insmod /lib/modules/ctf.ko");
	}
	/* disable fastnat for acl schedule */
	if (acl_check() == 1)
	{
		startcmd("echo 0 > /proc/sys/net/ipv4/netfilter/ip_conntrack_fastnat");
	}	
	if (vpn_check() == 1)
	{
		startcmd("echo 0 > /proc/alpha_fast_route");
	}	
	startcmd("insmod /lib/modules/et.ko");
	startcmd("ifconfig eth0 allmulti");
	//enable switch jumbo frame.all port 0~4
	startcmd("et robowr 0x40 0x1 0x1f");
	//disable pause pass through for tx register. all port 0~4
	startcmd("et robowr 0x0 0x3a 0x1f");
	
	
	startcmd("ip link set eth0 up");

	startcmd("vconfig add eth0 1");

	$map_index=0;
	while ($map_index < 8)
	{
		startcmd("vconfig set_ingress_map eth0.1 ".$map_index." ".$map_index);
		$map_index++;
	}

	startcmd("ip link set eth0.1 addr ".$mac);
	startcmd("ip link set eth0.1 up");

	/* Create bridge interface. */
	startcmd("brctl addbr br0; brctl stp br0 off; brctl setfd br0 0");
	startcmd('brctl addif br0 eth0.1');
	startcmd('ip link set br0 up');
	/*for https need lo interface*/
	startcmd('ip link set lo up');
	startcmd('service HTTP restart');
	/* Setup the runtime nodes. */
	PHYINF_setup("ETH-1", "eth", "br0");

	//register bridge mode LED events (tom, 20131111)
	startcmd('event BRIDGE-1.UP insert BRIDGE_LED:"usockc /var/gpio_ctrl INET_GREEN_ON"');	
	startcmd('event BRIDGE-1.DOWN insert BRIDGE_LED:"usockc /var/gpio_ctrl INET_ORANGE_ON"');	
	startcmd('event STATUS.READY flush');
	startcmd('event STATUS.NOTREADY flush');

	/* Done */
	startcmd('xmldbc -s /runtime/device/layout bridge');
	startcmd('usockc /var/gpio_ctrl BRIDGE');
	startcmd('service ENLAN start');
	startcmd('service PHYINF.ETH-1 alias PHYINF.BRIDGE-1');
	startcmd('service PHYINF.ETH-1 start');

	/* ip alias */
	$mactmp = cut($mac, 4, ":");  $mac4 = strtoul($mactmp, 16);
	$mactmp = cut($mac, 5, ":");  $mac5 = strtoul($mactmp, 16);
	$aip = "169.254.".$mac4.".".$mac5;
	startcmd("ifconfig br0 192.168.0.50 up");	
	startcmd("ifconfig br0:1 ".$aip." up");
	startcmd("ip addr add ".$aip."/24 broadcast 169.254.255.255 dev br0");
	
	$p = XNODE_getpathbytarget("/runtime", "inf", "uid", "BRIDGE-1", 1);	
	set($p."/ipalias/cnt",                  1);
	set($p."/ipalias/ipv4/ipaddr:1",                $aip);
	set($p."/devnam","br0");
	set($p."/inet/addrtype","ipv4");
	set($p."/inet/ipv4/valid","1");
	set($p."/inet/ipv4/ipaddr","192.168.0.50");
	set($p."/inet/ipv4/mask","24");

	$p = XNODE_getpathbytarget("/runtime", "phyinf", "uid", "ETH-1", 0);
	add($p."/bridge/port",	"WIFISTA-1.1");
	add($p."/bridge/port",	"WIFISTA-1.2");

	/* Stop ........................................................................... */
	SHELL_info($STOP, "LAYOUT: Stop bridge layout ...");
	stopcmd("service PHYINF.ETH-1 stop");
	stopcmd('service PHYINF.BRIDGE-1 delete');
	stopcmd('xmldbc -s /runtime/device/layout ""');
	stopcmd('/etc/scripts/delpathbytarget.sh /runtime phyinf uid ETH-1');
	stopcmd('brctl delif br0 eth0.1');
	stopcmd('ip link set eth0.1 down');
	stopcmd('ip link set br0 down');
	stopcmd('brctl delbr br0');
	stopcmd('vconfig rem eth0.1');
	return 0;
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

function layout_router($mode)
{
	SHELL_info($START, "LAYOUT: Start router layout ...");

	$qos_en = get("","/bwc/entry:1/enable");
	$port_mirror = get("","/device/port_mirror");

	$vlan_en	= get("","/device/vlan/active");
	$vlan_prio_en	= get("","/device/vlan/active_priority");
	$inter_vid	= get("","/device/vlan/interid");
	$inter_prio	= get("","/device/vlan/inter_priority");

	if($vlan_en=="0")
	{
	/* Clean up all of vlan's setting */
	$vlan_index=0;
	$vlan_num=16;
	while($vlan_index < $vlan_num)
	{
		startcmd("nvram set vlan".$vlan_index."ports=");
		$vlan_index++;
	}
	}
	
	/* Start .......................................................................... */
	/* Config VLAN as router mode layout. (1 WAN + 4 LAN) */
	if($port_mirror=="1"){$HZONE="0 1 2 ";}
	else				{$HZONE="0 1 2 3";}
	if($vlan_en=="0")
	{
	$HZONE="0 1 2 3";

	if($qos_en=="1")	{$WZONE = "4 5*";}
	else				{$WZONE = "4 5u";}

	if ($HZONE!="") {$HZONE=$HZONE." 5*";} else {$HZONE=$HZONE."5*";}
	
	startcmd('nvram set vlan1ports="'.$HZONE.'"');	/* Host zone (LAN ports) */
	startcmd('nvram set vlan2ports="'.$WZONE.'"');	/* WAN port */
	}
	if($port_mirror=="1")    
	{
		startcmd('nvram set vlan3hwname=et0');
		startcmd('nvram set vlan3ports="3 5"');
		startcmd('nvram set pkt_miro_dev=vlan3');
		startcmd('nvram set pkt_miro_dislearn_port=0x20');
		startcmd('nvram set pkt_miro_dir=3');
	}
		
	$lanmac = PHYINF_gettargetmacaddr($mode, "ETH-1");
	if		($mode=="1W1L") $wanmac = PHYINF_gettargetmacaddr("1W1L", "ETH-2");
	else if	($mode=="1W2L") $wanmac = PHYINF_gettargetmacaddr("1W2L", "ETH-3");
	if ($wanmac=="") $wanmac = "00:de:fa:30:50:10";
	if ($lanmac=="") $lanmac = "00:de:fa:30:50:00";
	
	startcmd("nvram set et0macaddr=".$lanmac);	/* Host zone (LAN ports) */
	startcmd("nvram set ctf_fa_mode=0"); /* Prevent lab to use dirty nvram DUT to do test, set a default nvram value for HWNAT */

	if ($vlan_en=="0" && acl_bwc_check() == 0)
	{
		if(is_pppoe("WAN-1") != 1)
		{
			//for pppoe, we need to disable this
			startcmd("nvram set ctf_fa_mode=2");	/* Enable hardware NAT */
		}

		if($port_mirror=="1")
		{
			startcmd("nvram unset ctf_fa_mode");
		}
		startcmd("insmod /lib/modules/ctf.ko");
	}
	if ($vlan_en=="1" && $vlan_prio_en=="0" && acl_bwc_check() == 0)
	{
		if(is_pppoe("WAN-1") != 1)
		{
			//for pppoe, we need to disable this
			//startcmd("nvram set ctf_fa_mode=2");	/* Enable hardware NAT */
		}

		startcmd("insmod /lib/modules/ctf.ko");
	}
	/* disable fastnat for acl schedule */
	if (acl_check() == 1)
	{
		startcmd("echo 0 > /proc/sys/net/ipv4/netfilter/ip_conntrack_fastnat");
	}	
	startcmd("insmod /lib/modules/et.ko");
	powerdown_lan();
	startcmd("ifconfig eth0 allmulti");
	//enable switch jumbo frame. lan port 0~3
	startcmd("et robowr 0x40 0x1 0x0f");
	if($port_mirror=="1")
	{
		startcmd("et robowr 0x2 0x10 0x8003");
		startcmd("et robowr 0x2 0x12 0x27");
		startcmd("et robowr 0x2 0x1c 0x27");
	}
	if($vlan_en=="1")
	{
		set_internet_vlan($inter_vid);
	}

	//this will cause tx throughput low, i remove this (tom, 20130116)
	//remove this, 5g tx throughput from 780M to 920M
	//disable pause pass through for tx register. all port 0~4
	//startcmd("et robowr 0x0 0x3a 0x1f");
	
	/* Setup MAC address */
	/* Check User configuration for WAN port. */
	startcmd("ip link set eth0 up");
	
	startcmd("vconfig add eth0 1");
	if($vlan_en=="1")
	{
		startcmd('vconfig add eth0 '.$inter_vid);
	}
	else
	{
	if($qos_en=="1")	{startcmd("vconfig add eth0 2");}
	}

	$map_index=0;
	while ($map_index < 8)
	{
		startcmd("vconfig set_ingress_map eth0.1 ".$map_index." ".$map_index);
		$map_index++;
	}
	if($qos_en=="1")
	{
		$map_index=0;
		if($vlan_en=="0")
		{
		while ($map_index < 8)
		{
			startcmd("vconfig set_ingress_map eth0.2 ".$map_index." ".$map_index);
			$map_index++;
		}
	}
		else
		{
			while ($map_index < 8)
			{
				startcmd("vconfig set_ingress_map eth0.".$inter_vid." ".$map_index." ".$map_index);
				$map_index++;
			}
		}
	}
	if($vlan_en=="1" && $vlan_prio_en=="1")
	{
		$map_index=0;
		while ($map_index < 8)
		{
			startcmd("vconfig set_egress_map eth0.".$inter_vid." ".$map_index." ".$inter_prio);
			$map_index++;
		}
	}
	

	startcmd("ip link set eth0.1 addr ".$lanmac);
	startcmd("ip link set eth0.1 up");

	if($port_mirror=="1")
	{
		startcmd("vconfig set_name_type VLAN_PLUS_VID_NO_PAD");
		startcmd("vconfig add eth0 3");

		if($qos_en=="1")
		{
			$map_index=0;
			while ($map_index < 8)
			{
				startcmd("vconfig set_ingress_map vlan3 ".$map_index." ".$map_index);
				$map_index++;
			}
		}

		startcmd("ip link set vlan3 addr ".$lanmac);
		startcmd("ip link set vlan3 up");
	}
	if($vlan_en=="1")
	{
		startcmd("ip link set eth0.".$inter_vid." addr ".$wanmac);
		startcmd("ip link set eth0.".$inter_vid." up");		
	}
	else
	{
	if($qos_en=="1")
	{
		startcmd("ip link set eth0.2 addr ".$wanmac);
		startcmd("ip link set eth0.2 up");
	}
	else
	{
		startcmd("ip link set eth0 addr ".$wanmac);
		startcmd("ip link set eth0 up");
	}
	}
	/*for https need lo interface*/
	startcmd('ip link set lo up');
	

	/* Create bridge interface. */
	startcmd("brctl addbr br0; brctl stp br0 off; brctl setfd br0 0;");
	startcmd("brctl addif br0 eth0.1");
	if($port_mirror=="1"){startcmd("brctl addif br0 vlan3");}
	startcmd("ip link set br0 up");
	if ($mode=="1W2L")
	{
		startcmd("brctl addbr br1; brctl stp br1 off; brctl setfd br1 0;");
		startcmd("ip link set br1 up");
	}

	/* Setup the runtime nodes. */
	$Wan_index_number = query("/device/router/wanindex");
	if ($mode=="1W1L")
	{
		PHYINF_setup("ETH-1", "eth", "br0");
		if($vlan_en=="1")
		{
			PHYINF_setup("ETH-2", "eth", "eth0.".$inter_vid);
		}
		else
		{
		if($qos_en=="1")		{PHYINF_setup("ETH-2", "eth", "eth0.2");}
		else					{PHYINF_setup("ETH-2", "eth", "eth0");}
		}
		/* set Service Alias */
		startcmd('service PHYINF.ETH-1 alias PHYINF.LAN-1');
		startcmd('service PHYINF.ETH-2 alias PHYINF.WAN-1');
		/* WAN: set extension nodes for linkstatus */
		$path = XNODE_getpathbytarget("/runtime", "phyinf", "uid", "ETH-2", 0);
		//startcmd('xmldbc -x '.$path.'/linkstatus "get:psts -i 4"');
		startcmd('xmldbc -x '.$path.'/linkstatus "get:psts -i '.$Wan_index_number.'"');
	}
	else if ($mode=="1W2L")
	{
		PHYINF_setup("ETH-1", "eth", "br0");
		PHYINF_setup("ETH-2", "eth", "br1");
		if($vlan_en=="1")
		{
			PHYINF_setup("ETH-3", "eth", "eth0.".$inter_vid);
		}
		else
		{
		if($qos_en=="1")		{PHYINF_setup("ETH-3", "eth", "eth0.2");}
		else					{PHYINF_setup("ETH-3", "eth", "eth0");}
		}
		/* set Service Alias */
		startcmd('service PHYINF.ETH-1 alias PHYINF.LAN-1');
		startcmd('service PHYINF.ETH-2 alias PHYINF.LAN-2');
		startcmd('service PHYINF.ETH-3 alias PHYINF.WAN-1');
		/* WAN: set extension nodes for linkstatus */
		$path = XNODE_getpathbytarget("/runtime", "phyinf", "uid", "ETH-3", 0);
		//startcmd('xmldbc -x '.$path.'/linkstatus "get:psts -i 4"');
		startcmd('xmldbc -x '.$path.'/linkstatus "get:psts -i '.$Wan_index_number.'"');
	}

	//+++ hendry
	$p = XNODE_getpathbytarget("/runtime", "phyinf", "uid", "ETH-1", 0);
	add($p."/bridge/port",	"BAND24G-1.1");	
	add($p."/bridge/port",	"BAND5G-1.1");	
	$p = XNODE_getpathbytarget("/runtime", "phyinf", "uid", "ETH-2", 0);
	add($p."/bridge/port",	"BAND24G-1.2");	
	add($p."/bridge/port",	"BAND5G-1.2");	
	//--- hendry

	/* LAN: set extension nodes for linkstatus */
	$path = XNODE_getpathbytarget("/runtime", "phyinf", "uid", "ETH-1", 0);

	startcmd('xmldbc -x '.$path.'/linkstatus:1 "get:psts -i 0"');
	startcmd('xmldbc -x '.$path.'/linkstatus:2 "get:psts -i 1"');
	startcmd('xmldbc -x '.$path.'/linkstatus:3 "get:psts -i 2"');
	startcmd('xmldbc -x '.$path.'/linkstatus:4 "get:psts -i 3"');

	/* Done */
	startcmd("xmldbc -s /runtime/device/layout router");
	startcmd("xmldbc -s /runtime/device/router/mode ".$mode);
	startcmd("usockc /var/gpio_ctrl ROUTER");
	startcmd("service PHYINF.ETH-1 start");
	startcmd("service PHYINF.ETH-2 start");
	if ($mode=="1W2L") startcmd("service PHYINF.ETH-3 start");

	/* Stop ........................................................................... */
	SHELL_info($STOP, "LAYOUT: Stop router layout ...");
	if ($mode=="1W2L")
	{
		stopcmd("service PHYINF.ETH-3 stop");
		stopcmd("service PHYINF.LAN-2 delete");
	}
	stopcmd('service PHYINF.ETH-2 stop');
	stopcmd('service PHYINF.ETH-1 stop');
	stopcmd('service PHYINF.WAN-1 delete');
	stopcmd('service PHYINF.LAN-1 delete');
	stopcmd('xmldbc -s /runtime/device/layout ""');
	stopcmd('/etc/scripts/delpathbytarget.sh /runtime phyinf uid ETH-1');
	stopcmd('/etc/scripts/delpathbytarget.sh /runtime phyinf uid ETH-2');
	stopcmd('/etc/scripts/delpathbytarget.sh /runtime phyinf uid ETH-3');
	stopcmd('brctl delif br0 eth0.1');
	if($vlan_en=="1")
	{
		stopcmd('ip link set eth0.'.$inter_vid.' down');
	}
	else
	{
	if($qos_en=="1")	{stopcmd('ip link set eth0.2 down');}
	}
	if($port_mirror=="1"){
		stopcmd('brctl delif br0 vlan3');
		stopcmd('ip link set vlan3 down');}
	stopcmd('ip link set eth0.1 down');
	stopcmd('ip link set br0 down');
	stopcmd('brctl delbr br0; brctl delbr br1');
	if($port_mirror=="1"){stopcmd('vconfig rem vlan3');}
	if($vlan_en=="1")
	{
		stopcmd('vconfig rem eth0.1; vconfig rem eth0.'.$inter_vid);
	}
	else
	{
	if($qos_en=="1")	{stopcmd('vconfig rem eth0.1; vconfig rem eth0.2');}
	else				{stopcmd('vconfig rem eth0.1');}
	}
	stopcmd("rmmod et");
	return 0;
}

/* everything starts from here !! */
fwrite("w",$START, "#!/bin/sh\n");
fwrite("w", $STOP, "#!/bin/sh\n");

$ret = 9;
$layout = query("/device/layout");
if ($layout=="router")
{
	/* only 1W1L & 1W2L supported for router mode. */
	$mode = query("/device/router/mode"); if ($mode!="1W1L") $mode = "1W2L";
	$ret = layout_router($mode);
}
else if ($layout=="bridge")
{
	$ret = layout_bridge();
}

//longlay(20140123),let the wireless broadcom ether type pass to eapd or hostapd
if ($wirelessmode!="WirelessAp" && $wirelessmode!="WirelessRouter")
{
	startcmd("echo 1 > /proc/sys/net/ipv4/netfilter/enable_eapd");
}
else
{
	//we modify hostapd to listen broadcom events in bridge
	//startcmd("echo 0 > /proc/sys/net/ipv4/netfilter/enable_eapd");
	startcmd("echo 1 > /proc/sys/net/ipv4/netfilter/enable_eapd");
}

/* driver is not installed yet, we move this to s52wlan (tom, 20120405) */
/* startcmd("service PHYINF.WIFI start");*/ 
stopcmd("service PHYINF.WIFI stop");

startcmd("sleep 1");
startcmd("service INFSVCS.BRIDGE-1 start");
stopcmd("service INFSVCS.BRIDGE-1 stop");

error($ret);

?>
