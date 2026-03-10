const TAGS = {
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    p: 'p'
}

export function Typography({ children, variant}) {
    const Component = TAGS[variant] || 'p'

    return (
        <Component>
            {children}
        </Component>
    )
}