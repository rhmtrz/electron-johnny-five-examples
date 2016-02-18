var Readable = require("stream").Readable;  
var util = require("util");  
util.inherits(MyStream, Readable);  
function MyStream(opt) {  
  Readable.call(this, opt);
}
MyStream.prototype._read = function() {};  
// hook in our stream
process.__defineGetter__("stdin", function() {  
  if (process.__stdin) return process.__stdin;
  process.__stdin = new MyStream();
  return process.__stdin;
});


var button = document.getElementById('start-button')
var state = false

var xCoords = new Array(300).fill(0)
var yCoords = new Array(300).fill(0)
var freq = 20

var options = {
   "zoom": false,
}


var el = document.body.appendChild(document.createElement('div'))
var line = require('lightning-line')
var viz = new line(el, {
   "series": yCoords,
   "index": xCoords,
   "xaxis": "time (s)",
   "yaxis": "voltage (V)",
    "thickness": [8],
    "color": [[255, 100, 0]]
}, [], options)

var yDomain = [0, 5]
var xDomain = [-5, 0]

var ySpread = Math.abs(yDomain[1] - yDomain[0]) || 1;
var xSpread = Math.abs(xDomain[1] - xDomain[0]) || 1;

viz.x.domain([xDomain[0] - 0.05 * xSpread, xDomain[1] + 0.05 * xSpread])
viz.y.domain([yDomain[0] - 0.05 * ySpread, yDomain[1] + 0.05 * ySpread])

viz.updateAxis()
viz.updateData({
    "series": yCoords,
    "index": xCoords,
    "thickness": [8],
    "color": [[255, 100, 0]]
})


var five = require("johnny-five"),
board = new five.Board();

var i = 0;

board.on("ready", function() {
  document.getElementById('board-status').src = "icons/ready.png"
  button.className = "button"

  var sensor = new five.Sensor({
    pin: "A0", 
    freq: freq, 
	});
  
  button.addEventListener('click', function () {
    state = !state
    if (state) {
      button.innerHTML = 'Stop'
    }
    else {
      button.innerHTML = 'Start'
    }
  })
  
  sensor.scale(0, 5).on("data", function (){
    if (state) {
      yCoords.push(sensor.value) 
      xCoords.push(i*freq/1000)
      yCoords.shift()
      xCoords.shift()

      xDomain = [-5+i*freq/1000, i*freq/1000]
      xSpread = Math.abs(xDomain[1] - xDomain[0]) || 1;
      viz.x.domain([xDomain[0] - 0.05 * xSpread, xDomain[1] + 0.05 * xSpread])

      viz.updateAxis()
      viz.updateData({
        "series": yCoords,
        "index": xCoords,
        "thickness": [8],
        "color": [[255, 100, 0]]
          })
    i++
  }
  }) 
})