import type { Difficulty } from '../models/Recipe';

export type RecipeSeed = {
  slug: string;
  sourceImage: string;
  name: string;
  prepTimeMinutes: number;
  difficulty: Difficulty;
  servings: number;
  description: string;
  ingredients: string[];
  steps: string[];
};

export const recipesData: RecipeSeed[] = [
  {
    slug: 'tres-leches-maracuya',
    sourceImage:
      'https://res.cloudinary.com/dh3cfhtgj/image/upload/v1782216834/Classic-passion-fruit-mousse-recipe-with-gelatin_wh5gej.jpg',
    name: 'Tres Leches de Maracuyá',
    prepTimeMinutes: 40,
    difficulty: 'Easy',
    servings: 9,
    description:
      'Bizcocho esponjoso empapado en una mezcla de tres leches, coronado con un coulis ácido de maracuyá que equilibra el dulce.',
    ingredients: [
      '5 huevos (separados)',
      '1 taza de azúcar',
      '1 taza de harina de trigo',
      '1 cucharadita de polvo de hornear',
      '1 lata de leche condensada',
      '1 lata de leche evaporada',
      '1 taza de crema de leche',
      '1 taza de pulpa de maracuyá',
      '1/4 taza de azúcar para el coulis',
    ],
    steps: [
      'Precalienta el horno a 180°C y engrasa un molde rectangular.',
      'Bate las claras a punto de nieve, agrega el azúcar y luego las yemas una a una.',
      'Incorpora con movimientos envolventes la harina cernida con el polvo de hornear.',
      'Hornea 25 minutos hasta que un palillo salga limpio. Deja enfriar.',
      'Mezcla las tres leches y baña el bizcocho frío; refrigera 2 horas.',
      'Cocina la pulpa de maracuyá con el azúcar hasta espesar y vierte sobre cada porción.',
    ],
  },
  {
    slug: 'arroz-con-leche-canela',
    sourceImage:
      'https://res.cloudinary.com/dh3cfhtgj/image/upload/v1782216905/instant-pot-arroz-con-leche_d0fwl5.jpg',
    name: 'Arroz con Leche Cremoso de Canela',
    prepTimeMinutes: 50,
    difficulty: 'Easy',
    servings: 6,
    description:
      'El postre de cuchara más reconfortante: arroz cocido lentamente en leche con canela y un toque de cáscara de naranja.',
    ingredients: [
      '1 taza de arroz',
      '4 tazas de leche entera',
      '1 lata de leche condensada',
      '2 ramas de canela',
      '1 cáscara de naranja',
      '1 pizca de sal',
      'Canela en polvo para decorar',
    ],
    steps: [
      'Lava el arroz y cocínalo en 2 tazas de agua con las ramas de canela y la cáscara de naranja.',
      'Cuando el agua se reduzca, agrega la leche entera y la pizca de sal.',
      'Cocina a fuego bajo, revolviendo con frecuencia, hasta que el arroz esté tierno.',
      'Incorpora la leche condensada y cocina 5 minutos más hasta espesar.',
      'Retira la canela y la cáscara; sirve tibio o frío con canela en polvo.',
    ],
  },
  {
    slug: 'mousse-lulo-chocolate-blanco',
    sourceImage:
      'https://res.cloudinary.com/dh3cfhtgj/image/upload/v1782216893/hq720_vkpian.jpg',
    name: 'Mousse de Lulo y Chocolate Blanco',
    prepTimeMinutes: 35,
    difficulty: 'Medium',
    servings: 6,
    description:
      'La acidez tropical del lulo corta la dulzura del chocolate blanco en una mousse ligera y aireada.',
    ingredients: [
      '200 g de chocolate blanco',
      '1 taza de pulpa de lulo',
      '2 tazas de crema de leche fría',
      '3 cucharadas de azúcar',
      '1 sobre de gelatina sin sabor',
      '3 cucharadas de agua',
    ],
    steps: [
      'Hidrata la gelatina en el agua fría durante 5 minutos.',
      'Derrite el chocolate blanco a baño maría y deja entibiar.',
      'Calienta la mitad de la pulpa de lulo y disuelve la gelatina hidratada en ella.',
      'Bate la crema con el azúcar hasta picos suaves.',
      'Une el chocolate, la pulpa con gelatina y el resto del lulo; integra con la crema en envolvente.',
      'Reparte en copas y refrigera al menos 4 horas.',
    ],
  },
  {
    slug: 'tarta-limon-merengue-suizo',
    sourceImage:
      'https://res.cloudinary.com/dh3cfhtgj/image/upload/v1782216929/tarta-de-limon-con-leche-condensada_eyu740.jpg',
    name: 'Tarta de Limón con Merengue Suizo',
    prepTimeMinutes: 70,
    difficulty: 'Medium',
    servings: 8,
    description:
      'Base de galleta crocante, un curd de limón cremoso y ácido, coronado con merengue suizo dorado al soplete.',
    ingredients: [
      '2 tazas de galletas molidas',
      '100 g de mantequilla derretida',
      '4 yemas de huevo',
      '1 lata de leche condensada',
      '3/4 taza de jugo de limón',
      '4 claras de huevo',
      '3/4 taza de azúcar',
    ],
    steps: [
      'Mezcla las galletas con la mantequilla y presiona en un molde; refrigera.',
      'Bate las yemas con la leche condensada y el jugo de limón hasta integrar.',
      'Vierte sobre la base y hornea a 160°C por 15 minutos; enfría.',
      'Para el merengue, calienta claras y azúcar a baño maría hasta 60°C revolviendo.',
      'Bate la mezcla caliente hasta picos firmes y brillantes.',
      'Cubre la tarta con el merengue y dora con soplete.',
    ],
  },
  {
    slug: 'brownie-cafe-avellana',
    sourceImage:
      'https://res.cloudinary.com/dh3cfhtgj/image/upload/v1782216993/Chocolate-Chip-Brownies-B-7FEAT_vnou9g.jpg',
    name: 'Brownie de Café y Avellana',
    prepTimeMinutes: 45,
    difficulty: 'Medium',
    servings: 12,
    description:
      'Brownie denso y húmedo donde un shot de espresso intensifica el cacao, con avellanas tostadas para dar textura.',
    ingredients: [
      '200 g de chocolate semiamargo',
      '150 g de mantequilla',
      '1 shot de espresso (30 ml)',
      '3 huevos',
      '1 taza de azúcar',
      '3/4 taza de harina',
      '1/2 taza de avellanas tostadas picadas',
      '1 pizca de sal',
    ],
    steps: [
      'Precalienta el horno a 175°C y forra un molde cuadrado con papel.',
      'Derrite el chocolate con la mantequilla y mezcla con el espresso.',
      'Bate los huevos con el azúcar hasta que palidezcan y dupliquen el volumen.',
      'Une la mezcla de chocolate con los huevos, luego la harina y la sal.',
      'Agrega las avellanas y vierte en el molde.',
      'Hornea 25 minutos; el centro debe quedar húmedo. Enfría antes de cortar.',
    ],
  },
  {
    slug: 'souffle-chocolate-individual',
    sourceImage:
      'https://res.cloudinary.com/dh3cfhtgj/image/upload/v1782216959/257193-chef-johns-chocolate-souffle-DDMFS-beauty-4x3-57-0af04de9f4154f44b0d927dab4d2e624_yg0fcs.jpg',
    name: 'Soufflé de Chocolate Individual',
    prepTimeMinutes: 30,
    difficulty: 'Hard',
    servings: 4,
    description:
      'El reto técnico de la repostería: un soufflé que sube alto y se sirve de inmediato, con centro fundente.',
    ingredients: [
      '120 g de chocolate semiamargo',
      '50 g de mantequilla (más extra para los moldes)',
      '3 claras de huevo',
      '2 yemas de huevo',
      '50 g de azúcar (más extra para los moldes)',
      '1 pizca de sal',
    ],
    steps: [
      'Precalienta el horno a 200°C. Unta los ramequines con mantequilla y espolvorea azúcar.',
      'Derrite el chocolate con la mantequilla a baño maría y deja entibiar.',
      'Integra las yemas al chocolate tibio una a una.',
      'Bate las claras con la sal, agregando el azúcar en lluvia hasta picos firmes.',
      'Incorpora un tercio de las claras al chocolate para aligerar, luego el resto en envolvente.',
      'Llena los ramequines, limpia los bordes y hornea 12-14 minutos. Sirve de inmediato.',
    ],
  },
];
