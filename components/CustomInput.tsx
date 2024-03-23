export default function CustomTextInput({ name, value, handleChange, type = 'text', ...rest }: { name: string, value: any, handleChange?: any, type?: string, rest?: any }) {
    return (
        <input type={type} name={name} id={name} value={value} onChange={handleChange} {...rest} />
    )
}

export function CustomNumberInput({ name, value, handleChange, ...rest }: { name: string, value: any, handleChange?: any, rest?: any }) {
    return (
        <input type="number" name={name} id={name} value={value} min={0} onChange={handleChange}  {...rest} />
    )
}

export function CustomSelectInput({ name, options, value, handleChange, style, ...rest }: { name: string, options: any[], value: any, handleChange?: any, style?: any, rest?: any }) {
    return (
        <select name={name} id={name} onChange={handleChange} value={value} style={{ ...style }} {...rest}>
            {options.map((option, index) => (
                <option key={index} value={option?.value}>{option?.text}</option>
            ))}
        </select>
    )
}