const TAGS = {
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    p: 'p'
}

const VARIANT_CLASS = {
    h1: 'font-extrabold text-7xl leading-[150%] font-dark-green'
}

export function Typography({ children, variant}) {
    const Component = TAGS[variant] || 'p'
    const className = VARIANT_CLASS[variant]

    return (
        <Component className={className}>
            {children}
        </Component>
    )
}