# 🚬 QuitSmart - Single File Version

**Ultra-minimal version: Just 1 HTML file!**

## 📦 What's This?

The complete QuitSmart app in a **single HTML file** (~400 lines).
- No build tools
- No dependencies to install
- No terminal commands
- Just open in browser!

## 🚀 Usage

### Option 1: Direct Open
1. Double-click `index.html`
2. Opens in your browser
3. That's it! ✅

### Option 2: Local Server (Recommended)
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (if you have npx)
npx serve
```

Then open: `http://localhost:8000`

## ✨ Features Included

✅ All 4 pages (onboarding, dashboard, craving, plan)  
✅ 21-day reduction algorithm  
✅ localStorage persistence  
✅ 10-minute timer  
✅ Trigger alternatives  
✅ Mobile responsive (via Tailwind CDN)  

## 📊 Comparison

| Version | Files | Setup | Best For |
|---------|-------|-------|----------|
| **Full** | 18 files | `npm install` | Production, learning Next.js |
| **Minimal** | 1 file | None | Quick demo, no setup |

## 🎯 Trade-offs

**Pros:**
- ✅ Zero setup
- ✅ Easy to understand
- ✅ Single file to share
- ✅ Works offline

**Cons:**
- ❌ No TypeScript
- ❌ No hot reload
- ❌ Inline JavaScript (harder to debug)
- ❌ Less maintainable for large projects

## 🔧 How It Works

Everything is in one file:
- HTML structure
- Vanilla JavaScript (no framework)
- Tailwind CSS (via CDN)
- localStorage for data
- Simple state management

## 📝 Code Structure

```javascript
// Data & Utilities (lines 1-100)
- TRIGGERS, ALTERNATIVES, TIPS constants
- generatePlan() algorithm
- Date utilities

// State Management (lines 101-200)
- Global state object
- loadData(), saveData() functions

// Event Handlers (lines 201-250)
- handleSmoked(), completeOnboarding(), etc.

// Render Functions (lines 251-400)
- renderOnboarding()
- renderDashboard()
- renderCraving()
- renderPlan()
```

## 🎓 Perfect For

- Quick demos
- Proof of concept
- Graduation presentations
- Learning JavaScript basics
- Sharing via email/USB

## ⚠️ Limitations

- Not suitable for production
- No code splitting
- No TypeScript safety
- Tailwind CDN (limited customization)
- Global state only

## 🚀 Upgrade Path

If you need more features:
1. Use the full Next.js version
2. Add backend (Firebase, Supabase)
3. Convert to React components
4. Add testing

## 📄 License

MIT - Free to use for educational purposes

---

**Quick Start**: Just open `index.html` in Chrome/Firefox/Safari! 🎉
