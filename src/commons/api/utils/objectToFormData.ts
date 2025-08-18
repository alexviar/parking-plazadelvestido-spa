import { toUnderscore } from "./keyMapper"

export function objectToFormData(obj: Record<string, any>): FormData {
  const formData = new FormData()
  function appendFormData(data: any, parentKey?: string) {
    if (data instanceof File || data instanceof Blob) {
      formData.append(parentKey!, data)
    } else if (Array.isArray(data)) {
      data.forEach((v, i) => appendFormData(v, `${parentKey}[${i}]`))
    } else if (data !== null && typeof data === 'object') {
      Object.entries(data).forEach(([k, v]) => {
        k = toUnderscore(k)
        appendFormData(v, parentKey ? `${parentKey}[${k}]` : k)
      })
    } else if (typeof data === 'boolean') {
      formData.append(parentKey!, data ? '1' : '0')
    } else if (data !== undefined && data !== null) {
      formData.append(parentKey!, String(data))
    }
  }
  appendFormData(obj)
  return formData
}