import { createServer } from "node:http";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { extname, join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { storeConfig } from "./config.js";
import {
  allBrands,
  allCategories,
  allContactMessages,
  allAppointmentRequests,
  allCustomers,
  allOperatorRequests,
  allOrders,
  allProducts,
  adminProducts,
  createAdminProduct,
  createAppointmentRequest,
  createContactMessage,
  createOperatorRequest,
  createOrder,
  deleteAdminProduct,
  getProduct,
  importAdminProducts,
  initDatabase,
  saveChatMessage,
  updateAdminProduct,
  updateAppointmentStatus,
  updateOrderStatus,
  updateProductStock
} from "./database.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "..", "public");
const port = Number(process.env.PORT || 3000);
const openAiApiKey = process.env.OPENAI_API_KEY || "";
const openAiModel = process.env.OPENAI_MODEL || "gpt-5-mini";
const adminPassword = process.env.ADMIN_PASSWORD || (process.env.NODE_ENV === "production" ? "" : "dev-admin");
const secureAdminCookie = process.env.NODE_ENV === "production";
const adminSessions = new Map();
const appointmentBuckets = new Map();
const deploymentInfo = {
  commit: process.env.RENDER_GIT_COMMIT || process.env.GIT_COMMIT || "local",
  branch: process.env.RENDER_GIT_BRANCH || process.env.GIT_BRANCH || "local",
  service: process.env.RENDER_SERVICE_NAME || "local",
  deployedAt: process.env.RENDER_DEPLOYED_AT || "",
  environment: process.env.NODE_ENV || "development"
};

initDatabase();

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png"
};

createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    if (url.pathname.startsWith("/api/")) return handleApi(req, res, url);
    return serveStatic(res, url.pathname);
  } catch (error) {
    sendJson(res, 500, { error: "Server error", detail: error.message });
  }
}).listen(port, () => console.log(`Clinic site running at http://localhost:${port}`));

async function handleApi(req, res, url) {
  const body = ["POST", "PATCH"].includes(req.method) ? await readJson(req) : {};
  if (req.method === "GET" && url.pathname === "/api/deployment") return sendJson(res, 200, deploymentInfo);
  if (req.method === "GET" && url.pathname === "/api/config") return sendJson(res, 200, storeConfig);
  if (req.method === "GET" && url.pathname === "/api/admin/session") return adminSessionRoute(req, res);
  if (req.method === "POST" && url.pathname === "/api/admin/login") return adminLoginRoute(req, res, body);
  if (req.method === "POST" && url.pathname === "/api/admin/logout") return adminLogoutRoute(req, res);
  if (req.method === "POST" && url.pathname === "/api/appointments") return appointmentRoute(req, res, body);
  if (url.pathname.startsWith("/api/admin/") && !isAdminAuthenticated(req)) return unauthorized(res);
  if (req.method === "GET" && url.pathname === "/api/admin/appointments") return sendJson(res, 200, allAppointmentRequests(Object.fromEntries(url.searchParams)));
  if (req.method === "PATCH" && url.pathname.match(/^\/api\/admin\/appointments\/\d+\/status$/)) return appointmentStatusRoute(res, Number(url.pathname.split("/")[4]), body);
  if (req.method === "GET" && url.pathname === "/api/admin/products") return sendJson(res, 200, adminProducts(Object.fromEntries(url.searchParams)));
  if (req.method === "POST" && url.pathname === "/api/admin/products") return adminCreateProductRoute(res, body);
  if (req.method === "POST" && url.pathname === "/api/admin/products/import") return adminImportProductsRoute(res, body);
  if (req.method === "PATCH" && url.pathname.match(/^\/api\/admin\/products\/\d+$/)) return adminUpdateProductRoute(res, Number(url.pathname.split("/").pop()), body);
  if (req.method === "DELETE" && url.pathname.match(/^\/api\/admin\/products\/\d+$/)) return adminDeleteProductRoute(res, Number(url.pathname.split("/").pop()));
  if (req.method === "GET" && url.pathname === "/api/categories") return sendJson(res, 200, allCategories());
  if (req.method === "GET" && url.pathname === "/api/brands") return sendJson(res, 200, allBrands());
  if (req.method === "GET" && url.pathname === "/api/products") return sendJson(res, 200, filterProducts(url));
  if (req.method === "GET" && url.pathname.startsWith("/api/products/")) {
    const product = getProduct(Number(url.pathname.split("/").pop()));
    return product && (product.status || "active") === "active" ? sendJson(res, 200, productDetailPayload(product)) : sendJson(res, 404, { error: "Product not found" });
  }
  if (req.method === "PATCH" && url.pathname.match(/^\/api\/products\/\d+\/stock$/)) {
    if (!isAdminAuthenticated(req)) return unauthorized(res);
    const stock = Number(body.stock);
    if (!Number.isFinite(stock) || stock < 0 || stock > 100000) return sendJson(res, 400, { error: "მარაგის რაოდენობა არასწორია" });
    const product = updateProductStock(Number(url.pathname.split("/")[3]), Math.round(stock));
    return product ? sendJson(res, 200, product) : sendJson(res, 404, { error: "პროდუქტი ვერ მოიძებნა" });
  }
  if (req.method === "POST" && url.pathname === "/api/orders") return orderRoute(res, body);
  if (req.method === "GET" && url.pathname === "/api/orders") return isAdminAuthenticated(req) ? sendJson(res, 200, allOrders()) : unauthorized(res);
  if (req.method === "PATCH" && url.pathname.match(/^\/api\/orders\/\d+\/status$/)) {
    if (!isAdminAuthenticated(req)) return unauthorized(res);
    if (!["new", "contacted", "confirmed", "completed", "cancelled"].includes(body.status)) return sendJson(res, 400, { error: "სტატუსი არასწორია" });
    return sendJson(res, 200, updateOrderStatus(Number(url.pathname.split("/")[3]), body.status));
  }
  if (req.method === "GET" && url.pathname === "/api/customers") return isAdminAuthenticated(req) ? sendJson(res, 200, allCustomers()) : unauthorized(res);
  if (req.method === "POST" && url.pathname === "/api/contact") return contactRoute(res, body);
  if (req.method === "GET" && url.pathname === "/api/contact-messages") return isAdminAuthenticated(req) ? sendJson(res, 200, { contactMessages: allContactMessages(), operatorRequests: allOperatorRequests() }) : unauthorized(res);
  if (req.method === "POST" && url.pathname === "/api/operator-request") return operatorRoute(res, body);
  if (req.method === "POST" && url.pathname === "/api/chat") return chatRoute(res, body);
  return sendJson(res, 404, { error: "API route not found" });
}

function filterProducts(url) {
  let products = allProducts().filter((p) => (p.status || "active") === "active");
  const q = (url.searchParams.get("q") || "").toLowerCase();
  const category = url.searchParams.get("category") || "";
  const brand = url.searchParams.get("brand") || "";
  const stock = url.searchParams.get("stock") || "";
  const sale = url.searchParams.get("sale") || "";
  const status = url.searchParams.get("status") || "";
  const minPrice = Number(url.searchParams.get("minPrice") || "");
  const maxPrice = Number(url.searchParams.get("maxPrice") || "");
  const sort = url.searchParams.get("sort") || "featured";
  if (status) products = allProducts().filter((p) => (p.status || "active") === status);
  if (q) products = products.filter((p) => `${p.sku} ${p.title} ${p.name} ${p.brand} ${p.categoryTitle} ${p.description} ${p.tags.join(" ")}`.toLowerCase().includes(q));
  if (category) products = products.filter((p) => p.categorySlug === category);
  if (brand) products = products.filter((p) => p.brand === brand);
  if (Number.isFinite(minPrice) && minPrice > 0) products = products.filter((p) => effectivePrice(p) >= minPrice);
  if (Number.isFinite(maxPrice) && maxPrice > 0) products = products.filter((p) => effectivePrice(p) <= maxPrice);
  if (stock === "in-stock") products = products.filter((p) => p.stock > 0);
  if (stock === "out-of-stock") products = products.filter((p) => p.stock <= 0);
  if (stock === "low-stock") products = products.filter((p) => p.stock > 0 && p.stock <= 10);
  if (sale === "1" || sale === "true") products = products.filter(hasDiscount);
  if (sort === "price-asc") products.sort((a, b) => effectivePrice(a) - effectivePrice(b));
  if (sort === "price-desc") products.sort((a, b) => effectivePrice(b) - effectivePrice(a));
  if (sort === "rating") products.sort((a, b) => b.rating - a.rating);
  if (sort === "new") products.sort((a, b) => Number(b.isNew) - Number(a.isNew));
  if (sort === "newest") products.sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
  if (sort === "name-asc") products.sort((a, b) => a.title.localeCompare(b.title, "ka"));
  if (sort === "best-sellers") products.sort((a, b) => Number(b.isBestSeller) - Number(a.isBestSeller) || b.reviews - a.reviews);
  return products;
}

function productDetailPayload(product) {
  let related = allProducts()
    .filter((item) => (item.status || "active") === "active" && item.id !== product.id && (item.categorySlug === product.categorySlug || item.brand === product.brand))
    .sort((a, b) => Number(b.isBestSeller) - Number(a.isBestSeller) || b.rating - a.rating)
    .slice(0, 6);
  if (!related.length) related = allProducts().filter((item) => (item.status || "active") === "active" && item.id !== product.id).slice(0, 6);
  return { ...product, related };
}

function effectivePrice(product) {
  const price = Number(product.price);
  const sale = Number(product.salePrice);
  return Number.isFinite(sale) && sale > 0 && sale < price ? sale : price;
}

function hasDiscount(product) {
  const price = Number(product.price);
  const sale = Number(product.salePrice);
  return Number.isFinite(sale) && sale > 0 && sale !== price;
}

function adminCreateProductRoute(res, body) {
  try {
    const product = createAdminProduct(body);
    sendJson(res, 201, product);
  } catch (error) {
    sendJson(res, 400, { error: error.message });
  }
}

function adminUpdateProductRoute(res, id, body) {
  try {
    const product = updateAdminProduct(id, body);
    return product ? sendJson(res, 200, product) : sendJson(res, 404, { error: "პროდუქტი ვერ მოიძებნა" });
  } catch (error) {
    sendJson(res, 400, { error: error.message });
  }
}

function adminDeleteProductRoute(res, id) {
  const product = deleteAdminProduct(id);
  return product ? sendJson(res, 200, { message: "პროდუქტი წაიშალა", product }) : sendJson(res, 404, { error: "პროდუქტი ვერ მოიძებნა" });
}

function adminImportProductsRoute(res, body) {
  try {
    const result = importAdminProducts(body.rows);
    sendJson(res, 200, result);
  } catch (error) {
    sendJson(res, 400, { error: error.message, created: 0, updated: 0, skipped: 0, errors: [{ row: 0, sku: "", message: error.message }] });
  }
}

function adminSessionRoute(req, res) {
  if (!adminPassword) return sendJson(res, 200, { authenticated: false, disabled: true, message: "ადმინი გამორთულია. დააყენეთ ADMIN_PASSWORD გარემოს ცვლადი." });
  return sendJson(res, 200, { authenticated: isAdminAuthenticated(req), disabled: false });
}

function adminLoginRoute(req, res, body) {
  if (!adminPassword) return sendJson(res, 503, { success: false, message: "ადმინი გამორთულია. დააყენეთ ADMIN_PASSWORD გარემოს ცვლადი." });
  if (!safeEqual(String(body.password || ""), adminPassword)) return sendJson(res, 401, { success: false, message: "პაროლი არასწორია" });
  const token = randomBytes(32).toString("hex");
  adminSessions.set(hashToken(token), Date.now() + 1000 * 60 * 60 * 8);
  cleanupAdminSessions();
  setCookie(res, "admin_session", token, { httpOnly: true, secure: secureAdminCookie, sameSite: "Lax", maxAge: 60 * 60 * 8, path: "/" });
  return sendJson(res, 200, { success: true, message: "შესვლა წარმატებულია" });
}

function adminLogoutRoute(req, res) {
  const token = parseCookies(req.headers.cookie || "").admin_session;
  if (token) adminSessions.delete(hashToken(token));
  setCookie(res, "admin_session", "", { httpOnly: true, secure: secureAdminCookie, sameSite: "Lax", maxAge: 0, path: "/" });
  return sendJson(res, 200, { success: true, message: "გამოსვლა შესრულდა" });
}

function appointmentRoute(req, res, body) {
  try {
    if (!rateLimitAppointment(req)) return sendJson(res, 429, { success: false, message: "გთხოვთ სცადოთ ცოტა მოგვიანებით" });
    if (String(body.website || "").trim()) return sendJson(res, 200, { success: true, message: "ჩაწერის მოთხოვნა მიღებულია. ოპერატორი დაგიკავშირდებათ ვიზიტის დასადასტურებლად." });
    const cleaned = cleanAppointmentInput(body);
    const required = validateRequired(cleaned, ["fullName", "phone", "service", "preferredDate", "preferredTime"]);
    if (required) return sendJson(res, 400, { success: false, message: required.error });
    if (!validPhone(cleaned.phone)) return sendJson(res, 400, { success: false, message: "ტელეფონის ნომერი არასწორია" });
    const appointment = createAppointmentRequest(cleaned);
    return sendJson(res, 201, { success: true, message: "ჩაწერის მოთხოვნა მიღებულია. ოპერატორი დაგიკავშირდებათ ვიზიტის დასადასტურებლად.", appointment });
  } catch (error) {
    return sendJson(res, 400, { success: false, message: error.message || "მოთხოვნის გაგზავნა ვერ მოხერხდა" });
  }
}

function appointmentStatusRoute(res, id, body) {
  try {
    const appointment = updateAppointmentStatus(id, String(body.status || "").trim());
    return appointment ? sendJson(res, 200, { success: true, appointment }) : sendJson(res, 404, { success: false, message: "ჩაწერის მოთხოვნა ვერ მოიძებნა" });
  } catch (error) {
    return sendJson(res, 400, { success: false, message: error.message || "სტატუსის განახლება ვერ მოხერხდა" });
  }
}

function orderRoute(res, body) {
  const required = validateRequired(body, ["customerName", "phone"]);
  if (required) return sendJson(res, 400, required);
  if (!Array.isArray(body.items) || body.items.length === 0) return sendJson(res, 400, { error: "კალათა ცარიელია" });
  if (!validPhone(body.phone)) return sendJson(res, 400, { error: "ტელეფონის ნომერი არასწორია" });
  if (body.email && !validEmail(body.email)) return sendJson(res, 400, { error: "ელფოსტა არასწორია" });
  const catalog = allProducts();
  const items = body.items.map((item) => {
    const product = catalog.find((p) => p.id === Number(item.productId));
    if (!product) throw new Error("კალათაში არასწორი პროდუქტია");
    const quantity = Math.max(1, Math.min(99, Number(item.quantity || 1)));
    const price = effectivePrice(product);
    return { productId: product.id, title: product.title, sku: product.sku, price, quantity, lineTotal: price * quantity };
  });
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const order = createOrder({
    ...body,
    address: "გორი",
    deliveryMethod: "მიწოდება გორის ტერიტორიაზე",
    paymentMethod: body.paymentMethod || "დადასტურების შემდეგ: ნაღდი ან მობილური ბანკი",
    comment: String(body.comment || "").trim(),
    items,
    subtotal,
    deliveryFee: 0,
    total: subtotal
  });
  sendJson(res, 201, { message: "შეკვეთის მოთხოვნა მიღებულია. შეკვეთას დაგიდასტურებთ ტელეფონით.", order: { ...order, items } });
}

function contactRoute(res, body) {
  const required = validateRequired(body, ["name", "message"]);
  if (required) return sendJson(res, 400, required);
  if (!body.phone && !body.email) return sendJson(res, 400, { error: "დატოვეთ ტელეფონი ან ელფოსტა" });
  return sendJson(res, 201, { message: "შეტყობინება მიღებულია", contactMessage: createContactMessage(body) });
}

function operatorRoute(res, body) {
  const required = validateRequired(body, ["name", "phone", "topic", "message"]);
  if (required) return sendJson(res, 400, required);
  return sendJson(res, 201, { message: "ოპერატორის მოთხოვნა შენახულია", operatorRequest: createOperatorRequest(body) });
}

async function chatRoute(res, body) {
  const message = String(body.message || "").trim();
  const sessionId = String(body.sessionId || crypto.randomUUID());
  if (!message) return sendJson(res, 400, { error: "შეიყვანეთ კითხვა" });
  const answer = salesSafetyGate(message) || salesAnswer(message);
  saveChatMessage(sessionId, "user", message, answer.needsOperator);
  saveChatMessage(sessionId, "assistant", answer.reply, answer.needsOperator);
  sendJson(res, 200, { sessionId, mode: "local", ...answer });
}

function salesSafetyGate(message) {
  const text = normalizedText(message);
  if (["gas leak", "flood", "electrical shock", "emergency", "წყალი მოდის", "გაზის სუნი"].some((w) => text.includes(w))) {
    return { needsOperator: true, category: "urgent", reply: "თუ გაქვთ წყლის ძლიერი გაჟონვა, გაზის სუნი ან ელექტრო რისკი, დაუყოვნებლივ გათიშეთ შესაბამისი წყარო და დაუკავშირდით გადაუდებელ/სერვის ჯგუფს. ოპერატორთან დასაკავშირებლად დატოვეთ საკონტაქტო ინფორმაცია." };
  }
  if (["human", "operator", "დამირეკეთ", "ოპერატორი"].some((w) => text.includes(w))) {
    return { needsOperator: true, category: "operator", reply: "გადაგამისამართებთ ოპერატორთან. დატოვეთ სახელი, ტელეფონი და მოთხოვნის თემა." };
  }
  return null;
}

async function llmSalesAnswer(message) {
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { "Authorization": `Bearer ${openAiApiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: openAiModel, instructions: buildSalesInstructions(), input: message, max_output_tokens: 420, text: { verbosity: "low" } })
  });
  if (!response.ok) throw new Error(`OpenAI API error ${response.status}`);
  const data = await response.json();
  const parsed = safeJson(data.output_text || "");
  if (!parsed?.reply) throw new Error("Invalid AI JSON");
  return { reply: parsed.reply.slice(0, 900), needsOperator: Boolean(parsed.needsOperator), category: parsed.category || "sales-ai" };
}

function buildSalesInstructions() {
  const products = allProducts().filter((p) => (p.status || "active") === "active").map((p) => `${p.sku}: ${p.title}, ${p.brand}, ${p.categoryTitle}, ${p.price} ლარი, მარაგი ${p.stock}, სპეციფიკაცია ${JSON.stringify(p.specs)}`).join("\n");
  return `You are AquaPro Gori's local sales assistant for a premium plumbing and bathroom showroom in Gori, Georgia. Reply only in Georgian. Keep answers short, warm and sales-focused. Help choose products, explain categories, suggest compatible items when catalog evidence is clear, and invite the customer to send an order request or leave a phone number for the operator. Delivery is only in Gori area for now. Payment is arranged after phone confirmation: cash on delivery or mobile bank transfer. No card payment, no user accounts, no complicated returns/warranty flow. Use only this catalog and store data; never invent stock, price, specs or compatibility. If unsure, or if installation risk is high, set needsOperator true and ask for the customer's phone. Return only JSON: {"reply":"...", "needsOperator": false, "category":"..."}.\nStore: ${JSON.stringify(storeConfig)}\nCatalog:\n${products}`;
}

function salesAnswer(message) {
  const text = normalizedText(message);
  const products = allProducts().filter((p) => (p.status || "active") === "active");
  const hasGeo = (...words) => words.some((word) => text.includes(word));
  if (text.includes("delivery") || text.includes("gori") || hasGeo("\u10d2\u10dd\u10e0", "\u10db\u10d8\u10ec", "\u10d9\u10e3\u10e0\u10d8\u10d4\u10e0")) {
    return { needsOperator: false, category: "delivery", reply: "მიწოდება გორის ტერიტორიაზე. შეკვეთას დაგიდასტურებთ ტელეფონით და დროსაც იქ შევათანხმებთ." };
  }
  if (text.includes("payment") || hasGeo("\u10d2\u10d0\u10d3\u10d0\u10ee\u10d3", "\u10d2\u10d0\u10d3\u10d0\u10e0\u10d8\u10ea\u10ee", "\u10db\u10dd\u10d1\u10d8\u10da\u10e3\u10e0")) {
    return { needsOperator: false, category: "payment", reply: "გადახდა შესაძლებელია ნაღდი ანგარიშსწორებით მიწოდებისას ან მობილური ბანკით, მხოლოდ ოპერატორის დადასტურების შემდეგ." };
  }
  if (text.includes("faucet") || text.includes("mixer") || hasGeo("\u10dd\u10dc\u10d9\u10d0\u10dc", "\u10db\u10d8\u10e5\u10e1\u10d4\u10e0", "\u10e8\u10d4\u10db\u10e0\u10d4\u10d5")) {
    return productListAnswer("faucets", products.filter((p) => p.categorySlug === "faucets-mixers").slice(0, 3));
  }
  if (text.includes("shower") || hasGeo("\u10e8\u10ee\u10d0\u10de", "\u10d3\u10e3\u10e8")) return productListAnswer("showers", products.filter((p) => p.categorySlug === "showers").slice(0, 3));
  if (text.includes("pipe") || text.includes("fitting") || hasGeo("\u10db\u10d8\u10da", "\u10e4\u10d8\u10e2\u10d8\u10dc\u10d2")) return productListAnswer("pipes", products.filter((p) => ["pipes-fittings", "valves"].includes(p.categorySlug)).slice(0, 4));
  if (text.includes("brand") || hasGeo("\u10d1\u10e0\u10d4\u10dc\u10d3")) return { needsOperator: false, category: "brands", reply: `მაღაზიაში წარმოდგენილია: ${allBrands().map((b) => b.brand).join(", ")}.` };
  return { needsOperator: true, category: "unknown", reply: "მიწოდება გორის ტერიტორიაზეა და შეკვეთას ტელეფონით დაგიდასტურებთ. ზუსტი შერჩევისთვის დატოვეთ ტელეფონი ან კალათაში დაამატეთ პროდუქტები და გაგზავნეთ შეკვეთის მოთხოვნა." };
}

function productListAnswer(category, list) {
  return { needsOperator: false, category, reply: list.map((p) => `${p.title} — ${p.price} ლარი, ${p.stock > 0 ? "მარაგშია" : "შეკვეთით"}`).join("; ") };
}

function normalizedText(value) {
  const text = String(value || "").toLowerCase();
  try {
    return `${text} ${Buffer.from(text, "latin1").toString("utf8")}`;
  } catch {
    return text;
  }
}

function validateRequired(body, fields) {
  const missing = fields.filter((field) => !String(body[field] ?? "").trim());
  return missing.length ? { error: `შეავსეთ სავალდებულო ველები: ${missing.join(", ")}` } : null;
}
function cleanAppointmentInput(body) {
  return {
    fullName: limit(body.fullName, 120),
    phone: limit(body.phone, 40),
    service: limit(body.service, 120),
    doctor: limit(body.doctor, 120),
    preferredDate: limit(body.preferredDate, 40),
    preferredTime: limit(body.preferredTime, 40),
    comment: limit(body.comment, 1000)
  };
}

function limit(value, max) {
  return String(value || "").trim().slice(0, max);
}

function rateLimitAppointment(req) {
  const key = String(req.headers["x-forwarded-for"] || req.socket.remoteAddress || "local").split(",")[0].trim();
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const bucket = appointmentBuckets.get(key) || [];
  const recent = bucket.filter((time) => now - time < windowMs);
  if (recent.length >= 8) {
    appointmentBuckets.set(key, recent);
    return false;
  }
  recent.push(now);
  appointmentBuckets.set(key, recent);
  return true;
}

function isAdminAuthenticated(req) {
  if (!adminPassword) return false;
  const token = parseCookies(req.headers.cookie || "").admin_session;
  if (!token) return false;
  const key = hashToken(token);
  const expiresAt = adminSessions.get(key);
  if (!expiresAt) return false;
  if (expiresAt < Date.now()) {
    adminSessions.delete(key);
    return false;
  }
  return true;
}

function unauthorized(res) {
  return sendJson(res, 401, { success: false, message: "ადმინზე წვდომისთვის საჭიროა ავტორიზაცია" });
}

function parseCookies(header) {
  return Object.fromEntries(String(header || "").split(";").map((part) => {
    const index = part.indexOf("=");
    return index === -1 ? ["", ""] : [part.slice(0, index).trim(), decodeURIComponent(part.slice(index + 1).trim())];
  }).filter(([key]) => key));
}

function setCookie(res, name, value, options = {}) {
  const parts = [`${name}=${encodeURIComponent(value)}`];
  if (options.maxAge !== undefined) parts.push(`Max-Age=${options.maxAge}`);
  if (options.path) parts.push(`Path=${options.path}`);
  if (options.httpOnly) parts.push("HttpOnly");
  if (options.secure) parts.push("Secure");
  if (options.sameSite) parts.push(`SameSite=${options.sameSite}`);
  res.setHeader("Set-Cookie", parts.join("; "));
}

function hashToken(token) {
  return createHash("sha256").update(token).digest("hex");
}

function safeEqual(a, b) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

function cleanupAdminSessions() {
  const now = Date.now();
  for (const [key, expiresAt] of adminSessions.entries()) {
    if (expiresAt < now) adminSessions.delete(key);
  }
}

const validEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v));
const validPhone = (v) => /^[+()0-9\s-]{6,}$/.test(String(v));
async function readJson(req) {
  let raw = "";
  for await (const chunk of req) raw += chunk;
  try { return raw ? JSON.parse(raw) : {}; } catch { return {}; }
}
function safeJson(raw) {
  try { return JSON.parse(raw); } catch { const m = String(raw || "").match(/\{[\s\S]*\}/); try { return m ? JSON.parse(m[0]) : null; } catch { return null; } }
}
async function serveStatic(res, pathname) {
  let filePath = pathname === "/" ? join(publicDir, "index.html") : join(publicDir, pathname);
  if (!existsSync(filePath) || !filePath.startsWith(publicDir)) filePath = join(publicDir, "index.html");
  const ext = extname(filePath);
  const headers = { "Content-Type": mimeTypes[ext] || "application/octet-stream" };
  if ([".png", ".jpg", ".jpeg", ".webp"].includes(ext)) headers["Cache-Control"] = "public, max-age=3600";
  if ([".css", ".js", ".html"].includes(ext)) headers["Cache-Control"] = "no-cache";
  res.writeHead(200, headers);
  res.end(await readFile(filePath));
}
function sendJson(res, status, payload) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}
