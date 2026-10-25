'use client'

import { useState } from 'react'
import { supabase } from './lib/supabase'

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company_size: '1-10',
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const { error } = await supabase.from('onboarding_clients').insert([
      {
        name: formData.name,
        email: formData.email,
        company_size: formData.company_size,
        status: 'Pendente',
      },
    ])

    if (error) {
      setMessage('Erro ao guardar os dados: ' + error.message)
    } else {
      setMessage('✅ Onboarding enviado com sucesso!')
      setFormData({ name: '', email: '', company_size: '1-10' })
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
      <div className="bg-slate-800 p-8 rounded-xl shadow-lg max-w-md w-full border border-slate-700">
        <h1 className="text-2xl font-bold mb-2 text-center">Onboarding de Cliente</h1>
        <p className="text-slate-400 text-sm mb-6 text-center">
          Registe a sua empresa para iniciar o processo de integração.
        </p>

        {message && (
          <div
            className={`p-3 rounded mb-4 text-sm text-center ${
              message.startsWith('✅')
                ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                : 'bg-red-500/10 text-red-400 border border-red-500/20'
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nome / Empresa</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:outline-none focus:border-blue-500"
              placeholder="Ex: ACME Corp"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email de Contacto</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:outline-none focus:border-blue-500"
              placeholder="exemplo@empresa.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tamanho da Empresa</label>
            <select
              value={formData.company_size}
              onChange={(e) => setFormData({ ...formData, company_size: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="1-10">1 - 10 colaboradores</option>
              <option value="11-50">11 - 50 colaboradores</option>
              <option value="51-200">51 - 200 colaboradores</option>
              <option value="201+">Mais de 200 colaboradores</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 rounded transition-colors disabled:opacity-50"
          >
            {loading ? 'A enviar...' : 'Concluir Onboarding'}
          </button>
        </form>
      </div>
    </main>
  )
}