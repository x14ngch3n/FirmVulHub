/**
 * @constructor
 */
function SOAPTimeInfo()
{
	this.TimeHourValue = "";
	this.TimeMinuteValue = "";
	this.TimeMidDateValue = false;
}

/**
 * @constructor
 */
function SOAPScheduleInfo()
{
	this.ScheduleDate = "";
	this.ScheduleAllDay = false;
	this.ScheduleTimeFormat = false;
	this.ScheduleStartTimeInfo = new SOAPTimeInfo();
	this.ScheduleEndTimeInfo = new SOAPTimeInfo();
} 

/**
 * @constructor
 */
function SOAPScheduleInfoLists()
{
	var scheduleInfo = new SOAPScheduleInfo();

	this.ScheduleName = "";
	this.ScheduleInfo = $.makeArray(scheduleInfo);
} 

/**
 * @constructor
 */
function SOAPGetScheduleSettingsResponse()
{
	var scheduleInfoLists = new SOAPScheduleInfoLists();

	this.ScheduleInfoLists = $.makeArray(scheduleInfoLists);
}

/**
 * @constructor
 */
function SOAPGetScheduleRebootResponse()
{
	this.Schedule = new SOAPScheduleInfoLists();
}

/**
 * @constructor
 */
function SOAPSetScheduleReboot()
{
	this.Schedule = new SOAPScheduleInfoLists();
}

