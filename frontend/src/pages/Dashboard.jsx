import { useState, useEffect, useRef } from 'react'
import useVms from '../hooks/useVms'
import useMetrics from '../hooks/useMetrics'
import VmList from '../components/vms/VmList'
import CpuChart from '../components/charts/CpuChart'
import MemoryChart from '../components/charts/MemoryChart'
import DiskChart from '../components/charts/DiskChart'
import NetworkChart from '../components/charts/NetworkChart'
import MetricFilter from '../components/filters/MetricFilter'
import TimeRangePicker from '../components/filters/TimeRangePicker'

export default function Dashboard() {
  const { vms } = useVms()
  const [selectedVm, setSelectedVm] = useState(null)
  const [range, setRange] = useState('1h')
  const [customRange, setCustomRange] = useState(null)
  const [filters, setFilters] = useState({
    cpu: true, memory: true, disk: true, network: true,
  })
  const { metrics, history } = useMetrics(
    selectedVm?.local_ip, selectedVm?.id, range, customRange
  )

  // 실시간 시계
  const [now, setNow] = useState(new Date().toLocaleString('ko-KR'))
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date().toLocaleString('ko-KR'))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // 이전 메트릭 값 저장 (증감 표시용)
  const prevMetrics = useRef(null)
  const [diff, setDiff] = useState({ cpu: 0, memory: 0, disk: 0, network: 0 })

  useEffect(() => {
    if (!metrics) return
    if (prevMetrics.current) {
      setDiff({
        cpu: parseFloat(metrics.cpu) - parseFloat(prevMetrics.current.cpu),
        memory: parseFloat(metrics.memory) - parseFloat(prevMetrics.current.memory),
        disk: parseFloat(metrics.disk) - parseFloat(prevMetrics.current.disk),
        network: parseFloat(metrics.network) - parseFloat(prevMetrics.current.network),
      })
    }
    prevMetrics.current = metrics
  }, [metrics])

  const handleRangeChange = (value) => {
    setRange(value)
    setCustomRange(null)
  }

  const handleCustomRange = (start, end) => {
    setCustomRange({ start, end })
  }

  // 증감 표시 컴포넌트
  const DiffBadge = ({ value }) => {
    if (Math.abs(value) < 0.01) return null
    const up = value > 0
    return (
      <span className={`text-xs font-medium ml-1 ${up ? 'text-red-400' : 'text-emerald-400'}`}>
        {up ? '↑' : '↓'} {Math.abs(value).toFixed(2)}
      </span>
    )
  }

  return (
    <div className="flex h-screen bg-gray-950 text-white overflow-hidden">
      <VmList vms={vms} selectedVm={selectedVm} onSelect={setSelectedVm}/>

      <div className="flex-1 flex flex-col overflow-hidden">

        {/* 헤더 */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-900">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"/>
            <h1 className="text-xl font-bold tracking-tight">
              Sys<span className="text-blue-400">Pulse</span>
            </h1>
            {selectedVm && (
              <span className="ml-2 px-2 py-0.5 rounded bg-blue-600 text-sm font-medium">
                {selectedVm.alias}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            {selectedVm && (
              <MetricFilter filters={filters} onChange={setFilters}/>
            )}
            {selectedVm && (
              <TimeRangePicker
                range={range}
                onRangeChange={handleRangeChange}
                onCustomRange={handleCustomRange}
              />
            )}
            {/* 실시간 시계 */}
            <span className="text-xs text-gray-500 tabular-nums">{now}</span>
          </div>
        </header>

        {/* 메인 콘텐츠 */}
        <main className="flex-1 overflow-auto p-6">
          {!selectedVm ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-600">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                  d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2v-4M9 21H5a2 2 0 01-2-2v-4m0 0h18"/>
              </svg>
              <p className="text-sm">왼쪽에서 VM을 선택하세요</p>
            </div>
          ) : (
            <>
              {/* 현재값 요약 카드 */}
              <div className="grid grid-cols-4 gap-3 mb-5">
                {[
                  { label: 'CPU', value: metrics?.cpu, unit: '%', color: 'text-blue-400', key: 'cpu' },
                  { label: '메모리', value: metrics?.memory, unit: '%', color: 'text-emerald-400', key: 'memory' },
                  { label: '디스크', value: metrics?.disk, unit: '%', color: 'text-amber-400', key: 'disk' },
                  { label: '네트워크', value: metrics?.network, unit: 'B/s', color: 'text-purple-400', key: 'network' },
                ].map(item => (
                  <div key={item.label}
                    className={`bg-gray-900 border rounded-xl p-4 transition-all
                      ${filters[item.key] ? 'border-gray-800' : 'border-gray-900 opacity-40'}`}>
                    <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                    <div className="flex items-end gap-1">
                      <p className={`text-2xl font-bold ${item.color}`}>
                        {item.value ?? '-'}
                        <span className="text-xs text-gray-500 ml-1">{item.unit}</span>
                      </p>
                      <DiffBadge value={diff[item.key]}/>
                    </div>
                  </div>
                ))}
              </div>

              {/* 차트 그리드 */}
              <div className="grid grid-cols-2 gap-4">
                {filters.cpu && (
                  <CpuChart data={history.map(h => ({ time: h.time, value: parseFloat(h.cpu) }))}/>
                )}
                {filters.memory && (
                  <MemoryChart data={history.map(h => ({ time: h.time, value: parseFloat(h.memory) }))}/>
                )}
                {filters.disk && (
                  <DiskChart value={metrics?.disk}/>
                )}
                {filters.network && (
                  <NetworkChart data={history.map(h => ({ time: h.time, value: parseFloat(h.network) }))}/>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
