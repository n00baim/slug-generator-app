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

    // Create a detailed prompt for image generation
    const prompt = `A highly detailed, photorealistic close-up photograph of a ${slugDescription} garden slug, professional nature photography, macro lens, perfect lighting, shallow depth of field, National Geographic style, 8k resolution, detailed texture, glistening mucus trail, on a green leaf background, sharp focus`;

    return {
        prompt: prompt,
        description: `Meet your slug twin! A ${slugDescription} slug that shares your unique essence!`,
        characteristics: slugDescription
    };
}

// Try Pollinations.ai with different models
async function tryPollinations(prompt, model = 'flux') {
    try {
        const encodedPrompt = encodeURIComponent(prompt);
        const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&model=${model}&nologo=true&enhance=true`;

        console.log(`Trying Pollinations.ai with model: ${model}...`);

        const response = await fetch(imageUrl, { timeout: 30000 });

        if (!response.ok) {
            throw new Error(`Pollinations failed: ${response.status}`);
        }

        const imageBuffer = await response.arrayBuffer();
        console.log(`✓ Success with Pollinations.ai (${model})`);
        return Buffer.from(imageBuffer);

    } catch (error) {
        console.error(`✗ Pollinations.ai (${model}) failed:`, error.message);
        throw error;
    }
}

// Try Hugging Face Inference API (if API key available)
async function tryHuggingFace(prompt) {
    const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;

    if (!HF_API_KEY || HF_API_KEY === 'your_api_key_here') {
        throw new Error('No Hugging Face API key configured');
    }

    try {
        console.log('Trying Hugging Face API...');

        const response = await fetch(
            'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1',
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${HF_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    inputs: prompt,
                    options: { wait_for_model: true }
                }),
                timeout: 60000
            }
        );

        if (!response.ok) {
            throw new Error(`Hugging Face failed: ${response.status}`);
        }

        const imageBuffer = await response.arrayBuffer();
        console.log('✓ Success with Hugging Face');
        return Buffer.from(imageBuffer);

    } catch (error) {
        console.error('✗ Hugging Face failed:', error.message);
        throw error;
    }
}

// Main function to generate slug image with multiple fallbacks
async function generateSlugImage(prompt) {
    const services = [
        // Try Pollinations with different models
        { name: 'Pollinations (flux)', fn: () => tryPollinations(prompt, 'flux') },
        { name: 'Pollinations (turbo)', fn: () => tryPollinations(prompt, 'turbo') },
        { name: 'Hugging Face', fn: () => tryHuggingFace(prompt) },
    ];

    let lastError = null;

    // Try each service in order
    for (const service of services) {
        try {
            console.log(`\n→ Attempting: ${service.name}`);
            const result = await service.fn();
            return result;
        } catch (error) {
            lastError = error;
            console.log(`  Failed: ${error.message}`);
            // Continue to next service
        }
    }

    // All services failed
    console.error('\n✗ All image generation services failed');
    throw new Error(`All services failed. Last error: ${lastError?.message || 'Unknown error'}. Please try again in a few minutes.`);
}

// Main API endpoint
app.post('/api/generate-slug', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided' });
        }

        console.log('\n=== New Slug Generation Request ===');
        console.log('Analyzing uploaded image...');

        // Step 1: Analyze the uploaded image to get unique characteristics
        const characteristics = analyzeImageFeatures(req.file.buffer);
        console.log('Generated characteristics:', characteristics);

        // Step 2: Create slug prompt based on characteristics
        const { prompt, description } = createSlugPrompt(characteristics);
        console.log('Generated prompt:', prompt.substring(0, 100) + '...');

        // Step 3: Generate slug image with fallback services
        console.log('\nGenerating slug image...');
        const slugImageBuffer = await generateSlugImage(prompt);

        // Convert to base64 for sending to client
        const base64Image = slugImageBuffer.toString('base64');
        const slugImageUrl = `data:image/jpeg;base64,${base64Image}`;

        console.log('✓ Slug generated successfully!\n');

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
        services: [
            'Pollinations.ai (Free)',
            'Hugging Face (Free with API key)'
        ],
        hasHfApiKey: !!process.env.HUGGINGFACE_API_KEY
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`\n🐌 Slug Generator App is running!`);
    console.log(`📡 Server: http://localhost:${PORT}`);
    console.log(`🎨 Image Services:`);
    console.log(`   - Pollinations.ai (Primary)`);
    console.log(`   - Hugging Face (Backup: ${process.env.HUGGINGFACE_API_KEY ? '✓' : '✗'})`);
    console.log(`✨ Ready to create slug twins!\n`);
});
