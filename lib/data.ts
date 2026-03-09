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
    },
    {
        id: 'handloom',
        name: 'Handloom Silks',
        slug: 'handloom',
        description: 'Pure Kanchipuram and Banarasi silk sarees celebrating traditional weaves.'
    },
    {
        id: 'bridal',
        name: 'Complete Bridal Sets',
        slug: 'bridal',
        description: 'Complete matching bridal ensembles tailored to absolute perfection.'
    },
    {
        id: 'embroidery',
        name: 'Custom Embroidery',
        slug: 'embroidery',
        description: 'Personalized thread embroidery for contemporary and everyday elegant wear.'
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
        images: ["/products/saree-2.png"],
        categoryId: 'thanjavur',
        category: categories.find(c => c.id === 'thanjavur'),
        isFeatured: true
    },
    {
        id: '6',
        name: "Pure Kanchipuram Wedding Saree",
        description: "Authentic hand-woven Kanchipuram silk saree with pure zari border.",
        price: 38000,
        images: ["/products/saree-1.png"],
        categoryId: 'handloom',
        category: categories.find(c => c.id === 'handloom'),
        isFeatured: true
    },
    {
        id: '7',
        name: "Royal Velvet Bridal Lehenga Ensemble",
        description: "A complete bridal set featuring a heavy velvet lehenga, matching blouse, and double net dupattas.",
        price: 85000,
        images: ["/products/lehenga-1.png"],
        categoryId: 'bridal',
        category: categories.find(c => c.id === 'bridal'),
        isFeatured: true
    },
    {
        id: '8',
        name: "Pastel Threadwork Reception Blouse",
        description: "Contemporary pastel thread embroidery on a modern sweetheart neckline blouse.",
        price: 11000,
        images: ["/products/blouse-2.png"],
        categoryId: 'embroidery',
        category: categories.find(c => c.id === 'embroidery'),
        isFeatured: true
    }
];
