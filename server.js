require('dotenv').config();
const express = require('express');
const multer = require('multer');
const fetch = require('node-fetch');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

// Serve static files
app.use(express.static('public'));
app.use(express.json());

// Helper function to analyze image and create unique characteristics
function analyzeImageFeatures(imageBuffer) {
    // Create a hash of the image to get consistent but unique characteristics
    const hash = crypto.createHash('md5').update(imageBuffer).digest('hex');

    // Use hash to deterministically select characteristics
    const hashNum = parseInt(hash.substring(0, 8), 16);

    const colors = [
        'pale yellow spotted',
        'brown striped',
        'dark brown with black markings',
        'orange-brown with red tints',
        'gray speckled',
        'cream colored with dark spots',
        'olive green tinted',
        'reddish-brown mottled'
    ];

    const moods = [
        'cheerful looking',
        'contemplative',
        'friendly',
        'curious',
        'serene',
        'alert'
    ];

    const features = [
        'with prominent eye stalks',
        'with an elegant shell pattern',
        'with delicate antennae',
        'with a glossy appearance',
        'with textured skin',
        'with distinctive markings'
    ];

    // Select characteristics based on hash
    const colorIndex = hashNum % colors.length;
    const moodIndex = Math.floor(hashNum / 100) % moods.length;
    const featureIndex = Math.floor(hashNum / 10000) % features.length;

    const selectedColor = colors[colorIndex];
    const selectedMood = moods[moodIndex];
    const selectedFeature = features[featureIndex];

    return {
        color: selectedColor,
        mood: selectedMood,
        feature: selectedFeature
    };
}

// Helper function to create slug prompt
function createSlugPrompt(characteristics) {
    const { color, mood, feature } = characteristics;

    const slugDescription = `${color}, ${mood}, ${feature}`;

    // Create a detailed prompt for Pollinations.ai
    const prompt = `A highly detailed, photorealistic close-up photograph of a ${slugDescription} garden slug, professional nature photography, macro lens, perfect lighting, shallow depth of field, National Geographic style, 8k resolution, detailed texture, glistening mucus trail, on a green leaf background, sharp focus`;

    return {
        prompt: prompt,
        description: `Meet your slug twin! A ${slugDescription} slug that shares your unique essence!`,
        characteristics: slugDescription
    };
}

// Helper function to generate slug image using Pollinations.ai
async function generateSlugImage(prompt) {
    try {
        // Pollinations.ai URL - completely free, no API key needed
        const encodedPrompt = encodeURIComponent(prompt);
        const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&model=flux&nologo=true&enhance=true`;

        console.log('Generating image with Pollinations.ai...');

        // Fetch the generated image
        const response = await fetch(imageUrl);

        if (!response.ok) {
            throw new Error(`Image generation failed: ${response.statusText}`);
        }

        const imageBuffer = await response.arrayBuffer();
        return Buffer.from(imageBuffer);

    } catch (error) {
        console.error('Image generation error:', error);
        throw error;
    }
}

// Main API endpoint
app.post('/api/generate-slug', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided' });
        }

        console.log('Analyzing uploaded image...');

        // Step 1: Analyze the uploaded image to get unique characteristics
        const characteristics = analyzeImageFeatures(req.file.buffer);
        console.log('Generated characteristics:', characteristics);

        // Step 2: Create slug prompt based on characteristics
        const { prompt, description } = createSlugPrompt(characteristics);
        console.log('Generated prompt:', prompt);

        // Step 3: Generate slug image using Pollinations.ai
        console.log('Generating slug image...');
        const slugImageBuffer = await generateSlugImage(prompt);

        // Convert to base64 for sending to client
        const base64Image = slugImageBuffer.toString('base64');
        const slugImageUrl = `data:image/jpeg;base64,${base64Image}`;

        console.log('Slug generated successfully!');

        res.json({
            success: true,
            slugImageUrl: slugImageUrl,
            description: description
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            error: 'Failed to generate slug image',
            message: error.message
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'Pollinations.ai (Free)'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`\n🐌 Slug Generator App is running!`);
    console.log(`📡 Server: http://localhost:${PORT}`);
    console.log(`🎨 Image Service: Pollinations.ai (100% Free)`);
    console.log(`✨ Ready to create slug twins!\n`);
});
