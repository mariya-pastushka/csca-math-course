export { step } from '../../week1/helpers.js'
export const math = String.raw
export const segment = (start,end,leftClosed = false,rightClosed = false) => ({start,end,leftClosed,rightClosed})
export const line = (segments,min = -8,max = 10,title,caption) => ({kind:'numberLine',segments,min,max,title,caption})
export const linear = (a,b,op,c,d = 0) => ({kind:'linear',a,b,op,c,d})
export const absolute = (a,b,op,c) => ({kind:'absolute',a,b,op,c})
export const audit = (conditions,answerText,combine = 'all') => ({conditions,answerText,combine})
export const intervalLatex = (text) => text.replaceAll('∞','\\infty').replaceAll('∪','\\cup').replaceAll('∅','\\varnothing').replaceAll('{','\\{').replaceAll('}','\\}')
export const example = (problem,answerText,steps,conditions,visual,combine = 'all') => ({
  problem,answer:intervalLatex(answerText),steps,level:'Лекция · по шагам',audit:audit(conditions,answerText,combine),visual,
})
export const exercise = (item) => ({
  ...item,type:item.type || (item.options ? 'choice' : 'input'),
  difficulty:item.difficulty || 'Средний',answerKind:item.answerKind || 'interval',
  feedbackExplanation:item.explanation,
})
