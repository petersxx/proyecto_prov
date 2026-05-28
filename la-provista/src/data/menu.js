import empanadaBannerImg from '../assets/empanadas-banner.png'
import ensaladasBannerImg from '../assets/ensaladas-banner.png'
import ensaladaCapresseImg from '../assets/ensalada-capresse.jpg'
import ensaladaCaesarImg from '../assets/ensalada-caesar.jpg'
import tostonAtunImg from '../assets/toston-atun.jpg'
import tostonCapresseImg from '../assets/toston-capresse.jpg'
import tostonCampoImg from '../assets/toston-campo.jpg'
import ensaladaPulmonImg from '../assets/ensalada-pulmon.jpg'
import ensaladaContrastesImg from '../assets/ensalada-contrastes.jpg'
import burgersBannerImg from '../assets/burgers-banner.png'
import pastasBannerImg from '../assets/pastas-banner.png'
import tostonesBannerImg from '../assets/tostones-banner.png'
import principalesBannerImg from '../assets/principales-banner.png'
import sandwichesBannerImg from '../assets/sandwiches-banner.png'
import piqueosBannerImg from '../assets/piqueos-banner.png'
import hummusFalafelImg from '../assets/hummus-falafel.png'
import hummusItemImg from '../assets/hummus-item.jpg'
import milaImg from '../assets/milas.png'
import marineraImg from '../assets/marinera.jpg'
import milaNapolitanaImg from '../assets/mila-napolitana.jpg'
import asadoImg from '../assets/asado.jpg'
import cheesecakeImg from '../assets/cheesecake.jpg'
import postresBannerImg from '../assets/postres-banner.png'

export const categories = [
  {
    id: 'empanadas',
    label: 'Empanadas',
    image: empanadaBannerImg,
    items: [
      { id: 1, name: 'Carne Criolla', description: 'Cocción a la perfección lentamente de un estofado de carne molida con vegetales y especias terminada con huevo duro.', price: 17000 },
      { id: 2, name: 'Pollo', description: 'La de pollo y cremoso nuestro cheddar fundido, sale con lactonesa de ajo y un toque de criolla.', price: 18000 },
      { id: 3, name: 'Huevo', description: 'Se acompaña con nuestro picante casero y limón.', price: 17000 },
      { id: 4, name: 'Jamón & Queso', description: 'Bien clásica.', price: 17000 },
      { id: 5, name: "Pastel Mandi'o", description: 'Relleno de vacío desmechado y queso Paraguay.', price: 17000 },
      { id: 6, name: 'Surubí', description: 'Crocante por fuera y cremosa por dentro, va con limón y nuestro picante casero.', price: 26000 },
      { id: 7, name: 'La de Camarón', description: 'Camarón, cebollita de verdeo y bechamel.', price: 28000 },
      { id: 8, name: 'De Lomito', description: 'Lomito de res cortado a cuchillo, vegetales y huevo.', price: 19000 },
      { id: 9, name: 'Capresse', description: 'Clásica combinación de tomate y quesos con un toque de brie y albahaca.', price: 17000 },
      { id: 10, name: 'Choclo', description: 'Maíz dulce salteado con verduras, mezclado con salsa bechamel y queso Paraguay.', price: 17000 },
    ],
  },
  {
    id: 'piqueos',
    label: 'Piqueos',
    image: piqueosBannerImg,
    items: [
      { id: 11, name: 'Sopa Paraguaya', description: 'Es nuestra, es típica, es crocante y deliciosamente untuosa por dentro, pedila con crema fina de ajo para acompañar.', price: 39000 },
      { id: 12, name: 'Chipa Guazú', description: 'Nuestra receta de tradición paraguaya de choclo fresco con queso en su punto, crocantita por fuera y cremosa por dentro.', price: 39000 },
      { id: 13, name: 'Croqueta de Vacío (6)', description: 'Compuestas de vacío braseado super untuosas por dentro acompañadas de lactonesa de ajo.', price: 49000 },
      { id: 14, name: 'Mbejú Tradicional', description: '', price: 33000 },
      { id: 15, name: 'Mbejú Provista', description: 'Mbejú con salsa de queso, tomate confitado y rúcula.', price: 38000 },
      { id: 16, name: 'Tortillitas', description: 'De queso Paraguay & cebollita de verdeo.', price: 38000 },
      { id: 17, name: 'Mandiocas Fritas', description: '', price: 32000 },
      { id: 18, name: 'Papas Fritas', description: '', price: 30000 },
      { id: 19, name: 'Croquetas Py (6)', description: 'Rellenas con queso Paraguay fundido y rebozadas de panko, salen con mayo chili.', price: 48000 },
    ],
  },
  {
    id: 'piqueos-frescos',
    label: 'Piqueos Frescos',
    image: hummusFalafelImg,
    items: [
      { id: 20, name: 'Hummus, Tabuleh y Falafel', description: 'Untuoso y sedoso puré de garbanzo saborizado de la mejor manera acompañado de ensalada de tabuleh y croquetas de falafel con nuestra salsa de ajo, los acompaña pan pita de la casa.', price: 70000, image: hummusItemImg },
    ],
  },
  {
    id: 'ensaladas',
    label: 'Ensaladas',
    image: ensaladasBannerImg,
    items: [
      { id: 21, name: 'Capresse', description: 'Clásica receta italiana con variedad de tomates, aguacate, hojas de rúcula, frutos secos, pesto y balsámico con remolacha.', price: 82000, image: ensaladaCapresseImg },
      { id: 22, name: 'De Contrastes', description: 'Buquet de rúcula con peras caramelizadas, queso roquefort, almendras al fuego, arándanos y vinagreta de menta y miel.', price: 89000, image: ensaladaContrastesImg },
      { id: 23, name: 'Pulmón', description: 'Mezclum de verdes, dados de queso Paraguay, choclo, nibs de panceta, cherrys en miel de caña, huevo mollet, crutones de mandioca y cebolla crispy aderezada con lactochimi. Carne o pollo a elección.', price: 87000, image: ensaladaPulmonImg },
      { id: 24, name: 'Caesar', description: 'Lechuga repollada, bacon, queso parmesano, crotones, aderezo caesar.', price: 80000, image: ensaladaCaesarImg },
    ],
  },
  {
    id: 'tostones',
    label: 'Tostones',
    image: tostonesBannerImg,
    items: [
      { id: 25, name: 'De Campo', description: 'Tostada de pan de campo, queso crema, aguacate, bacon, tomates asados, huevo a la plancha.', price: 60000, image: tostonCampoImg },
      { id: 26, name: 'Capresse', description: 'Láminas de tomate, mozzarella fresca y aguacate, terminado con reducción de balsámico, pesto y cherries asados.', price: 60000, image: tostonCapresseImg },
      { id: 27, name: 'De Atún', description: 'Con ensalada fresca de atún con zanahoria, cebolla roja, mayonesa, limón y aceite de sésamo coronado con huevos duros de codorniz.', price: 60000, image: tostonAtunImg },
    ],
  },
  {
    id: 'sandwiches',
    label: 'Sándwiches',
    image: sandwichesBannerImg,
    items: [
      { id: 28, name: 'Club Sándwich', description: 'Pan de miga, pechuga de pollo, panceta, mayo, mostaza y ketchup (salsa golf), lechuga, tomate, huevo a la plancha, jamón de pavo, jamón cocido y fetas de queso.', price: 75000 },
      { id: 29, name: 'Pollo Crispy', description: 'Pollo crispy en pan brioche con semillas, mayo especial, queso cheddar, tomate, lechuga repollada.', price: 82000 },
      { id: 30, name: 'Sándwich Roast-Beef', description: 'Sándwich de roast beef en pan brioche con provoleta grillada, lechuga repollada, mostaza dulce, pickle de cebolla roja y pepinillos. Le acompañan papas fritas y lactochimi para untar.', price: 79000 },
    ],
  },
  {
    id: 'burgers',
    label: 'Burgers',
    image: burgersBannerImg,
    items: [
      { id: 31, name: 'Burger Provista', description: 'Blend de carne en semillas, mayonesa, queso azul, rúcula, cebolla caramelizada y tomate.', price: 85000 },
      { id: 32, name: 'Bacon Cheese Double Smash', description: 'Doble burger smash en pan brioche con semillas, bacon, queso cheddar, ketchup, mostaza, cebolla, pepinillos.', price: 82000 },
      { id: 33, name: 'Paraguay Burger', description: '160 gramos de nuestro blend especial, con queso Paraguay a la plancha, cebolla crispy, lactochimi, salsa criolla en nuestro pan brioche de la casa. Sale con mandioca a la provenzal.', price: 83000 },
    ],
  },
  {
    id: 'principales',
    label: 'Platos Principales',
    image: principalesBannerImg,
    items: [
      { id: 34, name: 'Bife Koygua', description: 'Nuestra versión con bife de lomito de 200 gramos dorado a la chapa sobre papines fritos en salsa de cebolla, locote y tomate, terminado con huevos fritos.', price: 97000 },
      { id: 35, name: 'Pechuga a la Putanesca', description: 'Pechuga de pollo al horno terminada en salsa putanesca acompañada de penne rigate a la crema.', price: 92000 },
      { id: 36, name: 'Lomo Saltado', description: 'Cubos de lomito, cebolla morada, champiñones, tomate cherry, cilantro, papas fritas y arroz al ajo.', price: 99000 },
      { id: 37, name: 'Asado a la Olla', description: 'Costilla ventana sin hueso a la parrilla cocinada a la olla lentamente, acompañada de arroz kesú con arvejas.', price: 98000, image: asadoImg },
      { id: 38, name: 'Guisotto', description: 'Llevando este plato tradicional paraguayo a un nivel internacional con un arroz arbóreo para lograr una cremosidad única a través de la técnica italiana para elaborar risotto.', price: 82000 },
      { id: 39, name: 'Salmón al Limón', description: 'Salmón grillado con un colchón de crema de limón y vegetales orientales, masa philo.', price: 120000 },
      { id: 40, name: 'Vorí de Pollo', description: 'La mejor sopa del mundo. Sin más que explicar.', price: 65000 },
    ],
  },
  {
    id: 'pastas',
    label: 'Pastas',
    image: pastasBannerImg,
    items: [
      { id: 41, name: 'Spaghetti Carbonara con Camarones', description: 'Clásica preparación de la cocina italiana de familia combinada con camarones al ajillo.', price: 97000 },
      { id: 42, name: 'Sorrentinos del Cocinero', description: 'Rellenos de ricota, jamón crudo y puerro en una cremosa salsa con un toque de ajo, almendras tostadas y limón.', price: 88000 },
      { id: 43, name: 'Osobuco de Tallarín Verde', description: 'Tradicional receta hogareña del Paraguay compuesta por tallarín de color con un estofado delicioso de osobuco de ternera en cocción lenta.', price: 94000 },
      { id: 44, name: 'Ñoquis Boloñesa', description: 'Esponjosos ñoquis de papa con nuestro clásico ragout boloñesa cocido a baja temperatura.', price: 85000 },
    ],
  },
  {
    id: 'milas',
    label: 'Milas & Mari',
    image: milaImg,
    items: [
      { id: 45, name: 'Mila de Carne', description: 'Sale con guarnición de arroz kesú o ensalada.', price: 105000 },
      { id: 46, name: 'Mila Napolitana', description: 'Milanesa de lomito, salsa roja, rodajas de tomate, queso fresco y orégano, sobre cama de crocantes papas fritas.', price: 118000, image: milaNapolitanaImg },
      { id: 47, name: 'Mila de Surubí', description: 'Milanesa de surubí, salsa de queso Paraguay y roquefort.', price: 130000 },
      { id: 48, name: 'Mila de Pollo', description: 'Sale con guarnición de arroz kesú o ensalada.', price: 99000 },
      { id: 49, name: 'Marinera a Caballo', description: 'Marinera de lomito con 2 huevos y cebolla caramelizada, sobre cama de crocantes papas fritas.', price: 115000, image: marineraImg },
    ],
  },
  {
    id: 'postres',
    label: 'Postres & Tortas',
    image: postresBannerImg,
    subcategories: [
      {
        label: 'Postres',
        items: [
          { id: 50, name: 'La Cookie', description: '', price: 47000 },
          { id: 51, name: 'Nuestro Volcán', description: '', price: 49000 },
          { id: 52, name: 'Cinnamon Roll', description: '', price: 21000 },
          { id: 53, name: 'Arroz con Leche', description: '', price: 29000 },
          { id: 54, name: 'Tiramisú de Chocolate', description: '', price: 45000 },
          { id: 55, name: 'El Flan', description: '', price: 39000 },
          { id: 56, name: 'Brownie con Helado & Salsa de Chocolate', description: '', price: 45000 },
        ],
      },
      {
        label: 'Tortas',
        items: [
          { id: 57, name: 'Cheesecake de Frutos Rojos', description: '', price: 45000, image: cheesecakeImg },
          { id: 58, name: 'Pie de Limón', description: '', price: 44000 },
          { id: 59, name: 'De Chocolate', description: '', price: 44000 },
          { id: 60, name: 'Red Velvet', description: '', price: 42000 },
          { id: 61, name: 'Carrot Cake', description: '', price: 43000 },
        ],
      },
    ],
  },
  {
    id: 'merienda',
    label: 'Merienda',
    items: [
      { id: 62, name: 'Mixtos Calientitos — Jamón y Queso', description: '', price: 28000 },
      { id: 63, name: 'Mixtos — Jamón, Queso y Huevo', description: '', price: 30000 },
      { id: 64, name: 'Mixtos — Queso y Huevo', description: '', price: 28000 },
      { id: 65, name: 'Mixtos — Huevo', description: '', price: 26000 },
      { id: 66, name: 'Croissant', description: '', price: 20000 },
      { id: 67, name: 'Croissant con Jamón y Queso', description: '', price: 24000 },
      { id: 68, name: 'Mbejú Tradicional', description: '', price: 31000 },
      { id: 69, name: 'Mbejú Provista', description: 'Mbejú con salsa de queso, tomate confitado y rúcula.', price: 36000 },
    ],
  },
  {
    id: 'bebidas',
    label: 'Jugos y Mocktails',
    subcategories: [
      {
        label: 'Jugos Simples / Frozen',
        items: [
          { id: 70, name: 'Naranja | Durazno', description: 'Jugo simple o frozen.', price: 26000 },
          { id: 71, name: 'Piña | Limón | Frutilla | Manzana | Zanahoria', description: 'Jugo simple o frozen.', price: 28000 },
        ],
      },
      {
        label: 'Jugos Combinados',
        items: [
          { id: 72, name: 'Manzana | Naranja', description: '', price: 28000 },
          { id: 73, name: 'Zanahoria | Naranja', description: '', price: 28000 },
          { id: 74, name: 'Durazno | Naranja', description: '', price: 28000 },
          { id: 75, name: 'Piña | Naranja', description: '', price: 28000 },
          { id: 76, name: 'Frutilla | Limón', description: '', price: 28000 },
          { id: 77, name: 'Tutti Frutti', description: '', price: 29000 },
        ],
      },
      {
        label: 'Jugos Especiales',
        items: [
          { id: 78, name: 'Fruta Fresca', description: 'Frutilla, piña, naranja y limón.', price: 29000 },
          { id: 79, name: 'Piña, Naranja y Menta', description: '', price: 29000 },
          { id: 80, name: 'Durazno, Naranja y Cedrón', description: '', price: 29000 },
          { id: 81, name: 'Pomelo, Limón y Albahaca', description: '', price: 29000 },
        ],
      },
      {
        label: 'Frozen',
        items: [
          { id: 82, name: 'Limonada Provista', description: 'Limón, menta y jengibre.', price: 28000 },
          { id: 83, name: 'Pomelada Provista', description: 'Pomelo natural y hielo frappé.', price: 28000 },
          { id: 84, name: 'Piña Helada', description: 'Piña, limón, menta y hielo frappé.', price: 29000 },
          { id: 85, name: 'Durazno Helado', description: 'Durazno, naranja, limón y hielo frappé.', price: 29000 },
        ],
      },
      {
        label: 'Mocktails',
        items: [
          { id: 86, name: 'Cítrico', description: 'Cedrón, menta, limón y un toque cítrico.', price: 45000 },
          { id: 87, name: 'Fresco', description: 'Piña, durazno, limón y soda.', price: 45000 },
          { id: 88, name: 'Pomelo y Albahaca', description: 'Pomelo, albahaca, limón y soda.', price: 45000 },
          { id: 89, name: 'Piña Viva', description: 'Piña, jengibre, limón y soda.', price: 45000 },
          { id: 90, name: 'Mandarina y Cedrón', description: 'Mandarina, cedrón, limón y soda.', price: 45000 },
          { id: 91, name: 'Rubí Fresco', description: 'Frutos rojos, naranja, limón y soda.', price: 45000 },
        ],
      },
    ],
  },
  {
    id: 'cocktails',
    label: 'Cocktails',
    subcategories: [
      {
        label: 'Gin',
        items: [
          { id: 92, name: 'Gin Tonic Clásico', description: 'Gin y tónica, limón, pepino, naranja, romero y especias.', price: 55000 },
          { id: 93, name: 'Pineapple Gin', description: 'Gin, piña, macerado en almíbar de torrontés y cardamomo con tónica.', price: 55000 },
          { id: 94, name: 'Tangerine Gin', description: 'Gin, cordial de mandarina, tónica, albahaca.', price: 55000 },
          { id: 95, name: 'Huerta', description: 'Gin, pepino, cedrón, limón y tónica.', price: 55000 },
          { id: 96, name: 'Tónica Rosa', description: 'Gin, tónica, pomelo y pimienta rosa.', price: 55000 },
        ],
      },
      {
        label: 'Los Spritz',
        items: [
          { id: 97, name: 'Mariscal Spritz', description: 'Aperol, Chardonnay, almíbar de mburucuyá, cordial de limón y flores.', price: 55000 },
          { id: 98, name: 'Sanber Spritz', description: 'Aperol, vodka, cordial de naranja y canela, zumo de naranja, dash de soda.', price: 55000 },
          { id: 99, name: 'Aperol Spritz', description: 'Aperol, espumante, soda.', price: 55000 },
          { id: 100, name: 'Rubí Spritz', description: 'Aperitivo, frutos rojos, espumante, soda y limón.', price: 55000 },
          { id: 101, name: 'Maracuyá Spritz', description: 'Aperitivo, maracuyá, vino blanco o espumante, soda, naranja y albahaca.', price: 55000 },
        ],
      },
      {
        label: 'Clásicos',
        items: [
          { id: 102, name: 'Poniente', description: 'Ron, pulpa de piña, jugo de naranja, canela en rama, naranja deshidratada, azúcar rubia y perfume de almendras.', price: 55000 },
          { id: 103, name: 'La Provi', description: 'Vodka, limón, frutos rojos y almíbar de cardamomo.', price: 55000 },
          { id: 104, name: 'Doña Juana', description: 'Ron, Campari, maracuyá, pomelo, limón y miel.', price: 55000 },
          { id: 105, name: 'Pisco Pasión', description: 'Pisco, jugo de limón, cordial de mburucuyá y dash de Angostura.', price: 55000 },
          { id: 106, name: 'Caipiriña Clásica', description: '', price: 45000 },
          { id: 107, name: 'Caipi Provi', description: 'Mburucuyá o frutos rojos.', price: 48000 },
          { id: 108, name: 'Negroni', description: 'Gin, Campari y vermouth rosso.', price: 48000 },
          { id: 109, name: 'Mojito', description: 'Ron blanco, limón, menta, azúcar y soda.', price: 48000 },
          { id: 110, name: 'Piña Colada', description: 'Ron, piña y crema de coco.', price: 50000 },
          { id: 111, name: 'Fernet con Cola', description: '', price: 38000 },
          { id: 112, name: 'Pisco Sour', description: 'Pisco, limón, almíbar y clara de huevos.', price: 55000 },
        ],
      },
      {
        label: 'Vermut',
        items: [
          { id: 113, name: 'Vermut Clásico', description: 'Vermut y soda.', price: 50000 },
          { id: 114, name: 'Vermut Orange', description: 'Vermut y jugo de naranja.', price: 55000 },
          { id: 115, name: 'Vermut Rosado', description: 'Vermut blanco, vermut rosso, pomelo y cordial cítrico.', price: 55000 },
          { id: 116, name: 'Vermut Blanco', description: 'Vermut blanco, limón y Sprite Zero.', price: 55000 },
        ],
      },
      {
        label: 'Digestivo',
        items: [
          { id: 117, name: 'Limoncello Villa Masa', description: 'Raya.', price: 20000 },
        ],
      },
    ],
  },
  {
    id: 'cervezas',
    label: 'Cervezas',
    items: [
      { id: 118, name: 'Stella Artois', description: '', price: 24000 },
      { id: 119, name: 'Stella Chopp', description: '', price: 24000 },
      { id: 120, name: 'Heineken', description: '', price: 24000 },
      { id: 121, name: 'Heineken Silver', description: '', price: 24000 },
      { id: 122, name: 'Heineken Chopp', description: '', price: 24000 },
      { id: 123, name: 'Munich Tradicional', description: '', price: 18000 },
      { id: 124, name: 'Munich Ultra', description: '', price: 22000 },
      { id: 125, name: 'Munich Ultra Chopp', description: '', price: 22000 },
      { id: 126, name: 'Peroni 0.0', description: '', price: 29000 },
      { id: 127, name: 'Miller 365', description: '', price: 20000 },
    ],
  },
  {
    id: 'cafeteria',
    label: 'Cafetería',
    note: 'Granos de café de especialidad provienen de distintas regiones del mundo y son tostados todas las semanas en Asunción por TOTEM Tostadores.',
    subcategories: [
      {
        label: 'Calientes',
        items: [
          { id: 128, name: 'Espresso', description: '', price: 14000 },
          { id: 129, name: 'Americano', description: '', price: 16000 },
          { id: 130, name: 'Cortado', description: '', price: 17000 },
          { id: 131, name: 'Flat White', description: '', price: 20000 },
          { id: 132, name: 'Espresso Doble', description: '', price: 18000 },
          { id: 133, name: 'Cappuccino', description: '', price: 20000 },
          { id: 134, name: 'Mocha Provista', description: '', price: 26000 },
          { id: 135, name: 'Bombón Macchiato', description: '', price: 26000 },
          { id: 136, name: 'Submarino', description: '', price: 16000 },
        ],
      },
      {
        label: 'Fríos',
        items: [
          { id: 137, name: 'Affogato', description: '', price: 18000 },
          { id: 138, name: 'Chocolatada', description: '', price: 18000 },
          { id: 139, name: 'Iced Coffee', description: '', price: 20000 },
          { id: 140, name: 'Rose Coffee', description: '', price: 22000 },
          { id: 141, name: 'Frappuccino', description: '', price: 24000 },
        ],
      },
      {
        label: 'Tragos',
        items: [
          { id: 142, name: 'Barraquito', description: '', price: 45000 },
          { id: 143, name: 'Martini Espresso', description: '', price: 50000 },
          { id: 144, name: 'Irish Coffee', description: '', price: 50000 },
        ],
      },
    ],
  },
  {
    id: 'vinos',
    label: 'Bodeguita',
    subcategories: [
      {
        label: 'Tintos',
        items: [
          { id: 145, name: 'La Mascota Malbec', description: 'Por copa.', price: 45000 },
          { id: 146, name: 'D.V. Catena Cabernet/Cabernet', description: '', price: 480000 },
          { id: 147, name: 'D.V. Catena Malbec', description: '', price: 320000 },
          { id: 148, name: 'Errazuriz Aconcagua Alto Carmenere', description: '', price: 330000 },
          { id: 149, name: 'D.V. Catena Cabernet Malbec', description: '', price: 290000 },
          { id: 150, name: 'Gran Mascota Malbec', description: '', price: 290000 },
          { id: 151, name: 'Mascota Unánime Blend', description: '', price: 360000 },
          { id: 152, name: 'Luis Felipe Edwards Gran Reserva Carmenere', description: '', price: 240000 },
          { id: 153, name: 'La Mascota Malbec', description: '', price: 220000 },
          { id: 154, name: 'Luigi Bosca Malbec', description: '', price: 190000 },
          { id: 155, name: 'Los Intocables Malbec', description: '', price: 180000 },
          { id: 156, name: 'Memoro Piccini', description: '', price: 180000 },
          { id: 157, name: 'Trapiche Rva Malbec', description: '', price: 140000 },
        ],
      },
      {
        label: 'Blancos',
        items: [
          { id: 158, name: 'La Mascota Chardonnay', description: 'Por copa.', price: 45000 },
          { id: 159, name: 'Angélica Zapata Alta Chardonnay', description: '', price: 460000 },
          { id: 160, name: 'Aconcagua Costa Sauvignon Blanc', description: '', price: 320000 },
          { id: 161, name: 'D.V. Catena Chardonnay', description: '', price: 290000 },
          { id: 162, name: 'Matua Sauvignon Blanc', description: '', price: 280000 },
          { id: 163, name: 'Rutini Chardonnay', description: '', price: 280000 },
          { id: 164, name: 'Luis Felipe Edwards Gran Reserva Sauvignon Blanc', description: '', price: 190000 },
          { id: 165, name: 'La Mascota Chardonnay', description: '', price: 240000 },
          { id: 166, name: 'Luigi Bosca Sauvignon Blanc', description: '', price: 190000 },
          { id: 167, name: 'Errazuriz Reserva Chardonnay', description: '', price: 140000 },
        ],
      },
      {
        label: 'Rosados',
        items: [
          { id: 168, name: 'La Mascota Rosé', description: '', price: 200000 },
          { id: 169, name: 'Adobe Rosé', description: '', price: 100000 },
        ],
      },
      {
        label: 'Champagne',
        items: [
          { id: 170, name: 'Pommery Blanc De Blancs', description: '', price: 1500000 },
          { id: 171, name: 'Pommery Blue Sky', description: '', price: 990000 },
          { id: 172, name: 'Pommery Brut Royal', description: '', price: 800000 },
        ],
      },
      {
        label: 'Espumantes',
        items: [
          { id: 173, name: 'La Mascota Sparkling', description: 'Por copa.', price: 40000 },
          { id: 174, name: 'Piccini Prosecco Extra Dry', description: '', price: 240000 },
          { id: 175, name: 'La Mascota Sparkling', description: '', price: 210000 },
          { id: 176, name: 'Navarro Correas Extra Brut', description: '', price: 190000 },
          { id: 177, name: 'Cava Vilarnau Brut Reserva', description: '', price: 180000 },
        ],
      },
    ],
  },
  {
    id: 'whisky',
    label: 'Whisky',
    items: [
      { id: 178, name: 'Johnnie Walker Black Label', description: '', price: 370000, priceRaya: 40000 },
      { id: 179, name: 'Johnnie Walker Double Black', description: '', price: 420000, priceRaya: 45000 },
      { id: 180, name: 'Johnnie Walker Gold Reserve', description: '', price: 700000, priceRaya: 50000 },
      { id: 181, name: 'Johnnie Walker Blue Label', description: '', price: 2100000, priceRaya: 200000 },
    ],
  },
]
