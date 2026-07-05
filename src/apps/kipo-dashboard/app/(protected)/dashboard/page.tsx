'use client'

import { ArrowUpRight, TrendUp, Receipt, Clock } from '@phosphor-icons/react'
import { Button, Badge } from '@kipo/ui-react'

// Mock data — replace with real API calls when Flask is ready
const STATS = [
  { label: 'Facturas emitidas',    value: '1,247', sub: 'Total histórico',         trend: '+8% este mes',  filled: true },
  { label: 'Timbradas este mes',   value: '89',    sub: 'CFDIs válidos',            trend: '+12 vs. julio', filled: false },
  { label: 'Pendientes de cobro',  value: '43',    sub: 'Monto: $184,320 MXN',     trend: '11 vencen pronto', filled: false },
  { label: 'Canceladas / error',   value: '12',    sub: 'Requieren atención',       trend: 'Ver detalles',  filled: false },
]

const BAR_DATA = [
  { label: 'Ene', value: 62 },
  { label: 'Feb', value: 78 },
  { label: 'Mar', value: 55 },
  { label: 'Abr', value: 91 },
  { label: 'May', value: 83 },
  { label: 'Jun', value: 97 },
  { label: 'Jul', value: 74 },
]

const VENCIMIENTOS = [
  { title: 'Declaración IVA julio 2026',  sub: 'SAT — Persona Moral',      days: 3,  urgent: true },
  { title: 'Pago provisional ISR',        sub: 'SAT — Persona Física',     days: 8,  urgent: false },
  { title: 'Factura cliente Hernández',   sub: 'CFDI pendiente de cobro',  days: 14, urgent: false },
]

const CLIENTES_RECIENTES = [
  { name: 'Refaccionaria López S.A.',    rfc: 'RLO930512KF4', facturas: 14, status: 'Al corriente' },
  { name: 'Distribuidora Morales',       rfc: 'DMO7812094L1', facturas: 7,  status: 'Vencida' },
  { name: 'Taquería El Buen Sabor',      rfc: 'TBS011203HH8', facturas: 3,  status: 'Al corriente' },
  { name: 'Consultora Torres & Asoc.',   rfc: 'CTA980814XP2', facturas: 21, status: 'Por vencer' },
]

const MAX_VAL = Math.max(...BAR_DATA.map(d => d.value))

function BarChart () {
  const chartH = 160
  const barW = 32
  const gap = 16

  return (
    <svg
      width='100%'
      viewBox={`0 0 ${BAR_DATA.length * (barW + gap)} ${chartH + 32}`}
      preserveAspectRatio='xMidYMid meet'
      aria-label='Actividad de facturación por mes'
      role='img'
    >
      {/* Y-axis guides */}
      {[0, 25, 50, 75, 100].map(pct => {
        const y = chartH - (pct / 100) * chartH
        return (
          <g key={pct}>
            <line x1={0} y1={y} x2={BAR_DATA.length * (barW + gap)} y2={y} stroke='var(--border-subtle)' strokeWidth={1} />
            <text x={0} y={y - 4} fontSize={9} fill='var(--text-muted)' fontFamily='var(--font-mono)'>{pct}</text>
          </g>
        )
      })}
      {/* Bars */}
      {BAR_DATA.map((d, i) => {
        const barH = (d.value / MAX_VAL) * chartH
        const x = i * (barW + gap)
        const y = chartH - barH
        const isMax = d.value === MAX_VAL
        return (
          <g key={d.label}>
            <rect
              x={x}
              y={y}
              width={barW}
              height={barH}
              rx={6}
              fill={isMax ? 'var(--brand)' : 'var(--kipo-red-100)'}
            />
            <text
              x={x + barW / 2}
              y={chartH + 16}
              textAnchor='middle'
              fontSize={11}
              fill='var(--text-muted)'
              fontFamily='var(--font-body)'
            >
              {d.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

function DonutProgress ({ pct }: { pct: number }) {
  const r = 52
  const circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ

  return (
    <div style={{ position: 'relative', width: 130, height: 130, flexShrink: 0 }}>
      <svg width={130} height={130} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={65} cy={65} r={r} fill='none' stroke='var(--border-subtle)' strokeWidth={10} />
        <circle
          cx={65} cy={65} r={r}
          fill='none'
          stroke='var(--brand)'
          strokeWidth={10}
          strokeLinecap='round'
          strokeDasharray={`${dash} ${circ - dash}`}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: 'var(--text-strong)', lineHeight: 1 }}>
          {pct}%
        </span>
        <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-body)', marginTop: 2 }}>
          Meta mensual
        </span>
      </div>
    </div>
  )
}

export default function DashboardPage () {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 28,
              color: 'var(--text-strong)',
              letterSpacing: '-0.03em',
              lineHeight: 1.2,
              margin: 0,
            }}
          >
            Dashboard
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', fontFamily: 'var(--font-body)', marginTop: 4 }}>
            Resumen de tu actividad fiscal y comprobantes digitales.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
          <Button variant='primary' size='sm' iconLeft={<Receipt size={15} />}>
            Nueva factura
          </Button>
          <Button variant='secondary' size='sm'>
            Importar XML
          </Button>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {STATS.map((s) => (
          <div
            key={s.label}
            style={{
              background: s.filled ? 'var(--brand)' : 'var(--surface-card)',
              borderRadius: 14,
              padding: '20px 20px 16px',
              border: s.filled ? 'none' : '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  fontFamily: 'var(--font-body)',
                  color: s.filled ? 'rgba(255,255,255,0.8)' : 'var(--text-muted)',
                  margin: 0,
                }}
              >
                {s.label}
              </p>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: s.filled ? 'rgba(255,255,255,0.18)' : 'var(--bg-base)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <ArrowUpRight size={14} color={s.filled ? '#fff' : 'var(--brand)'} />
              </div>
            </div>
            <div>
              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: 32,
                  color: s.filled ? '#fff' : 'var(--text-strong)',
                  letterSpacing: '-0.03em',
                  lineHeight: 1,
                  margin: 0,
                }}
              >
                {s.value}
              </p>
              <p
                style={{
                  fontSize: 12,
                  color: s.filled ? 'rgba(255,255,255,0.65)' : 'var(--text-muted)',
                  fontFamily: 'var(--font-body)',
                  marginTop: 6,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <TrendUp size={13} />
                {s.sub}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Main content grid: chart (left) + sidebar (right) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16, alignItems: 'start' }}>
        {/* Left: chart + recent clients */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Bar chart card */}
          <div
            style={{
              background: 'var(--surface-card)',
              borderRadius: 14,
              border: '1px solid var(--border-subtle)',
              padding: '20px 24px 16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16, color: 'var(--text-strong)', margin: 0 }}>
                Actividad fiscal
              </p>
              <Badge tone='success' style={{ fontSize: 11 }}>Enero - Julio 2026</Badge>
            </div>
            <BarChart />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>
                Promedio mensual: <strong style={{ color: 'var(--text-body)' }}>76 CFDIs</strong>
              </span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>
                Pico: <strong style={{ color: 'var(--brand)' }}>97 CFDIs</strong>
              </span>
            </div>
          </div>

          {/* Recent clients */}
          <div
            style={{
              background: 'var(--surface-card)',
              borderRadius: 14,
              border: '1px solid var(--border-subtle)',
              padding: '20px 24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16, color: 'var(--text-strong)', margin: 0 }}>
                Clientes recientes
              </p>
              <Button variant='ghost' size='sm'>Ver todos</Button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {CLIENTES_RECIENTES.map((c, i) => (
                <div
                  key={c.rfc}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 0',
                    borderBottom: i < CLIENTES_RECIENTES.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        background: 'var(--kipo-red-50)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: 'var(--font-display)',
                        fontWeight: 700,
                        fontSize: 14,
                        color: 'var(--brand)',
                        flexShrink: 0,
                      }}
                    >
                      {c.name[0]}
                    </div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-strong)', fontFamily: 'var(--font-body)', margin: 0, lineHeight: 1.3 }}>
                        {c.name}
                      </p>
                      <p style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', margin: 0 }}>
                        {c.rfc}
                      </p>
                    </div>
                  </div>
                  <Badge
                    tone={c.status === 'Al corriente' ? 'success' : c.status === 'Vencida' ? 'danger' : 'warning'}
                    style={{ fontSize: 11 }}
                  >
                    {c.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: vencimientos + progreso */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Vencimientos */}
          <div
            style={{
              background: 'var(--surface-card)',
              borderRadius: 14,
              border: '1px solid var(--border-subtle)',
              padding: '20px',
            }}
          >
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16, color: 'var(--text-strong)', margin: '0 0 14px' }}>
              Vencimientos
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {VENCIMIENTOS.map((v) => (
                <div
                  key={v.title}
                  style={{
                    background: v.urgent ? 'var(--kipo-danger-bg)' : 'var(--bg-base)',
                    borderRadius: 10,
                    padding: '12px 14px',
                    border: v.urgent ? '1px solid var(--kipo-red-100)' : '1px solid var(--border-subtle)',
                  }}
                >
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-strong)', fontFamily: 'var(--font-body)', margin: 0, lineHeight: 1.3 }}>
                    {v.title}
                  </p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-body)', margin: '3px 0 8px' }}>
                    {v.sub}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Clock size={12} color={v.urgent ? 'var(--brand)' : 'var(--text-muted)'} />
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        fontFamily: 'var(--font-body)',
                        color: v.urgent ? 'var(--brand)' : 'var(--text-muted)',
                      }}
                    >
                      Vence en {v.days} {v.days === 1 ? 'día' : 'días'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Progreso del periodo */}
          <div
            style={{
              background: 'var(--surface-card)',
              borderRadius: 14,
              border: '1px solid var(--border-subtle)',
              padding: '20px',
            }}
          >
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16, color: 'var(--text-strong)', margin: '0 0 16px' }}>
              Progreso del mes
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
              <DonutProgress pct={67} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { label: 'Timbradas', color: 'var(--brand)', count: '89 / 133' },
                { label: 'Pendientes', color: 'var(--kipo-warning)', count: '31' },
                { label: 'Canceladas', color: 'var(--text-muted)', count: '13' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: item.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: 'var(--text-body)', fontFamily: 'var(--font-body)' }}>{item.label}</span>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-strong)', fontFamily: 'var(--font-mono)' }}>
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
