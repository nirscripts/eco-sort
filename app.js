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