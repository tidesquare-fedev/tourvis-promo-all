# 투어비스 프로모션 페이지

항공, 숙소, 투어, 패키지의 프로모션을 한 곳에서 확인할 수 있는 통합 프로모션 페이지입니다.

## 주요 기능

- **SSR/ISR**: 서버 사이드 렌더링과 60초 재검증으로 안정적이고 빠른 초기 로딩
- **WebP 이미지 최적화**: Next.js Image Optimizer를 통한 자동 WebP 변환
- **캐싱 전략**: 서버/클라이언트 다층 캐싱으로 성능 최적화
- **반응형 디자인**: 데스크톱/모바일 최적화 UI
- **SEO 최적화**: 메타데이터 및 시맨틱 HTML 구조

## 기술 스택

- **프레임워크**: Next.js 16 (App Router, Turbopack)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS v4
- **UI 컴포넌트**: Radix UI
- **폰트**: Pretendard

## 프로젝트 구조

```
├── app/
│   ├── api/
│   │   └── promotions/          # 프로모션 데이터 API 라우트
│   ├── globals.css              # 전역 스타일
│   ├── layout.tsx               # 루트 레이아웃 (GNB, 푸터)
│   └── page.tsx                 # 메인 페이지 (SSR)
├── components/
│   ├── promotion-card.tsx       # 프로모션 카드 컴포넌트
│   ├── promotion-page-client.tsx # 클라이언트 페이지 컴포넌트
│   ├── tourvis-cont-top.tsx     # 모바일 헤더
│   ├── tourvis-top-btn.tsx      # Top 버튼
│   └── ui/                      # Radix UI 컴포넌트
├── lib/
│   ├── api.ts                   # API 타입 정의
│   ├── constants.ts             # 상수 정의
│   ├── env.ts                   # 환경 변수 유틸
│   ├── image-utils.ts           # 이미지 유틸리티
│   └── server-api.ts            # 서버 사이드 API 호출
└── next.config.mjs              # Next.js 설정
```



## 개발 서버 실행

```bash
npm install
npm run dev
```

http://localhost:3000/marketing/all 에서 확인 가능합니다.

## 빌드 및 배포

```bash
npm run build
npm start
```

### Vercel 배포



## 성능 최적화

- **서버 사이드 캐싱**: React cache + Next.js fetch (60초)
- **HTTP 캐싱**: s-maxage=60, stale-while-revalidate=300
- **이미지 최적화**: WebP 포맷, lazy loading
- **병렬 데이터 페칭**: 모든 카테고리 동시 로드

## 브라우저 지원

- Chrome (최신 2개 버전)
- Safari (최신 2개 버전)
- Firefox (최신 2개 버전)
- Edge (최신 2개 버전)

## 라이선스

Proprietary - 투어비스 내부 프로젝트
