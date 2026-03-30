export default function MetricFilter({ filters, onChange }) {
  const metrics = [
    { key: 'cpu', label: 'CPU', color: 'text-blue-400 border-blue-400' },
    { key: 'memory', label: '메모리', color: 'text-emerald-400 border-emerald-400' },
    { key: 'disk', label: '디스크', color: 'text-amber-400 border-amber-400' },
    { key: 'network', label: '네트워크', color: 'text-purple-400 border-purple-400' },
  ]

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500">메트릭 필터</span>
      {metrics.map(m => (
        <button
          key={m.key}
          onClick={() => onChange({ ...filters, [m.key]: !filters[m.key] })}
          className={`px-3 py-1 rounded-full text-xs font-medium border transition-all
            ${filters[m.key]
              ? m.color
              : 'text-gray-600 border-gray-700 hover:border-gray-500'}`}
        >
          {m.label}
        </button>
      ))}
    </div>
  )
}
