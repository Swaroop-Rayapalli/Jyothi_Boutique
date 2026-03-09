export const categories = [
    {
        id: 'zardosi',
        name: 'Zardosi Work',
        slug: 'zardosi',
        description: 'Exquisite heavy maggam work using metallic threads and rich embellishments.'
    },
    {
        id: 'aari',
        name: 'Aari Work',
        slug: 'aari',
        description: 'Delicate and intricate thread work created with a pen-like needle.'
    },
    {
        id: 'kundan',
        name: 'Kundan Work',
        slug: 'kundan',
        description: 'Luxurious maggam work featuring embedded gemstones and glass pieces.'
    },
    {
        id: 'cutwork',
        name: 'Cutwork',
        slug: 'cutwork',
        description: 'Elegant maggam designs featuring beautifully crafted cut-out patterns.'
    },
    {
        id: 'thanjavur',
        name: 'Thanjavur Paintings',
        slug: 'thanjavur',
        description: 'Authentic South Indian classical paintings with rich colors and gold foil.'
    }
];

export const products = [
    {
        id: '1',
        name: "Bridal Zardosi Silk Blouse",
        description: "Intricate gold zardosi maggam work on royal crimson silk.",
        price: 15000,
        images: ["/products/blouse-1.png"],
        categoryId: 'zardosi',
        category: categories.find(c => c.id === 'zardosi'),
        isFeatured: true
    },
    {
        id: '2',
        name: "Aari Work Gold Motif Blouse",
        description: "Elegant silk blouse with delicate Aari embroidery and motifs.",
        price: 12500,
        images: ["/products/blouse-2.png"],
        categoryId: 'aari',
        category: categories.find(c => c.id === 'aari'),
        isFeatured: true
    },
    {
        id: '3',
        name: "Kundan Embedded Emerald Saree",
        description: "Luxurious emerald green silk saree with kundan maggam borders.",
        price: 25000,
        images: ["/products/saree-1.png"],
        categoryId: 'kundan',
        category: categories.find(c => c.id === 'kundan'),
        isFeatured: true
    },
    {
        id: '4',
        name: "Floral Cutwork Lehenga Set",
        description: "Stunning midnight blue lehenga with silver cutwork detailing.",
        price: 45000,
        images: ["/products/lehenga-1.png"],
        categoryId: 'cutwork',
        category: categories.find(c => c.id === 'cutwork'),
        isFeatured: true
    },
    {
        id: '5',
        name: "Traditional Saraswati Thanjavur Painting",
        description: "Authentic Tanjore painting of Goddess Saraswati with 22k gold foil art.",
        price: 35000,
        images: ["/products/saree-2.png"], // Reusing an image to prevent 400 error
        categoryId: 'thanjavur',
        category: categories.find(c => c.id === 'thanjavur'),
        isFeatured: true
    }
];
