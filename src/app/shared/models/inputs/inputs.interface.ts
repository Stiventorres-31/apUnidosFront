export interface input_control {
    label: string,
    name: string,
    id?: string,
    type: string,
    options ?: { value: string, text: string }[]
}