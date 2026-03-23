import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

export default function DiskChart({ value }) {
  const used = parseFloat(value) || 0
  const free = 100 - used

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-300">디스크 사용량</h3>
        <span className="text-xs text-gray-600">%</span>
      </div>
      <div className="flex items-center gap-6">
        <ResponsiveContainer width="50%" height={160}>
          <PieChart>
            <Pie data={[{ value: used }, { value: free }]}
              cx="50%" cy="50%" innerRadius={45} outerRadius={65}
              startAngle={90} endAngle={-270} dataKey="value">
              <Cell fill="#f59e0b"/>
              <Cell fill="#1f2937"/>
            </Pie>
            <Tooltip
              contentStyle={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 8 }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-xs text-gray-500 mb-0.5">사용 중</p>
            <p className="text-xl font-bold text-amber-400">{used}<span className="text-xs text-gray-500 ml-1">%</span></p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-0.5">여유</p>
            <p className="text-xl font-bold text-gray-400">{free.toFixed(2)}<span className="text-xs text-gray-500 ml-1">%</span></p>
          </div>
        </div>
      </div>
    </div>
  )
}
