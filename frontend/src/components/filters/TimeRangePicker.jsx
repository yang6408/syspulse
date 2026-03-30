import { useState, useRef, useEffect } from 'react'

const RANGES = [
  { label: '1시간', value: '1h' },
  { label: '3시간', value: '3h' },
  { label: '6시간', value: '6h' },
  { label: '12시간', value: '12h' },
  { label: '24시간', value: '24h' },
]

// 시간 옵션 생성 (00:00 ~ 23:30, 30분 단위)
const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const h = String(Math.floor(i / 2)).padStart(2, '0')
  const m = i % 2 === 0 ? '00' : '30'
  return `${h}:${m}`
})

function DateTimePicker({ label, date, time, onDateChange, onTimeChange }) {
  const [showTime, setShowTime] = useState(false)
  const timeRef = useRef(null)

  useEffect(() => {
    const handleClick = (e) => {
      if (timeRef.current && !timeRef.current.contains(e.target)) {
        setShowTime(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs text-gray-500">{label}</label>
      <div className="flex gap-2">

        {/* 날짜 입력 - 선택 후 자동 닫힘 */}
        <input
          type="date"
          value={date}
          onChange={e => {
            onDateChange(e.target.value)
            e.target.blur() // 선택 후 달력 닫기
          }}
          className="flex-1 bg-gray-700 text-white text-xs rounded-lg px-3 py-2
            border border-gray-600 focus:outline-none focus:border-blue-500
            cursor-pointer"
        />

        {/* 시간 드롭다운 */}
        <div className="relative w-24" ref={timeRef}>
          <button
            onClick={() => setShowTime(!showTime)}
            className="w-full bg-gray-700 text-white text-xs rounded-lg px-3 py-2
              border border-gray-600 hover:border-blue-500 focus:outline-none
              text-left flex items-center justify-between"
          >
            <span>{time}</span>
            <span className="text-gray-400">▾</span>
          </button>

          {/* 시간 선택 목록 */}
          {showTime && (
            <div className="absolute z-50 top-9 left-0 w-28 bg-gray-700 border border-gray-600
              rounded-lg shadow-xl overflow-y-auto max-h-40">
              {TIME_OPTIONS.map(t => (
                <button
                  key={t}
                  onClick={() => {
                    onTimeChange(t)
                    setShowTime(false)
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs transition-all
                    ${time === t
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-600'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function TimeRangePicker({ range, onRangeChange, onCustomRange }) {
  const [showCustom, setShowCustom] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [startTime, setStartTime] = useState('00:00')
  const [endDate, setEndDate] = useState('')
  const [endTime, setEndTime] = useState('23:30')
  const ref = useRef(null)

  // 외부 클릭 시 패널 닫기
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setShowCustom(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleApply = () => {
    if (!startDate || !endDate) {
      alert('날짜를 입력해 주세요.')
      return
    }
    const start = `${startDate}T${startTime}:00`
    const end = `${endDate}T${endTime}:59`

    if (new Date(start) >= new Date(end)) {
      alert('시작 시간이 끝 시간보다 늦을 수 없습니다.')
      return
    }
    onCustomRange(start, end)
    setShowCustom(false)
  }

  const handleRangeClick = (value) => {
    onRangeChange(value)
    setShowCustom(false)
    setStartDate('')
    setEndDate('')
  }

  return (
    <div className="relative" ref={ref}>
      {/* 버튼 범위 선택 */}
      <div className="flex gap-1 bg-gray-800 rounded-lg p-1">
        {RANGES.map(r => (
          <button
            key={r.value}
            onClick={() => handleRangeClick(r.value)}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-all
              ${range === r.value && !showCustom
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white'}`}
          >
            {r.label}
          </button>
        ))}

        {/* 직접 입력 버튼 */}
        <button
          onClick={() => setShowCustom(!showCustom)}
          className={`px-3 py-1 rounded-md text-xs font-medium transition-all
            ${showCustom
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-white'}`}
        >
          직접 입력
        </button>
      </div>

      {/* 직접 입력 드롭다운 패널 */}
      {showCustom && (
        <div className="absolute right-0 top-10 z-50 bg-gray-800 border border-gray-700
          rounded-xl shadow-xl p-4 flex flex-col gap-4 w-80">
          <p className="text-xs font-semibold text-gray-400">조회 범위 직접 입력</p>

          <DateTimePicker
            label="시작"
            date={startDate}
            time={startTime}
            onDateChange={setStartDate}
            onTimeChange={setStartTime}
          />

          <DateTimePicker
            label="끝"
            date={endDate}
            time={endTime}
            onDateChange={setEndDate}
            onTimeChange={setEndTime}
          />

          {/* 버튼 */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowCustom(false)}
              className="flex-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300
                text-xs font-medium rounded-lg transition-all"
            >
              취소
            </button>
            <button
              onClick={handleApply}
              className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white
                text-xs font-medium rounded-lg transition-all"
            >
              조회
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
