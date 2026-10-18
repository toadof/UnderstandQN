import { useState, useCallback, useRef, useEffect } from 'react'
import axios from 'axios'

const API_URL = '/api/trace'

const DEFAULT_CODE = `def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`

const DEFAULT_INPUTS = {
  nums: [2, 7, 11, 15],
  target: 9,
}

const DEFAULT_TAGS = {
  nums: 'array',
  seen: 'hashmap',
  i: 'pointer',
}

export function useTracer() {
  const [code, setCode] = useState(DEFAULT_CODE)
  const [inputs, setInputs] = useState(DEFAULT_INPUTS)
  const [tags, setTags] = useState(DEFAULT_TAGS)
  const [steps, setSteps] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(500)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const intervalRef = useRef(null)

  const trace = useCallback(async () => {
    setLoading(true)
    setError(null)
    setSteps([])
    setCurrentIndex(0)
    setIsPlaying(false)

    try {
      const response = await axios.post(API_URL, { code, inputs })
      setSteps(response.data.steps)
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Trace failed'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }, [code, inputs])

  const pause = useCallback(() => {
    setIsPlaying(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const play = useCallback(() => {
    if (steps.length === 0) return
    setIsPlaying(true)
  }, [steps])

  const nextStep = useCallback(() => {
    setCurrentIndex((prev) => Math.min(prev + 1, steps.length - 1))
  }, [steps.length])

  const prevStep = useCallback(() => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0))
  }, [])

  const reset = useCallback(() => {
    pause()
    setCurrentIndex(0)
  }, [pause])

  const goToStep = useCallback(
    (index) => {
      setCurrentIndex(Math.max(0, Math.min(index, steps.length - 1)))
    },
    [steps.length]
  )

  // Auto-play effect
  useEffect(() => {
    if (!isPlaying || steps.length === 0) return

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= steps.length - 1) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
          setIsPlaying(false)
          return prev
        }
        return prev + 1
      })
    }, speed)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isPlaying, speed, steps.length])

  const currentStep = steps[currentIndex] || null

  return {
    code, setCode,
    inputs, setInputs,
    tags, setTags,
    steps, currentStep, currentIndex,
    isPlaying, speed, setSpeed,
    loading, error,
    trace, play, pause, nextStep, prevStep, reset, goToStep,
    totalSteps: steps.length,
    hasNext: currentIndex < steps.length - 1,
    hasPrev: currentIndex > 0,
  }
}
