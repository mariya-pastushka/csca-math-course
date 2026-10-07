import { BlockMath, InlineMath } from 'react-katex'

export default function MathFormula({ children, inline = false, className = '' }) {
  if (!children) return null
  const Component = inline ? InlineMath : BlockMath
  return (
    <span className={'math-formula ' + (inline ? 'math-inline ' : 'math-block ') + className}>
      <Component math={String(children)} renderError={() => <span>{children}</span>} />
    </span>
  )
}
