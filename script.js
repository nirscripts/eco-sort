const video = document.getElementById("camera");
const result = document.getElementById("result");
const scanBtn = document.getElementById("scanBtn");

let model = null; // Placeholder for the model

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
    model = await tmImage.load("model/model.json", "model/metadata.json");
    console.log("Model loaded successfully!");
  } catch (err) {
    console.warn("Model not found yet. Drop your Teachable Machine model in /model");
  }
}

// Scan button functionality
async function scan() {
  if (!model) {
    result.innerText = "Model not loaded yet. Add it to /model to scan.";
    return;
  }

  const predictions = await model.predict(video);
  predictions.sort((a, b) => b.probability - a.probability);
  const top = predictions[0];
  result.innerText = `${top.className} (${Math.round(top.probability * 100)}%)`;
}

scanBtn.onclick = scan;

// Initialize
startCamera();
loadModel();

// Highlight the current page in navbar
const links = document.querySelectorAll('.nav-link');
const currentPage = window.location.pathname.split("/").pop(); // get file name

links.forEach(link => {
  const linkPage = link.getAttribute('href');
  if (linkPage === currentPage || (linkPage === 'index.html' && currentPage === '')) {
    link.classList.add('active');
  }
});
