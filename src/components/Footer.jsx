export default function Footer({ staticMode = false }) {
  return (
    <footer className={'footer ' + (staticMode ? 'footer-static' : '')}>
      <p>Диас Муратов</p>
      <a href="https://t.me/maricurplu" target="_blank" rel="noreferrer" aria-label="Telegram: maricurplu">
        <span className="telegram-dot" aria-hidden="true" />
        telegram: maricurplu
      </a>
    </footer>
  )
}
