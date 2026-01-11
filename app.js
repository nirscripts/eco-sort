const video = document.getElementById('video');
const btn = document.getElementById('snap');

// Start Camera
async function init() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: "environment" }, 
            audio: false 
        });
        video.srcObject = stream;
    } catch (e) {
        console.error("Camera error:", e);
    }
}

// Simple "Snap" simulation for the hackathon
btn.addEventListener('click', () => {
    btn.innerHTML = "🌀"; // Loading icon
    setTimeout(() => {
        alert("Analyzing... (This is where the AI will work!)");
        btn.innerHTML = "📸";
        // Logic to update forest level could go here
    }, 1500);
});

init();

let trashCount = 0;

function updateForest() {
    const body = document.body;
    if (trashCount >= 5 && trashCount < 10) {
        body.className = 'level-2';
        alert("Great job! The smog is clearing.");
    } else if (trashCount >= 10) {
        body.className = 'level-3';
        alert("Incredible! The forest is thriving.");
    }
}

// Update the click listener we made earlier
btn.addEventListener('click', () => {
    trashCount++; // Add to the score
    updateForest(); // Check if the background should change
});