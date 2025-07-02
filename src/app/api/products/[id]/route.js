import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
    const { id } = params;

    try {
        const product = await prisma.product.findUnique({
            where: { id: id }
        });

        if (!product) {
            return new Response(JSON.stringify({ error: 'Produk tidak ditemukan' }), { status: 404 });
        }

        return new Response(JSON.stringify(product), { status: 200 });

    } catch (error) {
        console.error("Get product error:", error);
        return new Response(JSON.stringify({
            error: 'Gagal mengambil detail produk',
            details: error.message
        }), { status: 500 });
    }
}
