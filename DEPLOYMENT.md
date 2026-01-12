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

1. **환경 변수**
   - 현재 외부 API를 직접 호출하므로 환경 변수 불필요
   - 필요시 Vercel 대시보드에서 환경 변수 설정 가능

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

## 문제 해결

### 빌드 실패 시
- `npm run build` 로컬에서 실행하여 에러 확인
- Node.js 버전 확인 (권장: 18.x 이상)

### API 호출 실패 시
- 외부 API 서버 상태 확인
- CORS 설정 확인 (필요시)
