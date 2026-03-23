import { useState, useEffect } from 'react'
import axios from 'axios'

export default function useVms() {
  const [vms, setVms] = useState([])

  useEffect(() => {
    const fetch = () => {
      axios.get('/api/vms')
        .then(res => setVms(res.data))
        .catch(err => console.error(err))
    }

    fetch()
    const timer = setInterval(fetch, 5000)
    return () => clearInterval(timer)
  }, [])

  return { vms }
}
