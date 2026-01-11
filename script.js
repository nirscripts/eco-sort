const video = document.getElementById("camera");
const result = document.getElementById("result");
const scanBtn = document.getElementById("scanBtn");
const startBtn = document.getElementById("startBtn");

let model = null;
 // Placeholder for the model

// Start the camera
async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
  } catch (err) {
    console.error("Camera access error:", err);
    result.innerText = "Camera access denied or not available.";
  }
}

// Load the model (will work once you drop it in /model)
async function loadModel() {
  try {
    model = await tmImage.load("./model/model.json", "./model/metadata.json");
    console.log("Model loaded successfully!");
  } catch (err) {
    console.warn("Model not found yet. Drop your Teachable Machine model in /model");
  }
}

// Scan button functionality
async function scan() {
  if (!model) {
    result.innerText = "Model not loaded yet.";
    return;
  }

  result.innerText = "Scanning... hold still";

  const NUM_SAMPLES = 10;
  let summedPredictions = {};
  let classNames = [];

  for (let i = 0; i < NUM_SAMPLES; i++) {
    const predictions = await model.predict(video);

    predictions.forEach(p => {
      if (!summedPredictions[p.className]) {
        summedPredictions[p.className] = 0;
        classNames.push(p.className);
      }
      summedPredictions[p.className] += p.probability;
    });

    // Small delay between frames
    await new Promise(res => setTimeout(res, 100));
  }

  // Compute averages
  let bestClass = null;
  let bestAvg = 0;

  classNames.forEach(className => {
    const avg = summedPredictions[className] / NUM_SAMPLES;
    if (avg > bestAvg) {
      bestAvg = avg;
      bestClass = className;
    }
  });

  result.innerText = `${bestClass} (${Math.round(bestAvg * 100)}%)`;
}


if (video && startBtn && scanBtn) {
  startBtn.onclick = async () => {
    await startCamera();
    await loadModel();
    result.innerText = "Camera started. Ready to scan.";
  };

  scanBtn.onclick = scan;
}



// Highlight the current page in navbar
const links = document.querySelectorAll('.nav-link');
const currentPage = window.location.pathname.split("/").pop(); // get file name

links.forEach(link => {
  const linkPage = link.getAttribute('href');
  if (linkPage === currentPage || (linkPage === 'index.html' && currentPage === '')) {
    link.classList.add('active');
  }
});
