# STARDOTS Backpack & Bag Sourcing — B2B Export Website

> **Client / Enterprise**: JINJIANG STARDOTS CO., LTD. (晋江星点贸易/制造 · 中国福建省泉州市晋江市)  
> **Industry**: B2B Backpack & Bag Export, OEM / ODM, Sourcing, Private Label  
> **Production Stack**: React 18, Vite, GSAP 3, Lenis Smooth Scroll, Lucide Icons, Static Prerendering (SSG)  
> **Deployment Target**: Vercel Global Edge Network

---

## 🌟 Overview & Key Capabilities

This repository contains the official high-performance B2B export website for **JINJIANG STARDOTS CO., LTD.**, built specifically for overseas brand owners, retail buyers, importers, and wholesalers.

1. **Production-Ready Catalog**:
   - 67 reviewed reference backpack & bag models with 143 high-resolution curated photographs.
   - 3 Hero Lines: Business & Commute, Outdoor & Adventure, Urban Everyday & School.
   - Comprehensive model specifications, pocket layouts, fabric options, and high-resolution galleries.

2. **Bilingual & Static SSG Architecture**:
   - 192 prerendered static HTML pages covering both English (default) and Chinese (`/zh`) routes.
   - 100% WCAG AA accessible contrast, semantic H1 headings, canonical URLs, hreflang alternates, and schema.org Organization/Breadcrumb JSON-LD structured data.

3. **Interactive Buyer Tools**:
   - **CBM & Container Load Estimator (`/buyers`)**: Live interactive calculator computing carton volume, total CBM, and container fill percentages across 20GP, 40GP, and 40HQ containers, with export logistics guidance.
   - **Dual-Channel RFQ Lead System (`/contact`)**: Form validation with auto-generated unique `RFQ-STD-XXXXXX` vouchers, direct one-click WhatsApp pre-filled negotiation, and structured email drafts.

4. **Zero Fluff & Verified Quality**:
   - 21 automated tests covering content build, data schemas, bilingual translation symmetry, security honeypots, and site integrity.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm ci
```

### 2. Run Local Development Server
```bash
npm run dev
```
Preview locally at `http://127.0.0.1:5173`.

### 3. Run Automated Quality Tests
```bash
npm test
```

### 4. Production Build & Prerender
```bash
npm run build
```
This builds the client assets and prerenders 192 localized HTML pages into `dist/`.

---

## 📦 Deployment on Vercel

The project includes `vercel.json` configured for Vite SSG:
- **Framework Preset**: Vite
- **Output Directory**: `dist`
- **Build Command**: `npm run build`
- **Clean URLs**: Enabled (`/about`, `/products`, `/contact`, etc.)

---

## 🏢 Company & Contact Details

- **Company**: JINJIANG STARDOTS CO., LTD.
- **Location**: Room 401, Unit 1, Building 5, Baihong Shuanglong Shoufu, No. 1333 Shuanglong East Road, Jinjiang, Fujian, China
- **Business Email**: `contact@cnstardots.com`
- **Phone / WhatsApp**: `+86 136 5597 7639`
- **Export Channels**: Email, WhatsApp, WeChat, RFQ Inquiries
