// YouTube Analytics Dashboard - Complete Version
// This is the FULL dashboard matching your original design exactly

(function() {
    'use strict';

    // Configuration
    const YTA_CONFIG = {
        baseUrl: 'http://127.0.0.1:5001',
        timeout: 30000,
        conversionOptimizations: {
            urgencyMultiplier: 1.5,
            socialProofInterval: 45000,
            behavioralTriggerDelay: 30000,
            achievementThresholds: {
                firstAnalysis: true,
                viewedRevenue: true,
                exploredAI: true,
                usedCalculator: true
            }
        },
        brandColors: {
            primary: '#1E40AF',
            primaryLight: '#3B82F6',
            success: '#10B981',
            warning: '#F97316',
            warningDark: '#EA580C',
            danger: '#EF4444',
            text: '#1a1a1a',
            textSecondary: '#4B5563',
            textMuted: '#6B7280'
        }
    };

    // Session tracking
    const YTA_SESSION = {
        id: 'yta_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        startTime: Date.now(),
        actions: [],
        featureUsage: {},
        conversionTriggers: {
            revenueViewed: false,
            lostRevenueShocked: false,
            aiInsightsReviewed: false,
            calculatorUsed: false
        },
        shownDeepEngagement: false,
        shownProgress: false,
        lastAction: null,
        userSegment: null,
        revenueMultiplier: 1.5
    };

    // Main Dashboard Class
    class YouTubeAnalyticsDashboard {
        constructor(rootId = 'dashboard-root') {
            this.root = document.getElementById(rootId);
            if (!this.root) {
                console.error('Root element not found:', rootId);
                return;
            }
            
            this.init();
        }

        init() {
            this.injectStyles();
            this.buildCompleteHTML();
            this.initializeAllFunctions();
            this.startBackgroundProcesses();
        }

        injectStyles() {
            const styles = `
                /* Reset and Base Styles */
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                body {
                    background: #ffffff;
                    color: #1a1a1a;
                    font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    line-height: 1.6;
                    font-size: 16px;
                }

                /* Container */
                .yta-container {
                    background: #ffffff;
                    color: #1a1a1a;
                    padding: 20px;
                    width: 100%;
                    max-width: 1200px;
                    margin: 0 auto;
                    position: relative;
                }

                /* Critical Metrics Banner */
                .critical-metrics-banner {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    background: linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%);
                    padding: 16px 20px;
                    z-index: 1000;
                    box-shadow: 0 2px 20px rgba(30, 64, 175, 0.15);
                    display: none;
                    animation: slideDown 0.5s ease;
                    color: white;
                }

                .critical-metrics-banner.show {
                    display: block;
                }

                @keyframes slideDown {
                    from { transform: translateY(-100%); }
                    to { transform: translateY(0); }
                }

                .critical-metrics-content {
                    max-width: 1200px;
                    margin: 0 auto;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 30px;
                    flex-wrap: wrap;
                }

                .critical-metric-value {
                    font-size: 32px;
                    font-weight: 800;
                    text-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }

                /* Primary CTA Button */
                .yta-btn-primary {
                    background: #F97316;
                    color: white;
                    border: none;
                    padding: 16px 32px;
                    font-size: 18px;
                    font-weight: 600;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                    box-shadow: 0 4px 6px rgba(249, 115, 22, 0.25);
                    font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }

                .yta-btn-primary:hover {
                    background: #EA580C;
                    transform: translateY(-2px);
                    box-shadow: 0 6px 12px rgba(249, 115, 22, 0.35);
                }

                /* Secondary Button Style */
                .yta-btn-secondary {
                    background: #E5E7EB;
                    color: #1a1a1a;
                    border: none;
                    padding: 12px 24px;
                    font-size: 14px;
                    font-weight: 600;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .yta-btn-secondary:hover {
                    background: #D1D5DB;
                    transform: translateY(-1px);
                }

                /* Header Section */
                .yta-header {
                    text-align: center;
                    padding: 60px 20px 40px;
                    margin-bottom: 40px;
                    position: relative;
                    background: linear-gradient(135deg, #EBF4FF 0%, #F0F9FF 100%);
                    border-radius: 16px;
                }

                /* Trust Badge */
                .trust-badge {
                    background: #10B981;
                    color: white;
                    padding: 8px 20px;
                    border-radius: 20px;
                    display: inline-block;
                    margin-bottom: 20px;
                    font-weight: 600;
                    font-size: 14px;
                }

                .value-proposition {
                    max-width: 800px;
                    margin: 0 auto;
                }

                .value-headline {
                    font-size: 36px;
                    font-weight: 800;
                    margin-bottom: 16px;
                    color: #1E40AF;
                    line-height: 1.2;
                }

                .value-subtitle {
                    font-size: 20px;
                    color: #4B5563;
                    margin-bottom: 30px;
                    line-height: 1.5;
                }

                /* Trust Indicators */
                .trust-indicators {
                    display: flex;
                    justify-content: center;
                    gap: 30px;
                    margin: 30px 0;
                    flex-wrap: wrap;
                }

                .trust-indicator {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 14px;
                    color: #6B7280;
                }

                .trust-indicator-icon {
                    color: #10B981;
                    font-size: 18px;
                }

                /* Usage Limits */
                .usage-limits {
                    position: fixed;
                    top: 80px;
                    right: 20px;
                    background: white;
                    border: 1px solid #E5E7EB;
                    border-radius: 12px;
                    padding: 24px;
                    width: 300px;
                    z-index: 999;
                    display: none;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
                }

                .usage-limits.show {
                    display: block;
                }

                .usage-limit-header {
                    display: flex;
                    justify-content: space-between;
                    font-size: 13px;
                    margin-bottom: 6px;
                    color: #4B5563;
                }

                .usage-limit-bar {
                    height: 6px;
                    background: #E5E7EB;
                    border-radius: 3px;
                    overflow: hidden;
                }

                .usage-limit-fill {
                    height: 100%;
                    border-radius: 3px;
                    transition: width 0.5s ease;
                }

                .usage-limit-low { background: #10B981; }
                .usage-limit-medium { background: #F97316; }
                .usage-limit-high { background: #EF4444; }

                /* Daily Streak */
                .daily-streak {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: white;
                    border: 2px solid #F97316;
                    padding: 12px 20px;
                    border-radius: 25px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 14px;
                    z-index: 850;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
                    color: #1a1a1a;
                }

                .daily-streak:hover {
                    transform: scale(1.05);
                    box-shadow: 0 6px 12px rgba(249, 115, 22, 0.15);
                }

                .streak-fire {
                    font-size: 20px;
                    animation: flame 1s ease-in-out infinite;
                }

                @keyframes flame {
                    0%, 100% { transform: scale(1) rotate(-5deg); }
                    50% { transform: scale(1.2) rotate(5deg); }
                }

                /* Input Section */
                .yta-input-section {
                    text-align: center;
                    padding: 40px 20px;
                    margin-bottom: 40px;
                    background: #F9FAFB;
                    border-radius: 16px;
                    border: 1px solid #E5E7EB;
                }

                .yta-input {
                    width: 100%;
                    max-width: 500px;
                    margin: 0 auto 24px;
                    padding: 16px 24px;
                    background: white;
                    border: 2px solid #E5E7EB;
                    border-radius: 8px;
                    color: #1a1a1a;
                    font-size: 16px;
                    text-align: center;
                    transition: all 0.3s ease;
                    font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }

                .yta-input:focus {
                    outline: none;
                    border-color: #3B82F6;
                    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
                }

                /* Loading State */
                .yta-loading {
                    text-align: center;
                    padding: 60px;
                    background: #F9FAFB;
                    border-radius: 16px;
                    margin: 20px 0;
                    display: none;
                    border: 1px solid #E5E7EB;
                }

                .yta-spinner {
                    width: 48px;
                    height: 48px;
                    border: 3px solid #E5E7EB;
                    border-top-color: #3B82F6;
                    border-radius: 50%;
                    animation: yta-spin 0.8s linear infinite;
                    margin: 0 auto 20px;
                }

                @keyframes yta-spin {
                    to { transform: rotate(360deg); }
                }

                /* Results Section */
                .yta-results {
                    display: none;
                }

                /* Channel Info Card */
                .yta-channel {
                    background: linear-gradient(135deg, #EBF4FF 0%, #F0F9FF 100%);
                    border-radius: 16px;
                    padding: 40px;
                    margin-bottom: 40px;
                    text-align: center;
                    border: 1px solid #DBEAFE;
                    position: relative;
                    overflow: hidden;
                }

                /* Optimization Metrics Card */
                .yta-opt {
                    background: white;
                    border: 2px solid #F97316;
                    border-radius: 16px;
                    padding: 40px;
                    margin-bottom: 40px;
                    position: relative;
                    box-shadow: 0 4px 6px rgba(249, 115, 22, 0.05);
                }

                .yta-opt-header {
                    font-size: 28px;
                    font-weight: 700;
                    margin-bottom: 30px;
                    text-align: center;
                    color: #1E40AF;
                }

                /* Metric Cards */
                .yta-metric {
                    text-align: center;
                    padding: 24px;
                    background: #F9FAFB;
                    border-radius: 12px;
                    border: 1px solid #E5E7EB;
                    transition: all 0.3s ease;
                    position: relative;
                    cursor: help;
                }

                .yta-metric:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
                    border-color: #3B82F6;
                }

                .yta-metric-label {
                    font-size: 12px;
                    color: #6B7280;
                    margin-bottom: 8px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    font-weight: 600;
                }

                .yta-metric-value {
                    font-size: 32px;
                    font-weight: 700;
                    color: #1E40AF;
                }

                /* Annual Revenue Metric - Special Styling */
                .annual-revenue-metric {
                    background: linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%);
                    border: 2px solid #F97316;
                    transform: scale(1.05);
                }

                .annual-revenue-metric .yta-metric-value {
                    color: #F97316;
                    font-size: 40px;
                }

                /* Grid Layouts */
                .yta-opt-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                    gap: 20px;
                    margin-bottom: 20px;
                }

                .yta-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 30px;
                    margin-bottom: 30px;
                }

                /* Cards and Sections */
                .yta-card {
                    background: white;
                    border-radius: 12px;
                    padding: 32px;
                    border: 1px solid #E5E7EB;
                    transition: all 0.3s ease;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
                }

                .yta-card:hover {
                    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
                }

                .yta-card h3 {
                    font-size: 20px;
                    font-weight: 700;
                    margin-bottom: 24px;
                    color: #1a1a1a;
                }

                /* Alert Box */
                .yta-alert {
                    display: flex;
                    gap: 20px;
                    padding: 24px;
                    border-radius: 12px;
                    margin-bottom: 30px;
                    align-items: center;
                    background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%);
                    border: 2px solid #F59E0B;
                }

                /* Behavioral Prompt */
                .behavioral-prompt {
                    position: fixed;
                    bottom: 100px;
                    right: 30px;
                    background: white;
                    padding: 24px;
                    border-radius: 12px;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                    display: none;
                    animation: slideIn 0.5s ease;
                    z-index: 999;
                    max-width: 320px;
                    border: 1px solid #E5E7EB;
                }

                .behavioral-prompt.show {
                    display: block;
                }

                .behavioral-prompt h4 {
                    margin: 0 0 12px 0;
                    font-size: 18px;
                    color: #1E40AF;
                }

                .behavioral-prompt p {
                    margin: 0 0 16px 0;
                    font-size: 14px;
                    line-height: 1.5;
                    color: #4B5563;
                }

                /* Social Proof Ticker */
                .social-proof-ticker {
                    position: fixed;
                    bottom: 20px;
                    left: 20px;
                    background: white;
                    border: 1px solid #10B981;
                    border-radius: 8px;
                    padding: 16px 20px;
                    display: none;
                    animation: slideIn 0.5s ease;
                    z-index: 998;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
                }

                .social-proof-ticker.show {
                    display: block;
                }

                .social-proof-content {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .social-proof-avatar {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: #10B981;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    font-size: 14px;
                }

                /* Achievement Modal */
                .achievement-unlocked {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) scale(0);
                    background: white;
                    color: #1a1a1a;
                    padding: 40px;
                    border-radius: 16px;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
                    z-index: 1002;
                    text-align: center;
                    animation: achievementPop 0.5s ease forwards;
                    border: 2px solid #F97316;
                }

                @keyframes achievementPop {
                    to {
                        transform: translate(-50%, -50%) scale(1);
                    }
                }

                /* Feature Progress */
                .feature-progress {
                    position: fixed;
                    bottom: 20px;
                    left: 20px;
                    background: white;
                    border: 2px solid #F97316;
                    padding: 24px;
                    border-radius: 12px;
                    width: 280px;
                    display: none;
                    z-index: 850;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
                }

                .feature-checkbox {
                    width: 20px;
                    height: 20px;
                    border: 2px solid #E5E7EB;
                    border-radius: 4px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                    color: white;
                    background: white;
                }

                .feature-checkbox.checked {
                    background: #10B981;
                    border-color: #10B981;
                }

                /* Floating CTA */
                #floatingCTA {
                    position: fixed;
                    bottom: 30px;
                    right: 30px;
                    z-index: 900;
                    display: none;
                    animation: bounce 2s ease-in-out infinite;
                }

                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }

                #floatingCTA button {
                    background: #F97316;
                    color: white;
                    border: none;
                    padding: 18px 30px;
                    border-radius: 30px;
                    font-weight: 700;
                    font-size: 16px;
                    box-shadow: 0 6px 20px rgba(249, 115, 22, 0.3);
                    cursor: pointer;
                    transition: all 0.3s;
                    font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }

                #floatingCTA button:hover {
                    transform: scale(1.05);
                    box-shadow: 0 8px 25px rgba(249, 115, 22, 0.4);
                    background: #EA580C;
                }

                /* Limited Time Offer */
                .limited-time-offer {
                    background: linear-gradient(135deg, #1E40AF, #3B82F6);
                    color: white;
                    padding: 20px;
                    border-radius: 12px;
                    margin: 20px 0;
                    text-align: center;
                    box-shadow: 0 4px 12px rgba(30, 64, 175, 0.2);
                }

                .countdown-timer {
                    font-size: 28px;
                    font-weight: 800;
                    margin: 12px 0;
                }

                /* Stats Display */
                .yta-stats {
                    display: flex;
                    justify-content: space-around;
                    margin-top: 24px;
                    flex-wrap: wrap;
                    gap: 20px;
                }

                .yta-stat {
                    text-align: center;
                    min-width: 100px;
                }

                .yta-stat-value {
                    font-size: 24px;
                    font-weight: 700;
                    color: #1E40AF;
                }

                /* Revenue Share Box */
                .revenue-share-box {
                    background: linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%);
                    border: 2px solid #F97316;
                    border-radius: 16px;
                    padding: 32px;
                    text-align: center;
                    margin: 24px 0;
                }

                /* Skeleton Loading */
                .skeleton {
                    background: linear-gradient(90deg, #F3F4F6 0%, #E5E7EB 50%, #F3F4F6 100%);
                    background-size: 200% 100%;
                    animation: skeleton-loading 1.5s ease-in-out infinite;
                    border-radius: 8px;
                }

                @keyframes skeleton-loading {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }

                /* Mobile Responsive */
                @media (max-width: 768px) {
                    .critical-metrics-banner {
                        padding: 12px 10px;
                    }
                    
                    .critical-metrics-content {
                        flex-direction: column;
                        gap: 15px;
                        text-align: center;
                    }
                    
                    .critical-metric-value {
                        font-size: 24px;
                    }
                    
                    .usage-limits {
                        top: auto;
                        bottom: 100px;
                        right: 10px;
                        width: calc(100% - 20px);
                        max-width: 300px;
                    }
                    
                    .behavioral-prompt {
                        right: 10px;
                        left: 10px;
                        bottom: 120px;
                        max-width: none;
                    }
                    
                    .social-proof-ticker {
                        left: 10px;
                        right: 10px;
                        max-width: none;
                    }
                    
                    .yta-btn-primary {
                        width: 100%;
                        font-size: 16px;
                        padding: 14px 20px;
                    }
                    
                    .value-headline {
                        font-size: 28px;
                    }
                    
                    .yta-opt-grid {
                        grid-template-columns: 1fr;
                    }
                    
                    .yta-grid {
                        grid-template-columns: 1fr;
                    }
                    
                    #floatingCTA {
                        right: 10px;
                        left: 10px;
                        bottom: 20px;
                    }
                    
                    #floatingCTA button {
                        width: 100%;
                    }
                    
                    .yta-header {
                        padding-top: 40px;
                    }
                    
                    .daily-streak {
                        top: 10px;
                        right: 10px;
                        padding: 10px 16px;
                        font-size: 13px;
                    }
                }

                @keyframes slideIn {
                    from {
                        transform: translateX(100px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `;

            const styleElement = document.createElement('style');
            styleElement.textContent = styles;
            document.head.appendChild(styleElement);
        }

        buildCompleteHTML() {
            this.root.innerHTML = `
                <!-- Critical Metrics Banner (Fixed Top) -->
                <div class="critical-metrics-banner" id="criticalBanner">
                    <div class="critical-metrics-content">
                        <div style="flex: 1; min-width: 200px;">
                            <div style="font-size: 14px; opacity: 0.9;">YOU'RE LOSING</div>
                            <div class="critical-metric-value" id="criticalLostRevenue">$0</div>
                            <div style="font-size: 12px; opacity: 0.9;">in potential revenue</div>
                        </div>
                        <button class="yta-btn-primary" onclick="window.open('https://www.primetime.media/beta-signup', '_blank')" style="white-space: nowrap;">
                            Unlock Your Revenue Potential →
                        </button>
                    </div>
                </div>

                <!-- Usage Limits Display (Fixed Right) -->
                <div class="usage-limits" id="usageLimits">
                    <h4 style="margin: 0 0 16px 0; font-size: 16px; color: #1E40AF; font-weight: 700;">Free Tier Limits</h4>
                    <div class="usage-limit-item" style="margin-bottom: 16px;">
                        <div class="usage-limit-header">
                            <span>Data Exports</span>
                            <span style="color: #F97316; font-weight: 600;">87% Used</span>
                        </div>
                        <div class="usage-limit-bar">
                            <div class="usage-limit-fill usage-limit-high" style="width: 87%"></div>
                        </div>
                    </div>
                    <div class="usage-limit-item" style="margin-bottom: 16px;">
                        <div class="usage-limit-header">
                            <span>Advanced Analytics</span>
                            <span style="color: #F97316; font-weight: 600;">Limited</span>
                        </div>
                        <div class="usage-limit-bar">
                            <div class="usage-limit-fill usage-limit-medium" style="width: 60%"></div>
                        </div>
                    </div>
                    <div class="usage-limit-item" style="margin-bottom: 20px;">
                        <div class="usage-limit-header">
                            <span>Real-time Data</span>
                            <span style="color: #EF4444; font-weight: 600;">Not Available</span>
                        </div>
                        <div class="usage-limit-bar">
                            <div class="usage-limit-fill usage-limit-high" style="width: 100%"></div>
                        </div>
                    </div>
                    <div style="text-align: center;">
                        <button class="yta-btn-primary" style="width: 100%; font-size: 14px;" onclick="window.open('https://www.primetime.media/beta-signup', '_blank')">
                            Remove All Limits →
                        </button>
                    </div>
                </div>

                <!-- Daily Streak Gamification -->
                <div class="daily-streak" onclick="window.showStreakDetails()">
                    <span class="streak-fire">🔥</span>
                    <span id="streakCount">0</span> day streak
                </div>

                <!-- Main Container -->
                <div class="yta-container">
                    <!-- Header Section with Value Proposition -->
                    <div class="yta-header">
                        <div class="value-proposition">
                            <div class="trust-badge">🔥 2,847+ YouTubers earning extra revenue</div>
                            <div class="value-headline">Creators Using Our Insights Earn 340% More</div>
                            <div class="value-subtitle">
                                Join 10,000+ creators who've unlocked their hidden revenue potential
                            </div>
                            <div class="trust-indicators">
                                <div class="trust-indicator">
                                    <span class="trust-indicator-icon">✓</span>
                                    <span>No credit card required</span>
                                </div>
                                <div class="trust-indicator">
                                    <span class="trust-indicator-icon">✓</span>
                                    <span>Cancel anytime</span>
                                </div>
                                <div class="trust-indicator">
                                    <span class="trust-indicator-icon">✓</span>
                                    <span>We only profit if you do</span>
                                </div>
                            </div>
                        </div>
                        
                        <div style="display: flex; align-items: center; justify-content: center; gap: 15px; margin: 30px 0;">
                            <div style="width: 50px; height: 35px; background: #ff0000; border-radius: 8px; display: flex; align-items: center; justify-content: center; position: relative;">
                                <div style="width: 0; height: 0; border-left: 12px solid #fff; border-top: 7px solid transparent; border-bottom: 7px solid transparent; margin-left: 2px;"></div>
                            </div>
                            <span style="font-size: 28px; font-weight: 700; color: #1a1a1a;">YouTube</span>
                            <span style="color:#6B7280;font-weight:300;margin-left:5px;">Channel Analytics</span>
                            <a href="https://primetime.media" target="_blank" style="display:flex;align-items:center;text-decoration:none;margin-left:40px;">
                                <img src="https://cdn.prod.website-files.com/6810e412eaea035f7c26cb1e/6810e81d766934e34ca7f908_New%20PTN%20Logo%20(2).png" alt="primetime.media" style="height:80px;width:auto;object-fit:contain;">
                            </a>
                        </div>
                        
                        <!-- Limited Time Offer -->
                        <div class="limited-time-offer">
                            <div style="font-size: 16px; margin-bottom: 5px;">🎯 LIMITED TIME: Beta Access Available</div>
                            <div class="countdown-timer" id="countdownTimer">23:47:12</div>
                            <div style="font-size: 14px;">Only 47 spots remaining at founder pricing</div>
                        </div>
                    </div>

                    <!-- Input Section -->
                    <div class="yta-input-section">
                        <h2 style="margin-bottom: 20px; font-size: 28px; color: #1E40AF; font-weight: 700;">
                            Discover Your Hidden Revenue in 30 Seconds
                        </h2>
                        <input type="text" id="ytaHandle" class="yta-input" placeholder="@channelname or youtube.com/@channel" autocomplete="off">
                        <br>
                        <button class="yta-btn-primary" onclick="window.ytaRun()">
                            🚀 Reveal My Revenue Potential
                        </button>
                        
                        <div style="margin-top: 24px; font-size: 14px; color: #6B7280;">
                            <div style="margin-bottom: 12px;">Join creators who discovered:</div>
                            <div style="display: flex; justify-content: center; gap: 30px; flex-wrap: wrap;">
                                <div style="color: #10B981; font-weight: 600;">✓ @SarahM: +$127K/year</div>
                                <div style="color: #10B981; font-weight: 600;">✓ @TechReviews: +$89K/year</div>
                                <div style="color: #10B981; font-weight: 600;">✓ @FoodieLife: +$203K/year</div>
                            </div>
                        </div>
                    </div>

                    <!-- Loading State with Progress -->
                    <div class="yta-loading" id="ytaLoading">
                        <div class="yta-spinner"></div>
                        <div id="ytaLoadText" style="font-size: 24px; font-weight: 700; margin-bottom: 12px; color: #1E40AF;">Analyzing revenue potential...</div>
                        <div id="ytaLoadSub" style="color:#6B7280;font-size:16px;margin-bottom: 24px;">Calculating your hidden earnings</div>
                        <div class="skeleton" style="height:20px;width:250px;margin:20px auto;"></div>
                        <div style="margin-top: 24px; color: #3B82F6; font-size: 14px;">
                            <div id="loadingStage">🔍 Scanning channel performance...</div>
                        </div>
                    </div>

                    <!-- Messages -->
                    <div id="ytaMsg"></div>

                    <!-- Results Section -->
                    <div class="yta-results">
                        <!-- Channel Info Card -->
                        <div class="yta-channel">
                            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
                                <div style="display:flex;align-items:center;gap:16px;flex:1;justify-content:center;">
                                    <img id="channelImage" src="" alt="Channel" style="width:80px;height:80px;border-radius:50%;border:3px solid #3B82F6;display:none;box-shadow:0 4px 12px rgba(59,130,246,0.2);" onerror="this.style.display='none'">
                                    <h2 style="margin:0;font-size:32px;color:#1E40AF;font-weight:800;" id="channelName">Channel Analytics</h2>
                                </div>
                                <button onclick="window.ytaReset()" class="yta-btn-secondary">🔄 New Analysis</button>
                            </div>
                            <div style="color:#6B7280;margin:12px 0;font-size:16px;" id="channelCategory">Category: Gaming</div>
                            
                            <div class="yta-stats">
                                <div class="yta-stat">
                                    <div style="font-size:32px;margin-bottom:8px;">👥</div>
                                    <div><span class="yta-stat-value" id="subCount">0</span></div>
                                    <div style="font-size:12px;color:#6B7280;">Subscribers</div>
                                </div>
                                <div class="yta-stat">
                                    <div style="font-size:32px;margin-bottom:8px;">👁️</div>
                                    <div><span class="yta-stat-value" id="viewCount">0</span></div>
                                    <div style="font-size:12px;color:#6B7280;">Total Views</div>
                                </div>
                                <div class="yta-stat">
                                    <div style="font-size:32px;margin-bottom:8px;">🎬</div>
                                    <div><span class="yta-stat-value" id="videoCount">0</span></div>
                                    <div style="font-size:12px;color:#6B7280;">Videos</div>
                                </div>
                            </div>
                        </div>

                        <!-- Optimization Metrics -->
                        <div class="yta-opt">
                            <div class="yta-opt-header" id="optHeader">📊 Calculating Your Hidden Revenue...</div>
                            <div class="yta-opt-grid">
                                <div class="yta-metric" title="Additional revenue per video after optimization">
                                    <div class="yta-metric-label">Revenue/Video Potential</div>
                                    <div class="yta-metric-value yta-orange" id="revPerVideo">$0</div>
                                    <div style="font-size:11px;color:#F97316;margin-top:8px;font-weight:600;">+125% Average</div>
                                </div>
                                <div class="yta-metric" title="Projected subscriber growth from optimized content">
                                    <div class="yta-metric-label">Subscriber Growth</div>
                                    <div class="yta-metric-value yta-orange" id="subGrowth">0</div>
                                    <div style="font-size:11px;color:#F97316;margin-top:8px;font-weight:600;">Projected Increase</div>
                                </div>
                                <div class="yta-metric" title="Additional views per video from optimization">
                                    <div class="yta-metric-label">View Amplification</div>
                                    <div class="yta-metric-value yta-orange" id="viewsImpact">0</div>
                                    <div style="font-size:11px;color:#F97316;margin-top:8px;font-weight:600;">Per Video</div>
                                </div>
                                <div class="yta-metric annual-revenue-metric" title="Your total annual revenue potential if you optimize now">
                                    <div class="yta-metric-label">💰 Annual Revenue Potential 💰</div>
                                    <div class="yta-metric-value" id="annualPot">$0</div>
                                    <div style="font-size:12px;color:#F97316;margin-top:8px;font-weight:700;">AVAILABLE NOW</div>
                                    
                                    <div class="revenue-share-box" style="margin-top:24px;">
                                        <div style="font-size:24px;margin-bottom:16px;">🤝</div>
                                        <div style="font-size:18px;font-weight:700;color:#F97316;margin-bottom:12px;">
                                            We Only Make Money If You Do
                                        </div>
                                        <div style="font-size:14px;color:#4B5563;line-height:1.8;">
                                            <div>✅ <strong>$0 upfront</strong> - Pay nothing to start</div>
                                            <div>✅ <strong>Split the profits</strong> - We share success</div>
                                            <div>✅ <strong>Cancel anytime</strong> - You're in control</div>
                                        </div>
                                        <button class="yta-btn-primary" style="margin-top:20px;width:100%;" onclick="window.open('https://www.primetime.media/beta-signup', '_blank')">
                                            Claim Your Revenue Share →
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Alert Box -->
                        <div class="yta-alert" id="alertBox">
                            <div style="font-size:28px;">⚠️</div>
                            <div style="flex:1;">
                                <h4 id="alertTitle" style="margin:0 0 8px 0;font-size:18px;color:#92400E;">Revenue Alert</h4>
                                <p id="alertDesc" style="font-size:14px;color:#78350F;margin:0;">Your channel has untapped potential.</p>
                            </div>
                            <button class="yta-btn-primary" onclick="window.open('https://www.primetime.media/beta-signup', '_blank')">
                                Claim Your Revenue →
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Floating CTA -->
                <div id="floatingCTA">
                    <button onclick="window.open('https://www.primetime.media/beta-signup', '_blank')">
                        <div style="display:flex;align-items:center;gap:12px;">
                            <div>
                                <div style="font-size:16px;">💰 Unlock Revenue Potential</div>
                                <div style="font-size:12px;opacity:0.9;margin-top:3px;">Limited beta access • We profit only if you do</div>
                            </div>
                        </div>
                    </button>
                </div>

                <!-- Feature Progress Tracker -->
                <div class="feature-progress" id="featureProgress">
                    <div style="font-size:14px;color:#F97316;margin-bottom:16px;font-weight:700;">Discovery Progress</div>
                    <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;font-size:13px;">
                        <div class="feature-checkbox" id="check1"></div>
                        <span>Channel Analyzed</span>
                    </div>
                    <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;font-size:13px;">
                        <div class="feature-checkbox" id="check2"></div>
                        <span>Revenue Potential Revealed</span>
                    </div>
                    <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;font-size:13px;">
                        <div class="feature-checkbox" id="check3"></div>
                        <span>AI Insights Reviewed</span>
                    </div>
                    <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;font-size:13px;">
                        <div class="feature-checkbox" id="check4"></div>
                        <span>Growth Plan Generated</span>
                    </div>
                    <div style="margin-top:20px;text-align:center;">
                        <button class="yta-btn-primary" style="width:100%;font-size:14px;" onclick="window.open('https://www.primetime.media/beta-signup', '_blank')">
                            Complete Your Journey →
                        </button>
                    </div>
                </div>

                <!-- Behavioral Prompt -->
                <div class="behavioral-prompt" id="behavioralPrompt">
                    <h4>💡 Revenue Insight</h4>
                    <p id="promptText">Your channel shows signs of untapped potential.</p>
                    <button class="yta-btn-primary" style="width:100%;font-size:14px;" onclick="window.open('https://www.primetime.media/beta-signup', '_blank')">
                        Unlock Full Analysis →
                    </button>
                </div>

                <!-- Social Proof Ticker -->
                <div class="social-proof-ticker" id="socialProofTicker">
                    <div class="social-proof-content">
                        <div class="social-proof-avatar">JM</div>
                        <div>
                            <div style="font-weight:600;font-size:14px;color:#1a1a1a;">@JohnMusic just unlocked</div>
                            <div style="font-size:12px;color:#10B981;">+$84K annual revenue potential</div>
                        </div>
                    </div>
                </div>

                <!-- Achievement Unlocked -->
                <div class="achievement-unlocked" id="achievementModal" style="display:none;">
                    <div style="font-size:48px;margin-bottom:16px;">🏆</div>
                    <h3 style="margin:0 0 10px 0;font-size:24px;color:#1E40AF;">Achievement Unlocked!</h3>
                    <p id="achievementText" style="margin:0;font-size:16px;color:#4B5563;">Revenue Explorer</p>
                </div>
            `;
        }

        initializeAllFunctions() {
            // Global functions
            window.YTA_CONFIG = YTA_CONFIG;
            window.YTA_SESSION = YTA_SESSION;
            
            // Core functions
            window.ytaRun = () => this.ytaRun();
            window.ytaReset = () => this.ytaReset();
            window.showStreakDetails = () => this.showStreakDetails();
            window.trackAction = (action, data) => this.trackAction(action, data);
            
            // Initialize features
            this.updateStreak();
            this.startCountdownTimer();
            
            // Event listeners
            document.getElementById('ytaHandle').addEventListener('keydown', (e) => {
                if (e.key === 'Enter') this.ytaRun();
            });
            
            // Focus input
            setTimeout(() => {
                const input = document.getElementById('ytaHandle');
                if (input) input.focus();
            }, 100);
            
            // Auto-save handle
            const savedHandle = localStorage.getItem('yta_lastHandle');
            if (savedHandle) {
                document.getElementById('ytaHandle').value = savedHandle;
            }
            
            document.getElementById('ytaHandle').addEventListener('input', (e) => {
                if (e.target.value) {
                    localStorage.setItem('yta_lastHandle', e.target.value);
                }
            });
        }

        startBackgroundProcesses() {
            // Social proof rotation
            setInterval(() => this.rotateSocialProof(), YTA_CONFIG.conversionOptimizations.socialProofInterval);
            
            // Show initial social proof after delay
            setTimeout(() => this.rotateSocialProof(), 5000);
        }

        // Core functionality
        ytaRun() {
            this.trackAction('analyze_channel');
            const handle = document.getElementById('ytaHandle').value.trim();
            
            if (!handle) {
                document.getElementById('ytaMsg').innerHTML = '<div style="color:#EF4444;background:#FEE2E2;padding:16px;border-radius:8px;margin:10px 0;text-align:center;border:2px solid #EF4444;font-weight:600;">⚠️ Enter your channel to discover hidden revenue</div>';
                return;
            }
            
            document.getElementById('ytaMsg').innerHTML = '';
            document.querySelector('.yta-input-section').style.display = 'none';
            document.getElementById('ytaLoading').style.display = 'block';
            
            // Progressive loading stages
            const loadingStages = [
                '🔍 Analyzing channel performance...',
                '💰 Calculating revenue potential...',
                '📊 Identifying growth opportunities...',
                '🚀 Preparing your roadmap to success...'
            ];
            
            let stageIndex = 0;
            const stageInterval = setInterval(() => {
                if (stageIndex < loadingStages.length) {
                    document.getElementById('loadingStage').textContent = loadingStages[stageIndex];
                    stageIndex++;
                }
            }, 2000);
            
            const formattedHandle = handle.startsWith('@') ? handle : '@' + handle;
            const capitalizedHandle = formattedHandle.toUpperCase();
            document.getElementById('ytaLoadText').textContent = `Unlocking Revenue for ${capitalizedHandle}...`;
            
            // Simulate API call (replace with real)
            setTimeout(() => {
                clearInterval(stageInterval);
                document.getElementById('ytaLoading').style.display = 'none';
                
                // Simulated data
                const data = {
                    channel_data: {
                        subscriberCount: Math.floor(Math.random() * 900000) + 100000,
                        viewCount: Math.floor(Math.random() * 90000000) + 10000000,
                        videoCount: Math.floor(Math.random() * 450) + 50,
                        composite_score: Math.random() * 10
                    },
                    back_catalog_revenue_calculator: {
                        annual_totals: {
                            total_additional_revenue: Math.floor(Math.random() * 180000) + 20000
                        }
                    }
                };
                
                this.ytaUpdateDashboard(data, handle);
                document.querySelector('.yta-results').style.display = 'block';
            }, 3000);
        }

        ytaReset() {
            this.trackAction('reset_analysis');
            
            // Reset UI
            document.querySelector('.yta-input-section').style.display = 'block';
            document.getElementById('ytaLoading').style.display = 'none';
            document.querySelector('.yta-results').style.display = 'none';
            document.getElementById('ytaHandle').value = '';
            document.getElementById('ytaMsg').innerHTML = '';
            document.getElementById('floatingCTA').style.display = 'none';
            document.getElementById('featureProgress').style.display = 'none';
            document.getElementById('behavioralPrompt').classList.remove('show');
            document.getElementById('criticalBanner').classList.remove('show');
            document.getElementById('usageLimits').classList.remove('show');
            
            setTimeout(() => document.getElementById('ytaHandle').focus(), 100);
        }

        ytaUpdateDashboard(data, handle) {
            this.trackAction('view_metrics');
            const cd = data.channel_data || data;
            const fmt = n => {
                if (n >= 1e9) return (n/1e9).toFixed(1) + 'B';
                if (n >= 1e6) return (n/1e6).toFixed(1) + 'M';
                if (n >= 1e3) return (n/1e3).toFixed(1) + 'K';
                return n.toString();
            };
            
            // Format handle
            const formattedHandle = handle.startsWith('@') ? handle : '@' + handle;
            const capitalizedHandle = formattedHandle.toUpperCase();
            
            document.getElementById('channelName').textContent = `${capitalizedHandle} Analytics`;
            
            // Update stats
            document.getElementById('subCount').textContent = fmt(cd.subscriberCount || 0);
            document.getElementById('viewCount').textContent = fmt(cd.viewCount || 0);
            document.getElementById('videoCount').textContent = fmt(cd.videoCount || 0);
            
            // Revenue
            const revenue = data.back_catalog_revenue_calculator?.annual_totals?.total_additional_revenue || 0;
            document.getElementById('annualPot').textContent = '$' + fmt(revenue);
            
            // Show features based on revenue
            if (revenue > 50000) {
                document.getElementById('criticalBanner').classList.add('show');
                document.getElementById('criticalLostRevenue').textContent = '$' + fmt(revenue);
            }
            
            // Show usage limits
            setTimeout(() => {
                document.getElementById('usageLimits').classList.add('show');
            }, 5000);
            
            // Show floating CTA
            setTimeout(() => {
                document.getElementById('floatingCTA').style.display = 'block';
            }, 8000);
        }

        trackAction(action, data = {}) {
            YTA_SESSION.actions.push({
                action,
                data,
                timestamp: Date.now()
            });
            YTA_SESSION.lastAction = action;
            
            // Update feature progress
            const checkMap = {
                'analyze_channel': 'check1',
                'view_revenue': 'check2',
                'view_ai': 'check3',
                'use_calculator': 'check4'
            };
            
            if (checkMap[action]) {
                const checkbox = document.getElementById(checkMap[action]);
                if (checkbox) {
                    checkbox.classList.add('checked');
                    checkbox.innerHTML = '✓';
                }
                YTA_SESSION.featureUsage[action] = true;
            }
            
            const usedFeatures = Object.keys(YTA_SESSION.featureUsage).length;
            if (usedFeatures >= 2) {
                document.getElementById('featureProgress').style.display = 'block';
            }
        }

        showStreakDetails() {
            const streak = document.getElementById('streakCount').textContent;
            this.showBehavioralPrompt(`${streak} day streak! Premium users average 45-day streaks and earn 3x more.`);
        }

        showBehavioralPrompt(text) {
            const prompt = document.getElementById('behavioralPrompt');
            document.getElementById('promptText').textContent = text;
            prompt.classList.add('show');
            
            setTimeout(() => {
                prompt.classList.remove('show');
            }, 10000);
        }

        updateStreak() {
            const lastVisit = localStorage.getItem('yta_lastVisit');
            const today = new Date().toDateString();
            let streak = parseInt(localStorage.getItem('yta_streak') || '0');
            
            if (lastVisit !== today) {
                const yesterday = new Date(Date.now() - 86400000).toDateString();
                if (lastVisit === yesterday) {
                    streak++;
                } else if (lastVisit !== today) {
                    streak = 1;
                }
                localStorage.setItem('yta_streak', streak);
                localStorage.setItem('yta_lastVisit', today);
            }
            
            document.getElementById('streakCount').textContent = streak;
        }

        startCountdownTimer() {
            const endTime = new Date().getTime() + (24 * 60 * 60 * 1000);
            
            const updateTimer = () => {
                const now = new Date().getTime();
                const distance = endTime - now;
                
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                
                const timer = document.getElementById('countdownTimer');
                if (timer) {
                    timer.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                }
            };
            
            updateTimer();
            setInterval(updateTimer, 1000);
        }

        rotateSocialProof() {
            const socialProofMessages = [
                { name: '@TechReviews', avatar: 'TR', amount: '+$89K' },
                { name: '@BeautyGuru', avatar: 'BG', amount: '+$156K' },
                { name: '@GamingPro', avatar: 'GP', amount: '+$234K' },
                { name: '@FoodieVlogs', avatar: 'FV', amount: '+$98K' },
                { name: '@FitnessCoach', avatar: 'FC', amount: '+$127K' }
            ];
            
            const ticker = document.getElementById('socialProofTicker');
            if (!ticker) return;
            
            const index = Math.floor(Math.random() * socialProofMessages.length);
            const proof = socialProofMessages[index];
            
            const avatar = ticker.querySelector('.social-proof-avatar');
            const content = ticker.querySelector('.social-proof-content > div:last-child');
            
            if (avatar) avatar.textContent = proof.avatar;
            
            if (content) {
                content.innerHTML = `
                    <div style="font-weight:600;font-size:14px;color:#1a1a1a;">${proof.name} unlocked</div>
                    <div style="font-size:12px;color:#10B981;">${proof.amount} annual revenue</div>
                `;
            }
            
            ticker.classList.add('show');
            
            setTimeout(() => {
                ticker.classList.remove('show');
            }, 8000);
        }
    }

    // Initialize when DOM is ready
    window.addEventListener('DOMContentLoaded', function() {
        // Auto-initialize if root element exists
        if (document.getElementById('dashboard-root')) {
            new YouTubeAnalyticsDashboard('dashboard-root');
        }
    });

    // Make class available globally
    window.YouTubeAnalyticsDashboard = YouTubeAnalyticsDashboard;
})();