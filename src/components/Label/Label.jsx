export function Label({ children, htmlFor }) {
  return <label className="font-dark-green font-semibold text-base" htmlFor={htmlFor}>{children}</label>;
}
