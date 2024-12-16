const MAX_WIDTH = 800; // Maximum canvas width
const MAX_HEIGHT = 600; // Maximum canvas height

const img = new Image();
document.getElementById('generateButton').addEventListener('click', generatePixelArt);
document.getElementById('uploadImage').addEventListener('change', loadImage);

function loadImage(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function generatePixelArt() {
    if (!img.src) {
        alert('Please upload an image first!');
        return;
    }

    const pixelSize = parseInt(document.getElementById('pixelSize').value);
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    // Show loading indicator
    const loading = document.getElementById('loading');
    loading.style.display = 'block';

    // Scale image to fit the maximum canvas size
    setTimeout(() => {
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH || height > MAX_HEIGHT) {
            const scale = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
            width = Math.floor(width * scale);
            height = Math.floor(height * scale);
        }

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

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

        // Hide loading indicator and set download link
        loading.style.display = 'none';
        document.getElementById('downloadLink').href = canvas.toDataURL();
    }, 100);
}
