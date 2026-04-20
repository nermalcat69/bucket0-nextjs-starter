export type UploadedFile = { name: string; key: string; size: number }

export type FileKind = 'image' | 'pdf' | 'json' | 'other'

export function getFileKind(name: string): FileKind {
  const ext = name.split('.').pop()?.toLowerCase() ?? ''
  if (/^(jpe?g|png|gif|webp|avif|svg)$/.test(ext)) return 'image'
  if (ext === 'pdf') return 'pdf'
  if (ext === 'json') return 'json'
  return 'other'
}

export const fileUrl = (key: string) => `/api/file?key=${encodeURIComponent(key)}`
export const downloadUrl = (key: string) => `/api/file?key=${encodeURIComponent(key)}&dl=1`
export const previewUrl = (key: string, name: string) =>
  `/preview?key=${encodeURIComponent(key)}&name=${encodeURIComponent(name)}`

export function formatBytes(b: number) {
  if (b < 1024) return `${b} B`
  if (b < 1048576) return `${(b / 1024).toFixed(1)} KB`
  return `${(b / 1048576).toFixed(1)} MB`
}

export async function uploadFile(file: File): Promise<UploadedFile> {
  const fd = new FormData()
  fd.append('file', file)
  const res = await fetch('/api/upload', { method: 'POST', body: fd })
  if (!res.ok) throw new Error((await res.json()).error ?? 'Upload failed')
  return res.json()
}
