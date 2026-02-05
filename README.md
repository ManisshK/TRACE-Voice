# 🛡️ TRACE - Voice Authenticity Intelligence System

<div align="center">

![TRACE Logo](https://img.shields.io/badge/TRACE-Voice%20Authenticity-orange?style=for-the-badge&logo=shield&logoColor=white)
![Status](https://img.shields.io/badge/Status-Deployment%20Ready-green?style=for-the-badge)
![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-blue?style=for-the-badge&logo=react)
![Backend](https://img.shields.io/badge/Backend-FastAPI-green?style=for-the-badge&logo=fastapi)

**Professional Voice Authenticity Analysis with Cybersecurity Aesthetic**

[🚀 Deploy Now](#deployment) • [📖 Documentation](#features) • [🎯 Demo](#demo)

</div>

---

## 🎯 Overview

TRACE is a sophisticated voice authenticity analysis application that combines cutting-edge forensic analysis with a professional cybersecurity interface. Built for demonstrating advanced audio spoof detection capabilities with a tactical, military-grade aesthetic.

### ✨ Key Features

🎨 **Professional TRACE Interface**
- Cybersecurity-themed UI with tactical HUD elements
- Beautiful gradient backgrounds and animations
- Responsive design for all devices
- Professional forensic analysis presentation

🎵 **Advanced Audio Analysis**
- File upload support (WAV, MP3, FLAC)
- Live audio recording with real-time visualization
- Sophisticated processing animations
- Comprehensive forensic reporting

🔬 **Forensic Analysis Engine**
- Authenticity scoring and confidence metrics
- Human vs Synthetic probability analysis
- Technical details including spectral anomalies
- Professional forensic terminology

## 🏗️ Architecture

```
TRACE System
├── Frontend (React + Vite + Tailwind)
│   ├── TRACE UI Components
│   ├── Audio Recording & Upload
│   ├── Real-time Processing Views
│   └── Professional Result Display
│
└── Backend (FastAPI + Python)
    ├── Audio Analysis API
    ├── Forensic Response Engine
    ├── CORS Configuration
    └── Production-Ready Deployment
```

## 🚀 Deployment

### Quick Deploy to Render

1. **Clone & Push to GitHub**
   ```bash
   git clone <your-repo>
   cd VakyaGuard
   ./deploy-to-github.bat
   ```

2. **Deploy Frontend**
   - Go to [Render.com](https://render.com)
   - New Static Site → Connect GitHub
   - Root Directory: `New folder/vakyaguard-frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`

3. **Deploy Backend**
   - New Web Service → Connect GitHub
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `python main.py`

4. **Configure Environment**
   - Set `VITE_BACKEND_URL` in frontend to backend URL
   - Redeploy frontend

### Local Development

```bash
# Backend
cd backend
pip install -r requirements.txt
python main.py

# Frontend
cd "New folder/vakyaguard-frontend"
npm install
npm run dev
```

## 🎮 Demo

### User Experience Flow

1. **Landing Page**: Professional TRACE interface with tactical styling
2. **Audio Input**: Upload file or record live audio
3. **Processing**: Realistic 4-second analysis with technical logs
4. **Results**: Comprehensive forensic report with:
   - Authenticity percentage
   - Human vs Synthetic probabilities
   - Technical analysis details
   - Professional recommendations

### Sample Analysis Output

```json
{
  "decision": "SPOOF",
  "authenticity_score": 0.1400,
  "confidence": 0.92,
  "human_probability": 0.14,
  "synthetic_probability": 0.86,
  "technicalDetails": {
    "spectralAnomalies": [
      "High-frequency vocoder artifacts detected",
      "Unnatural spectral envelope consistency"
    ],
    "temporalInconsistencies": [
      "Rigid temporal cadence lacking natural rhythm",
      "Missing coarticulation effects"
    ]
  }
}
```

## 🛠️ Technology Stack

### Frontend
- **React 18.2** - Modern UI framework
- **Vite 5.2** - Lightning-fast build tool
- **Tailwind CSS 3.4** - Utility-first styling
- **Lucide React** - Professional icons
- **TypeScript** - Type-safe development

### Backend
- **FastAPI** - High-performance async API
- **Uvicorn** - ASGI server
- **Pydantic** - Data validation
- **Python 3.8+** - Core runtime

## 📁 Project Structure

```
VakyaGuard/
├── New folder/vakyaguard-frontend/     # React Frontend
│   ├── src/
│   │   ├── components/trace/           # TRACE UI Components
│   │   ├── services/                   # API Integration
│   │   ├── styles/                     # Tailwind + Custom CSS
│   │   └── types/                      # TypeScript Definitions
│   ├── package.json
│   ├── tailwind.config.js
│   └── render.yaml                     # Render Deployment Config
│
├── backend/                            # FastAPI Backend
│   ├── main.py                         # API Server
│   ├── requirements.txt                # Python Dependencies
│   └── README.md                       # Backend Documentation
│
├── deploy-to-github.bat               # Deployment Script
├── DEPLOYMENT.md                      # Deployment Guide
└── README.md                          # This File
```

## 🎨 UI Components

### Core Components
- **Layout**: Main application shell with tactical styling
- **Uploader**: Drag & drop file upload with animations
- **AudioRecorder**: Live recording with oscilloscope visualization
- **ProcessingView**: Realistic analysis animation with logs
- **ResultView**: Professional forensic report display
- **EducationalPanel**: Technical information about analysis

### Styling Features
- **Gradient Backgrounds**: Multi-layered cybersecurity aesthetic
- **Tactical HUD**: Military-grade interface elements
- **Smooth Animations**: Professional transitions and effects
- **Responsive Design**: Works on desktop and mobile
- **Dark Theme**: Professional cybersecurity color scheme

## 🔧 Configuration

### Environment Variables

**Frontend (.env)**
```env
VITE_BACKEND_URL=https://your-backend.onrender.com
NODE_ENV=production
```

**Backend**
```env
# Render provides PORT automatically
PORT=8000
```

### Build Configuration

**Frontend (package.json)**
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  }
}
```

**Backend (requirements.txt)**
```txt
fastapi
uvicorn[standard]
python-multipart
pydantic
```

## 📊 Features Breakdown

### Audio Processing
- ✅ Multiple format support (WAV, MP3, FLAC)
- ✅ Live recording with MediaRecorder API
- ✅ Real-time audio visualization
- ✅ File validation and error handling

### Analysis Engine
- ✅ Realistic forensic analysis simulation
- ✅ Professional technical terminology
- ✅ Consistent scoring algorithms
- ✅ Detailed technical explanations

### User Interface
- ✅ Professional cybersecurity aesthetic
- ✅ Smooth animations and transitions
- ✅ Responsive design for all devices
- ✅ Accessibility-compliant components

### Deployment
- ✅ Production-ready configuration
- ✅ Environment variable support
- ✅ CORS properly configured
- ✅ Static site optimization

## 🚦 API Endpoints

### Backend API

**Health Check**
```
GET /
GET /health
```

**Audio Analysis**
```
POST /analyze
Content-Type: multipart/form-data
Body: audio file

Response: Forensic analysis report
```

**Legacy Endpoint**
```
POST /v1/voice/analyze
(Redirects to /analyze)
```

## 🎯 Use Cases

### Professional Demonstrations
- **Security Conferences**: Showcase voice authenticity technology
- **Client Presentations**: Demonstrate forensic analysis capabilities
- **Educational Purposes**: Teach about audio spoof detection
- **Portfolio Projects**: Display full-stack development skills

### Technical Features
- **Real-time Processing**: Live audio analysis simulation
- **Professional Reports**: Detailed forensic analysis output
- **Scalable Architecture**: Ready for real ML model integration
- **Modern Stack**: Latest web technologies and best practices

## 🔒 Security & Privacy

- **No Data Storage**: Audio files are processed in memory only
- **CORS Configured**: Secure cross-origin requests
- **Input Validation**: Proper file type and size validation
- **Error Handling**: Graceful failure management

## 📈 Performance

- **Fast Build Times**: Vite for lightning-fast development
- **Optimized Bundle**: Tree-shaking and code splitting
- **Responsive UI**: Smooth 60fps animations
- **Efficient API**: Async FastAPI for high performance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **AASIST Research**: Inspiration for forensic analysis terminology
- **Cybersecurity Aesthetics**: Military and tactical UI design principles
- **Modern Web Stack**: React, Vite, Tailwind, and FastAPI communities

---

<div align="center">

**Built with ❤️ by Team STRATAGEM**

[🚀 Deploy Now](https://render.com) • [📖 Documentation](./DEPLOYMENT.md) • [🐛 Report Issues](../../issues)

</div>
