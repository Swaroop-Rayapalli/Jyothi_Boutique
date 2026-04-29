/**
 * Seed script — imports existing products.json into PostgreSQL via Prisma.
 * Run once:  npx tsx scripts/seed-products.ts
 */

import prisma from '../lib/prisma';

const existing = [
    {
        name: "Thanjavur Frame Paints",
        description: "Exquisite Thanjavur paintings in ornate wooden frames.",
        price: 0,
        images: ["/images/jb6.jpg"],
        categoryId: "thanjavur",
        isFeatured: true,
        isComingSoon: false,
    },
    {
        name: "Peacock Majesty Thanjavur Painting",
        description: "Royal peacock motif in traditional Thanjavur style with vibrant emerald and gold detailing.",
        price: 0,
        images: ["/images/jb1.jpeg"],
        categoryId: "thanjavur",
        isFeatured: true,
        isComingSoon: false,
    },
    {
        name: "Royal Elephant Hand-Painted Clutch",
        description: "Exquisite hand-painted elephant motif on a luxury black silk clutch, featuring ornate gold line work.",
        price: 0,
        images: ["/images/jb2.jpeg"],
        categoryId: "thanjavur",
        isFeatured: true,
        isComingSoon: false,
    },
    {
        name: "Divine Radha Krishna Thanjavur Art",
        description: "Circular Thanjavur composition depicting the divine love of Radha and Krishna on a rich crimson background.",
        price: 0,
        images: ["/images/jb3.jpeg"],
        categoryId: "thanjavur",
        isFeatured: true,
        isComingSoon: false,
    },
    {
        name: "Sacred Kamadhenu Thanjavur Embroidery",
        description: "Intricate thread work depicting the sacred cow Kamadhenu, embellished with traditional floral motifs.",
        price: 0,
        images: ["/images/jb4.jpeg"],
        categoryId: "embroidery",
        isFeatured: true,
        isComingSoon: false,
    },
    {
        name: "Vivaha Samskara Wedding Heritage Painting",
        description: "A monumental Thanjavur artwork capturing the sacred moments of a traditional Indian wedding ceremony.",
        price: 0,
        images: ["/images/jb5.jpeg"],
        categoryId: "thanjavur",
        isFeatured: true,
        isComingSoon: false,
    },
];

async function main() {
    console.log('🌱 Seeding products...');

    // Skip seeding if products already exist
    const count = await prisma.product.count();
    if (count > 0) {
        console.log(`ℹ️  ${count} products already in DB — skipping seed.`);
        return;
    }

    for (const data of existing) {
        const p = await prisma.product.create({ data });
        console.log(`  ✅ Created: ${p.name}`);
    }

    console.log('🎉 Seeding complete!');
}

main()
    .catch(e => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());
