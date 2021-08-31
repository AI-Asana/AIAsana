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
let posture_recognition_interval_time;
let drink_water_interval_time;
let break_interval_time;

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
}

function modelLoaded() {
  console.log('poseNet ready');
}

function postureCorrection(){
  if ( initial_setup === true) {
    alert("Calibrating!! Sit straight, capturing the shoulder width")
    let shoulderl = pose.leftShoulder;
    let shoulderr = pose.rightShoulder;

    initial_distance = dist(shoulderl.x, shoulderl.y, shoulderr.x, shoulderr.y);
    alert("Calibrating!! stare at the desktop")

    def_eye_pos_l_x = pose.leftEye.x
    def_eye_pos_l_y = pose.leftEye.y
    def_eye_pos_r_x = pose.rightEye.x
    def_eye_pos_r_y = pose.rightEye.y 

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

  } else {
    alert("Posture looks good")

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

// getting all required elements
const inputBox = document.getElementById("input");
const addBtn = document.getElementById("add_button");
const todoList = document.querySelector(".todoList");
const deleteAllBtn = document.getElementById("delete_all");
const posture_recognition_freq = document.getElementById("posture_recognition_freq");
const drink_water_reminder = document.getElementById("drink_water_reminder");
const break_reminder = document.getElementById("break_reminder");
const reset = document.getElementById("reset")
const configure = document.getElementById("configure")

// onkeyup event
inputBox.onkeyup  = function(){
  let userEnteredValue = inputBox.value; //getting user entered value
  if(userEnteredValue.trim() != 0){ //if the user value isn't only spaces
    addBtn.classList.add("active"); //active the add button
  }else{
    addBtn.classList.remove("active"); //unactive the add button
  }
}
showTasks(); //calling showTask function
addBtn.onclick = function(){ //when user click on plus icon button
  let userEnteredValue = inputBox.value; //getting input field value
  let getLocalStorageData = localStorage.getItem("New Todo"); //getting localstorage
  if(getLocalStorageData === null){ //if localstorage has no data
    listArray = []; //create a blank array
  }else{
    listArray = JSON.parse(getLocalStorageData);  //transforming json string into a js object
  }
  listArray.push(userEnteredValue); //pushing or adding new value in array
  localStorage.setItem("New Todo", JSON.stringify(listArray)); //transforming js object into a json string
  showTasks(); //calling showTask function
  addBtn.classList.remove("active"); //unactive the add button once the task added
}
function showTasks(){
  let getLocalStorageData = localStorage.getItem("New Todo");
  if(getLocalStorageData === null){
    listArray = [];
  }else{
    listArray = JSON.parse(getLocalStorageData); 
  }
  const pendingTasksNumb = document.querySelector(".pendingTasks");
  pendingTasksNumb.textContent = listArray.length; //passing the array length in pendingtask
  if(listArray.length > 0){ //if array length is greater than 0
    deleteAllBtn.classList.add("active"); //active the delete button
  }else{
    deleteAllBtn.classList.remove("active"); //unactive the delete button
  }
  let newLiTag = "";
  listArray.forEach((element, index) => {
    newLiTag += `<li>${element}<span class="icon" onclick="deleteTask(${index})"><i class="fas fa-trash"></i></span></li>`;
  });
  todoList.innerHTML = newLiTag; //adding new li tag inside ul tag
  inputBox.value = ""; //once task added leave the input field blank
}
// delete task function
function deleteTask(index){
  let getLocalStorageData = localStorage.getItem("New Todo");
  listArray = JSON.parse(getLocalStorageData);
  listArray.splice(index, 1); //delete or remove the li
  localStorage.setItem("New Todo", JSON.stringify(listArray));
  showTasks(); //call the showTasks function
}
// delete all tasks function
deleteAllBtn.onclick = ()=>{
  listArray = []; //empty the array
  localStorage.setItem("New Todo", JSON.stringify(listArray)); //set the item in localstorage
  showTasks(); //call the showTasks function
}

// onkeyup event
posture_recognition_freq.onkeyup  = function(){
  let userEnteredValue = posture_recognition_freq.value; //getting user entered value
  if(userEnteredValue.trim() != 0){ //if the user value isn't only spaces
    reset.classList.add("active"); //active the reset button
    configure.classList.add("active"); //active the configure button
  }else{
    reset.classList.remove("active"); //unactive the reset button
    configure.classList.remove("active"); //unactive the configure button
  }
}

// onkeyup event
drink_water_reminder.onkeyup  = function(){
  let userEnteredValue = drink_water_reminder.value; //getting user entered value
  if(userEnteredValue.trim() != 0){ //if the user value isn't only spaces
    reset.classList.add("active"); //active the reset button
    configure.classList.add("active"); //active the configure button
  }else{
    reset.classList.remove("active"); //unactive the reset button
    configure.classList.remove("active"); //unactive the configure button
  }
}

// onkeyup event
break_reminder.onkeyup  = function(){
  let userEnteredValue = break_reminder.value; //getting user entered value
  if(userEnteredValue.trim() != 0){ //if the user value isn't only spaces
    reset.classList.add("active"); //active the reset button
    configure.classList.add("active"); //active the configure button
  }else{
    reset.classList.remove("active"); //unactive the reset button
    configure.classList.remove("active"); //unactive the configure button
  }
}

configure.onclick = function(){ //when user click on configure icon button
  alert("Configuration saved successfully")
  if ( posture_recognition_freq.value !== "10" ){
    posture_recognition_interval_time = Number(posture_recognition_freq.value) * 60000;
    setInterval(postureCorrection, posture_recognition_interval_time);
  }
  if ( drink_water_reminder.value !== "60"){
    drink_water_interval_time = Number(drink_water_reminder.value) * 60000;
    setInterval(remindToDrink, drink_water_interval_time);
  }
  if ( break_reminder.value !== "45" ){
    break_interval_time = Number(break_reminder.value) * 60000;
    setInterval(remindWalking, break_interval_time);
  }
  configure.classList.remove("active"); //unactive the configure button once the task added
}

reset.onclick = function(){ //when user click on reset icon button
  posture_recognition_freq.value = 10;
  drink_water_reminder.value = 60;
  break_reminder.value = 45;
  reset.classList.remove("active"); //unactive the reset button once the task added
}

if ( posture_recognition_interval_time === undefined){
  posture_recognition_interval_time = 600000;
  setInterval(postureCorrection, posture_recognition_interval_time);
}

if ( drink_water_interval_time === undefined){
  drink_water_interval_time = 3600000;
  setInterval(remindToDrink, drink_water_interval_time);
}
if ( break_interval_time === undefined){
  break_interval_time = 2700000;
  setInterval(remindWalking, break_interval_time);
}
setInterval(eyeStrainDetection, 1200000);


// function draw() {
//   image(video, 0, 0);
//   if (pose) {
//     for (let i = 0; i < pose.keypoints.length; i++) {
//       let x = pose.keypoints[i].position.x;
//       let y = pose.keypoints[i].position.y;
//       fill(0, 255, 0);
//       ellipse(x, y, 8, 8);
//     }

//     for (let i = 0; i < skeleton.length; i++) {
//       let a = skeleton[i][0];
//       let b = skeleton[i][1];
//       strokeWeight(2);
//       stroke(255);
//       line(a.position.x, a.position.y, b.position.x, b.position.y);
//     }
//   }
// }
