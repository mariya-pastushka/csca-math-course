import { useState } from 'react'
import { VocabularyCard } from './LearningCards'

export default function VocabularyList({ items }) {
  const [chinese, setChinese] = useState(false)
  return (
    <div>
      <div className="vocabulary-language-switch">
        <span>{chinese ? '中文 · Китайские термины' : 'English · Английские термины'}</span>
        <button className="translation-toggle" onClick={() => setChinese((current) => !current)}>{chinese ? 'Показать English' : 'Перевести на 中文'}</button>
      </div>
      <div className="vocabulary-grid">
        {items.map((item) => <VocabularyCard key={item.term} item={{ ...item, term: chinese ? item.chinese : item.term }} />)}
      </div>
    </div>
  )
}
