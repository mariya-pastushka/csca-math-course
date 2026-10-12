import { useEffect, useState } from 'react'

// Translation belongs to the task, not to the lecture or its solution.
export default function TaskPrompt({ text, translationRu, translationKk, options, optionTranslationsRu, optionTranslationsKk, as: Tag = 'h2', resetKey }) {
  const [open, setOpen] = useState(false)
  useEffect(() => setOpen(false), [resetKey])
  const translation = translationKk || translationRu
  const translatedOptions = translationKk ? optionTranslationsKk : optionTranslationsRu
  return <>
    <div className="question-prompt-row">
      <Tag>{text}</Tag>
      {translation && <button type="button" className={'translation-toggle ' + (open ? 'is-open' : '')} aria-expanded={open} onClick={() => setOpen((value) => !value)}>{open ? 'Скрыть перевод' : translationKk ? 'Қазақша' : 'Перевод'}</button>}
    </div>
    {translation && open && <div className="question-translation" lang={translationKk ? 'kk' : 'ru'}>
      <span>{translationKk ? 'Қазақша · Перевод условия' : 'Русский перевод'}</span>
      <p>{translation}</p>
      {translatedOptions && options && <div className="translated-options">{options.map((option, index) => <small key={option}><strong>{String.fromCharCode(65 + index)})</strong> {translatedOptions[option] || option}</small>)}</div>}
    </div>}
  </>
}
