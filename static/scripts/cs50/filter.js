const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const originalContainer = document.getElementById('originalContainer');
const filteredContainer = document.getElementById('filteredContainer');
const filterOptions = document.querySelectorAll('.filter-option');
const filterControls = document.getElementById('filterControls');
const resetBtn = document.getElementById('resetBtn');
const downloadBtn = document.getElementById('downloadBtn');
const applyBtn = document.getElementById('applyBtn');
const loadingOverlay = document.getElementById('loadingOverlay');
const notification = document.getElementById('notification');

let originalImage = null;
let filteredImage = null;
let currentFilter = 'original';
let filterSettings = {
    blur: {
        intensity: 50
    },
    grayscale: {
        intensity: 100
    },
    sepia: {
        intensity: 100
    },
    edges: {
        threshold: 50
    },
    reflect: {},
    original: {}
};

uploadArea.addEventListener('dragover', handleDragOver);
uploadArea.addEventListener('dragleave', handleDragLeave);
uploadArea.addEventListener('drop', handleDrop);
fileInput.addEventListener('change', handleFileSelect);
resetBtn.addEventListener('click', resetImage);
downloadBtn.addEventListener('click', downloadImage);
applyBtn.addEventListener('click', applyFilterToServer);

filterOptions.forEach(option => {
    option.addEventListener('click', () => {
        setActiveFilter(option.dataset.filter);
    });
});

function handleDragOver(e) {
    e.preventDefault();
    uploadArea.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFile(e.dataTransfer.files[0]);
    }
}

function handleFileSelect(e) {
    if (e.target.files && e.target.files[0]) {
        handleFile(e.target.files[0]);
    }
}

function handleFile(file) {
    if (!file.type.match('image.*')) {
        showNotification('Please select an image file', 'error');
        return;
    }

    if (file.size > 5 * 1024 * 1024) {
        showNotification('File size exceeds 5MB limit', 'error');
        return;
    }

    const reader = new FileReader();

    reader.onload = function(e) {
        originalImage = new Image();
        originalImage.onload = function() {
            displayOriginalImage();
            resetFilteredImage();
            setActiveFilter('original');
            downloadBtn.disabled = false;
            applyBtn.disabled = false;
        };
        originalImage.src = e.target.result;
    };

    reader.readAsDataURL(file);
}

function displayOriginalImage() {
    originalContainer.innerHTML = '';
    const img = originalImage.cloneNode();
    originalContainer.appendChild(img);
}

function displayFilteredImage() {
    filteredContainer.innerHTML = '';

    if (filteredImage) {
        const img = filteredImage.cloneNode();
        filteredContainer.appendChild(img);
    } else {
        filteredContainer.innerHTML = '<div class="image-placeholder">Apply a filter to see preview</div>';
    }
}

function resetFilteredImage() {
    filteredImage = originalImage.cloneNode();
    displayFilteredImage();
}

function setActiveFilter(filter) {
    currentFilter = filter;

    filterOptions.forEach(option => {
        if (option.dataset.filter === filter) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
    updateFilterControls();

    if (originalImage) {
        applyFilterPreview();
    }
}

function updateFilterControls() {
    filterControls.innerHTML = '';

    switch (currentFilter) {
        case 'blur':
            addSliderControl('Blur Intensity', 'blur-intensity', 0, 100, filterSettings.blur.intensity, value => {
                filterSettings.blur.intensity = value;
                applyFilterPreview();
            });
            break;

        case 'grayscale':
            addSliderControl('Grayscale Intensity', 'grayscale-intensity', 0, 100, filterSettings.grayscale.intensity, value => {
                filterSettings.grayscale.intensity = value;
                applyFilterPreview();
            });
            break;

        case 'sepia':
            addSliderControl('Sepia Intensity', 'sepia-intensity', 0, 100, filterSettings.sepia.intensity, value => {
                filterSettings.sepia.intensity = value;
                applyFilterPreview();
            });
            break;

        case 'edges':
            addSliderControl('Edge Threshold', 'edge-threshold', 0, 100, filterSettings.edges.threshold, value => {
                filterSettings.edges.threshold = value;
                applyFilterPreview();
            });
            break;
    }
}

function addSliderControl(label, id, min, max, value, onChange) {
    const controlGroup = document.createElement('div');
    controlGroup.className = 'control-group';

    const controlLabel = document.createElement('label');
    controlLabel.className = 'control-label';
    controlLabel.textContent = label;
    controlLabel.htmlFor = id;

    const sliderContainer = document.createElement('div');
    sliderContainer.className = 'slider-container';

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.className = 'slider';
    slider.id = id;
    slider.min = min;
    slider.max = max;
    slider.value = value;

    const sliderValue = document.createElement('div');
    sliderValue.className = 'slider-value';
    sliderValue.textContent = value;

    slider.addEventListener('input', function() {
        sliderValue.textContent = this.value;
        onChange(parseInt(this.value));
    });

    sliderContainer.appendChild(slider);
    sliderContainer.appendChild(sliderValue);

    controlGroup.appendChild(controlLabel);
    controlGroup.appendChild(sliderContainer);

    filterControls.appendChild(controlGroup);
}

function applyFilterPreview() {
    if (!originalImage) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = originalImage.width;
    canvas.height = originalImage.height;

    ctx.drawImage(originalImage, 0, 0);

    switch (currentFilter) {
        case 'grayscale':
            const intensity = filterSettings.grayscale.intensity / 100;
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            for (let i = 0; i < data.length; i += 4) {
                const gray = 0.2989 * data[i] + 0.5870 * data[i + 1] + 0.1140 * data[i + 2];
                data[i] = data[i] * (1 - intensity) + gray * intensity;
                data[i + 1] = data[i + 1] * (1 - intensity) + gray * intensity;
                data[i + 2] = data[i + 2] * (1 - intensity) + gray * intensity;
            }

            ctx.putImageData(imageData, 0, 0);
            break;

        case 'sepia':
            const sepiaIntensity = filterSettings.sepia.intensity / 100;
            const sepiaData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const sepiaPixels = sepiaData.data;

            for (let i = 0; i < sepiaPixels.length; i += 4) {
                const r = sepiaPixels[i];
                const g = sepiaPixels[i + 1];
                const b = sepiaPixels[i + 2];

                const newR = Math.min(255, (r * (1 - sepiaIntensity)) + (r * 0.393 + g * 0.769 + b * 0.189) * sepiaIntensity);
                const newG = Math.min(255, (g * (1 - sepiaIntensity)) + (r * 0.349 + g * 0.686 + b * 0.168) * sepiaIntensity);
                const newB = Math.min(255, (b * (1 - sepiaIntensity)) + (r * 0.272 + g * 0.534 + b * 0.131) * sepiaIntensity);

                sepiaPixels[i] = newR;
                sepiaPixels[i + 1] = newG;
                sepiaPixels[i + 2] = newB;
            }

            ctx.putImageData(sepiaData, 0, 0);
            break;

        case 'blur':
            const blurAmount = filterSettings.blur.intensity / 10;
            if (blurAmount > 0) {
                ctx.filter = `blur(${blurAmount}px)`;
                ctx.drawImage(originalImage, 0, 0);
                ctx.filter = 'none';
            }
            break;

        case 'reflect':
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(originalImage, 0, 0);
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            break;

        case 'edges':
            const edgeData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const edgePixels = edgeData.data;
            const threshold = filterSettings.edges.threshold * 2.55;

            for (let i = 0; i < edgePixels.length; i += 4) {
                const gray = 0.2989 * edgePixels[i] + 0.5870 * edgePixels[i + 1] + 0.1140 * edgePixels[i + 2];
                edgePixels[i] = edgePixels[i + 1] = edgePixels[i + 2] = gray;
            }

            const edgeTemp = new Uint8ClampedArray(edgePixels);
            for (let y = 1; y < canvas.height - 1; y++) {
                for (let x = 1; x < canvas.width - 1; x++) {
                    const idx = (y * canvas.width + x) * 4;
                    const idxLeft = (y * canvas.width + (x - 1)) * 4;
                    const idxRight = (y * canvas.width + (x + 1)) * 4;
                    const idxUp = ((y - 1) * canvas.width + x) * 4;
                    const idxDown = ((y + 1) * canvas.width + x) * 4;

                    const diff = Math.abs(edgeTemp[idx] - edgeTemp[idxLeft]) +
                        Math.abs(edgeTemp[idx] - edgeTemp[idxRight]) +
                        Math.abs(edgeTemp[idx] - edgeTemp[idxUp]) +
                        Math.abs(edgeTemp[idx] - edgeTemp[idxDown]);

                    const edge = diff > threshold ? 255 : 0;
                    edgePixels[idx] = edgePixels[idx + 1] = edgePixels[idx + 2] = edge;
                }
            }

            ctx.putImageData(edgeData, 0, 0);
            break;

        case 'original':
        default:
            break;
    }

    filteredImage = new Image();
    filteredImage.onload = displayFilteredImage;
    filteredImage.src = canvas.toDataURL('image/png');
}

function applyFilterToServer() {
    if (!originalImage) return;

    showLoading();

    setTimeout(() => {
        hideLoading();
        showNotification('Filter applied successfully!');
    }, 1500);
}

function resetImage() {
    if (!originalImage) return;

    setActiveFilter('original');
    resetFilteredImage();
}

function downloadImage() {
    if (!filteredImage) return;

    const link = document.createElement('a');
    link.download = 'filtered-image.png';
    link.href = filteredImage.src;
    link.click();

    showNotification('Image downloaded successfully!');
}

function showLoading() {
    loadingOverlay.classList.add('show');
}

function hideLoading() {
    loadingOverlay.classList.remove('show');
}

function showNotification(message, type = 'success') {
    const notificationElement = document.getElementById('notification');
    const messageElement = notificationElement.querySelector('.notification-message');
    const iconElement = notificationElement.querySelector('.notification-icon');

    messageElement.textContent = message;

    if (type === 'error') {
        notificationElement.style.background = 'linear-gradient(135deg, #f44336, #d32f2f)';
        iconElement.textContent = '❌';
    } else {
        notificationElement.style.background = 'linear-gradient(135deg, #4caf50, #45a049)';
        iconElement.textContent = '✅';
    }

    notificationElement.classList.add('show');

    setTimeout(() => {
        notificationElement.classList.remove('show');
    }, 3000);
}

setActiveFilter('original');
