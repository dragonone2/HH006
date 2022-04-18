
  // Classifier Variable
  let classifier;
  // Model URL
  let imageModelURL = 'human-model/';
  
  // Video
  let video;
  let flippedVideo;
  // To store the classification
  let label = "";

  // Load the model first
  function preload() {
    classifier = ml5.imageClassifier(imageModelURL + 'model.json');
  }

  function setup() {
  	cnv_width = (document.getElementById('cnv-width').offsetWidth)-32;
  	cnv_height = ((260/300)*cnv_width)-42;
  	vid_height = ((240/260)*cnv_height)-42;
    var canvas = createCanvas(cnv_width, cnv_height);
     // canvas.style('display', 'none');
    canvas.parent('video-holder');
    // Create the video
    video = createCapture(VIDEO);
    video.size(cnv_width, vid_height);
    video.hide();

    flippedVideo = ml5.flipImage(video)
    // Start classifying
    classifyVideo();
  }

  function draw() {
    background(0);
    // Draw the video
    image(flippedVideo, 0, 0);

    // Draw the label
    fill(255);
    textSize(16);
    textAlign(CENTER);
    text(label, width / 2, height - 4);
  }

  // Get a prediction for the current video frame
  function classifyVideo() {
    flippedVideo = ml5.flipImage(video)
    classifier.classify(flippedVideo, gotResult);
  }

  // When we get a result
  function gotResult(error, results) {
    // If there is an error
    if (error) {
      console.error(error);
      return;
    }
    // The results are in an array ordered by confidence.
    // console.log(results[0]);
    label = results[0].label;

    rider_Audio = document.getElementById("ridersound");   //자전거
    human_Audio = document.getElementById("humansound");   //사람

    // rider_Audio : 자전거 경고음
    // human_Audio : 사람 경고음

    if (label=="자전거") {

      if (rider_Audio.paused) {
         human_Audio.pause();
         rider_Audio.currentTime = 0;
         rider_Audio.play();
      }

      document.getElementById("status").innerHTML = 
      //`<h3 style="color: red;"><i class="fa fa-exclamation-triangle"></i></h3>`
      `<h3 style="color: #ea4335;">[경고]</h3>
      <h3 style="color: #ea4335;">횡단보도에 자전거가 있습니다.</h3>
      <img src = "자전거.png" style="margin-top:20px; width: 220px;">
      `;

    }
    else if (label=="사람") {
      if (human_Audio.paused) {
        rider_Audio.pause();
        human_Audio.currentTime = 0;
        human_Audio.play();
     }

      document.getElementById("status").innerHTML = 
      //`<h3 style="color: red;"><i class="fa fa-exclamation-triangle"></i></h3>`
      `<h3 style="color: #ea4335;">[경고]</h3>
      <h3 style="color: #ea4335;">횡단보도에 사람이 있습니다.</h3>
      <img src = "보행자.png" style="margin-top:20px; width: 130px;">
      `;

    }else{
    	document.getElementById("status").innerHTML = `<h3 style="color: #085129;"><i class="fa fa-check-square"></i></h3>
    	<h3 style="color: #085129;">횡단보도 안전확보</h3>`;
    }


    // Classifiy again!
    classifyVideo();
  }