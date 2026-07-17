import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore.js'

const LoginForm = () => {
  const [form, setForm] = useState({ email: '', password: '' })
  const [validationError, setValidationError] = useState(null)
  const { login, loading, error } = useAuthStore()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setValidationError(null)

    if (!form.email.trim() || !form.password.trim()) {
      setValidationError('Todos los campos son obligatorios')
      return
    }

    const result = await login(form)
    if (result.success) {
      navigate('/dashboard')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="mb-8">
        <h2 className="text-3xl font-black tracking-tight text-slate-900">Bienvenido de nuevo</h2>
        <p className="mt-2 text-slate-500">Ingresa tus credenciales para continuar</p>
      </div>

      {(validationError || error) && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {validationError || error}
        </div>
      )}

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-slate-700">
          Correo electrónico
        </label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="correo@ejemplo.com"
          className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm transition-colors focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-slate-700">
          Contraseña
        </label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="••••••••"
          className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm transition-colors focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 py-3 font-bold text-white shadow-lg shadow-emerald-600/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-600/30 active:scale-[0.98] disabled:opacity-50"
      >
        {loading ? 'Ingresando...' : 'Ingresar'}
      </button>
    </form>
  )
}

export default LoginForm
