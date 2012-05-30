$(document).ready(function() {
	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	window.URL = window.URL || window.webkitURL;	
	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
	
	window.sI = window.setInterval;
	
	window.setInterval = function(func, time) {
		func();
		return window.sI(func, time);
	};
	
	document.onselectstart = function(){return false;}
	
	window.randInt = function(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};
	
	window.fillZeros = function(num) {
		var str = new String(num);
			
		while(str.length < 3) {
			str = "0" + str;
		}
			
		return str;
	};
	
	window.isMobile = function() {
		var check = false;
		(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
		return check;
	};
	
	var actx = new AudioContext(),
		boompad = new Boompad(actx);
		
	boompad.init();
	
	$("#display1-button-left").click(function() {
		boompad.pressDarkKey("#display1-button-left");
		if(boompad.SamplePacks.active > 0) {
			boompad.SamplePacks.setActive(boompad.SamplePacks.active - 1);
		}
	});
	
	$("#display1-button-right").click(function() {
		boompad.pressDarkKey("#display1-button-right");
		if(boompad.SamplePacks.active < boompad.SamplePacks.length - 1) {
			boompad.SamplePacks.setActive(boompad.SamplePacks.active + 1);
		}
	});
	
	$("#display2-button-left").click(function() {
		boompad.pressDarkKey("#display2-button-left");
		if(boompad.FXPad.active > 0) {
			boompad.FXPad.setActive(boompad.FXPad.active - 1);
		}
	});
	
	$("#display2-button-right").click(function() {
		boompad.pressDarkKey("#display2-button-right");
		if(boompad.FXPad.active < boompad.FXPad.length - 1) {
			boompad.FXPad.setActive(boompad.FXPad.active + 1);
		}
	});
	
	$(".slot").click(function() {
		var slot = parseInt($(this).attr("id")[1]);
		
		if(slot != boompad.Loopslots.active) {
			boompad.Loopslots.setActive(slot);
		} else {
			if(boompad.Loopslots.getActive().isRecording) {
				boompad.Loopslots.getActive().stopRecording();
			} else {
				boompad.Loopslots.getActive().startRecording();
			}
		}
	});
	
	$(".sample").click(function() {
		var $c = $(this);
	
		if(isMobile()) {
			boompad.Keys[parseInt($c.attr("id")[1])].press();
		} else {
			$("<input>").attr({type:"file", accept:"audio/*"}).change(function() {
				var file = this.files[0],
					reader = new FileReader();
					
					reader.onload = function() {
						boompad.Keys.loadKey(parseInt($c.attr("id")[1]), this.result, file.name.split(".")[0]);
					};
				
					reader.readAsArrayBuffer(file);
			}).click();
		}
	});
	
	$("#ctrl-erase-current").click(function() {
		boompad.pressDarkKey("#ctrl-erase-current");
		boompad.Loopslots.clearActive();
	});
	
	$("#ctrl-erase-all").click(function() {
		boompad.pressDarkKey("#ctrl-erase-all");
		boompad.Loopslots.clearAll();
	});
	
	$("#ctrl-record").click(function() {
		boompad.pressDarkKey("#ctrl-record");
		boompad.wavRecorder.toggleRecord();
		
		if(boompad.wavRecorder.isRecording()) {
			boompad.wavRecorder.clear();
			boompad.activateKeyWork("#ctrl-record");
		} else {
			boompad.deactivateDarkKey("#ctrl-record");
			boompad.wavRecorder.getWAV();
		}
	});
	
	$(document).keydown(function(e) {
		if(e.keyCode >= 97 && e.keyCode <= 105) { // Numpad
			boompad.Keys[e.keyCode - 96].press();
		} else if(e.keyCode >= 49 && e.keyCode <= 57) { // Decimals
			boompad.Keys[e.keyCode - 48].press();
		} else {
			switch(e.keyCode) {
				case 65: // A
					boompad.Loopslots.setActive(0);
					break;
				case 83: // S
					boompad.Loopslots.setActive(1);
					break;
				case 68: // D
					boompad.Loopslots.setActive(2);
					break;
				case 70: // F
					boompad.Loopslots.setActive(3);
					break;
				case 71: // G
					boompad.Loopslots.setActive(4);
					break;
				case 72: // H
					boompad.Loopslots.setActive(5);
					break;
				case 74: // J
					boompad.Loopslots.setActive(6);
					break;
				case 32: // Space
					if(boompad.Loopslots.getActive().isRecording) {
						boompad.Loopslots.getActive().stopRecording();
					} else {
						boompad.Loopslots.getActive().startRecording();
					}
					break;
				case 67: // C
					$("#ctrl-erase-current").click();
					break;
				case 69: // E
					$("#ctrl-erase-all").click();
					break;
				case 82: // R
					$("#ctrl-record").click();
					break;
			}
		}
	});
	
	$("#overlay").delay(2000).fadeOut(2000);
});
