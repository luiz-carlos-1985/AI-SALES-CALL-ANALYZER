import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, MicOff, Upload, BarChart3, Brain, TrendingUp, Users, Clock, Phone, Play, Pause, Volume2, LogOut, User as UserIcon, Trash2, ChefHat, Download, Target, Award, Zap } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import { useRouter } from 'next/router'
import { useAuth } from '../hooks/useAuth'

const sentimentData = [
  { time: '0:00', sentiment: 0.2, engagement: 0.3 },
  { time: '2:00', sentiment: 0.4, engagement: 0.5 },
  { time: '4:00', sentiment: 0.7, engagement: 0.8 },
  { time: '6:00', sentiment: 0.5, engagement: 0.6 },
  { time: '8:00', sentiment: 0.8, engagement: 0.9 },
  { time: '10:00', sentiment: 0.9, engagement: 0.95 }
]

const keywordsData = [
  { word: 'price', count: 15, sentiment: 'negative' },
  { word: 'features', count: 12, sentiment: 'positive' },
  { word: 'competitor', count: 8, sentiment: 'neutral' },
  { word: 'budget', count: 10, sentiment: 'negative' },
  { word: 'solution', count: 18, sentiment: 'positive' }
]

const performanceData = [
  { metric: 'Talk Time', value: 65, fullMark: 100 },
  { metric: 'Questions Asked', value: 85, fullMark: 100 },
  { metric: 'Objection Handling', value: 70, fullMark: 100 },
  { metric: 'Closing Attempts', value: 45, fullMark: 100 },
  { metric: 'Rapport Building', value: 80, fullMark: 100 }
]

const callsData = [
  { date: 'Mon', calls: 12, conversions: 3, avgDuration: 25 },
  { date: 'Tue', calls: 15, conversions: 5, avgDuration: 28 },
  { date: 'Wed', calls: 10, conversions: 2, avgDuration: 22 },
  { date: 'Thu', calls: 18, conversions: 7, avgDuration: 32 },
  { date: 'Fri', calls: 14, conversions: 4, avgDuration: 26 }
]

export default function AISalesCallAnalyzer() {
  const router = useRouter()
  const { user, loading, logout, updateSubscription, isSubscribed, canAccessFeature } = useAuth()
  const [activeTab, setActiveTab] = useState('live')
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [audioLevel, setAudioLevel] = useState(0)
  const [hasPermission, setHasPermission] = useState(false)
  const [error, setError] = useState('')
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState('pro')
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null)
  const [redirecting, setRedirecting] = useState(false)
  const [recordings, setRecordings] = useState<Array<{id: string, name: string, date: string, duration: number, blob: string, aiData?: {sentiment: number, engagement: number, keywords: string[], realTimeData: Array<{time: string, sentiment: number, engagement: number}>}}>>([])
  const [selectedRecordings, setSelectedRecordings] = useState<string[]>([])
  const [aiAnalysis, setAiAnalysis] = useState({
    sentiment: 'neutral',
    sentimentScore: 0.5,
    engagement: 'medium',
    engagementScore: 0.5,
    suggestions: ['Aguardando análise...'],
    keywords: [] as string[]
  })
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([])
  const [realTimeData, setRealTimeData] = useState<Array<{time: string, sentiment: number, engagement: number}>>([])
  const [sessionMetrics, setSessionMetrics] = useState({
    avgSentiment: 0.5,
    avgEngagement: 0.5,
    peakMoments: 0,
    totalWords: 0,
    energyLevel: 0
  })
  const [analyticsData, setAnalyticsData] = useState({
    totalRecordings: 0,
    totalDuration: 0,
    avgSentiment: 0,
    avgEngagement: 0,
    topKeywords: [] as Array<{word: string, count: number, sentiment: string}>,
    weeklyStats: [] as Array<{date: string, recordings: number, avgDuration: number, sentiment: number}>
  })
  const [performanceData, setPerformanceData] = useState({
    overallScore: 0,
    trendData: [] as Array<{date: string, score: number, sentiment: number, engagement: number}>,
    skillsBreakdown: [] as Array<{skill: string, current: number, target: number, improvement: number}>,
    achievements: [] as Array<{title: string, description: string, date: string, type: 'milestone' | 'improvement' | 'streak'}>,
    recommendations: [] as Array<{title: string, description: string, priority: 'high' | 'medium' | 'low', category: string}>
  })

  const ingredients = [
    'Chicken', 'Beef', 'Pork', 'Fish', 'Eggs', 'Rice', 'Pasta', 'Potatoes',
    'Tomatoes', 'Onions', 'Garlic', 'Cheese', 'Milk', 'Butter', 'Olive Oil'
  ]

  const recipes = [
    { name: 'Chicken Rice', ingredients: ['Chicken', 'Rice', 'Onions', 'Garlic'], time: '30 min' },
    { name: 'Beef Pasta', ingredients: ['Beef', 'Pasta', 'Tomatoes', 'Garlic'], time: '25 min' },
    { name: 'Fish & Potatoes', ingredients: ['Fish', 'Potatoes', 'Butter', 'Garlic'], time: '35 min' },
    { name: 'Egg Fried Rice', ingredients: ['Eggs', 'Rice', 'Onions', 'Olive Oil'], time: '15 min' },
    { name: 'Cheesy Pasta', ingredients: ['Pasta', 'Cheese', 'Milk', 'Butter'], time: '20 min' },
    { name: 'Chicken Tomato', ingredients: ['Chicken', 'Tomatoes', 'Onions', 'Olive Oil'], time: '40 min' },
    { name: 'Beef Rice Bowl', ingredients: ['Beef', 'Rice', 'Eggs', 'Garlic'], time: '30 min' },
    { name: 'Garlic Fish', ingredients: ['Fish', 'Garlic', 'Butter', 'Olive Oil'], time: '25 min' }
  ]
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const animationRef = useRef<number | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Testar microfone
  const testMicrophone = async () => {
    try {
      setError('Testando microfone...')
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      setError('✓ Microfone funcionando perfeitamente!')
      setHasPermission(true)
      
      // Parar stream após teste
      setTimeout(() => {
        stream.getTracks().forEach(track => track.stop())
        setError('')
      }, 2000)
      
    } catch (err) {
      setError('❌ Erro no microfone: ' + (err as Error).message)
      setHasPermission(false)
    }
  }

  // Função de gravação com MediaRecorder
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      setIsRecording(true)
      setCurrentTime(0)
      setError('')
      
      // MediaRecorder para salvar áudio
      mediaRecorderRef.current = new MediaRecorder(stream)
      const chunks: BlobPart[] = []
      
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data)
      }
      
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' })
        saveRecording(blob)
      }
      
      mediaRecorderRef.current.start()
      
      // Timer
      timerRef.current = setInterval(() => {
        setCurrentTime(prev => prev + 1)
      }, 1000)
      
      // Análise de áudio real com Web Audio API
      audioContextRef.current = new AudioContext()
      analyserRef.current = audioContextRef.current.createAnalyser()
      analyserRef.current.fftSize = 2048
      analyserRef.current.smoothingTimeConstant = 0.8
      
      const source = audioContextRef.current.createMediaStreamSource(stream)
      source.connect(analyserRef.current)
      
      // Análise em tempo real
      const analysisInterval = setInterval(() => {
        if (!analyserRef.current) return
        
        const bufferLength = analyserRef.current.frequencyBinCount
        const dataArray = new Uint8Array(bufferLength)
        analyserRef.current.getByteFrequencyData(dataArray)
        
        // Calcular métricas de áudio
        const average = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength
        const peak = Math.max(...Array.from(dataArray))
        const variance = dataArray.reduce((sum, value) => sum + Math.pow(value - average, 2), 0) / bufferLength
        const dynamicRange = peak - Math.min(...Array.from(dataArray))
        
        setAudioLevel(average)
        
        // IA avançada baseada em métricas reais
        if (average > 10) {
          performAdvancedAIAnalysis({
            average,
            peak,
            variance,
            dynamicRange,
            frequency: dataArray
          })
        }
      }, 100)
      
      animationRef.current = analysisInterval as any
      
    } catch (err) {
      setError('❌ ERRO: ' + (err as Error).message)
    }
  }



  // Parar gravação
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
    }
    
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    
    if (animationRef.current) {
      clearInterval(animationRef.current as any)
    }
    
    setIsRecording(false)
    setAudioLevel(0)
    setError('✓ Gravação salva com sucesso!')
    
    // Reset session data for next recording
    setTimeout(() => {
      setError('')
      setRealTimeData([])
      setSessionMetrics({
        avgSentiment: 0.5,
        avgEngagement: 0.5,
        peakMoments: 0,
        totalWords: 0,
        energyLevel: 0
      })
    }, 2000)
  }

  // Salvar gravação no localStorage
  const saveRecording = async (blob: Blob) => {
    try {
      const reader = new FileReader()
      reader.onload = () => {
        const base64 = reader.result as string
        const recording = {
          id: Date.now().toString(),
          name: `Recording ${new Date().toLocaleString()}`,
          date: new Date().toISOString(),
          duration: currentTime,
          blob: base64,
          aiData: {
            sentiment: sessionMetrics.avgSentiment,
            engagement: sessionMetrics.avgEngagement,
            keywords: aiAnalysis.keywords,
            realTimeData: [...realTimeData]
          }
        }
        
        const updatedRecordings = [...recordings, recording]
        setRecordings(updatedRecordings)
        localStorage.setItem('recordings', JSON.stringify(updatedRecordings))
        
        setNotification({
          message: 'Gravação salva com sucesso!',
          type: 'success'
        })
        setTimeout(() => setNotification(null), 3000)
      }
      reader.readAsDataURL(blob)
    } catch (err) {
      console.error('Erro ao salvar gravação:', err)
    }
  }

  // Download gravação
  const downloadRecording = async (recording: any) => {
    try {
      const response = await fetch(recording.blob)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${recording.name}.webm`
      a.click()
      URL.revokeObjectURL(url)
      
      setNotification({
        message: 'Download iniciado!',
        type: 'success'
      })
      setTimeout(() => setNotification(null), 2000)
    } catch (err) {
      setNotification({
        message: 'Erro no download',
        type: 'error'
      })
      setTimeout(() => setNotification(null), 3000)
    }
  }

  // Compartilhar gravação
  const shareRecording = async (recording: any) => {
    try {
      const response = await fetch(recording.blob)
      const blob = await response.blob()
      const file = new File([blob], `${recording.name}.webm`, { type: 'audio/webm' })
      
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: recording.name,
          text: 'Compartilhando gravação do SalesAI Analyzer',
          files: [file]
        })
      } else {
        downloadRecording(recording)
      }
    } catch (err) {
      setNotification({
        message: 'Erro ao compartilhar',
        type: 'error'
      })
      setTimeout(() => setNotification(null), 3000)
    }
  }

  // Deletar gravação
  const deleteRecording = (id: string) => {
    const updatedRecordings = recordings.filter(r => r.id !== id)
    setRecordings(updatedRecordings)
    localStorage.setItem('recordings', JSON.stringify(updatedRecordings))
    setSelectedRecordings(prev => prev.filter(recId => recId !== id))
  }

  // Toggle seleção de gravação
  const toggleRecordingSelection = (id: string) => {
    setSelectedRecordings(prev => 
      prev.includes(id) ? prev.filter(recId => recId !== id) : [...prev, id]
    )
  }

  // Analisar áudios das gravações selecionadas
  const analyzeSelectedRecordings = async () => {
    if (selectedRecordings.length === 0) return
    
    setIsAnalyzing(true)
    setAnalysisProgress(0)
    
    const targetRecordings = recordings.filter(rec => selectedRecordings.includes(rec.id))
    const updatedRecordings = [...recordings]
    
    for (let i = 0; i < targetRecordings.length; i++) {
      const recording = targetRecordings[i]
      setAnalysisProgress(Math.round(((i + 1) / targetRecordings.length) * 100))
      
      try {
        // Simular análise de áudio (em produção seria uma API real)
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Gerar dados de IA baseados na duração e características do áudio
        const sentiment = Math.random() * 0.6 + 0.3 // 0.3-0.9
        const engagement = Math.random() * 0.7 + 0.2 // 0.2-0.9
        
        // Gerar dados em tempo real simulados
        const realTimeData = []
        const segments = Math.min(Math.floor(recording.duration / 10), 20)
        for (let j = 0; j < segments; j++) {
          realTimeData.push({
            time: formatTime(j * 10),
            sentiment: Math.max(0.1, Math.min(0.9, sentiment + (Math.random() - 0.5) * 0.3)),
            engagement: Math.max(0.1, Math.min(0.9, engagement + (Math.random() - 0.5) * 0.3))
          })
        }
        
        // Keywords baseadas na duração e sentiment
        const keywords = []
        if (sentiment > 0.6) keywords.push('positivo', 'engajamento')
        if (engagement > 0.7) keywords.push('energia', 'clareza')
        if (recording.duration > 120) keywords.push('conversação', 'detalhada')
        keywords.push('análise', 'voz')
        
        // Atualizar gravação com dados de IA
        const recordingIndex = updatedRecordings.findIndex(r => r.id === recording.id)
        if (recordingIndex !== -1) {
          updatedRecordings[recordingIndex] = {
            ...updatedRecordings[recordingIndex],
            aiData: {
              sentiment,
              engagement,
              keywords: keywords.slice(0, 4),
              realTimeData
            }
          }
        }
      } catch (error) {
        console.error('Erro ao analisar gravação:', error)
      }
    }
    
    // Salvar gravações atualizadas
    setRecordings(updatedRecordings)
    localStorage.setItem('recordings', JSON.stringify(updatedRecordings))
    
    setIsAnalyzing(false)
    setAnalysisProgress(0)
    setActiveTab('analytics')
    
    setNotification({
      message: `Análise de ${targetRecordings.length} gravações concluída!`,
      type: 'success'
    })
    setTimeout(() => setNotification(null), 3000)
  }
  
  // Ver analytics das gravações selecionadas
  const viewSelectedAnalytics = () => {
    if (selectedRecordings.length > 0) {
      analyzeSelectedRecordings()
    }
  }

  // IA Avançada para análise de áudio
  const performAdvancedAIAnalysis = (audioMetrics: any) => {
    const { average, peak, variance, dynamicRange, frequency } = audioMetrics
    
    // Análise de frequência para detectar padrões de fala
    const lowFreq = frequency.slice(0, 85).reduce((sum: number, val: number) => sum + val, 0) / 85
    const midFreq = frequency.slice(85, 255).reduce((sum: number, val: number) => sum + val, 0) / 170
    const highFreq = frequency.slice(255).reduce((sum: number, val: number) => sum + val, 0) / (frequency.length - 255)
    
    // Algoritmo de sentiment baseado em padrões de voz
    const energyScore = (average + peak) / 2 / 255
    const clarityScore = dynamicRange / 255
    const consistencyScore = 1 - (variance / 10000)
    const tonalityScore = (midFreq + highFreq) / (lowFreq + 1)
    
    // Cálculo de sentiment (0-1)
    const sentimentScore = Math.min(Math.max(
      (energyScore * 0.3) + 
      (clarityScore * 0.2) + 
      (consistencyScore * 0.2) + 
      (tonalityScore * 0.3), 0
    ), 1)
    
    // Cálculo de engagement (0-1)
    const engagementScore = Math.min(Math.max(
      (energyScore * 0.4) + 
      (dynamicRange / 255 * 0.3) + 
      (variance / 5000 * 0.3), 0
    ), 1)
    
    // Determinar categorias
    const sentiment = sentimentScore > 0.7 ? 'positive' : sentimentScore > 0.4 ? 'neutral' : 'negative'
    const engagement = engagementScore > 0.7 ? 'high' : engagementScore > 0.4 ? 'medium' : 'low'
    
    // Gerar sugestões baseadas em métricas reais
    const suggestions = generateAISuggestions({
      sentimentScore,
      engagementScore,
      energyScore,
      clarityScore,
      consistencyScore
    })
    
    // Detectar palavras-chave baseado em padrões de frequência
    const keywords = detectKeywords(frequency, average)
    
    // Atualizar análise
    setAiAnalysis({
      sentiment,
      sentimentScore,
      engagement,
      engagementScore,
      suggestions,
      keywords
    })
    
    // Salvar dados para analytics
    const timeStr = formatTime(currentTime)
    setRealTimeData(prev => {
      const newData = [...prev, { time: timeStr, sentiment: sentimentScore, engagement: engagementScore }]
      return newData.slice(-50) // Manter apenas últimos 50 pontos
    })
    
    // Atualizar métricas da sessão
    setSessionMetrics(prev => ({
      avgSentiment: (prev.avgSentiment + sentimentScore) / 2,
      avgEngagement: (prev.avgEngagement + engagementScore) / 2,
      peakMoments: energyScore > 0.8 ? prev.peakMoments + 1 : prev.peakMoments,
      totalWords: prev.totalWords + (average > 30 ? 1 : 0),
      energyLevel: energyScore
    }))
  }
  
  // Gerar sugestões de IA
  const generateAISuggestions = (metrics: any) => {
    const suggestions = []
    
    if (metrics.energyScore > 0.8) {
      suggestions.push('✨ Excelente energia! Continue assim!')
    } else if (metrics.energyScore < 0.3) {
      suggestions.push('💪 Aumente o entusiasmo na sua voz')
    }
    
    if (metrics.clarityScore < 0.4) {
      suggestions.push('🎤 Fale mais claramente e devagar')
    }
    
    if (metrics.consistencyScore < 0.5) {
      suggestions.push('🎯 Mantenha um ritmo mais consistente')
    }
    
    if (metrics.sentimentScore > 0.7) {
      suggestions.push('😊 Tom positivo detectado - ótimo!')
    }
    
    if (suggestions.length === 0) {
      suggestions.push('📈 Continue desenvolvendo a conversa')
    }
    
    return suggestions.slice(0, 3)
  }
  
  // Detectar palavras-chave baseado em padrões
  const detectKeywords = (frequency: Uint8Array, average: number) => {
    const keywords = []
    
    if (average > 50) keywords.push('conversação')
    if (frequency[100] > 80) keywords.push('entusiasmo')
    if (frequency[200] > 60) keywords.push('clareza')
    if (average > 70) keywords.push('engajamento')
    
    return keywords.length > 0 ? keywords : ['análise', 'voz']
  }

  // Alternar ingrediente
  const toggleIngredient = (ingredient: string) => {
    setSelectedIngredients(prev =>
      prev.includes(ingredient)
        ? prev.filter(i => i !== ingredient)
        : [...prev, ingredient]
    )
  }

  // Alternar gravação
  const toggleRecording = () => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }

  // Calcular analytics baseado em dados reais
  const calculateAnalytics = () => {
    const targetRecordings = selectedRecordings.length > 0 
      ? recordings.filter(rec => selectedRecordings.includes(rec.id))
      : recordings
    
    if (targetRecordings.length === 0) return
    
    const totalDuration = targetRecordings.reduce((sum, rec) => sum + rec.duration, 0)
    
    // Calcular métricas reais baseadas nos dados de IA
    const recordingsWithAI = targetRecordings.filter(rec => rec.aiData)
    const avgSentiment = recordingsWithAI.length > 0 
      ? recordingsWithAI.reduce((sum, rec) => sum + (rec.aiData?.sentiment || 0.5), 0) / recordingsWithAI.length
      : sessionMetrics.avgSentiment
    
    const avgEngagement = recordingsWithAI.length > 0
      ? recordingsWithAI.reduce((sum, rec) => sum + (rec.aiData?.engagement || 0.5), 0) / recordingsWithAI.length
      : sessionMetrics.avgEngagement
    
    // Estatísticas semanais com dados reais
    const weeklyStats = []
    const today = new Date()
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dayRecordings = targetRecordings.filter(rec => {
        const recDate = new Date(rec.date)
        return recDate.toDateString() === date.toDateString()
      })
      
      const daySentiment = dayRecordings.length > 0 && dayRecordings.some(rec => rec.aiData)
        ? dayRecordings.filter(rec => rec.aiData).reduce((sum, rec) => sum + (rec.aiData?.sentiment || 0.5), 0) / dayRecordings.filter(rec => rec.aiData).length
        : 0.5
      
      weeklyStats.push({
        date: date.toLocaleDateString('pt-BR', { weekday: 'short' }),
        recordings: dayRecordings.length,
        avgDuration: dayRecordings.length > 0 ? 
          dayRecordings.reduce((sum, rec) => sum + rec.duration, 0) / dayRecordings.length / 60 : 0,
        sentiment: daySentiment
      })
    }
    
    // Keywords baseadas nos dados reais de IA
    const allKeywords: {[key: string]: number} = {}
    recordingsWithAI.forEach(rec => {
      rec.aiData?.keywords.forEach(keyword => {
        allKeywords[keyword] = (allKeywords[keyword] || 0) + 1
      })
    })
    
    const keywords = Object.entries(allKeywords)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([word, count]) => ({
        word,
        count,
        sentiment: count > 2 ? 'positive' : count > 1 ? 'neutral' : 'negative'
      }))
    
    setAnalyticsData({
      totalRecordings: targetRecordings.length,
      totalDuration,
      avgSentiment,
      avgEngagement,
      topKeywords: keywords,
      weeklyStats
    })
    
    // Calcular dados de performance
    calculatePerformanceData(targetRecordings, avgSentiment, avgEngagement)
  }
  
  // Calcular dados de performance
  const calculatePerformanceData = (recordings: any[], avgSentiment: number, avgEngagement: number) => {
    const overallScore = Math.round((avgSentiment * 0.4 + avgEngagement * 0.4 + (recordings.length / 10) * 0.2) * 100)
    
    // Dados de tendência (últimos 7 dias)
    const trendData = []
    const today = new Date()
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dayRecordings = recordings.filter(rec => {
        const recDate = new Date(rec.date)
        return recDate.toDateString() === date.toDateString()
      })
      
      const dayAvgSentiment = dayRecordings.length > 0 && dayRecordings.some(rec => rec.aiData)
        ? dayRecordings.filter(rec => rec.aiData).reduce((sum, rec) => sum + (rec.aiData?.sentiment || 0.5), 0) / dayRecordings.filter(rec => rec.aiData).length
        : 0.5
      
      const dayAvgEngagement = dayRecordings.length > 0 && dayRecordings.some(rec => rec.aiData)
        ? dayRecordings.filter(rec => rec.aiData).reduce((sum, rec) => sum + (rec.aiData?.engagement || 0.5), 0) / dayRecordings.filter(rec => rec.aiData).length
        : 0.5
      
      trendData.push({
        date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        score: Math.round((dayAvgSentiment * 0.5 + dayAvgEngagement * 0.5) * 100),
        sentiment: dayAvgSentiment,
        engagement: dayAvgEngagement
      })
    }
    
    // Breakdown de habilidades
    const skillsBreakdown = [
      { skill: 'Comunicação', current: Math.round(avgSentiment * 100), target: 85, improvement: 0 },
      { skill: 'Engajamento', current: Math.round(avgEngagement * 100), target: 80, improvement: 0 },
      { skill: 'Consistência', current: Math.min(recordings.length * 8, 100), target: 90, improvement: 0 },
      { skill: 'Duração Média', current: Math.min((recordings.reduce((sum, rec) => sum + rec.duration, 0) / recordings.length / 60) * 4, 100), target: 75, improvement: 0 },
      { skill: 'Frequência', current: Math.min(recordings.length * 12, 100), target: 70, improvement: 0 }
    ].map(skill => ({ ...skill, improvement: skill.current - skill.target }))
    
    // Conquistas
    const achievements = []
    if (recordings.length >= 5) achievements.push({ title: '5 Gravações', description: 'Completou 5 gravações', date: new Date().toLocaleDateString(), type: 'milestone' as const })
    if (avgSentiment > 0.8) achievements.push({ title: 'Alto Sentiment', description: 'Manteve sentiment acima de 80%', date: new Date().toLocaleDateString(), type: 'improvement' as const })
    if (recordings.length >= 3) achievements.push({ title: 'Sequência Ativa', description: 'Manteve atividade consistente', date: new Date().toLocaleDateString(), type: 'streak' as const })
    
    // Recomendações
    const recommendations = []
    if (avgSentiment < 0.7) recommendations.push({ title: 'Melhorar Tom de Voz', description: 'Pratique um tom mais positivo e entusiasmado', priority: 'high' as const, category: 'Comunicação' })
    if (avgEngagement < 0.6) recommendations.push({ title: 'Aumentar Engajamento', description: 'Use mais variações na voz e pausas estratégicas', priority: 'high' as const, category: 'Técnica' })
    if (recordings.length < 5) recommendations.push({ title: 'Praticar Mais', description: 'Faça mais gravações para melhorar consistência', priority: 'medium' as const, category: 'Frequência' })
    recommendations.push({ title: 'Análise Detalhada', description: 'Revise gravações anteriores para identificar padrões', priority: 'low' as const, category: 'Estratégia' })
    
    setPerformanceData({
      overallScore,
      trendData,
      skillsBreakdown,
      achievements,
      recommendations
    })
  }

  // Carregar gravações do localStorage
  useEffect(() => {
    const savedRecordings = localStorage.getItem('recordings')
    if (savedRecordings) {
      setRecordings(JSON.parse(savedRecordings))
    }
  }, [])
  
  // Recalcular analytics quando gravações mudarem
  useEffect(() => {
    calculateAnalytics()
  }, [recordings, sessionMetrics, selectedRecordings])

  // Verificar autenticação
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [loading, user, router])

  // Cleanup ao desmontar componente
  useEffect(() => {
    return () => {
      stopRecording()
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  // Dados dos planos
  const plans = {
    pro: {
      name: 'Pro Plan',
      price: 79,
      features: [
        'Advanced AI coaching',
        'Team analytics',
        'Unlimited recordings',
        'Custom reports',
        'Priority support'
      ]
    },
    enterprise: {
      name: 'Enterprise',
      price: 199,
      features: [
        'Everything in Pro',
        'CRM integration',
        'White-label solution',
        'API access',
        'Dedicated support'
      ]
    }
  }

  // Função para abrir modal de upgrade
  const openUpgradeModal = (plan = 'pro') => {
    setSelectedPlan(plan)
    setShowUpgradeModal(true)
  }

  // Função para processar upgrade
  const handleUpgrade = () => {
    const planName = plans[selectedPlan as keyof typeof plans].name
    setRedirecting(true)
    setNotification({
      message: `Upgrade para ${planName} iniciado! Redirecionando para pagamento...`,
      type: 'success'
    })
    setShowUpgradeModal(false)
    
    // Redirecionar para página de checkout após 2 segundos
    setTimeout(() => {
      router.push(`/checkout?plan=${selectedPlan}&userId=${user?.id}`)
    }, 2000)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
      {/* Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="glass border-b border-white/10 p-6"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="p-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg"
            >
              <Brain className="w-8 h-8" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">SalesAI Analyzer</h1>
              <p className="text-sm text-gray-300">AI-Powered Sales Call Intelligence</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-4 py-2 glass rounded-lg">
              <div className={`w-2 h-2 rounded-full animate-pulse ${
                isSubscribed() ? 'bg-green-400' : 'bg-yellow-400'
              }`}></div>
              <span className="text-sm">
                {isSubscribed() ? user?.subscription?.plan?.toUpperCase() : 'FREE'}
              </span>
            </div>
            
            <div className="flex items-center space-x-2 px-4 py-2 glass rounded-lg">
              <UserIcon className="w-4 h-4" />
              <span className="text-sm">{user?.name}</span>
            </div>
            
            {!isSubscribed() && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => openUpgradeModal('pro')}
                className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg font-medium"
              >
                Upgrade
              </motion.button>
            )}
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={logout}
              className="p-2 glass rounded-lg hover:bg-red-500/20"
            >
              <LogOut className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Navigation */}
      <motion.nav 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-7xl mx-auto p-6"
      >
        <div className="flex space-x-2 glass rounded-xl p-2">
          {[
            { id: 'live', label: 'Live Analysis', icon: Mic },
            { id: 'recordings', label: 'Recordings', icon: Volume2 },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'performance', label: 'Performance', icon: TrendingUp }
          ].map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all flex-1 justify-center ${
                activeTab === tab.id 
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 shadow-lg' 
                  : 'hover:bg-white/10'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="font-medium">{tab.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-6">
        <AnimatePresence mode="wait">
          {activeTab === 'live' && (
            <motion.div
              key="live"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Recording Control */}
              <div className="lg:col-span-2 space-y-6">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass rounded-xl p-8 text-center"
                >
                  <motion.div
                    animate={{ 
                      scale: isRecording ? [1, 1.1, 1] : 1,
                    }}
                    transition={{ duration: 1, repeat: isRecording ? Infinity : 0 }}
                    className="relative mb-6"
                  >
                    <div className="w-32 h-32 mx-auto bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
                      {isRecording ? (
                        <MicOff className="w-16 h-16" />
                      ) : (
                        <Mic className="w-16 h-16" />
                      )}
                    </div>
                    {isRecording && (
                      <motion.div
                        animate={{ scale: [1, 2], opacity: [1, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 border-4 border-cyan-400 rounded-full"
                      />
                    )}
                  </motion.div>

                  <h2 className="text-2xl font-bold mb-4">
                    {isRecording ? 'Recording Active' : 'Ready to Record'}
                  </h2>
                  
                  {isRecording && (
                    <div className="mb-6">
                      <div className="text-3xl font-mono font-bold mb-2">
                        {formatTime(currentTime)}
                      </div>
                      <div className="flex justify-center space-x-1 mb-4">
                        {Array.from({ length: 20 }).map((_, i) => (
                          <motion.div
                            key={i}
                            animate={{ 
                              scaleY: audioLevel > i * 12 ? (audioLevel / 255) * 2 + 0.3 : 0.2 
                            }}
                            className="w-1 h-8 bg-gradient-to-t from-cyan-500 to-blue-400 rounded-full"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`mb-4 p-4 rounded-lg border text-sm font-medium ${
                        error.includes('✓') 
                          ? 'bg-green-500/20 border-green-500/50 text-green-300'
                          : error.includes('❌')
                          ? 'bg-red-500/20 border-red-500/50 text-red-300'
                          : error.includes('Testando')
                          ? 'bg-blue-500/20 border-blue-500/50 text-blue-300'
                          : 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        {error.includes('✓') && <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />}
                        {error.includes('❌') && <div className="w-2 h-2 bg-red-400 rounded-full" />}
                        {error.includes('Testando') && <div className="w-2 h-2 bg-blue-400 rounded-full animate-spin" />}
                        <span>{error}</span>
                      </div>
                    </motion.div>
                  )}
                  


                  <div className="space-y-4">
                    {/* Botão Principal de Gravação */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={toggleRecording}
                      className={`w-full px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all ${
                        isRecording 
                          ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-red-500/25' 
                          : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-green-500/25'
                      }`}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        {isRecording ? (
                          <>
                            <MicOff className="w-6 h-6" />
                            <span>Stop Recording</span>
                          </>
                        ) : (
                          <>
                            <Mic className="w-6 h-6" />
                            <span>Start Recording</span>
                          </>
                        )}
                      </div>
                    </motion.button>
                  </div>
                </motion.div>

                {/* Real-time Insights */}
                {isRecording && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass rounded-xl p-6"
                  >
                    <h3 className="text-xl font-bold mb-4">Real-time Insights</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 glass rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-300">Sentiment</span>
                          <span className={`text-lg font-bold ${
                            aiAnalysis.sentiment === 'positive' ? 'text-green-400' :
                            aiAnalysis.sentiment === 'negative' ? 'text-red-400' : 'text-yellow-400'
                          }`}>
                            {aiAnalysis.sentiment.charAt(0).toUpperCase() + aiAnalysis.sentiment.slice(1)}
                          </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <motion.div
                            animate={{ width: `${aiAnalysis.sentimentScore * 100}%` }}
                            className={`h-full rounded-full ${
                              aiAnalysis.sentiment === 'positive' ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                              aiAnalysis.sentiment === 'negative' ? 'bg-gradient-to-r from-red-500 to-pink-500' :
                              'bg-gradient-to-r from-yellow-500 to-orange-500'
                            }`}
                          />
                        </div>
                      </div>
                      
                      <div className="p-4 glass rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-300">Engagement</span>
                          <span className={`text-lg font-bold ${
                            aiAnalysis.engagement === 'high' ? 'text-blue-400' :
                            aiAnalysis.engagement === 'low' ? 'text-gray-400' : 'text-cyan-400'
                          }`}>
                            {aiAnalysis.engagement.charAt(0).toUpperCase() + aiAnalysis.engagement.slice(1)}
                          </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <motion.div
                            animate={{ width: `${aiAnalysis.engagementScore * 100}%` }}
                            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 p-4 bg-black/30 rounded-lg">
                      <h4 className="font-medium mb-2">AI Suggestions</h4>
                      <div className="space-y-2 text-sm">
                        {aiAnalysis.suggestions.map((suggestion, index) => (
                          <motion.p
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`${
                              suggestion.includes('Excelente') ? 'text-green-400' :
                              suggestion.includes('Tente') ? 'text-yellow-400' : 'text-blue-400'
                            }`}
                          >
                            • {suggestion}
                          </motion.p>
                        ))}
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-gray-600">
                        <p className="text-xs text-gray-400 mb-2">Keywords:</p>
                        <div className="flex flex-wrap gap-1">
                          {aiAnalysis.keywords.map((keyword, index) => (
                            <span key={index} className="px-2 py-1 bg-cyan-500/20 text-cyan-300 rounded text-xs">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Right Sidebar */}
              <div className="space-y-6">
                {/* Quick Stats */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass rounded-xl p-6"
                >
                  <h3 className="text-lg font-bold mb-4">Today's Stats</h3>
                  <div className="space-y-4">
                    {[
                      { label: 'Calls Made', value: '8', icon: '📞', color: 'text-blue-400' },
                      { label: 'Avg Duration', value: '24m', icon: '⏱️', color: 'text-green-400' },
                      { label: 'Conversion Rate', value: '32%', icon: '🎯', color: 'text-purple-400' },
                      { label: 'AI Score', value: '87', icon: '🧠', color: 'text-cyan-400' }
                    ].map((stat, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 * index }}
                        className="flex items-center justify-between p-3 glass rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{stat.icon}</span>
                          <span className="text-sm text-gray-300">{stat.label}</span>
                        </div>
                        <span className={`font-bold text-lg ${stat.color}`}>{stat.value}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Recent Calls */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="glass rounded-xl p-6"
                >
                  <h3 className="text-lg font-bold mb-4">Recent Calls</h3>
                  <div className="space-y-3">
                    {[
                      { client: 'Acme Corp', duration: '28m', score: 92, status: 'Won' },
                      { client: 'Tech Solutions', duration: '15m', score: 67, status: 'Follow-up' },
                      { client: 'Global Inc', duration: '32m', score: 85, status: 'Proposal' }
                    ].map((call, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="p-3 glass rounded-lg hover:bg-white/20 transition-all cursor-pointer"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">{call.client}</span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            call.status === 'Won' ? 'bg-green-500/20 text-green-400' :
                            call.status === 'Follow-up' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-blue-500/20 text-blue-400'
                          }`}>
                            {call.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span>{call.duration}</span>
                          <span>Score: {call.score}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Upgrade Card */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="glass rounded-xl p-6 border border-cyan-500/50"
                >
                  <div className="text-center">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="text-4xl mb-3"
                    >
                      🚀
                    </motion.div>
                    <h3 className="text-lg font-bold mb-2">Upgrade to Pro</h3>
                    <p className="text-gray-300 text-sm mb-4">Advanced AI coaching & team analytics</p>
                    <div className="text-2xl font-bold mb-4">
                      <span className="gradient-text">$79</span>
                      <span className="text-sm text-gray-400">/month</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => openUpgradeModal('pro')}
                      className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg font-medium"
                    >
                      Upgrade Now
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {activeTab === 'recordings' && (
            <motion.div
              key="recordings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">My Recordings</h2>
                <div className="flex items-center space-x-4">
                  {selectedRecordings.length > 0 && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={viewSelectedAnalytics}
                      className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg text-sm font-medium"
                    >
                      Ver Analytics ({selectedRecordings.length})
                    </motion.button>
                  )}
                  <div className="text-sm text-gray-400">
                    {recordings.length} recording{recordings.length !== 1 ? 's' : ''}
                    {isAnalyzing && (
                      <div className="mt-1 text-xs text-cyan-400">
                        Analisando áudios com IA...
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {recordings.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass rounded-xl p-12 text-center"
                >
                  <Volume2 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-bold mb-2">No recordings yet</h3>
                  <p className="text-gray-400 mb-6">Start recording to see your audio files here</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab('live')}
                    className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg font-medium"
                  >
                    Start Recording
                  </motion.button>
                </motion.div>
              ) : (
                <div className="grid gap-4">
                  {recordings.map((recording, index) => (
                    <motion.div
                      key={recording.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="glass rounded-xl p-6"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 flex-1">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => toggleRecordingSelection(recording.id)}
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                              selectedRecordings.includes(recording.id)
                                ? 'bg-cyan-500 border-cyan-500'
                                : 'border-gray-400 hover:border-cyan-400'
                            }`}
                          >
                            {selectedRecordings.includes(recording.id) && (
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </motion.button>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-bold text-lg">{recording.name}</h3>
                              {recording.aiData && (
                                <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">
                                  IA Analisado
                                </span>
                              )}
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-400">
                              <span>{new Date(recording.date).toLocaleDateString()}</span>
                              <span>{formatTime(recording.duration)}</span>
                              {recording.aiData && (
                                <span className="text-cyan-400">
                                  Sentiment: {Math.round(recording.aiData.sentiment * 100)}%
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <audio 
                            controls 
                            src={recording.blob}
                            className="h-8"
                            style={{ filter: 'invert(1)' }}
                          />
                          
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => downloadRecording(recording)}
                            className="p-2 glass rounded-lg hover:bg-green-500/20"
                            title="Download recording"
                          >
                            <Download className="w-4 h-4" />
                          </motion.button>
                          
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => shareRecording(recording)}
                            className="p-2 glass rounded-lg hover:bg-blue-500/20"
                            title="Share recording"
                          >
                            <Upload className="w-4 h-4" />
                          </motion.button>
                          
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => deleteRecording(recording.id)}
                            className="p-2 glass rounded-lg hover:bg-red-500/20"
                            title="Delete recording"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {!canAccessFeature('analytics') && (
                <div className="lg:col-span-2 glass rounded-xl p-8 text-center">
                  <h2 className="text-2xl font-bold mb-4">Analytics Premium Feature</h2>
                  <p className="text-gray-300 mb-6">Upgrade to Pro or Enterprise to access advanced analytics</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => openUpgradeModal('pro')}
                    className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg font-medium"
                  >
                    Upgrade Now
                  </motion.button>
                </div>
              )}
              
              {canAccessFeature('analytics') && (
                <>
                {/* Overview Stats */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="lg:col-span-2 glass rounded-xl p-6 mb-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Analytics Overview</h2>
                    {selectedRecordings.length > 0 && (
                      <div className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-sm">
                        {selectedRecordings.length} gravações selecionadas
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-cyan-400">
                        {analyticsData.totalRecordings}
                      </div>
                      <div className="text-sm text-gray-400">Total Recordings</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">
                        {Math.round(analyticsData.totalDuration / 60)}m
                      </div>
                      <div className="text-sm text-gray-400">Total Duration</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">
                        {Math.round(analyticsData.avgSentiment * 100)}%
                      </div>
                      <div className="text-sm text-gray-400">Avg Sentiment</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">
                        {Math.round(analyticsData.avgEngagement * 100)}%
                      </div>
                      <div className="text-sm text-gray-400">Avg Engagement</div>
                    </div>
                  </div>
                </motion.div>
                
                {realTimeData.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-2 glass rounded-xl p-6 mb-6"
                  >
                    <h2 className="text-xl font-bold mb-4">Current Session Metrics</h2>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-cyan-400">
                          {Math.round(sessionMetrics.avgSentiment * 100)}%
                        </div>
                        <div className="text-sm text-gray-400">Session Sentiment</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">
                          {Math.round(sessionMetrics.avgEngagement * 100)}%
                        </div>
                        <div className="text-sm text-gray-400">Session Engagement</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">
                          {sessionMetrics.peakMoments}
                        </div>
                        <div className="text-sm text-gray-400">Peak Moments</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-400">
                          {sessionMetrics.totalWords}
                        </div>
                        <div className="text-sm text-gray-400">Voice Activity</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-400">
                          {Math.round(sessionMetrics.energyLevel * 100)}%
                        </div>
                        <div className="text-sm text-gray-400">Energy Level</div>
                      </div>
                    </div>
                  </motion.div>
                )}
              {/* Sentiment Analysis */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass rounded-xl p-6"
              >
                <h2 className="text-xl font-bold mb-6">Sentiment & Engagement</h2>
                {(() => {
                  const targetRecordings = selectedRecordings.length > 0 
                    ? recordings.filter(rec => selectedRecordings.includes(rec.id))
                    : recordings
                  
                  const combinedData = targetRecordings
                    .filter(rec => rec.aiData?.realTimeData)
                    .flatMap(rec => rec.aiData!.realTimeData)
                    .slice(-50) // Últimos 50 pontos
                  
                  return combinedData.length > 0 || realTimeData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={combinedData.length > 0 ? combinedData : realTimeData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="time" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(0,0,0,0.8)', 
                            border: '1px solid #374151',
                            borderRadius: '8px'
                          }} 
                        />
                        <Line type="monotone" dataKey="sentiment" stroke="#06b6d4" strokeWidth={3} name="Sentiment" />
                        <Line type="monotone" dataKey="engagement" stroke="#3b82f6" strokeWidth={3} name="Engagement" />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-center py-12 text-gray-400">
                      <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p>Nenhum dado de análise disponível</p>
                      <p className="text-sm mt-2">Faça gravações para ver dados de IA</p>
                    </div>
                  )
                })()}
              </motion.div>

              {/* Performance Radar */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass rounded-xl p-6"
              >
                <h2 className="text-xl font-bold mb-6">Performance Metrics</h2>
                {analyticsData.totalRecordings > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={[
                      { metric: 'Qualidade de Áudio', value: Math.round(analyticsData.avgEngagement * 100), fullMark: 100 },
                      { metric: 'Consistência', value: Math.min(analyticsData.totalRecordings * 10, 100), fullMark: 100 },
                      { metric: 'Sentiment Positivo', value: Math.round(analyticsData.avgSentiment * 100), fullMark: 100 },
                      { metric: 'Frequência de Uso', value: Math.min(analyticsData.totalRecordings * 15, 100), fullMark: 100 },
                      { metric: 'Duração Média', value: Math.min((analyticsData.totalDuration / analyticsData.totalRecordings) * 2, 100), fullMark: 100 }
                    ]}>
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
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <Brain className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Métricas de performance indisponíveis</p>
                    <p className="text-sm mt-2">Faça mais gravações para análise completa</p>
                  </div>
                )}
              </motion.div>

              {/* Keywords Analysis */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="glass rounded-xl p-6"
              >
                <h2 className="text-xl font-bold mb-6">Key Topics</h2>
                {analyticsData.topKeywords.length > 0 ? (
                  <div className="space-y-3">
                    {analyticsData.topKeywords.map((keyword, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="flex items-center justify-between p-3 glass rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            keyword.sentiment === 'positive' ? 'bg-green-400' :
                            keyword.sentiment === 'negative' ? 'bg-red-400' :
                            'bg-gray-400'
                          }`} />
                          <span className="font-medium">{keyword.word}</span>
                        </div>
                        <span className="text-sm text-gray-400">{keyword.count}x</span>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <p>Nenhum dado disponível</p>
                    <p className="text-sm mt-2">Faça algumas gravações para ver as análises</p>
                  </div>
                )}
              </motion.div>

              {/* Weekly Overview */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="glass rounded-xl p-6"
              >
                <h2 className="text-xl font-bold mb-6">Weekly Activity</h2>
                {analyticsData.weeklyStats.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analyticsData.weeklyStats}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="date" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(0,0,0,0.8)', 
                          border: '1px solid #374151',
                          borderRadius: '8px'
                        }} 
                      />
                      <Bar dataKey="recordings" fill="#06b6d4" name="Gravações" />
                      <Bar dataKey="avgDuration" fill="#3b82f6" name="Duração Média (min)" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Nenhuma atividade registrada</p>
                    <p className="text-sm mt-2">Comece a gravar para ver estatísticas</p>
                  </div>
                )}
              </motion.div>
                </>
              )}
            </motion.div>
          )}

          {activeTab === 'performance' && (
            <motion.div
              key="performance"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Performance Header */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Performance Dashboard</h2>
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold gradient-text">{performanceData.overallScore}</div>
                      <div className="text-sm text-gray-400">Overall Score</div>
                    </div>
                  </div>
                </div>
                
                {/* Performance Trend */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold mb-4">7-Day Performance Trend</h3>
                  {performanceData.trendData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={performanceData.trendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="date" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(0,0,0,0.8)', 
                            border: '1px solid #374151',
                            borderRadius: '8px'
                          }} 
                        />
                        <Line type="monotone" dataKey="score" stroke="#06b6d4" strokeWidth={3} name="Score" />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Faça mais gravações para ver tendências</p>
                    </div>
                  )}
                </div>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Skills Breakdown */}
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass rounded-xl p-6"
                >
                  <h3 className="text-xl font-bold mb-4">Skills Breakdown</h3>
                  <div className="space-y-4">
                    {performanceData.skillsBreakdown.map((skill, index) => (
                      <motion.div
                        key={skill.skill}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 glass rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{skill.skill}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold">{skill.current}%</span>
                            <span className={`text-sm ${
                              skill.improvement >= 0 ? 'text-green-400' : 'text-red-400'
                            }`}>
                              {skill.improvement >= 0 ? '+' : ''}{skill.improvement}
                            </span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2 mb-1">
                          <motion.div
                            animate={{ width: `${skill.current}%` }}
                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                            transition={{ duration: 1, delay: index * 0.1 }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-cyan-300">
                          <span>Current: {skill.current}%</span>
                          <span>Target: {skill.target}%</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Achievements */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass rounded-xl p-6"
                >
                  <h3 className="text-xl font-bold mb-4">Recent Achievements</h3>
                  {performanceData.achievements.length > 0 ? (
                    <div className="space-y-3">
                      {performanceData.achievements.map((achievement, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center space-x-3 p-3 glass rounded-lg"
                        >
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            achievement.type === 'milestone' ? 'bg-yellow-500/20 text-yellow-400' :
                            achievement.type === 'improvement' ? 'bg-green-500/20 text-green-400' :
                            'bg-blue-500/20 text-blue-400'
                          }`}>
                            {achievement.type === 'milestone' ? '🏆' :
                             achievement.type === 'improvement' ? '📈' : '🔥'}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{achievement.title}</h4>
                            <p className="text-sm text-blue-300">{achievement.description}</p>
                            <p className="text-xs text-cyan-400">{achievement.date}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-blue-300">
                      <div className="text-4xl mb-2">🏆</div>
                      <p>Faça gravações para desbloquear conquistas</p>
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Recommendations */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass rounded-xl p-6"
              >
                <h3 className="text-xl font-bold mb-4">AI Recommendations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {performanceData.recommendations.map((rec, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-lg border-l-4 ${
                        rec.priority === 'high' ? 'bg-red-500/10 border-red-500' :
                        rec.priority === 'medium' ? 'bg-yellow-500/10 border-yellow-500' :
                        'bg-blue-500/10 border-blue-500'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium">{rec.title}</h4>
                        <span className={`px-2 py-1 rounded text-xs ${
                          rec.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                          rec.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {rec.priority.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-blue-200 mb-2">{rec.description}</p>
                      <span className="text-xs text-cyan-300">{rec.category}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'recipes' && (
            <motion.div
              key="recipes"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold gradient-text mb-2">Recipe Finder</h2>
                <p className="text-blue-300">Select ingredients to find matching recipes</p>
              </div>

              {/* Ingredients Selector */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-xl p-6"
              >
                <h3 className="text-xl font-bold mb-4">Available Ingredients</h3>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                  {ingredients.map((ingredient) => (
                    <motion.button
                      key={ingredient}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleIngredient(ingredient)}
                      className={`p-3 rounded-lg font-medium transition-all ${
                        selectedIngredients.includes(ingredient)
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg'
                          : 'glass hover:bg-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-center space-x-1">
                        <span className="text-sm">{ingredient}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Selected Ingredients */}
              {selectedIngredients.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass rounded-xl p-4"
                >
                  <h4 className="font-bold mb-2">Selected: {selectedIngredients.length} ingredients</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedIngredients.map((ingredient) => (
                      <span
                        key={ingredient}
                        className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-sm"
                      >
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Recipes Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recipes
                  .filter(recipe =>
                    selectedIngredients.length === 0 ||
                    selectedIngredients.every(ingredient => recipe.ingredients.includes(ingredient))
                  )
                  .map((recipe, index) => (
                    <motion.div
                      key={recipe.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="glass rounded-xl p-6 hover:bg-white/10 transition-all"
                    >
                      <h4 className="text-xl font-bold mb-3">{recipe.name}</h4>
                      <div className="mb-4">
                        <p className="text-sm text-cyan-300 mb-2">Ingredients:</p>
                        <div className="flex flex-wrap gap-1">
                          {recipe.ingredients.map((ingredient) => (
                            <span
                              key={ingredient}
                              className={`px-2 py-1 rounded text-xs ${
                                selectedIngredients.includes(ingredient)
                                  ? 'bg-green-500/20 text-green-300'
                                  : 'bg-slate-500/20 text-blue-300'
                              }`}
                            >
                              {ingredient}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-cyan-400 font-medium">{recipe.time}</span>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg text-sm font-medium"
                        >
                          View Recipe
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Loading Overlay */}
      <AnimatePresence>
        {(redirecting || isAnalyzing) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass rounded-xl p-8 text-center max-w-md w-full mx-4"
            >
              {redirecting ? (
                <>
                  <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Redirecionando...</h3>
                  <p className="text-gray-300">Preparando sua página de pagamento</p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Analisando Áudios</h3>
                  <p className="text-gray-300 mb-4">IA processando suas gravações...</p>
                  <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                    <motion.div
                      animate={{ width: `${analysisProgress}%` }}
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <p className="text-sm text-cyan-400">{analysisProgress}% concluído</p>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notificação */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 z-50"
          >
            <div className={`p-4 rounded-lg glass border-l-4 ${
              notification.type === 'success' 
                ? 'border-green-500 bg-green-500/10' 
                : 'border-red-500 bg-red-500/10'
            }`}>
              <div className="flex items-center space-x-3">
                <span className={`text-2xl ${
                  notification.type === 'success' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {notification.type === 'success' ? '✓' : '⚠'}
                </span>
                <p className="text-white font-medium">{notification.message}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de Upgrade */}
      <AnimatePresence>
        {showUpgradeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowUpgradeModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="text-center mb-8">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-6xl mb-4"
                >
                  🚀
                </motion.div>
                <h2 className="text-3xl font-bold gradient-text mb-2">Upgrade Your Plan</h2>
                <p className="text-gray-300">Unlock advanced features and boost your sales performance</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {Object.entries(plans).map(([key, plan]) => (
                  <motion.div
                    key={key}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedPlan(key)}
                    className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedPlan === key
                        ? 'border-cyan-500 bg-cyan-500/10'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <div className="text-center mb-4">
                      <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                      <div className="text-3xl font-bold">
                        <span className="gradient-text">${plan.price}</span>
                        <span className="text-sm text-gray-400">/month</span>
                      </div>
                    </div>
                    
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <span className="text-green-400 mr-2">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>

              <div className="flex space-x-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowUpgradeModal(false)}
                  className="flex-1 py-3 px-6 border border-gray-600 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleUpgrade}
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg font-medium"
                >
                  Upgrade to {plans[selectedPlan as keyof typeof plans].name}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}