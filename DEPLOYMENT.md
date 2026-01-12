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

**중요**: `basePath: "/marketing/all"`이 설정되어 있으므로, Nginx에서도 이 경로를 고려해야 합니다.

```nginx
# 운영 환경
server {
    listen 80;
    server_name tourvis.com;
    
    # basePath를 포함한 전체 경로 프록시
    location /marketing/all {
        proxy_pass http://vercel-deployment-url;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Next.js Image Optimizer를 위한 설정
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Prefix /marketing/all;
        
        # 큰 이미지 파일을 위한 버퍼 설정
        proxy_buffering on;
        proxy_buffer_size 4k;
        proxy_buffers 8 4k;
        proxy_busy_buffers_size 8k;
        
        # 타임아웃 설정
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}

# 개발 환경
server {
    listen 80;
    server_name d.tourvis.com;
    
    # basePath를 포함한 전체 경로 프록시
    location /marketing/all {
        proxy_pass http://vercel-deployment-url;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Next.js Image Optimizer를 위한 설정
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Prefix /marketing/all;
        
        # 큰 이미지 파일을 위한 버퍼 설정
        proxy_buffering on;
        proxy_buffer_size 4k;
        proxy_buffers 8 4k;
        proxy_busy_buffers_size 8k;
        
        # 타임아웃 설정
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

**참고**: 
- `proxy_pass` URL 끝에 슬래시(`/`)를 붙이지 마세요. Next.js가 `basePath`를 올바르게 처리할 수 있도록 합니다.
- Nginx 설정 변경 후 `nginx -t`로 설정 파일 검증 후 `nginx -s reload`로 재시작하세요.

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

### Nginx 프록시에서 이미지가 안 나올 때

**증상**: Nginx를 통한 하위 도메인에서 `_next/image` 요청이 400 에러 발생

**원인**: 
- `basePath: "/marketing/all"` 설정과 Nginx 프록시 경로 불일치
- Next.js Image Optimizer가 상대 경로를 올바르게 생성하지 못함

**해결 방법**:

1. **Nginx 설정 확인** (위의 Nginx 설정 예시 참고)
   - `location /marketing/all` 블록이 올바르게 설정되었는지 확인
   - `proxy_pass` URL 끝에 슬래시가 없는지 확인

2. **Next.js 설정 확인**
   ```bash
   # next.config.mjs에서 basePath가 올바르게 설정되었는지 확인
   basePath: "/marketing/all"
   ```

3. **임시 해결책 (이미지 최적화 비활성화)**
   Nginx 설정이 복잡한 경우, 이미지 최적화를 비활성화하고 원본 이미지를 직접 사용할 수 있습니다:
   ```javascript
   // next.config.mjs
   images: {
     unoptimized: true, // Image Optimizer 비활성화
   }
   ```
   **주의**: 이 경우 WebP 변환은 되지 않지만, 이미지는 정상적으로 표시됩니다.

4. **디버깅**
   - 브라우저 개발자 도구 → Network 탭에서 `_next/image` 요청 확인
   - 요청 URL이 `https://your-domain.com/marketing/all/_next/image?...` 형태인지 확인
   - Nginx 액세스 로그 확인: `tail -f /var/log/nginx/access.log`
