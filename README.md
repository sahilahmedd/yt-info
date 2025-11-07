# YouTube Video Info Extractor

A powerful Chrome extension that extracts YouTube video information and provides thumbnail download capabilities directly from YouTube pages. Get video titles, views, upload dates, channel names, and more with a single click!

## ✨ Features

- **📊 Video Information Extraction**: Extract video title, views, upload date, channel name, and video ID
- **🖼️ Thumbnail Downloader**: Download video thumbnails in multiple resolutions (maxresdefault, hqdefault, mqdefault, sddefault)
- **📋 Easy Copy Functionality**: Copy video information to clipboard with one click
- **🎨 Modern UI**: Clean, compact dropdown interface integrated into YouTube's header
- **⚡ Fast & Lightweight**: Minimal performance impact, works seamlessly with YouTube
- **🔒 Privacy-Focused**: All processing happens locally, no data sent to external servers

## 📸 Screenshots

_Screenshots coming soon_

## 🚀 Installation

### Method 1: Install from Chrome Web Store (Recommended)

1. Visit the Chrome Web Store listing for "YouTube Video Info Extractor"
2. Click the **"Add to Chrome"** button
3. Confirm the installation in the popup dialog
4. The extension will be automatically installed and enabled

### Method 2: Manual Installation (Developer Mode)

If you want to install the extension manually from source:

1. **Download the Extension**

   - **Option A: Download ZIP** (Recommended for non-developers)

     - Click here to download: [📦 Download ZIP](https://github.com/sahilahmedd/yt-info/archive/refs/heads/main.zip)
     - Or visit the repository and click the green **"Code"** button → **"Download ZIP"**
     - Extract the ZIP file to a folder on your computer

   - **Option B: Clone with Git** (For developers)
     ```bash
     git clone https://github.com/sahilahmedd/yt-info.git
     ```

2. **Open Chrome Extensions Page**

   - Open Google Chrome
   - Navigate to `chrome://extensions/`
   - Or go to **Menu (⋮)** → **Extensions** → **Manage Extensions**

3. **Enable Developer Mode**

   - Toggle the **"Developer mode"** switch in the top-right corner

4. **Load the Extension**

   - Click **"Load unpacked"** button
   - Select the folder containing the extension files (the folder with `manifest.json`)
   - The extension will appear in your extensions list

5. **Verify Installation**
   - You should see "YouTube Video Info Extractor" in your extensions list
   - Make sure it's enabled (toggle switch is ON)

## 📖 Usage

1. **Navigate to YouTube**

   - Go to any YouTube video page (e.g., `https://www.youtube.com/watch?v=VIDEO_ID`)

2. **Access the Extension**

   - Look for the **"YT Info"** button in the YouTube header (to the right of the search bar)
   - The button has a blue gradient background with a 🎬 icon

3. **Extract Video Information**

   - Click the **"YT Info"** button to open the dropdown
   - The extension will automatically extract:
     - Video Title
     - Video ID
     - Channel Name
     - View Count
     - Upload Date
     - Video URL

4. **Download Thumbnails**

   - Click on any thumbnail resolution button to download
   - Available resolutions: Max Quality, High Quality, Medium Quality, Standard Quality

5. **Copy Information**

   - Click the **"Copy"** button next to any information field to copy it to your clipboard
   - A confirmation message will appear when copied successfully

6. **Close the Dropdown**
   - Click the **×** button in the dropdown header
   - Or click anywhere outside the dropdown
   - Or click the **"YT Info"** button again to toggle

## 🔧 Requirements

- **Google Chrome** version 88.0 or higher
- **Chrome OS**, **Windows**, **macOS**, or **Linux**
- Active internet connection (for accessing YouTube)

## 🎯 Supported YouTube Pages

- Video watch pages (`/watch?v=...`)
- Channel pages
- Playlist pages
- Home page (for featured videos)

## 🐛 Troubleshooting

### Extension Button Not Appearing

- **Refresh the page**: Press `F5` or `Ctrl+R` (Windows/Linux) / `Cmd+R` (Mac)
- **Check if extension is enabled**: Go to `chrome://extensions/` and ensure the toggle is ON
- **Check permissions**: Make sure the extension has permission to access YouTube pages
- **Clear browser cache**: Sometimes cached pages can cause issues

### Information Not Extracting

- **Wait for page to load**: Make sure the YouTube page is fully loaded before clicking the button
- **Check browser console**: Press `F12` to open Developer Tools and check for error messages
- **Try a different video**: Some videos may have different page structures

### Thumbnail Download Not Working

- **Check browser download settings**: Ensure downloads are allowed in Chrome settings
- **Check pop-up blocker**: Some browsers may block download pop-ups
- **Try a different resolution**: Some videos may not have all thumbnail sizes available

### Dropdown Not Closing

- **Click outside**: Click anywhere on the YouTube page outside the dropdown
- **Use close button**: Click the **×** button in the dropdown header
- **Refresh the page**: If all else fails, refresh the page

## 🔒 Privacy & Security

- **No Data Collection**: This extension does not collect, store, or transmit any personal data
- **Local Processing**: All video information extraction happens locally in your browser
- **No External Servers**: The extension does not communicate with any external servers
- **Open Source**: The code is open source and can be audited for security

## 🛠️ Development

### Project Structure

```
├── modules/
│   ├── ui-manager.js          # Main UI management and dropdown
│   ├── video-extractor.js     # Video data extraction logic
│   ├── copy-manager.js        # Copy to clipboard functionality
│   ├── thumbnail-downloader.js # Thumbnail download handling
│   └── dom-utils.js           # DOM manipulation utilities
├── content.js                 # Main content script entry point
├── manifest.json              # Extension manifest (Chrome Web Store)
├── icons/                     # Extension icons (16x16, 48x48, 128x128)
├── package.json               # Project metadata
└── README.md                  # This file
```

### Building from Source

No build step required! The extension uses vanilla JavaScript and can be loaded directly.

1. Clone the repository
2. Load the extension in Chrome Developer Mode (see Installation instructions)
3. Make your changes
4. Reload the extension in `chrome://extensions/` to test

## 🤝 Contributing

Contributions are welcome! If you'd like to contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🐛 Report Issues

Found a bug or have a feature request? Please open an issue on [GitHub Issues](https://github.com/sahilahmedd/yt-info/issues).

## 📧 Support

For support, questions, or suggestions:

- Open an issue on [GitHub Issues](https://github.com/sahilahmedd/yt-info/issues)
- Check existing issues for solutions
- Send feedback or suggest more features via [WhatsApp](https://wa.me/919413966915)

## 🎉 Acknowledgments

- Built with vanilla JavaScript for maximum compatibility
- Designed to integrate seamlessly with YouTube's interface
- Inspired by the need for easy video information extraction

---

**Made with ❤️ for YouTube users**

---

## © Copyright

**Made by [Sahil Ahmed](https://wa.me/919413966915)**

Send feedback or suggest more features: [WhatsApp](https://wa.me/919413966915)

---

Version: 1.0.0
