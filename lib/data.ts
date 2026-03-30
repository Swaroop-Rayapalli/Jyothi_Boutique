import productsData from './products.json';

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

export const products = (productsData as any[]).map(p => ({
    ...p,
    category: categories.find(c => c.id === p.categoryId)
}));
