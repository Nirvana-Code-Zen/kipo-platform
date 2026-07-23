'use client'

import Link from 'next/link'
import { MailCheck } from 'lucide-react'

import { useAuth } from '../hooks/useAuth'

export const EmailConfirmView = () => {
  const { pendingEmail } = useAuth()

  return (
    <>
      <div className='text-center py-2 pb-6'>
        <MailCheck className='w-12 h-12 mx-auto mb-6 text-foreground' />
        <h1 className='font-display font-bold text-[28px] text-foreground tracking-[-0.03em] leading-tight mb-3'>
          Revisa tu correo
        </h1>
        <p className='text-sm text-muted-foreground font-sans leading-relaxed mb-2'>
          Enviamos un enlace de confirmación a
        </p>
        {pendingEmail && (
          <p className='text-[15px] font-semibold text-foreground font-sans mb-6'>
            {pendingEmail}
          </p>
        )}
        <p className='text-[13px] text-muted-foreground font-sans leading-relaxed'>
          Confirma tu cuenta para continuar.
          <br />
          Después podrás iniciar sesión y configurar tu empresa.
        </p>
      </div>

      <div className='border-t border-border-subtle pt-5 text-center'>
        <Link
          href='/login'
          className='text-[13px] text-muted-foreground font-sans underline underline-offset-[3px]'
        >
          Volver al inicio de sesión
        </Link>
      </div>
    </>
  )
}
