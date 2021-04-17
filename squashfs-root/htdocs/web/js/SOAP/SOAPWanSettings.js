/**
 * @constructor
 */
 function SOAPDNSSettings()
 {
	this.Primary = "";
	this.Secondary = "";
 }

/**
 * @constructor
 */
function SOAPSetWanSettings()
{
	this.Type = "";
	this.Username = "";
	this.Password = "";
	this.MaxIdleTime = 0;
	this.MTU = 1500;
	this.HostName = "";
	this.SetviceName = "";
	this.AutoReconnect = false;
	this.IPAddress = "";
	this.SubnetMask = "";
	this.Gateway = "";
	this.ConfigDNS = new SOAPDNSSettings();
	this.MacAddress = "";
	this.Wizard = "0"; //For dir880 only
	
	//IPv6
	this.DsLite_Configuration = "";
	this.DsLite_AFTR_IPv6Address = "";
	this.DsLite_B4IPv4Address = "";
};

// @prototype
SOAPSetWanSettings.prototype = 
{
	get Password(){
		return this._Password;
	},
	
//	get PasswordGUI(){
//		return AES_Decrypt128(this._Password);
//	},

	set Password(val){
		this._Password = AES_Encrypt128(val);
	}
}

/**
 * @constructor
 */
function SOAPGetWanSettingsResponse()
{
	this.Type = "";
	this.Username = "";
	this.Password = "";
	this.MaxIdleTime = 0;
	this.MTU = 1500;
	this.HostName = "";
	this.SetviceName = "";
	this.AutoReconnect = false;
	this.IPAddress = "";
	this.SubnetMask = "";
	this.Gateway = "";
	this.RuntimeDNS = new SOAPDNSSettings();
	this.ConfigDNS = new SOAPDNSSettings();
	this.MacAddress = "";
	this.VPNServerIPAddress = "";
	this.VPNLocalIPAddress = "";
	this.VPNLocalSubnetMask = "";
	this.VPNLocalGateway = "";
	this.Wizard = "0"; //For dir880 only
	
	//IPv6
	this.DsLite_Configuration = "";
	this.DsLite_AFTR_IPv6Address = "";
	this.DsLite_B4IPv4Address = "";
};

// @prototype
SOAPGetWanSettingsResponse.prototype = 
{	
	get Password(){
		return AES_Decrypt128(this._Password);
	},

	set Password(val){
		this._Password = val;
	},
	
	get IPAddress(){
		if(this._IPAddress == "0.0.0.0")
			return "";

		return this._IPAddress;
	},

	set IPAddress(val){
		this._IPAddress = val;
	},
	
	get SubnetMask(){
		if(this._SubnetMask == "0.0.0.0")
			return "";

		return this._SubnetMask;
	},

	set SubnetMask(val){
		this._SubnetMask = val;
	},
	
	get Gateway(){
		if(this._Gateway == "0.0.0.0")
			return "";

		return this._Gateway;
	},

	set Gateway(val){
		this._Gateway = val;
	}
}

/**
 * @constructor
 */
function SOAPSetTriggerADIC()
{
	this.TriggerADIC = false;
}

/**
 * @constructor
 */
function SOAPGetCurrentInternetStatus()
{
	this.InternetStatus = false;
}

/**
 * @constructor
 */
function SOAPRenewWanConnection()
{
	this.Action = "";
}

/**
 * @constructor
 */
function SOAPGetWanStatusResponse()
{
	this.Status = "";
	this.Session = "";
}

/**
 * @constructor
 */
function SOAPGetCurrentInternetStatus()
{
	this.InternetStatus = "";
}

/**
 * @constructor
 */
function SOAPGetInternetConnUpTimeResponse()
{
	this.UpTime = "";
}

