
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    // Create Categories
    const blouses = await prisma.category.upsert({
        where: { slug: 'blouses' },
        update: {},
        create: {
            name: 'Designer Blouses',
            slug: 'blouses',
            description: 'Handcrafted maggam work blouses for every occasion.'
        }
    });

    const sarees = await prisma.category.upsert({
        where: { slug: 'sarees' },
        update: {},
        create: {
            name: 'Bridal Sarees',
            slug: 'sarees',
            description: 'Exquisite silk sarees for the modern bride.'
        }
    });

    const lehengas = await prisma.category.upsert({
        where: { slug: 'lehengas' },
        update: {},
        create: {
            name: 'Luxury Lehengas',
            slug: 'lehengas',
            description: 'Elegant lehengas with intricate embroidery.'
        }
    });

    // Create Products
    const products = [
        {
            name: "Royal Crimson Bridal Blouse",
            description: "Intricate gold maggam work on royal crimson silk.",
            price: 15000,
            images: JSON.stringify(["/products/blouse-1.png"]),
            categoryId: blouses.id,
            isFeatured: true
        },
        {
            name: "Classic Gold Motif Blouse",
            description: "Elegant silk blouse with delicate gold motifs.",
            price: 12500,
            images: JSON.stringify(["/products/blouse-2.png"]),
            categoryId: blouses.id,
            isFeatured: true
        },
        {
            name: "Emerald Green Silk Saree",
            description: "Luxurious emerald green silk saree with gold borders.",
            price: 25000,
            images: JSON.stringify(["/products/saree-2.png"]),
            categoryId: sarees.id,
            isFeatured: true
        },
        {
            name: "Midnight Blue Lehenga Set",
            description: "Stunning midnight blue lehenga with silver sequin work.",
            price: 45000,
            images: JSON.stringify(["/products/lehenga-1.png"]),
            categoryId: lehengas.id,
            isFeatured: true
        }
    ];

    for (const product of products) {
        await prisma.product.create({
            data: product
        });
    }

    console.log('Seeding complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
