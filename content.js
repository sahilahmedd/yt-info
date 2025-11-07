/**
 * YouTube Video Info Extractor - Main Content Script
 * Orchestrates all modules and handles YouTube navigation
 */

// Main initialization function
function initializeEmbeddedUI() {
    try {
        // Initialize UI Manager
        window.YTUIManager.initialize();

        // Add copy icons to videos
        window.YTCopyManager.addCopyIconsToVideos();

        // Add thumbnail download buttons
        window.YTThumbnailDownloader.addThumbnailDownloadButtons();

        // Setup video observer for dynamic content
        setupVideoObserver();

    } catch (error) {
        console.error('❌ Error initializing YouTube Info Extractor:', error);
    }
}

/**
 * Setup observer for dynamically loaded videos
 */
function setupVideoObserver() {
    try {
        // Create observer to watch for new video elements
        const observer = new MutationObserver((mutations) => {
            let shouldUpdate = false;

            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // Check if new video elements were added
                            if (node.matches && window.YTDomUtils.YOUTUBE_SELECTORS.VIDEO_CONTAINERS.some(selector => node.matches(selector))) {
                                shouldUpdate = true;
                            }
                            // Check if node contains video elements
                            if (node.querySelectorAll && window.YTDomUtils.YOUTUBE_SELECTORS.VIDEO_CONTAINERS.some(selector => node.querySelectorAll(selector).length > 0)) {
                                shouldUpdate = true;
                            }
                        }
                    });
                }
            });

            if (shouldUpdate) {
                setTimeout(() => {
                    window.YTCopyManager.addCopyIconsToVideos();
                    window.YTThumbnailDownloader.addThumbnailDownloadButtons();
                }, 500);
            }
        });

        // Start observing
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

    } catch (error) {
        console.error('❌ Error setting up video observer:', error);
    }
}


/**
 * Check for YouTube navigation and reinitialize
 */
function checkForNavigation() {
    try {
        // Check if we're on a YouTube page
        if (window.location.hostname === 'www.youtube.com') {
            // Clean up existing UI
            window.YTUIManager.cleanup();
            window.YTCopyManager.removeAllCopyIcons();
            window.YTThumbnailDownloader.removeAllDownloadButtons();

            // Wait a bit for page to settle, then reinitialize
            setTimeout(() => {
                initializeEmbeddedUI();
            }, 1000);
        }
    } catch (error) {
        console.error('❌ Error checking for navigation:', error);
    }
}

// Event listeners for YouTube navigation
document.addEventListener('yt-navigate-finish', initializeEmbeddedUI);
document.addEventListener('yt-page-data-updated', initializeEmbeddedUI);

// Listen for page visibility changes (handles back/forward navigation)
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        setTimeout(checkForNavigation, 500);
    }
});

// Listen for popstate (browser back/forward buttons)
window.addEventListener('popstate', () => {
    setTimeout(checkForNavigation, 500);
});

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeEmbeddedUI);
} else {
    // DOM is already ready
    setTimeout(initializeEmbeddedUI, 1000);
}

// Fallback initialization for YouTube SPA
setInterval(() => {
    if (!window.YTUIManager || !window.YTUIManager.isInitialized) {
        initializeEmbeddedUI();
    }
}, 5000);
