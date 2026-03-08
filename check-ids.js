const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const products = await prisma.product.findMany({
        select: { id: true, name: true }
    });
    console.log('Current Product IDs in Database:');
    products.forEach(p => console.log(`ID: ${p.id} | Name: ${p.name}`));
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
