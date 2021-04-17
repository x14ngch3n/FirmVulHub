<? include "/htdocs/phplib/html.php";
if($Remove_XML_Head_Tail != 1)	{HTML_hnap_200_header();}

include "etc/templates/hnap/GetIPv6Settings.php";


?>
<? if($Remove_XML_Head_Tail != 1)	{HTML_hnap_xml_header();}?>
		<GetIPv6StatusResponse xmlns="http://purenetworks.com/HNAP1/">
			<GetIPv6StatusResult><?=$result?></GetIPv6StatusResult>
			<IPv6_ConnectionType><?=$ConnectionType?></IPv6_ConnectionType>
			<IPv6_Network_Status><?=$wan_status?></IPv6_Network_Status>
			<IPv6_ConnectionTime><?=$wan_delta_uptime?></IPv6_ConnectionTime>
			<IPv6_WanLinkLocalAddress><?=$wanlladdr?></IPv6_WanLinkLocalAddress>
			<IPv6_WanAddress>
				<string><?=$StatusV6_wanipaddr?></string>
			</IPv6_WanAddress>
			<IPv6_DefaultGateway><?=$StatusV6_DefaultGateway?></IPv6_DefaultGateway>
			<IPv6_LanAddress>
				<string><? echo $lanip."/".$prefix; ?></string>
			</IPv6_LanAddress>
			<IPv6_LanLinkLocalAddress><?=$LanLinkLocalAddress?></IPv6_LanLinkLocalAddress>
			<IPv6_PrimaryDNS><?=$StatusV6_wanDNSserver?></IPv6_PrimaryDNS>
			<IPv6_SecondaryDNS><?=$StatusV6_wanDNSserver2?></IPv6_SecondaryDNS>
			<IPv6_DhcpPd><?=$enpd?></IPv6_DhcpPd>
			<IPv6_DhcpPdPrefix>
				<string><?=$lan_addr?></string>
			</IPv6_DhcpPdPrefix>
			<IPv6_GuestZoneAddress>
				<string><? echo $gz_lanip."/".$gz_prefix; ?></string>
			</IPv6_GuestZoneAddress>
			<IPv6_GuestZoneLinkLocalAddress><?=$gz_LanLinkLocalAddress?></IPv6_GuestZoneLinkLocalAddress>
		</GetIPv6StatusResponse>
<? if($Remove_XML_Head_Tail != 1)	{HTML_hnap_xml_tail();}?>
