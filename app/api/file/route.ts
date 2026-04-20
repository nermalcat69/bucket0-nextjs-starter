import { NextRequest, NextResponse } from 'next/server'
import { GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { s3, BUCKET } from '@/lib/s3'

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key')
  if (!key) return NextResponse.json({ error: 'Missing key' }, { status: 400 })

  try {
    const obj = await s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: key }))

    const headers: Record<string, string> = {
      'Content-Type': obj.ContentType ?? 'application/octet-stream',
      'Cache-Control': 'private, max-age=3600',
    }

    if (req.nextUrl.searchParams.has('dl')) {
      const filename = key.split('/').pop() ?? key
      headers['Content-Disposition'] = `attachment; filename="${filename}"`
    }

    return new NextResponse(obj.Body as ReadableStream, { headers })
  } catch (e: unknown) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 })
  }
}

export async function DELETE(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key')
  if (!key) return NextResponse.json({ error: 'Missing key' }, { status: 400 })

  try {
    await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }))
    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Delete failed' }, { status: 500 })
  }
}
