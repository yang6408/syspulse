import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export default function CpuChart({ data }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-300">CPU 사용률</h3>
        <span className="text-xs text-gray-600">%</span>
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="cpuGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937"/>
          <XAxis dataKey="time" stroke="#374151" tick={{ fontSize: 10, fill: '#6b7280' }}/>
          <YAxis stroke="#374151" domain={[0, 100]} tick={{ fontSize: 10, fill: '#6b7280' }}/>
          <Tooltip
            contentStyle={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 8 }}
            labelStyle={{ color: '#9ca3af' }}
            itemStyle={{ color: '#3b82f6' }}
          />
          <Area type="monotone" dataKey="value" stroke="#3b82f6" fill="url(#cpuGrad)" strokeWidth={2} dot={false}/>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
