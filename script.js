const MAX_WIDTH = 800; // Maximum canvas width
const MAX_HEIGHT = 600; // Maximum canvas height

document.addEventListener('DOMContentLoaded', () => {
    const img = new Image();
    const uploadImageInput = document.getElementById('uploadImage');
    const uploadBox = document.getElementById('uploadBox');
    const clearButton = document.getElementById('clearButton');
    const generateButton = document.getElementById('generateButton');
    const downloadLink = document.getElementById('downloadLink');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    uploadImageInput.addEventListener('change', loadImage);
    clearButton.addEventListener('click', clearImage);
    generateButton.addEventListener('click', generatePixelArt);

    function loadImage(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            img.src = e.target.result;
        };

        img.onload = () => {
            // Maintain aspect ratio while scaling
            let width = img.width;
            let height = img.height;

            if (width > MAX_WIDTH || height > MAX_HEIGHT) {
                const scale = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
                width = Math.floor(width * scale);
                height = Math.floor(height * scale);
            }

            canvas.width = width;
            canvas.height = height;

            // Draw the image on the canvas
            ctx.drawImage(img, 0, 0, width, height);

            // Hide upload box, show canvas and clear button
            uploadBox.style.display = 'none';
            canvas.style.display = 'block';
            clearButton.style.display = 'block';
        };

        reader.readAsDataURL(file);
    }

    function generatePixelArt() {
        if (!img.src) {
            alert('Please upload an image first!');
            return;
        }

        const pixelSize = 10; // Example fixed pixel size
        const width = canvas.width;
        const height = canvas.height;

        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;

        // Iterate over pixels and "quantize" them
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

        // Enable download link
        downloadLink.href = canvas.toDataURL('image/png');
        downloadLink.style.display = 'block';
    }

    function clearImage() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        uploadBox.style.display = 'flex';
        canvas.style.display = 'none';
        clearButton.style.display = 'none';
        downloadLink.style.display = 'none';
        uploadImageInput.value = '';
    }
});
