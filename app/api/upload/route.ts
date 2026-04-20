import { NextRequest, NextResponse } from 'next/server'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { s3, BUCKET } from '@/lib/s3'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    const key = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._\-/]/g, '_')}`
    const bytes = await file.arrayBuffer()

    await s3.send(new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: Buffer.from(bytes),
      ContentType: file.type || 'application/octet-stream',
    }))

    return NextResponse.json({ name: file.name, key, size: file.size })
  } catch (e: unknown) {
    console.error('Upload error:', e)
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Upload failed' },
      { status: 500 }
    )
  }
}
