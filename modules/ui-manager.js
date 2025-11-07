/**
 * UI Manager Module
 * Handles the embedded YouTube header UI and styling
 */

class UIManager {
    constructor() {
        this.embeddedUI = null;
        this.isInitialized = false;
        this.isContentVisible = false;
    }

    /**
     * Initialize the embedded UI
     */
    initialize() {
        if (this.isInitialized) return;

        this.injectStyles();
        this.createEmbeddedUI();
        this.isInitialized = true;
    }

    /**
     * Inject all necessary CSS styles
     */
    injectStyles() {
        if (document.getElementById('yt-info-styles')) return;

        const styleElement = document.createElement('style');
        styleElement.id = 'yt-info-styles';
        styleElement.textContent = this.getStyles();
        document.head.appendChild(styleElement);
    }

    /**
     * Create the embedded UI in YouTube header
     */
    createEmbeddedUI() {
        // Find the search bar container in YouTube header
        const searchContainer = this.findSearchContainer();
        if (!searchContainer || this.embeddedUI) {
            return;
        }

        // Create main container
        this.embeddedUI = document.createElement('div');
        this.embeddedUI.className = 'yt-info-embedded-ui';
        this.embeddedUI.innerHTML = this.getEmbeddedUIHTML();

        // Insert the extension button in the center section after the search box
        const centerSection = document.querySelector('#center');
        if (centerSection) {
            // Insert after the search box but before the voice search button
            const voiceSearchButton = centerSection.querySelector('#voice-search-button');
            if (voiceSearchButton) {
                centerSection.insertBefore(this.embeddedUI, voiceSearchButton);
            } else {
                // Fallback: insert at the end of center section
                centerSection.appendChild(this.embeddedUI);
            }
        } else {
            // Fallback: insert after the search container
            searchContainer.parentNode.insertBefore(this.embeddedUI, searchContainer.nextSibling);
        }

        // Add event listeners
        this.setupEventListeners();
    }

    /**
     * Find the search container in YouTube header
     */
    findSearchContainer() {
        // Primary: Look for the YouTube searchbox in the center section
        const searchBox = document.querySelector('yt-searchbox');
        if (searchBox) {
            return searchBox;
        }

        // Fallback: Look for the search form in YouTube header
        const searchForm = document.querySelector('#search-form');
        if (searchForm) {
            return searchForm.closest('div') || searchForm.parentElement;
        }

        // Fallback: look for search input
        const searchInput = document.querySelector('#search, #search-input');
        if (searchInput) {
            return searchInput.closest('div') || searchInput.parentElement;
        }

        return null;
    }

    /**
     * Get the embedded UI HTML structure
     */
    getEmbeddedUIHTML() {
        return `
            <div class="yt-info-header">
                <button id="yt-info-toggle-btn" class="yt-info-toggle-btn">
                    <span class="yt-info-toggle-icon">🎬</span>
                    <span class="yt-info-toggle-text">YT Info</span>
                </button>
            </div>
            
            <div class="yt-info-dropdown" style="display: none;">
                <div class="yt-info-dropdown-header">
                    <div class="yt-info-dropdown-title">🎬 YT Info Extractor</div>
                    <button id="yt-info-close-btn" class="yt-info-close-btn">×</button>
                </div>
                
                <div class="yt-info-dropdown-content">
                    <div class="yt-info-controls">
                        <button id="yt-info-extract-btn" class="yt-info-btn yt-info-primary">
                            <span class="yt-info-btn-icon">📊</span>
                            Extract Videos
                        </button>
                    </div>
                    
                    <div class="yt-info-status">
                        <div id="yt-info-status-text" class="yt-info-status-text">Ready to extract videos...</div>
                    </div>
                    
                    <div class="yt-info-results">
                        <div class="yt-info-results-header">
                            <h3>Extracted Videos</h3>
                            <div class="yt-info-results-actions">
                                <button id="yt-info-copy-all-btn" class="yt-info-btn yt-info-small">
                                    📋 Copy All
                                </button>
                            </div>
                        </div>
                        <div id="yt-info-results-table" class="yt-info-results-table">
                            <div class="yt-info-no-results">No videos extracted yet. Click "Extract Videos" to start.</div>
                        </div>
                    </div>
                    
                    <div class="yt-info-thumbnails">
                        <div class="yt-info-thumbnails-header">
                            <h3>Thumbnail Downloads</h3>
                        </div>
                        <div class="yt-info-thumbnails-actions">
                            <button id="yt-info-download-all-btn" class="yt-info-btn yt-info-small">
                                ⬇️ Download All Thumbnails
                            </button>
                            <button id="yt-info-download-max-btn" class="yt-info-btn yt-info-small">
                                🖼️ Max Resolution
                            </button>
                        </div>
                    </div>
                    
                    <div class="yt-info-footer">
                        <div class="yt-info-footer-content">
                            <div class="yt-info-copyright">
                                Made by <a href="https://wa.me/919413966915" target="_blank" class="yt-info-footer-link">Sahil Ahmed</a>
                            </div>
                            <div class="yt-info-feedback">
                                <a href="https://wa.me/919413966915" target="_blank" class="yt-info-footer-link yt-info-feedback-link">
                                    💬 Send Feedback or Suggest Features
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Setup event listeners for the embedded UI
     */
    setupEventListeners() {
        if (!this.embeddedUI) return;

        // Toggle button
        const toggleBtn = this.embeddedUI.querySelector('#yt-info-toggle-btn');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                this.toggleDropdown();
            });
        }

        // Close button
        const closeBtn = this.embeddedUI.querySelector('#yt-info-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hideDropdown();
            });
        }

        // Extract button
        const extractBtn = this.embeddedUI.querySelector('#yt-info-extract-btn');
        if (extractBtn) {
            extractBtn.addEventListener('click', () => {
                window.YTVideoExtractor.extractVideos();
            });
        }

        // Copy all button
        const copyAllBtn = this.embeddedUI.querySelector('#yt-info-copy-all-btn');
        if (copyAllBtn) {
            copyAllBtn.addEventListener('click', () => {
                window.YTCopyManager.copyAllTitles();
            });
        }

        // Download all thumbnails button
        const downloadAllBtn = this.embeddedUI.querySelector('#yt-info-download-all-btn');
        if (downloadAllBtn) {
            downloadAllBtn.addEventListener('click', () => {
                window.YTThumbnailDownloader.downloadAllThumbnails();
            });
        }

        // Download max resolution button
        const downloadMaxBtn = this.embeddedUI.querySelector('#yt-info-download-max-btn');
        if (downloadMaxBtn) {
            downloadMaxBtn.addEventListener('click', () => {
                window.YTThumbnailDownloader.downloadAllThumbnailsMaxRes();
            });
        }

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.embeddedUI.contains(e.target)) {
                this.hideDropdown();
            }
        });
    }

    /**
     * Toggle the dropdown visibility
     */
    toggleDropdown() {
        if (this.isContentVisible) {
            this.hideDropdown();
        } else {
            this.showDropdown();
        }
    }

    /**
     * Show the dropdown
     */
    showDropdown() {
        if (!this.embeddedUI) return;

        const dropdown = this.embeddedUI.querySelector('.yt-info-dropdown');
        if (dropdown) {
            dropdown.style.display = 'block';
            this.isContentVisible = true;
        }
    }

    /**
     * Hide the dropdown
     */
    hideDropdown() {
        if (!this.embeddedUI) return;

        const dropdown = this.embeddedUI.querySelector('.yt-info-dropdown');
        if (dropdown) {
            dropdown.style.display = 'none';
            this.isContentVisible = false;
        }
    }

    /**
     * Show status message
     */
    showStatus(message, type = 'info') {
        if (!this.embeddedUI) return;

        const statusText = this.embeddedUI.querySelector('#yt-info-status-text');
        if (statusText) {
            statusText.textContent = message;
            statusText.className = `yt-info-status-text yt-info-status-${type}`;
        }
    }

    /**
     * Update results table
     */
    updateResultsTable(videos) {
        if (!this.embeddedUI) return;

        const resultsTable = this.embeddedUI.querySelector('#yt-info-results-table');
        if (!resultsTable) return;

        if (!videos || videos.length === 0) {
            resultsTable.innerHTML = '<div class="yt-info-no-results">No videos found on this page.</div>';
            return;
        }

        const tableHTML = `
            <table class="yt-info-table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Views</th>
                        <th>Upload Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${videos.map(video => `
                        <tr>
                            <td>${video.title}</td>
                            <td>${video.views || 'N/A'}</td>
                            <td>${video.uploadDate || 'N/A'}</td>
                            <td>
                                <button class="yt-info-copy-btn" 
                                        data-title="${this.escapeHtml(video.title)}" 
                                        data-views="${this.escapeHtml(video.views || 'N/A')}" 
                                        data-upload-date="${this.escapeHtml(video.uploadDate || 'N/A')}">
                                    📋 Copy
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        resultsTable.innerHTML = tableHTML;

        // Add copy button event listeners
        const copyBtns = resultsTable.querySelectorAll('.yt-info-copy-btn');
        copyBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const title = btn.getAttribute('data-title') || '';
                const views = btn.getAttribute('data-views') || 'N/A';
                const uploadDate = btn.getAttribute('data-upload-date') || 'N/A';

                // Format: title | views | upload date/time
                const formattedText = `${title} | ${views} | ${uploadDate}`;
                window.YTCopyManager.copyToClipboard(formattedText, btn);
            });
        });
    }

    /**
     * Escape HTML for use in HTML attributes
     */
    escapeHtml(text) {
        if (!text) return '';
        // Escape quotes and ampersands for HTML attributes
        return String(text)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    /**
     * Get all CSS styles
     */
    getStyles() {
        return `
            /* Embedded UI Styles */
            .yt-info-embedded-ui {
                position: relative !important;
                z-index: 1000 !important;
                margin-left: 15px !important;
                margin-right: 15px !important;
                display: flex !important;
                align-items: center !important;
                height: 40px !important;
            }
            
            .yt-info-header {
                display: flex !important;
                align-items: center !important;
            }
            
            .yt-info-toggle-btn {
                display: flex !important;
                align-items: center !important;
                gap: 6px !important;
                padding: 8px 12px !important;
                background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%) !important;
                color: white !important;
                border: none !important;
                border-radius: 8px !important;
                font-size: 12px !important;
                font-weight: 500 !important;
                cursor: pointer !important;
                transition: all 0.2s ease !important;
                white-space: nowrap !important;
                box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3) !important;
                /* Ensure button integrates with YouTube header */
                height: 32px !important;
                line-height: 1 !important;
                font-family: "Roboto", "Arial", sans-serif !important;
            }
            
            .yt-info-toggle-btn:hover {
                transform: translateY(-1px) !important;
                box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4) !important;
                background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%) !important;
            }
            
            .yt-info-toggle-btn:active {
                transform: translateY(0) !important;
                box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3) !important;
            }
            
            .yt-info-toggle-icon {
                font-size: 14px !important;
            }
            
            .yt-info-toggle-text {
                font-size: 12px !important;
            }
            
            /* Dropdown Styles */
            .yt-info-dropdown {
                position: absolute !important;
                top: 100% !important;
                right: 0 !important;
                background: linear-gradient(135deg, #1e293b 0%, #334155 100%) !important;
                border: 1px solid rgba(255, 255, 255, 0.1) !important;
                border-radius: 12px !important;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4) !important;
                backdrop-filter: blur(20px) !important;
                margin-top: 10px !important;
                min-width: 400px !important;
                max-width: 500px !important;
                z-index: 1001 !important;
                overflow: hidden !important;
                animation: yt-info-dropdown-fade-in 0.3s ease-out !important;
            }
            
            @keyframes yt-info-dropdown-fade-in {
                from {
                    opacity: 0 !important;
                    transform: translateY(-10px) scale(0.95) !important;
                }
                to {
                    opacity: 1 !important;
                    transform: translateY(0) scale(1) !important;
                }
            }
            
            .yt-info-dropdown-header {
                display: flex !important;
                justify-content: space-between !important;
                align-items: center !important;
                padding: 15px 20px !important;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
                background: rgba(255, 255, 255, 0.05) !important;
            }
            
            .yt-info-dropdown-title {
                color: #f8fafc !important;
                font-weight: 600 !important;
                font-size: 16px !important;
            }
            
            .yt-info-close-btn {
                background: none !important;
                border: none !important;
                color: #94a3b8 !important;
                font-size: 24px !important;
                cursor: pointer !important;
                padding: 0 !important;
                width: 24px !important;
                height: 24px !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                border-radius: 4px !important;
                transition: all 0.2s ease !important;
            }
            
            .yt-info-close-btn:hover {
                color: #f8fafc !important;
                background: rgba(255, 255, 255, 0.1) !important;
                transform: scale(1.1) !important;
            }
            
            .yt-info-dropdown-content {
                padding: 20px !important;
                max-height: 500px !important;
                overflow-y: auto !important;
            }
            
            .yt-info-controls {
                display: flex !important;
                gap: 10px !important;
                margin-bottom: 20px !important;
            }
            
            .yt-info-btn {
                display: flex !important;
                align-items: center !important;
                gap: 6px !important;
                padding: 8px 12px !important;
                border: none !important;
                border-radius: 8px !important;
                font-size: 12px !important;
                font-weight: 500 !important;
                cursor: pointer !important;
                transition: all 0.2s ease !important;
                white-space: nowrap !important;
            }
            
            .yt-info-btn-icon {
                font-size: 14px !important;
            }
            
            .yt-info-primary {
                background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%) !important;
                color: white !important;
                box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3) !important;
            }
            
            .yt-info-primary:hover {
                transform: translateY(-1px) !important;
                box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4) !important;
            }
            
            .yt-info-secondary {
                background: rgba(255, 255, 255, 0.1) !important;
                color: #f8fafc !important;
                border: 1px solid rgba(255, 255, 255, 0.2) !important;
            }
            
            .yt-info-secondary:hover {
                background: rgba(255, 255, 255, 0.15) !important;
                border-color: rgba(255, 255, 255, 0.3) !important;
            }
            
            .yt-info-small {
                padding: 6px 10px !important;
                font-size: 11px !important;
            }
            
            /* Status */
            .yt-info-status {
                margin-bottom: 20px !important;
            }
            
            .yt-info-status-text {
                color: #f8fafc !important;
                font-size: 14px !important;
                font-weight: 500 !important;
            }
            
            .yt-info-status-success {
                color: #10b981 !important;
            }
            
            .yt-info-status-error {
                color: #ef4444 !important;
            }
            
            .yt-info-status-info {
                color: #3b82f6 !important;
            }
            
            /* Results */
            .yt-info-results {
                margin-bottom: 25px !important;
            }
            
            .yt-info-results-header {
                display: flex !important;
                justify-content: space-between !important;
                align-items: center !important;
                margin-bottom: 15px !important;
            }
            
            .yt-info-results-header h3 {
                color: #f8fafc !important;
                font-size: 16px !important;
                font-weight: 600 !important;
                margin: 0 !important;
            }
            
            .yt-info-results-actions {
                display: flex !important;
                gap: 8px !important;
            }
            
            .yt-info-table {
                width: 100% !important;
                border-collapse: collapse !important;
                background: rgba(255, 255, 255, 0.05) !important;
                border-radius: 8px !important;
                overflow: hidden !important;
                font-size: 12px !important;
            }
            
            .yt-info-table th,
            .yt-info-table td {
                padding: 8px 10px !important;
                text-align: left !important;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
            }
            
            .yt-info-table th {
                background: rgba(255, 255, 255, 0.1) !important;
                color: #f8fafc !important;
                font-weight: 600 !important;
                font-size: 12px !important;
            }
            
            .yt-info-table td {
                color: #e2e8f0 !important;
                font-size: 12px !important;
            }
            
            .yt-info-table tr:hover {
                background: rgba(255, 255, 255, 0.05) !important;
            }
            
            .yt-info-copy-btn {
                background: rgba(59, 130, 246, 0.2) !important;
                color: #3b82f6 !important;
                border: 1px solid rgba(59, 130, 246, 0.3) !important;
                padding: 4px 8px !important;
                border-radius: 4px !important;
                font-size: 11px !important;
                cursor: pointer !important;
                transition: all 0.2s ease !important;
            }
            
            .yt-info-copy-btn:hover {
                background: rgba(59, 130, 246, 0.3) !important;
                border-color: rgba(59, 130, 246, 0.5) !important;
            }
            
            .yt-info-no-results {
                color: #94a3b8 !important;
                text-align: center !important;
                padding: 20px !important;
                font-style: italic !important;
                font-size: 12px !important;
            }
            
            /* Thumbnails Section */
            .yt-info-thumbnails {
                border-top: 1px solid rgba(255, 255, 255, 0.1) !important;
                padding-top: 20px !important;
            }
            
            .yt-info-thumbnails-header h3 {
                color: #f8fafc !important;
                font-size: 16px !important;
                font-weight: 600 !important;
                margin: 0 0 15px 0 !important;
            }
            
            .yt-info-thumbnails-actions {
                display: flex !important;
                gap: 10px !important;
            }
            
            /* Scrollbar styling for dropdown */
            .yt-info-dropdown-content::-webkit-scrollbar {
                width: 6px !important;
            }
            
            .yt-info-dropdown-content::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.1) !important;
                border-radius: 3px !important;
            }
            
            .yt-info-dropdown-content::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.3) !important;
                border-radius: 3px !important;
            }
            
            .yt-info-dropdown-content::-webkit-scrollbar-thumb:hover {
                background: rgba(255, 255, 255, 0.5) !important;
            }
            
            /* Thumbnail Download Button Styles */
            .yt-info-thumbnail-download {
                position: absolute !important;
                top: 8px !important;
                right: 8px !important;
                background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%) !important;
                color: white !important;
                border: none !important;
                border-radius: 6px !important;
                width: 32px !important;
                height: 32px !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                cursor: pointer !important;
                font-size: 16px !important;
                font-weight: 600 !important;
                box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4) !important;
                transition: all 0.2s ease !important;
                z-index: 1001 !important;
            }
            
            .yt-info-thumbnail-download:hover {
                transform: scale(1.1) !important;
                box-shadow: 0 6px 20px rgba(59, 130, 246, 0.6) !important;
            }
            
            .yt-info-thumbnail-download.yt-info-loading {
                background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%) !important;
                box-shadow: 0 4px 15px rgba(245, 158, 11, 0.4) !important;
            }
            
            .yt-info-thumbnail-download.yt-info-success {
                background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
                box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4) !important;
            }
            
            .yt-info-thumbnail-download.yt-info-error {
                background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%) !important;
                box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4) !important;
            }
            
            /* Quality dropdown styles - Tooltip appearance */
            .yt-info-quality-dropdown {
                position: fixed !important;
                background: white !important;
                border: 1px solid #e2e8f0 !important;
                border-radius: 8px !important;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15) !important;
                min-width: 260px !important;
                z-index: 10000 !important;
                overflow: hidden !important;
                padding: 0 !important;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
                /* Ensure dropdown is visible */
                display: none !important;
                pointer-events: auto !important;
            }
            
            .yt-info-quality-option {
                display: flex !important;
                align-items: center !important;
                justify-content: space-between !important;
                padding: 12px 16px !important;
                cursor: pointer !important;
                transition: background-color 0.2s ease !important;
                border-bottom: 1px solid #f1f5f9 !important;
            }
            
            .yt-info-quality-option:last-child {
                border-bottom: none !important;
            }
            
            .yt-info-quality-option:hover {
                background: #f8fafc !important;
            }
            
            .yt-info-quality-info {
                flex: 1 !important;
            }
            
            .yt-info-quality-name {
                color: #1e293b !important;
                font-weight: 500 !important;
                font-size: 14px !important;
                margin-bottom: 2px !important;
            }
            
            .yt-info-quality-details {
                color: #64748b !important;
                font-size: 12px !important;
                font-weight: 400 !important;
            }
            
            .yt-info-quality-download-btn {
                color: #3b82f6 !important;
                font-size: 14px !important;
                padding: 6px 10px !important;
                border-radius: 6px !important;
                background: #eff6ff !important;
                transition: all 0.2s ease !important;
                border: 1px solid #dbeafe !important;
            }
            
            .yt-info-quality-option:hover .yt-info-quality-download-btn {
                background: #dbeafe !important;
                border-color: #3b82f6 !important;
            }
            
            /* Active state for download button when dropdown is open */
            .yt-info-thumbnail-download.yt-info-active {
                background: linear-gradient(135deg, #059669 0%, #047857 100%) !important;
                box-shadow: 0 4px 15px rgba(5, 150, 105, 0.4) !important;
            }
            
            /* Copy icon styles for webpage */
            .yt-info-webpage-copy-icon {
                display: inline-block !important;
                margin-left: 8px !important;
                cursor: pointer !important;
                font-size: 14px !important;
                opacity: 0.7 !important;
                transition: all 0.2s ease !important;
                vertical-align: middle !important;
            }
            
            .yt-info-webpage-copy-icon:hover {
                opacity: 1 !important;
                transform: scale(1.1) !important;
            }
            
            .yt-info-webpage-copy-icon:focus {
                outline: none !important;
            }
            
            /* Footer Styles */
            .yt-info-footer {
                border-top: 1px solid rgba(255, 255, 255, 0.1) !important;
                padding-top: 15px !important;
                margin-top: 20px !important;
            }
            
            .yt-info-footer-content {
                display: flex !important;
                flex-direction: column !important;
                gap: 10px !important;
                align-items: center !important;
                text-align: center !important;
            }
            
            .yt-info-copyright {
                color: #94a3b8 !important;
                font-size: 12px !important;
                font-weight: 400 !important;
            }
            
            .yt-info-footer-link {
                color: #3b82f6 !important;
                text-decoration: none !important;
                font-weight: 500 !important;
                transition: all 0.2s ease !important;
            }
            
            .yt-info-footer-link:hover {
                color: #60a5fa !important;
                text-decoration: underline !important;
            }
            
            .yt-info-feedback {
                margin-top: 5px !important;
            }
            
            .yt-info-feedback-link {
                display: inline-flex !important;
                align-items: center !important;
                gap: 6px !important;
                padding: 6px 12px !important;
                background: rgba(59, 130, 246, 0.1) !important;
                border: 1px solid rgba(59, 130, 246, 0.3) !important;
                border-radius: 6px !important;
                font-size: 12px !important;
                transition: all 0.2s ease !important;
            }
            
            .yt-info-feedback-link:hover {
                background: rgba(59, 130, 246, 0.2) !important;
                border-color: rgba(59, 130, 246, 0.5) !important;
                transform: translateY(-1px) !important;
                text-decoration: none !important;
            }
        `;
    }

    /**
     * Clean up the UI
     */
    cleanup() {
        if (this.embeddedUI) {
            this.embeddedUI.remove();
            this.embeddedUI = null;
        }
        this.isInitialized = false;
        this.isContentVisible = false;
    }
}

// Create global instance
window.YTUIManager = new UIManager();
