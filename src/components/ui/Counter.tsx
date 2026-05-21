'use client'

import { useState } from 'react'

interface CounterProps {
  value: number
  onChange: (value: number) => void
}

export function Counter({ value, onChange }: CounterProps) {
  const [isInputMode, setIsInputMode] = useState(false)
  const [inputValue, setInputValue] = useState('')

  const increment = () => onChange(value + 1)
  const decrement = () => onChange(Math.max(0, value - 1))

  const handleInputSubmit = () => {
    const num = parseInt(inputValue)
    if (!isNaN(num) && num >= 0) {
      onChange(num)
    }
    setIsInputMode(false)
    setInputValue('')
  }

  return (
    <div className="flex flex-col items-center">
      {!isInputMode ? (
        <>
          <div className="flex items-center gap-8 mb-4">
            <button
              onClick={decrement}
              className="w-20 h-20 bg-red-100 text-red-600 rounded-2xl text-4xl font-bold hover:bg-red-200 transition-colors active:scale-95"
            >
              -
            </button>
            
            <div className="text-center">
              <span className="text-7xl font-bold text-gray-900">{value}</span>
              <p className="text-sm text-gray-500 mt-1">unidades</p>
            </div>
            
            <button
              onClick={increment}
              className="w-20 h-20 bg-green-100 text-green-600 rounded-2xl text-4xl font-bold hover:bg-green-200 transition-colors active:scale-95"
            >
              +
            </button>
          </div>
          
          <button
            onClick={() => setIsInputMode(true)}
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
          >
            Digitar valor manualmente
          </button>
        </>
      ) : (
        <div className="space-y-3 w-full">
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleInputSubmit()}
            placeholder="Digite a quantidade"
            className="w-full px-4 py-3 text-center text-3xl border-2 border-indigo-300 rounded-lg focus:border-indigo-500 focus:outline-none"
            autoFocus
          />
          <div className="flex gap-3">
            <button
              onClick={handleInputSubmit}
              className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold"
            >
              OK
            </button>
            <button
              onClick={() => setIsInputMode(false)}
              className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
