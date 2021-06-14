let video;
let poseNet;

// https://p5js.org/reference/#/p5/setup
document.getElementById('start').onclick = function setup() {
  // https://p5js.org/reference/#/p5/createCanvas
  var canvas = createCanvas(640, 480);
  canvas.parent('sketch-holder');
  // https://p5js.org/reference/#/p5/createCapture
  video = createCapture(VIDEO);
  video.size(640, 480);

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on("pose", function(result) {
    poses = result;
    console.log(poses)
  });
}

function modelReady() {
  select("#status").hide();
  document.getElementById('log').disabled = false;
}

