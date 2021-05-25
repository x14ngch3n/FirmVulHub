function DetectBrowserVersion()
{
	var nVer = navigator.appVersion;
	var navigatorAgent = navigator.userAgent;
	var browserName  = navigator.appName;
	var fullVersion  = ''+parseFloat(navigator.appVersion);
	var majorVersion = parseInt(navigator.appVersion,10);
	var nameShift,versionShift,trimSemicolon;
	var checkBrowser = 0;
	if ((versionShift = navigatorAgent.indexOf("Opera")) != -1)
	{
		browserName = "Opera";
		fullVersion = navigatorAgent.substring(versionShift + 6);
		if ((versionShift = navigatorAgent.indexOf("Version")) != -1)	{	fullVersion = navigatorAgent.substring(versionShift + 8);	}
	}
	else if ((versionShift = navigatorAgent.indexOf("MSIE")) != -1)
	{
		browserName = "Microsoft Internet Explorer";
		fullVersion = navigatorAgent.substring(versionShift + 5);
	}
	else if ((versionShift = navigatorAgent.indexOf("Sleipnir")) != -1)
	{
		browserName = "Sleipnir";
		fullVersion = navigatorAgent.substring(versionShift + 9);
	}
	else if ((versionShift = navigatorAgent.indexOf("Chrome")) != -1)
	{
		browserName = "Chrome";
		fullVersion = navigatorAgent.substring(versionShift + 7);
	}
	else if ((versionShift = navigatorAgent.indexOf("Safari")) != -1)
	{
		browserName = "Safari";
		fullVersion = navigatorAgent.substring(versionShift + 7);
		if ((versionShift = navigatorAgent.indexOf("Version")) != -1)	{	fullVersion = navigatorAgent.substring(versionShift + 8);	}
	}
	else if ((versionShift = navigatorAgent.indexOf("Firefox")) != -1)
	{
		browserName = "Firefox";
		fullVersion = navigatorAgent.substring(versionShift + 8);
		checkBrowser = 1;
	}
	// 多數瀏覽器中，名稱/版本是在 userAgent 的結尾
	else if ((nameShift = navigatorAgent.lastIndexOf(' ') + 1) < (versionShift = navigatorAgent.lastIndexOf('/')))
	{
		browserName = navigatorAgent.substring(nameShift, versionShift);
		fullVersion = navigatorAgent.substring(versionShift + 1);
		if (browserName.toLowerCase() == browserName.toUpperCase())	{	browserName = navigator.appName;	}
	}
	// 如果分號存在修剪分號
	if ((trimSemicolon = fullVersion.indexOf(";")) != -1)	{	fullVersion = fullVersion.substring(0, trimSemicolon);	}
	if ((trimSemicolon = fullVersion.indexOf(" ")) != -1)
	{
		fullVersion = fullVersion.substring(0, trimSemicolon);
		majorVersion = parseInt('' + fullVersion, 10);
	}
	if (isNaN(majorVersion))
	{
		fullVersion = '' + parseFloat(navigator.appVersion);
		majorVersion = parseInt(navigator.appVersion, 10);
	}
	return [browserName, fullVersion, checkBrowser];
}