export function useStats() {
    const STATS = [
        { label: 'Facturas emitidas',    value: '1,247', sub: 'Total histórico',         trend: '+8% este mes',  filled: true },
        { label: 'Timbradas este mes',   value: '89',    sub: 'CFDIs válidos',            trend: '+12 vs. julio', filled: false },
        { label: 'Pendientes de cobro',  value: '43',    sub: 'Monto: $184,320 MXN',     trend: '11 vencen pronto', filled: false },
        { label: 'Canceladas / error',   value: '12',    sub: 'Requieren atención',       trend: 'Ver detalles',  filled: false },
    ]

    return { stats: STATS }
}