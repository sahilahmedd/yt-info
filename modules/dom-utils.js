/**
 * DOM Utility Functions
 * Handles YouTube element detection and DOM manipulation
 */

// YouTube element selectors
const YOUTUBE_SELECTORS = {
    // Header elements
    HEADER: '#masthead-container, ytd-masthead',
    PAGE_HEADER: 'yt-page-header-renderer',

    // Video elements
    VIDEO_CONTAINERS: [
        'ytd-rich-item-renderer',
        'ytd-rich-grid-media',
        'ytd-video-renderer',
        'ytd-compact-video-renderer',
        'ytd-grid-video-renderer'
    ],

    // Thumbnail elements
    THUMBNAIL_CONTAINERS: [
        '#thumbnail',
        'ytd-thumbnail',
        'yt-thumbnail-view-model',
        'a.yt-lockup-view-model__content-image'
    ],

    // Title elements
    TITLE_ELEMENTS: [
        '#video-title',
        'a#video-title',
        'h3.ytd-video-renderer',
        '.yt-lockup-metadata-view-model__title',
        'a.yt-lockup-metadata-view-model__title'
    ],

    // Image elements
    IMAGE_ELEMENTS: [
        'img.ytCoreImageHost',
        'img[src*="i.ytimg.com"]'
    ]
};

/**
 * Find YouTube header element
 */
function findYouTubeHeader() {
    return document.querySelector(YOUTUBE_SELECTORS.HEADER);
}

/**
 * Find page header element for channel info
 */
function findPageHeader() {
    return document.querySelector(YOUTUBE_SELECTORS.PAGE_HEADER);
}

/**
 * Find all video elements on the page
 */
function findAllVideoElements() {
    const videos = [];
    YOUTUBE_SELECTORS.VIDEO_CONTAINERS.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        videos.push(...Array.from(elements));
    });
    return videos;
}

/**
 * Find thumbnail container within a video element
 */
function findThumbnailContainer(video) {
    // Try selectors first
    for (const selector of YOUTUBE_SELECTORS.THUMBNAIL_CONTAINERS) {
        const container = video.querySelector(selector);
        if (container) return container;
    }

    // Fallback: Look for elements containing thumbnail images
    const thumbnailImages = video.querySelectorAll('img[src*="i.ytimg.com"]');
    if (thumbnailImages.length > 0) {
        // Return parent of first thumbnail image (usually the container)
        const firstImg = thumbnailImages[0];
        // Check if parent is a link or specific container
        let parent = firstImg.parentElement;
        while (parent && parent !== video) {
            if (parent.tagName === 'A' || parent.classList.contains('yt-thumbnail-view-model') ||
                parent.classList.contains('yt-lockup-view-model__content-image')) {
                return parent;
            }
            parent = parent.parentElement;
        }
        // If no specific parent found, return the immediate parent
        return firstImg.parentElement;
    }

    return null;
}

/**
 * Find title element within a video element
 */
function findTitleElement(video) {
    for (const selector of YOUTUBE_SELECTORS.TITLE_ELEMENTS) {
        const title = video.querySelector(selector);
        if (title) return title;
    }
    return null;
}

/**
 * Find image element within a thumbnail container
 */
function findImageElement(container) {
    for (const selector of YOUTUBE_SELECTORS.IMAGE_ELEMENTS) {
        const img = container.querySelector(selector);
        if (img) return img;
    }
    return null;
}

/**
 * Extract video ID from image URL
 */
function extractVideoId(imageUrl) {
    if (!imageUrl) return 'unknown';
    const videoIdMatch = imageUrl.match(/\/vi\/([^\/]+)\//);
    return videoIdMatch ? videoIdMatch[1] : 'unknown';
}

/**
 * Ensure element has relative positioning for absolute child positioning
 */
function ensureRelativePositioning(element) {
    if (getComputedStyle(element).position === 'static') {
        element.style.position = 'relative';
    }
}

/**
 * Check if element already has a specific class
 */
function hasClass(element, className) {
    return element && element.classList.contains(className);
}

/**
 * Add class if not already present
 */
function addClassIfNotPresent(element, className) {
    if (element && !hasClass(element, className)) {
        element.classList.add(className);
    }
}

/**
 * Remove class if present
 */
function removeClassIfPresent(element, className) {
    if (element && hasClass(element, className)) {
        element.classList.remove(className);
    }
}

/**
 * Create element with specified attributes
 */
function createElement(tag, className, innerHTML = '') {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (innerHTML) element.innerHTML = innerHTML;
    return element;
}

/**
 * Wait for element to be available in DOM
 */
function waitForElement(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
        const element = document.querySelector(selector);
        if (element) {
            resolve(element);
            return;
        }

        const observer = new MutationObserver((mutations, obs) => {
            const element = document.querySelector(selector);
            if (element) {
                obs.disconnect();
                resolve(element);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        setTimeout(() => {
            observer.disconnect();
            reject(new Error(`Element ${selector} not found within ${timeout}ms`));
        }, timeout);
    });
}

// Export functions for use in other modules
window.YTDomUtils = {
    findYouTubeHeader,
    findPageHeader,
    findAllVideoElements,
    findThumbnailContainer,
    findTitleElement,
    findImageElement,
    extractVideoId,
    ensureRelativePositioning,
    hasClass,
    addClassIfNotPresent,
    removeClassIfPresent,
    createElement,
    waitForElement,
    YOUTUBE_SELECTORS
};
