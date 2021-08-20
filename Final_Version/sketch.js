let video;
let poseNet;
let pose;
let skeleton;
let initial_setup = true;
let initial_distance = 0;

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.hide();
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose', gotPoses);
}

function gotPoses(poses) {
  
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
  }

  if ( initial_setup === true) {
    alert(" Set straight for calibrating the shoulder width ")
    let shoulderl = pose.leftShoulder;
    let shoulderr = pose.rightShoulder;
    initial_distance = dist(shoulderl.x, shoulderl.y, shoulderr.x, shoulderr.y);
    console.log("==============initial distance================");
    console.log(initial_distance);
  
    if ( initial_distance !== undefined){
      initial_setup = false;
    }
  }
  let shoulderl = pose.leftShoulder;
  let shoulderr = pose.rightShoulder;
  var distance = dist(shoulderl.x, shoulderl.y, shoulderr.x, shoulderr.y);
  var min_dist =  initial_distance - 20
  var max_dist =  initial_distance + 20

  if ( distance < min_dist || distance > max_dist ){
    alert( " Sit straight to keep your spine health!! ")
  }

}

function modelLoaded() {
  console.log('poseNet ready');
}

function draw() {
  image(video, 0, 0);

  if (pose) {
      for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      fill(0, 255, 0);
      ellipse(x, y, 16, 16);
    }

    for (let i = 0; i < skeleton.length; i++) {
      let a = skeleton[i][0];
      let b = skeleton[i][1];
      strokeWeight(2);
      stroke(255);
      line(a.position.x, a.position.y, b.position.x, b.position.y);
    }
  }
}