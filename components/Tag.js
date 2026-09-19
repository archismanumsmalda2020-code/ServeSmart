export default function Tag({ tone = 'muted', children }) {
  return <span className={`tag tag-${tone}`}>{children}</span>
}
