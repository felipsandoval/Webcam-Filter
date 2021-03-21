/*
    JavaScript code made by Felipe Sandoval.
*/

var activatedBlue = false, activatedGreen = false, activatedYellow = true;

// Evento que se ejecuta cuando se carga la página para obtener todos los datos.
document.addEventListener('DOMContentLoaded', function(){
	getcamera();
	var video = document.getElementById('myVideo');
	var canvas = document.getElementById('myCanvas');
	var context = canvas.getContext('2d');
	var back = document.createElement('canvas');
  var backcontext = back.getContext('2d');
	var cw,ch;
	var cromabg = document.getElementById("backgroundimg");
	
	video.addEventListener('play', function(){
			cw = this.clientWidth;
			ch = this.clientHeight;
			canvas.width = cw;
			canvas.height = ch;
			back.width = cw;
			back.height = ch;
			cromabg.width = cw;
			cromabg.height = ch;
			cromabg.style.visibility = 'visible';
			
			draw(this, context, backcontext, cw, ch);
	});

});


// Para pintar en mi canvas
function draw(v,c,bc,w,h) {
    if(v.paused || v.ended) return false;
    // First, draw it into the backing canvas
	  bc.drawImage(v, 0, 0, w, h);
    var idata = bc.getImageData(0, 0, w, h);
    var data = idata.data.length / 4;

    for (var i = 0; i < data; i++) {
			if (activatedYellow){
				var r = idata.data[i * 4 + 1];
				var g = idata.data[i * 4 + 0];
				var b = idata.data[i * 4 + 2];
				if (g > 100 && r > 100 && b > 100){
					idata.data[i * 4 + 3] = 0;
				}
			} else if (activatedBlue) {
				if( i%4 != 3 ){
					idata.data[i * 4] = 127 + 2*data[i] - data[i * 4 + 4] - data[i * 4 + w*4];	
				}
			} else if (activatedGreen) {
        var r = idata.data[i * 4 + 0];
				var g = idata.data[i * 4 + 1];
				var b = idata.data[i * 4 + 2];
				var brightness = (3*r+4*g+b)>>>3;
        idata.data[i * 4] = brightness;
        idata.data[i * 4 + 1] = brightness;
        idata.data[i * 4 + 2] = brightness;
    	}
		}
    c.putImageData(idata, 0, 0);
	
    setTimeout(function(){draw(v,c,bc,w,h);}, 0);
}

function doyellow(){
	activatedBlue = false, activatedYellow = true, activatedGreen = false;
}

function dogreen(){
	activatedBlue = false, activatedYellow = false, activatedGreen = true;
}

function doblue(){
	activatedBlue = true, activatedYellow = false, activatedGreen = false;
}

function hasGetUserMedia() {
  // Note: Opera builds are unprefixed.
  return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia || navigator.msGetUserMedia);
}

var onFailSoHard = function(e) {
    console.log('Reeeejected!', e);
  };

function getcamera(){
	if (hasGetUserMedia()) {
  	navigator.mozGetUserMedia({video: true, audio: false}, function(localMediaStream) {
    var video = document.getElementById('myVideo');
    video.src = window.URL.createObjectURL(localMediaStream);
    video.onloadedmetadata = function(e) {
      cw = this.clientWidth;
			ch = this.clientHeight;
			canvas.width = cw;
			canvas.height = ch;
			back.width = cw;
			back.height = ch;
			cromabg.width = cw;
			cromabg.height = ch;
			cromabg.style.visibility = 'visible';
			draw(this, context, backcontext, cw, ch);
    };
  }, onFailSoHard);
	} else {
		alert('getUserMedia() is not supported in your browser');
	}
}
