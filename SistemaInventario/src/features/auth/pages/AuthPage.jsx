import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Boxes, PackageCheck, TrendingUp, ShieldCheck } from 'lucide-react'
import LoginForm from '../components/LoginForm.jsx'
import RegisterForm from '../components/RegisterForm.jsx'
import { useAuthStore } from '../store/useAuthStore.js'

const features = [
  {
    icon: PackageCheck,
    title: 'Control total del inventario',
    description: 'Productos, categorías y existencias siempre actualizadas'
  },
  {
    icon: TrendingUp,
    title: 'Reportes inteligentes',
    description: 'Alertas de stock, productos más vendidos y exportación a Excel'
  },
  {
    icon: ShieldCheck,
    title: 'Acceso seguro',
    description: 'Autenticación con JWT y contraseñas cifradas con Argon2'
  }
]

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true)
  const { token, clearError } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (token) {
      navigate('/dashboard')
    }
  }, [token, navigate])

  const toggleForm = () => {
    clearError()
    setIsLogin(!isLogin)
  }

  return (
    <div className="flex min-h-screen bg-slate-950">
      {/* Panel izquierdo - branding */}
      <div className="relative hidden flex-1 flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 p-12 lg:flex">
        {/* Decoración de fondo */}
        <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -right-20 h-[28rem] w-[28rem] rounded-full bg-teal-500/10 blur-3xl" />

        <div className="relative flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-xl shadow-emerald-500/30">
            <Boxes className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-white">Inventario App</h1>
            <p className="text-xs font-medium uppercase tracking-widest text-emerald-400/80">
              Sistema de gestión
            </p>
          </div>
        </div>

        <div className="relative space-y-8">
          <h2 className="max-w-md text-4xl font-black leading-tight text-white">
            Administra tu inventario de forma{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              simple e inteligente
            </span>
          </h2>

          <div className="space-y-5">
            {features.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10">
                  <Icon className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <p className="font-bold text-white">{title}</p>
                  <p className="text-sm text-slate-400">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-slate-500">
          © {new Date().getFullYear()} Inventario App · Desarrollo ágil de aplicaciones web
        </p>
      </div>

      {/* Panel derecho - formulario */}
      <div className="flex flex-1 items-center justify-center bg-white px-8 py-12 sm:px-16 lg:px-24">
        <div className="animate-fade-up w-full max-w-lg">
          {/* Logo visible solo en pantallas pequeñas */}
          <div className="mb-10 flex items-center justify-center gap-3 lg:hidden">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600">
              <Boxes className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-extrabold text-slate-900">Inventario App</h1>
          </div>

          {isLogin ? <LoginForm /> : <RegisterForm />}

          <p className="mt-8 text-center text-sm text-slate-500">
            {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
            <button
              onClick={toggleForm}
              className="font-bold text-emerald-600 transition-colors hover:text-emerald-700"
            >
              {isLogin ? 'Regístrate gratis' : 'Inicia sesión'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default AuthPage
