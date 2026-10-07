import Brand from '../components/Brand'
import Footer from '../components/Footer'
import { ArrowRight } from '../components/Icons'

export default function WelcomePage({ navigate }) {
  return (
    <main className="page welcome-page">
      <div className="orb orb-one" aria-hidden="true" />
      <div className="orb orb-two" aria-hidden="true" />

      <nav className="nav" aria-label="Главная навигация">
        <Brand navigate={navigate} />
        <span className="nav-status"><i /> Подготовка к экзамену</span>
      </nav>

      <section className="hero">
        <div className="eyebrow reveal reveal-one">
          <span>CSCA</span>
          <span className="eyebrow-line" />
          <span>Mathematics preparation</span>
        </div>

        <h1 className="reveal reveal-two">
          От основ —
          <span>к логике.</span>
          <em>К результату.</em>
        </h1>

        <div className="hero-bottom reveal reveal-three">
          <p className="hero-copy">
            Последовательная подготовка к CSCA Mathematics: одна тема за раз,
            понятные объяснения и практика, которая учит думать на экзамене.
          </p>

          <button className="course-button" onClick={() => navigate('/course')}>
            <span>Перейти к курсу</span>
            <span className="button-arrow"><ArrowRight /></span>
          </button>
        </div>
      </section>

      <div className="formula formula-one" aria-hidden="true">f(x) = ax² + bx + c</div>
      <div className="formula formula-two" aria-hidden="true">∫</div>
      <div className="axis" aria-hidden="true">
        <span className="axis-label">y</span>
        <span className="curve" />
        <span className="axis-label axis-x">x</span>
      </div>

      <Footer />
    </main>
  )
}
