const fileInput = document.getElementById('fileInput');
const uploadBox = document.getElementById('uploadBox');
const previewImage = document.getElementById('previewImage');
const generateBtn = document.getElementById('generateBtn');
const uploadSection = document.querySelector('.upload-section');
const loadingSection = document.getElementById('loadingSection');
const loadingText = document.getElementById('loadingText');
const resultSection = document.getElementById('resultSection');
const originalImage = document.getElementById('originalImage');
const slugImage = document.getElementById('slugImage');
const slugDescription = document.getElementById('slugDescription');
const tryAgainBtn = document.getElementById('tryAgainBtn');

let uploadedFile = null;

// Click to upload
uploadBox.addEventListener('click', () => {
    fileInput.click();
});

// File selection
fileInput.addEventListener('change', (e) => {
    handleFile(e.target.files[0]);
});

// Drag and drop
uploadBox.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadBox.classList.add('dragover');
});

uploadBox.addEventListener('dragleave', () => {
    uploadBox.classList.remove('dragover');
});

uploadBox.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadBox.classList.remove('dragover');
    handleFile(e.dataTransfer.files[0]);
});

function handleFile(file) {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
        alert('Please upload an image file (PNG, JPG, JPEG)');
        return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
    }

    uploadedFile = file;

    // Preview image
    const reader = new FileReader();
    reader.onload = (e) => {
        previewImage.src = e.target.result;
        previewImage.style.display = 'block';
        document.querySelector('.upload-content').style.display = 'none';
        generateBtn.disabled = false;
    };
    reader.readAsDataURL(file);
}

// Generate slug
generateBtn.addEventListener('click', async () => {
    if (!uploadedFile) return;

    // Hide upload section, show loading
    uploadSection.style.display = 'none';
    loadingSection.style.display = 'block';
    resultSection.style.display = 'none';

    try {
        // Create form data
        const formData = new FormData();
        formData.append('image', uploadedFile);

        // Update loading text
        loadingText.textContent = 'Analyzing your features...';

        // Send to server
        const response = await fetch('/api/generate-slug', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Failed to generate slug');
        }

        loadingText.textContent = 'Creating your slug twin...';

        const data = await response.json();

        // Show results
        loadingSection.style.display = 'none';
        resultSection.style.display = 'block';

        originalImage.src = URL.createObjectURL(uploadedFile);
        slugImage.src = data.slugImageUrl;
        slugDescription.textContent = data.description;

    } catch (error) {
        console.error('Error:', error);
        alert('Oops! Something went wrong. Please try again.');
        resetApp();
    }
});

// Try again
tryAgainBtn.addEventListener('click', () => {
    resetApp();
});

function resetApp() {
    uploadedFile = null;
    fileInput.value = '';
    previewImage.style.display = 'none';
    previewImage.src = '';
    document.querySelector('.upload-content').style.display = 'block';
    generateBtn.disabled = true;

    uploadSection.style.display = 'block';
    loadingSection.style.display = 'none';
    resultSection.style.display = 'none';
}
