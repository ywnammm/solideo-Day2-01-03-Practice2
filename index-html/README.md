# 🌍 AI 여행 플래너 - HTML 버전

순수 HTML, CSS, JavaScript로 구현된 프로페셔널 여행 계획 애플리케이션입니다.

## 📁 파일 구조

```
index-html/
├── index.html          # 메인 HTML 파일
├── styles.css          # 전체 스타일시트
├── app.js             # JavaScript 로직
└── README.md          # 문서
```

## 🚀 실행 방법

### 1. 직접 열기
브라우저에서 `index.html` 파일을 직접 열기만 하면 됩니다.

```bash
# Windows
start index.html

# Mac
open index.html

# Linux
xdg-open index.html
```

### 2. 로컬 서버 사용 (권장)

#### Python 사용
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

#### Node.js 사용
```bash
npx http-server -p 8000
```

#### VS Code Live Server 사용
1. VS Code에서 `index.html` 열기
2. 우클릭 → "Open with Live Server"

그 후 브라우저에서 `http://localhost:8000/index.html` 접속

## ✨ 주요 기능

### 1단계: 여행 정보 입력
- 출발지 및 목적지 입력
- 출발 시간 선택
- 여행 기간 설정 (1~14일)

### 2단계: 취향 선택
- **관심사**: 자연/풍경, 문화/역사, 맛집 탐방, 사진 명소, 쇼핑, 나이트라이프
- **음식 취향**: 한식, 양식, 일식, 중식, 카페/디저트, 길거리 음식
- **예산**: 저렴하게 / 적당하게 / 럭셔리하게
- **여행 스타일**: 느긋하게 / 적당하게 / 알차게

### 3단계: 여행 계획 결과
- 전체 요약 (기간, 비용, 거리)
- Day별 상세 일정
- 지도 시각화 (Google Maps API 연동 가능)
- 대중교통 정보 (KTX, 지하철, 버스)
- 관광지 및 맛집 추천
- 일정 다운로드 (JSON)
- 공유하기 기능

## 🛠️ 기술 스택

- **HTML5**: 시맨틱 마크업
- **CSS3**:
  - 커스텀 CSS 변수
  - Flexbox & Grid 레이아웃
  - 애니메이션 & 트랜지션
  - 반응형 디자인
- **JavaScript (ES6+)**:
  - 순수 Vanilla JS (프레임워크 없음)
  - DOM 조작
  - 상태 관리
  - 비동기 처리

## 🎨 디자인 특징

### 색상 팔레트
- **Primary**: Blue & Indigo Gradient
- **Success**: Green
- **Warning**: Yellow/Orange
- **Accent**: Purple

### 애니메이션
- Fade In
- Slide Up
- Bounce
- Spin
- Pulse

### 반응형 디자인
- 모바일: < 768px
- 태블릿: 768px ~ 1024px
- 데스크톱: > 1024px

## 📋 브라우저 호환성

| 브라우저 | 최소 버전 |
|---------|----------|
| Chrome  | 90+      |
| Firefox | 88+      |
| Safari  | 14+      |
| Edge    | 90+      |

## 🔧 커스터마이징

### 색상 변경
`styles.css`의 CSS 변수를 수정:

```css
:root {
    --blue-600: #0284c7;
    --indigo-600: #4f46e5;
    /* ... */
}
```

### 샘플 데이터 수정
`app.js`의 `generateTravelPlan()` 함수에서 샘플 데이터 수정:

```javascript
const sampleAttractions = [
    {
        name: '새로운 관광지',
        description: '설명',
        // ...
    }
];
```

### Google Maps API 연동
1. [Google Cloud Console](https://console.cloud.google.com/)에서 API 키 발급
2. `index.html`에 Google Maps 스크립트 추가:

```html
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY"></script>
```

3. `app.js`의 `renderMapPlaceholder()` 함수를 실제 지도 렌더링 로직으로 교체

## 📱 주요 기능 설명

### 상태 관리
```javascript
const state = {
    currentStep: 0,
    tripInput: { ... },
    preferences: { ... },
    travelPlan: null
};
```

### 단계 전환
```javascript
function goToStep(step) {
    // 0: 여행 정보 입력
    // 1: 취향 선택
    // 2: 결과 표시
}
```

### 데이터 저장
- 일정 다운로드: JSON 파일로 저장
- 브라우저 localStorage 사용 가능 (추가 구현 필요)

## 🚀 배포

### GitHub Pages
1. GitHub 저장소 생성
2. `index-html` 폴더 내용을 루트로 복사
3. Settings → Pages → Source 설정
4. 배포된 URL로 접속

### Netlify
1. [Netlify](https://www.netlify.com/) 계정 생성
2. "New site from Git" 또는 드래그 앤 드롭
3. `index-html` 폴더 업로드
4. 자동 배포

### Vercel
1. [Vercel](https://vercel.com/) 계정 생성
2. "New Project" → 폴더 업로드
3. 배포 설정 완료

## 💡 추가 기능 제안

### 구현 가능한 기능들
- [ ] 브라우저 localStorage에 여행 계획 저장
- [ ] 인쇄 기능 (CSS @media print)
- [ ] 다국어 지원 (i18n)
- [ ] 날씨 API 연동
- [ ] 실제 대중교통 API 연동
- [ ] 카카오맵/네이버맵 연동
- [ ] PWA (Progressive Web App) 지원
- [ ] 오프라인 지원 (Service Worker)

## 📄 라이선스

MIT License

## 🤝 기여

개선 사항이나 버그 리포트는 언제든지 환영합니다!

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 등록해주세요.

---

**© 2025 AI Travel Planner. 완벽한 여행의 시작.**
