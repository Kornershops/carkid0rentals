# Phase 1: Image Strategy Setup Guide

## 📋 Overview
This guide walks through setting up Cloudinary as the CDN for optimized vehicle image delivery.

---

## 🚀 Quick Setup (5 minutes)

### 1. Create Cloudinary Account
1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up (free tier supports 25GB/month)
3. Copy your **Cloud Name** from dashboard

### 2. Configure Environment
Create `.env.local` in `apps/web/`:
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name-here
```

### 3. Test Configuration
```bash
cd apps/web
npm run dev
# Visit http://localhost:3000
```

---

## 🖼️ Image Upload Strategy

### Option A: Manual Upload (Development)
1. Go to Cloudinary Dashboard → Media Library
2. Create folder structure:
```
carkid0/
├── fleet/
│   ├── eco-gig/
│   │   ├── innoson/
│   │   ├── wuling/
│   │   ├── toyota/
│   │   └── vw/
│   ├── elite/
│   │   ├── saglev/
│   │   ├── toyota/
│   │   ├── mercedes/
│   │   ├── porsche/
│   │   ├── bmw/
│   │   └── tesla/
│   └── heavy-haul/
│       ├── ford/
│       ├── scania/
│       └── mercedes/
```

3. Upload images following the naming pattern in `mock-fleet.ts`:
   - Example: `fleet/eco-gig/innoson/white-ivm.jpg`

### Option B: Automated Upload (Recommended for Production)
Use Cloudinary API:
```javascript
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload vehicle image
await cloudinary.uploader.upload('/path/to/image.jpg', {
  public_id: 'fleet/eco-gig/innoson/white-ivm',
  folder: 'carkid0',
  resource_type: 'auto',
});
```

---

## 🔧 Image Optimization Features

All images automatically get:
- ✅ **WebP/AVIF conversion** (`.webp`, `.avif` formats)
- ✅ **Responsive sizing** (multiple device densities)
- ✅ **Quality optimization** (auto-detect best quality/size tradeoff)
- ✅ **Lazy loading** (deferred rendering)
- ✅ **Blur placeholders** (low-quality image preview)

### Usage in Components
```typescript
import Image from 'next/image';
import { generateCloudinaryUrl } from '@/lib/image-config';

// Basic usage
<Image
  src={generateCloudinaryUrl('fleet/elite/mercedes/black-g63', {
    width: 800,
    height: 600,
  })}
  alt="Black Mercedes-Benz G63 AMG"
  width={800}
  height={600}
/>

// With srcset for responsive images
<Image
  src="fleet/elite/mercedes/black-g63"
  alt="Black Mercedes-Benz G63 AMG"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  fill
  priority={false}
/>
```

---

## 📊 Image Dimensions by Context

| Context | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Vehicle Card | 280×210px | 320×240px | 380×285px |
| Vehicle Detail | 480×360px | 640×480px | 960×720px |
| Hero Image | 480×640px | 768×576px | 1920×1080px |
| Thumbnail | 120×90px | - | - |

---

## ✅ Verification Checklist

After setup, verify:
- [ ] Environment variable set correctly
- [ ] Cloudinary dashboard accessible
- [ ] Folder structure created in Media Library
- [ ] At least 1 test image uploaded
- [ ] `npm run dev` runs without errors
- [ ] Image loads on homepage (check Network tab)
- [ ] Format negotiation working (check Chrome DevTools → Network → Img type)

---

## 🐛 Troubleshooting

### Images not loading
**Check:**
1. Cloud Name is correct in env variable
2. Image paths in `mock-fleet.ts` match Cloudinary folder names
3. Network tab shows 404 errors (image not uploaded)
4. CORS errors (unlikely with Cloudinary, but check browser console)

**Fix:**
```bash
# Test image URL directly
echo "https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/fleet/eco-gig/innoson/white-ivm.jpg"
```

### Performance issues
**Check:**
1. Image file sizes (should be < 200KB after Cloudinary optimization)
2. Network speed (throttle in DevTools)
3. Blur hash generation (check browser performance)

**Optimize:**
- Use `quality: 75` for cards, `quality: 85` for detail pages
- Enable lazy loading on off-screen images
- Use WebP format validation

---

## 📈 Monitoring

Use Cloudinary Analytics Dashboard to track:
- Bandwidth usage
- Cache hit rate
- Format distribution (WebP vs JPEG vs PNG)
- Average file size per tier

---

## Next Steps

After Phase 1 is complete:
1. ✅ Task 1.1 - Image Strategy *(Done)*
2. ✅ Task 1.2 - Image Optimization Setup *(Done)*
3. ⏳ Task 1.3 - Create Real Vehicle Images/Placeholders *(In Progress)*
4. ⏳ Task 1.4 - Update Mock Fleet Data *(Completed above)*

**Then proceed to Phase 2: Component Library** 🚀
