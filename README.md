# AI Sales Call Analyzer

## Overview

The AI Sales Call Analyzer is a sophisticated web application designed to provide real-time analysis and insights for sales calls. Built with Next.js and React, it leverages artificial intelligence to analyze conversation sentiment, engagement levels, and sales performance metrics with advanced audio processing capabilities.

## Features

### 🎙️ Live Call Analysis
- **Real-time Recording**: Start/stop call recording with visual feedback and audio level indicators
- **Live Sentiment Analysis**: Monitor conversation sentiment in real-time using advanced AI algorithms
- **Engagement Tracking**: Track customer engagement levels throughout the call with dynamic scoring
- **AI-Powered Suggestions**: Receive live coaching tips and recommendations based on voice patterns
- **Audio Visualization**: Real-time audio level bars with responsive animations
- **Session Metrics**: Track peak moments, voice activity, and energy levels

### 📊 Analytics Dashboard
- **Sentiment & Engagement Charts**: Visual representation of conversation flow with real-time data
- **Performance Radar**: Multi-dimensional performance metrics visualization
- **Keyword Analysis**: Track important topics and their sentiment impact from actual recordings
- **Weekly Overview**: Comprehensive call statistics and conversion tracking
- **Selective Analysis**: Choose specific recordings to analyze and compare
- **Real-time Data Integration**: Analytics reflect actual AI analysis from recorded sessions

### 📈 Performance Dashboard
- **Overall Performance Score**: Comprehensive scoring based on multiple metrics
- **Skills Breakdown**: Detailed analysis of Communication, Engagement, Consistency, Duration, and Frequency
- **7-Day Trend Analysis**: Performance tracking over time with visual charts
- **Achievement System**: Milestone tracking with badges for accomplishments
- **AI Recommendations**: Personalized suggestions with priority levels (High, Medium, Low)
- **Progress Tracking**: Current vs. target comparisons with improvement indicators

### 🎯 Recording Management
- **Smart Recording Storage**: Automatic saving with AI analysis data
- **Selective Analytics**: Choose which recordings to analyze
- **Progress Tracking**: Real-time analysis progress with visual feedback
- **Recording Metadata**: Duration, date, sentiment scores, and AI analysis status
- **Batch Processing**: Analyze multiple recordings simultaneously

## Technology Stack

### Frontend
- **Next.js 14.0.0**: React framework for production
- **React 18.2.0**: UI library with hooks for state management
- **TypeScript 5.2.0**: Type-safe JavaScript with strict typing
- **Tailwind CSS 3.3.0**: Utility-first CSS framework with custom glass morphism design

### UI Components & Animation
- **Framer Motion 10.16.4**: Advanced animation library for smooth transitions
- **Lucide React 0.292.0**: Modern icon library with consistent design
- **Recharts 2.8.0**: Responsive chart and data visualization library

### Audio Processing
- **Web Audio API**: Real-time audio analysis and processing
- **MediaRecorder API**: High-quality audio recording capabilities
- **Custom AI Engine**: Advanced sentiment and engagement analysis algorithms

### Styling
- **PostCSS 8.4.0**: CSS processing with modern features
- **Autoprefixer 10.4.0**: CSS vendor prefixing for cross-browser compatibility
- **Glass Morphism Design**: Modern UI with backdrop blur and transparency effects
- **Cyan-Blue Color Scheme**: Professional gradient design system

## Project Structure

```
ai-sales-call-analyzer/
├── pages/
│   ├── _app.tsx          # Application wrapper with global providers
│   ├── index.tsx         # Main dashboard with 4 tabs (Live, Recordings, Analytics, Performance)
│   └── login.tsx         # Authentication page with demo credentials
├── hooks/
│   └── useAuth.tsx       # Authentication hook with subscription management
├── styles/
│   └── globals.css       # Global styles with glass morphism and gradients
├── .gitignore            # Git ignore file for Next.js projects
├── next.config.js        # Next.js configuration
├── package.json          # Dependencies and scripts
├── postcss.config.js     # PostCSS configuration
├── tailwind.config.js    # Tailwind CSS configuration with custom colors
└── tsconfig.json         # TypeScript configuration
```

## Installation & Setup

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-sales-call-analyzer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Open your browser and navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev`: Start development server on port 3000
- `npm run build`: Build the application for production
- `npm start`: Start production server on port 3000
- `npm run lint`: Run ESLint for code quality checks

## Component Architecture

### Main Dashboard (`pages/index.tsx`)

The main component includes four comprehensive tabs:

#### 1. Live Analysis Tab
- **Advanced Recording Controls**: Start/stop recording with real-time audio visualization
- **AI-Powered Real-time Analysis**: Live sentiment and engagement tracking with Web Audio API
- **Dynamic Coaching**: Context-aware suggestions based on voice patterns and audio metrics
- **Session Metrics**: Peak moments, voice activity, energy levels, and consistency tracking
- **Audio Level Visualization**: 20-bar real-time audio spectrum display

#### 2. Recordings Tab
- **Smart Recording Management**: List all recordings with AI analysis status indicators
- **Selective Analysis**: Checkbox selection for targeted analytics
- **Batch Processing**: Analyze multiple recordings with progress tracking
- **Recording Metadata**: Duration, date, sentiment scores, and analysis completion status
- **Audio Playback**: Built-in audio controls for reviewing recordings
- **Export & Share**: Download and share recording capabilities

#### 3. Analytics Tab
- **Dynamic Data Source**: Analytics reflect selected recordings or all recordings if none selected
- **Real-time Sentiment Charts**: Time-series visualization using actual AI analysis data
- **Performance Radar**: Multi-dimensional assessment based on real metrics
- **Keyword Analysis**: AI-extracted keywords from actual recordings with sentiment classification
- **Weekly Activity**: Recording frequency and performance trends over 7 days
- **Session vs. Historical Data**: Separate views for current session and historical analysis

#### 4. Performance Tab
- **Overall Performance Score**: Calculated from sentiment (40%) + engagement (40%) + activity (20%)
- **Skills Breakdown**: 5 key areas with progress bars and target comparisons
- **7-Day Performance Trend**: Line chart showing daily performance evolution
- **Achievement System**: Milestone, improvement, and streak badges
- **AI Recommendations**: Prioritized suggestions (High/Medium/Low) with specific categories
- **Progress Indicators**: Current vs. target with improvement tracking

### Data Models

#### Recording with AI Data
```typescript
{
  id: string,
  name: string,
  date: string,
  duration: number,
  blob: string,
  aiData?: {
    sentiment: number,        // AI-calculated sentiment (0-1)
    engagement: number,       // AI-calculated engagement (0-1)
    keywords: string[],       // AI-extracted keywords
    realTimeData: Array<{     // Time-series analysis data
      time: string,
      sentiment: number,
      engagement: number
    }>
  }
}
```

#### Performance Data
```typescript
{
  overallScore: number,
  trendData: Array<{
    date: string,
    score: number,
    sentiment: number,
    engagement: number
  }>,
  skillsBreakdown: Array<{
    skill: string,
    current: number,
    target: number,
    improvement: number
  }>,
  achievements: Array<{
    title: string,
    description: string,
    date: string,
    type: 'milestone' | 'improvement' | 'streak'
  }>,
  recommendations: Array<{
    title: string,
    description: string,
    priority: 'high' | 'medium' | 'low',
    category: string
  }>
}
```

#### Session Metrics
```typescript
{
  avgSentiment: number,     // Session average sentiment
  avgEngagement: number,    // Session average engagement
  peakMoments: number,      // High-energy moments count
  totalWords: number,       // Voice activity indicator
  energyLevel: number       // Current energy level (0-1)
}
```

## AI Analysis System

### Real-time Audio Processing
- **Web Audio API Integration**: Real-time frequency analysis using FFT
- **Advanced Metrics Calculation**: Energy, clarity, consistency, and tonality scoring
- **Dynamic Range Analysis**: Peak and variance calculations for voice quality assessment
- **Frequency Pattern Recognition**: Low, mid, and high frequency analysis for speech characteristics

### AI Algorithm Features
- **Sentiment Scoring**: Multi-factor algorithm combining energy, clarity, consistency, and tonality
- **Engagement Calculation**: Dynamic range and variance-based engagement scoring
- **Keyword Detection**: Frequency pattern-based keyword extraction
- **Real-time Suggestions**: Context-aware coaching based on live audio metrics

### Animation System

#### Framer Motion Integration
- **Page Transitions**: Smooth tab switching with fade/slide effects
- **Component Animations**: Scale, rotate, and opacity transitions with staggered loading
- **Loading States**: Progress bars, spinners, and breathing animations
- **Interactive Feedback**: Hover and tap animations with visual feedback
- **Audio Visualization**: Real-time animated audio level bars

#### Animation Patterns
- **Entrance**: Staggered component loading with delay-based animations
- **Interaction**: Scale and color transitions on user actions
- **Status Indicators**: Pulsing dots, progress bars, and analysis progress tracking
- **Data Visualization**: Animated chart updates with smooth transitions

## Authentication System

### User Management
- **Demo Authentication**: Simulated login system with localStorage persistence
- **Dynamic User Names**: Email-based naming for login, custom names for registration
- **Subscription Tiers**: Free, Pro, and Enterprise plans with feature gating
- **Demo Credentials**: `contato@arsmachinaconsultancy.com` / `demo123`

### Feature Access Control
- **Free Tier**: Basic recording and live analysis
- **Pro Tier**: Advanced analytics and performance dashboard
- **Enterprise Tier**: Full feature access with premium capabilities

## Development Guidelines

### Code Style
- **TypeScript**: Strict typing with comprehensive interfaces
- **Functional Components**: React hooks for state management
- **Consistent Naming**: camelCase for variables, PascalCase for components
- **Component Composition**: Modular, reusable component patterns

### File Organization
- **Feature-based Structure**: Logical grouping by functionality
- **Custom Hooks**: Reusable logic in `/hooks` directory
- **Type Definitions**: Comprehensive TypeScript interfaces
- **Modular CSS**: Tailwind utility classes with custom glass morphism styles

## Key Features Implemented

### ✅ Completed Features
- **Advanced Audio Analysis**: Real-time AI processing with Web Audio API
- **Selective Recording Analytics**: Choose specific recordings for analysis
- **Performance Dashboard**: Comprehensive scoring and recommendations system
- **Achievement System**: Milestone tracking with visual badges
- **Progress Tracking**: Real-time analysis progress with visual feedback
- **Glass Morphism UI**: Modern design with backdrop blur effects
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Authentication System**: Demo login with subscription management

### 🎯 Technical Achievements
- **Real-time Audio Processing**: Advanced FFT analysis for voice metrics
- **Dynamic Data Visualization**: Charts that reflect actual AI analysis
- **Batch Processing**: Simultaneous analysis of multiple recordings
- **State Management**: Complex state handling with React hooks
- **Animation System**: Smooth transitions and interactive feedback
- **TypeScript Integration**: Comprehensive type safety throughout

## Future Enhancements

### Planned Features
- **Backend Integration**: Connect to actual AI/ML services and databases
- **Team Analytics**: Multi-user dashboard and team performance comparison
- **CRM Integration**: Connect with Salesforce, HubSpot, and other CRM systems
- **Advanced Reporting**: PDF reports and comprehensive data export
- **Mobile App**: React Native application for mobile recording
- **Voice Recognition**: Real-time transcription with speech-to-text integration

### Technical Improvements
- **Real-time WebSocket**: Live collaboration and team features
- **Progressive Web App**: Offline support and app-like experience
- **Advanced Caching**: Redis integration for improved performance
- **Microservices Architecture**: Scalable backend with API gateway
- **Cloud Storage**: AWS S3 integration for recording storage
- **Machine Learning Pipeline**: Custom AI models for industry-specific analysis

## Getting Started

### Demo Access
1. Navigate to the login page
2. Use demo credentials:
   - **Email**: `contato@arsmachinaconsultancy.com`
   - **Password**: `demo123`
3. Explore all features in the dashboard

### Quick Start Guide
1. **Live Analysis**: Start recording to see real-time AI analysis
2. **Recordings**: View and select recordings for detailed analysis
3. **Analytics**: Click "Ver Analytics" to process selected recordings
4. **Performance**: Review comprehensive performance metrics and recommendations

## Browser Compatibility

### Supported Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Required Features
- ES2020 support
- CSS Grid and Flexbox
- WebRTC (for audio recording)
- Canvas API (for visualizations)
- Microphone access permission

## License

This project is proprietary software developed for demonstration purposes. All rights reserved.

## Contact

For technical support or questions about the AI Sales Call Analyzer system:
- **Email**: contato@arsmachinaconsultancy.com
- **Company**: Ars Machina Consultancy
- **Project**: AI Sales Call Analyzer Demo