const MAX_WIDTH = 800; // Maximum canvas width
const MAX_HEIGHT = 600; // Maximum canvas height

const img = new Image();
document.getElementById('generateButton').addEventListener('click', generatePixelArt);
document.getElementById('uploadImage').addEventListener('change', loadImage);

function loadImage(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
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

    const loading = document.getElementById('loading');
    loading.style.display = 'block';

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

        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;

        for (let y = 0; y < height; y += pixelSize) {
            for (let x = 0; x < width; x += pixelSize) {
                const index = (y * width + x) * 4;
                const r = data[index];
                const g = data[index + 1];
                const b = data[index + 2];

                ctx.fillStyle = `rgb(${r},${g},${b})`;
                ctx.fillRect(x, y, pixelSize, pixelSize);
            }
        }

        loading.style.display = 'none';
        document.getElementById('downloadLink').href = canvas.toDataURL();
    }, 100);
}
