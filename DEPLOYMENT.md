# Vercel 배포 가이드

## 배포 전 체크리스트

### ✅ 완료된 항목
- [x] TypeScript 설정 확인
- [x] Next.js 설정 확인
- [x] API Route 설정 확인
- [x] 서버 사이드 캐싱 적용
- [x] SEO 최적화 (title, meta description, h1/h2 구조)
- [x] 빌드 스크립트 확인
- [x] 린터 에러 없음

### 배포 시 확인 사항

1. **환경 변수 (필수)**
   
   Vercel 대시보드에서 다음 환경 변수를 설정해야 합니다:
   
   | 변수명 | 값 | 설명 |
   |--------|-----|------|
   | `NEXT_PUBLIC_APP_ENV` | `production` 또는 `development` | 환경 설정 (운영/개발) |
   | `NEXT_PUBLIC_APP_BRAND` | `tourvis` | 브랜드명 |
   
   **운영 환경 설정:**
   - `NEXT_PUBLIC_APP_ENV=production`
   - 도메인: `tourvis.com`
   
   **개발 환경 설정:**
   - `NEXT_PUBLIC_APP_ENV=development`
   - 도메인: `d.tourvis.com`
   
   **Vercel에서 환경 변수 설정 방법:**
   1. Vercel 대시보드 → 프로젝트 선택
   2. Settings → Environment Variables
   3. 위의 환경 변수들을 추가
   4. 각 환경(Production, Preview, Development)에 맞게 설정
   
   **환경별 설정 예시:**
   
   **운영 환경 (Production):**
   ```
   NEXT_PUBLIC_APP_ENV=production
   NEXT_PUBLIC_APP_BRAND=tourvis
   ```
   → 도메인: `tourvis.com`
   
   **개발 환경 (Preview/Development):**
   ```
   NEXT_PUBLIC_APP_ENV=development
   NEXT_PUBLIC_APP_BRAND=tourvis
   ```
   → 도메인: `d.tourvis.com`

2. **빌드 설정**
   - Framework: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next` (기본값)
   - Install Command: `npm install`

3. **API 엔드포인트**
   - `/api/promotions` - 모든 프로모션 데이터 조회
   - 외부 API: `https://api.tourvis.com/fe/inventory/getInventoryList`

4. **캐싱 전략**
   - 서버 사이드: React cache + Next.js fetch 캐싱 (5분)
   - HTTP 캐싱: 5분 (stale-while-revalidate: 10분)

5. **성능 최적화**
   - 서버 사이드에서 모든 카테고리 데이터를 한 번에 가져옴
   - 클라이언트에서 초기 로드 시 한 번만 API 호출
   - 탭 전환 시 추가 API 호출 없음

## 배포 방법

1. GitHub에 코드 푸시
2. Vercel 대시보드에서 프로젝트 import
3. 자동으로 빌드 및 배포 진행

## 보안 업데이트

### Next.js 버전 업데이트
- 현재 버전: Next.js 16.1.0 (최신 안전 버전)
- React 19와 호환
- 보안 취약점 패치 적용

### 업데이트 후 확인 사항
```bash
npm install
npm run build
```
빌드가 성공하는지 확인하세요.

## Nginx 도메인 설정

### 환경별 도메인
- **운영 환경**: `tourvis.com`
- **개발 환경**: `d.tourvis.com`

### Nginx 설정 예시
```nginx
# 운영 환경
server {
    listen 80;
    server_name tourvis.com;
    
    location / {
        proxy_pass http://vercel-deployment-url;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# 개발 환경
server {
    listen 80;
    server_name d.tourvis.com;
    
    location / {
        proxy_pass http://vercel-deployment-url;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 문제 해결

### 빌드 실패 시
- `npm run build` 로컬에서 실행하여 에러 확인
- Node.js 버전 확인 (권장: 18.x 이상)
- 환경 변수가 올바르게 설정되었는지 확인

### API 호출 실패 시
- 외부 API 서버 상태 확인
- CORS 설정 확인 (필요시)

### 환경 변수 관련
- 환경 변수가 설정되지 않으면 기본값(production)으로 동작
- Vercel 대시보드에서 환경 변수 확인 및 재배포
