# PWA (Progressive Web App) Setup

This app has been configured as a Progressive Web App (PWA) with the following features:

## Features Implemented

### 1. **PWA Configuration**
- ✅ Next.js PWA plugin (`next-pwa`) configured
- ✅ Service worker for offline functionality
- ✅ Web app manifest (`site.webmanifest`)
- ✅ PWA meta tags in layout

### 2. **App Icons**
- ✅ 16x16 favicon
- ✅ 32x32 favicon  
- ✅ 192x192 Android Chrome icon
- ✅ 512x512 Android Chrome icon
- ✅ Apple touch icon

### 3. **Installation Features**
- ✅ Install prompt component
- ✅ PWA status indicator
- ✅ Offline page

### 4. **Offline Functionality**
- ✅ Service worker caching
- ✅ Offline page when no internet
- ✅ Cache management

## How to Use

### For Users

1. **Install the App**
   - On desktop: Look for the install prompt in the browser address bar
   - On mobile: Use "Add to Home Screen" option in browser menu
   - The app will show an install prompt when eligible

2. **Offline Usage**
   - The app will work offline for cached content
   - If completely offline, you'll see the offline page
   - Click "Tentar novamente" to retry connection

3. **PWA Status**
   - When running as PWA, you'll see a "PWA" indicator in the top-right
   - Shows offline status when no internet connection

### For Developers

#### Files Added/Modified:

1. **`next.config.ts`** - Added PWA plugin configuration
2. **`public/site.webmanifest`** - App manifest with PWA settings
3. **`public/sw.js`** - Custom service worker for caching
4. **`app/[locale]/layout.tsx`** - Added PWA meta tags and components
5. **`app/[locale]/offline/page.tsx`** - Offline page component
6. **`components/pwa-install-prompt.tsx`** - Install prompt component
7. **`components/pwa-status.tsx`** - PWA status indicator

#### PWA Settings:

- **App Name**: Obraguru
- **Short Name**: Obraguru  
- **Theme Color**: #000000
- **Background Color**: #ffffff
- **Display Mode**: standalone
- **Orientation**: portrait
- **Language**: pt-BR

#### Development vs Production:

- PWA features are **disabled in development** for better debugging
- Service worker only runs in **production builds**
- To test PWA features, build and serve the production version

## Testing PWA Features

1. **Build the app**:
   ```bash
   npm run build
   npm start
   ```

2. **Test installation**:
   - Open in Chrome/Edge
   - Look for install prompt
   - Or use browser menu "Install app"

3. **Test offline functionality**:
   - Install the app
   - Turn off internet
   - Navigate to cached pages

4. **Test service worker**:
   - Open DevTools → Application → Service Workers
   - Check if service worker is registered
   - View cached resources

## Browser Support

- ✅ Chrome/Edge (full support)
- ✅ Firefox (basic support)
- ✅ Safari (basic support)
- ⚠️ Internet Explorer (not supported)

## Customization

### Update App Information:
Edit `public/site.webmanifest` to change:
- App name and description
- Theme colors
- Icons
- Display settings

### Update Service Worker:
Edit `public/sw.js` to modify:
- Caching strategy
- Offline behavior
- Cache versioning

### Update Install Prompt:
Edit `components/pwa-install-prompt.tsx` to customize:
- Prompt appearance
- Installation flow
- User messaging

## Troubleshooting

### PWA Not Installing:
- Ensure HTTPS (required for PWA)
- Check if all icons are accessible
- Verify manifest is valid

### Service Worker Issues:
- Clear browser cache
- Check DevTools → Application → Service Workers
- Verify service worker registration

### Offline Not Working:
- Check if pages are cached
- Verify service worker is active
- Test with production build 