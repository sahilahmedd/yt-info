/**
 * Video Extractor Module
 * Handles extraction of video information from YouTube pages
 */

class VideoExtractor {
    constructor() {
        this.extractedVideos = [];
    }

    /**
     * Extract video information from the current page
     */
    extractVideos() {
        try {
            window.YTUIManager.showStatus('Extracting videos...', 'info');
            window.YTUIManager.showDropdown();

            // Find all video elements
            const videoElements = window.YTDomUtils.findAllVideoElements();

            if (videoElements.length === 0) {
                window.YTUIManager.showStatus('No videos found on this page.', 'error');
                window.YTUIManager.updateResultsTable([]);
                return;
            }

            // Extract data from each video
            this.extractedVideos = videoElements.map(video => this.extractVideoData(video));

            // Filter out videos without titles
            this.extractedVideos = this.extractedVideos.filter(video => video.title && video.title.trim());

            if (this.extractedVideos.length === 0) {
                window.YTUIManager.showStatus('No valid video titles found.', 'error');
                window.YTUIManager.updateResultsTable([]);
                return;
            }

            // Update UI with results
            window.YTUIManager.updateResultsTable(this.extractedVideos);
            window.YTUIManager.showStatus(
                `Successfully extracted ${this.extractedVideos.length} videos!`,
                'success'
            );

        } catch (error) {
            console.error('Error extracting videos:', error);
            window.YTUIManager.showStatus('Error extracting videos. Please try again.', 'error');
        }
    }

    /**
     * Extract data from a single video element
     */
    extractVideoData(video) {
        try {
            // Extract title
            const titleElement = window.YTDomUtils.findTitleElement(video);
            const title = titleElement ? titleElement.textContent.trim() : '';

            // Extract views (if available)
            const views = this.extractViews(video);

            // Extract upload date (if available)
            const uploadDate = this.extractUploadDate(video);

            // Extract video ID for thumbnails
            const thumbnailContainer = window.YTDomUtils.findThumbnailContainer(video);
            const imageElement = thumbnailContainer ? window.YTDomUtils.findImageElement(thumbnailContainer) : null;
            const videoId = imageElement ? window.YTDomUtils.extractVideoId(imageElement.src) : '';

            return {
                title,
                views,
                uploadDate,
                videoId,
                element: video
            };

        } catch (error) {
            console.error('Error extracting video data:', error);
            return {
                title: 'Error extracting title',
                views: 'N/A',
                uploadDate: 'N/A',
                videoId: '',
                element: video
            };
        }
    }

    /**
     * Extract view count from video element
     */
    extractViews(video) {
        try {
            // Method 1: Home page structure (yt-content-metadata-view-model)
            const contentMetadata = video.querySelector('yt-content-metadata-view-model');
            if (contentMetadata) {
                const metadataRows = contentMetadata.querySelectorAll('.yt-content-metadata-view-model__metadata-row');
                for (const row of metadataRows) {
                    // Get all spans with text content (excluding delimiter)
                    const spans = row.querySelectorAll('span.yt-core-attributed-string[role="text"]');
                    for (const span of spans) {
                        const text = span.textContent.trim();
                        // Check if it contains views (e.g., "32K views")
                        // Views typically appear first in the row
                        if (text && (text.toLowerCase().includes('view') || text.match(/\d+[KMB]?\s*views?/i))) {
                            return text;
                        }
                    }
                }
            }

            // Method 2: Watch page structure (ytd-video-meta-block)
            const videoMetaBlock = video.querySelector('ytd-video-meta-block');
            if (videoMetaBlock) {
                const metadataLine = videoMetaBlock.querySelector('#metadata-line');
                if (metadataLine) {
                    // Find all inline-metadata-item spans
                    const metadataItems = metadataLine.querySelectorAll('span.inline-metadata-item');
                    for (const item of metadataItems) {
                        const text = item.textContent.trim();
                        if (text && (text.toLowerCase().includes('view') || text.match(/\d+[KMB]?\s*views?/i))) {
                            return text;
                        }
                    }

                    // Fallback: try to find any span with "view" in text within metadata-line
                    const allSpans = metadataLine.querySelectorAll('span');
                    for (const span of allSpans) {
                        const text = span.textContent.trim();
                        if (text && text.toLowerCase().includes('view')) {
                            return text;
                        }
                    }
                }
            }

            return 'N/A';
        } catch (error) {
            console.error('Error extracting views:', error);
            return 'N/A';
        }
    }

    /**
     * Extract upload date from video element
     */
    extractUploadDate(video) {
        try {
            // Time-related keywords
            const timeKeywords = ['ago', 'day', 'week', 'month', 'year', 'hour', 'minute', 'second'];

            // Method 1: Home page structure (yt-content-metadata-view-model)
            const contentMetadata = video.querySelector('yt-content-metadata-view-model');
            if (contentMetadata) {
                const metadataRows = contentMetadata.querySelectorAll('.yt-content-metadata-view-model__metadata-row');
                for (const row of metadataRows) {
                    // Get all spans with text content (excluding delimiter)
                    const spans = row.querySelectorAll('span.yt-core-attributed-string[role="text"]');
                    for (const span of spans) {
                        const text = span.textContent.trim();
                        const lowerText = text.toLowerCase();
                        // Check if it contains time-related keywords (e.g., "2 days ago")
                        // Time typically appears after views in the same row
                        if (text && timeKeywords.some(keyword => lowerText.includes(keyword))) {
                            return text;
                        }
                    }
                }
            }

            // Method 2: Watch page structure (ytd-video-meta-block)
            const videoMetaBlock = video.querySelector('ytd-video-meta-block');
            if (videoMetaBlock) {
                const metadataLine = videoMetaBlock.querySelector('#metadata-line');
                if (metadataLine) {
                    // Find all inline-metadata-item spans
                    const metadataItems = metadataLine.querySelectorAll('span.inline-metadata-item');
                    for (const item of metadataItems) {
                        const text = item.textContent.trim();
                        const lowerText = text.toLowerCase();
                        if (text && timeKeywords.some(keyword => lowerText.includes(keyword))) {
                            return text;
                        }
                    }

                    // Fallback: try to find any span with time-related text within metadata-line
                    const allSpans = metadataLine.querySelectorAll('span');
                    for (const span of allSpans) {
                        const text = span.textContent.trim();
                        const lowerText = text.toLowerCase();
                        if (text && timeKeywords.some(keyword => lowerText.includes(keyword))) {
                            return text;
                        }
                    }
                }
            }

            return 'N/A';
        } catch (error) {
            console.error('Error extracting upload date:', error);
            return 'N/A';
        }
    }

    /**
     * Get all extracted videos
     */
    getExtractedVideos() {
        return this.extractedVideos;
    }

    /**
     * Get video titles only
     */
    getVideoTitles() {
        return this.extractedVideos.map(video => video.title).filter(title => title && title.trim());
    }

    /**
     * Clear extracted videos
     */
    clearExtractedVideos() {
        this.extractedVideos = [];
        window.YTUIManager.updateResultsTable([]);
    }

    /**
     * Debug video detection
     */
    debugVideoDetection() {
        // Debug functionality removed for production
    }
}

// Create global instance
window.YTVideoExtractor = new VideoExtractor();
