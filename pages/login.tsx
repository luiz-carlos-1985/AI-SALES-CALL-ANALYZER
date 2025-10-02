import { useState } from 'react'
import { motion } from 'framer-motion'
import { Brain, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useRouter } from 'next/router'

export default function Login() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simular autenticação
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Dados simulados do usuário
    const userData = {
      id: '1',
      name: isLogin ? formData.email.split('@')[0] : formData.name,
      email: formData.email,
      plan: 'free', // free, pro, enterprise
      subscription: {
        active: false,
        plan: 'free',
        expiresAt: null
      }
    }

    // Salvar no localStorage
    localStorage.setItem('user', JSON.stringify(userData))
    
    setLoading(false)
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="p-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg w-fit mx-auto mb-4"
          >
            <Brain className="w-10 h-10" />
          </motion.div>
          <h1 className="text-2xl font-bold gradient-text mb-2">SalesAI Analyzer</h1>
          <p className="text-gray-300">{isLogin ? 'Welcome back!' : 'Create your account'}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                required={!isLogin}
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-3 bg-black/30 border border-gray-600 rounded-lg focus:border-cyan-500 focus:outline-none"
                placeholder="Your full name"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <div className="relative">
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full p-3 bg-black/30 border border-gray-600 rounded-lg focus:border-cyan-500 focus:outline-none pl-10"
                placeholder="your@email.com"
              />
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full p-3 bg-black/30 border border-gray-600 rounded-lg focus:border-cyan-500 focus:outline-none pl-10 pr-10"
                placeholder="Your password"
              />
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className={`w-full py-3 rounded-lg font-medium ${
              loading
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-cyan-600 to-blue-600'
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{isLogin ? 'Signing in...' : 'Creating account...'}</span>
              </div>
            ) : (
              isLogin ? 'Sign In' : 'Create Account'
            )}
          </motion.button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-cyan-400 hover:text-cyan-300 text-sm"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>

        {isLogin && (
          <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg text-sm">
            <p className="text-blue-300">Demo credentials:</p>
            <p className="text-gray-300">Email: contato@arsmachinaconsultancy.com</p>
            <p className="text-gray-300">Password: demo123</p>
          </div>
        )}
      </motion.div>
    </div>
  )
}