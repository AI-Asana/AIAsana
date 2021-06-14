let video;
let posenet;

function setup(){
    createCanvas(640, 480);
    video = createCapture(VIDEO);
    poseNet = ml5.poseNet(video, modelLoaded);
    video.hide();
    poseNet.on('pose',(results) => {
        console.log(results);
    });
}

function gotPoses(poses){
    console.log("poses")
}

function modelLoaded(){
    console.log("Model loaded")
}

function draw() {
    image(video, 0, 0, 640, 480);
}