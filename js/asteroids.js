/*
    [ ] detect if asteroid goes outside of the field
    [ ] start screen
    [ ] difficulty select?
    [ ] price of big fucking rock & types of big fucking rock
    [ ] alert messages
    [ ] start game button
    [ ] restart the game
    [ ] detect if the game has stopped
*/

window.$ = window.jQuery = require('./bower_components/jquery/dist/jquery.min.js');
require('./bower_components/howler.js/howler.min.js')

stopSimulation();
var celestialBodies = null;
var inPlay = false;

var celestialColors = {
  'earth' : '#167EDF',
  'moon' : '#9DA5B4',
  'big fucking rock' : '#E5C07B'
}

// Let's make the universe
//makeTheUniverse();

$(document).ready(function(){
  $('#levelScreen .start').on('click', function(){
    $('#levelScreen').fadeOut();
    inPlay = true;
    startSimulation();
  });
});

var predictedPath = new Path({
  strokeColor: '#6B717D',
  opacity: 0.5,
  strokeCap: 'round',
  dashArray: [10, 12]
});

// Start predicting the orbit
setInterval(function(){ drawPrediction() }, 4000);

// Important Maths
var earthToMoon = 370.3*Math.pow(10, 6);
var iMax = 600;
var jMax = 600;
var xMax = 3*earthToMoon;
var xMin = -1 * xMax;
var yMax = 3*earthToMoon;
var yMin = -1 * yMax;


/* Event listeners */
function onFrame(event) {
  if(celestialBodies === null) {
    drawCelestialBodies();
  } else {

    moveCelestialBodies();
    if(celestialBodies.hasOwnProperty('big fucking rock')) {
      $('.asteroid_position').html(celestialBodies['big fucking rock']['geometry'].position.x.toFixed(2) + ', ' + celestialBodies['big fucking rock']['geometry'].position.y.toFixed(2));

      var speed = Math.sqrt(Math.pow(celestialBodies['big fucking rock']['velocity'][0], 2) + Math.pow(celestialBodies['big fucking rock']['velocity'][1], 2));
      $('.asteroid_speed').html(speed.toFixed(2));
    }

  }

}

function onKeyDown(event) {
	// When a key is pressed, set the content of the text item:
  if(event.key === 'space' && inPlay) {
    setTimeout(function(){ drawPrediction() }, 1000);
  }
}

function onMouseDown(event) {
  if(inPlay) {
    fireThruster(event);
    setTimeout(function(){ drawPrediction() }, 1000);
  }
}

function moveCelestialBodies(){
  $.get('http://localhost:8000/cache', function(data) {
    if(data.hasOwnProperty('data')) {

      var bodies = data.data;

      bodies.forEach(function(body) {
        var bodyCoords = mapPositionToCanvas(body.coords);
        celestialBodies[body.name]['geometry'].position = bodyCoords;
        celestialBodies[body.name]['velocity'] = body["velocity"];
      });
    }
  });
}

function mapPositionToCanvas(coords) {
  return { x : ((iMax / (xMax - xMin)) * (coords[0] - xMin)), y : ((jMax / (yMax - yMin)) * (coords[1] - yMin))} ;
};

function mapDimensionToCanvas(r) {
  return  ((iMax / (xMax - xMin)) * r*7);
};

function drawPrediction(){
  $.get('http://localhost:8000/predict', function(data) {
    var rock = data["big fucking rock"];
    predictedPath.removeSegments();
    for(var i = 0; i < rock.length; i++) {
      predictedPath.add(mapPositionToCanvas(rock[i]));
    }
  });
}

function fireThruster(event) {
  var sound = new Howl({urls: ['booster.mp3'], volume: 2}).play();
  sound.fade(2,0, 1000);
  var theta = calculateAngleOfBooster(event.point);
  displayMessage('Firing thrusters!')
  $.get('http://localhost:8000/thruster?theta=' + theta);
}

function displayMessage(message) {
  $('#messagePrompt').text(message);
  $('#messagePrompt').fadeIn();
  setTimeout(function(){ $('#messagePrompt').fadeOut(); }, 500 );
}

function calculateAngleOfBooster(click){
  var theta = Math.atan2((celestialBodies['big fucking rock']['geometry'].position.y - click.y), (celestialBodies['big fucking rock']['geometry'].position.x - click.x));
  return theta;
}

function startSimulation() {
  $.get('http://localhost:8000/start');
}

function stopSimulation() {
  $.get('http://localhost:8000/stop');
}

function drawCelestialBodies(bodies) {

  $.get('http://localhost:8000/cache', function(data) {
    if(data.hasOwnProperty('data')) {
      var bodies = data.data;
      celestialBodies = {};

      bodies.forEach(function(body) {
        if(!celestialBodies[body.name]) {
          celestialBodies[body.name] = {};
        }
        celestialBodies[body.name]['geometry'] = new Shape.Circle([0,0], body.name === "big fucking rock" ?  1.5 : mapDimensionToCanvas(body["R"]));
        celestialBodies[body.name]['geometry'].fillColor = celestialColors[body.name] ? celestialColors[body.name] : 'white';
        celestialBodies[body.name]['velocity'] = body["velocity"];
      });

    }
  });
}

function makeTheUniverse(callback) {
  var spaceBackground = new Path.Rectangle({
    point: [0, 0],
    size: [iMax,jMax],
    fillColor: '#282C34'
  });
  spaceBackground.sendToBack();
  callback();
}
