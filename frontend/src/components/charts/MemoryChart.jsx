import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export default function MemoryChart({ data }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-300">메모리 사용량</h3>
        <span className="text-xs text-gray-600">%</span>
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="memGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937"/>
          <XAxis dataKey="time" stroke="#374151" tick={{ fontSize: 10, fill: '#6b7280' }}/>
          <YAxis stroke="#374151" domain={[0, 100]} tick={{ fontSize: 10, fill: '#6b7280' }}/>
          <Tooltip
            contentStyle={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 8 }}
            labelStyle={{ color: '#9ca3af' }}
            itemStyle={{ color: '#10b981' }}
          />
          <Area type="monotone" dataKey="value" stroke="#10b981" fill="url(#memGrad)" strokeWidth={2} dot={false}/>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
