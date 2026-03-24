export const categories = [
    {
        id: 'thanjavur',
        name: 'Thanjavur Paintings',
        slug: 'thanjavur',
        description: 'Authentic South Indian classical paintings with rich colors and gold foil.'
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
        id: '8',
        name: "Pastel Threadwork Reception Blouse",
        description: "Contemporary pastel thread embroidery on a modern sweetheart neckline blouse.",
        price: 11000,
        images: ["/products/pastel-blouse.jpg"],
        categoryId: 'embroidery',
        category: categories.find(c => c.id === 'embroidery'),
        isFeatured: true
    },
    {
        id: '9',
        name: "Thanjavur Frame Paints",
        description: "Exquisite Thanjavur paintings in ornate wooden frames. Coming Soon!",
        price: 0,
        images: ["/placeholder.jpg"],
        categoryId: 'thanjavur',
        category: categories.find(c => c.id === 'thanjavur'),
        isFeatured: true,
        isComingSoon: true
    },
    {
        id: '10',
        name: "Thanjavur Paints on Purses",
        description: "Unique Thanjavur art delicately painted on handcrafted silk purses.",
        price: 4500,
        images: ["/products/saree-2.png"], // Updated to use a real image if available, using saree-2 for now
        categoryId: 'thanjavur',
        category: categories.find(c => c.id === 'thanjavur'),
        isFeatured: true
    },
    {
        id: '11',
        name: "Peacock Majesty Thanjavur Painting",
        description: "Royal peacock motif in traditional Thanjavur style with vibrant emerald and gold detailing.",
        price: 45000,
        images: ["/images/jb1.jpeg", "/images/jb1.jpeg"], // Side view placeholder
        categoryId: 'thanjavur',
        category: categories.find(c => c.id === 'thanjavur'),
        isFeatured: true
    },
    {
        id: '12',
        name: "Royal Elephant Hand-Painted Clutch",
        description: "Exquisite hand-painted elephant motif on a luxury black silk clutch, featuring ornate gold line work.",
        price: 5500,
        images: ["/images/jb2.jpeg", "/images/jb2.jpeg"], // Side view placeholder
        categoryId: 'thanjavur',
        category: categories.find(c => c.id === 'thanjavur'),
        isFeatured: true
    },
    {
        id: '13',
        name: "Divine Radha Krishna Thanjavur Art",
        description: "Circular Thanjavur composition depicting the divine love of Radha and Krishna on a rich crimson background.",
        price: 38000,
        images: ["/images/jb3.jpeg", "/images/jb3.jpeg"], // Side view placeholder
        categoryId: 'thanjavur',
        category: categories.find(c => c.id === 'thanjavur'),
        isFeatured: true
    },
    {
        id: '14',
        name: "Sacred Kamadhenu Thanjavur Embroidery",
        description: "Intricate thread work depicting the sacred cow Kamadhenu, embellished with traditional floral motifs.",
        price: 12500,
        images: ["/images/jb4.jpeg", "/images/jb4.jpeg"], // Side view placeholder
        categoryId: 'embroidery',
        category: categories.find(c => c.id === 'embroidery'),
        isFeatured: true
    },
    {
        id: '15',
        name: "Vivaha Samskara Wedding Heritage Painting",
        description: "A monumental Thanjavur artwork capturing the sacred moments of a traditional Indian wedding ceremony.",
        price: 55000,
        images: ["/images/jb5.jpeg", "/images/jb5.jpeg"], // Side view placeholder
        categoryId: 'thanjavur',
        category: categories.find(c => c.id === 'thanjavur'),
        isFeatured: true
    }
];
