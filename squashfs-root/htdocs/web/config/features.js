//common
function CommonDeviceInfo()
{
	this.bridgeMode = false;
	this.featureVPN = false;

	this.featureSharePort = true;
	this.featureDLNA = false;
	this.featureUPNPAV = true;
	this.featureSmartConnect = false;
	this.featureMyDLink = true;
	this.featureRebootSchedule = true;
	
	this.supportUSB30Settings = false;
	
	this.helpVer = "";
}

$.getScript("/config/deviceinfo.js", function(){
	DeviceInfo.prototype = new CommonDeviceInfo();
	var currentDevice = new DeviceInfo();
	
	//set device info
	sessionStorage.setItem('currentDevice', $.stringify(currentDevice));
});

