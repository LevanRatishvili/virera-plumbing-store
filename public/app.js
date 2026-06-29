const clinicContent = {
  clinicName: "მედ ამბულატორია",
  shortSlogan: "ამბულატორიული კლინიკის ვებგვერდი",
  heroLabel: "ამბულატორიული კლინიკა",
  heroHeadline: "",
  heroDescription: "",
  aboutLabel: "რატომ ჩვენ",
  aboutHeadline: "მშვიდი და გასაგები გზა პირველ კონსულტაციამდე",
  aboutText: "ვებგვერდი აერთიანებს სერვისებს, ექიმების სამუშაო პროფილებს, საკონტაქტო დეტალებს და ვიზიტის მოთხოვნის ფორმას. ნაწილი მონაცემები სამუშაო ვერსიისთვისაა და კლინიკასთან დასადასტურებელია.",
  primaryCta: "ვიზიტის დაჯავშნა",
  secondaryCta: "სერვისების ნახვა",
  heroStats: [
    ["8+", "ამბულატორიული მიმართულება"],
    ["4", "სამუშაო პროფილი"],
    ["09:00-18:00", "სამუშაო საათები"]
  ],
  heroAvailabilityTitle: "ვიზიტის მოთხოვნა",
  heroAvailabilityText: "თერაპია · კარდიოლოგია · პედიატრია",
  servicesLabel: "სერვისები",
  servicesHeadline: "ძირითადი სამედიცინო მიმართულებები",
  servicesCta: "აირჩიეთ მიმართულება და მოითხოვეთ ვიზიტი",
  services: [
    { title: "თერაპია", description: "პირველადი კონსულტაცია, გეგმური კონტროლი და ყოველდღიური ჩივილების საწყისი შეფასება ექიმთან.", price: "საწყისი ფასი: 45 ლარიდან" },
    { title: "კარდიოლოგია", description: "არტერიული წნევის, გულის რიტმისა და გულ-სისხლძარღვთა რისკების გეგმური კონსულტაცია.", price: "საწყისი ფასი: 70 ლარიდან" },
    { title: "პედიატრია", description: "ბავშვთა გეგმური ვიზიტი, ზრდა-განვითარების შეფასება და მშობლისთვის გასაგები რეკომენდაციები.", price: "საწყისი ფასი: 55 ლარიდან" },
    { title: "ენდოკრინოლოგია", description: "ფარისებრი ჯირკვლის, შაქრიანი დიაბეტისა და ჰორმონული ბალანსის ამბულატორიული კონსულტაცია.", price: "საწყისი ფასი: 65 ლარიდან" },
    { title: "გინეკოლოგია", description: "პრევენციული ვიზიტები და გეგმური ამბულატორიული კონსულტაცია მშვიდ გარემოში.", price: "ფასი დაზუსტდება კლინიკასთან" },
    { title: "ნევროლოგია", description: "თავის ტკივილის, ძილისა და ნერვული სისტემის ჩივილების საწყისი შეფასება სპეციალისტთან.", price: "საწყისი ფასი: 75 ლარიდან" },
    { title: "ლაბორატორიული კვლევები", description: "საბაზისო ანალიზების ორგანიზება ექიმის რეკომენდაციით და პასუხების მოწესრიგებული მიღება.", price: "საწყისი ფასი: 15 ლარიდან" },
    { title: "ულტრაბგერითი კვლევა", description: "გეგმური ულტრაბგერითი კვლევები შესაბამისი სპეციალისტის მითითებით.", price: "ფასი დაზუსტდება კლინიკასთან" }
  ],
  doctorsLabel: "ექიმები",
  doctorsHeadline: "სპეციალისტების სამუშაო პროფილები",
  doctorsNote: "პროფილები წარმოდგენილია ვებგვერდის სამუშაო ვერსიისთვის. რეალური სახელები, ფოტოები და კვალიფიკაცია საბოლოოდ კლინიკამ უნდა დაადასტუროს.",
  doctors: [
    { name: "დრ. ნინო მაისურაძე", specialty: "თერაპევტი", note: "პირველადი კონსულტაცია და გეგმური კონტროლი", image: "/assets/doctor-therapist.png" },
    { name: "დრ. გიორგი ქავთარაძე", specialty: "კარდიოლოგი", note: "გულისა და წნევის ამბულატორიული შეფასება", image: "/assets/doctor-cardiologist.png" },
    { name: "დრ. თამარ ლომიძე", specialty: "პედიატრი", note: "ბავშვთა გეგმური ვიზიტები და მშობლის კონსულტაცია", image: "/assets/doctor-pediatrician.png" },
    { name: "დრ. მარიამ ბერიძე", specialty: "ენდოკრინოლოგი", note: "ჰორმონული და მეტაბოლური საკითხების კონსულტაცია", image: "/assets/doctor-endocrinologist.png" }
  ],
  benefits: [
    { title: "გასაგები სტრუქტურა", text: "სერვისები, ექიმები, ფასები და საკონტაქტო ინფორმაცია ერთ გვერდზეა თავმოყრილი." },
    { title: "მინიმალური ფორმა", text: "ვიზიტის მოთხოვნა ითხოვს მხოლოდ საკონტაქტო მონაცემებს და სასურველ დროს." },
    { title: "უსაფრთხო ფორმულირება", text: "ტექსტი არ ამტკიცებს ლიცენზიებს, ჯილდოებს, შედეგებს ან ოფიციალურ ფასებს." },
    { title: "ადვილად განახლებადი", text: "კლინიკის საბოლოო მონაცემები ადმინისტრატორს შეუძლია შეცვალოს კონტენტის მენეჯერიდან." }
  ],
  pricesLabel: "ფასები",
  pricesHeadline: "საწყისი ფასები და დასაზუსტებელი სერვისები",
  pricesText: "ფასები მითითებულია როგორც საწყისი ან საორიენტაციო ინფორმაცია. საბოლოო ღირებულება დაზუსტდება კლინიკასთან და არ ითვლება ოფიციალურ საჯარო ფასად.",
  appointmentLabel: "დაჯავშნა",
  appointmentHeadline: "მოითხოვეთ ვიზიტი",
  appointmentText: "შეავსეთ მოკლე ფორმა. ოპერატორი დაგიკავშირდებათ დროისა და სპეციალისტის დასადასტურებლად.",
  privacyNote: "ფორმა არ ითხოვს დიაგნოზს, პირად ნომერს, სამედიცინო ისტორიას ან ანალიზის ფაილებს.",
  consentCopy: "გაგზავნით ადასტურებთ, რომ საკონტაქტო მონაცემები გამოიყენება მხოლოდ ვიზიტის მოთხოვნაზე პასუხისთვის.",
  commentPlaceholder: "არ მიუთითოთ დიაგნოზი ან მგრძნობიარე სამედიცინო ინფორმაცია",
  contactLabel: "კონტაქტი",
  contactHeadline: "რეგისტრატურა და სამუშაო საათები",
  phone: "+995 599 12 34 56",
  phoneHref: "+995599123456",
  email: "info@example-clinic.ge",
  address: "თბილისი, სამედიცინო ქუჩა 12",
  workingHours: "ორშაბათი-შაბათი, 09:00-18:00",
  mapTitle: "კლინიკის მდებარეობა",
  mapPlaceholder: "რუკის ადგილი",
  mapNote: "რუკა და ზუსტი მისამართი დაემატება საბოლოო მონაცემების დადასტურების შემდეგ",
  mapEmbedUrl: "https://www.google.com/maps?q=Tbilisi%20medical%20clinic&output=embed",
  mapLink: "https://www.google.com/maps/search/?api=1&query=Tbilisi%20medical%20clinic",
  facebookUrl: "https://www.facebook.com/",
  instagramUrl: "https://www.instagram.com/",
  whatsappUrl: "https://wa.me/995599123456",
  telegramUrl: "https://t.me/telegram",
  footerText: "პაციენტზე ორიენტირებული ამბულატორიული კლინიკის სამუშაო ვებგვერდი. საბოლოო მონაცემები კლინიკასთან დასადასტურებელია.",
  privacyLinkText: "პერსონალური მონაცემების დაცვა",
  backToSite: "საიტზე დაბრუნება",
  demoVersionNote: "ამბულატორიული კლინიკა",
  heroSlides: [
    {
      title: "კონსულტაცია მშვიდ გარემოში",
      text: "პირველი ვიზიტი, გეგმური კონტროლი და მკაფიო კომუნიკაცია ექიმთან.",
      image: "/assets/clinic-consultation.png",
      tone: "consultation"
    },
    {
      title: "ორგანიზებული რეგისტრატურა",
      text: "საკონტაქტო ინფორმაცია, სამუშაო საათები და ვიზიტის მოთხოვნა ერთ სივრცეში.",
      image: "/assets/clinic-reception.png",
      tone: "reception"
    },
    {
      title: "დიაგნოსტიკა და ამბულატორიული სერვისები",
      text: "მიმართულებები წარმოდგენილია გასაგებად, ზედმეტი სამედიცინო დაპირებების გარეშე.",
      image: "/assets/clinic-diagnostics.png",
      tone: "diagnostics"
    }
  ],
  assistantTitle: "კლინიკის ასისტენტი",
  assistantButton: "კითხვის დასმა",
  assistantIntro: "გამარჯობა. გიპასუხებთ ზოგად კითხვებზე სერვისების, ფასების, მისამართისა და ვიზიტის მოთხოვნის შესახებ.",
  assistantSafetyNote: "ასისტენტი არ სვამს დიაგნოზს და არ იძლევა მკურნალობის ან მედიკამენტის რჩევას.",
  assistantPlaceholder: "დაწერეთ ზოგადი კითხვა",
  assistantQuickQuestions: [
    "როგორ ჩავეწერო ვიზიტზე?",
    "რა სერვისები გაქვთ?",
    "სად მდებარეობს კლინიკა?",
    "რა ღირს კონსულტაცია?",
    "რა მონაცემებს აგროვებს ფორმა?"
  ]
};

const defaultClinicContent = deepCopy(clinicContent);
let services = [];
let doctors = [];
let benefits = [];
let prices = [];
let adminContentDraft = null;
let adminAssetOptions = ["/assets/clinic-hero.png"];
let adminContentOverrides = {};
let adminBuildInfo = {};
let adminStorageInfo = {};
let adminAppointments = [];
let activeAdminTab = "overview";

function deepCopy(value) {
  return JSON.parse(JSON.stringify(value));
}

function syncDerivedContent() {
  services = clinicContent.services.map(({ title, description, price }) => [title, description, price]);
  doctors = clinicContent.doctors.map(({ name, specialty, note, image }) => [name, specialty, note, image || ""]);
  benefits = clinicContent.benefits.map(({ title, text }) => [title, text]);
  prices = (clinicContent.prices?.length ? clinicContent.prices : clinicContent.services.slice(0, 6).map(({ title, price }) => ({ title, price }))).map(({ title, price }) => [title, price]);
}

function mergeClinicContent(overrides = {}) {
  const normalizedOverrides = normalizeLegacyClinicContentOverrides(overrides);
  Object.assign(clinicContent, deepCopy(defaultClinicContent));
  applyContentSection(normalizedOverrides.siteInfo);
  if (Array.isArray(normalizedOverrides.heroSlides)) clinicContent.heroSlides = normalizedOverrides.heroSlides;
  if (Array.isArray(normalizedOverrides.services)) clinicContent.services = normalizedOverrides.services;
  if (Array.isArray(normalizedOverrides.doctors)) clinicContent.doctors = normalizedOverrides.doctors;
  if (Array.isArray(normalizedOverrides.prices)) clinicContent.prices = normalizedOverrides.prices;
  applyContentSection(normalizedOverrides.contact);
  applyContentSection(normalizedOverrides.footer);
  applyContentSection(normalizedOverrides.consentText);
  syncDerivedContent();
}

function applyContentSection(section) {
  if (section && typeof section === "object" && !Array.isArray(section)) Object.assign(clinicContent, section);
}

function normalizeLegacyClinicContentOverrides(overrides = {}) {
  const output = deepCopy(overrides || {});
  if (output.siteInfo?.shortSlogan === "დემო კლინიკური ვებსაიტი") delete output.siteInfo;
  if (output.footer?.footerText?.includes("დემო ვერსია")) delete output.footer;
  if (Array.isArray(output.heroSlides) && output.heroSlides.some((slide) => String(slide.image || "").includes("plumb-") || String(slide.text || "").includes("დემო მიმართულებები"))) delete output.heroSlides;
  if (Array.isArray(output.services) && output.services.some((service) => String(service.description || "").includes("ყოველდღიური ჯანმრთელობის ზოგადი შეფასება"))) delete output.services;
  if (Array.isArray(output.doctors) && output.doctors.some((doctor) => String(doctor.note || "").includes("დემო პროფილი") || String(doctor.image || "").includes("/assets/categories/"))) delete output.doctors;
  if (Array.isArray(output.prices) && output.prices.some((item) => item?.title === "გინეკოლოგია" && String(item.price || "").includes("70 ლარიდან"))) delete output.prices;
  return output;
}

async function loadPublicContent() {
  try {
    const result = await api("/api/content");
    mergeClinicContent(result.content || {});
  } catch {
    mergeClinicContent({});
  }
}

function contentPayloadFromCurrent() {
  return {
    siteInfo: pickContent(["clinicName", "shortSlogan", "demoVersionNote", "primaryCta", "secondaryCta"]),
    heroSlides: deepCopy(clinicContent.heroSlides),
    services: deepCopy(clinicContent.services),
    doctors: deepCopy(clinicContent.doctors),
    prices: deepCopy(clinicContent.prices?.length ? clinicContent.prices : clinicContent.services.slice(0, 6).map(({ title, price }) => ({ title, price }))),
    contact: pickContent(["phone", "phoneHref", "email", "address", "workingHours", "mapEmbedUrl", "mapLink", "facebookUrl", "instagramUrl", "whatsappUrl", "telegramUrl"]),
    footer: pickContent(["footerText", "privacyLinkText"]),
    consentText: pickContent(["privacyNote", "consentCopy", "commentPlaceholder"])
  };
}

function pickContent(keys) {
  return Object.fromEntries(keys.map((key) => [key, clinicContent[key] || ""]));
}

syncDerivedContent();

const statusLabels = {
  new: "ახალი",
  contacted: "დაკავშირებული",
  confirmed: "დადასტურებული",
  cancelled: "გაუქმებული",
  completed: "დასრულებული"
};

const app = document.querySelector("#app");
let heroSlideTimer;
let heroSlideIndex = 0;

function api(path, options = {}) {
  return fetch(path, {
    method: options.method || "GET",
    credentials: "same-origin",
    headers: options.body ? { "Content-Type": "application/json" } : {},
    body: options.body ? JSON.stringify(options.body) : undefined
  }).then(async (response) => {
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || data.error || "მოთხოვნა ვერ შესრულდა");
    return data;
  });
}

function icon(label) {
  return `<span class="icon" aria-hidden="true">${label}</span>`;
}

function buildMarker() {
  const commit = document.querySelector("meta[name='app-commit']")?.content || "";
  return commit ? `<small class="build-marker">ვერსია: ${escapeHtml(commit.slice(0, 7))}</small>` : "";
}

function publicUrl(value) {
  const url = String(value || "").trim();
  if (!url || url === "#") return "";
  return /^https:\/\/[^\s<>"']+$/i.test(url) ? url : "";
}

function googleMapEmbedUrl() {
  const configured = publicUrl(clinicContent.mapEmbedUrl);
  if (configured) return configured;
  return `https://www.google.com/maps?q=${encodeURIComponent(clinicContent.address || clinicContent.mapTitle)}&output=embed`;
}

function googleMapLink() {
  return publicUrl(clinicContent.mapLink) || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(clinicContent.address || clinicContent.mapTitle)}`;
}

function socialLinks() {
  return [
    { key: "facebook", label: "Facebook", url: publicUrl(clinicContent.facebookUrl) },
    { key: "instagram", label: "Instagram", url: publicUrl(clinicContent.instagramUrl) },
    { key: "whatsapp", label: "WhatsApp", url: publicUrl(clinicContent.whatsappUrl) },
    { key: "telegram", label: "Telegram", url: publicUrl(clinicContent.telegramUrl) }
  ].filter((item) => item.url);
}

function socialIcon(key) {
  const icons = {
    facebook: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 8.2h2.3V4.4c-.4-.1-1.8-.2-3.4-.2-3.4 0-5.7 2-5.7 5.8v3.3H3.5v4.3h3.7V24h4.5v-6.4h3.6l.6-4.3h-4.2v-2.9c0-1.2.4-2.2 2.3-2.2Z"/></svg>`,
    instagram: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.1 2h9.8A5.1 5.1 0 0 1 22 7.1v9.8a5.1 5.1 0 0 1-5.1 5.1H7.1A5.1 5.1 0 0 1 2 16.9V7.1A5.1 5.1 0 0 1 7.1 2Zm.1 2.1a3 3 0 0 0-3.1 3.1v9.6a3 3 0 0 0 3.1 3.1h9.6a3 3 0 0 0 3.1-3.1V7.2a3 3 0 0 0-3.1-3.1H7.2Zm9.9 1.8a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4ZM12 7.2a4.8 4.8 0 1 1 0 9.6 4.8 4.8 0 0 1 0-9.6Zm0 2.1a2.7 2.7 0 1 0 0 5.4 2.7 2.7 0 0 0 0-5.4Z"/></svg>`,
    whatsapp: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 3.5A11.7 11.7 0 0 0 2.1 17.6L1 23l5.5-1.4A11.7 11.7 0 0 0 20.5 3.5ZM12 20a8 8 0 0 1-4.1-1.1l-.3-.2-3.2.8.8-3.1-.2-.3A8 8 0 1 1 12 20Zm4.4-6c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.6.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.3 0-.4.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.3s1 2.7 1.1 2.9c.1.2 2 3.1 4.9 4.3 1.8.8 2.5.8 3.4.7.5-.1 1.4-.6 1.6-1.1.2-.6.2-1 .2-1.2-.1-.1-.3-.2-.5-.3Z"/></svg>`,
    telegram: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21.8 4.4 18.6 20c-.2 1.1-.8 1.4-1.7.9l-4.8-3.5-2.3 2.2c-.3.3-.5.5-1 .5l.3-4.9 8.9-8c.4-.3-.1-.5-.6-.2L6.5 13.9 1.8 12.5c-1-.3-1-1  .2-1.4L20.4 4c.9-.3 1.7.2 1.4.4Z"/></svg>`
  };
  return icons[key] || "";
}

function renderSocialLinks() {
  const links = socialLinks();
  if (!links.length) return "";
  return `<div class="social-links" aria-label="სოციალური ქსელები">
    ${links.map((item) => `<a class="social-link social-link-${item.key}" href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(item.label)}">${socialIcon(item.key)}</a>`).join("")}
  </div>`;
}

function renderContactMap() {
  const mapLink = googleMapLink();
  return `<div class="contact-map" aria-label="${escapeHtml(clinicContent.mapTitle)}">
    <iframe src="${escapeHtml(googleMapEmbedUrl())}" title="${escapeHtml(clinicContent.mapTitle)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
    <div class="map-fallback">
      <span class="map-pin" aria-hidden="true">⌖</span>
      <div>
        <b>${escapeHtml(clinicContent.mapTitle)}</b>
        <small>${escapeHtml(clinicContent.address)}</small>
      </div>
      <a href="${escapeHtml(mapLink)}" target="_blank" rel="noopener noreferrer">Google Maps-ში ნახვა</a>
    </div>
    <small class="map-note">${escapeHtml(clinicContent.mapNote)}</small>
  </div>`;
}

function isAdminRoute() {
  return location.pathname === "/admin" || location.hash === "#/admin";
}

function render() {
  if (isAdminRoute()) renderAdmin();
  else renderClinic();
}

async function init() {
  if (!isAdminRoute()) await loadPublicContent();
  render();
}

function renderClinic() {
  document.title = clinicContent.clinicName;
  app.innerHTML = `
    <header class="site-header">
      <div class="container header-grid">
        <a class="brand" href="#top" aria-label="${clinicContent.clinicName}">
          <span class="brand-mark">+</span>
          <span><strong>${clinicContent.clinicName}</strong><small>${clinicContent.demoVersionNote}</small></span>
        </a>
        <nav id="siteNav" aria-label="მთავარი მენიუ">
          <a href="#top">მთავარი</a>
          <a href="#about">ჩვენს შესახებ</a>
          <a href="#services">სერვისები</a>
          <a href="#doctors">ექიმები</a>
          <a href="#prices">ფასები</a>
          <a href="#contact">კონტაქტი</a>
        </nav>
        <a class="btn compact header-cta" href="#appointment">${clinicContent.primaryCta}</a>
      </div>
    </header>

    <main id="top">
      <section class="hero">
        <div class="container hero-grid">
          <div class="hero-visual hero-slideshow" id="heroSlideshow" aria-label="კლინიკის სლაიდები">
            <div class="hero-slides">
              ${clinicContent.heroSlides.map((slide, index) => `<article class="hero-slide slide-${slide.tone} ${index === 0 ? "active" : ""}" aria-hidden="${index === 0 ? "false" : "true"}">
                <img src="${slide.image}" alt="${slide.title}">
                <div class="slide-caption">
                  <b>${slide.title}</b>
                  <span>${slide.text}</span>
                </div>
              </article>`).join("")}
            </div>
            <div class="slide-dots" aria-label="სლაიდების არჩევა">
              ${clinicContent.heroSlides.map((slide, index) => `<button type="button" class="${index === 0 ? "active" : ""}" data-slide="${index}" aria-label="${slide.title}" aria-pressed="${index === 0 ? "true" : "false"}"></button>`).join("")}
            </div>
          </div>
        </div>
      </section>

      <section class="section trust" id="about">
        <div class="container">
          <div class="section-head">
            <span class="eyebrow">${clinicContent.aboutLabel}</span>
            <h2>${clinicContent.aboutHeadline}</h2>
            <p>${clinicContent.aboutText}</p>
          </div>
          <div class="benefit-grid">
            ${benefits.map(([title, text], index) => `<article>${icon(["✓","⌁","◷","♡"][index])}<h3>${title}</h3><p>${text}</p></article>`).join("")}
          </div>
        </div>
      </section>

      <section class="section" id="services">
        <div class="container">
          <div class="section-head split">
            <div>
              <span class="eyebrow">${clinicContent.servicesLabel}</span>
              <h2>${clinicContent.servicesHeadline}</h2>
            </div>
            <a class="text-link" href="#appointment">${clinicContent.servicesCta}</a>
          </div>
          <div class="service-grid">
            ${services.map(([title, text, price]) => `<article class="service-card"><div>${icon("+")}<span>${price}</span></div><h3>${title}</h3><p>${text}</p><a href="#appointment" data-service="${title}">${clinicContent.primaryCta}</a></article>`).join("")}
          </div>
        </div>
      </section>

      <section class="section doctors" id="doctors">
        <div class="container">
          <div class="section-head">
            <span class="eyebrow">${clinicContent.doctorsLabel}</span>
            <h2>${clinicContent.doctorsHeadline}</h2>
            <p>${clinicContent.doctorsNote}</p>
          </div>
          <div class="doctor-grid">
            ${doctors.map(([name, specialty, experience, image], index) => `<article class="doctor-card"><div class="doctor-photo">${image ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(name)}">` : ["ნმ","გქ","თლ","მბ"][index]}</div><h3>${name}</h3><p>${specialty}</p><span>${experience}</span><a class="btn ghost" href="#appointment" data-doctor="${name}">დაჯავშნა</a></article>`).join("")}
          </div>
        </div>
      </section>

      <section class="section prices" id="prices">
        <div class="container prices-grid">
          <div>
            <span class="eyebrow">${clinicContent.pricesLabel}</span>
            <h2>${clinicContent.pricesHeadline}</h2>
            <p>${clinicContent.pricesText}</p>
          </div>
          <div class="price-list">
            ${prices.map(([title, price]) => `<div><span>${escapeHtml(title)}</span><b>${escapeHtml(price)}</b></div>`).join("")}
          </div>
        </div>
      </section>

      <section class="section appointment" id="appointment">
        <div class="container appointment-grid">
          <div>
            <span class="eyebrow">${clinicContent.appointmentLabel}</span>
            <h2>${clinicContent.appointmentHeadline}</h2>
            <p>${clinicContent.appointmentText}</p>
            <div class="privacy-note">${clinicContent.privacyNote}</div>
          </div>
          <form id="appointmentForm" class="appointment-form">
            <label class="hp-field" aria-hidden="true">Website<input name="website" tabindex="-1" autocomplete="off"></label>
            <label>სახელი და გვარი<input name="fullName" required autocomplete="name"></label>
            <label>ტელეფონი<input name="phone" required autocomplete="tel"></label>
            <label>სერვისი<select name="service" required>${services.map(([title]) => `<option>${title}</option>`).join("")}</select></label>
            <label>ექიმი<select name="doctor"><option value="">ნებისმიერი ხელმისაწვდომი ექიმი</option>${doctors.map(([name]) => `<option>${name}</option>`).join("")}</select></label>
            <label>სასურველი თარიღი<input name="preferredDate" type="date" required></label>
            <label>სასურველი დრო<input name="preferredTime" type="time" required></label>
            <label class="wide">კომენტარი<textarea name="comment" maxlength="500" placeholder="${clinicContent.commentPlaceholder}"></textarea></label>
            <p class="consent-note wide">${clinicContent.consentCopy}</p>
            <button class="btn wide" type="submit">მოთხოვნის გაგზავნა</button>
            <div id="formStatus" class="form-status" aria-live="polite"></div>
          </form>
        </div>
      </section>

      <section class="section contact" id="contact">
        <div class="container contact-grid">
          <div>
            <span class="eyebrow">${clinicContent.contactLabel}</span>
            <h2>${clinicContent.contactHeadline}</h2>
            <p><b>ტელეფონი:</b> ${clinicContent.phone}</p>
            <p><b>მისამართი:</b> ${clinicContent.address}</p>
            <p><b>ელფოსტა:</b> ${clinicContent.email}</p>
            <p><b>სამუშაო საათები:</b> ${clinicContent.workingHours}</p>
            <div class="contact-actions">
              <a class="btn compact call-btn" href="tel:${clinicContent.phoneHref}">დარეკვა</a>
              ${renderSocialLinks()}
            </div>
          </div>
          ${renderContactMap()}
        </div>
      </section>
    </main>

    <footer class="site-footer">
      <div class="container footer-grid">
        <div><b>${clinicContent.clinicName}</b><p>${clinicContent.footerText}</p></div>
        <div><b>სერვისები</b>${services.slice(0, 5).map(([title]) => `<a href="#services">${title}</a>`).join("")}</div>
        <div><b>კონტაქტი</b><p>${clinicContent.phone}<br>${clinicContent.address}</p>${renderSocialLinks()}<a href="#privacy">${clinicContent.privacyLinkText}</a>${buildMarker()}</div>
      </div>
    </footer>

    <div class="assistant-widget" id="clinicAssistant">
      <button class="assistant-toggle" type="button" aria-expanded="false" aria-controls="assistantPanel" aria-label="კლინიკის ასისტენტი">
        <span class="assistant-toggle-icon" aria-hidden="true">AI</span>
        <span class="assistant-toggle-text">${clinicContent.assistantButton}</span>
      </button>
      <section class="assistant-panel" id="assistantPanel" aria-label="${clinicContent.assistantTitle}" hidden>
        <div class="assistant-head">
          <div>
            <span class="eyebrow">${clinicContent.assistantTitle}</span>
            <h2>${clinicContent.assistantButton}</h2>
          </div>
          <button class="assistant-close" type="button" aria-label="დახურვა">×</button>
        </div>
        <div class="assistant-messages" id="assistantMessages" aria-live="polite">
          <div class="assistant-message assistant-message-bot">${clinicContent.assistantIntro}</div>
        </div>
        <div class="assistant-quick" data-assistant-quick>
          <button class="assistant-more" type="button" data-assistant-more aria-expanded="false">ხშირი კითხვები</button>
          <div class="assistant-question-list">
            ${clinicContent.assistantQuickQuestions.map((question) => `<button type="button" data-assistant-question="${question}">${question}</button>`).join("")}
          </div>
        </div>
        <form class="assistant-form" id="assistantForm">
          <input name="question" autocomplete="off" maxlength="180" placeholder="${clinicContent.assistantPlaceholder}" aria-label="${clinicContent.assistantPlaceholder}">
          <button class="btn compact" type="submit">გაგზავნა</button>
        </form>
        <p class="assistant-safety">${clinicContent.assistantSafetyNote}</p>
      </section>
    </div>
  `;

  bindClinicUi();
}

function bindClinicUi() {
  bindHeroSlideshow();
  bindAssistant();
  bindAssistantFooterAvoidance();

  document.querySelectorAll("[data-service]").forEach((link) => {
    link.addEventListener("click", () => {
      setTimeout(() => {
        const service = document.querySelector("#appointmentForm select[name='service']");
        if (service) service.value = link.dataset.service;
      });
    });
  });

  document.querySelectorAll("[data-doctor]").forEach((link) => {
    link.addEventListener("click", () => {
      setTimeout(() => {
        const doctor = document.querySelector("#appointmentForm select[name='doctor']");
        if (doctor) doctor.value = link.dataset.doctor;
      });
    });
  });

  document.querySelector("#appointmentForm").addEventListener("submit", submitAppointment);
}

function bindAssistantFooterAvoidance() {
  const widget = document.querySelector("#clinicAssistant");
  const footer = document.querySelector(".site-footer");
  if (!widget || !footer) return;
  const update = () => {
    const footerTop = footer.getBoundingClientRect().top;
    const base = window.matchMedia("(max-width: 640px)").matches ? 14 : 22;
    const overlap = Math.max(0, window.innerHeight - footerTop);
    widget.style.bottom = overlap ? `${Math.round(overlap + base)}px` : "";
  };
  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
}

function bindHeroSlideshow() {
  const slideshow = document.querySelector("#heroSlideshow");
  if (!slideshow) return;
  const slides = [...slideshow.querySelectorAll(".hero-slide")];
  const dots = [...slideshow.querySelectorAll("[data-slide]")];
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (slides.length <= 1) return;

  const showSlide = (index) => {
    heroSlideIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      const active = slideIndex === heroSlideIndex;
      slide.classList.toggle("active", active);
      slide.setAttribute("aria-hidden", active ? "false" : "true");
    });
    dots.forEach((dot, dotIndex) => {
      const active = dotIndex === heroSlideIndex;
      dot.classList.toggle("active", active);
      dot.setAttribute("aria-pressed", active ? "true" : "false");
    });
  };

  const stop = () => {
    if (heroSlideTimer) clearInterval(heroSlideTimer);
    heroSlideTimer = null;
  };
  const start = () => {
    stop();
    if (!prefersReducedMotion && slides.length > 1) {
      heroSlideTimer = setInterval(() => showSlide(heroSlideIndex + 1), 5200);
    }
  };

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      showSlide(Number(dot.dataset.slide || 0));
      start();
    });
  });
  slideshow.addEventListener("mouseenter", stop);
  slideshow.addEventListener("mouseleave", start);
  slideshow.addEventListener("focusin", stop);
  slideshow.addEventListener("focusout", start);
  showSlide(heroSlideIndex);
  start();
}

function bindAssistant() {
  const widget = document.querySelector("#clinicAssistant");
  if (!widget) return;
  const toggle = widget.querySelector(".assistant-toggle");
  const panel = widget.querySelector("#assistantPanel");
  const close = widget.querySelector(".assistant-close");
  const form = widget.querySelector("#assistantForm");
  const input = form.querySelector("input[name='question']");
  const messages = widget.querySelector("#assistantMessages");
  const quick = widget.querySelector("[data-assistant-quick]");
  const more = widget.querySelector("[data-assistant-more]");

  const setQuickExpanded = (expanded) => {
    quick?.classList.toggle("expanded", expanded);
    more?.setAttribute("aria-expanded", expanded ? "true" : "false");
  };

  const setOpen = (open) => {
    panel.hidden = !open;
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    if (!open) setQuickExpanded(false);
    if (open) setTimeout(() => input.focus(), 0);
  };

  const ask = (question) => {
    const cleanQuestion = String(question || "").trim();
    if (!cleanQuestion) return;
    setQuickExpanded(false);
    addAssistantMessage(messages, cleanQuestion, "user");
    addAssistantMessage(messages, clinicAssistantAnswer(cleanQuestion), "bot");
    input.value = "";
    messages.scrollTop = messages.scrollHeight;
  };

  toggle.addEventListener("click", () => setOpen(panel.hidden));
  close.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    setOpen(false);
    toggle.focus();
  });
  widget.querySelectorAll("[data-assistant-question]").forEach((button) => {
    button.addEventListener("click", () => ask(button.dataset.assistantQuestion));
  });
  more?.addEventListener("click", (event) => {
    event.preventDefault();
    setQuickExpanded(!quick.classList.contains("expanded"));
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    ask(input.value);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !panel.hidden) setOpen(false);
  });
}

function addAssistantMessage(target, message, type) {
  const item = document.createElement("div");
  item.className = `assistant-message assistant-message-${type}`;
  item.textContent = message;
  target.append(item);
}

function clinicAssistantAnswer(question) {
  const normalized = question.toLowerCase();
  const medicalPattern = /(სიმპტომ|ტკივ|დიაგნოზ|მკურნალ|წამალ|მედიკამენტ|დოზ|სასწრაფ|გადაუდებელ|წნევ|სიცხ|გული|გულის|სისხლ|ორსულ|ანტიბიოტიკ|ანალიზის პასუხ|რეცეპტ|medicine|diagnos|treatment|symptom|emergency)/i;
  if (medicalPattern.test(normalized)) {
    return "ამ კითხვაზე სამედიცინო რჩევას ვერ მოგცემთ: დიაგნოზს, მკურნალობას, მედიკამენტს ან გადაუდებელ შეფასებას ასისტენტი არ განსაზღვრავს. ზოგადი დახმარებისთვის დაუკავშირდით კლინიკას, ხოლო გადაუდებელი მდგომარეობისას მიმართეთ სასწრაფო დახმარებას. გთხოვთ, აქ არ მიუთითოთ მგრძნობიარე სამედიცინო დეტალები.";
  }
  if (/(ჩაწერ|დაჯავშნ|ვიზიტ|appointment)/i.test(normalized)) {
    return `ვიზიტის მოთხოვნისთვის შეავსეთ ფორმა გვერდზე "${clinicContent.appointmentHeadline}". საჭიროა მხოლოდ სახელი, ტელეფონი, სერვისი და სასურველი დრო; ოპერატორი დაგიკავშირდებათ დასადასტურებლად.`;
  }
  if (/(სერვის|მიმართულ|service)/i.test(normalized)) {
    return `სერვისების სამუშაო სიაა: ${clinicContent.services.slice(0, 6).map((service) => service.title).join(", ")}. სრული სია ჩანს სერვისების ბლოკში.`;
  }
  if (/(ფას|ღირ|price|cost)/i.test(normalized)) {
    return `${clinicContent.pricesText} მაგალითები: ${clinicContent.services.slice(0, 3).map((service) => `${service.title} - ${service.price}`).join("; ")}.`;
  }
  if (/(ექიმ|doctor)/i.test(normalized)) {
    return `${clinicContent.doctorsNote} სამუშაო სია: ${clinicContent.doctors.map((doctor) => `${doctor.name} (${doctor.specialty})`).join(", ")}.`;
  }
  if (/(მისამართ|სად|კონტაქტ|ტელეფონ|დარეკ|საათ|address|contact|phone|hours)/i.test(normalized)) {
    return `კონტაქტი: ${clinicContent.phone}, ${clinicContent.email}. მისამართი: ${clinicContent.address}. სამუშაო საათები: ${clinicContent.workingHours}.`;
  }
  if (/(მონაცემ|ფორმა|პირად|data|privacy)/i.test(normalized)) {
    return `${clinicContent.privacyNote} ${clinicContent.consentCopy}`;
  }
  if (/(ადმინ|admin|პაციენტ)/i.test(normalized)) {
    return "ადმინის გვერდი განკუთვნილია მხოლოდ კლინიკის თანამშრომლებისთვის. პაციენტისთვის საკმარისია საჯარო ფორმით ვიზიტის მოთხოვნა ან ტელეფონით დაკავშირება.";
  }
  return "შემიძლია გიპასუხოთ ზოგად კითხვებზე სერვისების, ექიმების სამუშაო პროფილების, საწყისი ფასების, სამუშაო საათების, მისამართისა და ვიზიტის მოთხოვნის შესახებ. სამედიცინო რჩევას ან დიაგნოზს არ ვიძლევი.";
}

async function submitAppointment(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const button = form.querySelector("button[type='submit']");
  const status = document.querySelector("#formStatus");
  const body = Object.fromEntries(new FormData(form));
  button.disabled = true;
  button.textContent = "იგზავნება...";
  status.className = "form-status";
  status.textContent = "";
  try {
    const result = await api("/api/appointments", { method: "POST", body });
    status.classList.add("success-text");
    status.textContent = result.message || "ჩაწერის მოთხოვნა მიღებულია";
    form.reset();
  } catch (error) {
    status.classList.add("error-text");
    status.textContent = error.message;
  } finally {
    button.disabled = false;
    button.textContent = "მოთხოვნის გაგზავნა";
  }
}

async function renderAdmin() {
  document.title = "ადმინი | მედ ამბულატორია";
  app.innerHTML = `
    <main class="admin-page">
      <section class="admin-shell">
        <div class="empty-state">იტვირთება...</div>
      </section>
    </main>
  `;
  try {
    const session = await api("/api/admin/session");
    if (session.disabled) return renderAdminLogin({ disabled: true, message: session.message });
    if (!session.authenticated) return renderAdminLogin();
    return renderAdminDashboard();
  } catch (error) {
    renderAdminLogin({ error: error.message });
  }
}

function renderAdminLogin({ disabled = false, message = "", error = "" } = {}) {
  document.title = "ადმინის შესვლა | მედ ამბულატორია";
  app.innerHTML = `
    <main class="admin-page">
      <section class="login-card">
        <span class="eyebrow">ადმინი</span>
        <h1>ადმინის შესვლა</h1>
        <p>ჩაწერის მოთხოვნების სანახავად საჭიროა პაროლი.</p>
        <form id="adminLoginForm" class="login-form">
          <label>პაროლი<input name="password" type="password" required autocomplete="current-password" ${disabled ? "disabled" : ""}></label>
          <button class="btn" type="submit" ${disabled ? "disabled" : ""}>შესვლა</button>
          <a class="btn ghost" href="/">საიტზე დაბრუნება</a>
          ${buildMarker()}
          <div id="adminLoginStatus" class="form-status ${disabled || error ? "error-text" : ""}" aria-live="polite">${escapeHtml(message || error)}</div>
        </form>
      </section>
    </main>
  `;
  if (!disabled) document.querySelector("#adminLoginForm").addEventListener("submit", adminLogin);
}

async function adminLogin(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const button = form.querySelector("button[type='submit']");
  const status = document.querySelector("#adminLoginStatus");
  button.disabled = true;
  status.className = "form-status";
  status.textContent = "";
  try {
    await api("/api/admin/login", { method: "POST", body: { password: form.password.value } });
    renderAdminDashboard();
  } catch (error) {
    status.classList.add("error-text");
    status.textContent = error.message;
  } finally {
    button.disabled = false;
  }
}

async function adminLogout() {
  await api("/api/admin/logout", { method: "POST", body: {} }).catch(() => null);
  renderAdminLogin();
}

function renderAdminDashboard() {
  document.title = "ადმინი | მედ ამბულატორია";
  app.innerHTML = `
    <main class="admin-page">
      <section class="admin-shell">
        <div class="admin-head">
          <div>
            <span class="eyebrow">ადმინი</span>
            <h1>მართვის პანელი</h1>
            <p>ჩაწერის მოთხოვნები და საიტის ტექსტები ერთ მარტივ სივრცეში. აქ არ ინახება დიაგნოზი, პირადი ნომერი, ისტორია ან ფაილები.</p>
          </div>
          <div class="admin-actions">
            <a class="btn ghost compact" href="/">საიტზე დაბრუნება</a>
            <button class="btn ghost compact" id="adminLogout" type="button">გასვლა</button>
          </div>
        </div>
        <nav class="admin-tabs" aria-label="ადმინის სექციები">
          ${adminTabButton("overview", "მთავარი")}
          ${adminTabButton("appointments", "მოთხოვნები")}
          ${adminTabButton("content", "კონტენტი")}
          ${adminTabButton("media", "მედია")}
          ${adminTabButton("backup", "სარეზერვო ასლი")}
          ${adminTabButton("settings", "პარამეტრები")}
        </nav>
        <section class="admin-panel" data-admin-panel="overview">
          <div class="section-head split">
            <div>
              <span class="eyebrow">მთავარი</span>
              <h2>დღის მოკლე სურათი</h2>
              <p>ყველაზე საჭირო მოქმედებები სწრაფად, ზედმეტი ტექნიკური დეტალების გარეშე.</p>
            </div>
            ${buildMarker()}
          </div>
          <div id="adminOverview" class="overview-grid">
            <div class="empty-state">იტვირთება...</div>
          </div>
        </section>
        <section class="admin-panel" data-admin-panel="appointments" hidden>
          <div class="section-head split">
            <div>
              <span class="eyebrow">ვიზიტის მოთხოვნები</span>
              <h2>ჩაწერის მოთხოვნები</h2>
              <p>სახელი, ტელეფონი, სერვისი და სასურველი დრო. სამედიცინო ისტორია ან დიაგნოზი არ გროვდება.</p>
            </div>
            <button class="btn ghost compact" id="adminCleanup" type="button">ტესტების გასუფთავება</button>
          </div>
          <div class="admin-filters">
            <input id="adminSearch" placeholder="სახელი, ტელეფონი ან სერვისი">
            <select id="adminStatus">
              <option value="">ყველა სტატუსი</option>
              ${Object.entries(statusLabels).map(([value, label]) => `<option value="${value}">${label}</option>`).join("")}
            </select>
            <select id="adminService">
              <option value="">ყველა სერვისი</option>
              ${services.map(([title]) => `<option>${title}</option>`).join("")}
            </select>
            <button class="btn compact" id="adminApply">ფილტრაცია</button>
          </div>
          <div id="adminStatusText" class="admin-status-text"></div>
          <div id="appointmentsTable"></div>
        </section>
        <section class="content-manager admin-panel" id="contentManager" data-admin-panel="content" hidden>
          <div class="section-head split">
            <div>
              <span class="eyebrow">საიტის კონტენტი</span>
              <h2>საიტის კონტენტი</h2>
              <p>შეცვალეთ საჯარო გვერდის ძირითადი ტექსტები, სერვისები, ექიმები, ფასები და კონტაქტი.</p>
            </div>
            <div class="content-toolbar">
              <button class="btn compact" id="contentSave" type="button">შენახვა</button>
              <button class="btn ghost compact" id="contentReset" type="button">საწყისზე დაბრუნება</button>
            </div>
          </div>
          <div class="admin-note">
            ცვლილების შემდეგ დააჭირეთ შენახვას. დიდი ცვლილების წინ სარეზერვო ასლის სექციიდან ჩამოტვირთეთ ასლი.
          </div>
          <div id="contentStatus" class="admin-status-text"></div>
          <div id="contentEditor" class="content-editor">
            <div class="empty-state">იტვირთება...</div>
          </div>
        </section>
        <section class="admin-panel" data-admin-panel="media" hidden>
          <div class="section-head split">
            <div>
              <span class="eyebrow">მედია / ფოტოები</span>
              <h2>ფოტოების არჩევა</h2>
              <p>აირჩიეთ მხოლოდ კლინიკისთვის მომზადებული ფოტოები. ატვირთვა ჩაირთვება მხოლოდ მუდმივი საცავის კონფიგურაციის შემდეგ.</p>
            </div>
          </div>
          <div id="mediaPanel">
            <div class="empty-state">იტვირთება...</div>
          </div>
        </section>
        <section class="admin-panel" data-admin-panel="backup" hidden>
          <div class="section-head split">
            <div>
              <span class="eyebrow">ასლის შექმნა / აღდგენა</span>
              <h2>სარეზერვო ასლი</h2>
              <p>სარეზერვო ასლი შეინახეთ დიდი ცვლილებების ან განახლების წინ.</p>
            </div>
            <div class="content-toolbar">
              <button class="btn compact" id="contentExport" type="button">ასლის ჩამოტვირთვა</button>
              <button class="btn ghost compact" id="contentImport" type="button">ასლის აღდგენა</button>
            </div>
          </div>
          <input id="contentImportFile" type="file" accept="application/json,.json" hidden>
          <div class="admin-note">ჩამოტვირთული ფაილი შეიცავს მხოლოდ საიტის კონტენტს და ვერსიის ინფორმაციას; ჩაწერის მოთხოვნები, პაროლები და სესიები არ შედის.</div>
          <div id="backupStatus" class="admin-status-text"></div>
        </section>
        <section class="admin-panel" data-admin-panel="settings" hidden>
          <div class="section-head split">
            <div>
              <span class="eyebrow">პარამეტრები</span>
              <h2>საცავი და ვერსია</h2>
              <p>ტექნიკური სტატუსი მოკლედ. დეტალური ინსტრუქცია არის STORAGE_AND_MEDIA_GUIDE.md-ში.</p>
            </div>
          </div>
          <section class="storage-status-card" id="storageStatus">
            <span class="eyebrow">საცავი</span>
            <h2>საცავის სტატუსი</h2>
            <p>იტვირთება...</p>
          </section>
        </section>
      </section>
    </main>
  `;
  bindAdmin();
  loadAppointments();
}

function adminTabButton(tab, label) {
  return `<button class="admin-tab ${activeAdminTab === tab ? "active" : ""}" type="button" data-admin-tab="${tab}">${escapeHtml(label)}</button>`;
}

function bindAdmin() {
  document.querySelectorAll("[data-admin-tab]").forEach((button) => {
    button.addEventListener("click", () => setAdminTab(button.dataset.adminTab));
  });
  document.querySelector("#adminCleanup").addEventListener("click", cleanupSmokeAppointments);
  document.querySelector("#adminLogout").addEventListener("click", adminLogout);
  document.querySelector("#adminApply").addEventListener("click", loadAppointments);
  document.querySelector("#contentSave").addEventListener("click", saveContentManager);
  document.querySelector("#contentExport").addEventListener("click", exportContentManager);
  document.querySelector("#contentImport").addEventListener("click", () => document.querySelector("#contentImportFile").click());
  document.querySelector("#contentImportFile").addEventListener("change", importContentManager);
  document.querySelector("#contentReset").addEventListener("click", resetContentManager);
  document.querySelector("#adminSearch").addEventListener("keydown", (event) => {
    if (event.key === "Enter") loadAppointments();
  });
  loadContentManager();
  setAdminTab(activeAdminTab);
}

function setAdminTab(tab) {
  activeAdminTab = tab || "overview";
  document.querySelectorAll("[data-admin-panel]").forEach((panel) => {
    panel.hidden = panel.dataset.adminPanel !== activeAdminTab;
  });
  document.querySelectorAll("[data-admin-tab]").forEach((button) => {
    button.classList.toggle("active", button.dataset.adminTab === activeAdminTab);
    if (button.dataset.adminTab === activeAdminTab) button.scrollIntoView({ inline: "nearest", block: "nearest" });
  });
}

async function loadContentManager() {
  const status = document.querySelector("#contentStatus");
  const editor = document.querySelector("#contentEditor");
  try {
    const result = await api("/api/admin/content");
    adminAssetOptions = result.assetOptions?.length ? result.assetOptions : adminAssetOptions;
    adminContentOverrides = deepCopy(result.content || {});
    adminBuildInfo = result.build || {};
    adminStorageInfo = adminBuildInfo.storage || {};
    mergeClinicContent(result.content || {});
    adminContentDraft = contentPayloadFromCurrent();
    renderStorageStatus();
    renderAdminOverview();
    renderMediaPanel();
    renderContentEditor();
    status.textContent = "";
  } catch (error) {
    editor.innerHTML = `<div class="empty-state">${escapeHtml(error.message)}</div>`;
  }
}

function renderStorageStatus() {
  const target = document.querySelector("#storageStatus");
  if (!target) return;
  const uploadEnabled = Boolean(adminStorageInfo.mediaUploadEnabled);
  const persistentWarning = Boolean(adminStorageInfo.persistentStorageWarning);
  target.innerHTML = `
    <span class="eyebrow">საცავი</span>
    <h2>საცავის სტატუსი</h2>
    <div class="storage-status-grid">
      <div><b>კონტენტის ბაზა</b><span>${adminStorageInfo.dataDirConfigured ? "DATA_DIR დაყენებულია" : "ლოკალური data/ ნაგულისხმევი"}</span></div>
      <div><b>ფოტოების ატვირთვა</b><span>${uploadEnabled ? "ჩართულია ტესტურ რეჟიმში" : "გამორთულია"}</span></div>
      <div><b>სარეზერვო ასლი</b><span>დიდ ცვლილებამდე ჩამოტვირთეთ JSON ასლი</span></div>
    </div>
    <p>${persistentWarning ? "წარმოებაზე მუდმივი კონტენტისთვის საჭიროა მუდმივი საცავი ან გარე საცავი." : "საცავის კონფიგურაცია მზად არის; ფოტო ატვირთვა მაინც მხოლოდ დაცულ რეჟიმში უნდა ჩაირთოს."}</p>
  `;
}

function renderAdminOverview() {
  const target = document.querySelector("#adminOverview");
  if (!target) return;
  const today = new Date().toISOString().slice(0, 10);
  const counts = adminAppointments.reduce((summary, item) => {
    summary.total += 1;
    summary[item.status] = (summary[item.status] || 0) + 1;
    if (String(item.createdAt || "").slice(0, 10) === today) summary.today += 1;
    return summary;
  }, { total: 0, today: 0, new: 0, contacted: 0, confirmed: 0, cancelled: 0, completed: 0 });
  target.innerHTML = `
    <div class="overview-card"><span>დღეს</span><b>${counts.today}</b><small>ახალი ჩანაწერი დღეს</small></div>
    <div class="overview-card"><span>ახალი</span><b>${counts.new}</b><small>დასაკავშირებელი მოთხოვნა</small></div>
    <div class="overview-card"><span>დაკავშირებული</span><b>${counts.contacted}</b><small>შემდეგი ნაბიჯი დარჩა</small></div>
    <div class="overview-card"><span>დადასტურებული</span><b>${counts.confirmed}</b><small>ვიზიტი შეთანხმებულია</small></div>
    <div class="overview-actions">
      <button class="btn compact" type="button" data-overview-tab="appointments">ახალი მოთხოვნის ნახვა</button>
      <button class="btn ghost compact" type="button" data-overview-tab="content">საიტის კონტენტის შეცვლა</button>
      <button class="btn ghost compact" type="button" data-overview-export>ასლის ჩამოტვირთვა</button>
    </div>
    <div class="overview-note">${adminStorageInfo.persistentStorageWarning ? "სანამ მუდმივი საცავი ჩაირთვება, დიდი ცვლილების წინ შეინახეთ სარეზერვო ასლი." : "სარეზერვო ასლი გამოიყენეთ მნიშვნელოვანი განახლების წინ."}</div>
  `;
  target.querySelectorAll("[data-overview-tab]").forEach((button) => {
    button.addEventListener("click", () => setAdminTab(button.dataset.overviewTab));
  });
  target.querySelector("[data-overview-export]")?.addEventListener("click", exportContentManager);
}

function assetMeta(path = "") {
  const known = {
    "/assets/clinic-consultation.png": ["სლაიდერი", "კონსულტაცია"],
    "/assets/clinic-reception.png": ["სლაიდერი", "რეგისტრატურა"],
    "/assets/clinic-diagnostics.png": ["სლაიდერი", "დიაგნოსტიკა"],
    "/assets/clinic-hero.png": ["კლინიკა", "კლინიკის მთავარი ფოტო"],
    "/assets/site-logo.png": ["კლინიკა", "ლოგო / ნიშანი"],
    "/assets/doctor-therapist.png": ["ექიმები", "თერაპევტის ფოტო"],
    "/assets/doctor-cardiologist.png": ["ექიმები", "კარდიოლოგის ფოტო"],
    "/assets/doctor-pediatrician.png": ["ექიმები", "პედიატრის ფოტო"],
    "/assets/doctor-endocrinologist.png": ["ექიმები", "ენდოკრინოლოგის ფოტო"]
  };
  if (known[path]) return { category: known[path][0], label: known[path][1], path };
  if (path.startsWith("/uploads/")) return { category: "ატვირთული", label: path.split("/").pop(), path };
  if (path.includes("doctor-")) return { category: "ექიმები", label: path.split("/").pop(), path };
  return { category: "კლინიკა", label: path.split("/").pop() || path, path };
}

function groupedAssetOptions() {
  return adminAssetOptions.reduce((groups, path) => {
    const meta = assetMeta(path);
    if (!groups[meta.category]) groups[meta.category] = [];
    groups[meta.category].push(meta);
    return groups;
  }, {});
}

function renderMediaPanel() {
  const target = document.querySelector("#mediaPanel");
  if (!target) return;
  const groups = groupedAssetOptions();
  target.innerHTML = `
    ${mediaUploadPanel()}
    <div class="asset-category-grid">
      ${["კლინიკა", "ექიმები", "სლაიდერი", "ატვირთული"].filter((category) => groups[category]?.length).map((category) => `
        <section class="asset-category">
          <h3>${escapeHtml(category)}</h3>
          <div class="asset-gallery">
            ${groups[category].map((asset) => `<article class="asset-card">
              <img src="${escapeHtml(asset.path)}" alt="${escapeHtml(asset.label)}">
              <b>${escapeHtml(asset.label)}</b>
              <details><summary>ტექნიკური path</summary><span>${escapeHtml(asset.path)}</span></details>
            </article>`).join("")}
          </div>
        </section>`).join("")}
    </div>
  `;
  const uploadInput = target.querySelector("#mediaUploadFile");
  if (uploadInput) uploadInput.addEventListener("change", uploadMediaAsset);
}

function renderContentEditor() {
  const editor = document.querySelector("#contentEditor");
  if (!editor || !adminContentDraft) return;
  editor.innerHTML = `
    <div class="content-editor-intro">
      <b>სექციები დალაგებულია საჯარო გვერდის მიხედვით.</b>
      <span>გახსენით მხოლოდ ის ბლოკი, რომლის შეცვლაც გჭირდებათ.</span>
    </div>
    <div class="content-grid">
      ${contentCard("მთავარი ტექსტები", [
        inputField("კლინიკის სახელი", "siteInfo.clinicName"),
        inputField("სლოგანი", "siteInfo.shortSlogan"),
        inputField("ვერსიის ტექსტი", "siteInfo.demoVersionNote"),
        inputField("მთავარი ღილაკი", "siteInfo.primaryCta"),
        inputField("მეორე ღილაკი", "siteInfo.secondaryCta")
      ].join(""), "სახელი, მოკლე სლოგანი და მთავარი ღილაკების ტექსტები.", "siteInfo", true)}
      ${contentCard("კონტაქტი", [
        inputField("ტელეფონი", "contact.phone"),
        inputField("ტელეფონი ბმულისთვის", "contact.phoneHref"),
        inputField("ელფოსტა", "contact.email"),
        inputField("მისამართი", "contact.address"),
        inputField("სამუშაო საათები", "contact.workingHours"),
        inputField("Google Maps embed", "contact.mapEmbedUrl"),
        inputField("Google Maps ბმული", "contact.mapLink"),
        inputField("Facebook", "contact.facebookUrl"),
        inputField("Instagram", "contact.instagramUrl"),
        inputField("WhatsApp", "contact.whatsappUrl"),
        inputField("Telegram", "contact.telegramUrl")
      ].join(""), "საჯარო საკონტაქტო ინფორმაცია, რუკა და სოციალური ბმულები.", "contact")}
      ${contentCard("სამართლებრივი ტექსტები", [
        textField("ფუტერის ტექსტი", "footer.footerText"),
        inputField("პერსონალური მონაცემების ბმული", "footer.privacyLinkText"),
        textField("ფორმის შენიშვნა", "consentText.privacyNote"),
        textField("თანხმობის ტექსტი", "consentText.consentCopy"),
        textField("კომენტარის მინიშნება", "consentText.commentPlaceholder")
      ].join(""), "მოკლე განმარტებები ფორმასთან და გვერდის ქვედა ნაწილში.", "footer-consent")}
    </div>
    ${listSection("heroSlides", "სლაიდერი", "სლაიდის დამატება", ["title", "text", "image"], ["მოკლე სათაური", "ვრცელი აღწერა", "ფოტო"], "მთავარი გვერდის ზედა ფოტოები და მოკლე ტექსტები.", true)}
    ${listSection("services", "სერვისები", "სერვისის დამატება", ["title", "description", "price"], ["სერვისის სახელი", "მოკლე აღწერა", "ფასი"], "საჯარო გვერდზე ნაჩვენები სერვისების სია.")}
    ${listSection("doctors", "ექიმები", "ექიმის დამატება", ["name", "specialty", "note", "image"], ["სახელი", "სპეციალობა", "აღწერა / ბიო", "ფოტო"], "ექიმების სამუშაო პროფილები; რეალური მონაცემები მხოლოდ დადასტურების შემდეგ შეიყვანეთ.")}
    ${listSection("prices", "ფასები", "ფასის დამატება", ["title", "price"], ["სერვისი", "ფასი"], "საწყისი ფასების მოკლე სია.")}
  `;
  editor.querySelectorAll("[data-content-path]").forEach((field) => {
    field.addEventListener("input", () => setContentPath(field.dataset.contentPath, field.value));
  });
  editor.querySelectorAll("[data-asset-select]").forEach((field) => {
    field.addEventListener("change", () => {
      if (!field.value) return;
      setContentPath(field.dataset.assetSelect, field.value);
      renderContentEditor();
    });
  });
  editor.querySelectorAll("[data-content-action]").forEach((button) => {
    button.addEventListener("click", () => handleContentAction(button.dataset.contentAction, button.dataset.section, Number(button.dataset.index || -1)));
  });
  editor.querySelectorAll("[data-reset-section]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      resetContentSection(button.dataset.resetSection, button.textContent.trim());
    });
  });
}

function contentCard(title, body, helper = "", resetSection = "", open = false) {
  return `<details class="content-card" ${open ? "open" : ""}>
    <summary><span><b>${escapeHtml(title)}</b>${helper ? `<small>${escapeHtml(helper)}</small>` : ""}</span></summary>
    <div class="content-card-body">
      ${body}
      ${resetSection ? sectionResetRow(resetSection) : ""}
    </div>
  </details>`;
}

function sectionResetRow(section) {
  return `<div class="section-reset-row">
    <button class="btn ghost compact reset-btn" type="button" data-reset-section="${escapeHtml(section)}">სექციის საწყისზე დაბრუნება</button>
  </div>`;
}

function inputField(label, path) {
  return `<label class="content-field field-compact"><span>${escapeHtml(label)}</span><input data-content-path="${escapeHtml(path)}" value="${escapeHtml(getContentPath(path))}"></label>`;
}

function textField(label, path) {
  return `<label class="content-field field-wide"><span>${escapeHtml(label)}</span><textarea data-content-path="${escapeHtml(path)}">${escapeHtml(getContentPath(path))}</textarea></label>`;
}

function listSection(section, title, addLabel, fields, labels, helper = "", open = false) {
  const items = adminContentDraft[section] || [];
  return `<details class="content-card content-list-card" ${open ? "open" : ""}>
    <summary><span><b>${escapeHtml(title)}</b>${helper ? `<small>${escapeHtml(helper)}</small>` : ""}</span></summary>
    <div class="content-list-head">
      <span>${items.length} ჩანაწერი</span>
      <button class="btn ghost compact" type="button" data-content-action="add" data-section="${section}">${escapeHtml(addLabel)}</button>
    </div>
    <div class="content-list">
      ${items.map((item, index) => `<article class="content-item content-item-${escapeHtml(section)}">
        <div class="content-item-head">
          <strong>${escapeHtml(item.title || item.name || `${title} ${index + 1}`)}</strong>
          <div class="content-mini-actions">
            <button type="button" data-content-action="up" data-section="${section}" data-index="${index}" aria-label="ზემოთ">↑</button>
            <button type="button" data-content-action="down" data-section="${section}" data-index="${index}" aria-label="ქვემოთ">↓</button>
            <button type="button" data-content-action="delete" data-section="${section}" data-index="${index}" aria-label="წაშლა">×</button>
          </div>
        </div>
        <div class="content-fields">
          ${fields.map((field, fieldIndex) => {
            const path = `${section}.${index}.${field}`;
            return contentListField(section, field, labels[fieldIndex], path, item[field] || "");
          }).join("")}
        </div>
      </article>`).join("")}
    </div>
    ${sectionResetRow(section)}
  </details>`;
}

function contentListField(section, field, label, path, value) {
  if (field === "image") return imageField(label, path, value, section);
  const longField = field === "text" || field === "description" || field === "note";
  const helper = fieldHelper(section, field);
  const className = longField ? "field-wide field-long" : field === "price" ? "field-compact" : "field-medium";
  const control = longField
    ? `<textarea data-content-path="${escapeHtml(path)}">${escapeHtml(value)}</textarea>`
    : `<input data-content-path="${escapeHtml(path)}" value="${escapeHtml(value)}">`;
  return `<label class="content-field ${className}">
    <span>${escapeHtml(label)}</span>
    ${helper ? `<small>${escapeHtml(helper)}</small>` : ""}
    ${control}
  </label>`;
}

function fieldHelper(section, field) {
  if (section === "heroSlides" && field === "title") return "მოკლედ, ერთი ხაზი";
  if (section === "heroSlides" && field === "text") return "ფოტოს ქვემოთ გამოჩნდება სლაიდერში";
  if (section === "services" && field === "description") return "ორი-სამი მოკლე წინადადება სერვისის შესახებ";
  if (section === "doctors" && field === "note") return "მოკლე ბიო ან სამუშაო პროფილის აღწერა";
  if (section === "prices" && field === "price") return "მაგ. საწყისი ფასი ან დასაზუსტებელია";
  return "";
}

function imageField(label, path, value, section = "") {
  const selected = assetMeta(value);
  const helper = section === "heroSlides" ? "ფოტო გამოჩნდება სლაიდერში" : "ფოტო გამოჩნდება ბარათზე";
  return `<div class="asset-field asset-field-${escapeHtml(section)}">
    <span class="field-label">${escapeHtml(label)}</span>
    <small>${escapeHtml(helper)}</small>
    <span class="asset-picker">
      ${value ? `<img class="asset-preview" src="${escapeHtml(value)}" alt="${escapeHtml(selected.label)}">` : `<span class="asset-preview empty">ფოტო არ არის არჩეული</span>`}
      <select data-asset-select="${escapeHtml(path)}">
        <option value="">ფოტოს არჩევა</option>
        ${Object.entries(groupedAssetOptions()).map(([category, assets]) => `<optgroup label="${escapeHtml(category)}">${assets.map((asset) => `<option value="${escapeHtml(asset.path)}" ${asset.path === value ? "selected" : ""}>${escapeHtml(asset.label)}</option>`).join("")}</optgroup>`).join("")}
      </select>
      <details class="advanced-path">
        <summary>ტექნიკური path</summary>
        <small>გამოიყენეთ მხოლოდ საჭიროებისას</small>
        <input data-content-path="${escapeHtml(path)}" value="${escapeHtml(value)}" placeholder="/assets/photo.png">
      </details>
    </span>
  </div>`;
}

function mediaUploadPanel() {
  const enabled = Boolean(adminStorageInfo.mediaUploadEnabled);
  if (!enabled) {
    return `<section class="media-upload-panel disabled">
      <div>
        <b>ფოტოების ატვირთვა გამორთულია</b>
        <p>ამ ეტაპზე გამოიყენეთ მხოლოდ მომზადებული კლინიკის ფოტოები. რეალური ატვირთვა ჩაირთვება მხოლოდ მუდმივი საცავის კონფიგურაციის შემდეგ.</p>
      </div>
    </section>`;
  }
  return `<section class="media-upload-panel">
    <div>
      <b>ფოტოს ატვირთვა</b>
      <p>დაშვებულია JPG, PNG ან WebP, მაქსიმუმ 3MB. SVG/HTML/script ფაილები არ მიიღება.</p>
    </div>
    <label class="btn ghost compact" for="mediaUploadFile">ფაილის არჩევა</label>
    <input id="mediaUploadFile" type="file" accept="image/jpeg,image/png,image/webp" hidden>
  </section>`;
}

async function uploadMediaAsset(event) {
  const input = event.currentTarget;
  const file = input.files?.[0];
  if (!file) return;
  const status = document.querySelector("#contentStatus");
  try {
    const body = new FormData();
    body.append("file", file);
    status.textContent = "ფოტო იტვირთება...";
    const response = await fetch("/api/admin/media/upload", { method: "POST", body });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.message || "ატვირთვა ვერ შესრულდა");
    if (result.path && !adminAssetOptions.includes(result.path)) adminAssetOptions.push(result.path);
    renderContentEditor();
    status.textContent = "ფოტო მზად არის";
  } catch (error) {
    status.textContent = error.message || "ატვირთვა ვერ შესრულდა";
  } finally {
    input.value = "";
  }
}

function getContentPath(path) {
  return path.split(".").reduce((target, key) => target?.[key], adminContentDraft) ?? "";
}

function setContentPath(path, value) {
  const parts = path.split(".");
  let target = adminContentDraft;
  parts.slice(0, -1).forEach((part) => {
    target = target[part];
  });
  target[parts.at(-1)] = value;
}

function handleContentAction(action, section, index) {
  const list = adminContentDraft[section];
  if (!Array.isArray(list)) return;
  if (action === "add") list.push(emptyContentItem(section));
  if (action === "delete" && index >= 0) list.splice(index, 1);
  if (action === "up" && index > 0) [list[index - 1], list[index]] = [list[index], list[index - 1]];
  if (action === "down" && index >= 0 && index < list.length - 1) [list[index + 1], list[index]] = [list[index], list[index + 1]];
  renderContentEditor();
}

function emptyContentItem(section) {
  if (section === "heroSlides") return { title: "", text: "", image: "/assets/clinic-hero.png", tone: "consultation" };
  if (section === "services") return { title: "", description: "", price: "" };
  if (section === "doctors") return { name: "", specialty: "", note: "", image: "" };
  return { title: "", price: "" };
}

async function saveContentManager() {
  const status = document.querySelector("#contentStatus");
  status.textContent = "ინახება...";
  try {
    const result = await api("/api/admin/content", { method: "PUT", body: { content: adminContentDraft } });
    adminContentOverrides = deepCopy(result.content || {});
    mergeClinicContent(result.content || {});
    adminContentDraft = contentPayloadFromCurrent();
    renderContentEditor();
    status.textContent = "ცვლილებები შენახულია";
  } catch (error) {
    status.textContent = humanAdminError(error.message);
  }
}

function exportContentManager() {
  if (!adminContentDraft) return;
  const exportedAt = new Date().toISOString();
  const payload = {
    type: "clinic-content-backup",
    exportedAt,
    app: {
      name: adminBuildInfo.appName || "virera-plumbing-store",
      version: adminBuildInfo.version || adminBuildInfo.appVersion || "",
      commit: adminBuildInfo.commit || "",
      buildTime: adminBuildInfo.buildTime || ""
    },
    content: deepCopy(adminContentDraft),
    overrides: deepCopy(adminContentOverrides)
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `clinic-content-backup-${exportedAt.slice(0, 10)}.json`;
  document.body.append(link);
  link.click();
  URL.revokeObjectURL(link.href);
  link.remove();
  setAdminMessage("სარეზერვო JSON ასლი ჩამოიტვირთა", "backup");
}

async function importContentManager(event) {
  const input = event.currentTarget;
  const file = input.files?.[0];
  if (!file) return;
  const status = document.querySelector("#backupStatus") || document.querySelector("#contentStatus");
  try {
    if (file.size > 300000) throw new Error("ფაილი ძალიან დიდია");
    const raw = await file.text();
    const parsed = JSON.parse(raw);
    const content = parsed.content || parsed.overrides || parsed;
    status.textContent = "იმპორტი ინახება...";
    const result = await api("/api/admin/content", { method: "PUT", body: { content } });
    adminContentOverrides = deepCopy(result.content || {});
    mergeClinicContent(result.content || {});
    adminContentDraft = contentPayloadFromCurrent();
    renderContentEditor();
    status.textContent = "კონტენტი იმპორტირებულია";
  } catch (error) {
    status.textContent = humanAdminError(error.message) || "იმპორტი ვერ შესრულდა";
  } finally {
    input.value = "";
  }
}

function setAdminMessage(message, area = "content") {
  const target = area === "backup" ? document.querySelector("#backupStatus") : document.querySelector("#contentStatus");
  if (target) target.textContent = message;
}

function humanAdminError(message = "") {
  if (/Unsafe content/i.test(message)) return "ტექსტში დაუშვებელი კოდი ან ბმულია.";
  if (/Image path/i.test(message)) return "სურათის მისამართი უნდა იყოს უსაფრთხო ლოკალური ფაილი.";
  if (/Too many items/i.test(message)) return "ამ სექციაში ძალიან ბევრი ჩანაწერია.";
  if (/Unsupported content section/i.test(message)) return "სარეზერვო ფაილში უცნობი სექციაა.";
  if (/Text exceeds/i.test(message)) return "ერთ-ერთი ტექსტი ძალიან გრძელია.";
  return message;
}

async function resetContentSection(section, label) {
  const sections = section === "footer-consent" ? ["footer", "consentText"] : [section];
  if (!confirm(`${label}?`)) return;
  const status = document.querySelector("#contentStatus");
  status.textContent = "სექცია სუფთავდება...";
  try {
    let latest = {};
    for (const item of sections) {
      const result = await api("/api/admin/content/reset-section", { method: "POST", body: { section: item } });
      latest = result.content || {};
    }
    adminContentOverrides = deepCopy(latest);
    mergeClinicContent(latest);
    adminContentDraft = contentPayloadFromCurrent();
    renderContentEditor();
    status.textContent = "სექცია საწყის მნიშვნელობებზე დაბრუნდა";
  } catch (error) {
    status.textContent = error.message;
  }
}

async function resetContentManager() {
  if (!confirm("ყველა ტექსტის საწყისზე დაბრუნება?")) return;
  const status = document.querySelector("#contentStatus");
  status.textContent = "სუფთავდება...";
  try {
    const result = await api("/api/admin/content/reset-section", { method: "POST", body: { section: "" } });
    adminContentOverrides = deepCopy(result.content || {});
    mergeClinicContent(result.content || {});
    adminContentDraft = contentPayloadFromCurrent();
    renderContentEditor();
    status.textContent = "საწყისი კონტენტი აღდგენილია";
  } catch (error) {
    status.textContent = error.message;
  }
}

async function cleanupSmokeAppointments() {
  const text = document.querySelector("#adminStatusText");
  try {
    const result = await api("/api/admin/appointments/cleanup-smoke", { method: "POST", body: {} });
    text.textContent = `${result.removed || 0} ტესტი გასუფთავდა`;
    await refreshAppointmentSummary();
    await loadAppointments();
  } catch (error) {
    text.textContent = error.message;
  }
}

async function loadAppointments() {
  const params = new URLSearchParams();
  const q = document.querySelector("#adminSearch")?.value.trim();
  const status = document.querySelector("#adminStatus")?.value;
  const service = document.querySelector("#adminService")?.value;
  if (q) params.set("q", q);
  if (status) params.set("status", status);
  if (service) params.set("service", service);
  const target = document.querySelector("#appointmentsTable");
  document.querySelector("#adminStatusText").textContent = "იტვირთება...";
  try {
    const rows = await api(`/api/admin/appointments${params.toString() ? `?${params}` : ""}`);
    if (!params.toString()) {
      adminAppointments = rows;
      renderAdminOverview();
    }
    document.querySelector("#adminStatusText").textContent = `${rows.length} მოთხოვნა`;
    target.innerHTML = appointmentTable(rows);
    target.querySelectorAll("[data-status-id]").forEach((select) => {
      select.addEventListener("change", () => updateStatus(select.dataset.statusId, select.value));
    });
  } catch (error) {
    document.querySelector("#adminStatusText").textContent = error.message;
    target.innerHTML = "";
  }
}

async function refreshAppointmentSummary() {
  try {
    adminAppointments = await api("/api/admin/appointments");
    renderAdminOverview();
  } catch {}
}

function appointmentTable(rows) {
  if (!rows.length) return `<div class="empty-state">ჩაწერის მოთხოვნები ჯერ არ არის</div>`;
  return `<div class="admin-table-wrap"><table class="admin-table">
    <thead><tr><th>პაციენტი</th><th>სერვისი</th><th>თარიღი/დრო</th><th>კომენტარი</th><th>სტატუსი</th><th>შექმნა</th></tr></thead>
    <tbody>${rows.map((row) => `<tr>
      <td data-label="პაციენტი"><b>${escapeHtml(row.fullName)}</b><br><a href="tel:${escapeHtml(row.phone)}">${escapeHtml(row.phone)}</a></td>
      <td data-label="სერვისი">${escapeHtml(row.service)}${row.doctor ? `<br><small>${escapeHtml(row.doctor)}</small>` : ""}</td>
      <td data-label="თარიღი/დრო">${escapeHtml(row.preferredDate)}<br><small>${escapeHtml(row.preferredTime)}</small></td>
      <td data-label="კომენტარი">${escapeHtml(row.comment || "—")}</td>
      <td data-label="სტატუსი"><span class="status-pill status-${escapeHtml(row.status)}">${escapeHtml(statusLabels[row.status] || row.status)}</span><select data-status-id="${row.id}">${Object.entries(statusLabels).map(([value, label]) => `<option value="${value}" ${row.status === value ? "selected" : ""}>${label}</option>`).join("")}</select></td>
      <td data-label="შექმნა">${escapeHtml(row.createdAt)}</td>
    </tr>`).join("")}</tbody>
  </table></div>`;
}

async function updateStatus(id, status) {
  const text = document.querySelector("#adminStatusText");
  try {
    await api(`/api/admin/appointments/${id}/status`, { method: "PATCH", body: { status } });
    text.textContent = "სტატუსი განახლდა";
    refreshAppointmentSummary();
    setTimeout(loadAppointments, 250);
  } catch (error) {
    text.textContent = error.message;
  }
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
}

window.addEventListener("hashchange", render);
init();
