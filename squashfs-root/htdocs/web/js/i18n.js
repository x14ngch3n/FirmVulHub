function LOCALIZE(){}
LOCALIZE.prototype =
{
	//localize object
	localize: null,
	
	GetLangfile: function(langCode)
	{
		var self = this;

		//auto detect browser language
		if(langCode === "auto")
		{
			var autoDetect = (navigator.browserLanguage || navigator.language);
			langCode = autoDetect.toLowerCase();
		}

		$.ajax({
			type: "GET",
			url: "/js/localization/"+ langCode + ".js",
			dataType: 'json',
  			async: false,
		})
		.done(function(data){
			self.localize = data;
			sessionStorage.setItem('langPack', JSON.stringify(data));
		})
		.fail(function(xhr, ajaxOptions, thrownError){
			//console.log("GetLangfile statuscode="+xhr.status);
			//console.log(thrownError);
		});
	},
	
	LangReplace: function(args, string)
	{
		try 
		{
			var pattern = (args.length > 0) ? new RegExp('\\$([1-' + args.length.toString() + '])', 'g') : null;
			var str = this.localize.hasOwnProperty(string) ? this.localize[string] : string;
			var result = String(str).replace(pattern, 
				function (match, index) 
				{ 
					index++;
					return args[index]; 
				});
			return result;
		} 
		catch (e)
		{
			//console.log(e);
			return string;
		}
	}
};

var LANG = new LOCALIZE();

function InitLANG(lang)
{
	var langPack = sessionStorage.getItem('langPack');
	 
	if(langPack == null)
	{
		
		LANG.GetLangfile(lang);
	}
	else
	{
		LANG.localize = JSON.parse(langPack);
	}
}

function I18N(type, string)
{
	var args = arguments;
	var res;
	
	string = string.toString() || '';
	res = LANG.LangReplace(args, string);
	
	if (type === 'h') { document.write(res); }
	else if (type === 'j') { return res; }
}