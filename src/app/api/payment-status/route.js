import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
    const { orderId, status } = await request.json();

    try {
        // Update order status
        const updatedOrder = await prisma.order.update({
            where: { id: parseInt(orderId) },
            data: {
                status: status.toUpperCase() // PAID, FAILED, CANCELLED
            }
        });

        return new Response(JSON.stringify({
            success: true,
            order: updatedOrder
        }), { status: 200 });

    } catch (error) {
        console.error("Update payment status error:", error);
        return new Response(JSON.stringify({
            error: 'Gagal mengupdate status pembayaran',
            details: error.message
        }), { status: 500 });
    }
}
