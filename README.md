# 🐌 Slug Generator App

Transform your selfies into realistic slug images with AI! This app analyzes your photo and generates a unique slug with similar characteristics.

## ✨ Features

- 📸 Easy photo upload with drag-and-drop
- 🤖 AI-powered image analysis using Hugging Face
- 🎨 Realistic slug generation with matching traits
- 💯 100% FREE - uses Hugging Face's free API
- 🚀 Fast and responsive interface

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Server

```bash
npm start
```

### 3. Open the App

Navigate to `http://localhost:3000` in your browser

## 📖 How It Works

1. **Upload Photo**: Click or drag-and-drop your photo
2. **AI Analysis**: The app analyzes your facial features and characteristics
3. **Slug Generation**: AI creates a realistic slug image with similar traits:
   - Hair color → Slug coloring and patterns
   - Expression → Slug appearance
   - Accessories → Unique slug features
4. **View Results**: Compare your photo with your slug twin!

## 🔧 Technology Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js + Express
- **AI Models**:
  - Image Analysis: Salesforce BLIP (free)
  - Image Generation: Stable Diffusion 2.1 (free)
- **Platform**: Hugging Face Inference API

## 🎨 Slug Trait Mapping

The app intelligently maps your features to slug characteristics:

| Your Feature | Slug Trait |
|-------------|------------|
| Blonde/Light hair | Pale yellow spotted |
| Brown hair | Brown striped |
| Dark/Black hair | Dark brown with black markings |
| Red/Ginger hair | Orange-brown with red tints |
| Gray hair | Gray speckled |
| Glasses | Prominent eye stalks |
| Hat/Cap | Elegant shell |
| Happy expression | Cheerful looking |
| Serious expression | Contemplative |

## ⚠️ Important Notes

- **First Run**: The AI model may take 20-30 seconds to load on first use
- **File Size**: Maximum 5MB per image
- **Formats**: Supports PNG, JPG, JPEG
- **API Key**: Your Hugging Face API key is already configured in `.env`
- **Rate Limits**: Free tier has generous limits for personal use

## 🐛 Troubleshooting

### "Model is loading" error
- This is normal on first request
- The app will automatically retry
- Wait 10-20 seconds and try again

### "API Key" error
- Check that `.env` file exists
- Verify your API key is correct
- Make sure there are no extra spaces

### Image not generating
- Check your internet connection
- Ensure image is under 5MB
- Try a different photo format

## 📝 Project Structure

```
slug-generator-app/
├── public/
│   ├── index.html      # Main HTML page
│   ├── style.css       # Styling
│   └── app.js          # Frontend logic
├── server.js           # Backend server + AI logic
├── package.json        # Dependencies
├── .env                # API key (keep private!)
└── README.md          # This file
```

## 🔐 Security

- Never commit your `.env` file
- Never share your Hugging Face API key
- The `.gitignore` file protects your keys

## 🎉 Enjoy!

Have fun creating your slug twin! Share your results with friends and see whose slug is the coolest!

---

Made with ❤️ using free AI services
