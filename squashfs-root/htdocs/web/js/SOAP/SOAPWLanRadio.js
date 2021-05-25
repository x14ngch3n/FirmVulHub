/**
 * @constructor
 */
function SOAPGetWLanRadioSettings()
{
	this.RadioID ="";
}

/**
 * @constructor
 */
function SOAPGetWLanRadioSettingsResponse()
{
	this.Enabled = "";
	this.Mode = "";
	this.MacAddress = "";
	this.SSID = "";
	this.SSIDBroadcast = "";
	this.ChannelWidth = "";
	this.Channel = "";
	this.SecondaryChannel = "";
	this.Qos = "";
	this.ScheduleName = "";
	this.TXPower = "";
	this.RadioEnabled = "";
	this.Coexistence = "";

};

// @prototype
SOAPGetWLanRadioSettingsResponse.prototype =
{
	
}
/**
 * @constructor
 */
function SOAPGetWLanRadioSecurity()
{
	this.RadioID ="";
}

/**
 * @constructor
 */
function SOAPGetWLanRadioSecurityResponse()
{
	this.Enabled = "";
	this.Type = "";
	this.Encryption = "";
	this.Key = "";
	this.KeyRenewal = "";
	this.RadiusIP1 = "";
	this.RadiusPort1 = "";
	this.RadiusSecret1 = "";
	this.RadiusIP2 = "";
	this.RadiusPort2 = "";
	this.RadiusSecret2 = "";
};

// @prototype
SOAPGetWLanRadioSecurityResponse.prototype =
{	
	get Key(){
		return AES_Decrypt128(this._Key);
	},

	set Key(val){
		this._Key = val;
	},
	
}

/**
 * @constructor
 */
function SOAPSetWLanRadioSettings()
{
	this.RadioID ="";
	this.Enabled = true;
	this.Mode = "";
	this.SSID = "";
	this.SSIDBroadcast = true;
	this.ChannelWidth = "";
	this.Channel = "0";
	this.SecondaryChannel = "0";
	this.Qos = false;
	this.ScheduleName = "";
	this.TXPower = "";
	this.Coexistence = false;

};

/**
 * @constructor
 */
function SOAPSetWLanRadioSecurity()
{
	this.RadioID ="";
	this.Enabled = true;
	this.Type = "";
	this.Encryption = "";
	this.Key = "";
	this.KeyRenewal = "";
	this.RadiusIP1 = "";
	this.RadiusPort1 = "";
	this.RadiusSecret1 = "";
	this.RadiusIP2 = "";
	this.RadiusPort2 = "";
	this.RadiusSecret2 = "";
};

// @prototype
SOAPSetWLanRadioSecurity.prototype =
{	
	get Key(){
		return this._Key;
	},
	
//	get KeyGUI(){
//		return AES_Decrypt128(this._Key);
//	},

	set Key(val){
		this._Key = AES_Encrypt128(val);
	}
}

/**
 * @constructor
 */
function SOAPGetSmartconnectSettingsResponse()
{
	this.Enabled = "";
}

/**
 * @constructor
 */
function SOAPSetSmartconnectSettings()
{
	this.Enabled = false;
}

/**
 * @constructor
 */
function SOAPGetGuestZoneRouterSettingsResponse()
{
	this.InternetAccessOnly = false;
	this.IPAddress = "";
	this.SubnetMask = "";
	this.DHCPServer = "";
	this.DHCPRangeStart = "";
	this.DHCPRangeEnd = "";
	this.DHCPLeaseTime = 0;
}
