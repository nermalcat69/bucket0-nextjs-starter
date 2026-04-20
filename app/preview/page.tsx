'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { fileUrl, downloadUrl, getFileKind } from '@/lib/files'

function Preview() {
  const params = useSearchParams()
  const key = params.get('key') ?? ''
  const name = params.get('name') ?? key.split('/').pop() ?? 'file'
  const kind = getFileKind(name)
  const [json, setJson] = useState<string | null>(null)
  const [jsonError, setJsonError] = useState(false)

  useEffect(() => {
    if (kind !== 'json') return
    fetch(fileUrl(key))
      .then((r) => r.json())
      .then((data) => setJson(JSON.stringify(data, null, 2)))
      .catch(() => setJsonError(true))
  }, [key, kind])

  return (
    <div className="min-h-screen text-[#5D4D78] px-4 py-10 flex flex-col">
      <div className="w-full max-w-4xl mx-auto space-y-5 flex-1 flex flex-col">

        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <a href="/" className="text-xs text-muted-foreground hover:text-primary transition-colors">← Back</a>
            <h1 className="text-lg font-semibold text-[#4E3F68] truncate mt-0.5">{name}</h1>
          </div>
          <a
            href={downloadUrl(key)}
            className="shrink-0 px-4 py-2 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#8D78AE' }}
          >
            Download
          </a>
        </div>

        <div className="flex-1 rounded-xl border border-[#CFC9DA] overflow-hidden">
          {kind === 'image' && (
            <img src={fileUrl(key)} alt={name} className="w-full h-full object-contain" style={{ backgroundColor: '#EAE8F0' }} />
          )}

          {kind === 'pdf' && (
            <iframe src={fileUrl(key)} className="w-full h-full min-h-[80vh]" title={name} />
          )}

          {kind === 'json' && (
            jsonError ? (
              <div className="flex items-center justify-center h-40 text-sm text-red-500">Failed to load JSON</div>
            ) : json ? (
              <pre className="p-5 text-xs leading-relaxed overflow-auto h-full max-h-[80vh] text-[#4E3F68]" style={{ backgroundColor: '#EAE8F0' }}>{json}</pre>
            ) : (
              <div className="flex items-center justify-center h-40">
                <svg className="w-6 h-6 text-primary animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round" />
                </svg>
              </div>
            )
          )}

          {kind === 'other' && (
            <div className="flex flex-col items-center justify-center h-40 gap-3 text-muted-foreground">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <p className="text-sm">No preview available for this file type</p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default function PreviewPage() {
  return (
    <Suspense>
      <Preview />
    </Suspense>
  )
}
