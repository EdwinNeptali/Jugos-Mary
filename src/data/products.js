export const products = [
  {
    id: 'j1',
    title: 'Jugo de Naranja',
    category: 'jugos',
    price: 3.00,
    icon: '🍊',
    color: '#fbbf24',
    description: 'Vitamina C, Ácido Fólico, Potasio.',
    allowBerenjena: true,
    volume: '250 ml',
    prep: 'Naranjas exprimidas al momento, sin agua ni azúcar añadida.',
    benefits: ['Rico en Vitamina C', 'Fortalece las defensas', 'Antioxidante natural'],
    berenjenaBenefit: 'Suma fibra extra y ayuda a regular el colesterol.'
  },
  {
    id: 'j2',
    title: 'Jugo de Papaya',
    category: 'jugos',
    price: 2.50,
    icon: '🥭',
    color: '#f97316',
    description: 'Vitamina A, Vitamina C, Fibra.',
    allowBerenjena: true,
    volume: '250 ml',
    prep: 'Papaya fresca licuada, cremosa y sin colar.',
    benefits: ['Fuente de Vitamina A', 'Mejora la digestión', 'Aporta fibra natural'],
    berenjenaBenefit: 'Potencia el aporte de fibra para una digestión más ligera.'
  },
  {
    id: 'j3',
    title: 'Piña con Fibra',
    category: 'jugos',
    price: 4.00,
    icon: '🍍',
    color: '#eab308', // Yellow
    description: 'Bromelina, Fibra, Vitamina C.',
    allowBerenjena: true,
    hasFiber: true,
    volume: '250 ml',
    prep: 'Piña fresca licuada con su fibra natural, sin colar.',
    benefits: ['Contiene bromelina digestiva', 'Alto en Vitamina C', 'Con fibra natural'],
    berenjenaBenefit: 'Se suma a la fibra de la piña para mayor saciedad.'
  },
  {
    id: 'j4',
    title: 'Piña Colada',
    category: 'jugos',
    price: 5.00,
    icon: '🍹',
    color: '#eab308',
    description: 'Vitamina C, Magnesio, Hierro.',
    allowBerenjena: true,
    volume: '250 ml',
    prep: 'Piña y un toque de crema de coco licuados, sin alcohol.',
    benefits: ['Vitamina C y Magnesio', 'Sabor tropical y cremoso', 'Hidratante y refrescante'],
    berenjenaBenefit: 'Aporta fibra extra sin alterar su sabor cremoso.'
  },
  {
    id: 's1',
    title: 'Sándwich de Pollo',
    category: 'sandwich',
    price: 1.50,
    icon: '🍗',
    description: 'Pollo deshilachado, pan del día.',
    allowBerenjena: false,
    prep: 'Pan horneado del día relleno con pollo deshilachado y vegetales frescos.',
    benefits: ['Buena fuente de proteína', 'Ingredientes frescos del día', 'Ideal para una comida ligera']
  },
  {
    id: 's2',
    title: 'Sándwich de Huevo',
    category: 'sandwich',
    price: 1.50,
    icon: '🍳',
    description: 'Huevo fresco, pan del día.',
    allowBerenjena: false,
    prep: 'Pan artesanal con huevo recién preparado.',
    benefits: ['Alto en proteína', 'Energía para la mañana', 'Preparado al momento']
  },
  {
    id: 's3',
    title: 'Sándwich de Queso Suizo',
    category: 'sandwich',
    price: 1.50,
    icon: '🧀',
    description: 'Queso suizo en láminas, pan del día.',
    allowBerenjena: false,
    prep: 'Pan artesanal con queso suizo en láminas.',
    benefits: ['Fuente de calcio', 'Sabor suave y cremoso', 'Ideal para una merienda']
  },
  {
    id: 's4',
    title: 'Sándwich de Palta',
    category: 'sandwich',
    price: 1.50,
    icon: '🥑',
    description: 'Palta fresca, pan del día.',
    allowBerenjena: false,
    prep: 'Pan artesanal con palta fresca en láminas.',
    benefits: ['Grasas saludables', 'Rico en fibra', 'Opción vegetariana']
  },
  {
    id: 'p1',
    title: 'Queque Casero',
    category: 'postre',
    price: 1.50,
    icon: '🍰',
    description: 'Receta casera, horneado del día.',
    allowBerenjena: false,
    prep: 'Horneado artesanalmente cada día con receta casera tradicional.',
    benefits: ['Porción individual', 'Receta casera tradicional', 'Perfecto para acompañar tu jugo']
  }
];
