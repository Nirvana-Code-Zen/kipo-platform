export function useLatestClients() {
    const LATEST_CLIENTS = [
        { name: 'Refaccionaria López S.A.',    rfc: 'RLO930512KF4', facturas: 14, status: 'Al corriente' },
        { name: 'Distribuidora Morales',       rfc: 'DMO7812094L1', facturas: 7,  status: 'Vencida' },
        { name: 'Taquería El Buen Sabor',      rfc: 'TBS011203HH8', facturas: 3,  status: 'Al corriente' },
        { name: 'Consultora Torres & Asoc.',   rfc: 'CTA980814XP2', facturas: 21, status: 'Por vencer' },
    ]
    
    return {clients: LATEST_CLIENTS }
}