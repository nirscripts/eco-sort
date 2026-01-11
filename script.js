const video = document.getElementById("camera");
const result = document.getElementById("result");
const scanBtn = document.getElementById("scanBtn");
const startBtn = document.getElementById("startBtn");

let model = null; // Placeholder for the model

// ---- Scan order + class groups ----
const OBJECT_CLASSES = ["waste", "recyclables", "compost", "nontrash"];
const BIN_CLASSES = ["wastebins", "recyclebins", "compostbins"];

let scanStage = "object"; // "object" → "bin"
let scannedObject = null;
let scannedBin = null;


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

  // Confidence check
if (bestAvg < 0.6) {
  result.innerText = "Scan unclear. Please try again.";
  return;
}

// =======================
// OBJECT SCAN
// =======================
if (scanStage === "object") {
  if (!OBJECT_CLASSES.includes(bestClass)) {
    result.innerText = "Please scan a piece of trash first.";
    return;
  }

  if (bestClass === "nontrash") {
    result.innerText = "Trash not detected. Please try again.";
    return;
  }

  scannedObject = bestClass;
  scanStage = "bin";

  result.innerText =
    `Object detected: ${bestClass}. Now scan the bin.`;
  return;
}

// =======================
// BIN SCAN
// =======================
if (scanStage === "bin") {
  if (!BIN_CLASSES.includes(bestClass)) {
    result.innerText = "Bin not detected. Please scan a bin.";
    return;
  }

  scannedBin = bestClass;

  result.innerText =
    `Bin detected: ${bestClass}. Ready to evaluate.`;

  console.log("Object:", scannedObject);
  console.log("Bin:", scannedBin);

  // TEMP: reset for now
  resetScanFlow("Scan complete. (Evaluation coming next)");
}

}


if (video && startBtn && scanBtn) {
  startBtn.onclick = async () => {
    await startCamera();
    await loadModel();
    result.innerText = "Camera started. Ready to scan.";
  };

  scanBtn.onclick = scan;
}

function resetScanFlow(message) {
  scanStage = "object";
  scannedObject = null;
  scannedBin = null;
  result.innerText = message;
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
