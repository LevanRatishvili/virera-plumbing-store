const money = (value) => `${Number(value).toFixed(0)} ლარი`;
const state = {
  config: null,
  categories: [],
  products: [],
  adminProducts: [],
  brands: [],
  orders: [],
  messages: null,
  importRows: [],
  importResult: null,
  cart: JSON.parse(localStorage.getItem("cart") || "[]"),
  wishlist: JSON.parse(localStorage.getItem("wishlist") || "[]"),
  recent: JSON.parse(localStorage.getItem("recent") || "[]"),
  filters: { q: "", category: "", brand: "", minPrice: "", maxPrice: "", stock: "", sale: false, status: "", sort: "featured" },
  route: route()
};

const nav = [
  ["/", "შოურუმი"],
  ["/shop", "კატალოგი"],
  ["/categories", "კატეგორიები"],
  ["/brands", "ბრენდები"],
  ["/delivery", "მიწოდება"],
  ["/contact", "კონტაქტი"],
  ["/admin", "ადმინი"]
];

const app = document.querySelector("#app");
init();

function route() {
  return location.hash.replace("#", "").split("?")[0] || "/";
}

async function init() {
  renderShell();
  await loadData();
  render();
  window.addEventListener("hashchange", () => {
    closeTransientUi();
    state.route = route();
    render();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeTransientUi();
  });
}

async function loadData() {
  const [config, categories, products, brands] = await Promise.all([
    api("/api/config"),
    api("/api/categories"),
    api("/api/products"),
    api("/api/brands")
  ]);
  Object.assign(state, { config, categories, products, brands });
}

function renderShell() {
  app.innerHTML = `
    <header class="topbar">
      <div class="container topbar-grid">
        <a class="brand" href="#/"><span>AP</span><strong>AquaPro Gori</strong></a>
        <label class="site-search"><input id="globalSearch" placeholder="მოძებნეთ ონკანი, ვენტილი, მილი..." /><button id="globalSearchBtn">ძებნა</button></label>
        <nav>${nav.map(([href, label]) => `<a href="#${href}" data-route="${href}">${label}</a>`).join("")}</nav>
        <div class="header-actions">
          <a href="#/wishlist">♡ <b id="wishCount">0</b></a>
          <a class="cart-link" href="#/cart">შეკვეთა <b id="cartCount">0</b></a>
          <button id="mobileMenu">☰</button>
        </div>
      </div>
    </header>
    <main id="page"></main>
    <div id="assistantMount"></div>
    <footer id="footer"></footer>
  `;
  document.querySelector("#globalSearchBtn").addEventListener("click", () => {
    const q = document.querySelector("#globalSearch").value.trim();
    location.hash = `#/search?q=${encodeURIComponent(q)}`;
  });
  document.querySelector("#globalSearch").addEventListener("keydown", (event) => {
    if (event.key === "Enter") document.querySelector("#globalSearchBtn").click();
  });
  document.querySelector("#mobileMenu").addEventListener("click", () => {
    closeCatalogFilters();
    document.querySelector("#assistant")?.classList.remove("open");
    document.querySelector("nav").classList.toggle("open");
  });
}

function render() {
  closeTransientUi();
  document.querySelectorAll("[data-route]").forEach((a) => a.classList.toggle("active", a.dataset.route === state.route));
  const page = document.querySelector("#page");
  if (state.route.startsWith("/product/")) page.innerHTML = productPage(Number(state.route.split("/").pop()));
  else page.innerHTML = ({
    "/": homePage,
    "/shop": shopPage,
    "/categories": categoriesPage,
    "/cart": cartPage,
    "/checkout": checkoutPage,
    "/wishlist": wishlistPage,
    "/search": searchPage,
    "/brands": brandsPage,
    "/about": aboutPage,
    "/contact": contactPage,
    "/faq": faqPage,
    "/delivery": deliveryPage,
    "/admin": adminPage
  }[state.route] || homePage)();
  renderAssistant();
  renderQuickView();
  renderFooter();
  bindPage();
  updateCounts();
  enhanceMedia();
  scrollTo({ top: 0, behavior: "instant" });
}

function homePage() {
  const best = state.products.filter((p) => p.isBestSeller).slice(0, 4);
  const fresh = state.products.filter((p) => p.isNew).slice(0, 4);
  return `
    <section class="hero">
      <div class="hero-bg"><img src="/assets/plumb-hero.png" alt="Premium bathroom showroom" /></div>
      <div class="container hero-inner">
        <div>
          <span class="eyebrow">პრემიუმ სანტექნიკის შოურუმი გორში</span>
          <h1>აბაზანისა და სამზარეულოს ელეგანტური არჩევანი გორისთვის.</h1>
          <p>შეარჩიეთ პრემიუმ ონკანები, შხაპები, ნიჟარები, უნიტაზები, ვენტილები და სამონტაჟო მასალები. გაგზავნეთ შეკვეთის მოთხოვნა და დაგიდასტურებთ ტელეფონით.</p>
          <div class="buttons"><a class="btn" href="#/shop">შეკვეთის გაგზავნა</a><a class="btn ghost" href="tel:+995599123456">დარეკვა</a><button class="btn ghost" data-open-assistant>ოპერატორთან დაკავშირება</button></div>
        </div>
        <aside class="hero-card">
          <strong>მიწოდება გორის ტერიტორიაზე</strong>
          <p>შეკვეთას დაგიდასტურებთ ტელეფონით. გადახდა შესაძლებელია ნაღდი ანგარიშსწორებით ან მობილური ბანკით, დადასტურების შემდეგ.</p>
          <div class="mini-grid"><span>პრემიუმ ბრენდები</span><span>მარაგი ადგილზე</span><span>გორის ზონა</span><span>ოპერატორის რჩევა</span></div>
        </aside>
      </div>
    </section>
    ${promoSlider()}
    ${premiumTrustBadges()}
    ${categoryStrip()}
    ${luxuryCta()}
    ${orderSteps()}
    ${productSection("ბესტსელერები", "გორში ყველაზე ხშირად მოთხოვნილი პრემიუმ პროდუქტები", best)}
    ${productSection("ახალი კოლექცია", "ახალი აბაზანისა და სამზარეულოს დეტალები", fresh)}
    ${whyBuy()}
    ${gallery()}
    ${reviews()}
  `;
}

function promoSlider() {
  return `<section class="promo"><div class="container promo-grid">
    <article><img src="/assets/plumb-lifestyle.png" alt="ლუქს აბაზანა"><div><b>ლუქს აბაზანის განწყობა</b><span>დეტალები, რომლებიც სივრცეს ძვირად და მშვიდად აჩენს.</span></div></article>
    <article><img src="/assets/plumb-supplies.png" alt="პრემიუმ სამონტაჟო მასალები"><div><b>სანდო სამონტაჟო ბაზა</b><span>მილები, ფიტინგები, ვენტილები და ტუმბოები გორის ობიექტებისთვის.</span></div></article>
  </div></section>`;
}

function premiumTrustBadges() {
  return `<section class="section compact"><div class="container trust-badges">
    <article><b>გორისთვის მზად</b><span>მიწოდება მხოლოდ გორის ტერიტორიაზე</span></article>
    <article><b>ტელეფონით დადასტურება</b><span>ოპერატორი აზუსტებს მარაგს, დროს და ჯამს</span></article>
    <article><b>პრემიუმ ვიზუალი</b><span>აბაზანისა და სამზარეულოს ელეგანტური არჩევანი</span></article>
    <article><b>მარტივი მოთხოვნა</b><span>სახელი, ტელეფონი, პროდუქტები და კომენტარი</span></article>
  </div></section>`;
}

function luxuryCta() {
  return `<section class="section showroom-cta"><div class="container cta-grid">
    <div>
      <span class="eyebrow">გორის ადგილობრივი შოურუმი</span>
      <h2>აირჩიეთ მშვიდად. ჩვენ დაგირეკავთ და შეკვეთას დავაზუსტებთ.</h2>
      <p>კალათაში დაამატეთ სასურველი პროდუქტები, მიუთითეთ რაოდენობა და კომენტარი. ოპერატორი დაგიკავშირდებათ ფასის, მარაგისა და მიწოდების დროის დასადასტურებლად.</p>
      <div class="buttons"><a class="btn" href="#/cart">შეკვეთის გაგზავნა</a><button class="btn ghost" data-open-assistant>ოპერატორთან დაკავშირება</button></div>
    </div>
    <img src="/assets/plumb-lifestyle.png" alt="პრემიუმ აბაზანის შოურუმი">
  </div></section>`;
}

function orderSteps() {
  const steps = [
    ["1", "ირჩევ პროდუქტს", "დაათვალიერეთ კატალოგი, შეადარეთ ბრენდები და დაამატეთ სასურველი პროდუქტი შეკვეთაში."],
    ["2", "აგზავნი შეკვეთას", "მიუთითეთ სახელი, ტელეფონი, რაოდენობა და კომენტარი. მისამართების რთული ფორმა არ გჭირდებათ."],
    ["3", "გიკავშირდებით ტელეფონით", "ოპერატორი დაგიდასტურებთ მარაგს, სავარაუდო ჯამს და მიწოდების დროს."],
    ["4", "იღებ შეკვეთას გორის ტერიტორიაზე", "შეთანხმებულ დროს მიიღებთ შეკვეთას გორის ტერიტორიაზე."]
  ];
  return `<section class="section steps-section"><div class="container"><div class="section-head"><div><span class="eyebrow">მარტივი პროცესი</span><h2>როგორ მუშაობს შეკვეთა</h2><p>პირველი ვერსია მაქსიმალურად მარტივია: არჩევთ, გვიგზავნით მოთხოვნას და ჩვენ გირეკავთ დასადასტურებლად.</p></div><a href="#/shop">კატალოგის ნახვა</a></div><div class="steps-grid">${steps.map(([n, title, text]) => `<article><strong>${n}</strong><h3>${title}</h3><p>${text}</p></article>`).join("")}</div></div></section>`;
}

function categoryStrip() {
  return `<section class="section"><div class="container"><div class="section-head"><h2>რჩეული კატეგორიები</h2><a href="#/categories">ყველას ნახვა</a></div><div class="category-grid">${state.categories.slice(0, 8).map(categoryCard).join("")}</div></div></section>`;
}

function shopPage() {
  return `<section class="page-hero"><img src="/assets/plumb-supplies.png" alt="პროდუქტები"><div class="container"><h1>პრემიუმ კატალოგი</h1><p>შეარჩიეთ აბაზანის, სამზარეულოსა და მონტაჟის პროდუქტები. დაამატეთ შეკვეთაში და ოპერატორი დაგიკავშირდებათ გორის მიწოდების დასადასტურებლად.</p></div></section>${catalogLayout(filteredCatalogProducts())}`;
}

function searchPage() {
  const params = new URLSearchParams(location.hash.split("?")[1] || "");
  const q = params.get("q") || "";
  return `<section class="page-hero small"><img src="/assets/plumb-lifestyle.png" alt="ძებნა"><div class="container"><h1>ძებნის შედეგები</h1><p>შედეგები: “${escapeHtml(q)}”</p></div></section>${catalogLayout(state.products.filter((p) => `${p.title} ${p.brand} ${p.categoryTitle} ${p.description}`.toLowerCase().includes(q.toLowerCase())), q)}`;
}

function catalogLayout(products, initialQ = "") {
  const brands = state.brands.map((b) => b.brand);
  const q = initialQ || state.filters.q;
  return `<section class="section catalog-section"><div class="container">
    <div class="catalog-mobile-bar"><button class="btn" id="openFilters">ფილტრები</button><span id="mobileResultCount">${products.length} პროდუქტი</span></div>
    <div class="catalog">
      <button class="filter-scrim" id="filterScrim" aria-label="Close filters"></button>
      <aside class="filters" id="catalogFilters">
        <div class="filter-head"><h3>ფილტრები</h3><button id="closeFilters">×</button></div>
        <input id="filterQ" placeholder="სახელი, SKU ან აღწერა" value="${escapeHtml(q)}" />
        <select id="filterCategory"><option value="">ყველა კატეგორია</option>${state.categories.map((c) => `<option value="${c.slug}" ${state.filters.category === c.slug ? "selected" : ""}>${c.title}</option>`).join("")}</select>
        <select id="filterBrand"><option value="">ყველა ბრენდი</option>${brands.map((b) => `<option ${state.filters.brand === b ? "selected" : ""}>${b}</option>`).join("")}</select>
        <div class="range-row"><input id="filterMinPrice" type="number" min="0" placeholder="მინ. ფასი" value="${escapeHtml(state.filters.minPrice)}"><input id="filterMaxPrice" type="number" min="0" placeholder="მაქს. ფასი" value="${escapeHtml(state.filters.maxPrice)}"></div>
        <select id="filterStock"><option value="">ყველა მარაგი</option><option value="in-stock" ${state.filters.stock === "in-stock" ? "selected" : ""}>მარაგშია</option><option value="low-stock" ${state.filters.stock === "low-stock" ? "selected" : ""}>დაბალი მარაგი</option><option value="out-of-stock" ${state.filters.stock === "out-of-stock" ? "selected" : ""}>არ არის მარაგში</option></select>
        <select id="filterStatus"><option value="">აქტიური პროდუქტები</option><option value="active" ${state.filters.status === "active" ? "selected" : ""}>აქტიური</option><option value="draft" ${state.filters.status === "draft" ? "selected" : ""}>დრაფტი</option><option value="hidden" ${state.filters.status === "hidden" ? "selected" : ""}>დამალული</option><option value="archived" ${state.filters.status === "archived" ? "selected" : ""}>არქივი</option></select>
        <label class="check-row"><input id="filterSale" type="checkbox" ${state.filters.sale ? "checked" : ""}> მხოლოდ ფასდაკლება</label>
        <select id="filterSort"><option value="featured">რჩეული</option><option value="newest" ${state.filters.sort === "newest" ? "selected" : ""}>უახლესი</option><option value="price-asc" ${state.filters.sort === "price-asc" ? "selected" : ""}>ფასი ზრდადობით</option><option value="price-desc" ${state.filters.sort === "price-desc" ? "selected" : ""}>ფასი კლებადობით</option><option value="name-asc" ${state.filters.sort === "name-asc" ? "selected" : ""}>სახელი A-Z</option><option value="best-sellers" ${state.filters.sort === "best-sellers" ? "selected" : ""}>ბესტსელერები</option></select>
        <div class="filter-actions"><button class="btn" id="applyFilters">ფილტრაცია</button><button class="btn ghost" id="resetFilters">გასუფთავება</button></div>
      </aside>
      <div><div class="shop-toolbar"><strong id="resultCount">${products.length} პროდუქტი</strong><span>SKU, მარაგი, ფასდაკლება და სწრაფი მოქმედებები.</span></div><div class="product-grid" id="productGrid">${products.map(productCard).join("")}</div></div>
    </div>
  </div></section>`;
}

function categoriesPage() {
  return `<section class="page-hero small"><img src="/assets/plumb-hero.png" alt="კატეგორიები"><div class="container"><h1>შოურუმის კატეგორიები</h1><p>აბაზანა, სამზარეულო, წყალმომარაგება, დრენაჟი, გათბობა და პროფესიონალური მონტაჟი ერთ მოწესრიგებულ კატალოგში.</p></div></section><section class="section"><div class="container category-grid wide">${state.categories.map(categoryCard).join("")}</div></section>`;
}

function brandsPage() {
  return `<section class="page-hero small"><img src="/assets/plumb-lifestyle.png" alt="ბრენდები"><div class="container"><h1>ბრენდები</h1><p>შერჩეული პრემიუმ და პროფესიონალური ბრენდები, რომლებიც გორის ობიექტებზე ყოველდღიურ გამოყენებას უძლებს.</p></div></section><section class="section"><div class="container brand-grid">${state.brands.map((b) => `<article><strong>${b.brand}</strong><span>${b.count} პროდუქტი</span><a href="#/shop" data-brand="${b.brand}">ბრენდის ნახვა</a></article>`).join("")}</div></section>`;
}

function productPage(id) {
  const product = state.products.find((p) => p.id === id) || state.products[0];
  addRecent(product.id);
  const relatedPool = state.products.filter((p) => p.id !== product.id && (p.categorySlug === product.categorySlug || p.brand === product.brand));
  const related = (relatedPool.length ? relatedPool : state.products.filter((p) => p.id !== product.id)).slice(0, 4);
  return `<section class="section"><div class="container product-detail">
    <div class="gallery-box">${product.gallery.map((src, index) => `<img class="${index === 0 ? "main-shot" : ""}" src="${src}" alt="${escapeHtml(product.title)}">`).join("")}</div>
    <div class="buy-box">
      <span class="eyebrow">SKU: ${product.sku}</span>
      <h1>${product.title}</h1>
      <div class="product-meta"><span>${product.brand}</span><span>${product.categoryTitle}</span><span>${product.reviews} შეფასება</span></div>
      <div class="price detail-price">${priceHtml(product)}</div>
      <div class="stock-badge ${product.stock > 0 ? "ok" : "low"}">${product.stock > 0 ? `${product.stock} ერთეული მარაგშია` : "არ არის მარაგში"}</div>
      <label>ვარიანტი<select id="variantSelect">${product.variants.map((v) => `<option>${v}</option>`).join("")}</select></label>
      <label>რაოდენობა<input id="detailQty" type="number" min="1" max="99" value="1"></label>
      <div class="buttons"><button class="btn" data-add="${product.id}" data-qty-source="detailQty">შეკვეთაში დამატება</button><button class="btn ghost" data-wish="${product.id}">სურვილებში</button><button class="btn ghost" data-open-assistant>ოპერატორთან დაკავშირება</button></div>
      <p>${product.description}</p>
      <h2>სპეციფიკაციები</h2>
      <div class="spec-table">${Object.entries(product.specs).map(([k, v]) => `<div><span>${k}</span><b>${v}</b></div>`).join("")}</div>
    </div>
  </div></section>${productSection("მსგავსი პროდუქტები", "თავსებადი ალტერნატივები და აქსესუარები", related)}${recentSection()}`;
}

function cartPage() {
  const items = cartItems();
  return `<section class="page-hero small"><img src="/assets/plumb-supplies.png" alt="შეკვეთის კალათა"><div class="container"><h1>შეკვეთის კალათა</h1><p>გადაამოწმეთ პროდუქტები და გაგზავნეთ მარტივი მოთხოვნა. შეკვეთას დაგიდასტურებთ ტელეფონით.</p></div></section><section class="section"><div class="container cart-layout"><div class="cart-list">${items.length ? items.map(cartRow).join("") : `<div class="empty">შეკვეთის კალათა ცარიელია. <a href="#/shop">დაათვალიერეთ პრემიუმ კატალოგი</a> ან დაგვიკავშირდით ოპერატორთან.</div>`}</div>${cartSummary(items)}</div></section>`;
}

function checkoutPage() {
  const items = cartItems();
  return `<section class="page-hero small"><img src="/assets/plumb-lifestyle.png" alt="შეკვეთის მოთხოვნა"><div class="container"><h1>შეკვეთის მოთხოვნა</h1><p>მხოლოდ გორის ტერიტორია. დატოვეთ სახელი, ტელეფონი და კომენტარი; ოპერატორი დაგიკავშირდებათ დასადასტურებლად.</p></div></section><section class="section"><div class="container checkout"><form id="checkoutForm" class="panel request-form">${field("customerName", "სახელი", "text", true)}${field("phone", "ტელეფონი", "tel", true)}<label>კომენტარი<textarea name="comment" placeholder="მაგ: დამირეკეთ საღამოს, მაინტერესებს მიწოდების დრო ან თავსებადობა"></textarea></label><div class="request-note"><b>მიწოდება გორის ტერიტორიაზე</b><span>შეკვეთას დაგიდასტურებთ ტელეფონით</span><span>გადახდა: ნაღდი ან მობილური ბანკი დადასტურების შემდეგ</span></div><button class="btn" type="submit" ${items.length ? "" : "disabled"}>შეკვეთის გაგზავნა</button><div id="checkoutStatus"></div></form>${cartSummary(items)}</div></section>`;
}

function wishlistPage() {
  const items = state.products.filter((p) => state.wishlist.includes(p.id));
  return `<section class="page-hero small"><img src="/assets/plumb-lifestyle.png" alt="სურვილები"><div class="container"><h1>სურვილების სია</h1><p>შენახული პროდუქტები მოგვიანებით შესადარებლად.</p></div></section>${productSection("შენახული პროდუქტები", "თქვენი რჩეულები", items)}`;
}

function aboutPage() {
  return `<section class="page-hero"><img src="/assets/plumb-hero.png" alt="ჩვენ შესახებ"><div class="container"><h1>AquaPro Gori</h1><p>გორისთვის შექმნილი პრემიუმ სანტექნიკის ონლაინ შოურუმი, სადაც არჩევა სასიამოვნოა და შეკვეთა მარტივი.</p></div></section><section class="section"><div class="container story"><article><h2>შოურუმის გამოცდილება ონლაინ</h2><p>ვაერთიანებთ ელეგანტურ აბაზანისა და სამზარეულოს პროდუქტებს, სანდო სამონტაჟო მასალებს და ოპერატორის რეალურ დახმარებას. მომხმარებელი არჩევს, გვიგზავნის მოთხოვნას და დეტალებს ტელეფონით ვაზუსტებთ.</p></article><article><h2>ადგილობრივი სანდოობა</h2><p>პირველი ვერსია ფოკუსირებულია გორზე: მარტივი მიწოდება, სწრაფი კონტაქტი და პროდუქტის შერჩევა ზედმეტი ნაბიჯებისა და რთული ფორმების გარეშე.</p></article></div></section>`;
}

function contactPage() {
  return `<section class="page-hero small"><img src="/assets/plumb-supplies.png" alt="კონტაქტი"><div class="container"><h1>კონტაქტი</h1><p>დაგვიტოვეთ შეტყობინება ან დაგვირეკეთ. შეკვეთებს გორის ტერიტორიაზე ტელეფონით ვადასტურებთ.</p></div></section><section class="section"><div class="container contact-grid"><div class="panel contact-card"><h2>შოურუმი გორში</h2><p>${state.config.phone}<br>${state.config.email}<br>${state.config.workingHours}</p><p class="muted">სწრაფი შეკითხვისთვის დაგვირეკეთ, პროდუქტის სიისთვის კი გამოიყენეთ “შეკვეთის გაგზავნა”.</p><iframe class="map" title="მაღაზიის რუკა" src="${state.config.mapEmbed}"></iframe></div><form id="contactForm" class="panel">${field("name", "სახელი", "text", true)}${field("phone", "ტელეფონი", "tel", false)}${field("email", "ელფოსტა", "email", false)}<label>შეტყობინება<textarea name="message" placeholder="მაგ: მაინტერესებს კონკრეტული პროდუქტის მარაგი ან მიწოდების დრო" required></textarea></label><button class="btn">შეტყობინების გაგზავნა</button><div id="contactStatus"></div></form></div></section>`;
}

function faqPage() {
  const qs = [["როგორ გავაგზავნო შეკვეთა?", "დაამატეთ პროდუქტები კალათაში, მიუთითეთ სახელი, ტელეფონი და კომენტარი. შეკვეთას დაგიდასტურებთ ტელეფონით."], ["სად ხდება მიწოდება?", "მიწოდება გორის ტერიტორიაზე."], ["როგორ გადავიხდი?", "ნაღდი ანგარიშსწორებით მიწოდებისას ან მობილური ბანკით, მხოლოდ ოპერატორის დადასტურების შემდეგ."], ["თუ პროდუქტის შერჩევაში დახმარება მჭირდება?", "გამოიყენეთ ასისტენტი ან დატოვეთ ტელეფონი, ოპერატორი დაგიკავშირდებათ."]];
  return `<section class="page-hero small"><img src="/assets/plumb-lifestyle.png" alt="FAQ"><div class="container"><h1>ხშირი კითხვები</h1><p>მარტივი შეკვეთა, გორის მიწოდება და ოპერატორის დახმარება.</p></div></section><section class="section"><div class="container faq">${qs.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join("")}</div></section>`;
}

function deliveryPage() {
  return `<section class="page-hero small"><img src="/assets/plumb-supplies.png" alt="მიწოდება გორში"><div class="container"><h1>მიწოდება გორის ტერიტორიაზე</h1><p>შეკვეთას დაგიდასტურებთ ტელეფონით. დრო, მარაგი და გადახდის ფორმა ოპერატორთან შეთანხმდება.</p></div></section><section class="section"><div class="container trust-grid delivery-cards"><article><h3>გორის ზონა</h3><p>პირველი დემო ვერსია მუშაობს მხოლოდ გორის ტერიტორიაზე, რათა სერვისი იყოს სწრაფი და გასაგები.</p></article><article><h3>ტელეფონით დადასტურება</h3><p>მოთხოვნის გაგზავნის შემდეგ ოპერატორი გირეკავთ, ამოწმებს პროდუქტებს და გითანხმებთ დროს.</p></article><article><h3>გადახდა დადასტურების შემდეგ</h3><p>ნაღდი ანგარიშსწორება მიწოდებისას ან მობილური ბანკით გადარიცხვა მხოლოდ შეთანხმების შემდეგ.</p></article></div></section>${orderSteps()}`;
}

function adminPage() {
  return `<section class="page-hero small"><img src="/assets/plumb-supplies.png" alt="ადმინი"><div class="container"><h1>ადმინ პანელი</h1><p>პროდუქტები, შეკვეთის მოთხოვნები, კონტაქტები, მარაგი და ანალიტიკა.</p></div></section><section class="section"><div class="container"><div id="adminStats" class="admin-stats"></div><div id="adminAnalytics" class="admin-analytics"></div><div class="panel product-management"><div class="admin-panel-head"><div><h2>პროდუქტების მართვა</h2><p>ძიება, ფილტრაცია, დამატება, რედაქტირება, წაშლა და CSV import 2000+ პროდუქტისთვის.</p></div><div class="buttons"><button class="btn" id="addProductBtn">პროდუქტის დამატება</button><button class="btn ghost" id="openImportBtn">CSV იმპორტი</button></div></div><div class="admin-product-filters"><input id="adminProductQ" placeholder="SKU ან სახელით ძებნა"><select id="adminCategoryFilter"><option value="">ყველა კატეგორია</option></select><select id="adminBrandFilter"><option value="">ყველა ბრენდი</option></select><select id="adminStatusFilter"><option value="">ყველა სტატუსი</option><option value="active">აქტიური</option><option value="draft">დრაფტი</option><option value="hidden">დამალული</option><option value="archived">არქივი</option></select><button class="mini-btn" id="adminProductApply">ფილტრაცია</button></div><div id="adminProductsTable"></div></div><div class="admin-grid"><div class="panel"><h2>შეკვეთის მოთხოვნები</h2><div id="ordersTable"></div></div><div class="panel"><h2>მარაგის სწრაფი მართვა</h2><div id="inventoryTable"></div></div><div class="panel"><h2>კონტაქტები</h2><div id="customersTable"></div></div><div class="panel"><h2>შეტყობინებები</h2><div id="messagesTable"></div></div></div>${productModal()}${importModal()}</div></section>`;
}

function updateBodyLock() {
  const hasOpenFilters = Boolean(document.querySelector(".filters.open"));
  const hasBlockingUi = hasOpenFilters || Boolean(document.querySelector(".modal.open"));
  document.body.classList.toggle("filters-open", hasOpenFilters);
  document.body.classList.toggle("ui-locked", hasBlockingUi);
}
function openCatalogFilters() {
  document.querySelector("nav")?.classList.remove("open");
  document.querySelector("#assistant")?.classList.remove("open");
  document.querySelector("#catalogFilters")?.classList.add("open");
  updateBodyLock();
}
function closeCatalogFilters() {
  document.querySelector("#catalogFilters")?.classList.remove("open");
  updateBodyLock();
}
function closeTransientUi() {
  document.querySelector("nav")?.classList.remove("open");
  document.querySelector("#assistant")?.classList.remove("open");
  document.querySelector("#catalogFilters")?.classList.remove("open");
  document.querySelectorAll(".modal.open").forEach((modal) => modal.classList.remove("open"));
  updateBodyLock();
}

function bindPage() {
  document.querySelectorAll("[data-add]").forEach((b) => b.addEventListener("click", () => addCart(Number(b.dataset.add), Number(document.querySelector(`#${b.dataset.qtySource}`)?.value || 1))));
  document.querySelectorAll("[data-wish]").forEach((b) => b.addEventListener("click", () => toggleWish(Number(b.dataset.wish))));
  document.querySelectorAll("[data-quick]").forEach((b) => b.addEventListener("click", () => openQuickView(Number(b.dataset.quick))));
  document.querySelectorAll("[data-remove]").forEach((b) => b.addEventListener("click", () => removeCart(Number(b.dataset.remove))));
  document.querySelectorAll("[data-category]").forEach((b) => b.addEventListener("click", () => {
    state.filters.category = b.dataset.category;
    state.filters.brand = "";
  }));
  document.querySelectorAll("[data-brand]").forEach((b) => b.addEventListener("click", () => {
    state.filters.brand = b.dataset.brand;
    state.filters.category = "";
  }));
  document.querySelector("#applyFilters")?.addEventListener("click", applyFilters);
  document.querySelector("#resetFilters")?.addEventListener("click", resetFilters);
  document.querySelector("#openFilters")?.addEventListener("click", openCatalogFilters);
  document.querySelector("#closeFilters")?.addEventListener("click", closeCatalogFilters);
  document.querySelector("#filterScrim")?.addEventListener("click", closeCatalogFilters);
  document.querySelector("#checkoutForm")?.addEventListener("submit", checkout);
  document.querySelector("#contactForm")?.addEventListener("submit", contact);
  document.querySelectorAll("[data-open-assistant]").forEach((b) => b.addEventListener("click", openAssistant));
  if (state.route === "/admin") loadAdmin();
}

function applyFilters() {
  state.filters.q = document.querySelector("#filterQ").value.trim();
  state.filters.category = document.querySelector("#filterCategory").value;
  state.filters.brand = document.querySelector("#filterBrand").value;
  state.filters.minPrice = document.querySelector("#filterMinPrice").value.trim();
  state.filters.maxPrice = document.querySelector("#filterMaxPrice").value.trim();
  state.filters.stock = document.querySelector("#filterStock").value;
  state.filters.sale = document.querySelector("#filterSale").checked;
  state.filters.status = document.querySelector("#filterStatus").value;
  state.filters.sort = document.querySelector("#filterSort").value;
  const products = filteredCatalogProducts();
  document.querySelector("#productGrid").innerHTML = products.map(productCard).join("") || `<div class="empty">ამ ფილტრებით პროდუქტი ვერ მოიძებნა. შეცვალეთ ფასი, ბრენდი ან დაგვიკავშირდით ოპერატორთან.</div>`;
  document.querySelector("#resultCount").textContent = `${products.length} პროდუქტი`;
  document.querySelector("#mobileResultCount").textContent = `${products.length} პროდუქტი`;
  closeCatalogFilters();
  bindPage();
}

function filteredCatalogProducts() {
  const q = state.filters.q.toLowerCase();
  let products = state.products.filter((p) => (p.status || "active") === "active");
  if (state.filters.status) products = state.products.filter((p) => (p.status || "active") === state.filters.status);
  const min = Number(state.filters.minPrice);
  const max = Number(state.filters.maxPrice);
  products = products.filter((p) => (!q || `${p.sku} ${p.title} ${p.name} ${p.brand} ${p.description}`.toLowerCase().includes(q)) && (!state.filters.category || p.categorySlug === state.filters.category) && (!state.filters.brand || p.brand === state.filters.brand));
  if (Number.isFinite(min) && min > 0) products = products.filter((p) => effectivePrice(p) >= min);
  if (Number.isFinite(max) && max > 0) products = products.filter((p) => effectivePrice(p) <= max);
  if (state.filters.stock === "in-stock") products = products.filter((p) => p.stock > 0);
  if (state.filters.stock === "low-stock") products = products.filter((p) => p.stock > 0 && p.stock <= 10);
  if (state.filters.stock === "out-of-stock") products = products.filter((p) => p.stock <= 0);
  if (state.filters.sale) products = products.filter(hasDiscount);
  if (state.filters.sort === "price-asc") products.sort((a, b) => effectivePrice(a) - effectivePrice(b));
  if (state.filters.sort === "price-desc") products.sort((a, b) => effectivePrice(b) - effectivePrice(a));
  if (state.filters.sort === "rating") products.sort((a, b) => b.rating - a.rating);
  if (state.filters.sort === "newest") products.sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
  if (state.filters.sort === "name-asc") products.sort((a, b) => a.title.localeCompare(b.title, "ka"));
  if (state.filters.sort === "best-sellers") products.sort((a, b) => Number(b.isBestSeller) - Number(a.isBestSeller) || b.reviews - a.reviews);
  return products;
}

function effectivePrice(product) {
  const price = Number(product.price);
  const sale = Number(product.salePrice);
  return Number.isFinite(sale) && sale > 0 && sale < price ? sale : price;
}
function comparePrice(product) {
  const price = Number(product.price);
  const sale = Number(product.salePrice);
  if (Number.isFinite(sale) && sale > price) return sale;
  if (Number.isFinite(sale) && sale > 0 && sale < price) return price;
  return null;
}
function hasDiscount(product) { return Boolean(comparePrice(product)); }
function priceHtml(product) {
  const old = comparePrice(product);
  return `<strong>${money(effectivePrice(product))}</strong>${old ? `<s>${money(old)}</s>` : ""}`;
}

function resetFilters() {
  state.filters = { q: "", category: "", brand: "", minPrice: "", maxPrice: "", stock: "", sale: false, status: "", sort: "featured" };
  render();
}

function productCard(p) {
  return `<article class="product-card"><a href="#/product/${p.id}" class="product-img"><img src="${p.imageUrl}" alt="${escapeHtml(p.title)}">${p.isNew ? "<span>ახალი</span>" : ""}${hasDiscount(p) ? "<span class=\"sale-badge\">SALE</span>" : ""}</a><div><small>${p.brand} · ${p.categoryTitle}</small><h3>${p.title}</h3><div class="sku-line">SKU: ${escapeHtml(p.sku)}</div><p>${p.description}</p><div class="price">${priceHtml(p)}</div><div class="stock-badge ${p.stock > 0 ? "ok" : "low"}">${p.stock > 0 ? `${p.stock} მარაგშია` : "არ არის მარაგში"}</div><div class="card-actions triple"><button data-add="${p.id}">შეკვეთაში</button><button data-wish="${p.id}" title="სურვილებში">♡</button><button data-quick="${p.id}" title="სწრაფი ნახვა">ნახვა</button></div></div></article>`;
}

function categoryCard(c) {
  return `<a class="category-card ${state.filters.category === c.slug ? "selected" : ""}" href="#/shop" data-category="${c.slug}"><img src="${c.imageUrl}" alt="${c.title}"><strong>${c.title}</strong><span>${c.description}</span></a>`;
}

function productSection(title, subtitle, products) {
  return `<section class="section"><div class="container"><div class="section-head"><div><h2>${title}</h2><p>${subtitle}</p></div><a href="#/shop">ყველას ნახვა</a></div><div class="product-grid product-carousel">${products.length ? products.map(productCard).join("") : `<div class="empty">ამ სექციაში პროდუქტები მალე დაემატება. მანამდე შეგიძლიათ კატალოგის დათვალიერება ან ოპერატორთან დაკავშირება.</div>`}</div></div></section>`;
}

function whyBuy() {
  return `<section class="trust"><div class="container trust-grid"><article><b>გორზე ფოკუსი</b><span>მიწოდება გორის ტერიტორიაზე</span></article><article><b>ტელეფონით დადასტურება</b><span>ოპერატორი შეგითანხმებთ მარაგს და დროს</span></article><article><b>პრემიუმ არჩევანი</b><span>აბაზანა, სამზარეულო და მონტაჟი ერთ სივრცეში</span></article><article><b>მარტივი გადახდა</b><span>ნაღდი ან მობილური ბანკი დადასტურების შემდეგ</span></article></div></section>`;
}
function gallery() { return `<section class="section"><div class="container gallery"><img src="/assets/plumb-hero.png" alt="აბაზანის შოურუმი"><img src="/assets/plumb-supplies.png" alt="მარაგი"><img src="/assets/plumb-lifestyle.png" alt="ინტერიერი"></div></section>`; }
function reviews() { return `<section class="section reviews"><div class="container"><h2>გორის მომხმარებლებისთვის</h2><div class="review-grid"><article>“კალათით გავაგზავნე მოთხოვნა და მალევე დამირეკეს. ზუსტად ის მოდელები შემირჩიეს, რაც აბაზანას უხდება.”<b>ბინის მეპატრონე, გორი</b></article><article>“ფიტინგები და ვენტილები ერთ შეკვეთაში ავიღეთ, რაოდენობაც ტელეფონით დაგვიზუსტეს.”<b>მემონტაჟე</b></article><article>“საიტზე არჩევა სასიამოვნოა, მერე ოპერატორი გირეკავს და ყველაფერს მარტივად ასრულებ.”<b>ახალი სახლის მფლობელი</b></article></div></div></section>`; }
function recentSection() { const items = state.products.filter((p) => state.recent.includes(p.id)).slice(0, 4); return items.length ? productSection("ბოლო ნანახი", "გააგრძელეთ შედარება", items) : ""; }

function addCart(id, quantity = 1) {
  const found = state.cart.find((i) => i.productId === id);
  const qty = Math.max(1, Math.min(99, Number(quantity || 1)));
  if (found) found.quantity += qty; else state.cart.push({ productId: id, quantity: qty });
  saveCart();
  toast("შეკვეთაში დაემატა");
}
function removeCart(id) {
  state.cart = state.cart.filter((i) => i.productId !== id);
  saveCart();
  render();
  toast("შეკვეთიდან წაიშალა");
}
function toggleWish(id) {
  state.wishlist = state.wishlist.includes(id) ? state.wishlist.filter((x) => x !== id) : [...state.wishlist, id];
  localStorage.setItem("wishlist", JSON.stringify(state.wishlist));
  updateCounts();
  toast("სურვილების სია განახლდა");
}
function addRecent(id) {
  state.recent = [id, ...state.recent.filter((x) => x !== id)].slice(0, 8);
  localStorage.setItem("recent", JSON.stringify(state.recent));
}
function saveCart() { localStorage.setItem("cart", JSON.stringify(state.cart)); updateCounts(); }
function updateCounts() {
  document.querySelector("#cartCount").textContent = state.cart.reduce((s, i) => s + i.quantity, 0);
  document.querySelector("#wishCount").textContent = state.wishlist.length;
}
function cartItems() { return state.cart.map((i) => ({ ...i, product: state.products.find((p) => p.id === i.productId) })).filter((i) => i.product); }
function cartRow(item) { return `<article class="cart-row"><img src="${item.product.imageUrl}" alt="${item.product.title}"><div><h3>${item.product.title}</h3><span>${item.product.sku}</span></div><b>${item.quantity} × ${money(effectivePrice(item.product))}</b><button data-remove="${item.productId}">წაშლა</button></article>`; }
function cartSummary(items) {
  const subtotal = items.reduce((s, i) => s + i.quantity * effectivePrice(i.product), 0);
  return `<aside class="summary"><h2>შეკვეთის შეჯამება</h2><div><span>პროდუქტები</span><b>${items.length}</b></div><div><span>სავარაუდო ჯამი</span><b>${money(subtotal)}</b></div><div><span>მიწოდება</span><b>გორის ტერიტორია</b></div><p class="muted">საბოლოო ხელმისაწვდომობას და დროს ოპერატორი დაგიდასტურებთ ტელეფონით.</p><strong>${money(subtotal)}</strong><a class="btn" href="#/checkout">შეკვეთის გაგზავნა</a><a class="btn ghost" href="tel:+995599123456">დარეკვა</a></aside>`;
}
async function checkout(event) {
  event.preventDefault();
  const items = cartItems();
  const payload = Object.fromEntries(new FormData(event.currentTarget));
  payload.items = items.map((i) => ({ productId: i.productId, quantity: i.quantity }));
  const status = document.querySelector("#checkoutStatus");
  try {
    const result = await api("/api/orders", { method: "POST", body: payload });
    state.cart = [];
    saveCart();
    status.innerHTML = `<div class="success">მოთხოვნა #${result.order.id} მიღებულია. ოპერატორი დაგიკავშირდებათ ტელეფონით და დაგიდასტურებთ მარაგს, ჯამს და გორის მიწოდების დროს.</div>`;
  } catch (error) {
    status.innerHTML = `<div class="error">${error.message}</div>`;
  }
}
async function contact(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const status = document.querySelector("#contactStatus");
  try { const result = await api("/api/contact", { method: "POST", body: Object.fromEntries(new FormData(form)) }); status.innerHTML = `<div class="success">${result.message}</div>`; form.reset(); }
  catch (error) { status.innerHTML = `<div class="error">${error.message}</div>`; }
}
async function loadAdmin() {
  const [orders, customers, messages, adminProducts] = await Promise.all([api("/api/orders"), api("/api/customers"), api("/api/contact-messages"), api("/api/admin/products")]);
  state.adminProducts = adminProducts;
  const revenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
  const lowStock = adminProducts.filter((p) => p.stock <= 10).length;
  document.querySelector("#adminStats").innerHTML = `<article><b>${adminProducts.length}</b><span>პროდუქტი</span></article><article><b>${orders.length}</b><span>შეკვეთის მოთხოვნა</span></article><article><b>${customers.length}</b><span>კონტაქტი</span></article><article><b>${adminProducts.reduce((s, p) => s + p.stock, 0)}</b><span>მარაგის ერთეული</span></article>`;
  document.querySelector("#adminAnalytics").innerHTML = `<article><span>სავარაუდო ჯამი</span><b>${money(revenue)}</b></article><article><span>საშუალო მოთხოვნა</span><b>${money(orders.length ? revenue / orders.length : 0)}</b></article><article><span>დაბალი მარაგი</span><b>${lowStock}</b></article><article><span>ოპერატორის მოთხოვნა</span><b>${messages.operatorRequests.length}</b></article>`;
  populateAdminProductFilters();
  renderAdminProductsTable(adminProducts);
  document.querySelector("#ordersTable").innerHTML = orderManagementTable(orders);
  document.querySelector("#inventoryTable").innerHTML = inventoryManagementTable(adminProducts.slice(0, 25));
  document.querySelector("#customersTable").innerHTML = table(["სახელი", "ტელეფონი", "ელფოსტა"], customers.map((c) => [c.name, c.phone, c.email]));
  const rows = [...messages.operatorRequests.map((m) => ["ოპერატორი", m.name, m.topic, m.createdAt]), ...messages.contactMessages.map((m) => ["კონტაქტი", m.name, m.message, m.createdAt])];
  document.querySelector("#messagesTable").innerHTML = table(["ტიპი", "სახელი", "თემა/შეტყობინება", "თარიღი"], rows);
  bindAdminActions();
}
function table(headers, rows) { return rows.length ? `<div class="table-wrap"><table><thead><tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${escapeHtml(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>` : `<div class="empty">მონაცემები ჯერ არ არის</div>`; }
function field(name, label, type, required) { return `<label>${label}<input name="${name}" type="${type}" ${required ? "required" : ""}></label>`; }
function translateStatus(status) { return ({ new: "ახალი", contacted: "დარეკილია", confirmed: "დადასტურებული", completed: "დასრულებული", cancelled: "გაუქმებული" }[status] || status); }
function productModal() {
  return `<div class="modal" id="productModal"><div class="modal-card"><header><h2 id="productModalTitle">პროდუქტის დამატება</h2><button data-close-modal>×</button></header><form id="productForm" class="product-form"><input type="hidden" name="id">${field("sku", "SKU", "text", true)}${field("name", "სახელი", "text", true)}<label>კატეგორია<select name="category" required>${state.categories.map((c) => `<option value="${c.slug}">${c.title}</option>`).join("")}</select></label>${field("brand", "ბრენდი", "text", true)}<label>აღწერა<textarea name="description" required></textarea></label>${field("price", "მიმდინარე ფასი", "number", true)}${field("salePrice", "შედარების ფასი", "number", false)}${field("stock", "მარაგი", "number", true)}<label>სურათები <span class="hint">URL-ები გამოყავით მძიმით ან | ნიშნით</span><input name="images" placeholder="/assets/plumb-supplies.png"></label><label>ატრიბუტები <span class="hint">მაგ: მასალა:ლატუნი|ფერი:ქრომი</span><textarea name="attributes"></textarea></label><label>სტატუსი<select name="status"><option value="active">აქტიური</option><option value="draft">დრაფტი</option><option value="hidden">დამალული</option><option value="archived">არქივი</option></select></label><div class="modal-actions"><button class="btn" type="submit">შენახვა</button><button class="btn ghost" type="button" data-close-modal>გაუქმება</button></div><div id="productFormStatus"></div></form></div></div>`;
}
function importModal() {
  return `<div class="modal" id="importModal"><div class="modal-card wide"><header><h2>CSV პროდუქტების იმპორტი</h2><button data-close-modal>×</button></header><div class="import-box"><p class="muted">სვეტები: SKU, name, category, brand, description, price, salePrice, stock, images, attributes, status. price არის მიმდინარე ფასი, salePrice კი შედარების ფასი.</p><input type="file" id="csvImportFile" accept=".csv,text/csv"><div id="importValidation"></div><div id="importPreview"></div><div class="modal-actions"><button class="btn" id="runImportBtn" disabled>იმპორტი</button><button class="btn ghost" type="button" data-close-modal>დახურვა</button></div><div id="importResult"></div></div></div></div>`;
}
function populateAdminProductFilters() {
  const categorySelect = document.querySelector("#adminCategoryFilter");
  const brandSelect = document.querySelector("#adminBrandFilter");
  if (!categorySelect || !brandSelect) return;
  const currentCategory = categorySelect.value;
  const currentBrand = brandSelect.value;
  categorySelect.innerHTML = `<option value="">ყველა კატეგორია</option>${state.categories.map((c) => `<option value="${c.slug}" ${currentCategory === c.slug ? "selected" : ""}>${c.title}</option>`).join("")}`;
  brandSelect.innerHTML = `<option value="">ყველა ბრენდი</option>${[...new Set(state.adminProducts.map((p) => p.brand))].sort().map((brand) => `<option ${currentBrand === brand ? "selected" : ""}>${brand}</option>`).join("")}`;
}
function renderAdminProductsTable(products) {
  const target = document.querySelector("#adminProductsTable");
  if (!target) return;
  if (!products.length) { target.innerHTML = `<div class="empty">პროდუქტი ვერ მოიძებნა</div>`; return; }
  target.innerHTML = `<div class="table-wrap"><table><thead><tr><th>SKU</th><th>პროდუქტი</th><th>კატეგორია</th><th>ფასი</th><th>მარაგი</th><th>სტატუსი</th><th>ქმედება</th></tr></thead><tbody>${products.map((p) => `<tr><td>${escapeHtml(p.sku)}</td><td><b>${escapeHtml(p.name)}</b><br><small>${escapeHtml(p.brand)}</small></td><td>${escapeHtml(p.categoryTitle)}</td><td>${money(p.price)}${p.salePrice ? `<br><small>შედარების ფასი ${money(p.salePrice)}</small>` : ""}</td><td>${p.stock}</td><td>${translateProductStatus(p.status)}</td><td><div class="row-actions"><button class="mini-btn" data-edit-product="${p.id}">რედაქტირება</button><button class="mini-btn danger" data-delete-product="${p.id}">წაშლა</button></div></td></tr>`).join("")}</tbody></table></div>`;
}
function translateProductStatus(status) { return ({ active: "აქტიური", draft: "დრაფტი", hidden: "დამალული", archived: "არქივი" }[status] || status || "აქტიური"); }
function adminProductFilters() {
  return {
    q: document.querySelector("#adminProductQ")?.value.trim() || "",
    category: document.querySelector("#adminCategoryFilter")?.value || "",
    brand: document.querySelector("#adminBrandFilter")?.value || "",
    status: document.querySelector("#adminStatusFilter")?.value || ""
  };
}
async function refreshAdminProducts() {
  const params = new URLSearchParams(Object.entries(adminProductFilters()).filter(([, value]) => value));
  state.adminProducts = await api(`/api/admin/products${params.toString() ? `?${params}` : ""}`);
  renderAdminProductsTable(state.adminProducts);
  bindAdminActions();
}
function openProductModal(product = null) {
  const modal = document.querySelector("#productModal");
  const form = document.querySelector("#productForm");
  form.reset();
  document.querySelector("#productFormStatus").innerHTML = "";
  document.querySelector("#productModalTitle").textContent = product ? "პროდუქტის რედაქტირება" : "პროდუქტის დამატება";
  form.elements.id.value = product?.id || "";
  form.sku.value = product?.sku || "";
  form.name.value = product?.name || "";
  form.category.value = product?.categorySlug || state.categories[0]?.slug || "";
  form.brand.value = product?.brand || "";
  form.description.value = product?.description || "";
  form.price.value = product?.price ?? "";
  form.salePrice.value = product?.salePrice ?? "";
  form.stock.value = product?.stock ?? 0;
  form.images.value = (product?.images || product?.gallery || []).join("|");
  form.attributes.value = Object.entries(product?.attributes || product?.specs || {}).map(([key, value]) => `${key}:${value}`).join("|");
  form.status.value = product?.status || "active";
  modal.classList.add("open");
  updateBodyLock();
}
function closeModals() {
  document.querySelectorAll(".modal").forEach((modal) => modal.classList.remove("open"));
  updateBodyLock();
}
async function submitProductForm(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const payload = Object.fromEntries(new FormData(form));
  const id = payload.id;
  delete payload.id;
  const status = document.querySelector("#productFormStatus");
  try {
    const product = await api(id ? `/api/admin/products/${id}` : "/api/admin/products", { method: id ? "PATCH" : "POST", body: payload });
    state.products = id ? state.products.map((item) => item.id === product.id ? product : item) : [product, ...state.products];
    status.innerHTML = `<div class="success">პროდუქტი შენახულია</div>`;
    await loadData();
    await refreshAdminProducts();
    setTimeout(closeModals, 500);
  } catch (error) {
    status.innerHTML = `<div class="error">${error.message}</div>`;
  }
}
function parseCsv(text) {
  const rows = [];
  let current = [], value = "", quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i], next = text[i + 1];
    if (char === '"' && quoted && next === '"') { value += '"'; i += 1; }
    else if (char === '"') quoted = !quoted;
    else if (char === "," && !quoted) { current.push(value); value = ""; }
    else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") i += 1;
      current.push(value); value = "";
      if (current.some((cell) => cell.trim())) rows.push(current);
      current = [];
    } else value += char;
  }
  current.push(value);
  if (current.some((cell) => cell.trim())) rows.push(current);
  if (!rows.length) return [];
  const headers = rows.shift().map((header) => header.trim());
  return rows.map((row) => Object.fromEntries(headers.map((header, index) => [header, row[index]?.trim() || ""])));
}
function validateImportRows(rows) {
  const required = ["SKU", "name", "category", "brand", "description", "price", "stock"];
  const seen = new Set();
  const errors = [];
  rows.forEach((row, index) => {
    required.forEach((field) => { if (!String(row[field] ?? row[field.toLowerCase()] ?? "").trim()) errors.push({ row: index + 1, sku: row.SKU || row.sku || "", message: `${field} სავალდებულოა` }); });
    const sku = String(row.SKU || row.sku || "").trim().toLowerCase();
    if (sku && seen.has(sku)) errors.push({ row: index + 1, sku, message: "ფაილში SKU მეორდება" });
    if (sku) seen.add(sku);
    if (row.price && Number.isNaN(Number(row.price))) errors.push({ row: index + 1, sku, message: "ფასი არასწორია" });
    if (row.stock && Number.isNaN(Number(row.stock))) errors.push({ row: index + 1, sku, message: "მარაგი არასწორია" });
  });
  return errors;
}
function renderImportPreview(rows) {
  const preview = rows.slice(0, 20);
  document.querySelector("#importPreview").innerHTML = preview.length ? table(["SKU", "სახელი", "კატეგორია", "ფასი", "მარაგი"], preview.map((row) => [row.SKU || row.sku, row.name || row.Name, row.category || row.Category, row.price || row.Price, row.stock || row.Stock])) : `<div class="empty">CSV ცარიელია</div>`;
}
function renderImportValidation(errors) {
  document.querySelector("#importValidation").innerHTML = errors.length ? `<div class="error">${errors.slice(0, 8).map((e) => `Row ${e.row}: ${escapeHtml(e.message)}`).join("<br>")}${errors.length > 8 ? `<br>კიდევ ${errors.length - 8} შეცდომა...` : ""}</div>` : `<div class="success">Preview მზადაა. ცუდი row-ები import-ზე გამოტოვდება.</div>`;
}
function orderManagementTable(orders) {
  if (!orders.length) return `<div class="empty">შეკვეთის მოთხოვნები ჯერ არ არის</div>`;
  const options = [["new", "ახალი"], ["contacted", "დარეკილია"], ["confirmed", "დადასტურებული"], ["completed", "დასრულებული"], ["cancelled", "გაუქმებული"]];
  const itemText = (order) => (order.items || []).map((item) => `${escapeHtml(item.sku)} · ${escapeHtml(item.title)} × ${escapeHtml(item.quantity)}`).join("<br>");
  return `<div class="table-wrap"><table><thead><tr><th>ID</th><th>კლიენტი</th><th>პროდუქტები</th><th>ჯამი</th><th>კომენტარი</th><th>სტატუსი</th><th>ქმედება</th></tr></thead><tbody>${orders.map((o) => `<tr><td>${o.id}</td><td>${escapeHtml(o.customerName)}<br><small>${escapeHtml(o.phone)}</small></td><td>${itemText(o)}</td><td>${money(o.total)}</td><td>${escapeHtml(o.comment || "")}</td><td><select data-order-status="${o.id}">${options.map(([value, label]) => `<option value="${value}" ${o.status === value ? "selected" : ""}>${label}</option>`).join("")}</select></td><td><button class="mini-btn" data-save-order="${o.id}">შენახვა</button></td></tr>`).join("")}</tbody></table></div>`;
}
function inventoryManagementTable(products) {
  if (!products.length) return `<div class="empty">პროდუქტები ჯერ არ არის</div>`;
  return `<div class="table-wrap"><table><thead><tr><th>SKU</th><th>პროდუქტი</th><th>მარაგი</th><th>ქმედება</th></tr></thead><tbody>${products.map((p) => `<tr><td>${escapeHtml(p.sku)}</td><td>${escapeHtml(p.title)}<br><small>${escapeHtml(p.categoryTitle)}</small></td><td><input class="stock-input" type="number" min="0" max="100000" value="${p.stock}" data-stock-input="${p.id}"></td><td><button class="mini-btn" data-save-stock="${p.id}">შენახვა</button></td></tr>`).join("")}</tbody></table></div>`;
}
function bindAdminActions() {
  const bindOnce = (selector, eventName, handler) => {
    const element = document.querySelector(selector);
    const key = `bound${eventName}`;
    if (!element || element.dataset[key]) return;
    element.addEventListener(eventName, handler);
    element.dataset[key] = "1";
  };
  bindOnce("#adminProductApply", "click", refreshAdminProducts);
  bindOnce("#adminProductQ", "keydown", (event) => { if (event.key === "Enter") refreshAdminProducts(); });
  bindOnce("#addProductBtn", "click", () => openProductModal());
  bindOnce("#openImportBtn", "click", () => {
    state.importRows = [];
    state.importResult = null;
    document.querySelector("#csvImportFile").value = "";
    document.querySelector("#importPreview").innerHTML = "";
    document.querySelector("#importValidation").innerHTML = "";
    document.querySelector("#importResult").innerHTML = "";
    document.querySelector("#runImportBtn").disabled = true;
    document.querySelector("#importModal").classList.add("open");
    updateBodyLock();
  });
  document.querySelectorAll("[data-close-modal]").forEach((button) => {
    if (button.dataset.boundClick) return;
    button.addEventListener("click", closeModals);
    button.dataset.boundClick = "1";
  });
  bindOnce("#productForm", "submit", submitProductForm);
  bindOnce("#csvImportFile", "change", async (event) => {
    const file = event.currentTarget.files?.[0];
    if (!file) return;
    const text = await file.text();
    state.importRows = parseCsv(text);
    const errors = validateImportRows(state.importRows);
    renderImportPreview(state.importRows);
    renderImportValidation(errors);
    document.querySelector("#runImportBtn").disabled = state.importRows.length === 0;
  });
  bindOnce("#runImportBtn", "click", async () => {
    const button = document.querySelector("#runImportBtn");
    button.disabled = true;
    try {
      const result = await api("/api/admin/products/import", { method: "POST", body: { rows: state.importRows } });
      state.importResult = result;
      document.querySelector("#importResult").innerHTML = `<div class="success">შედეგი: შექმნილი ${result.created}, განახლებული ${result.updated}, გამოტოვებული ${result.skipped}</div>${result.errors?.length ? table(["Row", "SKU", "შეცდომა"], result.errors.slice(0, 30).map((e) => [e.row, e.sku, e.message])) : ""}`;
      await loadData();
      await loadAdmin();
    } catch (error) {
      document.querySelector("#importResult").innerHTML = `<div class="error">${error.message}</div>`;
    } finally {
      button.disabled = false;
    }
  });
  document.querySelectorAll("[data-edit-product]").forEach((button) => button.addEventListener("click", () => {
    const product = state.adminProducts.find((item) => item.id === Number(button.dataset.editProduct));
    if (product) openProductModal(product);
  }));
  document.querySelectorAll("[data-delete-product]").forEach((button) => button.addEventListener("click", async () => {
    const id = Number(button.dataset.deleteProduct);
    const product = state.adminProducts.find((item) => item.id === id);
    if (!product || !confirm(`წავშალოთ პროდუქტი ${product.sku}?`)) return;
    button.disabled = true;
    try {
      await api(`/api/admin/products/${id}`, { method: "DELETE" });
      toast("პროდუქტი წაიშალა");
      await loadData();
      await refreshAdminProducts();
    } catch (error) { toast(error.message); button.disabled = false; }
  }));
  document.querySelectorAll("[data-save-order]").forEach((button) => button.addEventListener("click", async () => {
    const id = button.dataset.saveOrder;
    const status = document.querySelector(`[data-order-status="${id}"]`).value;
    button.disabled = true;
    try { await api(`/api/orders/${id}/status`, { method: "PATCH", body: { status } }); toast("შეკვეთის სტატუსი განახლდა"); await loadAdmin(); }
    catch (error) { toast(error.message); button.disabled = false; }
  }));
  document.querySelectorAll("[data-save-stock]").forEach((button) => button.addEventListener("click", async () => {
    const id = button.dataset.saveStock;
    const stock = Number(document.querySelector(`[data-stock-input="${id}"]`).value);
    button.disabled = true;
    try {
      const product = await api(`/api/products/${id}/stock`, { method: "PATCH", body: { stock } });
      state.products = state.products.map((item) => item.id === product.id ? product : item);
      toast("მარაგი განახლდა");
      await loadAdmin();
    } catch (error) { toast(error.message); button.disabled = false; }
  }));
}

function renderAssistant() {
  const existing = document.querySelector("#assistant");
  if (existing) {
    existing.classList.remove("open");
    return;
  }
  document.querySelector("#assistantMount").innerHTML = `<div class="assistant" id="assistant"><div class="assistant-panel"><header><b>გორის შოურუმის ასისტენტი</b><button id="closeAssistant">×</button></header><div class="assistant-log" id="assistantLog"><div class="bubble">მოგესალმებით AquaPro Gori-ში. მითხარით რა სივრცეს აწყობთ, რა ფერი ან ბიუჯეტი გაქვთ და დაგეხმარებით სწორ პროდუქტის შერჩევაში. საჭიროებისას ოპერატორი დაგირეკავთ.</div></div><div class="quick"><button data-prompt="მირჩიე პრემიუმ ონკანი">ონკანი</button><button data-prompt="მჭირდება მილები და ფიტინგები">მონტაჟი</button><button data-prompt="მიწოდება გორში">მიწოდება</button><button data-prompt="ოპერატორი მჭირდება">ოპერატორი</button></div><form id="assistantForm"><input name="message" placeholder="დასვით კითხვა პროდუქტზე"><button>გაგზავნა</button></form><form class="operator-form" id="operatorForm"><input name="name" placeholder="სახელი" required><input name="phone" placeholder="ტელეფონი" required><input name="topic" placeholder="თემა" required><textarea name="message" placeholder="რა გჭირდებათ?" required></textarea><button>ოპერატორთან დაკავშირება</button><div id="operatorStatus"></div></form></div><button class="assistant-toggle" id="openAssistant">AI</button></div>`;
  document.querySelector("#openAssistant").addEventListener("click", openAssistant);
  document.querySelector("#closeAssistant").addEventListener("click", () => document.querySelector("#assistant").classList.remove("open"));
  document.querySelectorAll("[data-prompt]").forEach((b) => b.addEventListener("click", () => { document.querySelector("#assistantForm input").value = b.dataset.prompt; document.querySelector("#assistantForm").requestSubmit(); }));
  document.querySelector("#assistantForm").addEventListener("submit", assistantSubmit);
  document.querySelector("#operatorForm").addEventListener("submit", operatorSubmit);
}
function renderQuickView() {
  const existing = document.querySelector("#quickView");
  if (existing) {
    existing.classList.remove("open");
    return;
  }
  document.body.insertAdjacentHTML("beforeend", `<div class="modal" id="quickView"><div class="modal-card"><header><h2>სწრაფი ნახვა</h2><button id="closeQuickView">×</button></header><div id="quickViewBody"></div></div></div>`);
  document.querySelector("#closeQuickView").addEventListener("click", closeModals);
  document.querySelector("#quickView").addEventListener("click", (event) => {
    if (event.target.id === "quickView") closeModals();
  });
}
function openQuickView(id) {
  const product = state.products.find((item) => item.id === id);
  if (!product) return;
  document.querySelector("#quickViewBody").innerHTML = `<div class="quick-view-body"><img src="${product.imageUrl}" alt="${escapeHtml(product.title)}"><div><span class="eyebrow">SKU: ${product.sku}</span><h2>${product.title}</h2><p>${product.brand} · ${product.categoryTitle}</p><div class="price">${priceHtml(product)}</div><div class="stock-badge ${product.stock > 0 ? "ok" : "low"}">${product.stock > 0 ? `${product.stock} მარაგშია` : "არ არის მარაგში"}</div><div class="buttons"><a class="btn" href="#/product/${product.id}">დეტალურად</a><button class="btn ghost" data-add="${product.id}">შეკვეთაში</button><button class="btn ghost" data-wish="${product.id}">♡</button></div></div></div>`;
  document.querySelector("#quickView").classList.add("open");
  updateBodyLock();
  document.querySelectorAll("#quickView [data-add]").forEach((button) => {
    button.addEventListener("click", () => addCart(Number(button.dataset.add)));
  });
  document.querySelectorAll("#quickView [data-wish]").forEach((button) => {
    button.addEventListener("click", () => toggleWish(Number(button.dataset.wish)));
  });
}
function openAssistant() {
  closeCatalogFilters();
  document.querySelector("nav")?.classList.remove("open");
  document.querySelector("#assistant")?.classList.add("open");
}
async function assistantSubmit(event) {
  event.preventDefault();
  const input = event.currentTarget.message;
  const message = input.value.trim();
  if (!message) return;
  appendAssistant(message, "user");
  input.value = "";
  const result = await api("/api/chat", { method: "POST", body: { message, sessionId: localStorage.getItem("storeChat") || "" } });
  localStorage.setItem("storeChat", result.sessionId);
  appendAssistant(result.reply, "bot");
  document.querySelector("#operatorForm").classList.toggle("show", result.needsOperator);
}
async function operatorSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const status = document.querySelector("#operatorStatus");
  try { const result = await api("/api/operator-request", { method: "POST", body: Object.fromEntries(new FormData(form)) }); status.innerHTML = `<div class="success">${result.message}</div>`; form.reset(); }
  catch (error) { status.innerHTML = `<div class="error">${error.message}</div>`; }
}
function appendAssistant(text, role) { document.querySelector("#assistantLog").insertAdjacentHTML("beforeend", `<div class="bubble ${role}">${escapeHtml(text)}</div>`); }
function renderFooter() { document.querySelector("#footer").innerHTML = `<div class="container footer-grid"><div><b>AquaPro Gori</b><p>პრემიუმ სანტექნიკის ონლაინ შოურუმი გორისთვის. აირჩიეთ პროდუქტი, გაგზავნეთ მოთხოვნა და შეკვეთას ტელეფონით დაგიდასტურებთ.</p></div><div>${[...nav.slice(0, 6), ["/faq", "FAQ"], ["/about", "ჩვენ შესახებ"]].map(([h, l]) => `<a href="#${h}">${l}</a>`).join("")}</div><div><p>${state.config.phone}<br>${state.config.email}<br>${state.config.address}</p><a class="btn ghost" href="tel:+995599123456">დარეკვა</a></div></div>`; }
function enhanceMedia() {
  document.querySelectorAll("img").forEach((img, i) => { img.loading = i < 2 ? "eager" : "lazy"; img.decoding = "async"; });
  const targets = document.querySelectorAll(".section:not(.catalog-section), .promo article, .product-card, .category-card");
  if (!("IntersectionObserver" in window)) {
    targets.forEach((element) => element.classList.add("visible"));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  targets.forEach((element) => {
    element.classList.add("reveal");
    observer.observe(element);
  });
}
function toast(text) { document.body.insertAdjacentHTML("beforeend", `<div class="toast">${text}</div>`); setTimeout(() => document.querySelector(".toast")?.remove(), 1600); }
async function api(path, options = {}) {
  const response = await fetch(path, { method: options.method || "GET", headers: { "Content-Type": "application/json" }, body: options.body ? JSON.stringify(options.body) : undefined });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "მოთხოვნა ვერ შესრულდა");
  return data;
}
function escapeHtml(value) { return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;"); }
