export function Label({ children, htmlFor }) {
  return <label className="font-dark-green font-semibold text-lg" htmlFor={htmlFor}>{children}</label>;
}
