import orangeJuiceGlass from '../assets/orange-juice-glass.png';
import papayaJuiceGlass from '../assets/papaya-juice-glass.png';
import pineappleJuiceGlass from '../assets/pineapple-juice-glass.png';
import pineappleJuiceColada from '../assets/pineapple-juice-colada.png';

export const products = [
  {
    id: 'j1',
    title: 'Jugo de Naranja',
    category: 'jugos',
    image: orangeJuiceGlass,
    price: 3.00,
    icon: '🍊',
    color: '#f7901e',
    highlightColor: '#ffbe45',
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
    image: papayaJuiceGlass,
    price: 2.50,
    icon: '🥭',
    color: '#ed5435',
    highlightColor: '#ff8a52',
    description: 'Vitamina A, Vitamina C, Fibra.',
    allowBerenjena: true,
    volume: '250 ml',
    prep: 'Papaya fresca licuada, cremosa y sin colar.',
    benefits: ['Fuente de Vitamina A', 'Mejora la digestión', 'Aporta fibra natural'],
    berenjenaBenefit: 'Potencia el aporte de fibra para una digestión más ligera.'
  },
  {
    id: 'j3',
    title: 'Jugo de Piña',
    category: 'jugos',
    image: pineappleJuiceGlass,
    price: 5.00,
    icon: '🍍',
    color: '#ffd21f',
    highlightColor: '#ffeb75',
    description: 'Piña colada, con o sin fibra.',
    allowBerenjena: true,
    defaultVariantId: 'fiber',
    variants: [
      { id: 'fiber', label: 'Con fibra', cartLabel: 'Con fibra', image: pineappleJuiceGlass },
      { id: 'colada', label: 'Sin fibra', cartLabel: 'Piña colada (sin fibra)', image: pineappleJuiceColada }
    ],
    volume: '250 ml',
    prep: 'Elige piña fresca con fibra o colada, sin fibra.',
    benefits: ['Contiene bromelina digestiva', 'Alto en Vitamina C'],
    berenjenaBenefit: 'Se suma a la fibra de la piña para mayor saciedad.'
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
