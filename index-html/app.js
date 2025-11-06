// State Management
const state = {
    currentStep: 0,
    tripInput: {
        departure: null,
        destination: null,
        departureTime: '',
        duration: 1
    },
    preferences: {
        interests: [],
        foodPreferences: [],
        budget: 'medium',
        pace: 'moderate'
    },
    travelPlan: null
};

// DOM Elements
const elements = {
    // Steps
    step1: document.getElementById('step1'),
    step2: document.getElementById('step2'),
    step3: document.getElementById('step3'),

    // Progress
    step1Circle: document.getElementById('step1Circle'),
    step2Circle: document.getElementById('step2Circle'),
    progressLine: document.getElementById('progressLine'),
    progressSteps: document.getElementById('progressSteps'),

    // Forms
    tripForm: document.getElementById('tripForm'),
    preferencesForm: document.getElementById('preferencesForm'),

    // Inputs
    departureAddress: document.getElementById('departureAddress'),
    destinationAddress: document.getElementById('destinationAddress'),
    departureTime: document.getElementById('departureTime'),
    duration: document.getElementById('duration'),
    durationBadge: document.getElementById('durationBadge'),

    // Buttons
    backBtn: document.getElementById('backBtn'),
    generateBtn: document.getElementById('generateBtn'),
    downloadBtn: document.getElementById('downloadBtn'),
    shareBtn: document.getElementById('shareBtn'),
    resetBtn: document.getElementById('resetBtn'),

    // Loading
    loadingSpinner: document.getElementById('loadingSpinner'),

    // Results
    totalDaysResult: document.getElementById('totalDaysResult'),
    overviewDays: document.getElementById('overviewDays'),
    overviewCost: document.getElementById('overviewCost'),
    overviewDistance: document.getElementById('overviewDistance'),
    itineraryContainer: document.getElementById('itineraryContainer')
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    setMinDateTime();
});

function initializeEventListeners() {
    // Duration slider
    elements.duration.addEventListener('input', (e) => {
        const value = e.target.value;
        state.tripInput.duration = parseInt(value);
        elements.durationBadge.textContent = `${value}일`;
    });

    // Trip form submit
    elements.tripForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleStep1Submit();
    });

    // Preferences form submit
    elements.preferencesForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleGeneratePlan();
    });

    // Back button
    elements.backBtn.addEventListener('click', () => {
        goToStep(0);
    });

    // Reset button
    elements.resetBtn.addEventListener('click', () => {
        resetApp();
    });

    // Download button
    elements.downloadBtn.addEventListener('click', () => {
        downloadPlan();
    });

    // Share button
    elements.shareBtn.addEventListener('click', () => {
        sharePlan();
    });

    // Preference buttons
    setupPreferenceButtons();
}

function setupPreferenceButtons() {
    // Interest buttons
    document.querySelectorAll('[data-interest]').forEach(btn => {
        btn.addEventListener('click', function() {
            const interest = this.dataset.interest;
            toggleSelection(this, state.preferences.interests, interest);
            updateGenerateButton();
        });
    });

    // Food buttons
    document.querySelectorAll('[data-food]').forEach(btn => {
        btn.addEventListener('click', function() {
            const food = this.dataset.food;
            toggleSelection(this, state.preferences.foodPreferences, food);
            updateGenerateButton();
        });
    });

    // Budget buttons (single selection)
    document.querySelectorAll('[data-budget]').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('[data-budget]').forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
            state.preferences.budget = this.dataset.budget;
        });
    });

    // Set default budget
    document.querySelector('[data-budget="medium"]').classList.add('selected');

    // Pace buttons (single selection)
    document.querySelectorAll('[data-pace]').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('[data-pace]').forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
            state.preferences.pace = this.dataset.pace;
        });
    });

    // Set default pace
    document.querySelector('[data-pace="moderate"]').classList.add('selected');
}

function toggleSelection(button, array, value) {
    const index = array.indexOf(value);
    if (index > -1) {
        array.splice(index, 1);
        button.classList.remove('selected');
    } else {
        array.push(value);
        button.classList.add('selected');
    }
}

function updateGenerateButton() {
    const isValid = state.preferences.interests.length > 0 &&
                    state.preferences.foodPreferences.length > 0;
    elements.generateBtn.disabled = !isValid;
}

function setMinDateTime() {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    elements.departureTime.min = now.toISOString().slice(0, 16);
}

function handleStep1Submit() {
    state.tripInput.departure = {
        address: elements.departureAddress.value,
        lat: 37.5665,
        lng: 126.9780
    };

    state.tripInput.destination = {
        address: elements.destinationAddress.value,
        lat: 35.1796,
        lng: 129.0756
    };

    state.tripInput.departureTime = elements.departureTime.value;

    goToStep(1);
}

async function handleGeneratePlan() {
    showLoading(true);

    try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        const plan = await generateTravelPlan();
        state.travelPlan = plan;
        goToStep(2);
        renderTravelPlan();
    } catch (error) {
        console.error('Failed to generate plan:', error);
        alert('여행 계획 생성에 실패했습니다. 다시 시도해주세요.');
    } finally {
        showLoading(false);
    }
}

function goToStep(step) {
    state.currentStep = step;

    // Hide all steps
    elements.step1.classList.remove('active');
    elements.step2.classList.remove('active');
    elements.step3.classList.remove('active');

    // Show current step
    if (step === 0) {
        elements.step1.classList.add('active');
        elements.step1Circle.classList.add('active');
        elements.step2Circle.classList.remove('active');
        elements.progressLine.classList.remove('active');
        elements.progressSteps.style.display = 'block';
    } else if (step === 1) {
        elements.step2.classList.add('active');
        elements.step1Circle.classList.add('active');
        elements.step2Circle.classList.add('active');
        elements.progressLine.classList.add('active');
        elements.progressSteps.style.display = 'block';
    } else if (step === 2) {
        elements.step3.classList.add('active');
        elements.progressSteps.style.display = 'none';
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showLoading(show) {
    if (show) {
        elements.loadingSpinner.classList.remove('hidden');
    } else {
        elements.loadingSpinner.classList.add('hidden');
    }
}

// Travel Plan Generator
async function generateTravelPlan() {
    const { departure, destination, departureTime, duration } = state.tripInput;
    const { interests, foodPreferences, pace } = state.preferences;

    // Sample data
    const sampleAttractions = [
        {
            id: 'attr-1',
            name: '해운대 해수욕장',
            type: 'attraction',
            description: '한국에서 가장 유명한 해수욕장. 아름다운 백사장과 푸른 바다',
            location: { address: '부산 해운대구', lat: 35.1586, lng: 129.1603 },
            duration: '2시간',
            price: 0,
            rating: 4.6,
            imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400',
            tags: ['nature', 'photo']
        },
        {
            id: 'attr-2',
            name: '감천문화마을',
            type: 'attraction',
            description: '형형색색의 벽화로 유명한 예술 마을',
            location: { address: '부산 사하구', lat: 35.0975, lng: 129.0104 },
            duration: '3시간',
            price: 0,
            rating: 4.5,
            imageUrl: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400',
            tags: ['culture', 'photo']
        },
        {
            id: 'attr-3',
            name: '광안리 해변',
            type: 'attraction',
            description: '광안대교 야경이 아름다운 해변',
            location: { address: '부산 수영구', lat: 35.1530, lng: 129.1189 },
            duration: '2시간',
            price: 0,
            rating: 4.7,
            imageUrl: 'https://images.unsplash.com/photo-1566404791232-af9fe0ae8f8b?w=400',
            tags: ['nature', 'nightlife']
        },
        {
            id: 'attr-4',
            name: '자갈치 시장',
            type: 'attraction',
            description: '한국 최대 수산물 시장',
            location: { address: '부산 중구', lat: 35.0966, lng: 129.0306 },
            duration: '2시간',
            price: 0,
            rating: 4.4,
            imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400',
            tags: ['culture', 'food']
        }
    ];

    const sampleRestaurants = [
        {
            id: 'rest-1',
            name: '밀면 전문점',
            type: 'restaurant',
            description: '부산의 대표 음식 밀면 맛집',
            location: { address: '부산 동구', lat: 35.1475, lng: 129.0583 },
            duration: '1시간',
            price: 9000,
            rating: 4.5,
            tags: ['korean', 'food']
        },
        {
            id: 'rest-2',
            name: '해운대 횟집',
            type: 'restaurant',
            description: '신선한 해산물 전문점',
            location: { address: '부산 해운대구', lat: 35.1595, lng: 129.1625 },
            duration: '1.5시간',
            price: 45000,
            rating: 4.6,
            tags: ['korean', 'food']
        },
        {
            id: 'rest-3',
            name: '카페 오션뷰',
            type: 'restaurant',
            description: '바다가 보이는 프리미엄 카페',
            location: { address: '부산 해운대구', lat: 35.1560, lng: 129.1600 },
            duration: '1시간',
            price: 7000,
            rating: 4.8,
            tags: ['cafe']
        },
        {
            id: 'rest-4',
            name: '씨앗호떡',
            type: 'restaurant',
            description: '부산 명물 씨앗호떡',
            location: { address: '부산 중구', lat: 35.0970, lng: 129.0312 },
            duration: '30분',
            price: 2000,
            rating: 4.7,
            tags: ['street', 'food']
        }
    ];

    // Filter by preferences
    const filteredActivities = [
        ...sampleAttractions.filter(a => a.tags.some(tag => interests.includes(tag))),
        ...sampleRestaurants.filter(r => r.tags.some(tag => foodPreferences.includes(tag)))
    ];

    // Generate itinerary
    const itinerary = [];
    const startDate = new Date(departureTime);
    const activitiesPerDay = pace === 'packed' ? 5 : pace === 'moderate' ? 4 : 3;

    for (let day = 1; day <= duration; day++) {
        const dayDate = new Date(startDate);
        dayDate.setDate(dayDate.getDate() + day - 1);

        const dayActivities = filteredActivities
            .slice((day - 1) * activitiesPerDay, day * activitiesPerDay)
            .map((activity, index) => ({
                ...activity,
                id: `${activity.id}-day${day}-${index}`
            }));

        const transportation = [
            {
                type: day === 1 ? 'train' : 'subway',
                from: day === 1 ? departure.address : destination.address,
                to: day === 1 ? destination.address : dayActivities[0]?.location.address || destination.address,
                departureTime: day === 1 ? new Date(departureTime).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) : '09:00',
                arrivalTime: day === 1 ? formatTime(new Date(new Date(departureTime).getTime() + 2.5 * 60 * 60 * 1000)) : '09:30',
                duration: day === 1 ? '2시간 30분' : '30분',
                price: day === 1 ? 59800 : 1400,
                company: day === 1 ? 'KTX' : '부산지하철'
            },
            ...dayActivities.map((_, idx) => ({
                type: Math.random() > 0.5 ? 'subway' : 'bus',
                from: idx === 0 ? destination.address : dayActivities[idx - 1].location.address,
                to: dayActivities[idx].location.address,
                departureTime: `${9 + idx * 2}:00`,
                arrivalTime: `${9 + idx * 2}:30`,
                duration: '30분',
                price: 1400,
                company: Math.random() > 0.5 ? '부산지하철' : '부산버스'
            }))
        ];

        const totalCost = transportation.reduce((sum, t) => sum + t.price, 0) +
                         dayActivities.reduce((sum, a) => sum + a.price, 0);

        itinerary.push({
            day,
            date: dayDate.toLocaleDateString('ko-KR'),
            transportation: transportation.slice(0, dayActivities.length + 1),
            activities: dayActivities,
            totalDistance: 45.5,
            totalCost
        });
    }

    const totalCost = itinerary.reduce((sum, day) => sum + day.totalCost, 0);
    const totalDistance = itinerary.reduce((sum, day) => sum + day.totalDistance, 0);

    return {
        overview: {
            totalDays: duration,
            totalCost,
            totalDistance
        },
        itinerary
    };
}

function formatTime(date) {
    return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
}

// Render Travel Plan
function renderTravelPlan() {
    const plan = state.travelPlan;

    // Update overview
    elements.totalDaysResult.textContent = plan.overview.totalDays;
    elements.overviewDays.textContent = plan.overview.totalDays;
    elements.overviewCost.textContent = plan.overview.totalCost.toLocaleString();
    elements.overviewDistance.textContent = plan.overview.totalDistance.toFixed(1);

    // Render itinerary
    elements.itineraryContainer.innerHTML = `
        <div style="text-align: center; margin-bottom: 2rem;">
            <h2 style="font-size: 2.25rem; font-weight: bold; color: var(--gray-800); margin-bottom: 0.5rem;">
                <i class="fas fa-calendar" style="color: var(--blue-600); margin-right: 0.75rem;"></i>
                여행 일정
            </h2>
            <p style="color: var(--gray-600);">
                ${plan.itinerary.length}일간의 완벽한 여행 계획이 준비되었습니다
            </p>
        </div>
        ${plan.itinerary.map(day => renderDayCard(day)).join('')}
    `;

    // Add event listeners to day headers
    document.querySelectorAll('.day-header').forEach(header => {
        header.addEventListener('click', function() {
            const content = this.nextElementSibling;
            const icon = this.querySelector('.toggle-icon');
            content.classList.toggle('expanded');
            icon.classList.toggle('fa-chevron-down');
            icon.classList.toggle('fa-chevron-up');
        });
    });
}

function renderDayCard(day) {
    return `
        <div class="day-card">
            <div class="day-header">
                <div class="day-header-left">
                    <div class="day-badge">${day.day}</div>
                    <div>
                        <h3 class="day-title">Day ${day.day}</h3>
                        <p class="day-date">${day.date}</p>
                    </div>
                </div>
                <div class="day-stats">
                    <div class="day-stat">
                        <p class="stat-label">총 비용</p>
                        <p class="stat-value">₩${day.totalCost.toLocaleString()}</p>
                    </div>
                    <div class="day-stat">
                        <p class="stat-label">이동 거리</p>
                        <p class="stat-value">${day.totalDistance}km</p>
                    </div>
                    <i class="fas fa-chevron-down toggle-icon"></i>
                </div>
            </div>
            <div class="day-content expanded">
                ${renderMapPlaceholder()}
                <div class="activity-list">
                    ${day.transportation.map((transport, idx) => `
                        ${renderTransportCard(transport)}
                        ${day.activities[idx] ? renderActivityCard(day.activities[idx], idx) : ''}
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

function renderMapPlaceholder() {
    return `
        <div class="map-placeholder">
            <i class="fas fa-map-marker-alt"></i>
            <h3 class="map-title">지도 미리보기</h3>
            <p class="map-description">
                실제 서비스에서는 Google Maps API를 통해<br>
                실시간 경로와 위치를 시각화합니다.
            </p>
            <div style="background: white; border-radius: 0.5rem; padding: 1.5rem; box-shadow: 0 10px 15px rgba(0,0,0,0.1); max-width: 28rem;">
                <h4 style="font-weight: 600; color: var(--gray-800); margin-bottom: 0.75rem;">표시될 정보:</h4>
                <ul style="text-align: left; color: var(--gray-600); font-size: 0.875rem; list-style: none;">
                    <li style="display: flex; align-items: start; margin-bottom: 0.5rem;">
                        <i class="fas fa-route" style="color: var(--blue-600); margin-right: 0.5rem; margin-top: 0.125rem;"></i>
                        <span>출발지 → 목적지 이동 경로</span>
                    </li>
                    <li style="display: flex; align-items: start; margin-bottom: 0.5rem;">
                        <i class="fas fa-map-marker-alt" style="color: var(--red-500); margin-right: 0.5rem; margin-top: 0.125rem;"></i>
                        <span>관광지, 맛집 위치 마커</span>
                    </li>
                    <li style="display: flex; align-items: start;">
                        <i class="fas fa-map-pin" style="color: var(--green-600); margin-right: 0.5rem; margin-top: 0.125rem;"></i>
                        <span>대중교통 경로 시각화</span>
                    </li>
                </ul>
            </div>
        </div>
    `;
}

function renderTransportCard(transport) {
    const icons = {
        train: 'fa-train',
        bus: 'fa-bus',
        subway: 'fa-subway',
        flight: 'fa-plane',
        walk: 'fa-walking'
    };

    return `
        <div class="transport-card">
            <div class="transport-left">
                <div class="transport-icon">
                    <i class="fas ${icons[transport.type] || 'fa-route'}"></i>
                </div>
                <div>
                    <div class="transport-company">${transport.company} - ${getTransportTypeName(transport.type)}</div>
                    <div class="transport-route">${transport.from} → ${transport.to}</div>
                </div>
            </div>
            <div class="transport-right">
                <div class="transport-time">${transport.departureTime} - ${transport.arrivalTime}</div>
                <div class="transport-details">${transport.duration} • ₩${transport.price.toLocaleString()}</div>
            </div>
        </div>
    `;
}

function getTransportTypeName(type) {
    const names = {
        train: 'KTX',
        bus: '버스',
        subway: '지하철',
        flight: '비행기',
        walk: '도보'
    };
    return names[type] || '이동';
}

function renderActivityCard(activity, index) {
    return `
        <div class="activity-card">
            <div class="activity-header">
                <div class="activity-content">
                    <div class="activity-top">
                        <div class="activity-number">${index + 1}</div>
                        <h4 class="activity-name">${activity.name}</h4>
                    </div>
                    <p class="activity-description">${activity.description}</p>
                    <div class="activity-details">
                        <div class="activity-detail">
                            <i class="fas fa-map-marker-alt" style="color: var(--blue-600);"></i>
                            <span>${activity.location.address}</span>
                        </div>
                        <div class="activity-detail">
                            <i class="fas fa-clock" style="color: var(--green-600);"></i>
                            <span>${activity.duration}</span>
                        </div>
                        <div class="activity-detail">
                            <i class="fas fa-dollar-sign" style="color: var(--yellow-500);"></i>
                            <span>${activity.price === 0 ? '무료' : `₩${activity.price.toLocaleString()}`}</span>
                        </div>
                        <div class="activity-detail" style="color: var(--yellow-500); font-weight: 600;">
                            <i class="fas fa-star" style="color: var(--yellow-500);"></i>
                            <span>${activity.rating}</span>
                        </div>
                    </div>
                    <div class="activity-tags">
                        ${activity.tags.map(tag => `<span class="activity-tag">#${tag}</span>`).join('')}
                    </div>
                </div>
                ${activity.imageUrl ? `<img src="${activity.imageUrl}" alt="${activity.name}" class="activity-image">` : ''}
            </div>
            <div class="activity-footer">
                <i class="fas ${activity.type === 'restaurant' ? 'fa-utensils activity-type-icon' : 'fa-camera'}" style="color: ${activity.type === 'restaurant' ? 'var(--orange-500)' : 'var(--purple-500)'}"></i>
                <span>${activity.type === 'restaurant' ? '맛집' : '관광지'}</span>
            </div>
        </div>
    `;
}

// Actions
function downloadPlan() {
    const dataStr = JSON.stringify(state.travelPlan, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'travel-plan.json';
    link.click();
    URL.revokeObjectURL(url);
}

async function sharePlan() {
    if (navigator.share) {
        try {
            await navigator.share({
                title: '내 여행 계획',
                text: `${state.travelPlan.overview.totalDays}일 여행 계획이 완성되었습니다!`,
                url: window.location.href
            });
        } catch (err) {
            console.log('Share failed:', err);
        }
    } else {
        alert('공유 기능은 지원되지 않는 브라우저입니다.');
    }
}

function resetApp() {
    state.currentStep = 0;
    state.tripInput = {
        departure: null,
        destination: null,
        departureTime: '',
        duration: 1
    };
    state.preferences = {
        interests: [],
        foodPreferences: [],
        budget: 'medium',
        pace: 'moderate'
    };
    state.travelPlan = null;

    // Reset forms
    elements.tripForm.reset();
    elements.duration.value = 1;
    elements.durationBadge.textContent = '1일';

    // Reset preferences
    document.querySelectorAll('.option-btn').forEach(btn => btn.classList.remove('selected'));
    document.querySelector('[data-budget="medium"]').classList.add('selected');
    document.querySelector('[data-pace="moderate"]').classList.add('selected');

    goToStep(0);
}
