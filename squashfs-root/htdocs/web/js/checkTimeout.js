	
var changeFlag = false;
var checkFlag = false;
var Time_GetReciprocalTime;

function stopGetReciprocalTime()
{
		//Time_GetReciprocalTime = window.clearInterval(Time_GetReciprocalTime);
}

function setGetReciprocalTime()
{
		//Time_GetReciprocalTime = self.setInterval("GetReciprocalTime()",1000);
}
	
function confirmExit()
{
	if (changeFlag)
	{
		if (!confirm(I18N("j", "There is unsaved data on this page. Do you want to abandon it?")))
		{
			return false;
		}
		else
		{
			return true;
		}
	}
}

var setTime;
var startPoint = 0;
var actionPoint = 0;
var timeoutCycleSec = 170;
	
function stopTimeout()
{
	clearTimeout(setTime);
}

function startTimeout()
{
	var startDate = new Date();
	var startTime = startDate.getTime();
	startPoint = parseInt(startTime/1000, 10);
	actionPoint = startPoint;
	stopTimeout();
	setTime = setTimeout("calaulateTimeout()",timeoutCycleSec*1000);
}

function calaulateTimeout()
{
	//clearTimeout(setTime);
	if(actionPoint==startPoint)
	{
		location.assign("/");
	}
	else
	{
		var soapAction = new SOAPAction();
		soapAction.sendSOAPAction("GetSysLogSettings", null, null);
		var functionDate = new Date();
		var functionTime = functionDate.getTime();
		startPoint = actionPoint;
		var timeoutSec= timeoutCycleSec - (parseInt(functionTime/1000, 10) - actionPoint);
		setTime = setTimeout("calaulateTimeout()",timeoutSec*1000);
	}
}

function changeTimeoutAction() //GetClickTime
{
	var actionDate = new Date();
	var actionTime = actionDate.getTime();		
	actionPoint = parseInt(actionTime/1000, 10);
}