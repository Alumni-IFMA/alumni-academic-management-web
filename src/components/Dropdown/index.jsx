export function Dropdown({ itens, ...rest}) {
    return (
        <select {...rest} defaultValue="">
            <option value="" disabled>Selecione uma opção</option>
            {itens.map((itens) => {
                return (
                    <option key={itens.id} value={itens.id}>{itens.name}</option>
                )
            })}
        </select>
    )
}