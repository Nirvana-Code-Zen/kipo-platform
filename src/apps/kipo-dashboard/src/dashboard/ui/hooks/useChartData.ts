export function useChartData() {
    const BAR_DATA = [
        { label: 'Ene', value: 62 },
        { label: 'Feb', value: 78 },
        { label: 'Mar', value: 55 },
        { label: 'Abr', value: 91 },
        { label: 'May', value: 83 },
        { label: 'Jun', value: 97 },
        { label: 'Jul', value: 74 },
    ]

    const MAX_VAL = Math.max(...BAR_DATA.map(d => d.value))

    return { chart: BAR_DATA, maxVal: MAX_VAL }
}