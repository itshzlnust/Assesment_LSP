import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Mengambil satu produk berdasarkan ID
export async function GET(request, { params }) {
    const { id } = params;

    try {
        const product = await prisma.product.findUnique({
            where: { id: id },
        });

        if (!product) {
            return NextResponse.json({ message: 'Produk tidak ditemukan.' }, { status: 404 });
        }

        return NextResponse.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        return NextResponse.json({ message: 'Terjadi kesalahan pada server.' }, { status: 500 });
    }
}

// PUT - Memperbarui produk berdasarkan ID
export async function PUT(request, { params }) {
    const { id } = params;

    try {
        const body = await request.json();
        const { name, description, price, stock, imageUrl } = body;

        if (!name || price === undefined || stock === undefined) {
            return NextResponse.json({ message: 'Nama, harga, dan stok harus diisi.' }, { status: 400 });
        }

        const updatedProduct = await prisma.product.update({
            where: { id: id },
            data: {
                name,
                description,
                price: Number(price),
                stock: Number(stock),
                imageUrl,
            },
        });

        return NextResponse.json(updatedProduct);
    } catch (error) {
        console.error(`Error updating product ${id}:`, error);
        if (error.code === 'P2025') { // Prisma code for record not found
            return NextResponse.json({ message: 'Produk tidak ditemukan untuk diperbarui.' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Gagal memperbarui produk.' }, { status: 500 });
    }
}

// DELETE - Menghapus produk berdasarkan ID
export async function DELETE(request, { params }) {
    const { id } = params;

    try {
        await prisma.product.delete({
            where: { id: id },
        });

        return NextResponse.json({ message: 'Produk berhasil dihapus.' });
    } catch (error) {
        console.error(`Error deleting product ${id}:`, error);
        if (error.code === 'P2025') { // Prisma code for record not found
            return NextResponse.json({ message: 'Produk tidak ditemukan untuk dihapus.' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Gagal menghapus produk.' }, { status: 500 });
    }
}
