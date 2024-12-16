// Add event listeners to buttons and file input
document.getElementById('generateButton').addEventListener('click', generatePixelArt);
document.getElementById('uploadImage').addEventListener('change', loadImage);

// Register service worker for caching and offline capabilities
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
        .then(() => console.log('Service Worker Registered'))
        .catch(err => console.error('Service Worker Registration Failed:', err));
}

// Global variable to store the uploaded image
let img = new Image();

/**
 * Load the selected image file and set it to the global img object.
 */
function loadImage(event) {
    const file = event.target.files[0];

    if (!file) {
        alert('Please select an image file!');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        img.src = e.target.result;
        img.onload = () => {
            console.log('Image successfully loaded!');
        };
    };
    reader.readAsDataURL(file);
}

/**
 * Generate pixel art from the uploaded image based on the selected pixel size.
 */
function generatePixelArt() {
    if (!img.src) {
        alert('Please upload an image first!');
        return;
    }

    const pixelSize = parseInt(document.getElementById('pixelSize').value);
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    // Resize the canvas to match the image dimensions
    canvas.width = img.width;
    canvas.height = img.height;

    // Draw the uploaded image onto the canvas
    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Loop through the image pixels and apply the pixelation effect
    for (let y = 0; y < canvas.height; y += pixelSize) {
        for (let x = 0; x < canvas.width; x += pixelSize) {
            const index = (y * canvas.width + x) * 4;
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];

            ctx.fillStyle = `rgb(${r},${g},${b})`;
            ctx.fillRect(x, y, pixelSize, pixelSize);
        }
    }

    // Update the download link with the new pixelated image
    const downloadLink = document.getElementById('downloadLink');
    downloadLink.href = canvas.toDataURL();
    downloadLink.style.display = 'inline-block'; // Make sure the link is visible
    console.log('Pixel art generated successfully!');
}
