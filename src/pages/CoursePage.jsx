import Brand from '../components/Brand'
import Footer from '../components/Footer'
import { ArrowRight } from '../components/Icons'

export default function CoursePage({ navigate }) {
  return (
    <main className="page course-page">
      <nav className="nav">
        <Brand navigate={navigate} />
        <span className="nav-status"><i /> Учебная платформа</span>
      </nav>

      <section className="course-entry">
        <span className="course-index">ПРОГРАММА ПОДГОТОВКИ</span>
        <h2>Начните с прочного фундамента.</h2>
        <p>Выберите неделю: укрепите вычислительную базу или переходите к уравнениям, множествам и неравенствам.</p>
        <div className="course-weeks">
        <button className="week-entry-button" onClick={() => navigate('/week-1')}>
          <span className="week-entry-number">01</span>
          <span className="week-entry-copy">
            <small>Доступно сейчас</small>
            <strong>Week 1</strong>
            <em>Базовая арифметика и навыки работы с числами</em>
          </span>
          <span className="week-entry-arrow"><ArrowRight size={24} /></span>
        </button>
        <button className="week-entry-button" onClick={() => navigate('/week-2')}>
          <span className="week-entry-number">02</span>
          <span className="week-entry-copy">
            <small>Topic 1 и Topic 2 доступны</small><strong>Week 2</strong><em>Equations, Sets and Inequalities</em>
          </span>
          <span className="week-entry-arrow"><ArrowRight size={24} /></span>
        </button>
        </div>
      </section>

      <Footer />
    </main>
  )
}
