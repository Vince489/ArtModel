document.getElementById('generateButton').addEventListener('click', generatePixelArt);
document.getElementById('uploadImage').addEventListener('change', loadImage);

let img = new Image();

function loadImage(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function generatePixelArt() {
    const pixelSize = parseInt(document.getElementById('pixelSize').value);
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0);
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

    document.getElementById('downloadLink').href = canvas.toDataURL();
}