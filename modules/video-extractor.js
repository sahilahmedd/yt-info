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

            console.log('Extracted videos:', this.extractedVideos);

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
            // Find the metadata-line element (inside ytd-video-meta-block)
            const videoMetaBlock = video.querySelector('ytd-video-meta-block');
            if (!videoMetaBlock) {
                return 'N/A';
            }

            const metadataLine = videoMetaBlock.querySelector('#metadata-line');
            if (!metadataLine) {
                return 'N/A';
            }

            // Find all inline-metadata-item spans
            const metadataItems = metadataLine.querySelectorAll('span.inline-metadata-item');

            // Look for the one that contains "view" or "views"
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
            // Find the metadata-line element (inside ytd-video-meta-block)
            const videoMetaBlock = video.querySelector('ytd-video-meta-block');
            if (!videoMetaBlock) {
                return 'N/A';
            }

            const metadataLine = videoMetaBlock.querySelector('#metadata-line');
            if (!metadataLine) {
                return 'N/A';
            }

            // Find all inline-metadata-item spans
            const metadataItems = metadataLine.querySelectorAll('span.inline-metadata-item');

            // Time-related keywords
            const timeKeywords = ['ago', 'day', 'week', 'month', 'year', 'hour', 'minute', 'second'];

            // Look for the one that contains time-related keywords
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
        console.log('=== Video Detection Debug ===');

        const videoElements = window.YTDomUtils.findAllVideoElements();
        console.log(`Total video elements found: ${videoElements.length}`);

        videoElements.forEach((video, index) => {
            console.log(`\n--- Video ${index + 1} ---`);

            const titleElement = window.YTDomUtils.findTitleElement(video);
            console.log('Title element:', titleElement);
            console.log('Title text:', titleElement ? titleElement.textContent : 'N/A');

            const thumbnailContainer = window.YTDomUtils.findThumbnailContainer(video);
            console.log('Thumbnail container:', thumbnailContainer);

            const imageElement = thumbnailContainer ? window.YTDomUtils.findImageElement(thumbnailContainer) : null;
            console.log('Image element:', imageElement);
            console.log('Image src:', imageElement ? imageElement.src : 'N/A');

            const videoId = imageElement ? window.YTDomUtils.extractVideoId(imageElement.src) : 'N/A';
            console.log('Extracted video ID:', videoId);
        });

        console.log('=== End Debug ===');
    }
}

// Create global instance
window.YTVideoExtractor = new VideoExtractor();
