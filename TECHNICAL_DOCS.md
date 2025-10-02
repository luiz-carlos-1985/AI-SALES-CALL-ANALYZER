# Technical Documentation - AI Sales Call Analyzer

## System Architecture

### Application Flow
```
User Interface (React/Next.js)
    ↓
State Management (React Hooks)
    ↓
Data Visualization (Recharts)
    ↓
Animation Layer (Framer Motion)
    ↓
Styling System (Tailwind CSS)
```

## Component Hierarchy

### Main Application Structure
```
AISalesCallAnalyzer (Root Component)
├── Header
│   ├── Logo & Branding
│   ├── Status Indicators
│   └── Action Buttons
├── Navigation Tabs
│   ├── Live Analysis
│   ├── Recordings
│   ├── Analytics
│   └── Performance
└── Content Area
    ├── Live Analysis View
    │   ├── Recording Controls
    │   ├── Real-time Insights
    │   └── Sidebar Widgets
    ├── Analytics View
    │   ├── Sentiment Charts
    │   ├── Performance Radar
    │   ├── Keywords Analysis
    │   └── Weekly Overview
    └── Other Views (Recordings, Performance)
```

## State Management

### React Hooks Implementation

#### Primary State Variables
```typescript
const [activeTab, setActiveTab] = useState<string>('live')
const [isRecording, setIsRecording] = useState<boolean>(false)
const [isPlaying, setIsPlaying] = useState<boolean>(false)
const [currentTime, setCurrentTime] = useState<number>(0)
const [audioLevel, setAudioLevel] = useState<number>(0)
```

#### State Flow Diagram
```
User Action → State Update → Component Re-render → UI Update
     ↓              ↓              ↓              ↓
Click Record → setIsRecording → useEffect → Animation
Tab Switch → setActiveTab → AnimatePresence → Transition
Audio Input → setAudioLevel → Visualization → Real-time Update
```

## Data Structures

### Type Definitions

#### Sentiment Analysis Data
```typescript
interface SentimentDataPoint {
  time: string;        // Format: "MM:SS"
  sentiment: number;   // Range: 0.0 - 1.0
  engagement: number;  // Range: 0.0 - 1.0
}
```

#### Keyword Analysis Data
```typescript
interface KeywordData {
  word: string;
  count: number;
  sentiment: 'positive' | 'negative' | 'neutral';
}
```

#### Performance Metrics
```typescript
interface PerformanceMetric {
  metric: string;
  value: number;      // Range: 0 - 100
  fullMark: number;   // Maximum: 100
}
```

#### Call Statistics
```typescript
interface CallStatistic {
  date: string;
  calls: number;
  conversions: number;
  avgDuration: number; // In minutes
}
```

## Animation System

### Framer Motion Patterns

#### Page Transitions
```typescript
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
}
```

#### Component Entrance
```typescript
const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}
```

#### Interactive Elements
```typescript
const buttonAnimation = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 }
}
```

## Styling Architecture

### Tailwind CSS Utility Classes

#### Glass Morphism Effect
```css
.glass {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.15);
}
```

#### Gradient Text
```css
.gradient-text {
  background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

#### Color System
```css
/* Primary Colors */
--cyan-500: #06b6d4;
--blue-600: #2563eb;
--slate-900: #0f172a;

/* Status Colors */
--green-400: #4ade80;  /* Success/Positive */
--red-400: #f87171;    /* Error/Negative */
--yellow-400: #facc15; /* Warning/Neutral */
```

## Data Visualization

### Chart Configuration

#### Line Chart (Sentiment Analysis)
```typescript
<LineChart data={sentimentData}>
  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
  <XAxis dataKey="time" stroke="#9CA3AF" />
  <YAxis stroke="#9CA3AF" />
  <Tooltip contentStyle={{
    backgroundColor: 'rgba(0,0,0,0.8)',
    border: '1px solid #374151',
    borderRadius: '8px'
  }} />
  <Line type="monotone" dataKey="sentiment" stroke="#06b6d4" strokeWidth={3} />
  <Line type="monotone" dataKey="engagement" stroke="#3b82f6" strokeWidth={3} />
</LineChart>
```

#### Radar Chart (Performance Metrics)
```typescript
<RadarChart data={performanceData}>
  <PolarGrid />
  <PolarAngleAxis dataKey="metric" />
  <PolarRadiusAxis angle={90} domain={[0, 100]} />
  <Radar
    name="Performance"
    dataKey="value"
    stroke="#06b6d4"
    fill="#06b6d4"
    fillOpacity={0.3}
  />
</RadarChart>
```

#### Bar Chart (Weekly Overview)
```typescript
<BarChart data={callsData}>
  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
  <XAxis dataKey="date" stroke="#9CA3AF" />
  <YAxis stroke="#9CA3AF" />
  <Tooltip />
  <Bar dataKey="calls" fill="#06b6d4" />
  <Bar dataKey="conversions" fill="#3b82f6" />
</BarChart>
```

## Performance Optimization

### React Optimization Techniques

#### Memoization Strategy
```typescript
// Expensive calculations
const memoizedStats = useMemo(() => {
  return calculateComplexStats(callsData);
}, [callsData]);

// Component memoization
const MemoizedChart = React.memo(ChartComponent);
```

#### Effect Optimization
```typescript
useEffect(() => {
  if (isRecording) {
    const interval = setInterval(() => {
      setAudioLevel(Math.random() * 100);
      setCurrentTime(prev => prev + 1);
    }, 100);
    return () => clearInterval(interval);
  }
}, [isRecording]); // Dependency array optimization
```

### Bundle Optimization

#### Code Splitting
```typescript
// Dynamic imports for large components
const AnalyticsView = dynamic(() => import('./AnalyticsView'), {
  loading: () => <LoadingSpinner />
});
```

#### Tree Shaking
```typescript
// Import only needed functions
import { LineChart, XAxis, YAxis } from 'recharts';
// Instead of: import * as Recharts from 'recharts';
```

## Error Handling

### Error Boundaries
```typescript
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Application error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

### Graceful Degradation
```typescript
const SafeChart = ({ data, fallback }) => {
  try {
    return <LineChart data={data} />;
  } catch (error) {
    console.warn('Chart rendering failed:', error);
    return fallback || <div>Chart unavailable</div>;
  }
};
```

## Testing Strategy

### Unit Testing
```typescript
// Component testing with React Testing Library
import { render, screen, fireEvent } from '@testing-library/react';

test('recording button toggles state', () => {
  render(<RecordingControl />);
  const button = screen.getByRole('button', { name: /start recording/i });
  
  fireEvent.click(button);
  
  expect(screen.getByText(/stop recording/i)).toBeInTheDocument();
});
```

### Integration Testing
```typescript
// Testing component interactions
test('tab navigation updates content', () => {
  render(<AISalesCallAnalyzer />);
  
  fireEvent.click(screen.getByText('Analytics'));
  
  expect(screen.getByText('Sentiment & Engagement')).toBeInTheDocument();
});
```

## Security Considerations

### Data Protection
- No sensitive data stored in localStorage
- Secure API communication (HTTPS only)
- Input validation and sanitization
- XSS prevention through React's built-in protection

### Audio Privacy
- Local audio processing only
- No automatic cloud uploads
- User consent for microphone access
- Clear data retention policies

## Browser Compatibility

### Feature Detection
```typescript
const checkBrowserSupport = () => {
  const features = {
    webRTC: !!navigator.mediaDevices,
    canvas: !!document.createElement('canvas').getContext,
    flexbox: CSS.supports('display', 'flex'),
    grid: CSS.supports('display', 'grid')
  };
  
  return Object.values(features).every(Boolean);
};
```

### Polyfills
```typescript
// Intersection Observer polyfill for older browsers
if (!('IntersectionObserver' in window)) {
  import('intersection-observer');
}
```

## Deployment Configuration

### Next.js Configuration
```javascript
// next.config.js
module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['example.com'],
  },
  experimental: {
    appDir: false,
  },
};
```

### Build Optimization
```json
{
  "scripts": {
    "build": "next build",
    "analyze": "ANALYZE=true next build",
    "export": "next export"
  }
}
```

## Monitoring & Analytics

### Performance Metrics
```typescript
// Core Web Vitals tracking
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

### Error Tracking
```typescript
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  // Send to monitoring service
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  // Send to monitoring service
});
```

## API Integration Points

### Future Backend Integration
```typescript
// API service structure
class APIService {
  private baseURL = process.env.NEXT_PUBLIC_API_URL;
  
  async analyzeSentiment(audioData: Blob): Promise<SentimentResult> {
    const formData = new FormData();
    formData.append('audio', audioData);
    
    const response = await fetch(`${this.baseURL}/analyze/sentiment`, {
      method: 'POST',
      body: formData,
    });
    
    return response.json();
  }
  
  async getCallHistory(): Promise<CallData[]> {
    const response = await fetch(`${this.baseURL}/calls`);
    return response.json();
  }
}
```

### WebSocket Integration
```typescript
// Real-time data streaming
class WebSocketService {
  private ws: WebSocket;
  
  connect() {
    this.ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL);
    
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.handleRealtimeUpdate(data);
    };
  }
  
  sendAudioChunk(chunk: ArrayBuffer) {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(chunk);
    }
  }
}
```

## Development Workflow

### Git Workflow
```bash
# Feature development
git checkout -b feature/new-analytics-chart
git add .
git commit -m "feat: add new analytics chart component"
git push origin feature/new-analytics-chart

# Code review and merge
git checkout main
git pull origin main
git merge feature/new-analytics-chart
```

### Code Quality
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "pre-push": "npm run test"
    }
  },
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"]
  }
}
```

This technical documentation provides developers with detailed implementation guidance, architectural decisions, and best practices for maintaining and extending the AI Sales Call Analyzer system.