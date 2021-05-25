function detectLanguage()
{
	// Detect Language
	if (localStorage.getItem('language') === null)
	{
		InitLANG("en-us");
	}
	else
	{
		InitLANG(localStorage.language);
	}
}
detectLanguage();