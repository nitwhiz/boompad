var WavRecorder = function(actx) {
	actx.createJavaScriptNode = actx.createJavaScriptNode || actx.createScriptProcessor;
	
	var r = this,
		worker = new Worker("js/recorder_worker.js"),
		node = actx.createJavaScriptNode(2048, 2, 2),
		record = false;
	
	r.connected = false;
	
	r.onWavReady = function(e) {};
	
	r.init = function() {
		worker.onmessage = function(e) {
			r.onWavReady(e);
		};
		
		worker.postMessage({
			command:"init",
			samplerate:node.context.sampleRate,
		});

		node.onaudioprocess = function(e) {
			if(record) {
				worker.postMessage({
					command:"record",
					buffer:[
						e.inputBuffer.getChannelData(0),
						e.inputBuffer.getChannelData(1)
					]
				});
			}
		};
	};
	
	r.connect = function(to) {
		to.connect(node);
		node.connect(node.context.destination);
		
		r.connected = true;
	};
	
	r.toggleRecord = function() {
		record = !record;
	};
	
	r.isRecording = function() {
		return record;
	};
	
	r.clear = function() {
		worker.postMessage({
			command:"clear"
		});
	};
	
	r.getWAV = function() {
		worker.postMessage({
			command:"getWAV"
		});
	};
};
