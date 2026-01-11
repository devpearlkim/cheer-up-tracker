# CheerUp Tracker 🌱

일상의 작은 노력을 GitHub 잔디처럼 시각화하여 기록하는 서비스입니다.

사소한 습관도 데이터로 축적될 때 강력한 동기부여가 됩니다. 스스로를 응원하고, 작심삼일을 꾸준함으로 바꾸는 경험을 시작해 보세요.

**주요 기능:**

- 활동 기록 및 카테고리 관리
- GitHub 잔디 스타일의 시각화

## Architecture Decisions

### 1. Schema-First: End-to-End Type Safety

DB 스키마를 Single Source of Truth로 정의하고, Drizzle-Zod를 활용해 API Validation과 프론트엔드 타입을 자동으로 파생.

**Why**: DB-API-UI 사이의 타입 파편화 문제를 해결하고, 스키마 변경 시 전체 타입이 자동으로 동기화됩니다.

**Trade-off**: 초기 설정 비용이 있지만, 장기적으로 타입 안전성과 개발 속도를 향상시킵니다.

### 2. Logic Separation: Headless UI Pattern

UI 컴포넌트가 비즈니스 로직에 얽매이지 않도록 분리합니다.

**Why**: 뷰가 바뀌어도 로직은 보존되며, 순수 비즈니스 로직에 대한 독립적인 유닛 테스트가 가능합니다.

### 3. Layered Directory Strategy

관심사를 계층별로 분리하여 코드의 위치를 예측 가능하게 관리합니다.

- **`lib/api`**: 도메인과 무관한 통신 원칙(Retry, API Client) 정의
- **`features/`**: 특정 도메인(Activity, Category)의 비즈니스 로직, 컴포넌트, 훅을 응집력 있게 관리
- **`components/ui`**: `shadcn/ui` 기반의 원자(Atomic) 단위 컴포넌트 레이어

**Why**: FSD의 핵심 원리만 차용하여 feature 간 응집성을 높이고, 도메인 로직과 UI를 분리하여 재사용성과 테스트 용이성을 확보합니다.

---

## Implementation Roadmap

### Phase 1: Core Foundation (In-Progress)

- [ ] Neon DB 셋업, Drizzle 스키마 설정
- [ ] `drizzle-zod`로 타입 자동 생성
- [ ] Next.js API Routes를 활용한 Type-safe API 레이어 구축
- [ ] DB-to-UI 자동 타입 추론

---

### Phase 2: Frontend Engineering (Upcoming)

- [ ] **확장 가능한 폴더 구조 설계**: FSD(Feature-Sliced Design) 일부 차용하여 관심사 분리
- [ ] **Headless UI 패턴 학습**: Shadcn/ui를 활용하여 스타일과 로직 분리, 재사용 가능한 컴포넌트 설계
- [ ] **API Client 추상화**: 공통 에러 핸들링 및 재시도 로직 내재화 + 타입 안전성 보장
- [ ] **State Management**: 상태 복잡도 증가에 따른 적절한 상태관리 전략 (React Query vs Context)

---

### Phase 3: Advanced Optimization (Upcoming)

- [ ] **가상화 (Virtualization)**: 365일 이상의 대량 데이터 렌더링 시 렌더링 최적화
- [ ] **선언적 UI (Suspense)**: Suspense와 Skeleton UI를 활용하여 데이터 로딩 시 사용자 경험을 개선하는 선언적 로딩 상태 관리
- [ ] **애니메이션**: Framer Motion 활용하여 사용자 경험 향상 (필요 시)
- [ ] **성능 개선**: Lighthouse 기준 성능/접근성 지표 개선
