import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
    try {
        const { name, description, price, stock, imageUrl } = await request.json();

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

        // Buat produk baru
        const product = await prisma.product.create({
            data: {
                name: name.trim(),
                description: description?.trim() || null,
                price: parseFloat(price),
                stock: parseInt(stock),
                imageUrl: imageUrl?.trim() || null,
            },
        });

        return new Response(JSON.stringify({
            success: true,
            product
        }), { status: 201 });

    } catch (error) {
        console.error("Create product error:", error);
        return new Response(JSON.stringify({
            error: 'Gagal menambah produk',
            details: error.message
        }), { status: 500 });
    }
}

export async function GET(request) {
    try {
        const products = await prisma.product.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });

        return new Response(JSON.stringify(products), { status: 200 });

    } catch (error) {
        console.error("Get products error:", error);
        return new Response(JSON.stringify({
            error: 'Gagal mengambil data produk',
            details: error.message
        }), { status: 500 });
    }
}
