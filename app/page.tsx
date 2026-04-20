'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { type UploadedFile, fileUrl, downloadUrl, previewUrl, formatBytes, uploadFile } from '@/lib/files'

const STORAGE_KEY = 'bucket0-files'

function loadFiles(): UploadedFile[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') } catch { return [] }
}

export default function HomePage() {
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { setFiles(loadFiles()) }, [])
  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(files)) }, [files])

  const handleFiles = useCallback(async (list: FileList | File[]) => {
    const arr = Array.from(list)
    if (!arr.length) return
    setError(null)
    setUploading(true)
    try {
      const results = await Promise.all(arr.map(uploadFile))
      setFiles((prev) => [...results, ...prev])
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }, [])

  const removeFile = useCallback(async (key: string) => {
    await fetch(`/api/file?key=${encodeURIComponent(key)}`, { method: 'DELETE' })
    setFiles((prev) => prev.filter((f) => f.key !== key))
  }, [])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    handleFiles(e.dataTransfer.files)
  }, [handleFiles])

  return (
    <div className="min-h-screen text-[#5D4D78] flex flex-col items-center px-4 py-16 md:py-24">
      <div className="w-full max-w-2xl space-y-6">

        <div className="text-center">
          <h1 className="text-3xl text-[#4E3F68] font-semibold tracking-tight mb-1">Next.js x Bucket0</h1>
          <p className="text-sm text-muted-foreground">
            S3-compatible storage via{' '}
            <a href="https://bucket0.com" target="_blank" rel="noopener noreferrer"
              className="text-primary underline underline-offset-2 hover:opacity-80 transition-opacity">Bucket0</a>.{' '}
            <a href="https://github.com/Bucket0-com/buckt0-nextjs-starter" target="_blank" rel="noopener noreferrer"
              className="text-primary underline underline-offset-2 hover:opacity-80 transition-opacity">Github Repository</a>
          </p>
        </div>

        <div
          role="button" tabIndex={0}
          aria-label="Drop files here or click to upload"
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          style={{ backgroundColor: dragging ? undefined : '#EAE8F0' }}
          className={[
            'flex flex-col items-center justify-center min-h-64 rounded-xl cursor-pointer select-none',
            'border-2 border-dashed transition-all duration-200',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
            dragging ? 'border-primary bg-primary/10 scale-[1.01]' : 'border-[#CFC9DA] hover:border-primary/50',
          ].join(' ')}
        >
          <input ref={inputRef} type="file" multiple className="sr-only"
            onChange={(e) => e.target.files && handleFiles(e.target.files)} />

          {uploading ? (
            <svg className="w-8 h-8 text-primary animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round" />
            </svg>
          ) : (
            <div className="flex flex-col items-center gap-2 pointer-events-none text-center">
              <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <p className="text-sm font-medium text-foreground">
                {dragging ? 'Release to upload' : 'Drop files here'}
              </p>
              <p className="text-xs text-muted-foreground">
                or <span className="text-primary underline underline-offset-2">click to browse</span>
              </p>
            </div>
          )}
        </div>

        {error && (
          <div className="px-4 py-3 rounded-lg border border-red-200 bg-red-50">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {files.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Uploaded</p>
            <div className="flex flex-wrap gap-4">
              {files.map((f) => (
                <div key={f.key} className="w-full max-w-sm rounded-xl border border-border bg-background/60 overflow-hidden">
                  <img src={fileUrl(f.key)} alt={f.name} className="w-full h-44 object-cover hidden"
                    onLoad={(e) => (e.currentTarget.style.display = 'block')} />
                  <div className="flex items-center gap-3 px-4 py-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{f.name}</p>
                      <p className="text-xs text-muted-foreground">{formatBytes(f.size)}</p>
                    </div>
                    <a href={downloadUrl(f.key)} className="p-1.5 rounded hover:bg-muted transition-colors flex-shrink-0" title="Download">
                      <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                    </a>
                    <a href={previewUrl(f.key, f.name)} className="p-1.5 rounded hover:bg-muted transition-colors flex-shrink-0" title="Preview">
                      <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </a>
                    <button onClick={() => removeFile(f.key)} className="p-1.5 rounded hover:bg-red-50 transition-colors flex-shrink-0" title="Remove from browser">
                      <svg className="w-4 h-4 text-muted-foreground hover:text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        <path d="M10 11v6M14 11v6" />
                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
