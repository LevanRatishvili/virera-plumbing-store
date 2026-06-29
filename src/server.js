import { createServer } from "node:http";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { readFile } from "node:fs/promises";
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { extname, join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { storeConfig } from "./config.js";
import { publicStorageDiagnostics, storageConfig } from "./storage.js";
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
  clinicContentOverrides,
  cleanupSmokeAppointmentRequests,
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
  saveClinicContentOverrides,
  resetClinicContentSection,
  updateAdminProduct,
  updateAppointmentStatus,
  updateOrderStatus,
  updateProductStock
} from "./database.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "..", "public");
const indexPath = join(publicDir, "index.html");
const buildInfoPath = join(__dirname, "..", ".build-info.json");
const port = Number(process.env.PORT || 3000);
const openAiApiKey = process.env.OPENAI_API_KEY || "";
const openAiModel = process.env.OPENAI_MODEL || "gpt-5-mini";
const adminPassword = process.env.ADMIN_PASSWORD || (process.env.NODE_ENV === "production" ? "" : "dev-admin");
const secureAdminCookie = process.env.NODE_ENV === "production";
const adminSessions = new Map();
const appointmentBuckets = new Map();
const buildInfo = readBuildInfo();
const runtimeStartedAt = new Date().toISOString();
const storageDiagnostics = publicStorageDiagnostics();
const deploymentInfo = {
  appName: buildInfo.appName || "virera-plumbing-store",
  commit: buildInfo.commit || process.env.RENDER_GIT_COMMIT || process.env.GIT_COMMIT || "local",
  branch: buildInfo.branch || process.env.RENDER_GIT_BRANCH || process.env.GIT_BRANCH || "local",
  appVersion: buildInfo.appVersion || buildInfo.version || "1.0.0",
  version: buildInfo.appVersion || buildInfo.version || "1.0.0",
  buildTime: buildInfo.buildTime || process.env.RENDER_DEPLOYED_AT || runtimeStartedAt,
  buildSource: buildInfo.buildTime ? "build-info" : "runtime",
  runtimeStartedAt,
  renderCommit: process.env.RENDER_GIT_COMMIT || "",
  renderBranch: process.env.RENDER_GIT_BRANCH || "",
  service: process.env.RENDER_SERVICE_NAME || "local",
  deployedAt: process.env.RENDER_DEPLOYED_AT || "",
  environment: process.env.NODE_ENV || "development",
  storage: storageDiagnostics,
  dataDirConfigured: storageDiagnostics.dataDirConfigured,
  databasePathSource: storageDiagnostics.databasePathSource,
  mediaUploadEnabled: storageDiagnostics.mediaUploadEnabled,
  persistentStorageWarning: storageDiagnostics.persistentStorageWarning
};
deploymentInfo.shortCommit = deploymentInfo.commit.slice(0, 7);

initDatabase();

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp"
};

createServer(async (req, res) => {
  let pathname = "/";
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    pathname = url.pathname;
    if (url.pathname.startsWith("/api/")) return handleApi(req, res, url);
    if (isAdminPath(url.pathname)) return serveAdminShell(res, req.method);
    return serveStatic(res, url.pathname, req.method);
  } catch (error) {
    if (isAdminPath(pathname)) return serveAdminFallback(res);
    sendJson(res, 500, { error: "Server error", detail: error.message });
  }
}).listen(port, () => console.log(`Clinic site running at http://localhost:${port}`));

async function handleApi(req, res, url) {
  const isMediaUpload = req.method === "POST" && url.pathname === "/api/admin/media/upload";
  const body = ["POST", "PATCH", "PUT"].includes(req.method) && !isMediaUpload ? await readJson(req) : {};
  if (req.method === "GET" && url.pathname === "/api/deployment") return sendDeploymentJson(res);
  if (req.method === "GET" && url.pathname === "/api/health") return sendNoStoreJson(res, 200, { ok: true, ...deploymentInfo });
  if (req.method === "GET" && url.pathname === "/api/config") return sendJson(res, 200, storeConfig);
  if (req.method === "GET" && url.pathname === "/api/content") return sendNoStoreJson(res, 200, { content: clinicContentOverrides() });
  if (req.method === "GET" && url.pathname === "/api/admin/session") return adminSessionRoute(req, res);
  if (req.method === "POST" && url.pathname === "/api/admin/login") return adminLoginRoute(req, res, body);
  if (req.method === "POST" && url.pathname === "/api/admin/logout") return adminLogoutRoute(req, res);
  if (req.method === "POST" && url.pathname === "/api/appointments") return appointmentRoute(req, res, body);
  if (url.pathname.startsWith("/api/admin/") && !isAdminAuthenticated(req)) return unauthorized(res);
  if (req.method === "GET" && url.pathname === "/api/admin/content") return sendNoStoreJson(res, 200, { content: clinicContentOverrides(), assetOptions: clinicAssetOptions, build: deploymentInfo });
  if (req.method === "PUT" && url.pathname === "/api/admin/content") return adminContentSaveRoute(res, body);
  if (req.method === "POST" && url.pathname === "/api/admin/content/reset-section") return adminContentResetRoute(res, body);
  if (isMediaUpload) return adminMediaUploadRoute(req, res);
  if (req.method === "POST" && url.pathname === "/api/admin/appointments/cleanup-smoke") return sendJson(res, 200, { success: true, removed: cleanupSmokeAppointmentRequests() });
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

const clinicAssetOptions = collectClinicAssetOptions();
const clinicContentKeys = new Set(["siteInfo", "heroSlides", "services", "doctors", "prices", "contact", "footer", "consentText"]);

function adminContentSaveRoute(res, body) {
  try {
    return sendJson(res, 200, { success: true, content: saveClinicContentOverrides(validateClinicContent(body.content || body)) });
  } catch (error) {
    return sendJson(res, 400, { success: false, message: error.message || "Content validation failed" });
  }
}

function adminContentResetRoute(res, body) {
  try {
    const section = cleanContentKey(body.section || "");
    return sendJson(res, 200, { success: true, content: resetClinicContentSection(section) });
  } catch (error) {
    return sendJson(res, 400, { success: false, message: error.message || "Reset failed" });
  }
}

function validateClinicContent(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("Content payload must be an object");
  const output = {};
  for (const [key, value] of Object.entries(input)) {
    if (!clinicContentKeys.has(key)) throw new Error(`Unsupported content section: ${key}`);
    if (key === "siteInfo") output[key] = cleanTextObject(value, ["clinicName", "shortSlogan", "demoVersionNote", "primaryCta", "secondaryCta"], 180);
    if (key === "contact") output[key] = cleanTextObject(value, ["phone", "phoneHref", "email", "address", "workingHours"], 220);
    if (key === "footer") output[key] = cleanTextObject(value, ["footerText", "privacyLinkText"], 420);
    if (key === "consentText") output[key] = cleanTextObject(value, ["privacyNote", "consentCopy", "commentPlaceholder"], 520);
    if (key === "heroSlides") output[key] = cleanContentList(value, 6, (item) => ({
      title: cleanContentText(item?.title, 180),
      text: cleanContentText(item?.text, 320),
      image: cleanAssetPath(item?.image || "/assets/clinic-hero.png"),
      tone: cleanContentText(item?.tone || "consultation", 40)
    }));
    if (key === "services") output[key] = cleanContentList(value, 20, (item) => ({
      title: cleanContentText(item?.title, 120),
      description: cleanContentText(item?.description, 520),
      price: cleanContentText(item?.price, 140)
    }));
    if (key === "doctors") output[key] = cleanContentList(value, 20, (item) => ({
      name: cleanContentText(item?.name, 140),
      specialty: cleanContentText(item?.specialty, 160),
      note: cleanContentText(item?.note, 280),
      image: item?.image ? cleanAssetPath(item.image) : ""
    }));
    if (key === "prices") output[key] = cleanContentList(value, 30, (item) => ({
      title: cleanContentText(item?.title, 140),
      price: cleanContentText(item?.price, 140)
    }));
  }
  return output;
}

function cleanContentKey(value) {
  const key = String(value || "").trim();
  if (!key) return "";
  if (!clinicContentKeys.has(key)) throw new Error("Unsupported content section");
  return key;
}

function cleanTextObject(value, fields, maxLength) {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Content section must be an object");
  return Object.fromEntries(fields.map((field) => [field, cleanContentText(value[field], maxLength)]));
}

function cleanContentList(value, maxItems, mapper) {
  if (!Array.isArray(value)) throw new Error("Content section must be a list");
  if (value.length > maxItems) throw new Error(`Too many items; max ${maxItems}`);
  return value.map(mapper);
}

function cleanContentText(value, maxLength) {
  const text = String(value ?? "").trim().replace(/\s+/g, " ");
  if (text.length > maxLength) throw new Error(`Text exceeds ${maxLength} characters`);
  if (/(<|>|<\/|<script|javascript:|data:|onerror\s*=|onload\s*=)/i.test(text)) throw new Error("Unsafe content is not allowed");
  return text;
}

function cleanAssetPath(value) {
  const path = cleanContentText(value, 180);
  if (!path) return "";
  if (!/^\/(assets|uploads)\/[A-Za-z0-9/_-]+\.(png|jpg|jpeg|webp)$/i.test(path)) throw new Error("Image path must be a local image file");
  if (path.includes("..") || path.includes("//") || path.includes("\\")) throw new Error("Unsafe image path");
  return path;
}

function collectClinicAssetOptions() {
  const fallback = ["/assets/clinic-hero.png", "/assets/plumb-hero.png", "/assets/plumb-lifestyle.png", "/assets/plumb-supplies.png"];
  const assetsDir = join(publicDir, "assets");
  const allowed = new Set();
  const walk = (dir, prefix = "/assets") => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const child = join(dir, entry.name);
      const publicPath = `${prefix}/${entry.name}`.replaceAll("\\", "/");
      if (entry.isDirectory()) walk(child, publicPath);
      if (entry.isFile() && /\.(png|jpe?g|webp)$/i.test(entry.name)) allowed.add(publicPath);
    }
  };
  try {
    walk(assetsDir);
  } catch {
    fallback.forEach((path) => allowed.add(path));
  }
  fallback.forEach((path) => allowed.add(path));
  if (storageConfig.mediaUploadEnabled) collectUploadedAssetOptions().forEach((path) => allowed.add(path));
  return [...allowed].sort((a, b) => a.localeCompare(b, "ka"));
}

function collectUploadedAssetOptions() {
  const allowed = new Set();
  const walk = (dir, prefix = "/uploads") => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const child = join(dir, entry.name);
      const publicPath = `${prefix}/${entry.name}`.replaceAll("\\", "/");
      if (entry.isDirectory()) walk(child, publicPath);
      if (entry.isFile() && /\.(png|jpe?g|webp)$/i.test(entry.name)) allowed.add(publicPath);
    }
  };
  try {
    walk(storageConfig.mediaUploadDir);
  } catch {}
  return [...allowed];
}

async function adminMediaUploadRoute(req, res) {
  try {
    if (!storageConfig.mediaUploadEnabled) {
      return sendJson(res, 503, { success: false, message: "Media upload is disabled until persistent storage is configured." });
    }
    const file = await readMultipartImage(req);
    const safeName = safeUploadName(file.filename, file.contentType);
    const targetPath = resolve(storageConfig.mediaUploadDir, safeName);
    const uploadRoot = resolve(storageConfig.mediaUploadDir);
    if (!targetPath.startsWith(`${uploadRoot}\\`) && !targetPath.startsWith(`${uploadRoot}/`)) throw new Error("Unsafe upload path");
    writeFileSync(targetPath, file.buffer);
    return sendJson(res, 201, { success: true, path: `/uploads/${safeName}` });
  } catch (error) {
    return sendJson(res, 400, { success: false, message: error.message || "Upload failed" });
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

async function readRaw(req, maxBytes) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > maxBytes) throw new Error("File is too large");
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

async function readMultipartImage(req) {
  const contentType = String(req.headers["content-type"] || "");
  const boundaryMatch = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/i);
  const boundary = boundaryMatch?.[1] || boundaryMatch?.[2];
  if (!boundary) throw new Error("Multipart boundary is missing");
  const raw = await readRaw(req, 3 * 1024 * 1024 + 64 * 1024);
  const parts = raw.toString("latin1").split(`--${boundary}`);
  for (const part of parts) {
    if (!part.includes("Content-Disposition") || !part.includes("filename=")) continue;
    const headerEnd = part.indexOf("\r\n\r\n");
    if (headerEnd === -1) continue;
    const headers = part.slice(0, headerEnd);
    let payload = part.slice(headerEnd + 4);
    if (payload.endsWith("\r\n")) payload = payload.slice(0, -2);
    const buffer = Buffer.from(payload, "latin1");
    const filename = headers.match(/filename="([^"]*)"/i)?.[1] || "upload";
    const fileType = headers.match(/Content-Type:\s*([^\r\n]+)/i)?.[1]?.trim().toLowerCase() || "";
    validateImageUpload(buffer, filename, fileType);
    return { buffer, filename, contentType: fileType };
  }
  throw new Error("Image file is missing");
}

function validateImageUpload(buffer, filename, contentType) {
  if (!buffer.length) throw new Error("Image file is empty");
  if (buffer.length > 3 * 1024 * 1024) throw new Error("Image file must be 3MB or smaller");
  if (!["image/jpeg", "image/png", "image/webp"].includes(contentType)) throw new Error("Only JPG, PNG, and WebP images are allowed");
  const lowerName = String(filename || "").toLowerCase();
  if (/\.(svg|html?|js|mjs|exe|bat|cmd|ps1|php|sh)$/i.test(lowerName)) throw new Error("This file type is not allowed");
  const isPng = buffer.length > 8 && buffer[0] === 0x89 && buffer.slice(1, 4).toString("ascii") === "PNG";
  const isJpeg = buffer.length > 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  const isWebp = buffer.length > 12 && buffer.slice(0, 4).toString("ascii") === "RIFF" && buffer.slice(8, 12).toString("ascii") === "WEBP";
  if (contentType === "image/png" && !isPng) throw new Error("PNG file signature is invalid");
  if (contentType === "image/jpeg" && !isJpeg) throw new Error("JPEG file signature is invalid");
  if (contentType === "image/webp" && !isWebp) throw new Error("WebP file signature is invalid");
}

function safeUploadName(filename, contentType) {
  const extByType = { "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp" };
  const original = String(filename || "image").replace(/\.[^.]+$/, "");
  const base = original.toLowerCase().replace(/[^a-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "image";
  return `${Date.now()}-${randomBytes(4).toString("hex")}-${base}${extByType[contentType]}`;
}

function safeJson(raw) {
  try { return JSON.parse(raw); } catch { const m = String(raw || "").match(/\{[\s\S]*\}/); try { return m ? JSON.parse(m[0]) : null; } catch { return null; } }
}
function isAdminPath(pathname) {
  return pathname === "/admin" || pathname === "/admin/";
}

async function serveAdminShell(res, method = "GET") {
  const headers = { "Content-Type": mimeTypes[".html"], "Cache-Control": "no-cache" };
  res.writeHead(200, headers);
  if (method === "HEAD") return res.end();
  res.end(injectBuildMarkers(await readFile(indexPath, "utf8")));
}

function serveAdminFallback(res) {
  const html = `<!doctype html>
<html lang="ka">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>ადმინის შესვლა | მედ ამბულატორია</title>
  </head>
  <body>
    <main style="font-family: system-ui, sans-serif; max-width: 520px; margin: 12vh auto; padding: 24px;">
      <h1>ადმინის შესვლა</h1>
      <p>ადმინის გვერდი დროებით ვერ ჩაიტვირთა. სცადეთ გვერდის განახლება ან დაუკავშირდით ადმინისტრატორს.</p>
      <a href="/admin">განახლება</a>
    </main>
  </body>
</html>`;
  res.writeHead(200, { "Content-Type": mimeTypes[".html"], "Cache-Control": "no-cache" });
  res.end(html);
}

async function serveStatic(res, pathname, method = "GET") {
  if (pathname.startsWith("/uploads/")) return serveUploadAsset(res, pathname, method);
  let filePath = pathname === "/" ? indexPath : join(publicDir, pathname);
  if (!existsSync(filePath) || !filePath.startsWith(publicDir)) filePath = indexPath;
  const ext = extname(filePath);
  const headers = { "Content-Type": mimeTypes[ext] || "application/octet-stream" };
  if ([".png", ".jpg", ".jpeg", ".webp"].includes(ext)) headers["Cache-Control"] = "public, max-age=3600";
  if ([".css", ".js", ".html"].includes(ext)) headers["Cache-Control"] = "no-cache";
  if (pathname === "/build-info.json") {
    headers["Cache-Control"] = "no-store, no-cache, must-revalidate, proxy-revalidate";
    headers["Pragma"] = "no-cache";
    headers["Expires"] = "0";
    headers["Surrogate-Control"] = "no-store";
  }
  res.writeHead(200, headers);
  if (method === "HEAD") return res.end();
  if (filePath === indexPath) return res.end(injectBuildMarkers(await readFile(filePath, "utf8")));
  res.end(await readFile(filePath));
}

async function serveUploadAsset(res, pathname, method = "GET") {
  if (!storageConfig.mediaUploadEnabled) return sendJson(res, 404, { error: "Upload storage is disabled" });
  const relativePath = pathname.replace(/^\/uploads\//, "");
  if (!/^[A-Za-z0-9/_-]+\.(png|jpg|jpeg|webp)$/i.test(relativePath) || relativePath.includes("..") || relativePath.includes("\\")) {
    return sendJson(res, 404, { error: "File not found" });
  }
  const uploadRoot = resolve(storageConfig.mediaUploadDir);
  const filePath = resolve(uploadRoot, relativePath);
  if (!filePath.startsWith(`${uploadRoot}\\`) && !filePath.startsWith(`${uploadRoot}/`)) return sendJson(res, 404, { error: "File not found" });
  if (!existsSync(filePath)) return sendJson(res, 404, { error: "File not found" });
  const ext = extname(filePath).toLowerCase();
  res.writeHead(200, { "Content-Type": mimeTypes[ext] || "application/octet-stream", "Cache-Control": "public, max-age=3600" });
  if (method === "HEAD") return res.end();
  res.end(await readFile(filePath));
}

function sendJson(res, status, payload) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

function sendDeploymentJson(res) {
  return sendNoStoreJson(res, 200, deploymentInfo);
}

function sendNoStoreJson(res, status, payload) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    "Pragma": "no-cache",
    "Expires": "0",
    "Surrogate-Control": "no-store"
  });
  res.end(JSON.stringify(payload));
}

function injectBuildMarkers(html) {
  return String(html)
    .replaceAll("__BUILD_COMMIT__", escapeHtmlAttr(deploymentInfo.commit))
    .replaceAll("__BUILD_VERSION__", escapeHtmlAttr(deploymentInfo.version))
    .replaceAll("__BUILD_TIME__", escapeHtmlAttr(deploymentInfo.buildTime));
}

function readBuildInfo() {
  try {
    return JSON.parse(readFileSync(buildInfoPath, "utf8"));
  } catch {
    return {};
  }
}

function escapeHtmlAttr(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
}
