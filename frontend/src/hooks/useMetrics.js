import { useState, useEffect } from 'react'
import axios from 'axios'

export default function useMetrics(vmIp, vmId, range = '1h', customRange = null) {
  const [metrics, setMetrics] = useState(null)
  const [history, setHistory] = useState([])

  // 실시간 현재값
  useEffect(() => {
    if (!vmIp) return
    const fetch = () => {
      axios.get(`/api/metrics/current?vm=${vmIp}`)
        .then(res => setMetrics(res.data))
        .catch(err => console.error(err))
    }
    fetch()
    const timer = setInterval(fetch, 5000)
    return () => clearInterval(timer)
  }, [vmIp])

  // DB 이력 조회
  useEffect(() => {
    if (!vmId) return
    const fetch = () => {
      let url = ''
      if (customRange?.start && customRange?.end) {
        // 직접 입력한 범위로 조회
        url = `/api/metrics/history?vm_id=${vmId}&start=${customRange.start}&end=${customRange.end}`
      } else {
        // 버튼 범위로 조회
        url = `/api/metrics/history?vm_id=${vmId}&range=${range}`
      }
      axios.get(url)
        .then(res => setHistory(res.data))
        .catch(err => console.error(err))
    }
    fetch()
    const timer = setInterval(fetch, 15000)
    return () => clearInterval(timer)
  }, [vmId, range, customRange])

  return { metrics, history }
}
