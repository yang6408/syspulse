import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
         CartesianGrid, ReferenceLine } from 'recharts'

const THRESHOLD = 80 // CPU 임계치 80%

export default function CpuChart({ data }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-300">CPU 사용률</h3>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-xs text-red-400">
            <span className="w-3 h-0.5 bg-red-400 inline-block"/>
            임계치 {THRESHOLD}%
          </span>
          <span className="text-xs text-gray-600">%</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="cpuGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="cpuDanger" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937"/>
          <XAxis dataKey="time" stroke="#374151" tick={{ fontSize: 10, fill: '#6b7280' }}/>
          <YAxis stroke="#374151" domain={[0, 100]} tick={{ fontSize: 10, fill: '#6b7280' }}/>
          <Tooltip
            contentStyle={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 8 }}
            labelStyle={{ color: '#9ca3af' }}
            formatter={(value) => [
              `${value}%`,
              value >= THRESHOLD
                ? <span style={{ color: '#ef4444' }}>CPU (임계치 초과)</span>
                : 'CPU'
            ]}
          />
          {/* 임계치 기준선 */}
          <ReferenceLine
            y={THRESHOLD}
            stroke="#ef4444"
            strokeDasharray="4 4"
            strokeWidth={1.5}
          />
          {/* 정상 영역 */}
          <Area
            type="monotone"
            dataKey="value"
            stroke="#3b82f6"
            fill="url(#cpuGrad)"
            strokeWidth={2}
            dot={false}
          />
          {/* 임계치 초과 영역 (빨간색) */}
          <Area
            type="monotone"
            dataKey={(d) => d.value >= THRESHOLD ? d.value : null}
            stroke="#ef4444"
            fill="url(#cpuDanger)"
            strokeWidth={2}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
