import { useState } from "react"

export const useStorage = (type: 'localStorage' | 'sessionStorage' = 'localStorage') => {
  if (!['localStorage', 'sessionStorage'].includes(type)) {
    throw new Error('Invalid storage type')
  }

  const getItem = (key: string) => {
    const value = window[type].getItem(key)
    return value ? JSON.parse(value) : undefined
  }

  const setItem = (key: string, value: any) => {
    window[type].setItem(key, JSON.stringify(value))
  }

  const removeItem = (key: string) => {
    window[type].removeItem(key)
  }

  return {
    getItem,
    setItem,
    removeItem,
  }
}

export const useLocalStorage = (key: string, initialValue: any) => {
  const { getItem, setItem, removeItem } = useStorage('localStorage')
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = getItem(key)
      return item ? item : initialValue
    } catch (error) {
      return initialValue
    }
  })

  const setValue = (value: any | ((prevValue: any) => any)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      setItem(key, valueToStore)
    } catch (error) {
      console.log(error)
    }
  };

  const removeValue = () => {
    removeItem(key)
    setStoredValue(initialValue)
  }

  return [storedValue, setValue, removeValue]
}