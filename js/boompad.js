var Boompad = function(actx) {
	var b = this;
	
	b.context = actx;
	
	b.pressDarkKey = function(selector) {
		$(selector).stop().animate({
			backgroundColor:"#1185d5",
			color:"#33a7f7",
			boxShadow:"0 3px 0 #0063b3, 0 0 10px #1185d5"
		}, 50, function() {
			$(this).stop().animate({
				backgroundColor:"#555",
				color:"#777",
				boxShadow:"0 3px 0 #333, 0 0 0 transparent",
			}, 200);
		});
	};
	
	b.pressLightKey = function(selector) {
		$(selector).stop().animate({
			backgroundColor:"#1185d5",
			color:"#33a7f7",
			boxShadow:"0 3px 0 #0063b3, 0 0 10px #1185d5"
		}, 50, function() {
			$(this).stop().animate({
				backgroundColor:"#666",
				color:"#888",
				boxShadow:"0 3px 0 #444, 0 0 0 transparent"
			}, 200);
		});
	};
	
	b.activateKey = function(selector) {
		$(selector).stop().animate({
			backgroundColor:"#39b02b",
			color:"#5bd24d",
			boxShadow:"0 3px 0 #179009, 0 0 10px #39b02b"
		}, 200);
	};
	
	b.activateKeyWork = function(selector) {
		$(selector).stop().animate({
			backgroundColor:"#d33939",
			color:"#f55b5b",
			boxShadow:"0 3px 0 #b11717, 0 0 10px #d33939"
		}, 200);
	};
	
	b.deactivateDarkKey = function(selector) {
		$(selector).stop().animate({
			backgroundColor:"#555",
			color:"#777",
			boxShadow:"0 3px 0 #333, 0 0 0 transparent"
		}, 200);
	};
	
	b.deactivateLightKey = function(selector) {
		$(selector).stop().animate({
			backgroundColor:"#666",
			color:"#888",
			boxShadow:"0 3px 0 #444, 0 0 0 transparent"
		}, 200);
	};
	
	b.FXPad = {
		active:-1,
		length:0,
		addFilter:function(filter) {
			var node;
			
			if(filter.type) {
				node = b.context.createBiquadFilter();
				node.type = filter.type;
			} else {
				node = b.context.createJavaScriptNode(2048, 2, 2); // FIREFOX!
				node.onaudioprocess = filter.onaudioprocess;
			}
			
			if(filter.init) {
				filter.init(node);
			}
			
			b.FXPad[b.FXPad.length] = new (function(node, ontune, name) {
				var f = this;
				
				f.node = node;
				f.tune = ontune;
				f.name = name;
			})(node, filter.ontune, filter.name);
			b.FXPad.length++;
		},
		getActive:function() {
			return b.FXPad[b.FXPad.active];
		},
		setActive:function(id) {
			b.FXPad.active = id;
			b.FXPad.tuneActive();
			$("#disp2").text(fillZeros(id) + " " + b.FXPad.getActive().name);
		},
		tuneActive:function() {
			b.FXPad.getActive().tune(b.FXPad.lastTouch.x, b.FXPad.lastTouch.y);
		},
		lastTouch:{
			x:0,
			y:0
		},
		max:{
			x:19,
			y:19
		},
		init:function() {
			var ctx = $("#pad canvas")[0].getContext("2d"),
				cw = ctx.canvas.width,
				ch = ctx.canvas.height,
				rx = b.FXPad.max.x + 1,
				ry = rx,
				RECTS = new Array(rx * ry),
				toGrid = function(c) {
					return Math.floor(c * (rx / cw));
				},
				tick = function() {
					var offset = 0;
					
					ctx.clearRect(0, 0, cw, ch);
				
					for(var x = 0; x < rx; x++) {
						for(var y = 0; y < ry; y++) {
							offset = rx * y + x;
						
							if(RECTS[offset]) {
								if(RECTS[offset] <= 1) {
									RECTS[offset] -= .025;
									
									if(RECTS[offset] < 0) {
										RECTS[offset] = 0;
									}
								}
								
								if(RECTS[offset] <= 1) {
									ctx.globalAlpha = RECTS[offset];
								}
								
								ctx.fillRect(x * (cw / rx), y * (ch / ry), cw / rx, cw / ry);
								ctx.globalAlpha = 1;
							}
						}
					}
					
					for(var x = 0; x < cw; x += cw / rx) {
						ctx.beginPath();
						ctx.moveTo(x, 0);
						ctx.lineTo(x, ch);
						ctx.stroke();
						ctx.closePath();
					}
					
					for(var y = 0; y < ch; y += ch / ry) {
						ctx.beginPath();
						ctx.moveTo(0, y);
						ctx.lineTo(cw, y);
						ctx.stroke();
						ctx.closePath();
					}
				},
				putRect = function(x, y, o) {
					RECTS[rx * y + x] = o || 1;
				},
				putStaticRect = function(x, y) {
					putRect(x, y, 2);
				},
				fadeStaticRects = function() {
					var offset = 0;
				
					for(var x = 0; x < rx; x++) {
						for(var y = 0; y < ry; y++) {
							offset = rx * y + x;
							
							if(RECTS[offset] > 1) {
								RECTS[offset] = 1;
							}
						}
					}
				},
				isTouching = false,
				setLastTouch = function(ex, ey) {
					b.FXPad.lastTouch.x = toGrid(ex);
					b.FXPad.lastTouch.y = toGrid(ey);
					
					b.FXPad.tuneActive();
				};
			
			ctx.strokeStyle = "#070707";
			ctx.lineWidth = 2;
			ctx.fillStyle = "#c40000";
			ctx.shadowColor = "#c40000";
			
			$(ctx.canvas).mousedown(function(e) {
				setLastTouch(e.offsetX, e.offsetY);
				
				isTouching = true;
			}).mousemove(function(e) {
				if(isTouching) {
					setLastTouch(e.offsetX, e.offsetY);
				}
			}).mouseup(function(e) {
				setLastTouch(e.offsetX, e.offsetY);
				
				isTouching = false;
			});
			
			setInterval(function() {
				var x = b.FXPad.lastTouch.x,
					y = b.FXPad.lastTouch.y;
			
				fadeStaticRects();
				
				if(x > 0) {putStaticRect(x - 1, y);}
				if(x < rx - 1) {putStaticRect(x + 1, y);}
				if(y > 0) {putStaticRect(x, y - 1);}
				if(y < ry - 1) {putStaticRect(x, y + 1);}
				putStaticRect(x, y);
				
				tick();
			}, 1000 / 100);
		}
	};
	
	b.wavRecorder = new WavRecorder(b.context);
	
	b.processBuffer = function(bs) {
		bs.connect(b.FXPad.getActive().node);
		b.FXPad.getActive().node.connect(b.context.destination);
		b.wavRecorder.connect(b.FXPad.getActive().node);
		bs.start(0);
	};
	
	b.Key = function(id, buffer, name) {
		var k = this;
		
		k.id = id;
		k.buffer = buffer;
		k.name = name;
		k.time = -1;
		
		k.press = function(fromslot) {
			if(k.buffer) {
				var src = b.context.createBufferSource();
					src.buffer = k.buffer;				
					
				b.processBuffer(src);
				
				b.pressDarkKey("#k" + k.id);
				
				if(!fromslot) {
					b.Loopslots.getActive().pushKey(k);
				}
			}
			
			return k;
		};
		
		k.clone = function(settings) {
			return $.extend({}, k, settings);
		};
		
		$("#k" + k.id + " span").text(name);
	};
	
	b.Keys = {	
		loadKey:function(id, file, name, callback) {
			$("#k" + id + " span").text("...");
			
			if(typeof file == "string") {
				var xhr = new XMLHttpRequest();
					xhr.open("GET", file, true);
					xhr.responseType = "arraybuffer";
					
					xhr.onload = function() {
						b.context.decodeAudioData(xhr.response, function(buffer) {
							b.Keys[id] = new b.Key(id, buffer, name || ((file.split("/")[file.split("/").length - 1]).split(".")[0]));
							
							if(callback) {
								callback();
							}
						}, function() {
							console.error("wut?");
						});
					};
					
					xhr.send();
			} else if(file != null) {
				b.context.decodeAudioData(file, function(buffer) {
					b.Keys[id] = new b.Key(id, buffer, name || "custom sample");
					
					if(callback) {
						callback();
					}
				}, function() {
					console.error("wut?");
				});
			} else {
				b.Keys[id] = new b.Key(id, null, name || "empty");
			}
		}
	};
	
	b.Loopslot = function(id) {
		var s = this,
			recstart;
		
		s.id = id;
		s.isRecording;
		s.keys;
		s.duration;
		s.interval;
		s.timeouts;
		
		s.clear = function(init) {
			if(!init) {
				clearInterval(s.interval);
				
				for(var i = 0; i < s.timeouts.length; i++) {
					clearTimeout(s.timeouts[i]);
				}
			}
		
			s.isRecording = false;
			s.keys = [];
			s.duration = 0;
			s.interval = 0;
			s.timeouts = [];
			
			return s;
		};
		
		s.startRecording = function() {
			s.clear();
			b.activateKeyWork("#s" + s.id);
			s.isRecording = true;
			
			return s;
		};
		
		s.stopRecording = function() {
			s.duration = new Date().getTime() - recstart;
			b.activateKey("#s" + s.id);
			s.isRecording = false;
			
			s.playback();
			
			return s;
		};
		
		s.pushKey = function(key) {
			if(s.isRecording) {
				if(!s.keys.length) {
					recstart = new Date().getTime();
				}s
				
				s.keys.push(key.clone({
					time:new Date().getTime() - recstart
				}));
			}
			
			return s;
		};
		
		s.playback = function() {
			if(s.keys.length > 0) {
				s.interval = setInterval(function() {
					s.timeouts = [];
					
					for(var i = 0; i < s.keys.length; i++) {
						(function(a) {
							s.timeouts.push(setTimeout(function() {
								s.keys[a].press(true);
							}, s.keys[a].time));
						})(i);
					}
				}, s.duration);
			}
			
			return s;
		};
		
		s.clear(true);
	};
	
	b.Loopslots = {
		active:null,
		getActive:function() {
			return (b.Loopslots[b.Loopslots.active]) || {};
		},
		setActive:function(n) {
			if(!(b.Loopslots.getActive().isRecording)) {
				b.deactivateLightKey("#s" + (b.Loopslots.active || 0));
				b.Loopslots.active = n;
				b.activateKey("#s" + n);
			}
		},
		clearActive:function() {
			b.Loopslots.getActive().clear();
		},
		clearAll:function() {
			for(var i = 0; i < 7; i++) {
				b.Loopslots[i].clear();
			}
		}
	};
	
	b.SamplePacks = {
		0:{
			7:["assets/samples/std/kick.wav", "Kick"],
			8:["assets/samples/std/snare.wav", "Snare"],
			9:["assets/samples/std/hat0.wav", "Hat 1"],
			4:["assets/samples/std/hat1.wav", "Hat 2"],
			5:["assets/samples/std/synth0.wav", "Synth 1"],
			6:["assets/samples/std/synth1.wav", "Synth 2"],
			1:["assets/samples/std/synth2.wav", "Synth 1"],
			2:["assets/samples/std/synth3.wav", "Synth 2"],
			3:["assets/samples/std/synth4.wav", "Synth 3"],
			name:"DNB"
		},
		1:{
			7:["assets/samples/hou/Kick1.wav", "Kick"],
			8:["assets/samples/hou/Snare1.wav", "Snare"],
			9:["assets/samples/hou/Hat1.wav", "Hat 1"],
			4:["assets/samples/hou/Hat2.wav", "Hat 2"],
			5:["assets/samples/hou/Perc1.wav", "Percussion 1"],
			6:["assets/samples/hou/Clap1.wav", "Clap 1"],
			1:["assets/samples/hou/Clap2.wav", "Clap 2"],
			2:["assets/samples/hou/Bass1.wav", "Bass 1"],
			3:["assets/samples/hou/Synth1.wav", "Synth"],
			name:"HOU"
		},
		2:{
			7:[],
			8:[],
			9:[],
			4:["assets/samples/mel/Piano1.wav", "Piano 1"],
			5:["assets/samples/mel/Piano2.wav", "Piano 2"],
			6:["assets/samples/mel/Guitar1.wav", "Guitar 1"],
			1:["assets/samples/mel/Guitar2.wav", "Guitar 2"],
			2:["assets/samples/mel/BassGuitar1.wav", "Bass 1"],
			3:["assets/samples/mel/BassGuitar2.wav", "Bass 2"],
			name:"MEL"
		},
		3:{
			7:["assets/samples/bit/kick.wav", "Kick"],
			8:["assets/samples/bit/snare.wav", "Snare"],
			9:["assets/samples/bit/bass0.wav", "Bass 1"],
			4:["assets/samples/bit/bass1.wav", "Bass 2"],
			5:["assets/samples/bit/lead0.wav", "Lead 1"],
			6:["assets/samples/bit/lead1.wav", "Lead 2"],
			1:["assets/samples/bit/blip0.wav", "Blip 1"],
			2:["assets/samples/bit/blip1.wav", "Blip 2"],
			3:["assets/samples/bit/blip2.wav", "Blip 3"],
			name:"BIT"
		},
		active:-1,
		length:4,
		getActive:function() {
			return b.SamplePacks[b.SamplePacks.active];
		},
		setActive:function(id) {
			b.SamplePacks.active = id;
			b.SamplePacks.load(id);
			$("#disp1").text(fillZeros(id) + " " + b.SamplePacks.getActive().name);
		},
		load:function() {
			var active = b.SamplePacks.getActive();
			for(var i = 1; i < 10; i++) {
				b.Keys.loadKey(i, active[i][0] || null, active[i][1] || "empty");
			}
		}
	};
	
	b.init = function() {
		b.SamplePacks.setActive(0);
		
		for(var i = 0; i < 7; i++) {
			b.Loopslots[i] = new b.Loopslot(i);
		}
		
		b.Loopslots.setActive(0);
		
		b.FXPad.init();
		
		b.FXPad.addFilter({
			name:"LOP",
			type:"lowpass",
			init:function(node) {
				node.frequency.value = 5000;
			},
			ontune:function(x, y) {
				this.node.frequency.value = (5000 - (y / b.FXPad.max.y) * 5000) || 0;
				this.node.Q.value = ((x / b.FXPad.max.x) * 30) || 0;
			}
		});
		
		b.FXPad.addFilter({
			name:"HIP",
			type:"highpass",
			init:function(node) {
				node.frequency.value = 0;
			},
			ontune:function(x, y) {
				this.node.frequency.value = ((y / b.FXPad.max.y) * 5000) || 0;
				this.node.Q.value = ((x / b.FXPad.max.x) * 30) || 0;
			}
		});
		
		b.FXPad.setActive(0);
		
		b.wavRecorder.init();
		
		b.wavRecorder.onWavReady = function(e) {
			var date = new Date();
			
			$("<a>").attr({
				href:window.URL.createObjectURL(e.data),
				download:"boompad-" + date.getDate() + "-" + date.getMonth() + "-" + date.getYear() + "-" + date.getHours() + "-" + date.getMinutes() + "-" + date.getSeconds() + ".wav"
			})[0].click();
		};
	};
};
