<?

// Prevent the shell command injection
function SECURITY_prevent_shell_inject($parameter)
{
	return "\"".escape("s",$parameter)."\"";
}

?>
