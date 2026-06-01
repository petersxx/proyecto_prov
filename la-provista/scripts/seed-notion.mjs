import { config } from 'dotenv'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
config({ path: resolve(__dirname, '../.env.local') })

const TOKEN = process.env.NOTION_API_KEY
const NOTION_VERSION = '2022-06-28'
const PAGE_ID = '371459f113f9809996ded85cb1c91cce'

function notionFetch(path, method, body) {
  return fetch(`https://api.notion.com/v1${path}`, {
    method,
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
      'Notion-Version': NOTION_VERSION,
    },
    body: body ? JSON.stringify(body) : undefined,
  }).then(async r => {
    const json = await r.json()
    if (!r.ok) throw new Error(json.message + '\n' + JSON.stringify(json, null, 2))
    return json
  })
}

// ── Menú completo ─────────────────────────────────────────────────────────────

const categories = [
  {
    id: 'empanadas', label: 'Empanadas', items: [
      { name: 'Carne Criolla', description: 'Cocción a la perfección lentamente de un estofado de carne molida con vegetales y especias terminada con huevo duro.', price: 17000 },
      { name: 'Pollo', description: 'La de pollo y cremoso nuestro cheddar fundido, sale con lactonesa de ajo y un toque de criolla.', price: 17000 },
      { name: 'Huevo', description: 'Se acompaña con nuestro picante casero y limón.', price: 17000 },
      { name: 'Jamón & Queso', description: 'Bien clásica.', price: 17000 },
      { name: "Pastel Mandi'o", description: 'Relleno de vacío desmechado y queso Paraguay.', price: 17000 },
      { name: 'Surubí', description: 'Crocante por fuera y cremosa por dentro, va con limón y nuestro picante casero.', price: 26000 },
      { name: 'La de Camarón', description: 'Camarón, cebollita de verdeo y bechamel.', price: 28000 },
      { name: 'De Lomito', description: 'Lomito de res cortado a cuchillo, vegetales y huevo.', price: 19000 },
      { name: 'Capresse', description: 'Clásica combinación de tomate y quesos con un toque de brie y albahaca.', price: 17000 },
      { name: 'Choclo', description: 'Maíz dulce salteado con verduras, mezclado con salsa bechamel y queso Paraguay.', price: 17000 },
    ],
  },
  {
    id: 'piqueos', label: 'Piqueos', items: [
      { name: 'Sopa Paraguaya', description: 'Es nuestra, es típica, es crocante y deliciosamente untuosa por dentro, pedila con crema fina de ajo para acompañar.', price: 39000 },
      { name: 'Chipa Guazú', description: 'Nuestra receta de tradición paraguaya de choclo fresco con queso en su punto, crocantita por fuera y cremosa por dentro.', price: 39000 },
      { name: 'Croqueta de Vacío (6)', description: 'Compuestas de vacío braseado super untuosas por dentro acompañadas de lactonesa de ajo.', price: 49000 },
      { name: 'Mbejú Tradicional', description: '', price: 33000 },
      { name: 'Mbejú Provista', description: 'Mbejú con salsa de queso, tomate confitado y rúcula.', price: 38000 },
      { name: 'Tortillitas', description: 'De queso Paraguay & cebollita de verdeo.', price: 38000 },
      { name: 'Mandiocas Fritas', description: '', price: 32000 },
      { name: 'Papas Fritas', description: '', price: 30000 },
      { name: 'Croquetas Py (6)', description: 'Rellenas con queso Paraguay fundido y rebozadas de panko, salen con mayo chili.', price: 48000 },
    ],
  },
  {
    id: 'piqueos-frescos', label: 'Piqueos Frescos', items: [
      { name: 'Hummus, Tabuleh y Falafel', description: 'Untuoso y sedoso puré de garbanzo saborizado de la mejor manera acompañado de ensalada de tabuleh y croquetas de falafel con nuestra salsa de ajo, los acompaña pan pita de la casa.', price: 70000 },
    ],
  },
  {
    id: 'ensaladas', label: 'Ensaladas', items: [
      { name: 'Capresse', description: 'Clásica receta italiana con variedad de tomates, aguacate, hojas de rúcula, frutos secos, pesto y balsámico con remolacha.', price: 82000 },
      { name: 'De Contrastes', description: 'Buquet de rúcula con peras caramelizadas, queso roquefort, almendras al fuego, arándanos y vinagreta de menta y miel.', price: 89000 },
      { name: 'Pulmón', description: 'Mezclum de verdes, dados de queso Paraguay, choclo, nibs de panceta, cherrys en miel de caña, huevo mollet, crutones de mandioca y cebolla crispy aderezada con lactochimi. Carne o pollo a elección.', price: 87000 },
      { name: 'Caesar', description: 'Lechuga repollada, bacon, queso parmesano, crotones, aderezo caesar.', price: 80000 },
    ],
  },
  {
    id: 'tostones', label: 'Tostones', items: [
      { name: 'De Campo', description: 'Tostada de pan de campo, queso crema, aguacate, bacon, tomates asados, huevo a la plancha.', price: 60000 },
      { name: 'Capresse', description: 'Láminas de tomate, mozzarella fresca y aguacate, terminado con reducción de balsámico, pesto y cherries asados.', price: 60000 },
      { name: 'De Atún', description: 'Con ensalada fresca de atún con zanahoria, cebolla roja, mayonesa, limón y aceite de sésamo coronado con huevos duros de codorniz.', price: 60000 },
    ],
  },
  {
    id: 'sandwiches', label: 'Sándwiches', items: [
      { name: 'Club Sándwich', description: 'Pan de miga, pechuga de pollo, panceta, mayo, mostaza y ketchup (salsa golf), lechuga, tomate, huevo a la plancha, jamón de pavo, jamón cocido y fetas de queso.', price: 75000 },
      { name: 'Pollo Crispy', description: 'Pollo crispy en pan brioche con semillas, mayo especial, queso cheddar, tomate, lechuga repollada.', price: 82000 },
      { name: 'Sándwich Roast-Beef', description: 'Sándwich de roast beef en pan brioche con provoleta grillada, lechuga repollada, mostaza dulce, pickle de cebolla roja y pepinillos.', price: 79000 },
    ],
  },
  {
    id: 'burgers', label: 'Burgers', items: [
      { name: 'Burger Provista', description: 'Blend de carne en semillas, mayonesa, queso azul, rúcula, cebolla caramelizada y tomate.', price: 85000 },
      { name: 'Bacon Cheese Double Smash', description: 'Doble burger smash en pan brioche con semillas, bacon, queso cheddar, ketchup, mostaza, cebolla, pepinillos.', price: 82000 },
      { name: 'Paraguay Burger', description: '160 gramos de nuestro blend especial, con queso Paraguay a la plancha, cebolla crispy, lactochimi, salsa criolla en nuestro pan brioche de la casa. Sale con mandioca a la provenzal.', price: 83000 },
    ],
  },
  {
    id: 'principales', label: 'Platos Principales', items: [
      { name: 'Bife Koygua', description: 'Nuestra versión con bife de lomito de 200 gramos dorado a la chapa sobre papines fritos en salsa de cebolla, locote y tomate, terminado con huevos fritos.', price: 97000 },
      { name: 'Pechuga a la Putanesca', description: 'Pechuga de pollo al horno terminada en salsa putanesca acompañada de penne rigate a la crema.', price: 92000 },
      { name: 'Lomo Saltado', description: 'Cubos de lomito, cebolla morada, champiñones, tomate cherry, cilantro, papas fritas y arroz al ajo.', price: 99000 },
      { name: 'Asado a la Olla', description: 'Costilla ventana sin hueso a la parrilla cocinada a la olla lentamente, acompañada de arroz kesú con arvejas.', price: 98000 },
      { name: 'Guisotto', description: 'Llevando este plato tradicional paraguayo a un nivel internacional con un arroz arbóreo para lograr una cremosidad única a través de la técnica italiana para elaborar risotto.', price: 82000 },
      { name: 'Salmón al Limón', description: 'Salmón grillado con un colchón de crema de limón y vegetales orientales, masa philo.', price: 120000 },
      { name: 'Vorí de Pollo', description: 'La mejor sopa del mundo. Sin más que explicar.', price: 65000 },
    ],
  },
  {
    id: 'pastas', label: 'Pastas', items: [
      { name: 'Spaghetti Carbonara con Camarones', description: 'Clásica preparación de la cocina italiana de familia combinada con camarones al ajillo.', price: 97000 },
      { name: 'Sorrentinos del Cocinero', description: 'Rellenos de ricota, jamón crudo y puerro en una cremosa salsa con un toque de ajo, almendras tostadas y limón.', price: 88000 },
      { name: 'Osobuco de Tallarín Verde', description: 'Tradicional receta hogareña del Paraguay compuesta por tallarín de color con un estofado delicioso de osobuco de ternera en cocción lenta.', price: 94000 },
      { name: 'Ñoquis Boloñesa', description: 'Esponjosos ñoquis de papa con nuestro clásico ragout boloñesa cocido a baja temperatura.', price: 85000 },
    ],
  },
  {
    id: 'milas', label: 'Milas & Mari', items: [
      { name: 'Mila de Carne', description: 'Sale con guarnición de arroz kesú o ensalada.', price: 105000 },
      { name: 'Mila Napolitana', description: 'Milanesa de lomito, salsa roja, rodajas de tomate, queso fresco y orégano, sobre cama de crocantes papas fritas.', price: 118000 },
      { name: 'Mila de Surubí', description: 'Milanesa de surubí, salsa de queso Paraguay y roquefort.', price: 130000 },
      { name: 'Mila de Pollo', description: 'Sale con guarnición de arroz kesú o ensalada.', price: 99000 },
      { name: 'Marinera a Caballo', description: 'Marinera de lomito con 2 huevos y cebolla caramelizada, sobre cama de crocantes papas fritas.', price: 115000 },
    ],
  },
  {
    id: 'postres', label: 'Postres & Tortas', items: [
      { name: 'La Cookie', description: '', price: 47000, subcategoria: 'Postres' },
      { name: 'Nuestro Volcán', description: '', price: 49000, subcategoria: 'Postres' },
      { name: 'Cinnamon Roll', description: '', price: 21000, subcategoria: 'Postres' },
      { name: 'Arroz con Leche', description: '', price: 29000, subcategoria: 'Postres' },
      { name: 'Tiramisú de Chocolate', description: '', price: 45000, subcategoria: 'Postres' },
      { name: 'El Flan', description: '', price: 39000, subcategoria: 'Postres' },
      { name: 'Brownie con Helado & Salsa de Chocolate', description: '', price: 45000, subcategoria: 'Postres' },
      { name: 'Cheesecake de Frutos Rojos', description: '', price: 45000, subcategoria: 'Tortas' },
      { name: 'Pie de Limón', description: '', price: 44000, subcategoria: 'Tortas' },
      { name: 'De Chocolate', description: '', price: 44000, subcategoria: 'Tortas' },
      { name: 'Red Velvet', description: '', price: 42000, subcategoria: 'Tortas' },
      { name: 'Carrot Cake', description: '', price: 43000, subcategoria: 'Tortas' },
    ],
  },
  {
    id: 'merienda', label: 'Merienda', items: [
      { name: 'Mixtos Calientitos — Jamón y Queso', description: '', price: 28000 },
      { name: 'Mixtos — Jamón, Queso y Huevo', description: '', price: 30000 },
      { name: 'Mixtos — Queso y Huevo', description: '', price: 28000 },
      { name: 'Mixtos — Huevo', description: '', price: 26000 },
      { name: 'Croissant', description: '', price: 20000 },
      { name: 'Croissant con Jamón y Queso', description: '', price: 24000 },
      { name: 'Mbejú Tradicional', description: '', price: 31000 },
      { name: 'Mbejú Provista', description: 'Mbejú con salsa de queso, tomate confitado y rúcula.', price: 36000 },
    ],
  },
  {
    id: 'bebidas', label: 'Jugos y Mocktails', items: [
      { name: 'Naranja | Durazno', description: 'Jugo simple o frozen.', price: 26000, subcategoria: 'Jugos Simples / Frozen' },
      { name: 'Piña | Limón | Frutilla | Manzana | Zanahoria', description: 'Jugo simple o frozen.', price: 28000, subcategoria: 'Jugos Simples / Frozen' },
      { name: 'Manzana | Naranja', description: '', price: 28000, subcategoria: 'Jugos Combinados' },
      { name: 'Zanahoria | Naranja', description: '', price: 28000, subcategoria: 'Jugos Combinados' },
      { name: 'Durazno | Naranja', description: '', price: 28000, subcategoria: 'Jugos Combinados' },
      { name: 'Piña | Naranja', description: '', price: 28000, subcategoria: 'Jugos Combinados' },
      { name: 'Frutilla | Limón', description: '', price: 28000, subcategoria: 'Jugos Combinados' },
      { name: 'Tutti Frutti', description: '', price: 29000, subcategoria: 'Jugos Combinados' },
      { name: 'Fruta Fresca', description: 'Frutilla, piña, naranja y limón.', price: 29000, subcategoria: 'Jugos Especiales' },
      { name: 'Piña, Naranja y Menta', description: '', price: 29000, subcategoria: 'Jugos Especiales' },
      { name: 'Durazno, Naranja y Cedrón', description: '', price: 29000, subcategoria: 'Jugos Especiales' },
      { name: 'Pomelo, Limón y Albahaca', description: '', price: 29000, subcategoria: 'Jugos Especiales' },
      { name: 'Limonada Provista', description: 'Limón, menta y jengibre.', price: 28000, subcategoria: 'Frozen' },
      { name: 'Pomelada Provista', description: 'Pomelo natural y hielo frappé.', price: 28000, subcategoria: 'Frozen' },
      { name: 'Piña Helada', description: 'Piña, limón, menta y hielo frappé.', price: 29000, subcategoria: 'Frozen' },
      { name: 'Durazno Helado', description: 'Durazno, naranja, limón y hielo frappé.', price: 29000, subcategoria: 'Frozen' },
      { name: 'Cítrico', description: 'Cedrón, menta, limón y un toque cítrico.', price: 45000, subcategoria: 'Mocktails' },
      { name: 'Fresco', description: 'Piña, durazno, limón y soda.', price: 45000, subcategoria: 'Mocktails' },
      { name: 'Pomelo y Albahaca', description: 'Pomelo, albahaca, limón y soda.', price: 45000, subcategoria: 'Mocktails' },
      { name: 'Piña Viva', description: 'Piña, jengibre, limón y soda.', price: 45000, subcategoria: 'Mocktails' },
      { name: 'Mandarina y Cedrón', description: 'Mandarina, cedrón, limón y soda.', price: 45000, subcategoria: 'Mocktails' },
      { name: 'Rubí Fresco', description: 'Frutos rojos, naranja, limón y soda.', price: 45000, subcategoria: 'Mocktails' },
    ],
  },
  {
    id: 'cocktails', label: 'Cocktails', items: [
      { name: 'Gin Tonic Clásico', description: 'Gin y tónica, limón, pepino, naranja, romero y especias.', price: 55000, subcategoria: 'Gin' },
      { name: 'Pineapple Gin', description: 'Gin, piña, macerado en almíbar de torrontés y cardamomo con tónica.', price: 55000, subcategoria: 'Gin' },
      { name: 'Tangerine Gin', description: 'Gin, cordial de mandarina, tónica, albahaca.', price: 55000, subcategoria: 'Gin' },
      { name: 'Huerta', description: 'Gin, pepino, cedrón, limón y tónica.', price: 55000, subcategoria: 'Gin' },
      { name: 'Tónica Rosa', description: 'Gin, tónica, pomelo y pimienta rosa.', price: 55000, subcategoria: 'Gin' },
      { name: 'Mariscal Spritz', description: 'Aperol, Chardonnay, almíbar de mburucuyá, cordial de limón y flores.', price: 55000, subcategoria: 'Los Spritz' },
      { name: 'Sanber Spritz', description: 'Aperol, vodka, cordial de naranja y canela, zumo de naranja, dash de soda.', price: 55000, subcategoria: 'Los Spritz' },
      { name: 'Aperol Spritz', description: 'Aperol, espumante, soda.', price: 55000, subcategoria: 'Los Spritz' },
      { name: 'Rubí Spritz', description: 'Aperitivo, frutos rojos, espumante, soda y limón.', price: 55000, subcategoria: 'Los Spritz' },
      { name: 'Maracuyá Spritz', description: 'Aperitivo, maracuyá, vino blanco o espumante, soda, naranja y albahaca.', price: 55000, subcategoria: 'Los Spritz' },
      { name: 'Poniente', description: 'Ron, pulpa de piña, jugo de naranja, canela en rama, naranja deshidratada, azúcar rubia y perfume de almendras.', price: 55000, subcategoria: 'Clásicos' },
      { name: 'La Provi', description: 'Vodka, limón, frutos rojos y almíbar de cardamomo.', price: 55000, subcategoria: 'Clásicos' },
      { name: 'Doña Juana', description: 'Ron, Campari, maracuyá, pomelo, limón y miel.', price: 55000, subcategoria: 'Clásicos' },
      { name: 'Pisco Pasión', description: 'Pisco, jugo de limón, cordial de mburucuyá y dash de Angostura.', price: 55000, subcategoria: 'Clásicos' },
      { name: 'Caipiriña Clásica', description: '', price: 45000, subcategoria: 'Clásicos' },
      { name: 'Caipi Provi', description: 'Mburucuyá o frutos rojos.', price: 48000, subcategoria: 'Clásicos' },
      { name: 'Negroni', description: 'Gin, Campari y vermouth rosso.', price: 48000, subcategoria: 'Clásicos' },
      { name: 'Mojito', description: 'Ron blanco, limón, menta, azúcar y soda.', price: 48000, subcategoria: 'Clásicos' },
      { name: 'Piña Colada', description: 'Ron, piña y crema de coco.', price: 50000, subcategoria: 'Clásicos' },
      { name: 'Fernet con Cola', description: '', price: 38000, subcategoria: 'Clásicos' },
      { name: 'Pisco Sour', description: 'Pisco, limón, almíbar y clara de huevos.', price: 55000, subcategoria: 'Clásicos' },
      { name: 'Vermut Clásico', description: 'Vermut y soda.', price: 50000, subcategoria: 'Vermut' },
      { name: 'Vermut Orange', description: 'Vermut y jugo de naranja.', price: 55000, subcategoria: 'Vermut' },
      { name: 'Vermut Rosado', description: 'Vermut blanco, vermut rosso, pomelo y cordial cítrico.', price: 55000, subcategoria: 'Vermut' },
      { name: 'Vermut Blanco', description: 'Vermut blanco, limón y Sprite Zero.', price: 55000, subcategoria: 'Vermut' },
      { name: 'Limoncello Villa Masa', description: 'Raya.', price: 20000, subcategoria: 'Digestivo' },
    ],
  },
  {
    id: 'cervezas', label: 'Cervezas', items: [
      { name: 'Stella Artois', description: '', price: 24000 },
      { name: 'Stella Chopp', description: '', price: 24000 },
      { name: 'Heineken', description: '', price: 24000 },
      { name: 'Heineken Silver', description: '', price: 24000 },
      { name: 'Heineken Chopp', description: '', price: 24000 },
      { name: 'Munich Tradicional', description: '', price: 18000 },
      { name: 'Munich Ultra', description: '', price: 22000 },
      { name: 'Munich Ultra Chopp', description: '', price: 22000 },
      { name: 'Peroni 0.0', description: '', price: 29000 },
      { name: 'Miller 365', description: '', price: 20000 },
    ],
  },
  {
    id: 'cafeteria', label: 'Cafetería', items: [
      { name: 'Espresso', description: '', price: 14000, subcategoria: 'Calientes' },
      { name: 'Americano', description: '', price: 16000, subcategoria: 'Calientes' },
      { name: 'Cortado', description: '', price: 17000, subcategoria: 'Calientes' },
      { name: 'Flat White', description: '', price: 20000, subcategoria: 'Calientes' },
      { name: 'Espresso Doble', description: '', price: 18000, subcategoria: 'Calientes' },
      { name: 'Cappuccino', description: '', price: 20000, subcategoria: 'Calientes' },
      { name: 'Mocha Provista', description: '', price: 26000, subcategoria: 'Calientes' },
      { name: 'Bombón Macchiato', description: '', price: 26000, subcategoria: 'Calientes' },
      { name: 'Submarino', description: '', price: 16000, subcategoria: 'Calientes' },
      { name: 'Affogato', description: '', price: 18000, subcategoria: 'Fríos' },
      { name: 'Chocolatada', description: '', price: 18000, subcategoria: 'Fríos' },
      { name: 'Iced Coffee', description: '', price: 20000, subcategoria: 'Fríos' },
      { name: 'Rose Coffee', description: '', price: 22000, subcategoria: 'Fríos' },
      { name: 'Frappuccino', description: '', price: 24000, subcategoria: 'Fríos' },
      { name: 'Barraquito', description: '', price: 45000, subcategoria: 'Tragos' },
      { name: 'Martini Espresso', description: '', price: 50000, subcategoria: 'Tragos' },
      { name: 'Irish Coffee', description: '', price: 50000, subcategoria: 'Tragos' },
    ],
  },
  {
    id: 'vinos', label: 'Bodeguita', items: [
      { name: 'La Mascota Malbec (copa)', description: 'Por copa.', price: 45000, subcategoria: 'Tintos' },
      { name: 'D.V. Catena Cabernet/Cabernet', description: '', price: 480000, subcategoria: 'Tintos' },
      { name: 'D.V. Catena Malbec', description: '', price: 320000, subcategoria: 'Tintos' },
      { name: 'Errazuriz Aconcagua Alto Carmenere', description: '', price: 330000, subcategoria: 'Tintos' },
      { name: 'D.V. Catena Cabernet Malbec', description: '', price: 290000, subcategoria: 'Tintos' },
      { name: 'Gran Mascota Malbec', description: '', price: 290000, subcategoria: 'Tintos' },
      { name: 'Mascota Unánime Blend', description: '', price: 360000, subcategoria: 'Tintos' },
      { name: 'Luis Felipe Edwards Gran Reserva Carmenere', description: '', price: 240000, subcategoria: 'Tintos' },
      { name: 'La Mascota Malbec', description: '', price: 220000, subcategoria: 'Tintos' },
      { name: 'Luigi Bosca Malbec', description: '', price: 190000, subcategoria: 'Tintos' },
      { name: 'Los Intocables Malbec', description: '', price: 180000, subcategoria: 'Tintos' },
      { name: 'Memoro Piccini', description: '', price: 180000, subcategoria: 'Tintos' },
      { name: 'Trapiche Rva Malbec', description: '', price: 140000, subcategoria: 'Tintos' },
      { name: 'La Mascota Chardonnay (copa)', description: 'Por copa.', price: 45000, subcategoria: 'Blancos' },
      { name: 'Angélica Zapata Alta Chardonnay', description: '', price: 460000, subcategoria: 'Blancos' },
      { name: 'Aconcagua Costa Sauvignon Blanc', description: '', price: 320000, subcategoria: 'Blancos' },
      { name: 'D.V. Catena Chardonnay', description: '', price: 290000, subcategoria: 'Blancos' },
      { name: 'Matua Sauvignon Blanc', description: '', price: 280000, subcategoria: 'Blancos' },
      { name: 'Rutini Chardonnay', description: '', price: 280000, subcategoria: 'Blancos' },
      { name: 'Luis Felipe Edwards Gran Reserva Sauvignon Blanc', description: '', price: 190000, subcategoria: 'Blancos' },
      { name: 'La Mascota Chardonnay', description: '', price: 240000, subcategoria: 'Blancos' },
      { name: 'Luigi Bosca Sauvignon Blanc', description: '', price: 190000, subcategoria: 'Blancos' },
      { name: 'Errazuriz Reserva Chardonnay', description: '', price: 140000, subcategoria: 'Blancos' },
      { name: 'La Mascota Rosé', description: '', price: 200000, subcategoria: 'Rosados' },
      { name: 'Adobe Rosé', description: '', price: 100000, subcategoria: 'Rosados' },
      { name: 'Pommery Blanc De Blancs', description: '', price: 1500000, subcategoria: 'Champagne' },
      { name: 'Pommery Blue Sky', description: '', price: 990000, subcategoria: 'Champagne' },
      { name: 'Pommery Brut Royal', description: '', price: 800000, subcategoria: 'Champagne' },
      { name: 'La Mascota Sparkling (copa)', description: 'Por copa.', price: 40000, subcategoria: 'Espumantes' },
      { name: 'Piccini Prosecco Extra Dry', description: '', price: 240000, subcategoria: 'Espumantes' },
      { name: 'La Mascota Sparkling', description: '', price: 210000, subcategoria: 'Espumantes' },
      { name: 'Navarro Correas Extra Brut', description: '', price: 190000, subcategoria: 'Espumantes' },
      { name: 'Cava Vilarnau Brut Reserva', description: '', price: 180000, subcategoria: 'Espumantes' },
    ],
  },
  {
    id: 'whisky', label: 'Whisky', items: [
      { name: 'Johnnie Walker Black Label', description: '', price: 370000, precioRaya: 40000 },
      { name: 'Johnnie Walker Double Black', description: '', price: 420000, precioRaya: 45000 },
      { name: 'Johnnie Walker Gold Reserve', description: '', price: 700000, precioRaya: 50000 },
      { name: 'Johnnie Walker Blue Label', description: '', price: 2100000, precioRaya: 200000 },
    ],
  },
]

// ── Crear DB ─────────────────────────────────────────────────────────────────

async function createDatabase() {
  console.log('Creando base de datos en Notion...')

  const allCategories = categories.map(c => ({ name: c.label }))
  const allSubcategories = [...new Set(
    categories.flatMap(c => c.items.map(i => i.subcategoria).filter(Boolean))
  )].map(s => ({ name: s }))

  const db = await notionFetch('/databases', 'POST', {
    parent: { type: 'page_id', page_id: PAGE_ID },
    title: [{ type: 'text', text: { content: 'Menú La Provista' } }],
    properties: {
      'Nombre':       { title: {} },
      'Categoria':    { select: { options: allCategories } },
      'Subcategoria': { select: { options: allSubcategories } },
      'Descripcion':  { rich_text: {} },
      'Precio':       { number: { format: 'number' } },
      'PrecioRaya':   { number: { format: 'number' } },
      'Orden':        { number: { format: 'number' } },
      'Activo':       { checkbox: {} },
    },
  })

  console.log(`✅ Base de datos creada: ${db.id}`)
  return db.id
}

// ── Cargar items ──────────────────────────────────────────────────────────────

async function seedItems(dbId) {
  let orden = 1
  let total = 0

  for (const cat of categories) {
    console.log(`\nCargando "${cat.label}"...`)
    for (const item of cat.items) {
      const props = {
        'Nombre':      { title: [{ text: { content: item.name } }] },
        'Categoria':   { select: { name: cat.label } },
        'Descripcion': { rich_text: item.description ? [{ text: { content: item.description } }] : [] },
        'Precio':      { number: item.price },
        'Orden':       { number: orden++ },
        'Activo':      { checkbox: true },
      }
      if (item.subcategoria) props['Subcategoria'] = { select: { name: item.subcategoria } }
      if (item.precioRaya)   props['PrecioRaya']   = { number: item.precioRaya }

      await notionFetch('/pages', 'POST', {
        parent: { database_id: dbId },
        properties: props,
      })
      process.stdout.write('.')
      total++
    }
  }

  console.log(`\n\n✅ ${total} platos cargados exitosamente.`)
}

async function main() {
  try {
    const dbId = await createDatabase()
    await seedItems(dbId)
    console.log(`\n🎉 Listo!`)
    console.log(`Guardá este ID: NOTION_DATABASE_ID=${dbId}`)
  } catch (err) {
    console.error('\nError:', err.message)
    process.exit(1)
  }
}

main()
