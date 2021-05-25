/**
 * @constructor
 */
function SOAPSetMyDLinkSettings()
{
	this.Enabled = true;
	this.Email = "";
	this.Password = "";
	this.LastName = "";
	this.FirstName = "";
	this.AccountStatus = false;
};

// @prototype
SOAPSetMyDLinkSettings.prototype = 
{
	get Password(){
		return this._Password;
	},

	set Password(val){
		this._Password = AES_Encrypt128(val);
	}
}



/**
 * @constructor
 */
function SOAPGetMyDLinkSettingsResponse()
{
	this.Enabled = false;
	this.Email = "";
	this.Password = "";
	this.LastName = "";
	this.FirstName = "";
	this.AccountStatus = false;
};

// @prototype
SOAPGetMyDLinkSettingsResponse.prototype = 
{
	get Password(){
		return AES_Decrypt128(this._Password);
	},

	set Password(val){
		this._Password = val;
	}
}