HTTP/1.1 200 OK
Content-Type: text/xml; charset=utf-8

<?
include "/htdocs/phplib/xnode.php";
include "/htdocs/phplib/trace.php";
include "/htdocs/phplib/inf.php";
include "/htdocs/phplib/phyinf.php";
include "/htdocs/webinc/config.php";
echo "\<\?xml version='1.0' encoding='utf-8'\?\>";
$nodebase="/runtime/hnap/SetClientInfo/";
$result="OK";

$dhcps4_lan1 = get("", INF_getinfpath($LAN1)."/dhcps4");
$dhcps4_lan2 = get("", INF_getinfpath($LAN2)."/dhcps4");
$dhcps4_lan1_path = XNODE_getpathbytarget("/dhcps4", "entry", "uid", $dhcps4_lan1, "0");
$dhcps4_lan2_path = XNODE_getpathbytarget("/dhcps4", "entry", "uid", $dhcps4_lan2, "0");
$max_dhcps4_lan1_staticleases = get("", $dhcps4_lan1_path."/staticleases/max");
$max_dhcps4_lan2_staticleases = get("", $dhcps4_lan2_path."/staticleases/max");
$networkid_lan1 = ipv4networkid(INF_getcurripaddr($LAN1), INF_getcurrmask($LAN1));
$networkid_lan2 = ipv4networkid(INF_getcurripaddr($LAN2), INF_getcurrmask($LAN2));

$en_bwc1 = get("","/bwc/entry:1/enable");
$en_bwc2 = get("","/bwc/entry:2/enable");
$entry_bwcf = "/bwc/bwcf/entry";

//Error Check
//If the new reserve IP is already exist with another MAC address in the router, return ERROR_RESERVEIP_CONFLICT.
foreach($nodebase."ClientInfoLists/ClientInfo")
{
	$ReserveIP = get("", "ReserveIP");
	$MacAddr = get("", "MacAddress");
	if($ReserveIP == "") {continue;}
	else
	{
		if(ipv4networkid($ReserveIP, INF_getcurrmask($LAN1))==$networkid_lan1)
		{
			$hostid = ipv4hostid($ReserveIP, INF_getcurrmask($LAN1));
			foreach($dhcps4_lan1_path."/staticleases/entry")
			{
				if($hostid == get("", "hostid") && PHYINF_macnormalize($MacAddr) != PHYINF_macnormalize(get("", "macaddr")))
				{
					$result="ERROR_RESERVEIP_CONFLICT";
					break;
				}
			}
		}
		else if(ipv4networkid($ReserveIP, INF_getcurrmask($LAN2))==$networkid_lan2)
		{
			$hostid = ipv4hostid($ReserveIP, INF_getcurrmask($LAN2));
			foreach($dhcps4_lan2_path."/staticleases/entry")
			{
				if($hostid == get("", "hostid") && PHYINF_macnormalize($MacAddr) != PHYINF_macnormalize(get("", "macaddr")))
				{
					$result="ERROR_RESERVEIP_CONFLICT";
					break;
				}
			}
		}
		else // The reserve IP is not belonging to LAN IP.
		{
			$result="ERROR";
			break;
		}
	}
}

//Error Check
//If the rule set in /dhcps4 is bigger than 24, return ERROR_RESERVEIP_TOO_MANY.
foreach("/dhcps4/entry")
{
	$dhcps4_name = get("", "uid");

	if($dhcps4_name == get("", INF_getinfpath($LAN1)."/dhcps4")) //DHCPS4-1
	{
		$cnt = get("", "staticleases/count");
		$MacAddr = get("", $nodebase."ClientInfoLists/ClientInfo/MacAddress");

		if($cnt == 24)
		{
			$result="ERROR_RESERVEIP_TOO_MANY";

			foreach("staticleases/entry")
			{			
				$macaddr = get("", "macaddr");

				if(PHYINF_macnormalize($MacAddr) == PHYINF_macnormalize(get("", "macaddr")))
				{
					$result="OK";
					break;
				}
			}
 		}
	}
}

foreach($nodebase."ClientInfoLists/ClientInfo")
{
	if($result != "OK") {break;}
	$MacAddr	= tolower(get("", "MacAddress"));
	$NickName	= get("", "NickName");
	$ReserveIP	= get("", "ReserveIP");
	foreach("/runtime/mydlink/userlist/entry")
	{
		if(PHYINF_macnormalize($MacAddr)==PHYINF_macnormalize(get("", "macaddr")))
		{
			$HostName = map("hostname", "", "''", "*", get("", "hostname")); //The dhcpd daemon could not be executed if the hostname of DHCP reservation is empty.
			$ipv4addr = get("", "ipv4addr");
			break;
		}	
	}
	$InLAN1 = 0;
	$InLAN2 = 0;
 	if(ipv4networkid($ipv4addr, INF_getcurrmask($LAN1))==$networkid_lan1) $InLAN1=1;
	if(ipv4networkid($ipv4addr, INF_getcurrmask($LAN2))==$networkid_lan2) $InLAN2=1;
	if($ipv4addr == "")  // Client is offline with reserved IP and the entry is disappeared in /runtime/mydlink/userlist.
	{
		if(XNODE_getpathbytarget("/dhcps4/entry:1/staticleases", "entry", "macaddr", $MacAddr, 0)!="")		$InLAN1 = 1;
		else if(XNODE_getpathbytarget("/dhcps4/entry:2/staticleases", "entry", "macaddr", $MacAddr, 0)!="")	$InLAN2 = 1;
	}
	// The client is not connected to the device and had not DHCP reservation before.
	// We will preset the DHCP reservation before the client is connected to the device.
	if($InLAN1==0 && $InLAN2==0)
	{
		$HostName = "''"; //The dhcpd daemon could not be executed if the hostname of DHCP reservation is empty.
 		if(ipv4networkid($ReserveIP, INF_getcurrmask($LAN1))==$networkid_lan1) $InLAN1=1;
		if(ipv4networkid($ReserveIP, INF_getcurrmask($LAN2))==$networkid_lan2) $InLAN2=1;
	}
	TRACE_debug("$InLAN1=".$InLAN1."\n$InLAN2=".$InLAN2);
	if($InLAN1==1)
	{
		anchor($dhcps4_lan1_path."/staticleases");
		$dhcps4_staticleases_path = $dhcps4_lan1_path."/staticleases";
		$hostid = ipv4hostid($ReserveIP, INF_getcurrmask($LAN1));
	}
	else if($InLAN2==1)
	{
		anchor($dhcps4_lan2_path."/staticleases");
		$dhcps4_staticleases_path = $dhcps4_lan2_path."/staticleases";
		$hostid = ipv4hostid($ReserveIP, INF_getcurrmask($LAN2));
	}
	
	if($InLAN1==1 || $InLAN2==1)
	{
		$count = get("", "count");
		$seqno = get("", "seqno");
		if($count == "")$count=1;
		if($seqno == "")$seqno=1;
		$dhcps4_staticleases_entry_path =  XNODE_getpathbytarget($dhcps4_staticleases_path, "entry", "macaddr", $MacAddr, 0);
		if($dhcps4_staticleases_entry_path != "") //Modified old setting.
		{
			if($InLAN1==1)
			{
				if($NickName!="" && $ReserveIP!="")
				{
					set($dhcps4_staticleases_entry_path."/enable", "1");
					set($dhcps4_staticleases_entry_path."/description", $NickName);
					set($dhcps4_staticleases_entry_path."/hostname", $HostName);
					set($dhcps4_staticleases_entry_path."/hostid", $hostid);
				}
				else if($NickName!="")
				{
					set($dhcps4_staticleases_entry_path."/enable", "0");
					set($dhcps4_staticleases_entry_path."/description", $NickName);
					del($dhcps4_staticleases_entry_path."/hostname");
					del($dhcps4_staticleases_entry_path."/hostid");
				}
				else if($ReserveIP!="")
				{
					set($dhcps4_staticleases_entry_path."/enable", "1");
					del($dhcps4_staticleases_entry_path."/description");
					set($dhcps4_staticleases_entry_path."/hostname", $HostName);
					set($dhcps4_staticleases_entry_path."/hostid", $hostid);
				}
				else if($NickName=="" && $ReserveIP=="") //Remove the entry setting
				{
					del($dhcps4_staticleases_entry_path);
					$count--;
					set("count", $count);
				}
				
				if($en_bwc1 == 1 && $en_bwc2 == 1 && $ReserveIP != "")
				{
					$bwc = 0;
					$newip = ipv4ip(INF_getcurripaddr($LAN1), INF_getcurrmask($LAN1), $hostid);
					
					foreach($entry_bwcf)
					{
						$ipaddr = get("", "ipv4/start");
						if(PHYINF_macnormalize(get("", "mac")) == PHYINF_macnormalize(get("", $dhcps4_staticleases_entry_path."/macaddr")))
						{
							if($newip != $ipaddr)
							{
								set("ipv4/start", $newip);
								set("ipv4/end", $newip);
								$bwc = 1;
							}
						}
					}
				}
			}
			else //gusetzone not support reserveIP
			{
				if($NickName != "")
				{
					set($dhcps4_staticleases_entry_path."/enable", "0");
					set($dhcps4_staticleases_entry_path."/description", $NickName);
					del($dhcps4_staticleases_entry_path."/hostname");
					del($dhcps4_staticleases_entry_path."/hostid");
				}
				else if($NickName == "") //Remove the entry setting
				{
					del($dhcps4_staticleases_entry_path);
					$count--;
					set("count", $count);
				}				
			}
		}
		else //Add new setting.
		{
			if($count < get("", "max"))
			{
				if($NickName=="" && $ReserveIP=="") continue;//Don't save anything.

				$count++;
				set("entry:".$count."/uid", "STIP-".$seqno);
				set("entry:".$count."/macaddr", $MacAddr);
				if($NickName!="" && $ReserveIP!="")
				{
					set("entry:".$count."/enable", "1");
					set("entry:".$count."/description", $NickName);
					set("entry:".$count."/hostname", $HostName);
					set("entry:".$count."/hostid", $hostid);
				}	
				else if($NickName!="")
				{
					set("entry:".$count."/enable", "0");
					set("entry:".$count."/description", $NickName);
				}	
				else if($ReserveIP!="")
				{
					set("entry:".$count."/enable", "1");
					set("entry:".$count."/hostname", $HostName);
					set("entry:".$count."/hostid", $hostid);				
				}
				set("count", $count);
				set("seqno", $seqno+1);
				
				if($en_bwc1 == 1 && $en_bwc2 == 1 && $ReserveIP != "")
				{
					$bwc = 0;
					$newip = ipv4ip(INF_getcurripaddr($LAN1), INF_getcurrmask($LAN1), $hostid);
					
					foreach($entry_bwcf)
					{
						$ipaddr = get("", "ipv4/start");
						if(PHYINF_macnormalize(get("", "mac")) == PHYINF_macnormalize($MacAddr))
						{
							if($newip != $ipaddr)
							{
								set("ipv4/start", $newip);
								set("ipv4/end", $newip);
								$bwc = 1;
							}
						}
					}
				}
			}
		}
	}				
}

fwrite("w",$ShellPath, "#!/bin/sh\n");
fwrite("a",$ShellPath, "echo \"[$0]-->Client Info Changed\" > /dev/console\n");
if($result == "OK")
{

	fwrite("a",$ShellPath, "event DBSAVE > /dev/console\n");
	fwrite("a",$ShellPath, "service DHCPS4.LAN-1 restart\n");
	fwrite("a",$ShellPath, "service DHCPS4.LAN-2 restart\n");	
	if($bwc == "1") fwrite("a",$ShellPath, "service BWC restart > /dev/console\n");
	fwrite("a",$ShellPath, "xmldbc -s /runtime/hnap/dev_status '' > /dev/console\n");
	set("/runtime/hnap/dev_status", "ERROR");
}
else
{
	fwrite("a",$ShellPath, "echo \"We got a error in setting, so we do nothing...\" > /dev/console\n");	
}
?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <SetClientInfoResponse xmlns="http://purenetworks.com/HNAP1/">
      <SetClientInfoResult><?=$result?></SetClientInfoResult>
    </SetClientInfoResponse>
  </soap:Body>
</soap:Envelope>