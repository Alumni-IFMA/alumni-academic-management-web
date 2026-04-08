const variants = {
    primary: 'bg-carmine text-2xl text-white font-semibold px-6 py-3 w-full rounded-xl mt-10'
}

export function Button({ children, variant, ...props }) {
    const style = variants[variant]

    return (
        <button className={`cursor-pointer h-[53] ${style}`} {...props}>{children}</button>
    )
}
