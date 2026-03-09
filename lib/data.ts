export const categories = [
    {
        id: 'blouses',
        name: 'Designer Blouses',
        slug: 'blouses',
        description: 'Handcrafted maggam work blouses for every occasion.'
    },
    {
        id: 'sarees',
        name: 'Bridal Sarees',
        slug: 'sarees',
        description: 'Exquisite silk sarees for the modern bride.'
    },
    {
        id: 'lehengas',
        name: 'Luxury Lehengas',
        slug: 'lehengas',
        description: 'Elegant lehengas with intricate embroidery.'
    }
];

export const products = [
    {
        id: '1',
        name: "Royal Crimson Bridal Blouse",
        description: "Intricate gold maggam work on royal crimson silk.",
        price: 15000,
        images: ["/products/blouse-1.png"],
        categoryId: 'blouses',
        category: categories.find(c => c.id === 'blouses'),
        isFeatured: true
    },
    {
        id: '2',
        name: "Classic Gold Motif Blouse",
        description: "Elegant silk blouse with delicate gold motifs.",
        price: 12500,
        images: ["/products/blouse-2.png"],
        categoryId: 'blouses',
        category: categories.find(c => c.id === 'blouses'),
        isFeatured: true
    },
    {
        id: '3',
        name: "Emerald Green Silk Saree",
        description: "Luxurious emerald green silk saree with gold borders.",
        price: 25000,
        images: ["/products/saree-1.png", "/products/saree-2.png"],
        categoryId: 'sarees',
        category: categories.find(c => c.id === 'sarees'),
        isFeatured: true
    },
    {
        id: '4',
        name: "Midnight Blue Lehenga Set",
        description: "Stunning midnight blue lehenga with silver sequin work.",
        price: 45000,
        images: ["/products/lehenga-1.png"],
        categoryId: 'lehengas',
        category: categories.find(c => c.id === 'lehengas'),
        isFeatured: true
    }
];
