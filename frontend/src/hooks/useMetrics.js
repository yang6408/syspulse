import { useState, useEffect } from 'react'
import axios from 'axios'

export default function useMetrics(vmIp, vmId) {
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

  // DB 이력 조회 (15초마다 갱신)
  useEffect(() => {
    if (!vmId) return
    const fetch = () => {
      axios.get(`/api/metrics/history?vm_id=${vmId}&range=1h`)
        .then(res => setHistory(res.data))
        .catch(err => console.error(err))
    }
    fetch()
    const timer = setInterval(fetch, 15000)
    return () => clearInterval(timer)
  }, [vmId])

  return { metrics, history }
}
