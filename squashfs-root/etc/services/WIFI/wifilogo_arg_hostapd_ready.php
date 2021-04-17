<? /* vi: set sw=4 ts=4: */
include "/htdocs/phplib/xnode.php";
include "/etc/services/PHYINF/phywifi.php";
include "/htdocs/webinc/config.php";

$command = "";

function config_adaptivity_test($uid)
{
	if(is_active($uid) == 1)
	{
		$thresh = get_phy_ed_thresh($uid);
		if($thresh != "")
		{
			$dev = devname($uid);
			return "wl -i ".$dev." phy_ed_thresh ".$thresh."\n";
		}
	}

	return "";
}

$command = $command.config_adaptivity_test($_GLOBALS["WLAN1"]);
$command = $command.config_adaptivity_test($_GLOBALS["WLAN2"]);

if($command != "")
{
	//we need a delay for waiting hostapd, because "wl down" and "wl up" will set phy_ed_thresh to default value
	echo "sleep 1\n";
	echo $command;
}

?>
