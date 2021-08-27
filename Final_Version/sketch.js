// ml5.js: Pose Estimation with PoseNet
// The Coding Train / Daniel Shiffman
// https://thecodingtrain.com/learning/ml5/7.1-posenet.html
// https://youtu.be/OIo-DIOkNVg
// https://editor.p5js.org/codingtrain/sketches/ULA97pJXR

let video;
let poseNet;
let pose;
let skeleton;
let initial_setup = true;
let initial_distance = 0;
let did_left_desk = false;
let eye_strain_state = false;
let def_eye_pos_l_x;
let def_eye_pos_l_y;
let def_eye_pos_r_x;
let def_eye_pos_r_y;
let max_eye_pos_l_x;
let max_eye_pos_l_y;
let max_eye_pos_r_x;
let max_eye_pos_r_y;
let min_eye_pos_l_x;
let min_eye_pos_l_y;
let min_eye_pos_r_x;
let min_eye_pos_r_y;


function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.hide();
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose', gotPoses);
}

function gotPoses(poses) {
//   console.log(poses);
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
  }

  if ( initial_setup === true) {
    postureCorrection();
  }
  if (poses.length < 0){
    did_left_desk = true;
  }
  updateEyeposition();
}

function modelLoaded() {
  console.log('poseNet ready');
}

function draw() {
  image(video, 0, 0);

  if (pose) {
    let shoulderl = pose.leftShoulder;
    let shoulderr = pose.rightShoulder;
    let d = dist(shoulderl.x, shoulderl.y, shoulderr.x, shoulderr.y);
    console.log(d)

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

function postureCorrectionNotification() {
  const notification = new Notification("AI Asana", {body: "Sit straight for keeping your health!"})
}

function postureCorrection(){
  if ( initial_setup === true) {
    alert("Calibrating!! Sit straight, capturing the shoulder width")
    let shoulderl = pose.leftShoulder;
    let shoulderr = pose.rightShoulder;
    initial_distance = dist(shoulderl.x, shoulderl.y, shoulderr.x, shoulderr.y);
    console.log("==============initial distance================");
    console.log(initial_distance);
    alert("Calibrating!! stare at the desktop")
    console.log("=============== initial eye position ===================")
    def_eye_pos_l_x = pose.leftEye.x
    def_eye_pos_l_y = pose.leftEye.y
    def_eye_pos_r_x = pose.rightEye.x
    def_eye_pos_r_y = pose.rightEye.y
    console.log(def_eye_pos_l_x)
    console.log(def_eye_pos_l_y)
    console.log(def_eye_pos_r_x)
    console.log(def_eye_pos_r_y)

    max_eye_pos_l_x = def_eye_pos_l_x + 40
    max_eye_pos_l_y = def_eye_pos_l_y + 40
    max_eye_pos_r_x = pose.rightEye.x + 40
    max_eye_pos_r_y = pose.rightEye.y + 40
    
    min_eye_pos_l_x = def_eye_pos_l_x - 40
    min_eye_pos_l_y = def_eye_pos_l_y - 40
    min_eye_pos_r_x = pose.rightEye.x - 40
    min_eye_pos_r_y = pose.rightEye.y - 40
    
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
    alert("Sit straight for keeping your health")
    if ( Notification.permission === 'granted') {
      postureCorrectionNotification();
    }
  } else {
    alert("Posture looks good")
    if ( Notification.permission === 'granted') {
      postureCorrectionNotification();
    }
  }
}

function remindToDrink() {
  alert("Stay hydrated!")
}

function remindWalking() {
  if ( did_left_desk !== true ) {
    alert("You have been sitting for sometime, time to walk arround and remove the body tension")
    did_left_desk = false;
  }
}

function updateEyeposition() {
 var eye_position_l_x = pose.leftEye.x;
 var eye_position_l_y = pose.leftEye.y;
 var eye_position_r_x = pose.rightEye.x;
 var eye_position_r_y = pose.rightEye.y;

 if ( eye_position_l_x < max_eye_pos_l_x || eye_position_l_x > min_eye_pos_l_x || 
  eye_position_l_y < max_eye_pos_l_y || eye_position_l_y > min_eye_pos_l_y || 
  eye_position_r_x < max_eye_pos_r_x || eye_position_r_x < min_eye_pos_r_x ||
  eye_position_r_y < max_eye_pos_r_y || eye_position_r_y < min_eye_pos_r_y ) {
    eye_strain_state = false;
  }
}

function eyeStrainDetection() {
  if ( eye_strain_state === false){
    alert(" look away from the desktop!, Stare an object at 20 meter away for 20 secs")
  }
}

setInterval(postureCorrection, 10000);
setInterval(remindToDrink, 3600000);
setInterval(remindWalking, 2700000);
setInterval(eyeStrainDetection, 1200000);
