/**
 * Thumbnail Downloader Module
 * Handles thumbnail downloads in highest quality
 */

class ThumbnailDownloader {
    constructor() {
        this.processedVideos = new Set();
    }

    /**
     * Initialize: Add download buttons to all videos on the page
     */
    addThumbnailDownloadButtons() {
        try {
            const videoElements = window.YTDomUtils.findAllVideoElements();
            videoElements.forEach(video => this.addThumbnailDownloadButton(video));
        } catch (error) {
            console.error('Error adding thumbnail download buttons:', error);
        }
    }

    /**
     * Add download button to a single video element
     */
    addThumbnailDownloadButton(video) {
        if (!video || this.processedVideos.has(video)) {
            return;
        }

        try {
            const thumbnailContainer = window.YTDomUtils.findThumbnailContainer(video);
            if (!thumbnailContainer) {
                return;
            }

            const videoId = this.extractVideoId(video);
            if (!videoId) {
                return;
            }

            const videoTitle = this.extractVideoTitle(video);

            const downloadBtn = this.createDownloadButton(videoId, videoTitle);

            thumbnailContainer.appendChild(downloadBtn);
            window.YTDomUtils.ensureRelativePositioning(thumbnailContainer);

            this.processedVideos.add(video);

        } catch (error) {
            console.error('Error adding thumbnail download button:', error);
        }
    }

    /**
     * Extract video ID from video element with multiple fallback strategies
     */
    extractVideoId(video) {
        // Strategy 1: Extract from thumbnail image URL
        const thumbnailContainer = window.YTDomUtils.findThumbnailContainer(video);
        const imgElement = thumbnailContainer ? window.YTDomUtils.findImageElement(thumbnailContainer) : null;

        if (imgElement?.src) {
            const videoId = window.YTDomUtils.extractVideoId(imgElement.src);
            if (videoId && videoId !== 'unknown') {
                return videoId;
            }
        }

        // Strategy 2: Extract from video link href
        const videoLink = video.querySelector('a[href*="/watch?v="]');
        if (videoLink) {
            const match = videoLink.getAttribute('href')?.match(/\/watch\?v=([^&]+)/);
            if (match?.[1]) {
                return match[1];
            }
        }

        // Strategy 3: Extract from any link with v= parameter
        const allLinks = video.querySelectorAll('a[href*="v="]');
        for (const link of allLinks) {
            const match = link.getAttribute('href')?.match(/[?&]v=([^&]+)/);
            if (match?.[1]) {
                return match[1];
            }
        }

        return null;
    }

    /**
     * Extract video title from video element
     */
    extractVideoTitle(video) {
        // Strategy 1: Use YTDomUtils to find title element (handles new structure)
        const titleElement = window.YTDomUtils.findTitleElement(video);
        if (titleElement) {
            // Try textContent first (includes nested text)
            const title = titleElement.textContent?.trim();
            if (title) {
                return title;
            }
            // Try innerText
            const innerText = titleElement.innerText?.trim();
            if (innerText) {
                return innerText;
            }
            // Try finding span inside (for new structure with yt-core-attributed-string)
            const innerSpan = titleElement.querySelector('span.yt-core-attributed-string, span');
            if (innerSpan) {
                const spanTitle = innerSpan.textContent?.trim() || innerSpan.innerText?.trim();
                if (spanTitle) {
                    return spanTitle;
                }
            }
        }

        // Strategy 2: Find video title element by common selectors (prioritize new structure)
        const titleSelectors = [
            '.yt-lockup-metadata-view-model__title',
            'a.yt-lockup-metadata-view-model__title',
            '#video-title',
            'yt-formatted-string#video-title',
            '[id="video-title"]'
        ];

        for (const selector of titleSelectors) {
            const element = video.querySelector(selector);
            if (element) {
                // Try textContent first
                let title = element.textContent?.trim();
                if (title) {
                    return title;
                }
                // Try innerText
                title = element.innerText?.trim();
                if (title) {
                    return title;
                }
                // Try finding span inside (for new structure)
                const innerSpan = element.querySelector('span.yt-core-attributed-string, span');
                if (innerSpan) {
                    const spanTitle = innerSpan.textContent?.trim() || innerSpan.innerText?.trim();
                    if (spanTitle) {
                        return spanTitle;
                    }
                }
            }
        }

        // Strategy 3: Find title link with aria-label (new structure often has this)
        const titleLink = video.querySelector('a.yt-lockup-metadata-view-model__title[aria-label], a[aria-label]');
        if (titleLink) {
            const ariaLabel = titleLink.getAttribute('aria-label');
            if (ariaLabel) {
                // Remove common suffixes like "26 minutes", "18 minutes", etc.
                const title = ariaLabel.replace(/\s+\d+\s+minutes?\s*$/, '').trim();
                if (title) {
                    return title;
                }
            }
            // Try text content as fallback
            const textContent = titleLink.textContent?.trim() || titleLink.innerText?.trim();
            if (textContent) {
                return textContent;
            }
        }

        // Strategy 4: Find title link (old structure)
        const oldTitleLink = video.querySelector('#video-title-link, a[id="video-title-link"]');
        if (oldTitleLink) {
            // Try title attribute first
            const title = oldTitleLink.getAttribute('title') || oldTitleLink.getAttribute('aria-label');
            if (title) {
                // Remove time suffixes
                const cleanTitle = title.replace(/\s+\d+\s+minutes?\s*$/, '').trim();
                return cleanTitle || title.trim();
            }
            // Try text content
            const textContent = oldTitleLink.textContent?.trim() || oldTitleLink.innerText?.trim();
            if (textContent) {
                return textContent;
            }
        }

        // Strategy 5: Find any h3 with title
        const h3Title = video.querySelector('h3 a, h3 yt-formatted-string, h3 span');
        if (h3Title) {
            const title = h3Title.textContent?.trim() || h3Title.innerText?.trim();
            if (title) {
                return title;
            }
        }

        // Strategy 6: Try any link with aria-label (fallback)
        const linkWithLabel = video.querySelector('a[aria-label]');
        if (linkWithLabel) {
            const ariaLabel = linkWithLabel.getAttribute('aria-label');
            if (ariaLabel) {
                // Remove common suffixes like "18 minutes" or "26 minutes"
                const title = ariaLabel.replace(/\s+\d+\s+minutes?\s*$/, '').trim();
                if (title) {
                    return title;
                }
            }
        }

        return null;
    }

    /**
     * Sanitize filename to be filesystem-safe
     */
    sanitizeFilename(filename) {
        if (!filename) return 'youtube-thumbnail';

        // Remove or replace invalid filename characters
        let sanitized = filename
            .replace(/[<>:"/\\|?*]/g, '') // Remove invalid characters
            .replace(/\s+/g, ' ') // Replace multiple spaces with single space
            .trim();

        // Limit length to 200 characters to avoid filesystem issues
        if (sanitized.length > 200) {
            sanitized = sanitized.substring(0, 200).trim();
        }

        // If empty after sanitization, use fallback
        if (!sanitized) {
            return 'youtube-thumbnail';
        }

        return sanitized;
    }

    /**
     * Create download button for a video ID
     */
    createDownloadButton(videoId, videoTitle = null) {
        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'yt-info-thumbnail-download';
        downloadBtn.innerHTML = '⬇️';
        downloadBtn.title = 'Download thumbnail in highest quality';
        downloadBtn.setAttribute('data-video-id', videoId);
        downloadBtn.setAttribute('data-video-title', videoTitle || '');

        // Handle button click - directly download max resolution
        downloadBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();

            const maxResUrl = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
            await this.downloadThumbnail(maxResUrl, downloadBtn, videoTitle);
        });

        return downloadBtn;
    }

    /**
     * Build thumbnail URL for max resolution
     */
    buildMaxResThumbnailUrl(videoId) {
        return `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
    }

    /**
     * Download a thumbnail image
     */
    async downloadThumbnail(imageUrl, button = null, videoTitle = null) {
        try {
            if (button) {
                button.innerHTML = '⏳';
                button.classList.add('yt-info-loading');
            }

            const response = await fetch(imageUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            // Extract extension from URL or blob type
            const match = imageUrl.match(/\/vi(?:_webp)?\/([^\/]+)\/([^\.\/]+)\.(jpg|webp)/);
            const extension = match ? match[3] : (blob.type === 'image/webp' ? 'webp' : 'jpg');

            // Determine filename: use video title if available, otherwise fallback
            let filename;
            if (videoTitle) {
                const sanitizedTitle = this.sanitizeFilename(videoTitle);
                filename = `${sanitizedTitle}.${extension}`;
            } else if (button) {
                // Try to get title from button data attribute
                const titleFromButton = button.getAttribute('data-video-title');
                if (titleFromButton) {
                    const sanitizedTitle = this.sanitizeFilename(titleFromButton);
                    filename = `${sanitizedTitle}.${extension}`;
                } else {
                    // Fallback to video ID
                    const videoId = match ? match[1] : 'unknown';
                    filename = `youtube-thumbnail-${videoId}.${extension}`;
                }
            } else {
                // Fallback for batch downloads
                const videoId = match ? match[1] : 'unknown';
                filename = `youtube-thumbnail-${videoId}.${extension}`;
            }

            // Trigger download
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            URL.revokeObjectURL(url);

            if (button) {
                this.showDownloadSuccess(button);
            }

            return true;

        } catch (error) {
            console.error('Error downloading thumbnail:', error);
            if (button) {
                this.showDownloadError(button);
            }
            return false;
        }
    }

    /**
     * Show download success feedback
     */
    showDownloadSuccess(button) {
        if (!button) return;

        const originalHTML = button.innerHTML;
        const originalClasses = button.className;

        button.innerHTML = '✓';
        button.className = 'yt-info-thumbnail-download yt-info-success';
        button.classList.remove('yt-info-loading');

        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.className = originalClasses;
        }, 1500);
    }

    /**
     * Show download error feedback
     */
    showDownloadError(button) {
        if (!button) return;

        const originalHTML = button.innerHTML;
        const originalClasses = button.className;

        button.innerHTML = '✗';
        button.className = 'yt-info-thumbnail-download yt-info-error';
        button.classList.remove('yt-info-loading');

        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.className = originalClasses;
        }, 1500);
    }

    /**
     * Download all thumbnails on the page in maximum resolution
     */
    async downloadAllThumbnails() {
        try {
            const videoElements = window.YTDomUtils.findAllVideoElements();
            if (videoElements.length === 0) {
                return;
            }

            window.YTUIManager?.showStatus(`Starting download of ${videoElements.length} thumbnails in highest quality...`, 'info');

            let downloadedCount = 0;
            let errorCount = 0;
            const total = videoElements.length;

            for (let index = 0; index < videoElements.length; index++) {
                const video = videoElements[index];

                // Extract video ID directly from video element
                const videoId = this.extractVideoId(video);
                if (!videoId) {
                    errorCount++;
                    continue;
                }

                const videoTitle = this.extractVideoTitle(video);

                // Build max resolution URL directly from video ID
                const maxResUrl = this.buildMaxResThumbnailUrl(videoId);

                await new Promise(resolve => setTimeout(resolve, index * 100));
                const success = await this.downloadThumbnail(maxResUrl, null, videoTitle);

                if (success) {
                    downloadedCount++;
                } else {
                    errorCount++;
                }

                // Update status when all done
                if (downloadedCount + errorCount === total) {
                    const message = errorCount === 0
                        ? `Downloaded ${downloadedCount} thumbnails successfully!`
                        : `Downloaded ${downloadedCount} thumbnails, ${errorCount} failed.`;
                    window.YTUIManager?.showStatus(message, errorCount === 0 ? 'success' : 'warning');
                }
            }

        } catch (error) {
            console.error('Error downloading all thumbnails:', error);
            window.YTUIManager?.showStatus('Error downloading thumbnails.', 'error');
        }
    }

    /**
     * Download all thumbnails in maximum resolution
     */
    async downloadAllThumbnailsMaxRes() {
        try {
            const videoElements = window.YTDomUtils.findAllVideoElements();
            if (videoElements.length === 0) {
                return;
            }

            window.YTUIManager?.showStatus(`Starting download of ${videoElements.length} max resolution thumbnails...`, 'info');

            let downloadedCount = 0;
            let errorCount = 0;
            const total = videoElements.length;

            for (let index = 0; index < videoElements.length; index++) {
                const video = videoElements[index];

                // Extract video ID directly from video element
                const videoId = this.extractVideoId(video);
                if (!videoId) {
                    errorCount++;
                    continue;
                }

                const videoTitle = this.extractVideoTitle(video);

                // Build max resolution URL directly from video ID
                const maxResUrl = this.buildMaxResThumbnailUrl(videoId);

                await new Promise(resolve => setTimeout(resolve, index * 100));
                const success = await this.downloadThumbnail(maxResUrl, null, videoTitle);

                if (success) {
                    downloadedCount++;
                } else {
                    errorCount++;
                }

                // Update status when all done
                if (downloadedCount + errorCount === total) {
                    const message = errorCount === 0
                        ? `Downloaded ${downloadedCount} max resolution thumbnails successfully!`
                        : `Downloaded ${downloadedCount} max resolution thumbnails, ${errorCount} failed.`;
                    window.YTUIManager?.showStatus(message, errorCount === 0 ? 'success' : 'warning');
                }
            }

        } catch (error) {
            console.error('Error downloading max resolution thumbnails:', error);
            window.YTUIManager?.showStatus('Error downloading max resolution thumbnails.', 'error');
        }
    }

    /**
     * Convert thumbnail URL to maximum resolution
     */
    convertToMaxResolution(thumbnailUrl) {
        if (!thumbnailUrl) return thumbnailUrl;

        // Replace known quality suffixes with maxresdefault, preserving extension
        const replacedKnown = thumbnailUrl.replace(/\/(hqdefault|mqdefault|sddefault|default|maxresdefault)\.(jpg|webp)$/i, '/maxresdefault.$2');
        if (replacedKnown !== thumbnailUrl) return replacedKnown;

        // Fallback: replace last filename segment while preserving extension
        return thumbnailUrl.replace(/\/[^\/]+\.(jpg|webp)$/i, '/maxresdefault.$1');
    }

    /**
     * Remove all download buttons and clean up
     */
    removeAllDownloadButtons() {
        try {
            const downloadButtons = document.querySelectorAll('.yt-info-thumbnail-download');
            downloadButtons.forEach(btn => btn.remove());

            this.processedVideos.clear();

        } catch (error) {
            console.error('Error removing download buttons:', error);
        }
    }

    /**
     * Get count of processed videos
     */
    getDownloadButtonCount() {
        return this.processedVideos.size;
    }
}

// Create global instance
window.YTThumbnailDownloader = new ThumbnailDownloader();
