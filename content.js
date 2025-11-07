/**
 * YouTube Video Info Extractor - Main Content Script
 * Orchestrates all modules and handles YouTube navigation
 */

// Main initialization function
function initializeEmbeddedUI() {
    try {
        // Initialize UI Manager
        window.YTUIManager.initialize();

        // Reset processed count for new page
        lastProcessedCount = 0;

        // Add copy icons to videos
        window.YTCopyManager.addCopyIconsToVideos();

        // Add thumbnail download buttons
        window.YTThumbnailDownloader.addThumbnailDownloadButtons();

        // Update count after initial processing
        lastProcessedCount = window.YTDomUtils.findAllVideoElements().length;

        // Setup video observer for dynamic content
        setupVideoObserver();

    } catch (error) {
        console.error('❌ Error initializing YouTube Info Extractor:', error);
    }
}

// Global observer instance
let videoObserver = null;
let updateTimeout = null;
let lastProcessedCount = 0;

/**
 * Process new videos that haven't been processed yet
 */
function processNewVideos() {
    try {
        // Get all current video elements
        const allVideos = window.YTDomUtils.findAllVideoElements();
        const currentCount = allVideos.length;

        // Only process if there are new videos
        if (currentCount > lastProcessedCount) {
            // Process all videos (the managers will skip already processed ones)
            window.YTCopyManager.addCopyIconsToVideos();
            window.YTThumbnailDownloader.addThumbnailDownloadButtons();
            lastProcessedCount = currentCount;
        }
    } catch (error) {
        console.error('❌ Error processing new videos:', error);
    }
}

/**
 * Debounced function to process videos
 */
function debouncedProcessVideos() {
    // Clear existing timeout
    if (updateTimeout) {
        clearTimeout(updateTimeout);
    }

    // Set new timeout (wait a bit for YouTube to finish loading)
    updateTimeout = setTimeout(() => {
        processNewVideos();
    }, 800);
}

/**
 * Setup observer for dynamically loaded videos
 */
function setupVideoObserver() {
    try {
        // Disconnect existing observer if any
        if (videoObserver) {
            videoObserver.disconnect();
        }

        // Create observer to watch for new video elements
        videoObserver = new MutationObserver((mutations) => {
            let hasNewVideos = false;

            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // Check if the node itself is a video container
                            if (node.matches && window.YTDomUtils.YOUTUBE_SELECTORS.VIDEO_CONTAINERS.some(selector => node.matches(selector))) {
                                hasNewVideos = true;
                            }
                            // Check if node contains video elements
                            else if (node.querySelectorAll) {
                                for (const selector of window.YTDomUtils.YOUTUBE_SELECTORS.VIDEO_CONTAINERS) {
                                    if (node.querySelector(selector)) {
                                        hasNewVideos = true;
                                        break;
                                    }
                                }
                            }
                        }
                    });
                }
            });

            if (hasNewVideos) {
                debouncedProcessVideos();
            }
        });

        // Start observing the entire document body with subtree
        videoObserver.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
        });

        // Also listen for scroll events (YouTube uses infinite scroll)
        let scrollTimeout = null;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
            scrollTimeout = setTimeout(() => {
                // Check for new videos after scrolling
                const currentCount = window.YTDomUtils.findAllVideoElements().length;
                if (currentCount > lastProcessedCount) {
                    debouncedProcessVideos();
                }
            }, 1000);
        }, { passive: true });

        // Periodic check as a fallback (every 3 seconds)
        setInterval(() => {
            const currentCount = window.YTDomUtils.findAllVideoElements().length;
            if (currentCount > lastProcessedCount) {
                processNewVideos();
            }
        }, 3000);

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

            // Reset count for new page
            lastProcessedCount = 0;

            // Disconnect existing observer
            if (videoObserver) {
                videoObserver.disconnect();
                videoObserver = null;
            }

            // Clear any pending timeouts
            if (updateTimeout) {
                clearTimeout(updateTimeout);
                updateTimeout = null;
            }

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
