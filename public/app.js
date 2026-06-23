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

const app = document.querySelector("#app");

function icon(label) {
  return `<span class="icon" aria-hidden="true">${label}</span>`;
}

function render() {
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
            ${services.map(([title, text, price]) => `<article class="service-card"><div>${icon("+")}<span>${price}</span></div><h3>${title}</h3><p>${text}</p><a href="#appointment" data-service="${title}">ვიზიტის დაჯავშნა</a></article>`).join("")}
          </div>
        </div>
      </section>

      <section class="section doctors" id="doctors">
        <div class="container">
          <div class="section-head">
            <span class="eyebrow">ექიმები</span>
            <h2>სპეციალისტების პირველი გუნდი</h2>
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
            ${services.slice(0, 6).map(([title, , price]) => `<div><span>${title}</span><b>${price}</b></div>`).join("")}
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
            <label>სახელი და გვარი<input name="name" required autocomplete="name"></label>
            <label>ტელეფონი<input name="phone" required autocomplete="tel"></label>
            <label>სერვისი<select name="service" required>${services.map(([title]) => `<option>${title}</option>`).join("")}</select></label>
            <label>ექიმი<select name="doctor"><option value="">ნებისმიერი ხელმისაწვდომი ექიმი</option>${doctors.map(([name]) => `<option>${name}</option>`).join("")}</select></label>
            <label>სასურველი თარიღი<input name="date" type="date" required></label>
            <label>სასურველი დრო<input name="time" type="time" required></label>
            <label class="wide">კომენტარი<textarea name="comment" maxlength="500" placeholder="არ მიუთითოთ დიაგნოზი ან მგრძნობიარე სამედიცინო ინფორმაცია"></textarea></label>
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

  document.querySelector("#appointmentForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const status = document.querySelector("#formStatus");
    status.textContent = "მოთხოვნა მიღებულია. ოპერატორი დაგიკავშირდებათ ვიზიტის დასადასტურებლად.";
    form.reset();
  });
}

render();
