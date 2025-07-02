import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
    try {
        const { cart } = await request.json();

        // Basic validation
        if (!cart || cart.length === 0) {
            return new Response(JSON.stringify({ error: 'Keranjang tidak boleh kosong' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        console.log('Cart received:', cart);

        let totalAmount = 0;
        cart.forEach(item => {
            console.log('Processing item:', item);
            totalAmount += (item.price || 0) * (item.quantity || 0);
        });

        console.log('Total amount:', totalAmount);

        let defaultUser = await prisma.user.findFirst({
            where: { email: 'guest@example.com' }
        });

        if (!defaultUser) {
            console.log('Creating default user...');
            defaultUser = await prisma.user.create({
                data: {
                    email: 'guest@example.com',
                    password: 'guest123',
                    name: 'Guest User'
                }
            });
            console.log('Default user created:', defaultUser.id);
        }

        console.log('Creating order...');
        const order = await prisma.order.create({
            data: {
                userId: defaultUser.id,
                totalAmount: totalAmount,
                status: 'PENDING',
                orderItems: {
                    create: cart.map(item => ({
                        productId: item.id,
                        quantity: item.quantity || 1,
                        price: item.price || 0,
                    })),
                },
            },
        });

        console.log('Order created:', order.id);

        const paymentToken = `PAYMENT_${order.id}_${Date.now()}`;

        return new Response(JSON.stringify({
            success: true,
            orderId: order.id,
            totalAmount: totalAmount,
            paymentToken: paymentToken,
            paymentUrl: `/payment/${paymentToken}`
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error("Checkout error:", error);
        console.error("Error stack:", error.stack);

        return new Response(JSON.stringify({
            error: 'Gagal memproses checkout',
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
