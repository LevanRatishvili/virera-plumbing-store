import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, "..", "data");
mkdirSync(dataDir, { recursive: true });

export const db = new DatabaseSync(join(dataDir, "store.sqlite"));
db.exec("PRAGMA foreign_keys = ON");

export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT NOT NULL,
      imageUrl TEXT
    );
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sku TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      brand TEXT NOT NULL,
      categoryId INTEGER NOT NULL,
      description TEXT NOT NULL,
      price REAL NOT NULL,
      oldPrice REAL,
      rating REAL NOT NULL DEFAULT 4.7,
      reviews INTEGER NOT NULL DEFAULT 0,
      stock INTEGER NOT NULL DEFAULT 0,
      imageUrl TEXT,
      gallery TEXT,
      variants TEXT,
      specs TEXT,
      tags TEXT,
      isNew INTEGER NOT NULL DEFAULT 0,
      isBestSeller INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (categoryId) REFERENCES categories(id)
    );
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customerName TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT,
      address TEXT NOT NULL,
      deliveryMethod TEXT NOT NULL,
      paymentMethod TEXT NOT NULL,
      items TEXT NOT NULL,
      subtotal REAL NOT NULL,
      deliveryFee REAL NOT NULL,
      total REAL NOT NULL,
      status TEXT NOT NULL DEFAULT 'new',
      createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT,
      createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT,
      email TEXT,
      message TEXT NOT NULL,
      createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS operator_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT,
      email TEXT,
      topic TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'new',
      createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS chat_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sessionId TEXT NOT NULL,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      needsOperator INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
  migrateProductsTable();

  const count = db.prepare("SELECT COUNT(*) AS count FROM categories").get().count;
  if (count === 0) seed();
  localizeStoreData();
  ensurePresentationProducts();
}

function migrateProductsTable() {
  const columns = db.prepare("PRAGMA table_info(products)").all().map((column) => column.name);
  const addColumn = (name, sql) => { if (!columns.includes(name)) db.exec(sql); };
  addColumn("status", "ALTER TABLE products ADD COLUMN status TEXT NOT NULL DEFAULT 'active'");
  addColumn("createdAt", "ALTER TABLE products ADD COLUMN createdAt TEXT NOT NULL DEFAULT ''");
  addColumn("updatedAt", "ALTER TABLE products ADD COLUMN updatedAt TEXT NOT NULL DEFAULT ''");
  db.exec("UPDATE products SET createdAt = CURRENT_TIMESTAMP WHERE createdAt = ''");
  db.exec("UPDATE products SET updatedAt = CURRENT_TIMESTAMP WHERE updatedAt = ''");
  const orderColumns = db.prepare("PRAGMA table_info(orders)").all().map((column) => column.name);
  if (!orderColumns.includes("comment")) db.exec("ALTER TABLE orders ADD COLUMN comment TEXT NOT NULL DEFAULT ''");
}

function seed() {
  const categories = [
    ["Faucets and mixers", "faucets-mixers", "Premium bathroom and kitchen faucets, mixers and thermostatic controls.", "/assets/plumb-lifestyle.png"],
    ["Showers", "showers", "Rain showers, shower sets, concealed systems and accessories.", "/assets/plumb-hero.png"],
    ["Toilets", "toilets", "Wall-hung, floor-standing toilets, cisterns and bidet solutions.", "/assets/plumb-hero.png"],
    ["Sinks", "sinks", "Bathroom basins, kitchen sinks and premium mounting accessories.", "/assets/plumb-lifestyle.png"],
    ["Bathtubs", "bathtubs", "Freestanding and built-in bathtubs with modern silhouettes.", "/assets/plumb-hero.png"],
    ["Bathroom furniture", "bathroom-furniture", "Vanities, mirrors, storage and modular bathroom furniture.", "/assets/plumb-lifestyle.png"],
    ["Pipes and fittings", "pipes-fittings", "PPR, multilayer, copper pipes, elbows, tees and couplings.", "/assets/plumb-supplies.png"],
    ["Valves", "valves", "Ball valves, check valves, pressure reducers and manifolds.", "/assets/plumb-supplies.png"],
    ["Water heaters", "water-heaters", "Electric and gas water heaters for apartments and houses.", "/assets/plumb-lifestyle.png"],
    ["Pumps", "pumps", "Circulation, drainage, booster and submersible pumps.", "/assets/plumb-supplies.png"],
    ["Heating systems", "heating-systems", "Radiators, underfloor heating, manifolds and controls.", "/assets/plumb-supplies.png"],
    ["Drainage systems", "drainage-systems", "Traps, drains, linear drains, siphons and sewer components.", "/assets/plumb-supplies.png"],
    ["Installation accessories", "installation-accessories", "Sealants, tapes, mounting kits and consumables.", "/assets/plumb-supplies.png"],
    ["Sets", "sets", "Ready product sets for coordinated bathroom and installation choices.", "/assets/categories/sets.png"],
    ["Tools", "tools", "Professional tools for installers and renovation teams.", "/assets/plumb-supplies.png"]
  ];
  const insertCategory = db.prepare("INSERT INTO categories (title, slug, description, imageUrl) VALUES (?, ?, ?, ?)");
  categories.forEach((item) => insertCategory.run(...item));

  const categoryBySlug = Object.fromEntries(db.prepare("SELECT id, slug FROM categories").all().map((c) => [c.slug, c.id]));
  const products = [
    ["AQ-MIX-100", "Aurelia brushed steel basin mixer", "Grohe", "faucets-mixers", "Single lever premium basin mixer with ceramic cartridge and water-saving aerator.", 289, 349, 4.9, 128, 34, "/assets/plumb-lifestyle.png", ["Brushed Steel", "Matte Black"], { material: "Brass", warranty: "5 years", connection: "G 3/8", flow: "5.7 L/min" }, ["best seller", "water saving"], 0, 1],
    ["AQ-SHW-220", "RainLux thermostatic shower system", "Hansgrohe", "showers", "Thermostatic rain shower column with hand shower, anti-scald safety and easy-clean nozzles.", 749, 899, 4.8, 92, 18, "/assets/plumb-hero.png", ["Chrome", "Black"], { head: "260 mm", pressure: "1.5-6 bar", warranty: "5 years" }, ["premium", "thermostatic"], 1, 1],
    ["AQ-WC-310", "Nordic rimless wall-hung toilet", "Villeroy", "toilets", "Rimless ceramic wall-hung toilet with soft-close seat and concealed installation compatibility.", 529, 619, 4.7, 64, 22, "/assets/plumb-hero.png", ["White"], { type: "Wall-hung", seat: "Soft-close", warranty: "10 years" }, ["rimless", "soft close"], 0, 1],
    ["AQ-SNK-140", "StoneLine countertop basin", "Duravit", "sinks", "Minimal countertop basin with thin rim design and premium ceramic finish.", 319, null, 4.8, 55, 15, "/assets/plumb-lifestyle.png", ["White", "Sand"], { size: "60 cm", material: "Ceramic", install: "Countertop" }, ["new", "premium"], 1, 0],
    ["AQ-BTH-720", "Luna freestanding bathtub", "Roca", "bathtubs", "Elegant acrylic freestanding bathtub for premium bathrooms.", 1890, 2190, 4.9, 31, 7, "/assets/plumb-hero.png", ["White"], { length: "170 cm", material: "Acrylic", drain: "Included" }, ["luxury"], 1, 0],
    ["AQ-VAN-520", "Milan floating vanity set", "Ideal Standard", "bathroom-furniture", "Wall-mounted vanity with ceramic basin, drawers and LED mirror option.", 980, 1160, 4.6, 48, 11, "/assets/plumb-lifestyle.png", ["Oak", "Graphite"], { width: "80 cm", drawers: "2", mirror: "Optional" }, ["storage"], 0, 1],
    ["AQ-PPR-025", "PPR pipe 25mm reinforced", "Aquatherm", "pipes-fittings", "Reinforced PPR pipe for hot and cold water supply systems.", 4.8, null, 4.7, 210, 680, "/assets/plumb-supplies.png", ["25mm", "32mm"], { diameter: "25 mm", temperature: "95 C", length: "4 m" }, ["installation"], 0, 1],
    ["AQ-FIT-090", "Brass elbow fitting set", "Bugatti", "pipes-fittings", "Durable brass elbow fittings for reliable installation connections.", 18, 24, 4.8, 144, 240, "/assets/plumb-supplies.png", ["1/2 inch", "3/4 inch"], { material: "Brass", thread: "Female", pack: "2 pcs" }, ["fittings"], 0, 1],
    ["AQ-VLV-500", "Smart pressure reducing valve", "Caleffi", "valves", "Pressure reducer with gauge for apartment water supply protection.", 129, 149, 4.9, 76, 46, "/assets/plumb-supplies.png", ["1/2 inch", "3/4 inch"], { pressure: "1-6 bar", gauge: "Included", material: "Brass" }, ["pro"], 1, 1],
    ["AQ-WH-080", "EcoHeat 80L electric water heater", "Ariston", "water-heaters", "Efficient wall-mounted electric water heater with fast heating mode.", 459, 529, 4.7, 88, 19, "/assets/plumb-lifestyle.png", ["80L", "100L"], { capacity: "80 L", power: "1.8 kW", warranty: "3 years" }, ["energy saving"], 0, 1],
    ["AQ-PMP-120", "SilentFlow circulation pump", "Grundfos", "pumps", "Quiet high-efficiency circulation pump for heating and hot water systems.", 389, 450, 4.9, 61, 14, "/assets/plumb-supplies.png", ["25-40", "25-60"], { power: "45 W", mode: "Auto", warranty: "5 years" }, ["quiet", "pro"], 1, 0],
    ["AQ-HTR-650", "AluPro designer radiator", "Kermi", "heating-systems", "Slim designer radiator with high heat output and premium finish.", 640, 720, 4.6, 39, 12, "/assets/plumb-supplies.png", ["White", "Anthracite"], { height: "1800 mm", connection: "Bottom", warranty: "5 years" }, ["heating"], 0, 0],
    ["AQ-DRN-330", "Linear shower drain stainless", "Viega", "drainage-systems", "Premium stainless linear drain for walk-in showers.", 229, 269, 4.8, 83, 28, "/assets/plumb-supplies.png", ["60 cm", "80 cm", "100 cm"], { material: "Stainless steel", outlet: "50 mm", trap: "Included" }, ["walk-in"], 1, 1],
    ["AQ-ACC-011", "Professional sealing kit", "Soudal", "installation-accessories", "Complete sealing and waterproofing kit for bathrooms and kitchens.", 36, null, 4.5, 120, 95, "/assets/plumb-supplies.png", ["White", "Transparent"], { pack: "Sealant + tape", use: "Wet areas" }, ["accessory"], 0, 0],
    ["AQ-TOL-700", "Installer press tool compact", "Rems", "tools", "Compact professional press tool for pipe fitting installation.", 1490, 1690, 4.9, 22, 5, "/assets/plumb-supplies.png", ["Kit"], { battery: "18V", jaws: "Included", warranty: "2 years" }, ["professional"], 0, 0]
  ];
  const insertProduct = db.prepare(`
    INSERT INTO products (sku, title, brand, categoryId, description, price, oldPrice, rating, reviews, stock, imageUrl, gallery, variants, specs, tags, isNew, isBestSeller)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  products.forEach(([sku, title, brand, slug, description, price, oldPrice, rating, reviews, stock, imageUrl, variants, specs, tags, isNew, isBestSeller]) => {
    insertProduct.run(sku, title, brand, categoryBySlug[slug], description, price, oldPrice, rating, reviews, stock, imageUrl, JSON.stringify([imageUrl, "/assets/plumb-hero.png", "/assets/plumb-supplies.png"]), JSON.stringify(variants), JSON.stringify(specs), JSON.stringify(tags), isNew, isBestSeller);
  });
}

function localizeStoreData() {
  const categoryImages = {
    "bathtubs": "/assets/categories/bathtubs.png",
    "bathroom-furniture": "/assets/categories/bathroom-furniture.png",
    "heating-systems": "/assets/categories/heating-systems.png",
    "drainage-systems": "/assets/categories/drainage-systems.png",
    "valves": "/assets/categories/valves.png",
    "sets": "/assets/categories/sets.png",
    "pipes-fittings": "/assets/categories/pipes-fittings.png",
    "sinks": "/assets/categories/sinks.png",
    "faucets-mixers": "/assets/categories/faucets-mixers.png",
    "installation-accessories": "/assets/categories/installation-accessories.png",
    "pumps": "/assets/categories/pumps.png",
    "toilets": "/assets/categories/toilets.png",
    "showers": "/assets/categories/showers.png",
    "water-heaters": "/assets/categories/water-heaters.png",
    "tools": "/assets/categories/tools.png"
  };
  const categories = [
    ["faucets-mixers", "ონკანები და მიქსერები", "პრემიუმ აბაზანისა და სამზარეულოს ონკანები, მიქსერები და თერმოსტატული მართვა."],
    ["showers", "შხაპის სისტემები", "წვიმის შხაპები, შხაპის კომპლექტები, ჩამალული სისტემები და აქსესუარები."],
    ["toilets", "უნიტაზები", "კედელზე საკიდი და იატაკზე დასადგამი უნიტაზები, ავზები და ბიდეს გადაწყვეტილებები."],
    ["sinks", "ნიჟარები", "აბაზანის ხელსაბანები, სამზარეულოს ნიჟარები და სამონტაჟო აქსესუარები."],
    ["bathtubs", "აბაზანები", "თავისუფლად მდგომი და ჩასაშენებელი აბაზანები თანამედროვე ფორმებით."],
    ["bathroom-furniture", "აბაზანის ავეჯი", "ტუმბოები, სარკეები, შესანახი მოდულები და აბაზანის ავეჯი."],
    ["pipes-fittings", "მილები და ფიტინგები", "PPR, მრავალშრიანი და სპილენძის მილები, მუხლები, სამკაპები და გადამყვანები."],
    ["valves", "ვენტილები", "ბურთულიანი ვენტილები, უკუსარქველები, წნევის რედუქტორები და კოლექტორები."],
    ["water-heaters", "წყლის გამაცხელებლები", "ელექტრო და გაზის წყლის გამაცხელებლები ბინებისა და სახლებისთვის."],
    ["pumps", "ტუმბოები", "ცირკულაციის, დრენაჟის, წნევის ამწევი და წყალქვეშა ტუმბოები."],
    ["heating-systems", "გათბობის სისტემები", "რადიატორები, იატაკქვეშა გათბობა, კოლექტორები და მართვის სისტემები."],
    ["drainage-systems", "დრენაჟის სისტემები", "ტრაპები, ხაზოვანი დრენაჟები, სიფონები და კანალიზაციის კომპონენტები."],
    ["installation-accessories", "სამონტაჟო აქსესუარები", "სილიკონები, ლენტები, სამაგრი კომპლექტები და სახარჯი მასალები."],
    ["tools", "ხელსაწყოები", "პროფესიონალური ხელსაწყოები მემონტაჟეებისა და სარემონტო ჯგუფებისთვის."]
  ];
  normalizeSetsCategory();
  const updateCategory = db.prepare("UPDATE categories SET title = ?, description = ?, imageUrl = ? WHERE slug = ?");
  categories.forEach(([slug, title, description]) => updateCategory.run(title, description, categoryImages[slug] || "/assets/plumb-supplies.png", slug));
  db.prepare(`
    INSERT INTO categories (title, slug, description, imageUrl)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(slug) DO UPDATE SET
      title = excluded.title,
      description = excluded.description,
      imageUrl = excluded.imageUrl
  `).run(
    "\u10d9\u10dd\u10db\u10de\u10da\u10d4\u10e5\u10e2\u10d4\u10d1\u10d8",
    "sets",
    "\u10db\u10d6\u10d0 \u10d9\u10dd\u10db\u10de\u10da\u10d4\u10e5\u10e2\u10d4\u10d1\u10d8 \u10d0\u10d1\u10d0\u10d6\u10d0\u10dc\u10d8\u10e1, \u10e8\u10ee\u10d0\u10de\u10d8\u10e1\u10d0 \u10d3\u10d0 \u10db\u10dd\u10dc\u10e2\u10d0\u10df\u10d8\u10e1 \u10d7\u10d0\u10dc\u10db\u10d8\u10db\u10d3\u10d4\u10d5\u10e0\u10e3\u10da\u10d8 \u10d0\u10e0\u10e9\u10d4\u10d5\u10d8\u10e1\u10d7\u10d5\u10d8\u10e1.",
    categoryImages.sets
  );

  const products = [
    ["AQ-MIX-100", "Aurelia ფოლადის პრემიუმ ხელსაბანის მიქსერი", "დახვეწილი ერთბერკეტიანი მიქსერი თანამედროვე აბაზანისთვის, რბილი მოძრაობით და წყლის დამზოგავი აერატორით.", ["დავარცხნილი ფოლადი", "მქრქალი შავი"], { მასალა: "ლატუნი", დასრულება: "დავარცხნილი ფოლადი", შეერთება: "G 3/8", ხარჯი: "5.7 ლ/წთ" }],
    ["AQ-SHW-220", "RainLux თერმოსტატული წვიმის შხაპი", "პრემიუმ წვიმის შხაპის სისტემა სტაბილური ტემპერატურით, ხელის შხაპით და მარტივად საწმენდი საქშენებით.", ["ქრომი", "შავი"], { თავი: "260 მმ", წნევა: "1.5-6 ბარი", რეჟიმი: "თერმოსტატული" }],
    ["AQ-WC-310", "Nordic უკიდე კედლის უნიტაზი", "კედელზე საკიდი უკიდე უნიტაზი რბილად დახურვადი დასაჯდომით, მინიმალისტური აბაზანისთვის.", ["თეთრი"], { ტიპი: "კედელზე საკიდი", დასაჯდომი: "რბილი დახურვა", მონტაჟი: "ჩამალული სისტემა" }],
    ["AQ-SNK-140", "StoneLine ზედაპირზე დასადგამი ხელსაბანი", "მინიმალისტური ზედაპირზე დასადგამი ხელსაბანი თხელი კიდით და პრემიუმ კერამიკული დასრულებით.", ["თეთრი", "ქვიშისფერი"], { ზომა: "60 სმ", მასალა: "კერამიკა", მონტაჟი: "ზედაპირზე დასადგამი" }],
    ["AQ-BTH-720", "Luna თავისუფლად მდგომი აბაზანა", "ელეგანტური აკრილის თავისუფლად მდგომი აბაზანა პრემიუმ ინტერიერისთვის.", ["თეთრი"], { სიგრძე: "170 სმ", მასალა: "აკრილი", გადაღვრა: "შედის კომპლექტში" }],
    ["AQ-VAN-520", "Milan საკიდი აბაზანის ავეჯის კომპლექტი", "კედელზე საკიდი ავეჯი კერამიკული ხელსაბანით, დახვეწილი უჯრებით და LED სარკის ოფციით.", ["მუხა", "გრაფიტი"], { სიგანე: "80 სმ", უჯრები: "2", სარკე: "არჩევით" }],
    ["AQ-PPR-025", "PPR არმირებული მილი 25მმ", "არმირებული PPR მილი ცხელი და ცივი წყლის სისტემებისთვის.", ["25მმ", "32მმ"], { დიამეტრი: "25 მმ", ტემპერატურა: "95 C", სიგრძე: "4 მ" }],
    ["AQ-FIT-090", "ლატუნის მუხლის ფიტინგების ნაკრები", "გამძლე ლატუნის მუხლები საიმედო სამონტაჟო შეერთებებისთვის.", ["1/2 დუიმი", "3/4 დუიმი"], { მასალა: "ლატუნი", ხრახნი: "შიდა", შეფუთვა: "2 ცალი" }],
    ["AQ-VLV-500", "ჭკვიანი წნევის რედუქტორი", "წნევის რედუქტორი მანომეტრით ბინის წყალმომარაგების დასაცავად.", ["1/2 დუიმი", "3/4 დუიმი"], { წნევა: "1-6 ბარი", მანომეტრი: "შედის", მასალა: "ლატუნი" }],
    ["AQ-WH-080", "EcoHeat 80ლ ელექტრო წყლის გამაცხელებელი", "კედელზე დასამაგრებელი ეკონომიური წყლის გამაცხელებელი სწრაფი გათბობით და სუფთა ვიზუალით.", ["80ლ", "100ლ"], { მოცულობა: "80 ლ", სიმძლავრე: "1.8 კვტ", მონტაჟი: "კედელზე" }],
    ["AQ-PMP-120", "SilentFlow ჩუმი ცირკულაციის ტუმბო", "ენერგოეფექტური ტუმბო გათბობისა და ცხელი წყლის სისტემებისთვის, ჩუმი მუშაობით.", ["25-40", "25-60"], { სიმძლავრე: "45 W", რეჟიმი: "ავტომატური", გამოყენება: "გათბობა/ცხელი წყალი" }],
    ["AQ-HTR-650", "AluPro ვერტიკალური დიზაინერული რადიატორი", "თხელი ვერტიკალური რადიატორი მაღალი თბოგაცემით და პრემიუმ დასრულებით.", ["თეთრი", "ანტრაციტი"], { სიმაღლე: "1800 მმ", შეერთება: "ქვედა", დასრულება: "მქრქალი" }],
    ["AQ-DRN-330", "უჟანგავი ხაზოვანი შხაპის ტრაპი", "პრემიუმ უჟანგავი ხაზოვანი ტრაპი walk-in შხაპებისთვის.", ["60 სმ", "80 სმ", "100 სმ"], { მასალა: "უჟანგავი ფოლადი", გამოსავალი: "50 მმ", სიფონი: "შედის" }],
    ["AQ-ACC-011", "პროფესიონალური ჰერმეტიზაციის ნაკრები", "სრული ჰერმეტიზაციისა და ჰიდროიზოლაციის ნაკრები აბაზანისა და სამზარეულოსთვის.", ["თეთრი", "გამჭვირვალე"], { შეფუთვა: "სილიკონი + ლენტი", გამოყენება: "სველი ზონები" }],
    ["AQ-TOL-700", "კომპაქტური პროფესიონალური პრეს-ხელსაწყო", "მემონტაჟისთვის განკუთვნილი კომპაქტური პრეს-ხელსაწყო მილებისა და ფიტინგების სწრაფი მონტაჟისთვის.", ["კომპლექტი"], { ელემენტი: "18V", თავაკები: "შედის", გამოყენება: "ფიტინგების მონტაჟი" }]
  ];
  const updateProduct = db.prepare("UPDATE products SET title = ?, description = ?, variants = ?, specs = ? WHERE sku = ?");
  products.forEach(([sku, title, description, variants, specs]) => updateProduct.run(title, description, JSON.stringify(variants), JSON.stringify(specs), sku));
}

function normalizeSetsCategory() {
  const badSets = db.prepare("SELECT id FROM categories WHERE title = ? AND slug <> ?").get("\u10d9\u10dd\u10db\u10de\u10da\u10d4\u10e5\u10e2\u10d4\u10d1\u10d8", "sets");
  const goodSets = db.prepare("SELECT id FROM categories WHERE slug = ?").get("sets");
  if (badSets && !goodSets) db.prepare("UPDATE categories SET slug = ? WHERE id = ?").run("sets", badSets.id);
  if (badSets && goodSets) {
    db.prepare("UPDATE products SET categoryId = ? WHERE categoryId = ?").run(goodSets.id, badSets.id);
    db.prepare("DELETE FROM categories WHERE id = ?").run(badSets.id);
  }
}

function ensurePresentationProducts() {
  const catalog = {
    "bathtubs": { prefix: "BTH", brand: "Roca", base: 980, items: ["თავისუფლად მდგომი აბაზანა", "ჩასაშენებელი აკრილის აბაზანა", "კუთხის აბაზანა", "ოვალური პრემიუმ აბაზანა"] },
    "bathroom-furniture": { prefix: "FUR", brand: "Ideal Standard", base: 520, items: ["კედლის ტუმბო სარკით", "ორუჯრიანი ავეჯის ნაკრები", "LED სარკის კომპლექტი", "მუხის ტექსტურის თარო"] },
    "heating-systems": { prefix: "HEA", brand: "Kermi", base: 180, items: ["დიზაინერული რადიატორი", "იატაკქვეშა გათბობის კოლექტორი", "თერმოსტატის ნაკრები", "პანელური რადიატორი"] },
    "drainage-systems": { prefix: "DRN", brand: "Viega", base: 45, items: ["ხაზოვანი ტრაპი", "სიფონის ნაკრები", "დრენაჟის არხი", "იატაკის ტრაპი"] },
    "valves": { prefix: "VLV", brand: "Caleffi", base: 18, items: ["ბურთულიანი ვენტილი", "წნევის რედუქტორი", "უკუსარქველი", "კოლექტორის ვენტილი"] },
    "sets": { prefix: "SET", brand: "VirEra", base: 240, items: ["აბაზანის სრული კომპლექტი", "შხაპის მონტაჟის ნაკრები", "სამზარეულოს წყლის კომპლექტი", "ეკონომიური განახლების პაკეტი"] },
    "pipes-fittings": { prefix: "PIP", brand: "Aquatherm", base: 9, items: ["PPR მილის შეკვრა", "ლატუნის ფიტინგების ნაკრები", "მუხლის და სამკაპის კომპლექტი", "მრავალშრიანი მილის რულონი"] },
    "sinks": { prefix: "SNK", brand: "Duravit", base: 160, items: ["ზედაპირზე დასადგამი ნიჟარა", "სამზარეულოს გრანიტის ნიჟარა", "ჩასაშენებელი ხელსაბანი", "ორმაგი სამზარეულოს ნიჟარა"] },
    "faucets-mixers": { prefix: "MIX", brand: "Grohe", base: 120, items: ["ხელსაბანის მიქსერი", "სამზარეულოს ონკანი", "შხაპის მიქსერი", "თერმოსტატული მიქსერი"] },
    "installation-accessories": { prefix: "ACC", brand: "Soudal", base: 8, items: ["ჰერმეტიკის ნაკრები", "სამაგრების კომპლექტი", "ტეფლონის ლენტი", "მონტაჟის სწრაფი პაკეტი"] },
    "pumps": { prefix: "PMP", brand: "Grundfos", base: 220, items: ["ცირკულაციის ტუმბო", "დრენაჟის ტუმბო", "წნევის გამაძლიერებელი", "წყალქვეშა ტუმბო"] },
    "toilets": { prefix: "WCL", brand: "Villeroy", base: 210, items: ["კედლის უნიტაზი", "იატაკის უნიტაზი", "ჩამალული ავზის ნაკრები", "რბილად დახურვადი დასაჯდომი"] },
    "showers": { prefix: "SHW", brand: "Hansgrohe", base: 190, items: ["წვიმის შხაპის სისტემა", "ხელის შხაპის ნაკრები", "ჩამალული შხაპის მიქსერი", "შხაპის სვეტი"] },
    "water-heaters": { prefix: "WHT", brand: "Ariston", base: 260, items: ["ელექტრო გამაცხელებელი 50ლ", "ელექტრო გამაცხელებელი 80ლ", "გაზის გამაცხელებელი", "კომპაქტური გამაცხელებელი"] },
    "tools": { prefix: "TLS", brand: "Rems", base: 35, items: ["პრეს ხელსაწყო", "მილის საჭრელი", "ფიტინგის გასაღები", "მონტაჟის ხელსაწყოების ჩანთა"] }
  };

  const categories = db.prepare("SELECT id, slug, title, imageUrl FROM categories").all();
  const existingProduct = db.prepare("SELECT id FROM products WHERE sku = ?");
  const countProducts = db.prepare("SELECT COUNT(*) AS count FROM products WHERE categoryId = ? AND status = 'active'");
  const insertProduct = db.prepare(`
    INSERT INTO products (
      sku, title, brand, categoryId, description, price, oldPrice, rating, reviews, stock,
      imageUrl, gallery, variants, specs, tags, isNew, isBestSeller, status, createdAt, updatedAt
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `);

  categories.forEach((category) => {
    const group = catalog[category.slug];
    if (!group) return;

    let currentCount = countProducts.get(category.id).count;
    const imageUrl = category.imageUrl || `/assets/categories/${category.slug}.png`;

    group.items.forEach((title, index) => {
      if (currentCount >= 4) return;

      const sku = `VR-${group.prefix}-${String(index + 1).padStart(2, "0")}`;
      if (existingProduct.get(sku)) return;

      const step = Math.max(7, Math.round(group.base * 0.28));
      const price = group.base + index * step;
      const oldPrice = index === 1 || index === 3 ? Math.round(price * 1.15) : null;
      const stock = [12, 8, 21, 6][index] || 10;
      const description = `${category.title} კატეგორიის დემო პროდუქტი გორის შოურუმისთვის. შესაფერისია ადგილობრივი შეკვეთისა და ოპერატორთან სწრაფი შეთანხმებისთვის.`;
      const gallery = JSON.stringify([imageUrl, imageUrl]);
      const variants = JSON.stringify(["სტანდარტული", "პრემიუმ"]);
      const specs = JSON.stringify({ "მიწოდება": "გორი", "კატეგორია": category.title, "სტატუსი": "შეკვეთით/მარაგში" });
      const tags = JSON.stringify(["demo", category.slug]);

      insertProduct.run(
        sku,
        title,
        group.brand,
        category.id,
        description,
        price,
        oldPrice,
        4.6 + (index % 3) * 0.1,
        18 + index * 11,
        stock,
        imageUrl,
        gallery,
        variants,
        specs,
        tags,
        index === 2 ? 1 : 0,
        index === 0 ? 1 : 0
      );
      currentCount += 1;
    });
  });
}

const parseProduct = (p) => ({
  ...p,
  name: p.title,
  price: Number(p.price),
  oldPrice: p.oldPrice == null ? null : Number(p.oldPrice),
  salePrice: p.oldPrice == null ? null : Number(p.oldPrice),
  rating: Number(p.rating),
  isNew: Boolean(p.isNew),
  isBestSeller: Boolean(p.isBestSeller),
  gallery: JSON.parse(p.gallery || "[]"),
  images: JSON.parse(p.gallery || "[]"),
  variants: JSON.parse(p.variants || "[]"),
  specs: JSON.parse(p.specs || "{}"),
  attributes: JSON.parse(p.specs || "{}"),
  tags: JSON.parse(p.tags || "[]")
});

export const allCategories = () => db.prepare("SELECT * FROM categories ORDER BY title").all();
export const getCategory = (slug) => db.prepare("SELECT * FROM categories WHERE slug = ?").get(slug);
function ensureCategory(value) {
  const raw = String(value || "").trim();
  if (!raw) throw new Error("კატეგორია სავალდებულოა");
  const aliases = {
    "faucets-and-mixers": "faucets-mixers",
    "showers": "showers",
    "toilets": "toilets",
    "sinks": "sinks",
    "bathtubs": "bathtubs",
    "bathroom-furniture": "bathroom-furniture",
    "pipes-and-fittings": "pipes-fittings",
    "pipes-fittings": "pipes-fittings",
    "valves": "valves",
    "water-heaters": "water-heaters",
    "pumps": "pumps",
    "heating-systems": "heating-systems",
    "drainage-systems": "drainage-systems",
    "installation-accessories": "installation-accessories",
    "sets": "sets",
    "tools": "tools"
  };
  const slug = aliases[slugify(raw)] || slugify(raw);
  const existing = db.prepare("SELECT id FROM categories WHERE slug = ? OR title = ?").get(slug, raw);
  if (existing) return existing.id;
  const result = db.prepare("INSERT INTO categories (title, slug, description, imageUrl) VALUES (?, ?, ?, ?)").run(raw, slug, `${raw} კატეგორია`, "/assets/plumb-supplies.png");
  return Number(result.lastInsertRowid);
}
function normalizeProductPayload(input, options = {}) {
  const pick = (...keys) => keys.map((key) => input?.[key]).find((value) => value !== undefined && value !== null);
  const sku = String(pick("SKU", "sku") || "").trim();
  const name = String(pick("name", "Name", "title") || "").trim();
  const category = String(pick("category", "Category", "categorySlug", "categoryTitle") || "").trim();
  const brand = String(pick("brand", "Brand") || "").trim();
  const description = String(pick("description", "Description") || "").trim();
  const price = Number(pick("price", "Price"));
  const salePriceRaw = pick("salePrice", "SalePrice", "sale_price", "oldPrice");
  const salePrice = salePriceRaw === "" || salePriceRaw == null ? null : Number(salePriceRaw);
  const stock = Number(pick("stock", "Stock") ?? 0);
  const status = String(pick("status", "Status") || "active").trim().toLowerCase();
  if (!sku) throw new Error("SKU სავალდებულოა");
  if (!name) throw new Error("სახელი სავალდებულოა");
  if (!category) throw new Error("კატეგორია სავალდებულოა");
  if (!brand) throw new Error("ბრენდი სავალდებულოა");
  if (!description) throw new Error("აღწერა სავალდებულოა");
  if (!Number.isFinite(price) || price < 0) throw new Error("ფასი არასწორია");
  if (salePrice != null && (!Number.isFinite(salePrice) || salePrice < 0)) throw new Error("salePrice არასწორია");
  if (!Number.isFinite(stock) || stock < 0) throw new Error("მარაგი არასწორია");
  if (!["active", "draft", "archived", "hidden"].includes(status)) throw new Error("სტატუსი არასწორია");
  const images = normalizeList(pick("images", "Images", "gallery")).length ? normalizeList(pick("images", "Images", "gallery")) : [String(pick("imageUrl") || "/assets/plumb-supplies.png")];
  const attributes = normalizeObject(pick("attributes", "Attributes", "specs"));
  const variants = normalizeList(pick("variants", "Variants"));
  const tags = normalizeList(pick("tags", "Tags"));
  return { sku, name, category, brand, description, price, salePrice, stock: Math.round(stock), images, attributes, variants, tags, status };
}
function normalizeList(value) {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  const text = String(value || "").trim();
  if (!text) return [];
  if (text.startsWith("[")) {
    try { const parsed = JSON.parse(text); return Array.isArray(parsed) ? parsed.map((item) => String(item).trim()).filter(Boolean) : []; } catch {}
  }
  return text.split(/[|,;]/).map((item) => item.trim()).filter(Boolean);
}
function normalizeObject(value) {
  if (value && typeof value === "object" && !Array.isArray(value)) return value;
  const text = String(value || "").trim();
  if (!text) return {};
  if (text.startsWith("{")) {
    try { const parsed = JSON.parse(text); return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {}; } catch {}
  }
  return Object.fromEntries(text.split(/[|;]/).map((pair) => pair.split(":").map((part) => part.trim())).filter(([key, val]) => key && val));
}
function slugify(value) {
  return String(value || "").trim().toLowerCase().replace(/[^\p{Letter}\p{Number}]+/gu, "-").replace(/^-+|-+$/g, "") || "category";
}
export const allProducts = () => db.prepare(`
  SELECT p.*, c.title AS categoryTitle, c.slug AS categorySlug
  FROM products p JOIN categories c ON c.id = p.categoryId
  ORDER BY p.isBestSeller DESC, p.rating DESC
`).all().map(parseProduct);
export const getProduct = (id) => {
  const product = db.prepare("SELECT p.*, c.title AS categoryTitle, c.slug AS categorySlug FROM products p JOIN categories c ON c.id = p.categoryId WHERE p.id = ?").get(id);
  return product ? parseProduct(product) : null;
};
export const allBrands = () => db.prepare("SELECT brand, COUNT(*) AS count FROM products GROUP BY brand ORDER BY brand").all();
export function adminProducts(filters = {}) {
  const q = String(filters.q || "").trim().toLowerCase();
  const category = String(filters.category || "").trim();
  const brand = String(filters.brand || "").trim();
  const status = String(filters.status || "").trim();
  return allProducts().filter((product) => {
    const matchesQ = !q || `${product.sku} ${product.title} ${product.brand}`.toLowerCase().includes(q);
    const matchesCategory = !category || product.categorySlug === category || product.categoryTitle === category;
    const matchesBrand = !brand || product.brand === brand;
    const matchesStatus = !status || (product.status || "active") === status;
    return matchesQ && matchesCategory && matchesBrand && matchesStatus;
  });
}
export function createAdminProduct(data) {
  const normalized = normalizeProductPayload(data);
  const categoryId = ensureCategory(normalized.category);
  const result = db.prepare(`
    INSERT INTO products (sku, title, brand, categoryId, description, price, oldPrice, stock, imageUrl, gallery, variants, specs, tags, status, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
  `).run(normalized.sku, normalized.name, normalized.brand, categoryId, normalized.description, normalized.price, normalized.salePrice, normalized.stock, normalized.images[0] || "/assets/plumb-supplies.png", JSON.stringify(normalized.images), JSON.stringify(normalized.variants), JSON.stringify(normalized.attributes), JSON.stringify(normalized.tags), normalized.status);
  return getProduct(Number(result.lastInsertRowid));
}
export function updateAdminProduct(id, data) {
  const current = getProduct(Number(id));
  if (!current) return null;
  const normalized = normalizeProductPayload({ ...current, ...data }, { partial: true });
  const categoryId = ensureCategory(normalized.category || current.categorySlug);
  db.prepare(`
    UPDATE products SET sku = ?, title = ?, brand = ?, categoryId = ?, description = ?, price = ?, oldPrice = ?, stock = ?, imageUrl = ?, gallery = ?, variants = ?, specs = ?, tags = ?, status = ?, updatedAt = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(normalized.sku, normalized.name, normalized.brand, categoryId, normalized.description, normalized.price, normalized.salePrice, normalized.stock, normalized.images[0] || current.imageUrl || "/assets/plumb-supplies.png", JSON.stringify(normalized.images), JSON.stringify(normalized.variants), JSON.stringify(normalized.attributes), JSON.stringify(normalized.tags), normalized.status, Number(id));
  return getProduct(Number(id));
}
export function deleteAdminProduct(id) {
  const product = getProduct(Number(id));
  if (!product) return null;
  db.prepare("DELETE FROM products WHERE id = ?").run(Number(id));
  return product;
}
export function importAdminProducts(rows) {
  const result = { created: 0, updated: 0, skipped: 0, errors: [] };
  const seenSkus = new Set();
  const safeRows = Array.isArray(rows) ? rows : [];
  db.exec("BEGIN");
  try {
    safeRows.forEach((row, index) => {
      try {
        const sku = String(row?.SKU ?? row?.sku ?? "").trim();
        if (!sku) throw new Error("SKU ცარიელია");
        const key = sku.toLowerCase();
        if (seenSkus.has(key)) {
          result.skipped += 1;
          result.errors.push({ row: index + 1, sku, message: "ფაილში SKU მეორდება" });
          return;
        }
        seenSkus.add(key);
        const normalized = normalizeProductPayload(row);
        const current = db.prepare("SELECT id FROM products WHERE lower(sku) = lower(?)").get(normalized.sku);
        if (current) {
          updateAdminProduct(current.id, normalized);
          result.updated += 1;
        } else {
          createAdminProduct(normalized);
          result.created += 1;
        }
      } catch (error) {
        result.skipped += 1;
        result.errors.push({ row: index + 1, sku: String(row?.SKU ?? row?.sku ?? ""), message: error.message });
      }
    });
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
  return result;
}
export const allOrders = () => db.prepare("SELECT * FROM orders ORDER BY createdAt DESC").all().map((o) => ({ ...o, items: JSON.parse(o.items) }));
export const allCustomers = () => db.prepare("SELECT * FROM customers ORDER BY createdAt DESC").all();
export function createOrder(data) {
  const result = db.prepare(`
    INSERT INTO orders (customerName, phone, email, address, deliveryMethod, paymentMethod, items, subtotal, deliveryFee, total, status, comment)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new', ?)
  `).run(data.customerName, data.phone, data.email || "", data.address, data.deliveryMethod, data.paymentMethod, JSON.stringify(data.items), data.subtotal, data.deliveryFee, data.total, data.comment || "");
  db.prepare("INSERT INTO customers (name, phone, email) VALUES (?, ?, ?)").run(data.customerName, data.phone, data.email || "");
  return db.prepare("SELECT * FROM orders WHERE id = ?").get(result.lastInsertRowid);
}
export function updateOrderStatus(id, status) {
  db.prepare("UPDATE orders SET status = ? WHERE id = ?").run(status, id);
  return db.prepare("SELECT * FROM orders WHERE id = ?").get(id);
}
export function updateProductStock(id, stock) {
  db.prepare("UPDATE products SET stock = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?").run(stock, id);
  return getProduct(id);
}
export function createContactMessage(data) {
  const result = db.prepare("INSERT INTO contact_messages (name, phone, email, message) VALUES (?, ?, ?, ?)").run(data.name, data.phone || "", data.email || "", data.message);
  return db.prepare("SELECT * FROM contact_messages WHERE id = ?").get(result.lastInsertRowid);
}
export const allContactMessages = () => db.prepare("SELECT * FROM contact_messages ORDER BY createdAt DESC").all();
export function createOperatorRequest(data) {
  const result = db.prepare("INSERT INTO operator_requests (name, phone, email, topic, message, status) VALUES (?, ?, ?, ?, ?, 'new')").run(data.name, data.phone || "", data.email || "", data.topic, data.message);
  return db.prepare("SELECT * FROM operator_requests WHERE id = ?").get(result.lastInsertRowid);
}
export const allOperatorRequests = () => db.prepare("SELECT * FROM operator_requests ORDER BY createdAt DESC").all();
export function saveChatMessage(sessionId, role, content, needsOperator = false) {
  db.prepare("INSERT INTO chat_messages (sessionId, role, content, needsOperator) VALUES (?, ?, ?, ?)").run(sessionId, role, content, needsOperator ? 1 : 0);
}
