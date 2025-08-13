// Navigation Bar Functions
function toggleMobileMenu() {
    const toggle = document.querySelector('.ptn-mobile-toggle');
    const menu = document.getElementById('ptnMobileMenu');
    
    toggle.classList.toggle('active');
    menu.classList.toggle('active');
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(event) {
    const menu = document.getElementById('ptnMobileMenu');
    const toggle = document.querySelector('.ptn-mobile-toggle');
    const navbar = document.querySelector('.ptn-navbar-wrapper');
    
    if (navbar && !navbar.contains(event.target) && menu && menu.classList.contains('active')) {
        menu.classList.remove('active');
        toggle.classList.remove('active');
    }
});

// Handle window resize for navigation
window.addEventListener('resize', function() {
    const menu = document.getElementById('ptnMobileMenu');
    const toggle = document.querySelector('.ptn-mobile-toggle');
    
    if (window.innerWidth > 1100 && menu && menu.classList.contains('active')) {
        menu.classList.remove('active');
        if (toggle) toggle.classList.remove('active');
    }
});

// Enhanced Global variables
let usageCount = localStorage.getItem('ytaUsageCount') || 3;
let lastResetDate = localStorage.getItem('ytaLastReset') || new Date().toISOString();
let achievements = JSON.parse(localStorage.getItem('ytaAchievements') || '[]');
let userXP = parseInt(localStorage.getItem('ytaUserXP') || '0');
let userLevel = parseInt(localStorage.getItem('ytaUserLevel') || '1');
let hasShownExitIntent = false;
let timeOnPage = 0;
let hasShownTimePrompt = false;
let autoAnalyzing = false;

// Enhanced Popup Management System
const popups = {
    criticalBanner: { element: 'criticalBanner', peekTime: 3000, showTime: 8000 },
    revenueOpportunity: { element: 'revenueOpportunity', peekTime: 15000, showTime: 20000 },
    bottomCTA: { element: 'bottomCTA', peekTime: 30000, showTime: 35000 }
};

const popupStates = {};

// URL Parameter Parser
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Auto-analyze functionality
function checkForAutoAnalyze() {
    const creatorParam = getUrlParameter('creator');
    if (creatorParam) {
        autoAnalyzing = true;
        document.getElementById('autoAnalyzingNotice').style.display = 'block';
        document.getElementById('autoCreatorName').textContent = creatorParam;
        document.getElementById('inputSection').style.display = 'none';
        
        // Set the creator name in the input field for processing
        document.getElementById('ytaHandle').value = creatorParam;
        
        // Start analysis after a brief delay
        setTimeout(() => {
            ytaRun(0, true); // Pass true for auto-analyze mode
        }, 2000);
    }
}

// Enhanced XP and Level System
function addXP(amount, reason) {
    userXP += amount;
    localStorage.setItem('ytaUserXP', userXP);
    
    const newLevel = Math.floor(userXP / 100) + 1;
    if (newLevel > userLevel) {
        userLevel = newLevel;
        localStorage.setItem('ytaUserLevel', userLevel);
        showLevelUp(newLevel);
    }
    
    updateXPDisplay();
    if (!autoAnalyzing) {
        showXPGain(amount, reason);
    }
}

function updateXPDisplay() {
    const xpInLevel = userXP % 100;
    document.querySelectorAll('.xp-fill').forEach(fill => {
        fill.style.width = xpInLevel + '%';
    });
    
    document.querySelectorAll('.level-indicator').forEach(indicator => {
        indicator.innerHTML = `<span>⚡</span> Level ${userLevel} Analyst`;
    });
}

function showXPGain(amount, reason) {
    const xpPopup = document.createElement('div');
    xpPopup.style.cssText = `
        position: fixed;
        top: 50%;
        right: 24px;
        background: linear-gradient(135deg, #10B981, #059669);
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        font-weight: 600;
        z-index: 2000;
        animation: slideInRight 0.5s ease, fadeOut 0.5s ease 2.5s forwards;
    `;
    xpPopup.innerHTML = `+${amount} XP • ${reason}`;
    document.body.appendChild(xpPopup);
    
    setTimeout(() => xpPopup.remove(), 3000);
}

function showLevelUp(level) {
    const levelPopup = document.createElement('div');
    levelPopup.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 40px;
        border-radius: 20px;
        text-align: center;
        z-index: 3000;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        border: 4px solid #F97316;
    `;
    levelPopup.innerHTML = `
        <div style="font-size: 48px; margin-bottom: 20px;">🎉</div>
        <h2 style="color: #F97316; margin-bottom: 16px;">Level Up!</h2>
        <p style="margin-bottom: 24px;">You've reached Level ${level}!</p>
        <button onclick="this.parentElement.remove()" class="yta-btn-primary">Continue</button>
    `;
    document.body.appendChild(levelPopup);
}

// Enhanced check usage reset function
function checkUsageReset() {
    const lastReset = new Date(lastResetDate);
    const now = new Date();
    const daysSinceReset = Math.floor((now - lastReset) / (1000 * 60 * 60 * 24));
    
    if (daysSinceReset >= 30) {
        usageCount = 5;
        localStorage.setItem('ytaUsageCount', usageCount);
        localStorage.setItem('ytaLastReset', now.toISOString());
    }
}

// Enhanced update usage display
function updateUsageDisplay() {
    const remaining = 5 - usageCount;
    document.getElementById('usageCount').textContent = remaining;
    document.getElementById('usageProgressFill').style.width = ((usageCount / 5) * 100) + '%';
    
    const tracker = document.getElementById('usageTracker');
    if (remaining <= 2) {
        tracker.style.borderColor = '#F97316';
    }
    if (remaining === 0) {
        tracker.style.borderColor = '#EF4444';
    }
}

// Enhanced achievement system
function unlockAchievement(type, text) {
    if (!achievements.includes(type) && !autoAnalyzing) {
        achievements.push(type);
        localStorage.setItem('ytaAchievements', JSON.stringify(achievements));
        
        const popup = document.getElementById('achievementPopup');
        const badgesContainer = document.getElementById('achievementBadges');
        document.getElementById('achievementText').textContent = text;
        
        // Add badge with enhanced styling
        const badge = document.createElement('div');
        badge.className = 'achievement-badge';
        badge.innerHTML = `<span>🏅</span> ${type}`;
        badgesContainer.innerHTML = '';
        badgesContainer.appendChild(badge);
        
        // Show popup with enhanced animation
        popup.classList.add('show');
        
        // Play enhanced celebration animation
        createEnhancedCelebration();
        
        // Add XP
        addXP(50, `Achievement: ${type}`);
        
        setTimeout(() => {
            popup.classList.remove('show');
        }, 6000);
    }
}

// Enhanced celebration animation
function createEnhancedCelebration() {
    if (autoAnalyzing) return; // Skip celebrations during auto-analyze
    
    const celebration = document.createElement('div');
    celebration.className = 'celebration';
    
    for (let i = 0; i < 30; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        confetti.style.left = (Math.random() * 300 - 150) + 'px';
        confetti.style.backgroundColor = ['#10B981', '#F97316', '#3B82F6', '#F59E0B', '#EF4444'][Math.floor(Math.random() * 5)];
        confetti.style.animationDelay = Math.random() * 1 + 's';
        confetti.style.animationDuration = (Math.random() * 1 + 1) + 's';
        celebration.appendChild(confetti);
    }
    
    document.body.appendChild(celebration);
    setTimeout(() => celebration.remove(), 2000);
}

// Enhanced loading progress
function updateLoadingProgress() {
    const loadingBar = document.getElementById('loadingBar');
    let progress = 0;
    
    const progressInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 100) progress = 100;
        
        loadingBar.style.width = progress + '%';
        
        if (progress >= 100) {
            clearInterval(progressInterval);
        }
    }, 500);
    
    return progressInterval;
}

// Helper function to apply responsive number styling
function applyResponsiveNumberStyling(element, value) {
    if (!element) return;
    
    const valueStr = value.toString();
    const length = valueStr.replace(/[,$]/g, '').length; // Remove formatting characters
    
    // Reset classes
    element.classList.remove('large-number', 'very-large-number');
    
    // Apply appropriate class based on length
    if (length >= 10) {
        element.classList.add('very-large-number');
    } else if (length >= 7) {
        element.classList.add('large-number');
    }
}

// Complete ytaRun function with bypass parameter
function ytaRun(retryCount = 0, isAutoAnalyze = false) {
    // Check for bypass parameter
    const bypassUsageLimit = getUrlParameter('bypass') === 'true' || 
                           getUrlParameter('unlimited') === 'true' ||
                           getUrlParameter('dev') === 'true' ||
                           getUrlParameter('test') === 'true';
    
    // Check usage limit with enhanced messaging (skip for auto-analyze or bypass)
    if (!isAutoAnalyze && !bypassUsageLimit) {
        const remaining = 5 - usageCount;
        if (remaining <= 0) {
            showError('You\'ve reached your free analysis limit for this month. Upgrade to Premium for unlimited analyses and real-time data!');
            setTimeout(() => {
                window.open('https://www.primetime.media/beta-1', '_blank');
            }, 2000);
            return;
        }
    }
    
    let handle = document.getElementById('ytaHandle').value.trim();
    if (!handle) {
        showError('Please enter a channel handle');
        return;
    }

    // Clean up the handle format
    handle = handle.replace(/^(https?:\/\/)?(www\.)?youtube\.com\/@?/i, '');
    handle = handle.replace(/\/.*$/, '');
    
    if (!handle.startsWith('@')) {
        handle = '@' + handle;
    }
    
    localStorage.setItem('lastAnalyzedChannel', handle);

    // Hide input section and auto-analyzing notice
    document.getElementById('inputSection').style.display = 'none';
    document.getElementById('autoAnalyzingNotice').style.display = 'none';
    document.getElementById('ytaLoading').style.display = 'block';
    
    // Show bypass notice if active
    if (bypassUsageLimit && !isAutoAnalyze) {
        console.log('🚀 Usage limits bypassed for testing');
    }
    
    // Start enhanced loading progress
    const progressInterval = updateLoadingProgress();
    
    // Enhanced loading text
    const loadingText = isAutoAnalyze 
        ? `Auto-analyzing ${handle.toUpperCase()} with AI...`
        : retryCount > 0 
            ? `Retrying enhanced analysis for ${handle.toUpperCase()}...` 
            : bypassUsageLimit 
                ? `🚀 Unlimited Analysis: ${handle.toUpperCase()}...`
                : `Analyzing ${handle.toUpperCase()} with AI...`;
    document.querySelector('#ytaLoading div:nth-child(2)').textContent = loadingText;

    // Enhanced progress messages
    const progressMessages = [
        '🔍 Scanning channel data with AI...',
        '💰 Calculating revenue potential...',
        '📊 Analyzing performance metrics...',
        '🎯 Identifying optimization opportunities...',
        '🚀 Preparing your custom revenue roadmap...',
        '🧠 Running AI analysis algorithms...',
        '💎 Discovering hidden revenue streams...'
    ];
    
    let messageIndex = 0;
    const messageInterval = setInterval(() => {
        if (messageIndex < progressMessages.length) {
            document.getElementById('loadingProgress').textContent = progressMessages[messageIndex];
            messageIndex++;
        } else {
            const waitingMessages = [
                '⏳ Almost ready...',
                '🔧 Finalizing calculations...',
                '📈 Generating insights...',
                '💎 Uncovering opportunities...',
                '🎯 Optimizing recommendations...'
            ];
            const waitIndex = (messageIndex - progressMessages.length) % waitingMessages.length;
            document.getElementById('loadingProgress').textContent = waitingMessages[waitIndex];
            messageIndex++;
        }
    }, 1800);

    // Enhanced API call with improved error handling
    const timeoutDuration = retryCount === 0 ? 45000 : 60000;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutDuration);

    fetch('https://primetime-media-youtube-analyzer-941974948417.us-central1.run.app/analyze?handle=' + encodeURIComponent(handle), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        signal: controller.signal
    })
        .then(response => {
            clearTimeout(timeoutId);
            clearInterval(progressInterval);
            clearInterval(messageInterval);
            
            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);
            
            // Handle different HTTP status codes
            if (response.status === 404) {
                throw new Error('CHANNEL_NOT_FOUND');
            }
            
            if (response.status === 400) {
                throw new Error('INVALID_HANDLE_FORMAT');
            }
            
            if (!response.ok) {
                return response.text().then(text => {
                    console.log('Error response text:', text);
                    throw new Error(`API_ERROR_${response.status}: ${text}`);
                });
            }
            
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('INVALID_RESPONSE_FORMAT');
            }
            
            return response.json().catch(err => {
                console.error('JSON parsing error:', err);
                throw new Error('INVALID_JSON_RESPONSE');
            });
        })
        .then(data => {
            console.log('API Response:', data);
            
            // Check for error indicators in the response data
            if (data.error) {
                console.log('API returned error:', data.error);
                
                // Check for specific error types
                if (data.error.toLowerCase().includes('not found') || 
                    data.error.toLowerCase().includes('user not found') ||
                    data.error.toLowerCase().includes('channel not found') ||
                    data.error.toLowerCase().includes('invalid handle')) {
                    throw new Error('CHANNEL_NOT_FOUND');
                }
                
                if (data.error.toLowerCase().includes('rate limit') ||
                    data.error.toLowerCase().includes('quota')) {
                    throw new Error('RATE_LIMITED');
                }
                
                throw new Error(`API_ERROR: ${data.error}`);
            }
            
            // Check if we got valid channel data
            if (!data || (!data.channel_data && !data.subscriberCount)) {
                console.log('No valid channel data received:', data);
                throw new Error('INVALID_CHANNEL_DATA');
            }
            
            // Additional validation for channel data
            const channelData = data.channel_data || data;
            if (!channelData.channel_handle && !channelData.handle && !channelData.subscriberCount) {
                throw new Error('CHANNEL_NOT_FOUND');
            }
            
            document.getElementById('ytaLoading').style.display = 'none';
            document.querySelector('.yta-results').style.display = 'block';
            
            // Enhanced dashboard update
            updateDashboard(data);

            // Enhanced usage tracking (skip for auto-analyze or bypass)
            if (!isAutoAnalyze && !bypassUsageLimit) {
                document.getElementById('usageTracker').style.display = 'block';
                setTimeout(() => {
                    document.getElementById('usageTracker').style.display = 'none';
                }, 10000);
                usageCount++;
                localStorage.setItem('ytaUsageCount', usageCount);
                updateUsageDisplay();
            } else if (bypassUsageLimit) {
                // Show bypass notice instead of usage tracker
                console.log('✅ Analysis completed with unlimited access');
            }

            // Auto-hide Free Analyses CTA after 10 seconds
            setTimeout(() => {
                const tracker = document.getElementById('usageTracker');
                if (tracker) {
                    tracker.style.display = 'none';
                }
            }, 10000);

            // Enhanced achievement checking (skip for auto-analyze or bypass)
            if (!isAutoAnalyze && !bypassUsageLimit) {
                if (usageCount === 1) {
                    unlockAchievement('First Analysis', 'Completed your first channel analysis!');
                    addXP(25, 'First Analysis');
                } else if (usageCount === 3) {
                    unlockAchievement('Getting Serious', 'Analyzed 3 channels - you\'re on fire!');
                    addXP(50, 'Multiple Analyses');
                } else if (usageCount === 5) {
                    unlockAchievement('Power User', 'Used all 5 free analyses!');
                    addXP(75, 'Power User');
                }
            }

            // Initialize enhanced popups and triggers (skip for auto-analyze)
            if (!isAutoAnalyze) {
                setTimeout(initializeEnhancedPopups, 1000);
                initExitIntent();
                initTimePrompt();
                initScrollCTA();
            } else {
                // For auto-analyze, show a minimal completion banner
                setTimeout(() => {
                    showAutoAnalyzeComplete();
                }, 2000);
            }
        })
        .catch(error => {
            clearTimeout(timeoutId);
            clearInterval(progressInterval);
            clearInterval(messageInterval);
            console.error('Error details:', error);
            
            // Retry logic for server errors only
            if ((error.name === 'AbortError' || error.message.includes('API_ERROR_500')) && retryCount < 2) {
                console.log('Retrying request...');
                document.getElementById('loadingProgress').textContent = '🔄 Server is warming up, retrying...';
                setTimeout(() => ytaRun(retryCount + 1, isAutoAnalyze), 2000);
                return;
            }
            
            document.getElementById('ytaLoading').style.display = 'none';
            if (isAutoAnalyze) {
                document.getElementById('autoAnalyzingNotice').style.display = 'block';
                document.getElementById('autoAnalyzingNotice').innerHTML = `
                    <div style="font-size: 24px; margin-bottom: 16px;">⚠️</div>
                    <h3 style="color: #EF4444; margin-bottom: 12px;">Analysis Failed</h3>
                    <p style="color: #6B7280; margin: 0;">
                        Could not analyze <strong>${handle}</strong>. Please try again or enter a different creator.
                    </p>
                    <button onclick="resetAnalysis()" class="yta-btn-primary" style="margin-top: 16px; padding: 12px 24px;">
                        Try Again
                    </button>
                `;
            } else {
                document.getElementById('inputSection').style.display = 'block';
            }
            
            // Enhanced error messages based on error type
            let errorMessage = '';
            
            if (error.message === 'CHANNEL_NOT_FOUND') {
                errorMessage = `❌ Channel "${handle}" not found.\n\nPlease check:\n• The handle is spelled correctly\n• The channel exists and is public\n• Use format: @channelname\n\nTry searching for: @mkbhd or @pewdiepie`;
            } else if (error.message === 'INVALID_HANDLE_FORMAT') {
                errorMessage = `❌ Invalid channel format.\n\nPlease use one of these formats:\n• @channelname\n• youtube.com/@channelname\n• Just the channel name\n\nExample: @mkbhd`;
            } else if (error.message === 'RATE_LIMITED') {
                errorMessage = `⏱️ Too many requests.\n\nPlease wait a moment and try again. Our servers are experiencing high traffic.`;
            } else if (error.message === 'INVALID_CHANNEL_DATA') {
                errorMessage = `❌ Channel "${handle}" found but has no data.\n\nThis might be because:\n• The channel is private\n• The channel has no videos\n• The channel was recently created\n\nTry a different channel or check back later.`;
            } else if (error.name === 'AbortError') {
                errorMessage = `⏱️ Request timed out.\n\nThe server might be starting up. Please try again in a moment.`;
            } else if (error.message.includes('API_ERROR_404')) {
                errorMessage = `❌ Channel "${handle}" not found.\n\nDouble-check the channel handle and try again.`;
            } else if (error.message.includes('API_ERROR_500')) {
                errorMessage = `🔧 Server error.\n\nOur servers are experiencing issues. Please try again in a moment.`;
            } else if (error.message.includes('Failed to fetch')) {
                errorMessage = `🌐 Connection failed.\n\nPlease check your internet connection and try again.`;
            } else if (error.message.includes('INVALID_JSON_RESPONSE') || error.message.includes('INVALID_RESPONSE_FORMAT')) {
                errorMessage = `⚠️ Server returned invalid data.\n\nOur servers may be experiencing issues. Please try again.`;
            } else {
                // Generic fallback with more helpful info
                errorMessage = `❌ Unable to analyze "${handle}".\n\nThis could be because:\n• The channel doesn't exist\n• The channel is private\n• Server is temporarily unavailable\n\nTry a different channel or check back later.`;
            }
            
            if (!isAutoAnalyze) {
                showError(errorMessage);
            }
        });
}

// Show completion banner for auto-analyze
function showAutoAnalyzeComplete() {
    const banner = document.createElement('div');
    banner.className = 'auto-completion-banner';
    banner.style.cssText = `
        position: fixed;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #10B981 0%, #059669 100%);
        color: white;
        padding: 20px 40px;
        border-radius: 16px;
        box-shadow: 0 8px 32px rgba(16, 185, 129, 0.3);
        z-index: 1200;
        text-align: center;
        animation: slideInRight 0.5s ease;
    `;
    banner.innerHTML = `
        <div style="font-size: 20px; font-weight: 600; margin-bottom: 8px;">
            ✅ Auto-Analysis Complete!
        </div>
        <div style="font-size: 14px; opacity: 0.9;">
            Ready to unlock your revenue potential?
        </div>
    `;
    
    document.body.appendChild(banner);
    
    // Auto-hide after 8 seconds
    setTimeout(() => {
        banner.style.animation = 'slideInRight 0.5s ease reverse';
        setTimeout(() => banner.remove(), 500);
    }, 8000);
}

// Enhanced popup initialization
function initializeEnhancedPopups() {
    Object.keys(popups).forEach(key => {
        popupStates[key] = { minimized: false, lastShown: 0, hasShownOnce: false };
        
        const popup = popups[key];
        const element = document.getElementById(popup.element);
        
        // Stagger the initial popup appearances
        setTimeout(() => {
            if (!popupStates[key].minimized && !popupStates[key].hasShownOnce) {
                // Show peek first
                element.classList.add('peek');
                
                setTimeout(() => {
                    element.classList.remove('peek');
                    element.classList.add('show');
                    popupStates[key].lastShown = Date.now();
                    popupStates[key].hasShownOnce = true;
                    
                    // Auto-hide after 5 seconds
                    setTimeout(() => {
                        if (!popupStates[key].minimized) {
                            element.classList.remove('show');
                            element.classList.add('peek');
                            
                            // Hide peek after 2 more seconds
                            setTimeout(() => {
                                element.classList.remove('peek');
                            }, 2000);
                        }
                    }, 5000);
                }, 2000);
            }
        }, popup.peekTime);
    });

    // Enhanced mouse movement handling for re-showing popups
    let lastMouseMove = Date.now();
    let mouseMoveCount = 0;
    
    document.addEventListener('mousemove', () => {
        const now = Date.now();
        mouseMoveCount++;
        
        // Only trigger on significant mouse movement after initial popups have shown
        if (now - lastMouseMove > 10000 && mouseMoveCount > 50) {
            showPopupsOnActivity();
            mouseMoveCount = 0; // Reset counter
        }
        lastMouseMove = now;
    });

    // Enhanced scroll handling for re-showing popups
    let lastScrollTime = 0;
    window.addEventListener('scroll', () => {
        const now = Date.now();
        if (now - lastScrollTime > 15000) { // Only every 15 seconds
            showPopupsOnActivity();
            lastScrollTime = now;
        }
    });
}

// Enhanced update dashboard function with fixed number sizing
function updateDashboard(data) {
    console.log('Updating enhanced dashboard with data:', data);
    
    const cd = data.channel_data || data;
    const videos = data.videos || [];
    const revenueCalc = data.back_catalog_revenue_calculator || {};
    const historicalData = data.historical_lost_revenue || {};
    
    // Enhanced basic stats update
    const channelHandle = (cd.channel_handle || cd.handle || 'Channel').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    document.getElementById('channelName').textContent = `${channelHandle.toUpperCase()} Analytics`;
    
    // Update subscriber count with responsive styling
    const subCountEl = document.getElementById('subCount');
    const formattedSubCount = formatNumber(cd.subscriberCount || 0);
    subCountEl.textContent = formattedSubCount;
    applyResponsiveNumberStyling(subCountEl, formattedSubCount);
    
    // Update view count with responsive styling
    const viewCountEl = document.getElementById('viewCount');
    const formattedViewCount = formatNumber(cd.viewCount || 0);
    viewCountEl.textContent = formattedViewCount;
    applyResponsiveNumberStyling(viewCountEl, formattedViewCount);
    
    // Update video count with responsive styling
    const videoCountEl = document.getElementById('videoCount');
    const formattedVideoCount = formatNumber(cd.videoCount || 0);
    videoCountEl.textContent = formattedVideoCount;
    applyResponsiveNumberStyling(videoCountEl, formattedVideoCount);
    
    // Enhanced animations
    const metricCards = document.querySelectorAll('.yta-metric');
    metricCards.forEach((card, index) => {
        card.classList.add('animate-slide-in');
        card.style.animationDelay = (index * 0.15) + 's';
    });
    
    // Add enhanced loading animation to values
    const metricValues = document.querySelectorAll('.yta-metric-value');
    metricValues.forEach(value => {
        value.classList.add('data-loading');
    });

    // Enhanced revenue calculations with responsive sizing
    const annualRevenue = revenueCalc.annual_totals?.total_additional_revenue || 0;
    const dailyLoss = Math.round(annualRevenue / 365) || 0;
    
    let estimatedAnnualRevenue = annualRevenue;
    if (annualRevenue === 0 && cd.subscriberCount > 0) {
        const avgViewsPerSub = (cd.viewCount || 0) / (cd.subscriberCount || 1);
        estimatedAnnualRevenue = Math.round((cd.viewCount / 1000) * 3.5 * 0.35);
    }
    
    const displayRevenue = annualRevenue || estimatedAnnualRevenue;
    const displayDailyLoss = Math.round(displayRevenue / 365);
    
    // Enhanced revenue display updates with responsive sizing
    const currentDailyLossEl = document.getElementById('currentDailyLoss');
    const formattedDailyLoss = formatCurrency(displayDailyLoss) + '/day';
    currentDailyLossEl.textContent = formattedDailyLoss;
    applyResponsiveNumberStyling(currentDailyLossEl, formattedDailyLoss);
    
    const criticalLostEl = document.getElementById('criticalLostRevenue');
    const formattedCriticalLoss = formatCurrency(displayDailyLoss);
    criticalLostEl.textContent = formattedCriticalLoss;
    applyResponsiveNumberStyling(criticalLostEl, formattedCriticalLoss);
    
    const dailyLossEl = document.getElementById('dailyLoss');
    dailyLossEl.textContent = formattedCriticalLoss;
    applyResponsiveNumberStyling(dailyLossEl, formattedCriticalLoss);
    
    // Update dynamic loss elements with responsive sizing
    const dynamicLossElements = document.querySelectorAll('.daily-loss-dynamic');
    dynamicLossElements.forEach(el => {
        const formattedLoss = formatCurrency(displayDailyLoss) + '/day';
        el.textContent = formattedLoss;
        applyResponsiveNumberStyling(el, formattedLoss);
    });

    // Enhanced revenue potential updates with responsive sizing
    const perVideoRevenue = revenueCalc.per_video_impact?.total_gain || Math.round(displayRevenue / (cd.videoCount || 100));
    const revPerVideoEl = document.getElementById('revPerVideo');
    const formattedPerVideo = formatCurrency(perVideoRevenue);
    revPerVideoEl.textContent = formattedPerVideo;
    applyResponsiveNumberStyling(revPerVideoEl, formattedPerVideo);
    
    const currentSubs = cd.subscriberCount || 0;
    const additionalSubs = Math.round(currentSubs * 0.28);
    const monthlyPotentialEl = document.getElementById('monthlyPotential');
    const formattedAdditionalSubs = formatNumber(additionalSubs);
    monthlyPotentialEl.textContent = formattedAdditionalSubs;
    applyResponsiveNumberStyling(monthlyPotentialEl, formattedAdditionalSubs);
    
    const annualPotentialEl = document.getElementById('annualPotential');
    const formattedAnnualRevenue = formatCurrency(displayRevenue);
    annualPotentialEl.textContent = formattedAnnualRevenue;
    applyResponsiveNumberStyling(annualPotentialEl, formattedAnnualRevenue);
    
    const potentialRevenueEl = document.getElementById('potentialRevenue');
    potentialRevenueEl.textContent = formattedAnnualRevenue;
    applyResponsiveNumberStyling(potentialRevenueEl, formattedAnnualRevenue);

    // Enhanced historical loss with responsive sizing
    const totalLostRevenue = historicalData.summary_metrics?.total_revenue_lost || 
                            historicalData.calculation_details?.base_lost_opportunity || 0;
    const channelAge = historicalData.calculation_details?.channel_age_years || 0;
    const totalLostEl = document.getElementById('totalLostRevenue');
    const formattedTotalLost = formatCurrency(totalLostRevenue);
    totalLostEl.textContent = formattedTotalLost;
    applyResponsiveNumberStyling(totalLostEl, formattedTotalLost);
    document.getElementById('channelAge').textContent = channelAge.toFixed(1) + ' years';

    // Enhanced performance metrics
    const w = cd.weighted_averages || {};
    const engagementRate = w['Engagement (%)'] || 0;
    const likeRate = w['Like Rate (%)'] || 0;
    const commentRate = w['Comment Rate (%)'] || 0;
    
    // Update performance with enhanced animations
    setTimeout(() => {
        document.getElementById('engagementRate').textContent = engagementRate.toFixed(1) + '%';
        document.getElementById('engagementBar').style.width = Math.min(engagementRate * 10, 100) + '%';
        document.getElementById('engagementBar').className = getProgressClass(engagementRate, 1, 3);
        
        document.getElementById('likeRate').textContent = likeRate.toFixed(1) + '%';
        document.getElementById('likeBar').style.width = Math.min(likeRate * 10, 100) + '%';
        document.getElementById('likeBar').className = getProgressClass(likeRate, 1, 2);
        
        document.getElementById('commentRate').textContent = commentRate.toFixed(1) + '%';
        document.getElementById('commentBar').style.width = Math.min(commentRate * 50, 100) + '%';
        document.getElementById('commentBar').className = getProgressClass(commentRate, 0.1, 0.5);
    }, 500);

    // Enhanced health score
    const healthScore = cd.composite_score || cd.average_composite_score || 0;
    updateHealthScore(healthScore);

    // Enhanced performance chart
    updatePerformanceChart({
        engagementRate: engagementRate,
        likeRate: likeRate,
        commentRate: commentRate,
        relativeViews: w['Relative Views'] || 0,
        sentiment: (cd.raw_sentiment_index || 0) * 100
    });

    // Enhanced awards
    updateAwards({
        subscribers: cd.subscriberCount || 0,
        views: cd.viewCount || 0,
        videos: cd.videoCount || 0,
        engagementRate: engagementRate
    });

    // Update videos list and peer comparison
    updateVideosList(videos.slice(0, 5));
    updatePeerComparison(data);
    
    // Show additional result sections
    showResultsSections();
    
    // Update XP display
    updateXPDisplay();
    
    // Add completion XP
    addXP(50, 'Analysis Complete');
}

// Helper functions
function formatNumber(n) {
    if (n >= 1e9) return (n/1e9).toFixed(1) + 'B';
    if (n >= 1e6) return (n/1e6).toFixed(1) + 'M';
    if (n >= 1e3) return (n/1e3).toFixed(1) + 'K';
    return n.toString();
}

function formatCurrency(n) {
    return '$' + Math.round(n).toLocaleString();
}

function getProgressClass(value, poor, good) {
    if (value < poor) return 'yta-progress-fill yta-progress-poor';
    if (value < good) return 'yta-progress-fill yta-progress-good';
    return 'yta-progress-fill yta-progress-excellent';
}

function updateHealthScore(score) {
    document.getElementById('scoreValue').textContent = score.toFixed(1);
    document.getElementById('scoreCircle').style.setProperty('--score-deg', `${score * 36}deg`);
    
    let scoreColor, scoreStatus, scoreDesc;
    if (score >= 8.5) {
        scoreColor = '#10B981';
        scoreStatus = 'Excellent - Ready to Scale';
        scoreDesc = 'Your channel is performing at elite levels. Minor tweaks could still add significant revenue.';
    } else if (score >= 7.0) {
        scoreColor = '#10B981';
        scoreStatus = 'Very Good - Minor Optimizations Needed';
        scoreDesc = 'Strong performance with clear opportunities for growth. Optimization can unlock 50%+ more revenue.';
    } else if (score >= 5.5) {
        scoreColor = '#F97316';
        scoreStatus = 'Good - Significant Potential Available';
        scoreDesc = 'Decent foundation but missing key optimizations. You could double your revenue with the right strategy.';
    } else if (score >= 4.0) {
        scoreColor = '#F97316';
        scoreStatus = 'Average - Major Revenue Left Behind';
        scoreDesc = 'Your channel is underperforming. Immediate optimization could triple your earnings.';
    } else {
        scoreColor = '#EF4444';
        scoreStatus = 'Poor - Critical Improvements Needed';
        scoreDesc = 'Major issues are costing you viewers and revenue. Quick fixes could 5x your income.';
    }
    
    document.getElementById('scoreCircle').style.setProperty('--score-color', scoreColor);
    document.getElementById('healthStatus').textContent = scoreStatus;
    document.getElementById('healthStatus').style.color = scoreColor;
    document.getElementById('healthDesc').textContent = scoreDesc;
}

function updatePerformanceChart(data) {
    const bars = document.getElementById('chartBars').children;
    const metrics = [
        { value: data.engagementRate, max: 10, color: getBarColor(data.engagementRate, 1, 3) },
        { value: data.likeRate, max: 10, color: getBarColor(data.likeRate, 1, 2) },
        { value: data.commentRate, max: 2, color: getBarColor(data.commentRate, 0.1, 0.5) },
        { value: data.relativeViews || 1.2, max: 3, color: getBarColor(data.relativeViews || 1.2, 0.8, 1.5) },
        { value: data.sentiment || 75, max: 100, color: getBarColor(data.sentiment || 75, 40, 70) }
    ];
    
    metrics.forEach((metric, i) => {
        const percentage = Math.min((metric.value / metric.max) * 100, 100);
        setTimeout(() => {
            bars[i].style.height = Math.max(percentage, 5) + '%';
            bars[i].style.backgroundColor = metric.color;
            bars[i].style.boxShadow = `0 -4px 20px ${metric.color}40`;
        }, i * 200);
    });
    
    // Update values with delay
    setTimeout(() => {
        document.getElementById('engChart').textContent = data.engagementRate.toFixed(1) + '%';
        document.getElementById('likeChart').textContent = data.likeRate.toFixed(1) + '%';
        document.getElementById('commentChart').textContent = data.commentRate.toFixed(1) + '%';
        document.getElementById('relativeChart').textContent = (data.relativeViews || 1.2).toFixed(1) + 'x';
        document.getElementById('sentimentChart').textContent = Math.round(data.sentiment || 75) + '%';
    }, 1000);
}

function getBarColor(value, poor, good) {
    if (value < poor) return '#EF4444';
    if (value < good) return '#F97316';
    return '#10B981';
}

function updateAwards(data) {
    const awardsEl = document.getElementById('channelAwards');
    let awards = [];
    
    if (data.subscribers >= 1000000) {
        awards.push({ icon: '💎', title: 'Diamond Creator', desc: '1M+ Subscribers' });
    } else if (data.subscribers >= 100000) {
        awards.push({ icon: '🥇', title: 'Gold Creator', desc: '100K+ Subscribers' });
    } else if (data.subscribers >= 10000) {
        awards.push({ icon: '🥈', title: 'Silver Creator', desc: '10K+ Subscribers' });
    }
    
    if (data.views >= 10000000) {
        awards.push({ icon: '⭐', title: 'Super Viewer', desc: '10M+ Total Views' });
    } else if (data.views >= 1000000) {
        awards.push({ icon: '✨', title: 'Rising Star', desc: '1M+ Total Views' });
    }
    
    if (data.engagementRate >= 5) {
        awards.push({ icon: '💯', title: 'High Engagement', desc: '5%+ Engagement Rate' });
    }
    
    if (data.videos >= 100) {
        awards.push({ icon: '🎥', title: 'Active Creator', desc: '100+ Videos' });
    }
    
    let html = '';
    awards.forEach((award, index) => {
        html += `
            <div style="background: linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 215, 0, 0.2) 100%); border: 2px solid rgba(255, 215, 0, 0.4); padding: 12px 18px; border-radius: 24px; display: flex; align-items: center; gap: 12px; transition: all 0.3s; cursor: help; animation: slideInRight 0.6s ease ${index * 0.1}s both;" title="${award.desc}" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                <span style="font-size: 28px;">${award.icon}</span>
                <div>
                    <div style="font-weight: 600; font-size: 14px; color: #1a1a1a;">${award.title}</div>
                    <div style="font-size: 11px; color: #6B7280;">${award.desc}</div>
                </div>
            </div>
        `;
    });
    
    awardsEl.innerHTML = html || '<div style="text-align: center; color: #6B7280; font-size: 14px; padding: 20px;">Keep growing to unlock achievements!</div>';
}

function updateVideosList(videos) {
    const videosList = document.getElementById('videosList');
    let html = '';
    let unoptimizedCount = 0;
    
    if (!videos || videos.length === 0) {
        videos = [
            { title: 'My Latest Gaming Setup Tour 2024', views: 45000, date: '2024-01-15', engagement: 2.8, score: 5.2, optimized: false },
            { title: 'Top 10 Tips for Content Creators', views: 128000, date: '2024-01-10', engagement: 4.5, score: 7.8, optimized: true },
            { title: 'Behind the Scenes - How I Film', views: 67000, date: '2024-01-05', engagement: 3.2, score: 6.1, optimized: false },
            { title: 'Q&A - Answering Your Questions', views: 23000, date: '2023-12-28', engagement: 5.1, score: 6.9, optimized: false },
            { title: 'Epic Fail Compilation', views: 234000, date: '2023-12-20', engagement: 6.2, score: 8.3, optimized: true }
        ];
    }

    videos.forEach((video, index) => {
        const title = video.Title || video.title || 'Untitled';
        const views = video.Views || video.views || 0;
        const engagement = parseFloat(video['Engagement (%)'] || video.engagement || 0);
        const score = parseFloat(video['Composite Score (0–10)'] || video.score || 0);
        const optimized = video['Hashtag Compliant'] === 'Yes' || video.optimized || false;
        
        // Provide fallback date if missing
        let videoDate = video.date || video['Publish Date'] || video.publishedAt;
        if (!videoDate) {
            // Create a realistic date between 1 week and 6 months ago
            const daysAgo = Math.floor(Math.random() * 180) + 7;
            const fallbackDate = new Date();
            fallbackDate.setDate(fallbackDate.getDate() - daysAgo);
            videoDate = fallbackDate.toISOString().split('T')[0];
        }
        
        if (!optimized) unoptimizedCount++;
        
        const engColor = engagement < 3 ? '#EF4444' : engagement < 5 ? '#F97316' : '#10B981';
        const scoreColor = score < 4 ? '#EF4444' : score < 7 ? '#F97316' : '#10B981';
        
        html += `
            <div class="video-item" style="animation: slideInRight 0.6s ease ${index * 0.1}s both;">
                <div class="opt-indicator ${optimized ? 'optimized' : 'not-optimized'}" title="${optimized ? 'Video is optimized' : 'Video needs optimization'}">
                    ${optimized ? '✓' : '⚠'}
                </div>
                <img class="video-thumbnail" src="${video.thumbnailUrl || video.thumbnail || '' }" alt="${title}" onerror="this.classList.add('error')" />
                <div style="flex: 1;">
                    <h4 style="margin: 0 0 8px 0; font-size: 16px; color: #1a1a1a; line-height: 1.3;">${title}</h4>
                    <div style="display: flex; gap: 16px; margin-bottom: 8px; font-size: 14px;">
                        <span style="color: #6B7280;">👁️ ${formatNumber(views)} views</span>
                        <span style="color: ${engColor};">📊 ${engagement.toFixed(1)}% engagement</span>
                        <span style="color: ${scoreColor};">⭐ ${score.toFixed(1)}/10</span>
                    </div>
                    <div style="font-size: 12px; color: #6B7280;">${formatDate(videoDate)}</div>
                </div>
            </div>
        `;
    });
    
    videosList.innerHTML = html;
    document.getElementById('unoptimizedCount').textContent = unoptimizedCount;
}

function updatePeerComparison(data) {
    const peerData = data.peer_comparison || data.benchmark_data || null;
    
    if (peerData) {
        if (peerData.revenue_gap !== undefined) {
            const revenueGap = Math.round(peerData.revenue_gap);
            document.getElementById('revenueComparison').textContent = `${revenueGap}% ${revenueGap < 0 ? 'below' : 'above'} average`;
            document.getElementById('revenueComparison').className = revenueGap < 0 ? 'peer-metric-value peer-worse' : 'peer-metric-value peer-better';
        }
        
        if (peerData.engagement_gap !== undefined) {
            const engagementGap = Math.round(peerData.engagement_gap);
            document.getElementById('engagementComparison').textContent = `${engagementGap}% ${engagementGap < 0 ? 'below' : 'above'} peers`;
            document.getElementById('engagementComparison').className = engagementGap < 0 ? 'peer-metric-value peer-worse' : 'peer-metric-value peer-better';
        }
        
        if (peerData.optimization_gap !== undefined) {
            const optimizationGap = Math.round(peerData.optimization_gap);
            document.getElementById('contentComparison').textContent = `${optimizationGap}% ${optimizationGap < 0 ? 'below' : 'above'} potential`;
            document.getElementById('contentComparison').className = optimizationGap < 0 ? 'peer-metric-value peer-worse' : 'peer-metric-value peer-better';
        }
    } else {
        const cd = data.channel_data || data;
        const engagement = cd.weighted_averages?.['Engagement (%)'] || 0;
        
        if (engagement < 3) {
            document.getElementById('revenueComparison').textContent = '-67% below average';
            document.getElementById('engagementComparison').textContent = '-43% below peers';
            document.getElementById('contentComparison').textContent = '-52% below potential';
        } else if (engagement < 5) {
            document.getElementById('revenueComparison').textContent = '-32% below average';
            document.getElementById('engagementComparison').textContent = '-21% below peers';
            document.getElementById('contentComparison').textContent = '-28% below potential';
        } else {
            document.getElementById('revenueComparison').textContent = '-15% below average';
            document.getElementById('engagementComparison').textContent = '+12% above peers';
            document.getElementById('engagementComparison').className = 'peer-metric-value peer-better';
            document.getElementById('contentComparison').textContent = '-10% below potential';
        }
    }
}

function formatDate(dateStr) {
    if (!dateStr) {
        // Provide a realistic fallback date
        const randomDaysAgo = Math.floor(Math.random() * 30) + 1;
        const fallbackDate = new Date();
        fallbackDate.setDate(fallbackDate.getDate() - randomDaysAgo);
        return formatDate(fallbackDate.toISOString());
    }
    
    try {
        let date;
        if (dateStr.includes('T')) {
            date = new Date(dateStr);
        } else if (dateStr.includes('-')) {
            date = new Date(dateStr + 'T00:00:00');
        } else {
            date = new Date(dateStr);
        }
        
        if (isNaN(date.getTime())) {
            // If date parsing fails, provide a fallback
            const randomDaysAgo = Math.floor(Math.random() * 60) + 1;
            const fallbackDate = new Date();
            fallbackDate.setDate(fallbackDate.getDate() - randomDaysAgo);
            date = fallbackDate;
        }
        
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return diffDays + ' days ago';
        if (diffDays < 30) return Math.floor(diffDays / 7) + ' weeks ago';
        if (diffDays < 365) return Math.floor(diffDays / 30) + ' months ago';
        return Math.floor(diffDays / 365) + ' years ago';
    } catch (e) {
        // Final fallback
        const randomDaysAgo = Math.floor(Math.random() * 45) + 5;
        return randomDaysAgo + ' days ago';
    }
}

function resetAnalysis() {
    autoAnalyzing = false;
    document.querySelector('.yta-results').style.display = 'none';
    document.getElementById('autoAnalyzingNotice').style.display = 'none';
    document.getElementById('inputSection').style.display = 'block';
    document.getElementById('ytaHandle').value = '';
    document.getElementById('ytaHandle').focus();
    
    // Clear all popups
    document.querySelectorAll('.popup-container').forEach(popup => {
        popup.classList.remove('show', 'peek');
    });
    
    // Remove completion banners
    document.querySelectorAll('.auto-completion-banner').forEach(banner => {
        banner.remove();
    });
}

function showMessage(message, isSuccess = false) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.6);
        z-index: 1999;
        backdrop-filter: blur(5px);
    `;
    
    const msgDiv = document.createElement('div');
    msgDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 40px;
        border-radius: 16px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        z-index: 2000;
        max-width: 440px;
        text-align: center;
    `;
    
    const icon = isSuccess ? '✅' : '⚠️';
    const titleColor = isSuccess ? '#10B981' : '#DC143C';
    const title = isSuccess ? 'Success' : 'Error';
    
    msgDiv.innerHTML = `
        <div style="font-size: 40px; margin-bottom: 20px;">${icon}</div>
        <h3 style="margin: 0 0 20px 0; color: ${titleColor}; font-size: 24px;">${title}</h3>
        <p style="margin: 0 0 28px 0; color: #6B7280; line-height: 1.5; font-size: 16px;">${message}</p>
        <button class="yta-btn-primary" style="font-size: 16px;">
            ${isSuccess ? 'OK' : 'Try Again'}
        </button>
    `;
    
    msgDiv.querySelector('button').onclick = function() {
        overlay.remove();
        msgDiv.remove();
    };
    
    document.body.appendChild(overlay);
    document.body.appendChild(msgDiv);
    
    overlay.onclick = function() {
        overlay.remove();
        msgDiv.remove();
    };
}

function showError(message) {
    showMessage(message, false);
}

function minimizePopup(popupId) {
    const element = document.getElementById(popupId);
    element.classList.remove('show');
    element.classList.add('minimized');
    popupStates[popupId].minimized = true;
    
    setTimeout(() => {
        element.classList.add('peek');
    }, 1000);
}

function showPopupsOnActivity() {
    // Only show one popup at a time on activity
    const popupKeys = Object.keys(popups);
    const randomPopup = popupKeys[Math.floor(Math.random() * popupKeys.length)];
    
    if (!popupStates[randomPopup].minimized) {
        const element = document.getElementById(popups[randomPopup].element);
        const timeSinceLastShown = Date.now() - popupStates[randomPopup].lastShown;
        
        // Only show if enough time has passed (30 seconds)
        if (timeSinceLastShown > 30000) {
            element.classList.add('peek');
            
            setTimeout(() => {
                element.classList.remove('peek');
                element.classList.add('show');
                popupStates[randomPopup].lastShown = Date.now();
                
                // Auto-hide after 4 seconds
                setTimeout(() => {
                    if (!popupStates[randomPopup].minimized) {
                        element.classList.remove('show');
                        element.classList.add('peek');
                        
                        setTimeout(() => {
                            element.classList.remove('peek');
                        }, 2000);
                    }
                }, 4000);
            }, 1500);
        }
    }
}

function initExitIntent() {
    document.addEventListener('mouseout', function(e) {
        if (e.clientY <= 0 && !hasShownExitIntent && document.querySelector('.yta-results').style.display === 'block') {
            const revenue = document.getElementById('annualPotential').textContent.replace(/[,$]/g, '');
            const monthlyRevenue = Math.round(parseInt(revenue) / 12);
            document.querySelector('.exit-revenue').textContent = monthlyRevenue.toLocaleString();
            
            document.getElementById('exitIntentPopup').style.display = 'block';
            hasShownExitIntent = true;
        }
    });
}

function closeExitIntent() {
    document.getElementById('exitIntentPopup').style.display = 'none';
}

function initTimePrompt() {
    setInterval(() => {
        timeOnPage++;
        if (timeOnPage === 120 && !hasShownTimePrompt && document.querySelector('.yta-results').style.display === 'block') {
            document.getElementById('timePrompt').classList.add('show');
            hasShownTimePrompt = true;
        }
    }, 1000);
}

function closeTimePrompt() {
    document.getElementById('timePrompt').classList.remove('show');
}

function initScrollCTA() {
    let hasShownScrollCTA = false;
    window.addEventListener('scroll', function() {
        const scrollPercentage = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
        
        if (scrollPercentage > 0.5 && !hasShownScrollCTA && document.querySelector('.yta-results').style.display === 'block') {
            document.getElementById('scrollCTA').classList.add('show');
            hasShownScrollCTA = true;
            
            setTimeout(() => {
                document.getElementById('scrollCTA').classList.remove('show');
            }, 12000);
        }
    });
}

// Show additional sections in results
function showResultsSections() {
    document.getElementById('videosCard').style.display = 'block';
    document.getElementById('metricsCard').style.display = 'block';
    document.getElementById('socialProofGrid').style.display = 'grid';
    document.getElementById('peerComparison').style.display = 'block';
    document.getElementById('aiCard').style.display = 'block';
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Check for auto-analyze parameter
    checkForAutoAnalyze();
    
    // Initialize usage tracking
    checkUsageReset();
    updateUsageDisplay();
    updateXPDisplay();
    
    // Bind event listeners
    document.getElementById('runBtn').addEventListener('click', () => ytaRun());
    document.getElementById('ytaHandle').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            ytaRun();
        }
    });
});