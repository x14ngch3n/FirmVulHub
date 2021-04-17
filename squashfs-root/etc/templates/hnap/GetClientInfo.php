<? include "/htdocs/phplib/html.php";
if($Remove_XML_Head_Tail != 1)	{HTML_hnap_200_header();}

include "/htdocs/phplib/xnode.php";
include "/htdocs/webinc/config.php";
include "/htdocs/phplib/trace.php"; 
include "/htdocs/phplib/phyinf.php";
include "/htdocs/phplib/inf.php"; 
$result = "OK";

// Solve arpmonitor refresh issue: The arpmonitor daemon would refresh "/runtime/mydlink/userlist" when it sense the client information is changed.
// If the refresh process is not complete and GetClientInfo get the information, the client information would be error.
// This is the root cause the client number may jump when the client number is too many which is reported by Alpha support Josh.
// We use mapping mydlink entry in runtime node to work around this issue.
function map_mydlink_entry()
{
	$mydlink_userlist_n = map("/runtime/mydlink/userlist/entry#", "", 0, "*", get("", "/runtime/mydlink/userlist/entry#"));
	$mydlink_userlist_n_old = map("/runtime/mydlink/userlist_map/userlist_entry_old", "", 0, "*", get("", "/runtime/mydlink/userlist_map/userlist_entry_old"));
	if($mydlink_userlist_n > 10)
	{
		if($mydlink_userlist_n > $mydlink_userlist_n_old)
		{
			foreach("/runtime/mydlink/userlist/entry")
			{
				$mydlink_userlist_map_n = map("/runtime/mydlink/userlist_map/entry#", "", 0, "*", get("", "/runtime/mydlink/userlist_map/entry#"));
				if($mydlink_userlist_map_n == 0)
				{
					set("/runtime/mydlink/userlist_map/entry:1/ipv4addr",	get("", "ipv4addr"));
					set("/runtime/mydlink/userlist_map/entry:1/ipv6addr",	get("", "ipv6addr"));
					set("/runtime/mydlink/userlist_map/entry:1/macaddr",	get("", "macaddr"));
					set("/runtime/mydlink/userlist_map/entry:1/hostname",	get("", "hostname"));
					set("/runtime/mydlink/userlist_map/entry:1/infname",	get("", "infname"));
				}
				else
				{
					$mac_match = "false";
					$i = 1;
					while($i <= $mydlink_userlist_map_n)
					{
						if(PHYINF_macnormalize(get("", "macaddr"))==PHYINF_macnormalize(get("", "/runtime/mydlink/userlist_map/entry:".$i."/mac")))
						{
							$mac_match = "true";
							break;
						}
						$i++;
					}
					if($mac_match == "false")
					{
						set("/runtime/mydlink/userlist_map/entry:".$i."/ipv4addr",	get("", "ipv4addr"));
						set("/runtime/mydlink/userlist_map/entry:".$i."/ipv6addr",	get("", "ipv6addr"));
						set("/runtime/mydlink/userlist_map/entry:".$i."/macaddr",	get("", "macaddr"));
						set("/runtime/mydlink/userlist_map/entry:".$i."/hostname",	get("", "hostname"));
						set("/runtime/mydlink/userlist_map/entry:".$i."/infname",	get("", "infname"));
					}
				}
			}
			if($mydlink_userlist_map_n > 100)
			{	del("/runtime/mydlink/userlist_map/entry:1");}
		}
		set("/runtime/mydlink/userlist_map/userlist_entry_old", $mydlink_userlist_n);
	}
}

function find_dhcps4_staticleases_info($mac, $getinfo, $LAN1, $LAN2)
{
	foreach("/dhcps4/entry")
	{
		$dhcps4_name = get("", "uid");
		foreach("staticleases/entry")
		{
			if(PHYINF_macnormalize($mac)==PHYINF_macnormalize(get("", "macaddr")))
			{
				if($getinfo=="nickname")	
				{return get("", "description");}
				else if($getinfo=="reserveip" && get("", "hostid")!="")
				{
					if($dhcps4_name==get("", INF_getinfpath($LAN1)."/dhcps4"))
					{return ipv4ip(INF_getcurripaddr($LAN1), INF_getcurrmask($LAN1), get("", "hostid"));}
					else
					{return	ipv4ip(INF_getcurripaddr($LAN2), INF_getcurrmask($LAN2), get("", "hostid"));}					
				}
			}
		}	
	}
	return "";
}

function get_clientpath($mac, $LAN1, $LAN2)
{
	/* MAC OS 10.7 would not supply hostname in DHCP process. It could not get the hostname in /runtime/inf(LAN-1)/dhcps4/leases.
	   However, Mydlink service would use Netbios to get the client information include hostname and the information from static client. */
	foreach("/runtime/mydlink/userlist/entry")
	{
		if(PHYINF_macnormalize($mac)==PHYINF_macnormalize(get("", "macaddr")))
		{return "/runtime/mydlink/userlist/entry:".$InDeX;}
	}

	// Solve arpmonitor refresh issue
	foreach("/runtime/mydlink/userlist_map/entry")
	{
		if(PHYINF_macnormalize($mac)==PHYINF_macnormalize(get("", "macaddr")))
		{return "/runtime/mydlink/userlist_map/entry:".$InDeX;}
	}

	/* If Mydlink service is not supported get the DHCP client information from our DHCP leases. */
	$LAN=$LAN1;
	while($LAN != "")
	{		
		$path = XNODE_getpathbytarget("/runtime", "inf", "uid", $LAN, 0);
		foreach($path."/dhcps4/leases/entry")
		{
			if(PHYINF_macnormalize($mac)==PHYINF_macnormalize(get("", "macaddr")))
			{return $path."/dhcps4/leases/entry:".$InDeX;}
		}
					
		if($LAN==$LAN1)	{$LAN = $LAN2;}
		else			{$LAN = "";} 
	}

	return "";
}

function getIPv6AddrByMAC($mac)
{
	$info_p = XNODE_getpathbytarget("/runtime/mydlink/userlist","entry", "macaddr",$mac,"0");
	if ($info_p == "")
	{ return ""; }
	return get("x",$info_p."/ipv6addr");
}

setattr("/runtime/getclientsinfo/brctl_show", "get", "brctl show > /var/brctl_show");
setattr("/runtime/getclientsinfo/brctl_showmacs_br1", "get", "brctl showmacs br1 > /var/brctl_showmacs_br1");
setattr("/runtime/getclientsinfo/brctl_showmacs_br0", "get", "brctl showmacs br0 > /var/brctl_showmacs_br0");
get("s", "/runtime/getclientsinfo/brctl_show");
get("s", "/runtime/getclientsinfo/brctl_showmacs_br1");
get("s", "/runtime/getclientsinfo/brctl_showmacs_br0");
$brctl_show = fread("s", "/var/brctl_show");
$brctl_showmacs_br1 = fread("s", "/var/brctl_showmacs_br1");
$brctl_showmacs_br0 = fread("s", "/var/brctl_showmacs_br0");
unlink("/var/brctl_show");
unlink("/var/brctl_showmacs_br1");
unlink("/var/brctl_showmacs_br0");
$wlan1_name		= PHYINF_getifname($WLAN1);
$wlan1_gz_name	= PHYINF_getifname($WLAN1_GZ);
$wlan2_name		= PHYINF_getifname($WLAN2);
$wlan2_gz_name	= PHYINF_getifname($WLAN2_GZ);
TRACE_debug("$wlan1_name=".$wlan1_name."\n$wlan1_gz_name=".$wlan1_gz_name."\n$wlan2_name=".$wlan2_name."\n$wlan2_gz_name=".$wlan2_gz_name);

$tailindex	= strstr($brctl_show, "\n")+1;
$tablelen	= strlen($brctl_show);
$line		= substr($brctl_show, $tailindex, $tablelen-$tailindex);
while($line != "")
{
	$tailindex	= strstr($line, "\n")+1;
	$subline	= substr($line, 0, $tailindex);
	$interface	= scut($subline, 3, "");
	if($interface==""){$interface = scut($subline, 0, "");}	
	TRACE_debug("$interface=".$interface);
	
	if($interface == $wlan1_name)			{$br_type = "WiFi_2.4G";}
	else if($interface == $wlan1_gz_name)	{$br_type = "WiFi_2.4G_Guest";}
	else if($interface == $wlan2_name)		{$br_type = "WiFi_5G";}
	else if($interface == $wlan2_gz_name)	{$br_type = "WiFi_5G_Guest";}
	else									{$br_type = "LAN";}
	TRACE_debug("$br_type=".$br_type);
	
	if(strstr($subline, "br1")!="")						{$br1_p1_type = $br_type;$br="br1";}
	else if(strstr($subline, "br0")=="" && $br=="br1")	{$br1_p2_type = $br_type;}
	else if(strstr($subline, "br0")!="")				{$br0_p1_type = $br_type;$br="br0";}
	else if($br=="br0" && $br0_p2_type=="")				{$br0_p2_type = $br_type;}
	else if($br=="br0" && $br0_p3_type=="")				{$br0_p3_type = $br_type;}
	
	$tablelen	= strlen($line);
	$line		= substr($line, $tailindex, $tablelen-$tailindex);
}
TRACE_debug("$br1_p1_type=".$br1_p1_type."\n $br1_p2_type=".$br1_p2_type."\n $br0_p1_type=".$br0_p1_type."\n $br0_p2_type=".$br0_p2_type."\n $br0_p3_type=".$br0_p3_type);
?>
<? if($Remove_XML_Head_Tail != 1)	{HTML_hnap_xml_header();}?>
<GetClientInfoResponse xmlns="http://purenetworks.com/HNAP1/">
	<GetClientInfoResult><?=$result?></GetClientInfoResult>
		<ClientInfoLists>
		<?
		map_mydlink_entry(); // Solve arpmonitor refresh issue
		del("/runtime/mydlink/brctl_showmacs_br");
		$brctl_showmacs_br_entry = 0;
		$i=0;
		while($i < 2)
		{
			if($i==0)	{$brctl_showmacs = $brctl_showmacs_br0;$br="br0";}
			else		{$brctl_showmacs = $brctl_showmacs_br1;$br="br1";}
			
			$tailindex	= strstr($brctl_showmacs, "\n")+1;
			$portindex	= 2;
			$macindex	= strstr($brctl_showmacs, "mac addr")-4;
			$maclen     = strlen("00:00:00:00:00:00");
			$tablelen	= strlen($brctl_showmacs);
			$line		= substr($brctl_showmacs, $tailindex, $tablelen-$tailindex);			
			
			while($line != "")
			{
				$tailindex	= strstr($line, "\n")+1;
				$subline	= substr($line, 0, $tailindex);
				if(strstr($subline, "no")!="") //It means not in local.
				{
					$mac			= strip(substr($subline, $macindex, $maclen));
					// ---Collect the connected device MAC information from brctl showmacs br0 and br1 to /runtime/mydlink/brctl_showmacs_br.
					$brctl_showmacs_br_entry++;
					set("/runtime/mydlink/brctl_showmacs_br/entry:".$brctl_showmacs_br_entry."/mac", $mac);
					// Collect the connected device MAC information from brctl showmacs br0 and br1 to /runtime/mydlink/brctl_showmacs_br.---
					$client_path	= get_clientpath($mac, $LAN1, $LAN2);
					TRACE_debug("$client_path=".$client_path);
					$ipaddr			= get("", $client_path."/ipaddr");
					if($ipaddr==""){$ipaddr	= get("", $client_path."/ipv4addr");}
				  if($ipaddr!="" && $ipaddr!="0.0.0.0" && $ipaddr!=INF_getcurripaddr($LAN1) && $ipaddr!=INF_getcurripaddr($LAN2))
				  {
						$hostname		= get("x", $client_path."/hostname");
						$portnumber		= substr($subline, 2, 1);
						if($br=="br1" && $portnumber==1)		{$type=$br1_p1_type;}
						else if($br=="br1" && $portnumber==2)	{$type=$br1_p2_type;} 
						else if($br=="br0" && $portnumber==1)	{$type=$br0_p1_type;}					
						else if($br=="br0" && $portnumber==2)	{$type=$br0_p2_type;} 
						else if($br=="br0" && $portnumber==3)	{$type=$br0_p3_type;}
						$nickname = find_dhcps4_staticleases_info($mac, "nickname", $LAN1, $LAN2);
						$reserveip = find_dhcps4_staticleases_info($mac, "reserveip", $LAN1, $LAN2);
											
						echo "	<ClientInfo>\n";
						echo "		<MacAddress>".$mac."</MacAddress>\n";
						echo "		<IPv4Address>".$ipaddr."</IPv4Address>\n";
						echo "		<IPv6Address>".getIPv6AddrByMAC($mac)."</IPv6Address>\n";	//+++ HuanYao Kang.
						echo "		<Type>".$type."</Type>\n";
						echo "		<DeviceName>".$hostname."</DeviceName>\n";
						echo "		<NickName>".$nickname."</NickName>\n";
						echo "		<ReserveIP>".$reserveip."</ReserveIP>\n";
						echo "	</ClientInfo>\n";
					}
				}	
				
				$tablelen	= strlen($line);
				$line		= substr($line, $tailindex, $tablelen-$tailindex);							
			}
			$i++;
		}
		// Add value "OFFLINE" of Type in struct ClientInfo, for indicating reserved IP clients which is not connected to fit the HNAP SPEC. "D-Link HNAP Extension - 20141215v1.32.pdf".
		foreach("/dhcps4/entry")
		{
			foreach("staticleases/entry")
			{
				$mac_reserved = get("", "macaddr");
				$runtime_brctl_showmacs_path = XNODE_getpathbytarget("/runtime/mydlink/brctl_showmacs_br", "entry", "mac", $mac_reserved, 0);
				TRACE_debug("$mac_reserved=".$mac_reserved."\n$runtime_brctl_showmacs_path=".$runtime_brctl_showmacs_path);
				if($runtime_brctl_showmacs_path=="" && get("", "hostid")!="")
				{
					echo "	<ClientInfo>\n";
					echo "		<MacAddress>".$mac_reserved."</MacAddress>\n";
					echo "		<IPv4Address></IPv4Address>\n";
					echo "		<IPv6Address></IPv6Address>\n";
					echo "		<Type>OFFLINE</Type>\n";
					echo "		<DeviceName>".get("", "hostname")."</DeviceName>\n";
					echo "		<NickName>".get("", "description")."</NickName>\n";
					echo "		<ReserveIP>".find_dhcps4_staticleases_info($mac_reserved, "reserveip", $LAN1, $LAN2)."</ReserveIP>\n";
					echo "	</ClientInfo>\n";
				}
			}
		}
		?></ClientInfoLists>
</GetClientInfoResponse>
<? if($Remove_XML_Head_Tail != 1)	{HTML_hnap_xml_tail();}?>
