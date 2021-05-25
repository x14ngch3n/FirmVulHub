/**
 * @constructor
 */
function SOAPGetNetworkSettingsResponse()
{
	this.IPAddress = "";
	this.SubnetMask = "";
	this.DeviceName = "";
	this.LocalDomainName = "";
	this.IPRangeStart = "";
	this.IPRangeEnd = "";
	this.LeaseTime = "";
	this.Boradcast = "";
	this.DNSRelay = "";

};

// @prototype
SOAPGetNetworkSettingsResponse.prototype =
{
	
}

/**
 * @constructor
 */
function SOAPGetRouterLanSettingsResponse()
{
	this.RouterIPAddress = "";
	this.RouterSubnetMask = "";
	this.DHCPServerEnabled = "";
	this.RouterMACAddress = "";
};