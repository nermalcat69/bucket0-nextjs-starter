import { NextRequest, NextResponse } from 'next/server'
import { PutObjectCommand, ListObjectsV2Command, DeleteObjectsCommand } from '@aws-sdk/client-s3'
import { s3, BUCKET } from '@/lib/s3'

const MAX_SIZE = 1 * 1024 * 1024 // 1 MB

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    if (file.size > MAX_SIZE) return NextResponse.json({ error: 'File exceeds 1 MB limit' }, { status: 400 })

    const key = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._\-/]/g, '_')}`
    const bytes = await file.arrayBuffer()

    await s3.send(new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: Buffer.from(bytes),
      ContentType: file.type || 'application/octet-stream',
    }))

    const list = await s3.send(new ListObjectsV2Command({ Bucket: BUCKET }))
    if ((list.KeyCount ?? 0) >= 200) {
      const objects = (list.Contents ?? []).map((o) => ({ Key: o.Key! }))
      await s3.send(new DeleteObjectsCommand({ Bucket: BUCKET, Delete: { Objects: objects } }))
    }

    return NextResponse.json({ name: file.name, key, size: file.size })
  } catch (e: unknown) {
    console.error('Upload error:', e)
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Upload failed' },
      { status: 500 }
    )
  }
}
