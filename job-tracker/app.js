// ============================================
// KodNest Job Notification Tracker
// Client-side Routing & Navigation
// With Intelligent Matching System
// ============================================

// Global state
let currentFilters = {
    keyword: '',
    location: 'all',
    mode: 'all',
    experience: 'all',
    source: 'all',
    status: 'all',
    sort: 'latest',
    showOnlyMatches: false
};

// ============================================
// PREFERENCE MANAGEMENT
// ============================================

function getPreferences() {
    const saved = localStorage.getItem('jobTrackerPreferences');
    return saved ? JSON.parse(saved) : null;
}

function savePreferences(preferences) {
    localStorage.setItem('jobTrackerPreferences', JSON.stringify(preferences));
}

function resetPreferences() {
    localStorage.removeItem('jobTrackerPreferences');
}

// ============================================
// JOB STATUS TRACKING
// ============================================

const JOB_STATUSES = {
    NOT_APPLIED: 'Not Applied',
    APPLIED: 'Applied',
    REJECTED: 'Rejected',
    SELECTED: 'Selected'
};

function getJobStatus(jobId) {
    const statuses = localStorage.getItem('jobTrackerStatus');
    const statusMap = statuses ? JSON.parse(statuses) : {};
    return statusMap[jobId] || JOB_STATUSES.NOT_APPLIED;
}

function setJobStatus(jobId, status) {
    const statuses = localStorage.getItem('jobTrackerStatus');
    const statusMap = statuses ? JSON.parse(statuses) : {};
    statusMap[jobId] = status;
    localStorage.setItem('jobTrackerStatus', JSON.stringify(statusMap));

    // Track status change history
    addStatusChangeHistory(jobId, status);

    // Show toast notification
    showToast(`Status updated: ${status}`);
}

function addStatusChangeHistory(jobId, status) {
    const history = localStorage.getItem('jobTrackerStatusHistory');
    const historyArray = history ? JSON.parse(history) : [];

    const job = jobsData.find(j => j.id === jobId);
    if (!job) return;

    historyArray.unshift({
        jobId,
        jobTitle: job.title,
        company: job.company,
        status,
        timestamp: new Date().toISOString()
    });

    // Keep only last 50 status changes
    if (historyArray.length > 50) {
        historyArray.pop();
    }

    localStorage.setItem('jobTrackerStatusHistory', JSON.stringify(historyArray));
}

function getStatusChangeHistory() {
    const history = localStorage.getItem('jobTrackerStatusHistory');
    return history ? JSON.parse(history) : [];
}

function getStatusClass(status) {
    switch (status) {
        case JOB_STATUSES.NOT_APPLIED:
            return 'status-not-applied';
        case JOB_STATUSES.APPLIED:
            return 'status-applied';
        case JOB_STATUSES.REJECTED:
            return 'status-rejected';
        case JOB_STATUSES.SELECTED:
            return 'status-selected';
        default:
            return 'status-not-applied';
    }
}

function showToast(message) {
    // Remove existing toast if any
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    // Show toast
    setTimeout(() => toast.classList.add('show'), 10);

    // Hide and remove toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}


// ============================================
// TEST CHECKLIST MANAGEMENT
// ============================================

const TEST_ITEMS = [
    { id: 'test-preferences-persist', label: 'Preferences persist after refresh', tooltip: 'Set preferences in Settings, refresh page, verify they remain' },
    { id: 'test-match-score', label: 'Match score calculates correctly', tooltip: 'Check job cards show match scores based on your preferences' },
    { id: 'test-show-matches', label: '"Show only matches" toggle works', tooltip: 'Toggle the checkbox and verify filtering works' },
    { id: 'test-save-persist', label: 'Save job persists after refresh', tooltip: 'Save a job, refresh page, verify it stays saved' },
    { id: 'test-apply-tab', label: 'Apply opens in new tab', tooltip: 'Click Apply button, verify new tab opens' },
    { id: 'test-status-persist', label: 'Status update persists after refresh', tooltip: 'Change job status, refresh page, verify status remains' },
    { id: 'test-status-filter', label: 'Status filter works correctly', tooltip: 'Filter by status, verify only matching jobs show' },
    { id: 'test-digest-top10', label: 'Digest generates top 10 by score', tooltip: 'Generate digest, verify top 10 jobs by match score' },
    { id: 'test-digest-persist', label: 'Digest persists for the day', tooltip: 'Generate digest, refresh page, verify digest remains' },
    { id: 'test-no-errors', label: 'No console errors on main pages', tooltip: 'Open DevTools Console, navigate all pages, verify no errors' }
];

function getTestChecklist() {
    const saved = localStorage.getItem('jobTrackerTestChecklist');
    return saved ? JSON.parse(saved) : {};
}

function setTestItem(testId, checked) {
    const checklist = getTestChecklist();
    checklist[testId] = checked;
    localStorage.setItem('jobTrackerTestChecklist', JSON.stringify(checklist));
}

function getTestPassCount() {
    const checklist = getTestChecklist();
    return Object.values(checklist).filter(v => v === true).length;
}

function isAllTestsPassed() {
    return getTestPassCount() === TEST_ITEMS.length;
}

function resetTestChecklist() {
    localStorage.removeItem('jobTrackerTestChecklist');
}

// ============================================
// PROOF & SUBMISSION SYSTEM
// ============================================

// Project steps definition
const PROJECT_STEPS = [
    { id: 'step-landing', label: 'Landing Page Created', completed: true },
    { id: 'step-matching', label: 'Job Matching Implemented', completed: true },
    { id: 'step-status', label: 'Status Tracking Added', completed: true },
    { id: 'step-digest', label: 'Daily Digest Built', completed: true },
    { id: 'step-settings', label: 'Settings & Preferences', completed: true },
    { id: 'step-checklist', label: 'Test Checklist Completed', completed: true },
    { id: 'step-tests', label: 'All Tests Passed', completed: false }, // Dynamic
    { id: 'step-deployment', label: 'Deployment Ready', completed: false } // Dynamic
];

// Get proof links from localStorage
function getProofLinks() {
    const saved = localStorage.getItem('jobTrackerProofLinks');
    return saved ? JSON.parse(saved) : {
        lovableLink: '',
        githubLink: '',
        deployedLink: ''
    };
}

// Save proof links to localStorage
function setProofLinks(links) {
    localStorage.setItem('jobTrackerProofLinks', JSON.stringify(links));
}

// Validate URL format
function validateURL(url) {
    if (!url || url.trim() === '') return false;
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

// Check if all proof links are provided and valid
function areAllLinksProvided() {
    const links = getProofLinks();
    return validateURL(links.lovableLink) &&
        validateURL(links.githubLink) &&
        validateURL(links.deployedLink);
}

// Check if project is fully shipped
function isProjectShipped() {
    return areAllLinksProvided() && isAllTestsPassed();
}

// Get project status
function getProjectStatus() {
    if (isProjectShipped()) {
        return 'shipped';
    }

    const links = getProofLinks();
    const hasAnyLink = links.lovableLink || links.githubLink || links.deployedLink;
    const hasAnyTest = getTestPassCount() > 0;

    if (hasAnyLink || hasAnyTest) {
        return 'in-progress';
    }

    return 'not-started';
}

// Get formatted submission text
function getSubmissionText() {
    const links = getProofLinks();
    return `------------------------------------------
Job Notification Tracker — Final Submission

Lovable Project:
${links.lovableLink || '[Not provided]'}

GitHub Repository:
${links.githubLink || '[Not provided]'}

Live Deployment:
${links.deployedLink || '[Not provided]'}

Core Features:
- Intelligent match scoring
- Daily digest simulation
- Status tracking
- Test checklist enforced
------------------------------------------`;
}

// ============================================
// MATCH SCORE ENGINE
// ============================================

function calculateMatchScore(job, preferences) {
    if (!preferences) return 0;

    let score = 0;

    // +25 if any roleKeyword appears in job.title (case-insensitive)
    if (preferences.roleKeywords && preferences.roleKeywords.length > 0) {
        const titleLower = job.title.toLowerCase();
        if (preferences.roleKeywords.some(keyword => titleLower.includes(keyword.toLowerCase()))) {
            score += 25;
        }
    }

    // +15 if any roleKeyword appears in job.description
    if (preferences.roleKeywords && preferences.roleKeywords.length > 0) {
        const descLower = job.description.toLowerCase();
        if (preferences.roleKeywords.some(keyword => descLower.includes(keyword.toLowerCase()))) {
            score += 15;
        }
    }

    // +15 if job.location matches preferredLocations
    if (preferences.preferredLocations && preferences.preferredLocations.length > 0) {
        if (preferences.preferredLocations.includes(job.location)) {
            score += 15;
        }
    }

    // +10 if job.mode matches preferredMode
    if (preferences.preferredMode && preferences.preferredMode.length > 0) {
        if (preferences.preferredMode.includes(job.mode)) {
            score += 10;
        }
    }

    // +10 if job.experience matches experienceLevel
    if (preferences.experienceLevel && job.experience === preferences.experienceLevel) {
        score += 10;
    }

    // +15 if overlap between job.skills and user.skills (any match)
    if (preferences.skills && preferences.skills.length > 0 && job.skills && job.skills.length > 0) {
        const hasOverlap = preferences.skills.some(userSkill =>
            job.skills.some(jobSkill =>
                jobSkill.toLowerCase().includes(userSkill.toLowerCase()) ||
                userSkill.toLowerCase().includes(jobSkill.toLowerCase())
            )
        );
        if (hasOverlap) {
            score += 15;
        }
    }

    // +5 if postedDaysAgo <= 2
    if (job.postedDaysAgo <= 2) {
        score += 5;
    }

    // +5 if source is LinkedIn
    if (job.source === 'LinkedIn') {
        score += 5;
    }

    // Cap score at 100
    return Math.min(score, 100);
}

function getMatchScoreClass(score) {
    if (score >= 80) return 'match-high';
    if (score >= 60) return 'match-medium';
    if (score >= 40) return 'match-low';
    return 'match-none';
}

function getMatchScoreLabel(score) {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    if (score >= 40) return 'Fair Match';
    return 'Low Match';
}

// ============================================
// ROUTE DEFINITIONS
// ============================================

const routes = {
    '/': {
        title: 'Job Notification Tracker',
        render: () => createLandingPage()
    },
    '/dashboard': {
        title: 'Dashboard',
        render: () => createDashboardPage()
    },
    '/saved': {
        title: 'Saved Jobs',
        render: () => createSavedPage()
    },
    '/digest': {
        title: 'Daily Digest',
        render: () => createDigestPage()
    },
    '/settings': {
        title: 'Settings',
        render: () => createSettingsPage()
    },
    '/proof': {
        title: 'Proof',
        render: () => createProofPage()
    },
    '/jt/07-test': {
        title: 'Test Checklist',
        render: () => createTestChecklistPage()
    },
    '/jt/08-ship': {
        title: 'Ship',
        render: () => createShipPage()
    }
};

// ============================================
// PAGE COMPONENTS
// ============================================

// Landing Page
function createLandingPage() {
    return `
        <div class="landing-page">
            <div class="landing-content">
                <h1>Stop Missing The Right Jobs.</h1>
                <p class="landing-subtext">Precision-matched job discovery delivered daily at 9AM.</p>
                <a href="settings" class="btn btn-primary btn-large" data-route="/settings">Start Tracking</a>
            </div>
        </div>
    `;
}

// Settings Page
function createSettingsPage() {
    const preferences = getPreferences() || {
        roleKeywords: [],
        preferredLocations: [],
        preferredMode: [],
        experienceLevel: '',
        skills: [],
        minMatchScore: 40
    };

    // Get unique locations from job data
    const allLocations = [...new Set(jobsData.map(j => j.location))].sort();

    return `
        <div class="page-container">
            <div class="page-header">
                <h1>Preferences</h1>
                <p>Configure your job tracking preferences for intelligent matching</p>
            </div>
            
            <div class="settings-form">
                <div class="form-section">
                    <h3>Role Keywords</h3>
                    <p class="form-help">Enter keywords for roles you're interested in (comma-separated)</p>
                    <input type="text" id="roleKeywords" class="input" 
                           placeholder="e.g., React, Frontend, Developer"
                           value="${preferences.roleKeywords.join(', ')}">
                </div>
                
                <div class="form-section">
                    <h3>Preferred Locations</h3>
                    <p class="form-help">Select cities where you'd like to work</p>
                    <select id="preferredLocations" class="input multi-select" multiple size="6">
                        ${allLocations.map(loc => `
                            <option value="${loc}" ${preferences.preferredLocations.includes(loc) ? 'selected' : ''}>
                                ${loc}
                            </option>
                        `).join('')}
                    </select>
                    <p class="form-help-small">Hold Ctrl/Cmd to select multiple</p>
                </div>
                
                <div class="form-section">
                    <h3>Work Mode</h3>
                    <p class="form-help">Select your preferred work arrangements</p>
                    <div class="checkbox-group">
                        <label class="checkbox-label">
                            <input type="checkbox" name="mode" value="Remote" 
                                   ${preferences.preferredMode.includes('Remote') ? 'checked' : ''}>
                            <span>Remote</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" name="mode" value="Hybrid"
                                   ${preferences.preferredMode.includes('Hybrid') ? 'checked' : ''}>
                            <span>Hybrid</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" name="mode" value="Onsite"
                                   ${preferences.preferredMode.includes('Onsite') ? 'checked' : ''}>
                            <span>Onsite</span>
                        </label>
                    </div>
                </div>
                
                <div class="form-section">
                    <h3>Experience Level</h3>
                    <p class="form-help">Your current experience level</p>
                    <select id="experienceLevel" class="input">
                        <option value="">Any</option>
                        <option value="Fresher" ${preferences.experienceLevel === 'Fresher' ? 'selected' : ''}>Fresher</option>
                        <option value="0-1" ${preferences.experienceLevel === '0-1' ? 'selected' : ''}>0-1 years</option>
                        <option value="1-3" ${preferences.experienceLevel === '1-3' ? 'selected' : ''}>1-3 years</option>
                        <option value="3-5" ${preferences.experienceLevel === '3-5' ? 'selected' : ''}>3-5 years</option>
                    </select>
                </div>
                
                <div class="form-section">
                    <h3>Skills</h3>
                    <p class="form-help">Enter your skills (comma-separated)</p>
                    <input type="text" id="skills" class="input" 
                           placeholder="e.g., React, JavaScript, Node.js, Python"
                           value="${preferences.skills.join(', ')}">
                </div>
                
                <div class="form-section">
                    <h3>Minimum Match Score</h3>
                    <p class="form-help">Only show jobs above this match score: <strong id="scoreValue">${preferences.minMatchScore}</strong></p>
                    <input type="range" id="minMatchScore" class="slider" 
                           min="0" max="100" value="${preferences.minMatchScore}" step="5">
                    <div class="slider-labels">
                        <span>0</span>
                        <span>50</span>
                        <span>100</span>
                    </div>
                </div>
                
                <div class="form-actions">
                    <button class="btn btn-primary" onclick="handleSavePreferences()">Save Preferences</button>
                    <button class="btn btn-secondary" onclick="handleResetPreferences()">Reset</button>
                </div>
            </div>
        </div>
    `;
}

// Dashboard Page
function createDashboardPage() {
    const preferences = getPreferences();
    const jobs = getFilteredJobs();

    // Check if no preferences set
    const noPreferencesBanner = !preferences ? `
        <div class="preference-banner">
            <span class="banner-icon">⚙️</span>
            <div class="banner-content">
                <strong>Set your preferences to activate intelligent matching</strong>
                <p>Configure your job preferences to see personalized match scores and recommendations.</p>
            </div>
            <a href="/settings" class="btn btn-secondary btn-sm" data-route="/settings">Go to Settings</a>
        </div>
    ` : '';

    if (jobs.length === 0) {
        const message = currentFilters.showOnlyMatches
            ? 'No roles match your criteria. Adjust filters or lower threshold.'
            : 'No jobs found matching your filters.';

        return `
            <div class="dashboard-container">
                <div class="page-header">
                    <h1>Dashboard</h1>
                    <p>Your personalized job feed</p>
                </div>
                
                ${noPreferencesBanner}
                ${createFilterBar()}
                
                <div class="empty-state">
                    <div class="empty-state-icon">📋</div>
                    <h2>No jobs found</h2>
                    <p>${message}</p>
                </div>
            </div>
        `;
    }

    return `
        <div class="dashboard-container">
            <div class="page-header">
                <h1>Dashboard</h1>
                <p>${jobs.length} jobs found</p>
            </div>
            
            ${noPreferencesBanner}
            ${createFilterBar()}
            
            <div class="jobs-grid">
                ${jobs.map(job => createJobCard(job, preferences)).join('')}
            </div>
        </div>
        
        ${createJobModal()}
    `;
}

// Create Filter Bar
function createFilterBar() {
    const preferences = getPreferences();
    const locations = ['all', ...new Set(jobsData.map(j => j.location))].sort();
    const modes = ['all', 'Remote', 'Hybrid', 'Onsite'];
    const experiences = ['all', 'Fresher', '0-1', '1-3', '3-5'];
    const sources = ['all', 'LinkedIn', 'Naukri', 'Indeed'];
    const statuses = ['all', JOB_STATUSES.NOT_APPLIED, JOB_STATUSES.APPLIED, JOB_STATUSES.REJECTED, JOB_STATUSES.SELECTED];

    return `
        <div class="filter-bar">
            ${preferences ? `
                <div class="filter-toggle">
                    <label class="toggle-label">
                        <input type="checkbox" id="showOnlyMatches" 
                               ${currentFilters.showOnlyMatches ? 'checked' : ''}
                               onchange="handleToggleMatches(this.checked)">
                        <span>Show only jobs above my threshold (${preferences.minMatchScore})</span>
                    </label>
                </div>
            ` : ''}
            
            <div class="filter-row">
                <input 
                    type="text" 
                    class="filter-input" 
                    id="keywordFilter" 
                    placeholder="Search by title or company..."
                    value="${currentFilters.keyword}"
                >
                
                <select class="filter-select" id="locationFilter">
                    <option value="all">All Locations</option>
                    ${locations.filter(l => l !== 'all').map(loc => `
                        <option value="${loc}" ${currentFilters.location === loc ? 'selected' : ''}>${loc}</option>
                    `).join('')}
                </select>
                
                <select class="filter-select" id="modeFilter">
                    ${modes.map(mode => `
                        <option value="${mode.toLowerCase()}" ${currentFilters.mode === mode.toLowerCase() ? 'selected' : ''}>
                            ${mode === 'all' ? 'All Modes' : mode}
                        </option>
                    `).join('')}
                </select>
                
                <select class="filter-select" id="experienceFilter">
                    ${experiences.map(exp => `
                        <option value="${exp.toLowerCase()}" ${currentFilters.experience === exp.toLowerCase() ? 'selected' : ''}>
                            ${exp === 'all' ? 'All Experience' : exp + ' years'}
                        </option>
                    `).join('')}
                </select>
                
                <select class="filter-select" id="sourceFilter">
                    ${sources.map(src => `
                        <option value="${src.toLowerCase()}" ${currentFilters.source === src.toLowerCase() ? 'selected' : ''}>
                            ${src === 'all' ? 'All Sources' : src}
                    </option>
                    `).join('')}
                </select>
                
                <select class="filter-select" id="statusFilter">
                    ${statuses.map(status => `
                        <option value="${status.toLowerCase()}" ${currentFilters.status === status.toLowerCase() ? 'selected' : ''}>
                            ${status === 'all' ? 'All Status' : status}
                        </option>
                    `).join('')}
                </select>
                
                <select class="filter-select" id="sortFilter">
                    <option value="latest" ${currentFilters.sort === 'latest' ? 'selected' : ''}>Latest</option>
                    <option value="oldest" ${currentFilters.sort === 'oldest' ? 'selected' : ''}>Oldest</option>
                    ${preferences ? '<option value="match" ' + (currentFilters.sort === 'match' ? 'selected' : '') + '>Match Score</option>' : ''}
                    <option value="salary" ${currentFilters.sort === 'salary' ? 'selected' : ''}>Salary</option>
                </select>
                
                <button class="btn btn-secondary btn-clear-filters" onclick="handleClearFilters()">
                    Clear All
                </button>
            </div>
        </div>
    `;
}

// Create Job Card
function createJobCard(job, preferences) {
    const isSaved = isJobSaved(job.id);
    const daysText = job.postedDaysAgo === 0 ? 'Today' : job.postedDaysAgo === 1 ? '1 day ago' : `${job.postedDaysAgo} days ago`;
    const currentStatus = getJobStatus(job.id);

    const matchScore = preferences ? calculateMatchScore(job, preferences) : 0;
    const matchBadge = preferences ? `
        <div class="match-badge ${getMatchScoreClass(matchScore)}">
            <span class="match-score">${matchScore}</span>
            <span class="match-label">${getMatchScoreLabel(matchScore)}</span>
        </div>
    ` : '';

    return `
        <div class="job-card">
            ${matchBadge}
            
            <div class="job-card-header">
                <div>
                    <h3 class="job-title">${job.title}</h3>
                    <p class="job-company">${job.company}</p>
                </div>
                <span class="source-badge source-${job.source.toLowerCase()}">${job.source}</span>
            </div>
            
            <div class="job-details">
                <span class="job-detail"><span class="detail-icon">📍</span>${job.location} • ${job.mode}</span>
                <span class="job-detail"><span class="detail-icon">💼</span>${job.experience}</span>
                <span class="job-detail"><span class="detail-icon">💰</span>${job.salaryRange}</span>
                <span class="job-detail"><span class="detail-icon">🕒</span>${daysText}</span>
            </div>
            
            <div class="job-status-section">
                <label class="status-label">Status:</label>
                <select class="status-select ${getStatusClass(currentStatus)}" onchange="handleStatusChange(${job.id}, this.value)">
                    <option value="${JOB_STATUSES.NOT_APPLIED}" ${currentStatus === JOB_STATUSES.NOT_APPLIED ? 'selected' : ''}>${JOB_STATUSES.NOT_APPLIED}</option>
                    <option value="${JOB_STATUSES.APPLIED}" ${currentStatus === JOB_STATUSES.APPLIED ? 'selected' : ''}>${JOB_STATUSES.APPLIED}</option>
                    <option value="${JOB_STATUSES.REJECTED}" ${currentStatus === JOB_STATUSES.REJECTED ? 'selected' : ''}>${JOB_STATUSES.REJECTED}</option>
                    <option value="${JOB_STATUSES.SELECTED}" ${currentStatus === JOB_STATUSES.SELECTED ? 'selected' : ''}>${JOB_STATUSES.SELECTED}</option>
                </select>
            </div>
            
            <div class="job-actions">
                <button class="btn btn-secondary btn-sm" onclick="viewJob(${job.id})">View</button>
                <button class="btn btn-secondary btn-sm ${isSaved ? 'saved' : ''}" onclick="toggleSaveJob(${job.id})">
                    ${isSaved ? '★ Saved' : '☆ Save'}
                </button>
                <button class="btn btn-primary btn-sm" onclick="applyJob('${job.applyUrl}')">Apply</button>
            </div>
        </div>
    `;
}

// Create Job Modal
function createJobModal() {
    return `
        <div class="modal" id="jobModal">
            <div class="modal-overlay" onclick="closeJobModal()"></div>
            <div class="modal-content">
                <button class="modal-close" onclick="closeJobModal()">×</button>
                <div id="modalBody"></div>
            </div>
        </div>
    `;
}

// Saved Jobs Page
function createSavedPage() {
    const savedIds = getSavedJobIds();
    const savedJobs = jobsData.filter(job => savedIds.includes(job.id));
    const preferences = getPreferences();

    if (savedJobs.length === 0) {
        return `
            <div class="page-container">
                <div class="page-header">
                    <h1>Saved Jobs</h1>
                    <p>Jobs you've bookmarked for later</p>
                </div>
                
                <div class="empty-state">
                    <div class="empty-state-icon">⭐</div>
                    <h2>No saved jobs</h2>
                    <p>Save jobs from your dashboard to review them later.</p>
                </div>
            </div>
        `;
    }

    return `
        <div class="dashboard-container">
            <div class="page-header">
                <h1>Saved Jobs</h1>
                <p>${savedJobs.length} saved jobs</p>
            </div>
            
            <div class="jobs-grid">
                ${savedJobs.map(job => createJobCard(job, preferences)).join('')}
            </div>
        </div>
        
        ${createJobModal()}
    `;
}

// ============================================
// DIGEST FUNCTIONS
// ============================================

function getTodayDateKey() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function getTodayDateFormatted() {
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return today.toLocaleDateString('en-US', options);
}

function getDigestKey() {
    return `jobTrackerDigest_${getTodayDateKey()}`;
}

function loadTodayDigest() {
    const key = getDigestKey();
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : null;
}

function generateDigest() {
    const preferences = getPreferences();
    if (!preferences) {
        return null;
    }

    // Get all jobs with match scores
    const jobsWithScores = jobsData.map(job => ({
        ...job,
        matchScore: calculateMatchScore(job, preferences)
    }));

    // Filter jobs that meet minimum threshold
    const matchingJobs = jobsWithScores.filter(job => job.matchScore >= preferences.minMatchScore);

    if (matchingJobs.length === 0) {
        return { jobs: [], generatedAt: new Date().toISOString() };
    }

    // Sort by: 1) matchScore descending, 2) postedDaysAgo ascending
    const sortedJobs = matchingJobs.sort((a, b) => {
        if (b.matchScore !== a.matchScore) {
            return b.matchScore - a.matchScore;
        }
        return a.postedDaysAgo - b.postedDaysAgo;
    });

    // Take top 10
    const top10 = sortedJobs.slice(0, 10);

    const digest = {
        jobs: top10,
        generatedAt: new Date().toISOString(),
        dateKey: getTodayDateKey()
    };

    // Save to localStorage
    localStorage.setItem(getDigestKey(), JSON.stringify(digest));

    return digest;
}

function copyDigestToClipboard(digest) {
    let text = `TOP 10 JOBS FOR YOU — 9AM DIGEST\n`;
    text += `${getTodayDateFormatted()}\n`;
    text += `${'='.repeat(60)}\n\n`;

    digest.jobs.forEach((job, index) => {
        text += `${index + 1}. ${job.title}\n`;
        text += `   Company: ${job.company}\n`;
        text += `   Location: ${job.location} • ${job.mode}\n`;
        text += `   Experience: ${job.experience}\n`;
        text += `   Salary: ${job.salaryRange}\n`;
        text += `   Match Score: ${job.matchScore}% - ${getMatchScoreLabel(job.matchScore)}\n`;
        text += `   Apply: ${job.applyUrl}\n\n`;
    });

    text += `${'='.repeat(60)}\n`;
    text += `This digest was generated based on your preferences.\n`;

    navigator.clipboard.writeText(text).then(() => {
        alert('Digest copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy:', err);
        alert('Failed to copy to clipboard. Please try again.');
    });
}

function createEmailDraft(digest) {
    const subject = encodeURIComponent('My 9AM Job Digest');

    let body = `TOP 10 JOBS FOR YOU — 9AM DIGEST%0D%0A`;
    body += `${getTodayDateFormatted()}%0D%0A`;
    body += `${'='.repeat(60)}%0D%0A%0D%0A`;

    digest.jobs.forEach((job, index) => {
        body += `${index + 1}. ${encodeURIComponent(job.title)}%0D%0A`;
        body += `   Company: ${encodeURIComponent(job.company)}%0D%0A`;
        body += `   Location: ${encodeURIComponent(job.location)} • ${encodeURIComponent(job.mode)}%0D%0A`;
        body += `   Experience: ${encodeURIComponent(job.experience)}%0D%0A`;
        body += `   Salary: ${encodeURIComponent(job.salaryRange)}%0D%0A`;
        body += `   Match Score: ${job.matchScore}%25 - ${encodeURIComponent(getMatchScoreLabel(job.matchScore))}%0D%0A`;
        body += `   Apply: ${encodeURIComponent(job.applyUrl)}%0D%0A%0D%0A`;
    });

    body += `${'='.repeat(60)}%0D%0A`;
    body += `This digest was generated based on your preferences.`;

    window.location.href = `mailto:?subject=${subject}&body=${body}`;
}

// Digest Page
function createDigestPage() {
    const preferences = getPreferences();

    // Check if preferences are set
    if (!preferences) {
        return `
            <div class="page-container">
                <div class="page-header">
                    <h1>Daily Digest</h1>
                    <p>Your curated job summary delivered at 9AM</p>
                </div>
                
                <div class="digest-blocking-message">
                    <div class="blocking-icon">⚙️</div>
                    <h2>Set preferences to generate a personalized digest</h2>
                    <p>Configure your job preferences first to receive tailored job recommendations.</p>
                    <a href="/settings" class="btn btn-primary" data-route="/settings">Go to Settings</a>
                </div>
            </div>
        `;
    }

    // Try to load existing digest for today
    let digest = loadTodayDigest();
    const hasDigest = digest !== null;

    // If no digest exists, show generation button
    if (!hasDigest) {
        return `
            <div class="page-container">
                <div class="page-header">
                    <h1>Daily Digest</h1>
                    <p>Your curated job summary delivered at 9AM</p>
                </div>
                
                <div class="digest-generate-section">
                    <div class="generate-icon">📬</div>
                    <h2>Generate Today's Digest</h2>
                    <p>Click below to generate your personalized 9AM job digest for ${getTodayDateFormatted()}</p>
                    <button class="btn btn-primary btn-large" onclick="handleGenerateDigest()">
                        Generate Today's 9AM Digest (Simulated)
                    </button>
                    <p class="simulation-note">Demo Mode: Daily 9AM trigger simulated manually.</p>
                </div>
            </div>
        `;
    }

    // Check if digest has jobs
    if (digest.jobs.length === 0) {
        return `
            <div class="page-container">
                <div class="page-header">
                    <h1>Daily Digest</h1>
                    <p>Your curated job summary delivered at 9AM</p>
                </div>
                
                <div class="digest-empty-state">
                    <div class="empty-icon">🔍</div>
                    <h2>No matching roles today</h2>
                    <p>Check again tomorrow or adjust your preferences to see more opportunities.</p>
                    <div class="digest-actions">
                        <a href="/settings" class="btn btn-secondary" data-route="/settings">Adjust Preferences</a>
                        <button class="btn btn-primary" onclick="handleRegenerateDigest()">Regenerate Digest</button>
                    </div>
                    <p class="simulation-note">Demo Mode: Daily 9AM trigger simulated manually.</p>
                </div>
            </div>
        `;
    }

    // Render digest with jobs
    const statusHistory = getStatusChangeHistory().slice(0, 10); // Get last 10 status changes

    return `
        <div class="digest-container">
            <div class="digest-email-wrapper">
                <div class="digest-email-card">
                    <div class="digest-header">
                        <h1>Top 10 Jobs For You — 9AM Digest</h1>
                        <p class="digest-date">${getTodayDateFormatted()}</p>
                    </div>
                    
                    <div class="digest-jobs">
                        ${digest.jobs.map((job, index) => createDigestJobCard(job, index + 1)).join('')}
                    </div>
                    
                    ${statusHistory.length > 0 ? `
                        <div class="status-history-section">
                            <h2>Recent Status Updates</h2>
                            <div class="status-history-list">
                                ${statusHistory.map(item => createStatusHistoryItem(item)).join('')}
                            </div>
                        </div>
                    ` : ''}
                    
                    <div class="digest-footer">
                        <p>This digest was generated based on your preferences.</p>
                        <p class="simulation-note">Demo Mode: Daily 9AM trigger simulated manually.</p>
                    </div>
                    
                    <div class="digest-actions">
                        <button class="btn btn-secondary" onclick="handleCopyDigest()">
                            📋 Copy Digest to Clipboard
                        </button>
                        <button class="btn btn-secondary" onclick="handleEmailDraft()">
                            ✉️ Create Email Draft
                        </button>
                        <button class="btn btn-primary" onclick="handleRegenerateDigest()">
                            🔄 Regenerate Digest
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function createDigestJobCard(job, rank) {
    return `
        <div class="digest-job-card">
            <div class="digest-job-rank">#${rank}</div>
            <div class="digest-job-content">
                <div class="digest-job-header">
                    <h3>${job.title}</h3>
                    <div class="match-badge ${getMatchScoreClass(job.matchScore)}">
                        <span class="match-score">${job.matchScore}</span>
                        <span class="match-label">${getMatchScoreLabel(job.matchScore)}</span>
                    </div>
                </div>
                <p class="digest-job-company">${job.company}</p>
                <div class="digest-job-details">
                    <span>📍 ${job.location} • ${job.mode}</span>
                    <span>💼 ${job.experience}</span>
                    <span>💰 ${job.salaryRange}</span>
                </div>
                <div class="digest-job-actions">
                    <button class="btn btn-primary btn-sm" onclick="applyJob('${job.applyUrl}')">Apply Now</button>
                    <button class="btn btn-secondary btn-sm" onclick="viewJob(${job.id})">View Details</button>
                </div>
            </div>
        </div>
    `;
}

function createStatusHistoryItem(item) {
    const date = new Date(item.timestamp);
    const timeAgo = getTimeAgo(date);

    return `
        <div class="status-history-item">
            <div class="status-history-content">
                <h4>${item.jobTitle}</h4>
                <p class="status-history-company">${item.company}</p>
            </div>
            <div class="status-history-meta">
                <span class="status-badge ${getStatusClass(item.status)}">${item.status}</span>
                <span class="status-history-time">${timeAgo}</span>
            </div>
        </div>
    `;
}

function getTimeAgo(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
}

// Proof Page
function createProofPage() {
    const links = getProofLinks();
    const status = getProjectStatus();
    const allTestsPassed = isAllTestsPassed();
    const allLinksProvided = areAllLinksProvided();
    const isShipped = isProjectShipped();

    // Update dynamic step completion
    const steps = PROJECT_STEPS.map(step => {
        if (step.id === 'step-tests') {
            return { ...step, completed: allTestsPassed };
        }
        if (step.id === 'step-deployment') {
            return { ...step, completed: allLinksProvided };
        }
        return step;
    });

    const statusLabels = {
        'not-started': 'Not Started',
        'in-progress': 'In Progress',
        'shipped': 'Shipped'
    };

    const statusColors = {
        'not-started': '#6c757d',
        'in-progress': '#FFA500',
        'shipped': '#2E7D32'
    };

    return `
        <div class="page-container">
            <div class="page-header">
                <h1>Project 1 — Job Notification Tracker</h1>
                <p>Final proof and submission</p>
            </div>
            
            ${isShipped ? `
                <div class="completion-message">
                    <div class="completion-icon">✓</div>
                    <h3>Project 1 Shipped Successfully.</h3>
                </div>
            ` : ''}
            
            <div class="proof-container">
                <!-- Project Status Badge -->
                <div class="project-status-section">
                    <h2>Project Status</h2>
                    <div class="project-status-badge status-${status}">
                        ${statusLabels[status]}
                    </div>
                </div>
                
                <!-- Step Completion Summary -->
                <div class="step-completion-section">
                    <h2>Step Completion Summary</h2>
                    <div class="step-list">
                        ${steps.map((step, index) => `
                            <div class="step-item ${step.completed ? 'completed' : 'pending'}">
                                <div class="step-number">${index + 1}</div>
                                <div class="step-label">${step.label}</div>
                                <div class="step-status-badge">
                                    ${step.completed ? '✓ Completed' : '○ Pending'}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Artifact Collection -->
                <div class="artifact-section">
                    <h2>Artifact Collection</h2>
                    <p class="artifact-description">Provide links to verify project completion</p>
                    
                    <div class="artifact-form">
                        <div class="artifact-input-group">
                            <label for="lovableLink">Lovable Project Link</label>
                            <input 
                                type="url" 
                                id="lovableLink" 
                                class="artifact-input"
                                placeholder="https://lovable.dev/projects/..."
                                value="${links.lovableLink}"
                            >
                            <span class="validation-message" id="lovableValidation"></span>
                        </div>
                        
                        <div class="artifact-input-group">
                            <label for="githubLink">GitHub Repository Link</label>
                            <input 
                                type="url" 
                                id="githubLink" 
                                class="artifact-input"
                                placeholder="https://github.com/username/repo"
                                value="${links.githubLink}"
                            >
                            <span class="validation-message" id="githubValidation"></span>
                        </div>
                        
                        <div class="artifact-input-group">
                            <label for="deployedLink">Deployed URL (Vercel/Netlify)</label>
                            <input 
                                type="url" 
                                id="deployedLink" 
                                class="artifact-input"
                                placeholder="https://your-app.vercel.app"
                                value="${links.deployedLink}"
                            >
                            <span class="validation-message" id="deployedValidation"></span>
                        </div>
                    </div>
                </div>
                
                <!-- Submission Export -->
                <div class="submission-section">
                    <h2>Final Submission</h2>
                    <p class="submission-description">Copy formatted submission text</p>
                    
                    <button 
                        class="btn btn-primary copy-submission-btn" 
                        id="copySubmissionBtn"
                        ${!isShipped ? 'disabled' : ''}
                    >
                        ${isShipped ? '📋 Copy Final Submission' : '🔒 Complete All Requirements First'}
                    </button>
                    
                    ${!isShipped ? `
                        <div class="requirements-checklist">
                            <h3>Requirements:</h3>
                            <ul>
                                <li class="${allLinksProvided ? 'completed' : ''}">
                                    ${allLinksProvided ? '✓' : '○'} All 3 artifact links provided
                                </li>
                                <li class="${allTestsPassed ? 'completed' : ''}">
                                    ${allTestsPassed ? '✓' : '○'} All 10 test checklist items passed
                                </li>
                            </ul>
                        </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
}

// Test Checklist Page
function createTestChecklistPage() {
    const checklist = getTestChecklist();
    const passCount = getTestPassCount();
    const totalTests = TEST_ITEMS.length;
    const allPassed = passCount === totalTests;

    return `
        <div class="page-container">
            <div class="page-header">
                <h1>Test Checklist</h1>
                <p>Verify all features before shipping</p>
            </div>
            
            <div class="test-summary ${allPassed ? 'all-passed' : 'incomplete'}">
                <h2>Tests Passed: ${passCount} / ${totalTests}</h2>
                ${!allPassed ? '<p class="test-warning">⚠️ Resolve all issues before shipping.</p>' : '<p class="test-success">✅ All tests passed! Ready to ship.</p>'}
            </div>
            
            <div class="test-checklist">
                ${TEST_ITEMS.map(item => `
                    <div class="test-item">
                        <label class="test-item-label">
                            <input 
                                type="checkbox" 
                                class="test-checkbox"
                                data-test-id="${item.id}" 
                                ${checklist[item.id] ? 'checked' : ''}
                            >
                            <span class="test-item-text">${item.label}</span>
                        </label>
                        <button class="test-tooltip-btn" title="${item.tooltip}">?</button>
                    </div>
                `).join('')}
            </div>
            
            <div class="test-actions">
                <button class="btn btn-secondary" id="resetTestsBtn">Reset Test Status</button>
                <a href="/jt/08-ship" class="btn btn-primary ${!allPassed ? 'disabled' : ''}" data-route="/jt/08-ship">
                    ${allPassed ? 'Proceed to Ship →' : '🔒 Locked Until Tests Pass'}
                </a>
            </div>
        </div>
    `;
}

// Ship Page
function createShipPage() {
    const allTestsPassed = isAllTestsPassed();
    const allLinksProvided = areAllLinksProvided();
    const isShipped = isProjectShipped();

    if (!isShipped) {
        return `
            <div class="page-container">
                <div class="page-header">
                    <h1>🔒 Ship Locked</h1>
                    <p>Complete all requirements to unlock</p>
                </div>
                
                <div class="ship-locked">
                    <div class="lock-icon">🔒</div>
                    <h2>Access Denied</h2>
                    <p>You must complete all requirements before shipping this project.</p>
                    
                    <div class="ship-requirements">
                        <h3>Requirements:</h3>
                        <ul>
                            <li class="${allTestsPassed ? 'completed' : 'pending'}">
                                ${allTestsPassed ? '✓' : '○'} All ${TEST_ITEMS.length} tests passed
                                ${!allTestsPassed ? `<span class="requirement-status">(${getTestPassCount()} / ${TEST_ITEMS.length})</span>` : ''}
                            </li>
                            <li class="${allLinksProvided ? 'completed' : 'pending'}">
                                ${allLinksProvided ? '✓' : '○'} All 3 artifact links provided
                            </li>
                        </ul>
                    </div>
                    
                    <div class="ship-actions">
                        ${!allTestsPassed ? `<a href="/jt/07-test" class="btn btn-primary" data-route="/jt/07-test">Go to Test Checklist</a>` : ''}
                        ${!allLinksProvided ? `<a href="/proof" class="btn btn-primary" data-route="/proof">Go to Proof Page</a>` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    return `
        <div class="page-container">
            <div class="page-header">
                <h1>🚀 Ready to Ship</h1>
                <p>All requirements met - deployment ready</p>
            </div>
            
            <div class="completion-message">
                <div class="completion-icon">✓</div>
                <h3>Project 1 Shipped Successfully.</h3>
            </div>
            
            <div class="ship-ready">
                <div class="ship-icon">🚀</div>
                <h2>Congratulations!</h2>
                <p>All requirements have been met. Your Job Notification Tracker is ready for production.</p>
                
                <div class="ship-checklist-summary">
                    <h3>Verified Features:</h3>
                    <ul>
                        ${TEST_ITEMS.map(item => `<li>✅ ${item.label}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="ship-checklist-summary">
                    <h3>Submitted Artifacts:</h3>
                    <ul>
                        <li>✅ Lovable Project Link</li>
                        <li>✅ GitHub Repository Link</li>
                        <li>✅ Deployed URL</li>
                    </ul>
                </div>
                
                <div class="ship-actions">
                    <a href="/proof" class="btn btn-primary btn-large" data-route="/proof">View Submission</a>
                    <a href="/jt/07-test" class="btn btn-secondary" data-route="/jt/07-test">Back to Tests</a>
                </div>
            </div>
        </div>
    `;
}


// ============================================
// STATUS CHANGE HANDLER
// ============================================

function handleStatusChange(jobId, newStatus) {
    setJobStatus(jobId, newStatus);
    router(); // Re-render to update UI
}

// ============================================
// JOB FUNCTIONS
// ============================================

// Get filtered jobs
function getFilteredJobs() {
    const preferences = getPreferences();
    let filtered = [...jobsData];

    // Keyword filter (AND logic)
    if (currentFilters.keyword) {
        const keyword = currentFilters.keyword.toLowerCase();
        filtered = filtered.filter(job =>
            job.title.toLowerCase().includes(keyword) ||
            job.company.toLowerCase().includes(keyword)
        );
    }

    // Location filter (AND logic)
    if (currentFilters.location !== 'all') {
        filtered = filtered.filter(job => job.location === currentFilters.location);
    }

    // Mode filter (AND logic)
    if (currentFilters.mode !== 'all') {
        filtered = filtered.filter(job => job.mode.toLowerCase() === currentFilters.mode);
    }

    // Experience filter (AND logic)
    if (currentFilters.experience !== 'all') {
        filtered = filtered.filter(job => job.experience.toLowerCase() === currentFilters.experience);
    }

    // Source filter (AND logic)
    if (currentFilters.source !== 'all') {
        filtered = filtered.filter(job => job.source.toLowerCase() === currentFilters.source);
    }

    // Status filter (AND logic)
    if (currentFilters.status !== 'all') {
        filtered = filtered.filter(job => {
            const jobStatus = getJobStatus(job.id);
            return jobStatus.toLowerCase() === currentFilters.status;
        });
    }

    // Match threshold filter
    if (preferences && currentFilters.showOnlyMatches) {
        filtered = filtered.filter(job => {
            const score = calculateMatchScore(job, preferences);
            return score >= preferences.minMatchScore;
        });
    }

    // Sort
    if (currentFilters.sort === 'latest') {
        filtered.sort((a, b) => a.postedDaysAgo - b.postedDaysAgo);
    } else if (currentFilters.sort === 'oldest') {
        filtered.sort((a, b) => b.postedDaysAgo - a.postedDaysAgo);
    } else if (currentFilters.sort === 'match' && preferences) {
        filtered.sort((a, b) => {
            const scoreA = calculateMatchScore(a, preferences);
            const scoreB = calculateMatchScore(b, preferences);
            return scoreB - scoreA; // Descending
        });
    } else if (currentFilters.sort === 'salary') {
        filtered.sort((a, b) => {
            const salaryA = extractSalaryValue(a.salaryRange);
            const salaryB = extractSalaryValue(b.salaryRange);
            return salaryB - salaryA; // Descending
        });
    }

    return filtered;
}

// Extract numeric salary value for sorting
function extractSalaryValue(salaryRange) {
    // Extract first number from salary string
    const match = salaryRange.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
}

// View job details
function viewJob(jobId) {
    const job = jobsData.find(j => j.id === jobId);
    if (!job) return;

    const modalBody = document.getElementById('modalBody');
    const isSaved = isJobSaved(jobId);
    const preferences = getPreferences();
    const matchScore = preferences ? calculateMatchScore(job, preferences) : 0;

    const matchBadge = preferences ? `
        <div class="match-badge ${getMatchScoreClass(matchScore)}" style="margin-bottom: 16px;">
            <span class="match-score">${matchScore}</span>
            <span class="match-label">${getMatchScoreLabel(matchScore)}</span>
        </div>
    ` : '';

    modalBody.innerHTML = `
        ${matchBadge}
        
        <div class="modal-header">
            <div>
                <h2>${job.title}</h2>
                <p class="modal-company">${job.company}</p>
            </div>
            <span class="source-badge source-${job.source.toLowerCase()}">${job.source}</span>
        </div>
        
        <div class="modal-details">
            <div class="modal-detail-item">
                <span class="detail-label">Location</span>
                <span>${job.location} • ${job.mode}</span>
            </div>
            <div class="modal-detail-item">
                <span class="detail-label">Experience</span>
                <span>${job.experience}</span>
            </div>
            <div class="modal-detail-item">
                <span class="detail-label">Salary</span>
                <span>${job.salaryRange}</span>
            </div>
            <div class="modal-detail-item">
                <span class="detail-label">Posted</span>
                <span>${job.postedDaysAgo === 0 ? 'Today' : job.postedDaysAgo === 1 ? '1 day ago' : job.postedDaysAgo + ' days ago'}</span>
            </div>
        </div>
        
        <div class="modal-section">
            <h3>Description</h3>
            <p>${job.description}</p>
        </div>
        
        <div class="modal-section">
            <h3>Required Skills</h3>
            <div class="skills-list">
                ${job.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
            </div>
        </div>
        
        <div class="modal-actions">
            <button class="btn btn-secondary" onclick="toggleSaveJob(${job.id})">
                ${isSaved ? '★ Saved' : '☆ Save Job'}
            </button>
            <button class="btn btn-primary" onclick="applyJob('${job.applyUrl}')">Apply Now</button>
        </div>
    `;

    document.getElementById('jobModal').classList.add('active');
}

// Close job modal
function closeJobModal() {
    document.getElementById('jobModal').classList.remove('active');
}

// Apply to job
function applyJob(url) {
    window.open(url, '_blank');
}

// Toggle save job
function toggleSaveJob(jobId) {
    const savedJobs = getSavedJobIds();
    const index = savedJobs.indexOf(jobId);

    if (index > -1) {
        savedJobs.splice(index, 1);
    } else {
        savedJobs.push(jobId);
    }

    localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
    router(); // Re-render
}

// Check if job is saved
function isJobSaved(jobId) {
    const savedJobs = getSavedJobIds();
    return savedJobs.includes(jobId);
}

// Get saved job IDs
function getSavedJobIds() {
    const saved = localStorage.getItem('savedJobs');
    return saved ? JSON.parse(saved) : [];
}

// ============================================
// SETTINGS HANDLERS
// ============================================

function handleSavePreferences() {
    const roleKeywords = document.getElementById('roleKeywords').value
        .split(',')
        .map(k => k.trim())
        .filter(k => k);

    const locationSelect = document.getElementById('preferredLocations');
    const preferredLocations = Array.from(locationSelect.selectedOptions).map(opt => opt.value);

    const modeCheckboxes = document.querySelectorAll('input[name="mode"]:checked');
    const preferredMode = Array.from(modeCheckboxes).map(cb => cb.value);

    const experienceLevel = document.getElementById('experienceLevel').value;

    const skills = document.getElementById('skills').value
        .split(',')
        .map(s => s.trim())
        .filter(s => s);

    const minMatchScore = parseInt(document.getElementById('minMatchScore').value);

    const preferences = {
        roleKeywords,
        preferredLocations,
        preferredMode,
        experienceLevel,
        skills,
        minMatchScore
    };

    savePreferences(preferences);
    alert('Preferences saved successfully!');
}

function handleResetPreferences() {
    if (confirm('Are you sure you want to reset all preferences?')) {
        resetPreferences();
        router(); // Re-render to show empty form
    }
}


function handleToggleMatches(checked) {
    currentFilters.showOnlyMatches = checked;
    router();
}

function handleClearFilters() {
    // Reset all filters to default
    currentFilters = {
        keyword: '',
        location: 'all',
        mode: 'all',
        experience: 'all',
        source: 'all',
        status: 'all',
        sort: 'latest',
        showOnlyMatches: false
    };
    router();
}

function handleTestItemChange(testId, checked) {
    setTestItem(testId, checked);
    router(); // Re-render to update progress
}

function handleResetTests() {
    if (confirm('Are you sure you want to reset all test items? This will uncheck all tests.')) {
        resetTestChecklist();
        router();
    }
}

// Handle proof link input changes
function handleProofLinkChange(field, value) {
    const links = getProofLinks();
    links[field] = value;
    setProofLinks(links);

    // Validate and show feedback
    const validationEl = document.getElementById(`${field.replace('Link', 'Validation')}`);
    if (validationEl) {
        if (value && !validateURL(value)) {
            validationEl.textContent = '⚠ Invalid URL format';
            validationEl.className = 'validation-message error';
        } else if (value) {
            validationEl.textContent = '✓ Valid URL';
            validationEl.className = 'validation-message success';
        } else {
            validationEl.textContent = '';
        }
    }

    // Re-render to update status
    router();
}

// Handle copy submission button
function handleCopySubmission() {
    const submissionText = getSubmissionText();

    // Copy to clipboard
    navigator.clipboard.writeText(submissionText).then(() => {
        // Show success feedback
        const btn = document.getElementById('copySubmissionBtn');
        if (btn) {
            const originalText = btn.textContent;
            btn.textContent = '✓ Copied to Clipboard!';
            btn.style.backgroundColor = '#2E7D32';

            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.backgroundColor = '';
            }, 2000);
        }
    }).catch(err => {
        console.error('Failed to copy:', err);
        alert('Failed to copy to clipboard. Please try again.');
    });
}

// Make functions globally accessible for inline event handlers (browser only)
if (typeof window !== 'undefined') {
    window.handleTestItemChange = handleTestItemChange;
    window.handleResetTests = handleResetTests;
    window.handleProofLinkChange = handleProofLinkChange;
    window.handleCopySubmission = handleCopySubmission;
}


// Setup test checklist listeners
function setupTestChecklistListeners() {
    // Add event listeners to all test checkboxes
    const checkboxes = document.querySelectorAll('.test-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const testId = e.target.getAttribute('data-test-id');
            const checked = e.target.checked;
            setTestItem(testId, checked);
            router(); // Re-render to update progress
        });
    });

    // Add event listener to reset button
    const resetBtn = document.getElementById('resetTestsBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to reset all test items? This will uncheck all tests.')) {
                resetTestChecklist();
                router();
            }
        });
    }
}


// Setup proof page listeners
function setupProofPageListeners() {
    // Add event listeners to artifact input fields
    const lovableInput = document.getElementById('lovableLink');
    const githubInput = document.getElementById('githubLink');
    const deployedInput = document.getElementById('deployedLink');

    if (lovableInput) {
        lovableInput.addEventListener('input', (e) => {
            handleProofLinkChange('lovableLink', e.target.value);
        });
    }

    if (githubInput) {
        githubInput.addEventListener('input', (e) => {
            handleProofLinkChange('githubLink', e.target.value);
        });
    }

    if (deployedInput) {
        deployedInput.addEventListener('input', (e) => {
            handleProofLinkChange('deployedLink', e.target.value);
        });
    }

    // Add event listener to copy submission button
    const copyBtn = document.getElementById('copySubmissionBtn');
    if (copyBtn) {
        copyBtn.addEventListener('click', handleCopySubmission);
    }
}


// Setup filter listeners
function setupFilterListeners() {
    const keywordFilter = document.getElementById('keywordFilter');
    const locationFilter = document.getElementById('locationFilter');
    const modeFilter = document.getElementById('modeFilter');
    const experienceFilter = document.getElementById('experienceFilter');
    const sourceFilter = document.getElementById('sourceFilter');
    const statusFilter = document.getElementById('statusFilter');
    const sortFilter = document.getElementById('sortFilter');

    if (keywordFilter) {
        keywordFilter.addEventListener('input', (e) => {
            currentFilters.keyword = e.target.value;
            router();
        });
    }

    if (locationFilter) {
        locationFilter.addEventListener('change', (e) => {
            currentFilters.location = e.target.value;
            router();
        });
    }

    if (modeFilter) {
        modeFilter.addEventListener('change', (e) => {
            currentFilters.mode = e.target.value;
            router();
        });
    }

    if (experienceFilter) {
        experienceFilter.addEventListener('change', (e) => {
            currentFilters.experience = e.target.value;
            router();
        });
    }

    if (sourceFilter) {
        sourceFilter.addEventListener('change', (e) => {
            currentFilters.source = e.target.value;
            router();
        });
    }

    if (statusFilter) {
        statusFilter.addEventListener('change', (e) => {
            currentFilters.status = e.target.value;
            router();
        });
    }

    if (sortFilter) {
        sortFilter.addEventListener('change', (e) => {
            currentFilters.sort = e.target.value;
            router();
        });
    }

    // Settings page slider
    const minMatchScore = document.getElementById('minMatchScore');
    if (minMatchScore) {
        minMatchScore.addEventListener('input', (e) => {
            document.getElementById('scoreValue').textContent = e.target.value;
        });
    }
}

// ============================================
// ROUTER & NAVIGATION
// ============================================

// Router function
function router() {
    const path = window.location.pathname;
    const route = routes[path] || routes['/'];

    // Update page title
    document.title = `${route.title} - KodNest Job Tracker`;

    // Render page content
    const app = document.getElementById('app');
    app.innerHTML = route.render();

    // Update active navigation link
    updateActiveNavLink(path);

    // Setup filter listeners if on dashboard or saved
    if (path === '/dashboard' || path === '/saved') {
        setupFilterListeners();
    }

    // Setup test checklist listeners if on test page
    if (path === '/jt/07-test') {
        setupTestChecklistListeners();
    }

    // Setup proof page listeners if on proof page
    if (path === '/proof') {
        setupProofPageListeners();
    }
}

// Update active navigation link
function updateActiveNavLink(currentPath) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('data-route');
        if (linkPath === currentPath || (currentPath === '/' && linkPath === '/')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Handle navigation clicks
function handleNavigation(e) {
    const target = e.target.closest('.nav-link');
    if (!target) return;

    e.preventDefault();
    const path = target.getAttribute('data-route');

    // Update browser history
    window.history.pushState({}, '', path);

    // Route to new page
    router();

    // Close mobile menu if open
    closeMobileMenu();
}

// Mobile menu toggle
function toggleMobileMenu() {
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
}

// Close mobile menu
function closeMobileMenu() {
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    navToggle.classList.remove('active');
    navLinks.classList.remove('active');
}

// ============================================
// DIGEST EVENT HANDLERS
// ============================================

function handleGenerateDigest() {
    const digest = generateDigest();
    if (digest) {
        router(); // Re-render to show digest
    }
}

function handleRegenerateDigest() {
    if (confirm('Are you sure you want to regenerate today\'s digest? This will replace the existing one.')) {
        // Remove existing digest
        localStorage.removeItem(getDigestKey());
        // Generate new one
        handleGenerateDigest();
    }
}

function handleCopyDigest() {
    const digest = loadTodayDigest();
    if (digest) {
        copyDigestToClipboard(digest);
    }
}

function handleEmailDraft() {
    const digest = loadTodayDigest();
    if (digest) {
        createEmailDraft(digest);
    }
}


// Initialize app
function init() {
    // Handle navigation clicks
    document.addEventListener('click', handleNavigation);

    // Handle browser back/forward buttons
    window.addEventListener('popstate', router);

    // Handle mobile menu toggle
    const navToggle = document.getElementById('navToggle');
    navToggle.addEventListener('click', toggleMobileMenu);

    // Initial route
    router();
}

// Start app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
