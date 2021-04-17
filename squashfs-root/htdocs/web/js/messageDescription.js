function errorMessageLanguage()
{
	var nowLanguage = localStorage.getItem('language');
	document.write('<script type="text/javascript" src="/js/errchk/messages_' + nowLanguage + '.js"></script>');
}
errorMessageLanguage();