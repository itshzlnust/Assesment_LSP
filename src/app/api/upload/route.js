import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request) {
    try {
        const data = await request.formData();
        const file = data.get('image');

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // Validasi tipe file
        if (!file.type.startsWith('image/')) {
            return NextResponse.json({ error: 'File harus berupa gambar' }, { status: 400 });
        }

        // Validasi ukuran file (maksimal 5MB)
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json({ error: 'Ukuran file maksimal 5MB' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Generate nama file unik
        const timestamp = Date.now();
        const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const fileName = `${timestamp}_${originalName}`;

        // Path untuk menyimpan file
        const uploadPath = path.join(process.cwd(), 'public', 'uploads', fileName);

        // Buat folder uploads jika belum ada
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
        const fs = require('fs');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }

        // Simpan file
        await writeFile(uploadPath, buffer);

        // Return URL gambar
        const imageUrl = `/uploads/${fileName}`;

        return NextResponse.json({
            success: true,
            imageUrl
        });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({
            error: 'Gagal mengupload gambar',
            details: error.message
        }, { status: 500 });
    }
}
