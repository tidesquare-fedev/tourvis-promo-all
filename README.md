# 투어비스 프로모션 모아보기

공통, 항공, 호텔, 투티, 패키지의 프로모션을 한눈에 볼 수 있는 페이지입니다.

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 3. 빌드

```bash
npm run build
```

### 4. 프로덕션 실행

```bash
npm start
```

## 프로젝트 구조

```
├── app/
│   ├── layout.tsx          # 루트 레이아웃 (GNB, 푸터 포함)
│   ├── page.tsx            # 프로모션 메인 페이지
│   └── globals.css         # 전역 스타일
├── base/
│   └── web-component-wrapper.tsx  # 웹 컴포넌트 래퍼
├── registry/
│   ├── pc/
│   │   └── block/
│   │       └── pc-gnb/
│   │           └── tourvis-pc-gnb.tsx  # PC GNB 컴포넌트
│   └── mo/
│       └── block/
│           └── mo-bottom-tab-bar/
│               └── tourvis-bottom-tab-bar.tsx  # 모바일 하단 탭바
├── components/
│   └── ui/                 # UI 컴포넌트 (Tabs, Card 등)
└── lib/
    ├── api.ts              # API 호출 로직
    └── utils.ts            # 유틸리티 함수
```

## 주요 기능

- **카테고리별 프로모션 조회**: 공통, 항공, 호텔, 투티, 패키지별로 프로모션을 조회할 수 있습니다.
- **탭 기반 UI**: 각 카테고리를 탭으로 전환하여 볼 수 있습니다.
- **반응형 디자인**: PC와 모바일 환경을 모두 지원합니다.
- **GNB 및 푸터**: 기존 GNB와 푸터 컴포넌트를 그대로 사용합니다.


## 기술 스택

- Next.js 16.1.0
- React 19.2.0
- TypeScript
- Tailwind CSS
- Radix UI

## 환경 변수

프로젝트는 다음 환경 변수를 사용합니다:

- `NEXT_PUBLIC_APP_ENV`: `production` (운영) 또는 `development` (개발)
- `NEXT_PUBLIC_APP_BRAND`: `tourvis`

### 환경별 도메인
- **운영 환경**: `tourvis.com`
- **개발 환경**: `d.tourvis.com`

로컬 개발 시 `.env.local` 파일을 생성하여 환경 변수를 설정할 수 있습니다.
