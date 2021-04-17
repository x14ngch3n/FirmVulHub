<?
include "/htdocs/phplib/phyinf.php";
include "/htdocs/phplib/xnode.php";
include "/htdocs/webinc/config.php";

function get_igd_uuid()
{
	$igd = XNODE_getpathbytarget("/runtime/upnp", "dev", "deviceType",
			"urn:schemas-upnp-org:device:InternetGatewayDevice:1", 0);

	if ($igd != "") return query($igd."/guid");
	return "";
}
function get_phyinf_freq($uid)
{
	$phy = XNODE_getpathbytarget("", "phyinf", "uid", $uid);
	if($phy == "")
		return "";

	if(query($phy."/type") != "wifi")
		return "";

	$freq = query($phy."/media/freq");
	return $freq;
}
function check_guestzone_enable()
{
	include "/htdocs/webinc/config.php";
	$ret = 0;
//check 2.4G guest zone
	$phy = XNODE_getpathbytarget("", "phyinf", "uid", $WLAN1_GZ);
	if($phy != "")
	{
		if(query($phy."/active") == 1)
			$ret = $ret+1;
	}
//check 5G guest zone
	$phy = XNODE_getpathbytarget("", "phyinf", "uid", $WLAN2_GZ);
	if($phy != "")
	{
		if(query($phy."/active") == 1)
			$ret = $ret+1;
	}

	return $ret;
}
function get_lld2_br_param_str($br_type,$winf1,$winf2)
{
	$str = "";
	if($br_type==3 && $winf1!="" && $winf2!="")	$str = " ".$winf1." ".$winf2;
	else if($br_type==2 && $winf2!="")			$str = " ".$winf2;
	else if($br_type==1 && $winf1!="")			$str = " ".$winf1;
	return $str;
}
function get_other_lld2_br_str($head_str,$br_type,$winf1,$winf2,$br_gz_type,$winf_gz1,$winf_gz2)
{
	$return_str = "";
	$group_str = "";

	if($br_type==3 && $winf1!="" && $winf2!="")	$group_str = $group_str." ".$winf1." ".$winf2;
	else if($br_type==2 && $winf2!="")			$group_str = $group_str." ".$winf2;
	else if($br_type==1 && $winf1!="")			$group_str = $group_str." ".$winf1;

	if($br_gz_type==3 && $winf_gz1!="" && $winf_gz2!="")	$group_str = $group_str." ".$winf_gz1." ".$winf_gz2;
	else if($br_gz_type==2 && $winf_gz2!="")			$group_str = $group_str." ".$winf_gz2;
	else if($br_gz_type==1 && $winf_gz1!="")			$group_str = $group_str." ".$winf_gz1;

	if($group_str!="")
		$return_str = $head_str.$group_str." & > /dev/console\n";

	return $return_str;
}
$conf = "/var/lld2d.conf";
$laninf = PHYINF_getruntimeifname($LAN1);
$laninf2 = PHYINF_getruntimeifname($LAN2);
$wlaninf = PHYINF_getifname($WLAN1);
$g_zone_enable = check_guestzone_enable();

$phy_type = 2;// default is 2.4G band
if(get_phyinf_freq($WLAN1) == 5)
{
	$phy_type = 4;//4 represents 5G band.
}
$wlaninf2 = PHYINF_getifname($WLAN2);
$phy_type2 = 2;// default is 2.4G band.
if(get_phyinf_freq($WLAN2) == 5)
{
	$phy_type2 = 4;//4 represents 5G band.
}
if ($laninf=="")
{
	$laninf = PHYINF_getruntimeifname("BRIDGE-1");
}
if ($laninf=="")
{
	fwrite(a,$START,"exit 9\n");
}
else
{

	$icon = "/etc/config/lld2d.ico";

	fwrite(w, $conf,
		"helper = /etc/scripts/libs/lld2d-helper.php\n".
		"icon = ".$icon."\n".
		"jumbo-icon = ".$icon."\n".
		"uuid = ".get_igd_uuid()."\n".
		"net_flags = 0x70000000\n".
		"qos_flags = 0\n".
		"wl_physical_medium = ".$phy_type."\n".
		"max_op_rate = 108\n".
		"link_speed = 540000\n".
		"bridge_behavior = 1\n".
		"switch_speed = 1000000\n"
		);

	foreach ("/runtime/phyinf")
	{
		if (query("valid")=="1" && query("type")=="wifi" && query("media/parent")=="")
		{
			fwrite(a,$conf, "wifi_radio = 108,0x2,0x1,".query("macaddr")."\n");
		}
	}

	$layout		= query("/device/layout");
	$wirelessmode	= query("/device/wirelessmode");
	$vlanenable	= query("/device/vlan/active");
	$make_new_en = 0;
	$br_iptv = query("/device/vlan/iptv_br");
	$br_voip = query("/device/vlan/voip_br");
	$br0_group = 3 - strtoul($br_iptv,10) - strtoul($br_voip,10);

	$wlan_g1 = "";//initialized
	$wlan_g2 = "";
	$br_gz_iptv = 0;//initialized
	$br_gz_voip = 0;
	$br1_group = 3;//initialized
	if($g_zone_enable > 0)
	{
		$wlan_g1 = PHYINF_getifname($WLAN1_GZ);
		$wlan_g2 = PHYINF_getifname($WLAN2_GZ);
		$br_gz_iptv = query("/device/vlan/iptv_gz_br");
		$br_gz_voip = query("/device/vlan/voip_gz_br");
		$br1_group = 3 - strtoul($br_gz_iptv,10) - strtoul($br_gz_voip,10);
	}
	if($br0_group < 3 || $br1_group < 3)	$make_new_en = 1;
		
	if($vlanenable == "1" && $layout == "router" && $wirelessmode == "WirelessRouter" && $make_new_en == 1)
	{
		if($wlaninf2!="")
			fwrite(a,$conf, $wlaninf2." freq = ".$phy_type2."\n");//put second wireless frequency to config

		if($br0_group > 0)
		{
			fwrite(w,$START,"#!/bin/sh\nlld2d -c ".$conf." ".$laninf);
			fwrite(a,$START,get_lld2_br_param_str($br0_group,$wlaninf,$wlaninf2));
			fwrite(a,$START," & > /dev/console\n");
		}
		else
		{
			fwrite(w,$START,"#!/bin/sh\nlld2d -c ".$conf." ".$laninf);
			fwrite(a,$START," & > /dev/console\n");
		}
		if($g_zone_enable > 0)
		{
			if($br1_group > 0)
			{
				fwrite(a,$START,"lld2d -c ".$conf." ".$laninf2);
				fwrite(a,$START,get_lld2_br_param_str($br1_group,$wlan_g1,$wlan_g2));
				fwrite(a,$START," & > /dev/console\n");
			}
			else
			{
				fwrite(a,$START,"lld2d -c ".$conf." ".$laninf2);
				fwrite(a,$START," & > /dev/console\n");
			}
		}
		//get aother bridge members and start lld2d
		fwrite(a,$START,get_other_lld2_br_str("lld2d -c ".$conf." br3",$br_iptv,$wlaninf,$wlaninf2,$br_gz_iptv,$wlan_g1,$wlan_g2));
		fwrite(a,$START,get_other_lld2_br_str("lld2d -c ".$conf." br2",$br_voip,$wlaninf,$wlaninf2,$br_gz_voip,$wlan_g1,$wlan_g2));
	}
	else
	{
		fwrite(w,$START,"#!/bin/sh\nlld2d -c ".$conf." ".$laninf);
		if ($wlaninf!="")
		{
			fwrite(a,$START," ".$wlaninf);
		}
		if($wlaninf2!="")
		{
			fwrite(a,$conf, $wlaninf2." freq = ".$phy_type2."\n");//put second wireless frequency to config
			fwrite(a,$START," ".$wlaninf2);
		}
			fwrite(a,$START," & > /dev/console\n");
		if($g_zone_enable > 0)
		{
			fwrite(a,$START,"lld2d -c ".$conf." ".$laninf2);
		
			$wlan_g1 = PHYINF_getifname($WLAN1_GZ);
			$wlan_g2 = PHYINF_getifname($WLAN2_GZ);
		
			if($wlan_g1 != "")
				fwrite(a,$START," ".$wlan_g1);
			if($wlan_g2 != "")
				fwrite(a,$START," ".$wlan_g2);
		
		    fwrite(a,$START," & > /dev/console \n");
		}
	}
	fwrite(a,$START,"exit 0\n");
}

fwrite(w,$STOP,"#!/bin/sh\nkillall lld2d\nexit 0\n");
?>
