
function COMM_IPv6ADDR2INT(addr)
{
	//init
	var v6Array = new Array(8);
	for(var i = 0; i < v6Array.length; i++)
	{
		v6Array[i] = 0;
	}

	//split ::
	var addrArray = addr.split("::");
	
	//split :
	var upperAddr = addrArray[0];
	var upperAddrArray = upperAddr.split(":");
	for( var i = 0; i < upperAddrArray.length; i++)
	{
		v6Array[i] = parseInt(upperAddrArray[i], 16);
	}
	
	if(addrArray.length > 1)
	{
		var lowerAddr = addrArray[1];
		var lowerAddrArray = lowerAddr.split(":");
		for( var i = 0; i < lowerAddrArray.length; i++)
		{
			v6Array[v6Array.length -1 - i] = parseInt(lowerAddrArray[i], 16);
		}
	}

	return v6Array;
}

/* COMM_IPv4NETWORK("192.168.1.1", 24) -> "192.168.1.0" */
function COMM_IPv6NETWORK(addr, prefixlen)
{
	var v6Array = COMM_IPv6ADDR2INT(addr);
	
	// prefix length
	var quotient = Math.floor(prefixlen/16);
	var remainder = prefixlen%16;
	
	if(remainder > 0)
	{
		//assume prefix length must be product of 4
		var mask = Math.pow(2, 16) - Math.pow(2, (16 - remainder));
		
		v6Array[quotient] &= mask;
		quotient++;
	}
	
	// set host domain to zero
	for(var i = quotient; i < v6Array.length; i++)
	{
		v6Array[i] = 0;
	}

	return v6Array;
}

/* Check ipv6 address format. */
function COMM_ValidV6Format(ipstr, check_addr)
{
	var vals = ipstr.split(":");
	
	for(var i = 0; i<vals.length; i++)
	{
		vals[i] = parseInt(vals[i], 16);
	}
	
	// block all ip and loopback ip
	if(vals[0] == 0)
	{
		return false;
	}
	
	// block multicast
	if((vals[0] >= 0xff00)&&(vals[0] <= 0xff0f))
	{
		return false;
	}
	
	if(check_addr)
	{
		// block link local and 6to4
		if((vals[0] == 0xfe80)||(vals[0] == 0x2002))
		{
			return false;
		}
	}
	
	return true;
}

/* Check ipv6 address format. */
function COMM_ValidV6Prefix(ipstr, check_llr)
{
	var vals = ipstr.split(":");
	
	for(var i = 0; i<vals.length; i++)
	{
		vals[i] = parseInt(vals[i], 16);
	}
	
	// block all ip and loopback ip
	if(vals[0] == 0)
	{
		return false;
	}
	
	// block multicast
	if((vals[0] >= 0xff00)&&(vals[0] <= 0xff0f))
	{
		return false;
	}
	
	if(check_llr)
	{
		// block link local and 6to4
		if((vals[0] == 0xfe80)||(vals[0] == 0x2002))
		{
			return false;
		}
	}
	
	return true;
}