# Design Guidelines: Adaptive Learning MVP for Rural Schools

## Design Approach

**Selected System**: Material Design with educational simplification
**Rationale**: Educational platforms require clear information hierarchy, familiar patterns for students, and robust accessibility. Material Design provides tested components optimized for learning contexts while maintaining simplicity for low-bandwidth rural environments.

**Core Principles**:
- Mobile-first, touch-friendly interfaces
- Maximum readability for young learners (Grades 6-8)
- Minimal visual complexity to reduce cognitive load
- Offline-first visual feedback states
- Performance-optimized for low-end devices

---

## Typography System

**Font Family**: 
- Primary: 'Inter' or 'Noto Sans' (excellent Hindi/English support via Google Fonts)
- Fallback: system-ui, sans-serif

**Type Scale**:
- Hero/Page Titles: text-3xl (30px) font-bold
- Section Headers: text-2xl (24px) font-semibold
- Card Titles: text-xl (20px) font-medium
- Body Text: text-base (16px) font-normal
- Labels/Captions: text-sm (14px) font-medium
- Buttons: text-base (16px) font-semibold

**Hierarchy Notes**: Large, legible text for student readability. Minimum 16px for all body content.

---

## Layout & Spacing System

**Container Strategy**:
- Max-width: max-w-6xl for student screens, max-w-7xl for teacher dashboard
- Mobile padding: px-4 py-6
- Desktop padding: px-8 py-8

**Spacing Primitives** (Tailwind units):
- Core spacing: 4, 6, 8 (p-4, m-6, gap-8)
- Component spacing: 3, 5 (for tighter internal spacing)
- Section breaks: 12, 16 (py-12 for major sections)

**Grid System**:
- Grade/Chapter Selection: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4
- Quiz Questions: Single column max-w-2xl centered
- Dashboard Stats: grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6

---

## Component Library

### Student Interface Components

**Screen 1: Grade & Chapter Selection**
- Large card-based selection (min-h-32)
- Cards with prominent text labels (text-xl font-semibold)
- Touch-friendly spacing (gap-4 between cards)
- Visual hierarchy: Grade selection first, then chapter reveal
- Selected state: border-2 with shadow-md elevation

**Screen 2: Download Progress**
- Centered modal/overlay (max-w-md)
- Progress indicator (linear bar)
- Icon + status text layout (flex-col items-center gap-4)
- Clear completion state with checkmark

**Screen 3: Lesson Screen**
- Content card: max-w-3xl centered, p-6 rounded-lg shadow
- Text content: prose max-w-none for optimal reading
- Image: rounded-lg shadow-sm, max-h-64 object-cover
- Audio player: Simple controls bar, rounded-full buttons, w-full max-w-md

**Screen 4: Practice Quiz**
- Question card: p-6 rounded-lg shadow-md
- Answer options: Stacked buttons (w-full text-left p-4 rounded-lg)
- Minimum tap target: min-h-12 for all interactive elements
- Progress indicator: Top of screen showing "Question 1 of 3"

**Screen 5: Summary Screen**
- Stats grid: 3 large stat cards (grid-cols-1 md:grid-cols-3)
- Each stat: flex-col items-center, text-4xl for number, text-sm for label
- Results list: divide-y with alternating subtle backgrounds
- Primary CTA: "Try Again" or "Next Chapter" button (w-full md:w-auto)

### Teacher Dashboard

**Layout**: 
- Header with app title + teacher name (flex justify-between)
- Filter/grade tabs (flex gap-2, horizontal scroll on mobile)
- Student performance table:
  - Desktop: Full table with columns (Student Name | Score | Status)
  - Mobile: Stacked cards (flex-col gap-3)
- Summary cards at top: grid-cols-1 md:grid-cols-3 showing averages

**Data Visualization**:
- Simple horizontal bar charts for score comparison
- Clear labels with adequate spacing (p-3)
- Responsive scaling (text-xs on mobile, text-sm on desktop)

### Common UI Elements

**Buttons**:
- Primary: px-6 py-3 rounded-lg font-semibold
- Secondary: px-6 py-3 rounded-lg font-medium border-2
- Icon buttons: p-3 rounded-full (for audio controls)
- Minimum tap target: 44x44px on mobile

**Cards**:
- Standard: p-6 rounded-lg shadow-md
- Interactive: hover:shadow-lg transition-shadow cursor-pointer
- Compact: p-4 rounded-lg border

**Navigation**:
- Simple header: flex justify-between items-center h-16 px-4
- Back button: Top-left with arrow icon + label
- Progress breadcrumbs: flex gap-2 with separators

**Forms & Inputs**:
- Text inputs: p-3 rounded-lg border-2 focus:border-primary
- Labels: text-sm font-medium mb-2 block
- Error states: border-red with text-sm text-red below

**Status Indicators**:
- Offline mode: Small banner at top (py-2 px-4 text-sm)
- Loading states: Spinner + text (flex items-center gap-3)
- Success/Error toasts: Fixed bottom-4 right-4, p-4 rounded-lg shadow-lg

---

## Responsive Behavior

**Breakpoints**:
- Mobile-first: base (all mobile styles)
- Tablet: md: (768px+)
- Desktop: lg: (1024px+)

**Navigation**:
- Mobile: Bottom navigation bar (if multi-section)
- Desktop: Top header navigation

**Content Scaling**:
- Font sizes increase slightly on desktop (text-base → text-lg for critical content)
- Cards: Single column mobile, multi-column desktop
- Generous touch targets on mobile (min-h-12), tighter on desktop

---

## Images

**Hero Image**: Not applicable for this MVP (functional tool, not marketing site)

**Content Images**:
- Lesson images: Educational diagrams or illustrations (max-h-64 rounded-lg)
- Placeholder style: Simple geometric shapes or educational icons
- Location: Within lesson content cards, centered
- Format: Optimized for low bandwidth (compressed JPEG/WebP)

**Icon System**:
- Use Material Icons via CDN
- Size: w-6 h-6 for inline icons, w-8 h-8 for prominent actions
- Context: Grade icons (book, calculator), audio (play/pause), sync status

---

## Performance & Accessibility

**Loading States**:
- Skeleton screens for content cards (animate-pulse)
- Inline spinners for actions
- Clear "Downloading..." progress

**Offline Indicators**:
- Persistent subtle banner when offline
- Disabled states for sync-required actions
- Visual feedback for cached content

**Accessibility**:
- All interactive elements: keyboard navigable
- Form labels: explicit for/id relationships
- Alt text: Descriptive for all educational images
- Focus states: Visible ring (ring-2 ring-offset-2)
- Minimum contrast: WCAG AA compliant

---

**Critical Implementation Notes**:
- Prioritize load time: Minimal external resources, inline critical CSS
- Touch-optimized: All buttons minimum 44x44px tap targets
- Clear visual hierarchy: Students should instantly understand next action
- Generous spacing: Reduce visual clutter for young learners