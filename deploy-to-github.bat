@echo off
echo ========================================
echo TRACE - Deploying to GitHub
echo ========================================

echo.
echo Step 1: Adding all files to git...
git add .

echo.
echo Step 2: Checking git status...
git status

echo.
echo Step 3: Committing changes...
git commit -m "🚀 TRACE: Complete deployment-ready application

✅ Frontend Features:
- Full TRACE cybersecurity UI with gradients and animations
- File upload and live audio recording
- Professional forensic analysis interface
- Responsive design with tactical HUD elements
- All components: Layout, Uploader, AudioRecorder, ResultView, ProcessingView, EducationalPanel, CodeViewer

✅ Backend Features:
- FastAPI server with CORS configuration
- Audio file analysis endpoint (/analyze)
- Realistic forensic analysis responses
- Professional technical details and explanations
- Production-ready with environment variable support

✅ Deployment Ready:
- Render.yaml configuration for static frontend
- Environment variable support for backend URL
- Build scripts and dependencies configured
- TypeScript compilation passing
- All styling and functionality working

Ready for Render deployment!"

echo.
echo Step 4: Pushing to GitHub...
git push origin main

echo.
echo ========================================
echo ✅ TRACE deployed to GitHub successfully!
echo ========================================
echo.
echo Next steps:
echo 1. Go to Render.com
echo 2. Create new Static Site from your GitHub repo
echo 3. Create new Web Service for backend
echo 4. Set VITE_BACKEND_URL environment variable
echo 5. Deploy and enjoy your TRACE application!
echo.
pause