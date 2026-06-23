const services = [
  ["თერაპია", "პირველადი კონსულტაცია, გეგმიური კონტროლი და ყოველდღიური ჯანმრთელობის მართვა.", "45 ლარიდან"],
  ["კარდიოლოგია", "გულის რიტმის, წნევის და გულ-სისხლძარღვთა რისკების შეფასება.", "70 ლარიდან"],
  ["პედიატრია", "ბავშვთა პროფილაქტიკური და გადაუდებელი ამბულატორიული კონსულტაციები.", "55 ლარიდან"],
  ["ენდოკრინოლოგია", "ფარისებრი ჯირკვლის, დიაბეტის და ჰორმონული ბალანსის მართვა.", "65 ლარიდან"],
  ["გინეკოლოგია", "პრევენციული ვიზიტები, კონსულტაციები და უსაფრთხო გეგმიური მონიტორინგი.", "70 ლარიდან"],
  ["ნევროლოგია", "თავის ტკივილის, ძილის, მოძრაობისა და ნერვული სისტემის ჩივილების შეფასება.", "75 ლარიდან"],
  ["ლაბორატორიული კვლევები", "საბაზისო ანალიზები და სწრაფი პასუხები ექიმის რეკომენდაციით.", "15 ლარიდან"],
  ["ულტრაბგერითი კვლევა", "მუცლის ღრუს, ფარისებრი ჯირკვლისა და სხვა გეგმიური კვლევები.", "60 ლარიდან"]
];

const doctors = [
  ["დრ. ნინო მაისურაძე", "თერაპევტი", "12 წლიანი გამოცდილება"],
  ["დრ. გიორგი ქავთარაძე", "კარდიოლოგი", "15 წლიანი გამოცდილება"],
  ["დრ. თამარ ლომიძე", "პედიატრი", "10 წლიანი გამოცდილება"],
  ["დრ. მარიამ ბერიძე", "ენდოკრინოლოგი", "9 წლიანი გამოცდილება"]
];

const benefits = [
  ["გამოცდილი ექიმები", "სპეციალისტები, რომლებიც პაციენტთან მარტივად და გასაგებად საუბრობენ."],
  ["თანამედროვე აღჭურვილობა", "სუფთა, ნათელი სივრცე და პირველადი დიაგნოსტიკის საჭირო პირობები."],
  ["მოკლე ლოდინის დრო", "ვიზიტის წინასწარი დაჯავშნა და ოპერატორის სწრაფი უკუკავშირი."],
  ["ინდივიდუალური მიდგომა", "ყოველი ვიზიტი იგეგმება პაციენტის საჭიროებისა და დროის გათვალისწინებით."]
];

const statusLabels = {
  new: "ახალი",
  contacted: "დაკავშირებული",
  confirmed: "დადასტურებული",
  cancelled: "გაუქმებული",
  completed: "დასრულებული"
};

const app = document.querySelector("#app");

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

function isAdminRoute() {
  return location.pathname === "/admin" || location.hash === "#/admin";
}

function render() {
  if (isAdminRoute()) renderAdmin();
  else renderClinic();
}

function renderClinic() {
  document.title = "მედ ამბულატორია";
  app.innerHTML = `
    <header class="site-header">
      <div class="container header-grid">
        <a class="brand" href="#top" aria-label="მედ ამბულატორია">
          <span class="brand-mark">+</span>
          <span><strong>მედ ამბულატორია</strong><small>პირველი კლინიკური ვერსია</small></span>
        </a>
        <nav aria-label="მთავარი მენიუ">
          <a href="#top">მთავარი</a>
          <a href="#about">ჩვენს შესახებ</a>
          <a href="#services">სერვისები</a>
          <a href="#doctors">ექიმები</a>
          <a href="#prices">ფასები</a>
          <a href="#contact">კონტაქტი</a>
        </nav>
        <a class="btn compact" href="#appointment">ვიზიტის დაჯავშნა</a>
      </div>
    </header>

    <main id="top">
      <section class="hero">
        <div class="container hero-grid">
          <div class="hero-copy">
            <span class="eyebrow">ამბულატორიული კლინიკა</span>
            <h1>სანდო სამედიცინო ზრუნვა თქვენთან ახლოს</h1>
            <p>ვიღებთ პაციენტებს გეგმიურ კონსულტაციებზე, დიაგნოსტიკასა და პროფილაქტიკურ ვიზიტებზე. მარტივი დაჯავშნა, ყურადღებიანი ექიმები და ნათელი გარემო.</p>
            <div class="hero-actions">
              <a class="btn" href="#appointment">ვიზიტის დაჯავშნა</a>
              <a class="btn ghost" href="#services">სერვისების ნახვა</a>
            </div>
            <div class="hero-stats" aria-label="კლინიკის მაჩვენებლები">
              <span><b>8+</b> მიმართულება</span>
              <span><b>4</b> ექიმი v1-ში</span>
              <span><b>24 სთ</b> უკუკავშირი</span>
            </div>
          </div>
          <div class="hero-visual">
            <img src="/assets/clinic-hero.png" alt="თანამედროვე კლინიკის ექიმი და პაციენტი">
            <div class="visit-card">
              <b>დღეს ხელმისაწვდომია</b>
              <span>თერაპია · კარდიოლოგია · პედიატრია</span>
            </div>
          </div>
        </div>
      </section>

      <section class="section trust" id="about">
        <div class="container">
          <div class="section-head">
            <span class="eyebrow">რატომ ჩვენ</span>
            <h2>კლინიკა, სადაც ვიზიტი მარტივი და გასაგებია</h2>
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
              <span class="eyebrow">სერვისები</span>
              <h2>ძირითადი სამედიცინო მიმართულებები</h2>
            </div>
            <a class="text-link" href="#appointment">აირჩიეთ სერვისი და დაჯავშნეთ ვიზიტი</a>
          </div>
          <div class="service-grid">
            ${services.map(([title, text, price]) => `<article class="service-card"><div>${icon("+")}<span>საწყისი ფასი: ${price}</span></div><h3>${title}</h3><p>${text}</p><a href="#appointment" data-service="${title}">ვიზიტის დაჯავშნა</a></article>`).join("")}
          </div>
        </div>
      </section>

      <section class="section doctors" id="doctors">
        <div class="container">
          <div class="section-head">
            <span class="eyebrow">ექიმები</span>
            <h2>სპეციალისტების პირველი გუნდი</h2>
            <p>დემო პროფილებია პრეზენტაციისთვის; რეალური ექიმების მონაცემები მარტივად ჩანაცვლდება.</p>
          </div>
          <div class="doctor-grid">
            ${doctors.map(([name, specialty, experience], index) => `<article class="doctor-card"><div class="doctor-photo">${["ნმ","გქ","თლ","მბ"][index]}</div><h3>${name}</h3><p>${specialty}</p><span>${experience}</span><a class="btn ghost" href="#appointment" data-doctor="${name}">დაჯავშნა</a></article>`).join("")}
          </div>
        </div>
      </section>

      <section class="section prices" id="prices">
        <div class="container prices-grid">
          <div>
            <span class="eyebrow">ფასები</span>
            <h2>გამჭვირვალე საწყისი ფასები</h2>
            <p>ფასები მითითებულია საწყისი კონსულტაციისთვის. საბოლოო ღირებულება დამოკიდებულია საჭირო კვლევასა და ექიმის რეკომენდაციაზე.</p>
          </div>
          <div class="price-list">
            ${services.slice(0, 6).map(([title, , price]) => `<div><span>${title}</span><b>საწყისი ფასი: ${price}</b></div>`).join("")}
          </div>
        </div>
      </section>

      <section class="section appointment" id="appointment">
        <div class="container appointment-grid">
          <div>
            <span class="eyebrow">დაჯავშნა</span>
            <h2>მოითხოვეთ ვიზიტი</h2>
            <p>შეავსეთ მხოლოდ მინიმალური ინფორმაცია. ოპერატორი დაგიკავშირდებათ დროის დასადასტურებლად.</p>
            <div class="privacy-note">ფორმა არ ითხოვს დიაგნოზს, პირად ნომერს, სამედიცინო ისტორიას ან ანალიზის ფაილებს.</div>
          </div>
          <form id="appointmentForm" class="appointment-form">
            <label class="hp-field" aria-hidden="true">Website<input name="website" tabindex="-1" autocomplete="off"></label>
            <label>სახელი და გვარი<input name="fullName" required autocomplete="name"></label>
            <label>ტელეფონი<input name="phone" required autocomplete="tel"></label>
            <label>სერვისი<select name="service" required>${services.map(([title]) => `<option>${title}</option>`).join("")}</select></label>
            <label>ექიმი<select name="doctor"><option value="">ნებისმიერი ხელმისაწვდომი ექიმი</option>${doctors.map(([name]) => `<option>${name}</option>`).join("")}</select></label>
            <label>სასურველი თარიღი<input name="preferredDate" type="date" required></label>
            <label>სასურველი დრო<input name="preferredTime" type="time" required></label>
            <label class="wide">კომენტარი<textarea name="comment" maxlength="500" placeholder="არ მიუთითოთ დიაგნოზი ან მგრძნობიარე სამედიცინო ინფორმაცია"></textarea></label>
            <p class="consent-note wide">გაგზავნით ადასტურებთ, რომ საკონტაქტო მონაცემები გამოიყენება მხოლოდ ვიზიტის მოთხოვნაზე პასუხისთვის.</p>
            <button class="btn wide" type="submit">მოთხოვნის გაგზავნა</button>
            <div id="formStatus" class="form-status" aria-live="polite"></div>
          </form>
        </div>
      </section>

      <section class="section contact" id="contact">
        <div class="container contact-grid">
          <div>
            <span class="eyebrow">კონტაქტი</span>
            <h2>დაგვიკავშირდით</h2>
            <p><b>ტელეფონი:</b> +995 599 12 34 56</p>
            <p><b>მისამართი:</b> თბილისი, სამედიცინო ქუჩა 12</p>
            <p><b>სამუშაო საათები:</b> ორშაბათი-შაბათი, 09:00-18:00</p>
            <a class="btn compact call-btn" href="tel:+995599123456">დარეკვა</a>
          </div>
          <div class="map-placeholder">
            <span>რუკის ადგილი</span>
            <b>კლინიკის მდებარეობა</b>
            <small>რეალური რუკა დაემატება შემდეგ ვერსიაში</small>
          </div>
        </div>
      </section>
    </main>

    <footer class="site-footer">
      <div class="container footer-grid">
        <div><b>მედ ამბულატორია</b><p>სუფთა, მშვიდი და პაციენტზე ორიენტირებული ამბულატორიული კლინიკის პირველი ვერსია.</p></div>
        <div><b>სერვისები</b>${services.slice(0, 5).map(([title]) => `<a href="#services">${title}</a>`).join("")}</div>
        <div><b>კონტაქტი</b><p>+995 599 12 34 56<br>თბილისი, სამედიცინო ქუჩა 12</p><a href="#privacy">პერსონალური მონაცემების დაცვა</a></div>
      </div>
    </footer>
  `;

  bindClinicUi();
}

function bindClinicUi() {
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
  document.title = "ჩაწერის მოთხოვნები | მედ ამბულატორია";
  app.innerHTML = `
    <main class="admin-page">
      <section class="admin-shell">
        <div class="admin-head">
          <div>
            <span class="eyebrow">ადმინი</span>
            <h1>ჩაწერის მოთხოვნები</h1>
            <p>მინიმალური ამბულატორიული ჩაწერის მოთხოვნები. აქ არ ინახება დიაგნოზი, პირადი ნომერი, ისტორია ან ფაილები.</p>
          </div>
          <div class="admin-actions">
            <a class="btn ghost compact" href="/">საიტზე დაბრუნება</a>
            <button class="btn ghost compact" id="adminCleanup" type="button">ტესტების გასუფთავება</button>
            <button class="btn ghost compact" id="adminLogout" type="button">გასვლა</button>
          </div>
        </div>
        <div class="admin-filters">
          <input id="adminSearch" placeholder="სახელი ან ტელეფონი">
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
    </main>
  `;
  bindAdmin();
  loadAppointments();
}

function bindAdmin() {
  document.querySelector("#adminCleanup").addEventListener("click", cleanupSmokeAppointments);
  document.querySelector("#adminLogout").addEventListener("click", adminLogout);
  document.querySelector("#adminApply").addEventListener("click", loadAppointments);
  document.querySelector("#adminSearch").addEventListener("keydown", (event) => {
    if (event.key === "Enter") loadAppointments();
  });
}

async function cleanupSmokeAppointments() {
  const text = document.querySelector("#adminStatusText");
  try {
    const result = await api("/api/admin/appointments/cleanup-smoke", { method: "POST", body: {} });
    text.textContent = `${result.removed || 0} ტესტი გასუფთავდა`;
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
    setTimeout(loadAppointments, 250);
  } catch (error) {
    text.textContent = error.message;
  }
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
}

window.addEventListener("hashchange", render);
render();
