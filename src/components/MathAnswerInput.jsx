import { useRef } from 'react'

const keys = [
  { label: '−', value: '-', title: 'Добавить минус' },
  { label: 'a/b', value: '/', title: 'Добавить дробную черту' },
  { label: '.', value: '.', title: 'Добавить десятичную точку' },
  { label: ':', value: ':', title: 'Добавить знак отношения' },
  { label: '%', value: '%', title: 'Добавить знак процента' },
  { label: '(', value: '(', title: 'Открыть скобку' },
  { label: ')', value: ')', title: 'Закрыть скобку' },
]

export default function MathAnswerInput({ id, value = '', onChange, disabled, kind }) {
  const inputRef = useRef(null)
  const specialKeys = kind === 'set' ? ['−','{','}',';','∅'] : kind === 'interval' ? ['−','(',')','[',']',';','∞','∪','∅'] : null
  const inputKeys = specialKeys ? specialKeys.map((symbol) => ({ label: symbol, value: symbol === '−' ? '-' : symbol, title: 'Добавить ' + symbol })) : keys
  const placeholder = kind === 'set' ? 'Например: {1; 3; 5} или ∅' : kind === 'interval' ? 'Например: [-2; 4) или (3; +∞)' : 'Например: −7, 3/5 или 2 1/4'

  const restoreFocus = (position) => {
    requestAnimationFrame(() => {
      inputRef.current?.focus({ preventScroll: true })
      inputRef.current?.setSelectionRange(position, position)
    })
  }

  const insert = (token) => {
    if (disabled) return
    const input = inputRef.current
    const start = input?.selectionStart ?? value.length
    const end = input?.selectionEnd ?? value.length
    const nextValue = value.slice(0, start) + token + value.slice(end)
    onChange(nextValue)
    restoreFocus(start + token.length)
  }

  const erase = () => {
    if (disabled || !value) return
    const input = inputRef.current
    const start = input?.selectionStart ?? value.length
    const end = input?.selectionEnd ?? value.length
    const eraseFrom = start === end ? Math.max(0, start - 1) : start
    const nextValue = value.slice(0, eraseFrom) + value.slice(end)
    onChange(nextValue)
    restoreFocus(eraseFrom)
  }

  return (
    <div className="number-answer">
      <label htmlFor={id}>Ваш ответ</label>
      <div className="math-input-shell">
        <input
          ref={inputRef}
          id={id}
          type="text"
          inputMode="text"
          enterKeyHint="done"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          value={value}
          onChange={(event) => !disabled && onChange(event.target.value)}
          placeholder={placeholder}
          disabled={disabled}
        />
        {!disabled && (
          <div className="math-input-toolbar" aria-label="Панель математического ввода">
            {inputKeys.map((key) => (
              <button
                key={key.title}
                type="button"
                aria-label={key.title}
                title={key.title}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => insert(key.value)}
              >
                {key.label}
              </button>
            ))}
            <button
              type="button"
              className="math-key-erase"
              aria-label="Удалить последний символ"
              title="Удалить последний символ"
              onMouseDown={(event) => event.preventDefault()}
              onClick={erase}
            >
              ⌫
            </button>
          </div>
        )}
      </div>
      {!disabled && (
        <p className="math-input-help">
          {kind === 'set' ? <>Множество: <strong>{'{1; 3; 5}'}</strong> · порядок не важен · пустое: <strong>∅</strong></> : kind === 'interval' ? <>Границы разделяйте <strong>;</strong> · объединение: <strong>∪</strong> · бесконечность: <strong>∞</strong></> : <>Дробь: <strong>3/5</strong> · смешанная: <strong>2 1/4</strong> · отрицательная: <strong>−7</strong></>}
        </p>
      )}
    </div>
  )
}
