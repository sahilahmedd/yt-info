/**
 * Copy Manager Module
 * Handles copy functionality for video titles and other text
 */

class CopyManager {
    constructor() {
        this.copyIconsAdded = new Set();
    }

    /**
     * Add copy icons to all videos on the page
     */
    addCopyIconsToVideos() {
        try {
            const videoElements = window.YTDomUtils.findAllVideoElements();

            videoElements.forEach(video => {
                this.addCopyIconToVideo(video);
            });

            console.log(`Added copy icons to ${videoElements.length} videos`);
        } catch (error) {
            console.error('Error adding copy icons:', error);
        }
    }

    /**
     * Add copy icon to a single video
     */
    addCopyIconToVideo(video) {
        try {
            // Check if copy icon already exists
            if (this.copyIconsAdded.has(video)) {
                return;
            }

            const titleElement = window.YTDomUtils.findTitleElement(video);
            if (!titleElement) return;

            // Create copy icon
            const copyIcon = this.createCopyIcon(titleElement.textContent.trim());

            // Insert after title
            titleElement.parentNode.insertBefore(copyIcon, titleElement.nextSibling);

            // Mark as added
            this.copyIconsAdded.add(video);

        } catch (error) {
            console.error('Error adding copy icon to video:', error);
        }
    }

    /**
     * Create a copy icon element
     */
    createCopyIcon(title) {
        const copyIcon = document.createElement('span');
        copyIcon.className = 'yt-info-webpage-copy-icon';
        copyIcon.innerHTML = '📋';
        copyIcon.title = 'Copy title';
        copyIcon.style.cssText = `
            display: inline-block !important;
            margin-left: 8px !important;
            cursor: pointer !important;
            font-size: 14px !important;
            opacity: 0.7 !important;
            transition: all 0.2s ease !important;
            vertical-align: middle !important;
        `;

        // Add hover effects
        copyIcon.addEventListener('mouseenter', () => {
            copyIcon.style.opacity = '1';
            copyIcon.style.transform = 'scale(1.1)';
        });

        copyIcon.addEventListener('mouseleave', () => {
            copyIcon.style.opacity = '0.7';
            copyIcon.style.transform = 'scale(1)';
        });

        // Add click functionality
        copyIcon.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.copyToClipboard(title, copyIcon);
        });

        return copyIcon;
    }

    /**
     * Copy text to clipboard with visual feedback
     */
    copyToClipboard(text, button) {
        if (!text || !text.trim()) {
            console.warn('No text to copy');
            return;
        }

        try {
            // Try modern clipboard API first
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(text).then(() => {
                    this.showCopySuccess(button);
                }).catch(err => {
                    console.error('Clipboard API failed:', err);
                    this.fallbackCopy(text, button);
                });
            } else {
                // Fallback for older browsers
                this.fallbackCopy(text, button);
            }
        } catch (error) {
            console.error('Error copying to clipboard:', error);
            this.fallbackCopy(text, button);
        }
    }

    /**
     * Fallback copy method for older browsers
     */
    fallbackCopy(text, button) {
        try {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);

            if (successful) {
                this.showCopySuccess(button);
            } else {
                this.showCopyError(button);
            }
        } catch (error) {
            console.error('Fallback copy failed:', error);
            this.showCopyError(button);
        }
    }

    /**
     * Show copy success feedback
     */
    showCopySuccess(button) {
        if (!button) return;

        const originalHTML = button.innerHTML;
        const originalBackground = button.style.background;

        // Change to success state
        button.innerHTML = '✓';
        button.style.background = '#10b981';
        button.style.color = 'white';
        button.style.opacity = '1';

        // Reset after delay
        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.style.background = originalBackground;
            button.style.color = '';
            button.style.opacity = '0.7';
        }, 1500);
    }

    /**
     * Show copy error feedback
     */
    showCopyError(button) {
        if (!button) return;

        const originalHTML = button.innerHTML;
        const originalBackground = button.style.background;

        // Change to error state
        button.innerHTML = '✗';
        button.style.background = '#ef4444';
        button.style.color = 'white';
        button.style.opacity = '1';

        // Reset after delay
        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.style.background = originalBackground;
            button.style.color = '';
            button.style.opacity = '0.7';
        }, 1500);
    }

    /**
     * Copy all extracted video titles with views and upload dates
     */
    copyAllTitles() {
        try {
            const videos = window.YTVideoExtractor.getExtractedVideos();

            if (videos.length === 0) {
                console.warn('No videos to copy');
                return;
            }

            // Format: title | views | upload date/time
            const formattedVideos = videos.map(video => {
                const title = video.title || '';
                const views = video.views || 'N/A';
                const uploadDate = video.uploadDate || 'N/A';
                return `${title} | ${views} | ${uploadDate}`;
            });

            const allVideos = formattedVideos.join('\n');
            this.copyToClipboard(allVideos);

            // Show success in UI
            window.YTUIManager.showStatus(`Copied ${videos.length} videos to clipboard!`, 'success');

        } catch (error) {
            console.error('Error copying all videos:', error);
            window.YTUIManager.showStatus('Error copying videos.', 'error');
        }
    }

    /**
     * Remove all copy icons
     */
    removeAllCopyIcons() {
        try {
            const copyIcons = document.querySelectorAll('.yt-info-webpage-copy-icon');
            copyIcons.forEach(icon => icon.remove());
            this.copyIconsAdded.clear();
            console.log('Removed all copy icons');
        } catch (error) {
            console.error('Error removing copy icons:', error);
        }
    }

    /**
     * Check if copy icons are present
     */
    hasCopyIcons() {
        return this.copyIconsAdded.size > 0;
    }

    /**
     * Get count of copy icons added
     */
    getCopyIconCount() {
        return this.copyIconsAdded.size;
    }
}

// Create global instance
window.YTCopyManager = new CopyManager();
