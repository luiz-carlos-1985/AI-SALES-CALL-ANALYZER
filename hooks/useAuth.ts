import { useState, useEffect } from 'react'

export interface User {
  id: string
  name: string
  email: string
  plan: 'free' | 'pro' | 'enterprise'
  subscription: {
    active: boolean
    plan: 'free' | 'pro' | 'enterprise'
    expiresAt: string | null
  }
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
    setLoading(false)
  }, [])

  const login = (userData: User) => {
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('user')
    setUser(null)
  }

  const updateSubscription = (plan: 'pro' | 'enterprise') => {
    if (user) {
      const updatedUser = {
        ...user,
        plan,
        subscription: {
          active: true,
          plan,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        }
      }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      setUser(updatedUser)
    }
  }

  const isSubscribed = () => {
    if (!user || !user.subscription) return false
    return user.subscription.active && user.subscription.plan !== 'free'
  }

  const canAccessFeature = (feature: 'analytics' | 'team' | 'api') => {
    if (!user || !user.subscription) return false
    
    const { plan } = user.subscription
    
    switch (feature) {
      case 'analytics':
        return plan === 'pro' || plan === 'enterprise'
      case 'team':
        return plan === 'enterprise'
      case 'api':
        return plan === 'enterprise'
      default:
        return false
    }
  }

  return {
    user,
    loading,
    login,
    logout,
    updateSubscription,
    isSubscribed,
    canAccessFeature
  }
}