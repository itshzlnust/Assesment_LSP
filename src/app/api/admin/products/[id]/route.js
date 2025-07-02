import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(request, { params }) {
    try {
        const { id } = params;

        if (!id) {
            return new Response(JSON.stringify({
                error: 'ID produk diperlukan'
            }), { status: 400 });
        }

        // Cek apakah produk ada
        const existingProduct = await prisma.product.findUnique({
            where: { id: parseInt(id) }
        });

        if (!existingProduct) {
            return new Response(JSON.stringify({
                error: 'Produk tidak ditemukan'
            }), { status: 404 });
        }

        // Hapus produk
        await prisma.product.delete({
            where: { id: parseInt(id) }
        });

        return new Response(JSON.stringify({
            success: true,
            message: 'Produk berhasil dihapus'
        }), { status: 200 });

    } catch (error) {
        console.error("Delete product error:", error);
        return new Response(JSON.stringify({
            error: 'Gagal menghapus produk',
            details: error.message
        }), { status: 500 });
    }
}

export async function GET(request, { params }) {
    try {
        const { id } = params;

        if (!id) {
            return new Response(JSON.stringify({
                error: 'ID produk diperlukan'
            }), { status: 400 });
        }

        const product = await prisma.product.findUnique({
            where: { id: parseInt(id) }
        });

        if (!product) {
            return new Response(JSON.stringify({
                error: 'Produk tidak ditemukan'
            }), { status: 404 });
        }

        return new Response(JSON.stringify(product), { status: 200 });

    } catch (error) {
        console.error("Get product error:", error);
        return new Response(JSON.stringify({
            error: 'Gagal mengambil data produk',
            details: error.message
        }), { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        const { id } = params;
        const { name, description, price, stock, imageUrl } = await request.json();

        if (!id) {
            return new Response(JSON.stringify({
                error: 'ID produk diperlukan'
            }), { status: 400 });
        }

        // Validasi input
        if (!name || !price || stock === undefined) {
            return new Response(JSON.stringify({
                error: 'Nama produk, harga, dan stok wajib diisi'
            }), { status: 400 });
        }

        if (price < 0 || stock < 0) {
            return new Response(JSON.stringify({
                error: 'Harga dan stok tidak boleh negatif'
            }), { status: 400 });
        }

        // Cek apakah produk ada
        const existingProduct = await prisma.product.findUnique({
            where: { id: parseInt(id) }
        });

        if (!existingProduct) {
            return new Response(JSON.stringify({
                error: 'Produk tidak ditemukan'
            }), { status: 404 });
        }

        // Update produk
        const updatedProduct = await prisma.product.update({
            where: { id: parseInt(id) },
            data: {
                name: name.trim(),
                description: description?.trim() || null,
                price: parseFloat(price),
                stock: parseInt(stock),
                imageUrl: imageUrl?.trim() || null,
                updatedAt: new Date()
            },
        });

        return new Response(JSON.stringify({
            success: true,
            product: updatedProduct
        }), { status: 200 });

    } catch (error) {
        console.error("Update product error:", error);
        return new Response(JSON.stringify({
            error: 'Gagal mengupdate produk',
            details: error.message
        }), { status: 500 });
    }
}
