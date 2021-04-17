var DragTimeLine = function(start, length) {
	
	this.start		= start;
	this.length		= length;
	this.width 		= 800;
	this.divide 	= 24;
	this.height 	= 30;
	this.isDragging = false;
	this.isEmpty	= true;
	this.result 	= 0;  
	
	var mouseOffset;
	var pEndCell;
		
	// Create Sprite
	this.sprite = document.createElement("div");
	//this.sprite.style.backgroundColor = "#ccc";
	//this.sprite.style.background = "#ccc url(image/sprite2.gif) left top no-repeat;";
	this.sprite.style.width = this.width + "px";
	this.sprite.style.height = this.height + "px";
	//this.sprite.style.border = "1px solid #1298aa";
	
	// Create LineBase
	this.lineBase = document.createElement("div");
	this.lineBase.style.position = "relative";
	this.lineBase.style.backgroundColor = "#fffa72";
	this.lineBase.style.height = this.height + "px";
	this.lineBase.style.width = (this.width/this.divide) * this.length + "px";
	this.lineBase.style.left = (this.width/this.divide) * this.start + "px";
	this.lineBase.style.borderRadius = "5px";
	this.lineBase.style.border = "1px solid #999";
	this.lineBase.style.opacity = 1;
	this.sprite.appendChild(this.lineBase);
	
	// Create TimeRange
	this.timeRange = document.createElement("div");
	this.timeRange.style.position = "absolute";
	this.timeRange.style.top = "4px";
	this.timeRange.style.left = "6px";
	this.timeRange.style.color = "#505050";
	this.timeRange.innerHTML = "";
	this.lineBase.appendChild(this.timeRange);
	
	// Create DragArea
	this.dragArea = document.createElement("div");
	this.dragArea.style.backgroundColor = "red";
	this.dragArea.style.width = "100%";
	this.dragArea.style.height = this.height + "px";
	this.dragArea.style.cursor = "pointer";
	this.lineBase.appendChild(this.dragArea);
	
	// Create ExtendArea1
	this.extendArea1 = document.createElement("div");
	this.extendArea1.style.position = "absolute";
	this.extendArea1.style.top = 0;
	this.extendArea1.style.left = "-10px";
	this.extendArea1.style.backgroundColor = "blue";
	this.extendArea1.style.width = "20px";
	this.extendArea1.style.height = this.height + "px";
	this.extendArea1.style.cursor = "pointer";
	this.lineBase.appendChild(this.extendArea1);
	
	// Create ExtendArea2
	this.extendArea2 = document.createElement("div");
	this.extendArea2.style.position = "absolute";
	this.extendArea2.style.top = 0;
	this.extendArea2.style.right = "-10px";
	this.extendArea2.style.backgroundColor = "blue";
	this.extendArea2.style.width = "20px";
	this.extendArea2.style.height = this.height + "px";
	this.extendArea2.style.cursor = "pointer";
	this.lineBase.appendChild(this.extendArea2);
		
	this.dragArea.style.opacity    = 0;
	this.extendArea1.style.opacity = 0;
	this.extendArea2.style.opacity = 0;
	

	// Create Delete
	this.deletebtn = document.createElement("div");
	this.deletebtn.style.position 			= "absolute";
	this.deletebtn.style.top 				= "8px";
	this.deletebtn.style.right 				= "20px";
	this.deletebtn.style.width 			 	= "13px";
	this.deletebtn.style.height				= "13px";
	/*this.deletebtn.style.background 		= "red";*/
	/*this.deletebtn.style.backgroundImage  	= "url('image/delete.png')";
	this.deletebtn.style.cursor				= "pointer";*/
	this.deletebtn.style.backgroundImage 	= "url('image/slideshow_closeBtn.png')";
	this.deletebtn.style.cursor				= "pointer";
	/*this.deletebtn.onmouseover = function() {
		this.style.backgroundPosition = "top right";
	};
	this.deletebtn.onmouseout = function() {
		this.style.backgroundPosition = "top left";
	};*/
	
	this.lineBase.appendChild(this.deletebtn);
	

	if(this.start == 0 && this.length == 0) {
		this.lineBase.style.display = "none";
		this.isEmpty = true;
	} else {
		this.isEmpty = false;	
	}
	
	var base = this;
	showTimeRange(base.start, base.length);
	//---------------------------------------------------------------------
	// Create (Mouse)
	this.sprite.onmousedown = function(e) {
		
		if(base.start==0 &&  base.length==0) {
			base.isEmpty = true;
		}

		if(base.isEmpty) {
			
			e.preventDefault();
			var cursorX = getCursorXY(e).x;
			var targetX = cursorX - getElementXY(base.sprite).x;
			var cellWidth = base.width/base.divide;
			var targetCell = Math.floor(targetX/cellWidth);
			
			if (targetCell < base.divide) {
				base.start = targetCell;
				base.length = 1;
				base.lineBase.style.display = "block";
				base.lineBase.style.left = cellWidth * base.start + "px";
				base.lineBase.style.width = base.length * cellWidth + "px";
				showTimeRange(base.start, base.length);
			}
			document.addEventListener("mousemove",create_mousemove, false);
			document.addEventListener("mouseup",create_mouseup, false);			
		}
	}	
	var create_mousemove = function(e){
		var cursorX = getCursorXY(e).x;
		var targetX = cursorX - getElementXY(base.sprite).x;
		var cellWidth = base.width/base.divide;
		var targetCell = Math.floor(targetX/cellWidth);
		if (targetCell <= base.divide && targetCell > base.start) {
			base.length = targetCell - base.start;
			base.lineBase.style.width = base.length * cellWidth + "px";
			showTimeRange(base.start, base.length);
		}
	}
	var create_mouseup = function(e){
		base.isEmpty = false;
		document.removeEventListener("mousemove",create_mousemove, false );
		document.removeEventListener("mouseup",create_mouseup, false);
	}
	//---------------------------------------------------------------------
	// Create (Touch)
	this.sprite.addEventListener("touchstart", function(e) {
		
		if(base.start==0 &&  base.length==0) {
			base.isEmpty = true;
		}
	
		if(base.isEmpty) {
			e.preventDefault(); // !
			var cursorX = e.changedTouches[0].pageX; // touch X
			var targetX = cursorX - getElementXY(base.sprite).x;
			var cellWidth = base.width/base.divide;
			var targetCell = Math.floor(targetX/cellWidth);
			
			if (targetCell < base.divide) {
				base.start = targetCell;
				base.length = 1;
				base.lineBase.style.display = "block";
				base.lineBase.style.left = cellWidth * base.start + "px";
				base.lineBase.style.width = base.length * cellWidth + "px";
				showTimeRange(base.start, base.length);
			}
			document.addEventListener("touchmove",create_touchmove, false);
			document.addEventListener("touchend",create_touchup, false);			
		}
	});
	var create_touchmove = function(e){
		var cursorX = e.changedTouches[0].pageX; // touch X
		var targetX = cursorX - getElementXY(base.sprite).x;
		var cellWidth = base.width/base.divide;
		var targetCell = Math.floor(targetX/cellWidth);
		if (targetCell <= base.divide && targetCell > base.start) {
			base.length = targetCell - base.start;
			base.lineBase.style.width = base.length * cellWidth + "px";
			showTimeRange(base.start, base.length);
		}
	}
	var create_touchup = function(e){
		base.isEmpty = false;
		document.removeEventListener("touchmove",create_touchmove, false );
		document.removeEventListener("touchend",create_touchup, false);
	}
	//---------------------------------------------------------------------
	// Move (mouse)
	this.dragArea.onmousedown = function(e) {	
		e.preventDefault();
		base.isDragging = true;
		mouseOffset = getCursorXY(e).x - getElementXY(base.lineBase).x; 
		document.addEventListener("mousemove",drag_mousemove, false);
		document.addEventListener("mouseup",drag_mouseup, false);
	}	
	var drag_mousemove = function(e){
		
		if(base.isDragging) {
			e.preventDefault();
			//drag 
			var cursorX = getCursorXY(e).x;
			var targetX = getCursorXY(e).x - mouseOffset - getElementXY(base.sprite).x;
			var cellWidth = base.width/base.divide;
			var targetCell = Math.floor(targetX/cellWidth);
			var limitCell =  base.divide - base.length;
			
			if(targetCell >= 0 && targetCell <= limitCell) {
				base.lineBase.style.left = cellWidth*targetCell +"px";	
				base.start = targetCell;
				showTimeRange(base.start, base.length);
			}
		}	
	}
	var drag_mouseup = function(e){
		base.isDragging = false;
		document.removeEventListener("mousemove",drag_mousemove, false);
		document.removeEventListener("mouseup",drag_mouseup, false);
	}
	//---------------------------------------------------------------------
	// Move (touch)
	this.dragArea.addEventListener("touchstart", function(e) {
		e.preventDefault();
		base.isDragging = true;
		mouseOffset = getCursorXY(e).x - getElementXY(base.lineBase).x; 
		document.addEventListener("touchmove",drag_touchmove, false);
		document.addEventListener("touchend",drag_touchup, false);
	});	
	var drag_touchmove = function(e){
		
		if(base.isDragging) {
			e.preventDefault();
			//drag 
			var cursorX =  e.changedTouches[0].pageX; // touch X
			var targetX = getCursorXY(e).x - mouseOffset - getElementXY(base.sprite).x;
			var cellWidth = base.width/base.divide;
			var targetCell = Math.floor(targetX/cellWidth);
			var limitCell =  base.divide - base.length;
			
			if(targetCell >= 0 && targetCell <= limitCell) {
				base.lineBase.style.left = cellWidth*targetCell +"px";	
				base.start = targetCell;
				showTimeRange(base.start, base.length);
			}
		}	
	}
	var drag_touchup = function(e){
		base.isDragging = false;
		document.removeEventListener("touchmove",drag_touchmove, false);
		document.removeEventListener("touchend",drag_touchup, false);
	}
	//---------------------------------------------------------------------
	// Extend1 (mouse)
	this.extendArea1.onmousedown = function(e) {
		e.preventDefault();
		pEndCell = base.start + base.length;
		document.addEventListener("mousemove",extendArea1_mousemove, false);
		document.addEventListener("mouseup",extendArea1_mouseup, false);
	}	
	var extendArea1_mousemove = function(e){
		
		var cursorX = getCursorXY(e).x;
		var targetX = cursorX - getElementXY(base.sprite).x;
		var cellWidth = base.width/base.divide;
		var targetCell = Math.floor(targetX/cellWidth);
		
		if ( targetCell >= 0 && targetCell < pEndCell) {
			base.start = targetCell;
			base.length = pEndCell - base.start;
			base.lineBase.style.left = base.start * cellWidth +"px";	
			base.lineBase.style.width = base.length * cellWidth + "px";
			showTimeRange(base.start, base.length);
		}
	}
	var extendArea1_mouseup = function(e){
		document.removeEventListener("mousemove",extendArea1_mousemove, false);
		document.removeEventListener("mouseup",extendArea1_mouseup, false);
	}
	//---------------------------------------------------------------------
	// Extend1 (touch)
	this.extendArea1.addEventListener("touchstart", function(e) {
		e.preventDefault();
		pEndCell = base.start + base.length;
		document.addEventListener("mousemove",extendArea1_touchmove, false);
		document.addEventListener("mouseup",extendArea1_touchup, false);
	});	
	var extendArea1_touchmove = function(e){
		
		var cursorX = e.changedTouches[0].pageX; // touch X
		var targetX = cursorX - getElementXY(base.sprite).x;
		var cellWidth = base.width/base.divide;
		var targetCell = Math.floor(targetX/cellWidth);
		
		if ( targetCell >= 0 && targetCell < pEndCell) {
			base.start = targetCell;
			base.length = pEndCell - base.start;
			base.lineBase.style.left = base.start * cellWidth +"px";	
			base.lineBase.style.width = base.length * cellWidth + "px";
			showTimeRange(base.start, base.length);
		}
	}
	var extendArea1_touchup = function(e){
		document.removeEventListener("touchmove",extendArea1_touchmove, false);
		document.removeEventListener("touchend",extendArea1_touchup, false);
	}
	//---------------------------------------------------------------------
	// Extend2
	this.extendArea2.onmousedown = function(e) {	
		e.preventDefault();
		document.addEventListener("mousemove",extendArea2_mousemove, false);
		document.addEventListener("mouseup",extendArea2_mouseup, false);
	}	
	var extendArea2_mousemove = function(e) {		
		var cursorX = getCursorXY(e).x;
		var targetX = cursorX - getElementXY(base.sprite).x;
		var cellWidth = base.width/base.divide;
		var targetCell = Math.floor(targetX/cellWidth);
		
		if ( targetCell <= base.divide && targetCell > base.start) {
			base.length = targetCell - base.start;
			base.lineBase.style.width = base.length * cellWidth + "px";
			showTimeRange(base.start, base.length);
		}
	}
	var extendArea2_mouseup = function(e){
		document.removeEventListener("mousemove",extendArea2_mousemove, false);
		document.removeEventListener("mouseup",extendArea2_mouseup, false);
	}
	//---------------------------------------------------------------------
	// Extend2 (touch)
	this.extendArea2.addEventListener("touchstart", function(e) {
		e.preventDefault();
		pEndCell = base.start + base.length;
		document.addEventListener("mousemove",extendArea2_touchmove, false);
		document.addEventListener("mouseup",extendArea2_touchup, false);
	});	
	var extendArea2_touchmove = function(e){
		
		var cursorX = e.changedTouches[0].pageX; // touch X
		var targetX = cursorX - getElementXY(base.sprite).x;
		var cellWidth = base.width/base.divide;
		var targetCell = Math.floor(targetX/cellWidth);
		
		if ( targetCell >= 0 && targetCell < pEndCell) {
			base.start = targetCell;
			base.length = pEndCell - base.start;
			base.lineBase.style.left = base.start * cellWidth +"px";	
			base.lineBase.style.width = base.length * cellWidth + "px";
			showTimeRange(base.start, base.length);
		}
	}
	var extendArea2_touchup = function(e){
		document.removeEventListener("touchmove",extendArea2_touchmove, false);
		document.removeEventListener("touchend",extendArea2_touchup, false);
	}
	//---------------------------------------------------------------------
	// getMousePosition
	function getCursorXY(e) {
		return {x:(window.Event) ? e.pageX : event.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft), y:(window.Event) ? e.pageY : event.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop)};
	}
	// getElementPosition
	function getElementXY(element) {
		var x = 0;
		var y = 0;
		while( element != null ) {
			x += element.offsetLeft;
			y += element.offsetTop;
			element = element.offsetParent;
		}
		return {x:x, y:y};
	}
/*	
	function showTimeRange(starTime, length) {
		var endTime = base.start + base.length;
		var timeString = starTime+":00 - "+endTime+":00";

		if(starTime==0 && length==0) {
			base.timeRange.innerHTML = "";
		}
		else if(length >= 3) {
			base.timeRange.innerHTML = timeString;
		}
		else {
			base.timeRange.innerHTML = starTime+":00";
		}
		base.result = timeString;
	}
*/	
	// Timmy Added 13/05/07
	function showTimeRange(starTime, length) {
		var endTime = base.start + base.length;
		var timeString = starTime+":00 - "+endTime+":00";
		var GetStartTimeHour = starTime;
		var GetEndTimeHour = endTime;
		
		if(length >= 4){
			base.timeRange.innerHTML = timeString;
		}
		else {
			base.timeRange.innerHTML = "";
		}
		base.result = timeString;
		base.resultST = GetStartTimeHour;
		base.resultET = GetEndTimeHour;
	}
	
	//---------------------------------------------------------------------
	// Delete
	// mouse
	this.deletebtn.onclick = function(e) {
		
		//base.sprite.removeChild(base.lineBase);
		//base.isEmpty = false;
		
		base.start		= 0;
		base.length		= 0;
		base.lineBase.style.width = (base.width/base.divide) * base.length + "px";
		base.lineBase.style.left = (base.width/base.divide) * base.start + "px";
		base.result 	= "0:00"; 
		base.timeString = "0:00"; 
		if(base.start == 0 && base.length == 0) {
			base.lineBase.style.display = "none";
			base.isEmpty = true;
		} else {
			base.isEmpty = false;	
		}
		base.resultST = 0;
		base.resultET = 0;
	}
		
}