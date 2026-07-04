'use client'

import { useUsers } from '../hooks/useUsers'

import type { User } from '../../core/domain/entities/User'

const TYPE_LABEL: Record<User['type'], string> = {
  natural: 'Física',
  legal: 'Moral',
  foreign: 'Extranjero',
}

export function UsersDashboard () {
  const { data, isLoading, error, refetch } = useUsers()

  if (isLoading) return <p className='text-center py-12 text-gray-500'>Cargando usuarios...</p>
  if (error) return <p className='text-red-600 p-4'>Error: {error}</p>
  if (!data.length) return <p className='text-center py-12 text-gray-400 text-sm'>Sin usuarios registrados.</p>

  return (
    <div className='p-6 max-w-7xl mx-auto'>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='font-display text-2xl font-semibold text-gray-900'>Usuarios</h1>
        <button onClick={refetch} type='button' className='text-sm text-gray-600 border border-gray-300 px-3 py-2 rounded-lg hover:bg-gray-50'>
          Actualizar
        </button>
      </div>

      <div className='bg-white rounded-xl border border-gray-200 overflow-hidden'>
        <table className='w-full'>
          <thead className='bg-gray-50 border-b border-gray-200'>
            <tr>
              <th className='text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider'>RFC</th>
              <th className='text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider'>Nombre / Razón Social</th>
              <th className='text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider'>Tipo</th>
              <th className='text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider'>Régimen</th>
              <th className='text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider'>C.P.</th>
            </tr>
          </thead>
          <tbody>
            {data.map((user) => (
              <tr key={user.id} className='border-b border-gray-100 hover:bg-gray-50'>
                <td className='py-3 px-4 font-financial text-sm'>{user.rfc}</td>
                <td className='py-3 px-4 text-sm'>{user.legalName}</td>
                <td className='py-3 px-4 text-sm text-gray-600'>{TYPE_LABEL[user.type]}</td>
                <td className='py-3 px-4 font-financial text-sm text-gray-600'>{user.taxRegime}</td>
                <td className='py-3 px-4 font-financial text-sm'>{user.zipCode}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
