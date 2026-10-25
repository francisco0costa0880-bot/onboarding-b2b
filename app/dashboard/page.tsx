'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Link from 'next/link'

interface Client {
  id: number
  created_at: string
  name: string
  email: string
  company_size: string
  status: string
}

export default function Dashboard() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<number | null>(null)

  // Carregar os clientes do Supabase
  const fetchClients = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('onboarding_clients')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao carregar clientes:', error.message)
    } else if (data) {
      setClients(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchClients()
  }, [])

  // Atualizar o estado de um cliente
  const handleStatusChange = async (id: number, newStatus: string) => {
    setUpdatingId(id)
    const { error } = await supabase
      .from('onboarding_clients')
      .update({ status: newStatus })
      .eq('id', id)

    if (error) {
      alert('Erro ao atualizar estado: ' + error.message)
    } else {
      // Atualiza a lista localmente
      setClients((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
      )
    }
    setUpdatingId(null)
  }

  // Contadores para os cartões de métricas
  const totalClients = clients.length
  const pendingCount = clients.filter((c) => c.status === 'Pendente').length
  const approvedCount = clients.filter((c) => c.status === 'Aprovado').length

  return (
    <main className="min-h-screen bg-slate-900 text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Painel de Gestão B2B</h1>
            <p className="text-slate-400 text-sm mt-1">
              Gira e acompanhe os pedidos de onboarding em tempo real.
            </p>
          </div>
          <Link
            href="/"
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm px-4 py-2 rounded-lg border border-slate-700 transition-colors"
          >
            ← Voltar ao Formulário
          </Link>
        </div>

        {/* Cartões de Métricas / Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-800 p-5 rounded-xl border border-slate-700">
            <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Total de Registos</p>
            <p className="text-3xl font-extrabold mt-2 text-white">{totalClients}</p>
          </div>
          <div className="bg-slate-800 p-5 rounded-xl border border-slate-700">
            <p className="text-amber-400 text-xs uppercase tracking-wider font-semibold">Pendentes</p>
            <p className="text-3xl font-extrabold mt-2 text-amber-400">{pendingCount}</p>
          </div>
          <div className="bg-slate-800 p-5 rounded-xl border border-slate-700">
            <p className="text-emerald-400 text-xs uppercase tracking-wider font-semibold">Aprovados</p>
            <p className="text-3xl font-extrabold mt-2 text-emerald-400">{approvedCount}</p>
          </div>
        </div>

        {/* Tabela de Clientes */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-700 flex justify-between items-center">
            <h2 className="font-semibold text-lg">Clientes Registados</h2>
            <button
              onClick={fetchClients}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
            >
              🔄 Atualizar
            </button>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-400">A carregar registos...</div>
          ) : clients.length === 0 ? (
            <div className="p-8 text-center text-slate-400">Nenhum cliente registado ainda.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-900/50 text-slate-400 uppercase text-xs">
                  <tr>
                    <th className="p-4">Empresa</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Tamanho</th>
                    <th className="p-4">Data</th>
                    <th className="p-4">Estado</th>
                    <th className="p-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {clients.map((client) => (
                    <tr key={client.id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="p-4 font-medium text-white">{client.name}</td>
                      <td className="p-4 text-slate-300">{client.email}</td>
                      <td className="p-4 text-slate-300">{client.company_size} colab.</td>
                      <td className="p-4 text-slate-400 text-xs">
                        {new Date(client.created_at).toLocaleDateString('pt-PT')}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                            client.status === 'Aprovado'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : client.status === 'Rejeitado'
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {client.status}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        {updatingId === client.id ? (
                          <span className="text-xs text-slate-400">A guardar...</span>
                        ) : (
                          <>
                            {client.status !== 'Aprovado' && (
                              <button
                                onClick={() => handleStatusChange(client.id, 'Aprovado')}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-2.5 py-1 rounded transition-colors"
                              >
                                Aprovar
                              </button>
                            )}
                            {client.status !== 'Rejeitado' && (
                              <button
                                onClick={() => handleStatusChange(client.id, 'Rejeitado')}
                                className="bg-rose-600 hover:bg-rose-500 text-white text-xs px-2.5 py-1 rounded transition-colors"
                              >
                                Rejeitar
                              </button>
                            )}
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </main>
  )
}