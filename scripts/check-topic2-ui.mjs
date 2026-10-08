import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { mkdir } from 'node:fs/promises'
import { topic2 } from '../src/data/week2/topic2/index.js'
import { isCorrectAnswer } from '../src/utils/answers.js'

const require = createRequire(import.meta.url)
const { chromium } = require('C:/Users/D.Baidildanova/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')
const browser = await chromium.launch({ channel: 'msedge', headless: true })
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } })
const page = await context.newPage()
const errors = []
page.on('pageerror', (error) => errors.push(error.message))
const base = 'http://127.0.0.1:5175'
const waitUrl = async (path) => page.waitForURL(base + path)
const screenshotDirectory = new URL('../artifacts/topic2/', import.meta.url)
await mkdir(screenshotDirectory, { recursive: true })

const answer = async (question, wrong = false) => {
  if (question.options) {
    const inputs = page.locator('.answer-option input')
    let clicked = 0
    for (let index = 0; index < await inputs.count(); index++) {
      const option = await inputs.nth(index).getAttribute('value')
      const selected = question.type === 'multi-choice' ? question.answer.includes(option) : isCorrectAnswer(option,question.answer,question.answerKind)
      if (wrong ? !selected : selected) {
        await inputs.nth(index).locator('..').click()
        clicked++
        if (question.type !== 'multi-choice' || wrong) break
      }
    }
    assert.ok(clicked, question.id + ': selected answer')
  } else {
    let value = String(question.answer)
    if (question.id === 's-p5') value = '{1, 0, -1, -2}' // Different order and separators.
    if (question.id === 's-p16') value = ' ( −∞ ; 3 ] ' // Keyboard whitespace and Unicode minus.
    await page.locator('.math-input-shell input').fill(value)
  }
}

try {
  await page.goto(base + '/week-2')
  await page.getByRole('button', { name: topic2.titleRu, exact: true }).click()
  await waitUrl('/week-2/topic-2')
  assert.equal(await page.locator('.week2-mini-card').count(),3)
  await page.locator('.week2-mini-link').first().click()
  await waitUrl('/week-2/sets-membership/lecture')
  assert.equal(await page.locator('.sets-table caption').first().textContent(),'ВАЖНЫЕ ОБОЗНАЧЕНИЯ')
  await page.getByRole('button', { name: 'Продолжить к лекции 2.2', exact: true }).click()
  await waitUrl('/week-2/union-intersection/lecture')
  await page.getByRole('button', { name: '∩ · Только общее', exact: true }).click()
  assert.ok((await page.locator('.sets-venn').textContent()).includes('3,4'))
  await page.getByRole('button', { name: 'Продолжить к лекции 2.3', exact: true }).click()
  await waitUrl('/week-2/interval-notation/lecture')
  assert.ok(await page.locator('.sets-number-line').count() >= 10)
  assert.equal(await page.locator('.sets-table tbody tr').count(),4)
  await page.screenshot({ path: fileURLToPath(new URL('lecture-desktop.png',screenshotDirectory)), fullPage: false })
  await page.getByRole('button', { name: 'Перейти к 12 примерам', exact: true }).click()
  await waitUrl('/week-2/topic-2/examples')
  assert.equal(await page.locator('.week2-problem-list > article').count(),12)
  assert.equal(await page.locator('.example-sequence > article').count(),12)
  assert.ok(await page.locator('.week2-problem-list').evaluate((element) => Boolean(element.compareDocumentPosition(document.querySelector('.example-sequence')) & Node.DOCUMENT_POSITION_FOLLOWING)))
  await page.getByRole('button', { name: 'Перейти к самостоятельной практике', exact: true }).click()
  await waitUrl('/week-2/topic-2/practice')
  for (let index = 0; index < topic2.practiceQuestions.length; index++) {
    const question = topic2.practiceQuestions[index]
    await page.waitForFunction((id) => document.querySelector('.question-card input')?.getAttribute('name') === id || document.getElementById('answer-' + id),question.id)
    await answer(question)
    await page.getByRole('button', { name: 'Проверить ответ', exact: true }).click()
    assert.equal(await page.locator('.answer-feedback strong').textContent(),'Верно!',question.id)
    assert.equal(await page.locator('.solution-reveal-body').getAttribute('aria-hidden'),'true')
    if (question.id === 's-p13') {
      await page.getByRole('button', { name: 'Показать решение', exact: true }).click()
      assert.equal(await page.locator('.solution-reveal-body').getAttribute('aria-hidden'),'false')
    }
    if (index < topic2.practiceQuestions.length - 1) await page.getByRole('button', { name: 'Следующее задание', exact: true }).click()
  }
  await page.getByRole('button', { name: 'Повторить термины перед Mini Test', exact: true }).click()
  await waitUrl('/week-2/topic-2/vocabulary')
  assert.equal(await page.locator('.vocabulary-card').count(),19)
  await page.getByRole('button', { name: 'Перевести на 中文', exact: true }).click()
  assert.ok((await page.locator('.vocabulary-card').first().textContent()).includes('集合'))
  await page.getByRole('button', { name: 'Перейти к Mini Test', exact: true }).click()
  await waitUrl('/week-2/topic-2/mini-test')
  assert.equal(await page.locator('.solution-reveal').count(),0)
  for (let index = 0; index < 8; index++) {
    await answer(topic2.miniTestQuestions[index])
    await page.getByRole('button', { name: index === 7 ? 'Показать результат' : 'Следующий', exact: true }).click()
  }
  assert.ok((await page.locator('.final-result-hero h1').textContent()).includes('8'))
  assert.equal(await page.locator('.final-result-hero h2').textContent(),topic2.resultMessages.excellent)
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('csca-week2-progress-v1')))
  assert.equal(saved.testResults['topic-2'].score,8)
  assert.ok(saved.completed['topic-2:practice'])
  assert.ok(saved.completed['topic-2:mini-test'])
  await page.getByRole('button', { name: 'Пройти ещё раз', exact: true }).click()
  for (let index = 0; index < 8; index++) {
    const prompt = await page.locator('.question-prompt-row h2').textContent()
    const question = topic2.miniTestQuestions.find((item) => item.question === prompt)
    assert.ok(question)
    await answer(question,index === 0)
    await page.getByRole('button', { name: index === 7 ? 'Показать результат' : 'Следующий', exact: true }).click()
  }
  assert.equal(await page.locator('.final-result-hero h2').textContent(),topic2.resultMessages.good)
  await page.getByRole('button', { name: 'Разобрать ошибки', exact: true }).click()
  assert.equal(await page.locator('.mistake-list > article').count(),1)

  for (const width of [390,768]) {
    await page.setViewportSize({width,height:844})
    for (const path of ['/week-2/topic-2',...topic2.subtopics.map((item) => '/week-2/' + item.id + '/lecture'),'/week-2/topic-2/examples','/week-2/topic-2/practice','/week-2/topic-2/mini-test']) {
      await page.goto(base + path)
      const overflow = await page.evaluate(() => ({ width: window.innerWidth, scroll: document.documentElement.scrollWidth }))
      assert.ok(overflow.scroll <= overflow.width + 1,width + 'px: overflow on ' + path + ' (' + overflow.scroll + ')')
    }
  }
  await page.setViewportSize({width:390,height:844})
  await page.goto(base + '/week-2/interval-notation/lecture')
  await page.locator('.sets-visual-grid').scrollIntoViewIfNeeded()
  await page.screenshot({ path: fileURLToPath(new URL('lecture-mobile.png',screenshotDirectory)), fullPage: false })
  assert.ok(!(await page.locator('body').textContent()).includes('Homework'))
  assert.deepEqual(errors,[])
  console.log('UI: Week 2 → Topic 2 → 3 lectures → 12 examples/solutions → 19 correct practice answers → vocabulary → 8/8 and 7/8 tests passed; mobile/tablet widths passed; no browser errors.')
} finally {
  await browser.close()
}
