<?
//this script needs argument EVENT, we need this to control WIFI LEDs

include "/etc/services/PHYINF/phywifi.php";

echo "#!/bin/sh\n";

if(get("x", "/device/layout") != "router")
{
	return;
}

if($EVENT == "WPS_IN_PROGRESS" || $EVENT == "WPS_OVERLAP")
{
	if(is_active("BAND24G-1.1") == 1)
	{
		echo "usockc /var/gpio_ctrl WIFI2_LED_BLINK_FAST\n";
	}

	if(is_active("BAND5G-1.1") == 1)
	{
		echo "usockc /var/gpio_ctrl WIFI5_LED_BLINK_FAST\n";
	}	
}

if($EVENT == "WPS_SUCCESS" || $EVENT == "WPS_ERROR" || $EVENT == "WPS_NONE")
{
	if(is_active("BAND24G-1.1") == 1)
	{
		echo "usockc /var/gpio_ctrl WIFI2_LED_ON\n";
	}

	if(is_active("BAND5G-1.1") == 1)
	{
		echo "usockc /var/gpio_ctrl WIFI5_LED_ON\n";
	}	
}

?>
