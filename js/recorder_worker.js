var record_length = 0,
	buffer_left = [],
	buffer_right = [],
	samplerate = 0;

this.onmessage = function(e) {
	switch(e.data.command) {
		case "init":
			init(e.data.samplerate);
			break;
		case "record":
			record(e.data.buffer);
			break;
		case "getWAV":
			getWAV();
			break;
		case "clear":
			clear();
			break;
	}
};

var init = function(sr) {
	samplerate = sr;
};

var clear = function() {
	record_length = 0;
	buffer_left = [];
	buffer_right = [];
};

var record = function(buffer) {
	buffer_left.push(new Float32Array(buffer[0]));
	buffer_right.push(new Float32Array(buffer[1]));
	
	record_length += buffer[0].length;
};

var mergeBuffers = function(buffers) {
	var result = new Float32Array(record_length),
		offset = 0;
		
	for(var i = 0, l = buffers.length; i < l; i++) {
		result.set(buffers[i], offset);
		offset += buffers[i].length;
	}
	
	return result;
};

var interleave = function(merged_buffer_left, merged_buffer_right) {
	var length = merged_buffer_left.length + merged_buffer_right.length,
		result = new Float32Array(length);
		
	for(var i = 0, inputi = 0; i < length; inputi++) {
		result[i++] = merged_buffer_left[inputi];
		result[i++] = merged_buffer_right[inputi];
	}
	
	return result;
};

var writeString = function(view, offset, string) {
	for(var i = 0, l = string.length; i < l; i++) {
		view.setUint8(offset + i, string.charCodeAt(i));
	}
};

var floatTo16BitPCM = function(out, offset, input) {
	var s;

	for(var i = 0, l = input.length; i < l; i++, offset += 2) {
		s = Math.max(-1, Math.min(1, input[i]));
		out.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
	}
};

var encodeWAV = function(interleaved) {
	var interleaved_length2 = interleaved.length * 2,
		buffer = new ArrayBuffer(44 + interleaved_length2),
		view = new DataView(buffer);
	
	writeString(view, 0, "RIFF");
	view.setUint32(4, 32 + interleaved_length2, true);
	writeString(view, 8, "WAVE");
	writeString(view, 12, "fmt ");
	view.setUint32(16, 16, true);
	view.setUint16(20, 1, true);
	view.setUint16(22, 2, true);
	view.setUint32(24, samplerate, true);
	view.setUint32(28, samplerate * 4, true);
	view.setUint16(32, 4, true);
	view.setUint16(34, 16, true);
	writeString(view, 36, "data");
	view.setUint32(40, interleaved_length2, true);
	
	floatTo16BitPCM(view, 44, interleaved);
	
	return view;
};

var getWAV = function() {
	var merged_buffer_left = mergeBuffers(buffer_left),
		merged_buffer_right = mergeBuffers(buffer_right),
		interleaved = interleave(merged_buffer_left, merged_buffer_right),
		dataview = encodeWAV(interleaved);
		
	this.postMessage(new Blob([dataview], {type:"audio/wav"}));
};
