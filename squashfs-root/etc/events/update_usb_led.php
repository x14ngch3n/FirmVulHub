<?

//usb device table | grep topology information | grep non-hub device | grep usb2 port string (Port=01)
setattr("/runtime/device/storage/usb2","get","cat /proc/bus/usb/devices | grep T: | grep -v \"Dev#=  1\" | grep \"Port=01\"");
//usb device table | grep topology information | grep non-hub device | grep usb3 port string (Port=00)
setattr("/runtime/device/storage/usb3","get","cat /proc/bus/usb/devices | grep T: | grep -v \"Dev#=  1\" | grep \"Port=00\"");

$status = get("x", "/runtime/device/storage/usb2");
if($status != "")
{
	echo "usockc /var/gpio_ctrl USB2_LED_ON\n";
}
else
{
	echo "usockc /var/gpio_ctrl USB2_LED_OFF\n";
}

$status = get("x", "/runtime/device/storage/usb3");
if($status != "")
{
	echo "usockc /var/gpio_ctrl USB3_LED_ON\n";
}
else
{
	echo "usockc /var/gpio_ctrl USB3_LED_OFF\n";
}

del("/runtime/device/storage/usb2");
del("/runtime/device/storage/usb3");

?>
