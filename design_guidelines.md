# Design Guidelines: Sistema de Gestión para Restaurante/Cafetería

## Design Approach: Material Design 3

**Selected System:** Google Material Design 3 (as explicitly requested)

**Justification:** Material Design 3 provides robust component libraries, clear interaction patterns, and excellent accessibility - ideal for a dual-interface system (admin panel + self-service kiosk). Its emphasis on touch-friendly targets and clear visual hierarchy makes it perfect for restaurant POS systems.

**Key Principles:**
- Touch-first interactions for kiosk interface
- Clear information hierarchy for admin dashboard
- Consistent elevation and depth system
- Responsive layouts that work on tablets and large touchscreens

---

## Core Design Elements

### A. Typography

**Font Family:** Roboto (Material Design standard)
- Primary: Roboto Regular (400)
- Emphasis: Roboto Medium (500)
- Headings: Roboto Bold (700)

**Type Scale:**
- Display Large: 57px / 64px line height (Kiosk hero headings)
- Headline Large: 32px / 40px (Admin section headers, Kiosk category titles)
- Title Large: 22px / 28px (Card titles, Product names)
- Body Large: 16px / 24px (Primary content, product descriptions)
- Body Medium: 14px / 20px (Secondary content, table data)
- Label Large: 14px / 20px (Buttons, form labels)
- Label Small: 11px / 16px (Captions, timestamps)

### B. Layout System

**Spacing Units:** Use Tailwind spacing primitives: 2, 4, 6, 8, 12, 16, 24
- Tight spacing: p-2, gap-2 (compact tables, chips)
- Standard spacing: p-4, gap-4 (cards, form fields)
- Generous spacing: p-8, p-12 (section padding)
- Section breaks: py-16, py-24 (major divisions)

**Grid System:**
- Admin Dashboard: 12-column grid with max-w-7xl container
- Kiosk Interface: Centered max-w-6xl with large touch targets (min 48px)
- Responsive breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)

### C. Component Library

#### Admin Panel Components

**Navigation:**
- Side drawer navigation (280px width, collapsible to icons only)
- Top app bar with breadcrumbs and user profile
- Quick action FAB (bottom-right) for common tasks (Nuevo Pedido, Nuevo Producto)

**Dashboard Cards:**
- Elevated cards (elevation-1) with 16px padding
- KPI cards: Large number display (48px), label below, trend indicator
- Chart containers: min-height of 320px with Material Charts integration

**Data Tables:**
- Striped rows for readability
- Sticky headers on scroll
- Row actions (edit, delete) as icon buttons on hover
- Pagination controls at bottom (Material Design pagination)
- Filter chips above table

**Forms:**
- Outlined text fields (Material Design 3 style)
- Floating labels
- Helper text and error states below fields
- Dropdown selects with search capability
- Date/time pickers with calendar overlay
- Image upload with preview thumbnails

**Charts/Graphics:**
- Use Material Design Chart components or Chart.js with Material theming
- Line charts for revenue trends (time series)
- Bar charts for category comparisons
- Donut charts for expense breakdown
- Legend positioning: bottom or right

#### Kiosk/Totem Interface Components

**Product Display:**
- Large product cards (min 280px x 320px) in grid layout
- High-quality product images (16:9 aspect ratio)
- Clear pricing (32px font size)
- Add to cart button (56px height, full width)
- Category chips for filtering

**Shopping Cart:**
- Persistent cart summary (FAB with badge showing item count)
- Cart overlay/drawer from right side
- Item cards with quantity steppers (+/- buttons, 48px touch targets)
- Subtotal always visible, sticky at bottom

**Checkout Flow:**
- Step indicator at top (1. Revisar, 2. Pagar, 3. Confirmar)
- Large, clear CTAs (64px height buttons)
- QR code display: centered, 300x300px minimum
- Payment status feedback with icon + text

**Touch Interactions:**
- Minimum touch target: 48x48px (Material Design standard)
- Ripple effects on all interactive elements
- Clear active states (elevated, highlighted)
- Large, spaced-out keyboards for text input

### D. Elevation & Depth

**Elevation Levels:**
- Level 0: Background, base surfaces
- Level 1: Cards, data tables (+2px shadow)
- Level 2: App bars, FABs (+4px shadow)
- Level 3: Modals, dialogs (+8px shadow)
- Level 4: Navigation drawer (+12px shadow)

### E. Iconography

**Icon Library:** Material Icons (via Google Fonts CDN)
- 24px for inline icons
- 48px for kiosk buttons
- 64px for empty states

**Common Icons Needed:**
- inventory_2 (Inventario)
- restaurant_menu (Productos)
- people (Clientes)
- bar_chart (Ingresos/Egresos)
- qr_code_scanner (Pagos QR)
- receipt_long (Facturación DIAN)
- schedule (Horarios)
- shopping_cart (Pedidos)

---

## Interface-Specific Guidelines

### Admin Panel Layout

**Dashboard:**
- 4-column KPI cards at top (Revenue, Orders, Top Product, Staff Active)
- 2-column layout below: Revenue chart (left, 8 cols) + Recent activity (right, 4 cols)
- Quick actions toolbar always accessible

**List Views (Inventory, Products, Clients):**
- Filter bar at top with search + category chips
- Toolbar with bulk actions (Export, Delete selected)
- Main content area with data table
- Side panel for details/edit (slides in from right)

### Kiosk Interface Layout

**Home Screen:**
- Welcome message with restaurant branding (top 20% of screen)
- Category navigation as large horizontal chips/buttons (scrollable)
- Product grid (3-4 columns on large screens, masonry on tablets)
- Floating cart button (bottom-right, always visible)

**Product Detail Modal:**
- Full-screen overlay with dimmed background
- Product image top (40% of modal)
- Details and customization options below
- Sticky footer with Add to Cart button

**Checkout:**
- Left side (60%): Order summary with scrollable items
- Right side (40%): Payment method selection, QR code display, total
- Confirmation screen with order number (128px font), estimated time

---

## Images

**Admin Panel:**
- Empty state illustrations for each module (simple, Material Design style)
- User avatars (circular, 40px in header, 128px in profile)
- Product thumbnails in tables (48x48px, rounded corners)

**Kiosk:**
- Product images (required for all menu items, high-quality, appetizing photography)
- Category header images (optional, 1600x400px hero style)
- Payment method logos (Bancolombia, Nequi - 120x40px)
- Success animations/illustrations (Lottie or static SVG)

**Photography Style:** Bright, appetizing food photography with Colombian cuisine aesthetic. Natural lighting, shallow depth of field, warm tones.

---

## Animations

**Use Sparingly:**
- Material motion for transitions (300ms standard, 200ms accelerated)
- Page transitions: fade + subtle slide
- Card elevation on hover (admin only)
- Ripple effects on touch (kiosk)
- Loading spinners: Material circular progress
- NO elaborate hero animations, NO parallax effects