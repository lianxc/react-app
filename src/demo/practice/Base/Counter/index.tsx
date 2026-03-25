import React, { useEffect, useState } from 'react'

const BasicCounter = () => {
  const [count, setCount] = useState(0)
  return (
    <div>
      <h3>基础计数器: {count}</h3>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
      <button onClick={() => setCount(0)}>Reset</button>
      <p>Count: {count}</p>
    </div>
  )
}

const StepCounter = () => {
  const [count, setCount] = useState(0)
  const [step, setStep] = useState(() => Math.floor(Math.random() * 10) + 1);

  return (
    <div>
      <h3>计数: {count}</h3>
      <input type="number" value={count} onChange={(e) => setCount(Number(e.target.value))} />
      <button onClick={() => setCount(count + step)}>+{step}</button>
      <button onClick={() => setCount(count - step)}>-{step}</button>
    </div>
  )
}

const LimitCounter = () => {
  const [count, setCount] = useState(0)
  const increment = () => setCount(prev => Math.min(prev + Math.floor(Math.random() * 10), 100))
  const decrement = () => setCount(prev => Math.max(prev - Math.floor(Math.random() * 10), 0))

  return (
    <div>
      <h3>计数: {count}</h3>
      <progress value={count} max={100} />
      <button onClick={() => increment()}>Increment</button>
      <button onClick={() => decrement()}>Decrement</button>
    </div>
  )
}

const Timer = () => {
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds(prev => prev + 1)
      }, 1000)

      return () => {
        if (interval) {
          clearInterval(interval)
        }
      }
    }
  }, [isRunning])

  return (
    <div>
      <h3>计时器: {seconds} seconds</h3>
      <button onClick={() => setIsRunning(!isRunning)}>{isRunning ? 'Pause' : 'Start'}</button>
    </div>
  )
}

export { BasicCounter, StepCounter, LimitCounter, Timer }