/**
 * @constructor
 */
function SOAPStatisticInfo()
{
	this.Sent = "";
	this.Received = "";
	this.TXPackets = "";
	this.RXPackets = "";
	this.TXDropped = "";
	this.RXDropped = "";
	this.Session = "";
	this.Errors = "";
};

/**
 * @constructor
 */
function SOAPGetInterfaceStatistics()
{
	this.Interface = "";
};


//===============Response==================

/**
 * @constructor
 */
function SOAPInterfaceStatistics()
{
	this.StatisticInfo = new SOAPStatisticInfo();
};

/**
 * @constructor
 */
 function SOAPGetInterfaceStatisticsResponse()
 {
	this.Interface = "";
	this.InterfaceStatistics = new SOAPInterfaceStatistics();
 }