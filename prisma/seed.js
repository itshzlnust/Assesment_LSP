const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log(`Start seeding ...`);

    await prisma.cartItem.deleteMany({});
    await prisma.cart.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.user.deleteMany({});
    // console.log('Old data deleted.');

    const saltRounds = 10;
    const defaultPassword = 'password123';
    const hashedPassword = await bcrypt.hash(defaultPassword, saltRounds);

    const user1 = await prisma.user.create({
        data: {
            email: 'johndoe@example.com',
            name: 'John Doe',
            password: hashedPassword,
            cart: {
                create: {},
            },
        },
        include: {
            cart: true,
        }
    });
    console.log(`Created user: ${user1.name} with cart ID: ${user1.cart.id}`);

    const user2 = await prisma.user.create({
        data: {
            email: 'janesmith@example.com',
            name: 'Jane Smith',
            password: hashedPassword,
            cart: {
                create: {},
            },
        },
        include: {
            cart: true,
        }
    });
    console.log(`Created user: ${user2.name} with cart ID: ${user2.cart.id}`);

    const product1 = await prisma.product.create({
        data: {
            name: 'Laptop Pro 15"',
            description: 'Laptop canggih untuk para profesional dengan performa tinggi.',
            price: 15000000,
            stock: 50,
            imageUrl: '/images/MSI Showcasing Powerful.jpg',
        },
    });

    const product2 = await prisma.product.create({
        data: {
            name: 'Mouse Wireless Ergonomis',
            description: 'Mouse nyaman untuk penggunaan jangka panjang, tanpa kabel.',
            price: 250000,
            stock: 100,
            imageUrl: '/images/PULSAR PRX V4 Gaming.jpg',
        },
    });

    const product3 = await prisma.product.create({
        data: {
            name: 'Keyboard Mekanikal RGB',
            description: 'Keyboard dengan feel mekanikal dan lampu RGB yang bisa diatur.',
            price: 750000,
            stock: 75,
            imageUrl: '/images/VGNX68.jpg', 
        },
    });

    const product4 = await prisma.product.create({
        data: {
            name: 'Monitor 24" Full HD',
            description: 'Monitor dengan resolusi tajam untuk kerja dan hiburan.',
            price: 2500000,
            stock: 40,
            imageUrl: '/images/BenQ - ZOWIE.jpg',
        },
    });
    console.log('Created 4 products.');

    await prisma.cartItem.create({
        data: {
            cartId: user1.cart.id,
            productId: product1.id,
            quantity: 1,
        },
    });
    await prisma.cartItem.create({
        data: {
            cartId: user1.cart.id,
            productId: product2.id,
            quantity: 2,
        },
    });
    console.log(`Added 2 items to ${user1.name}'s cart.`);

    console.log(`Seeding finished.`);
}

main()
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });