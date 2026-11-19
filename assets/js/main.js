/* ==========================================================================
   سكربت موقع إحسان أكاديمي — تفاعلات خفيفة بدون أي مكتبات خارجية
   ========================================================================== */

(function () {
  "use strict";

  /* ---------- أدوات مساعدة ---------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const esc = (str) =>
    String(str).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));

  const UI_ICONS = {
    models: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="8" rx="2"/><rect x="3" y="13" width="8" height="8" rx="2"/><rect x="13" y="13" width="8" height="8" rx="2"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M10 8.5l6 3.5-6 3.5z" fill="currentColor" stroke="none"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>',
    calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18"/><path d="M8 3v4M16 3v4"/></svg>',
    globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a13 13 0 0 1 3.5 9 13 13 0 0 1-3.5 9 13 13 0 0 1-3.5-9A13 13 0 0 1 12 3z"/></svg>',
    tag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M20.6 13.4L13.4 20.6a2 2 0 0 1-2.8 0l-8-8V3h9.6l8.4 8.4a2 2 0 0 1 0 2z"/><circle cx="7.5" cy="7.5" r="1.2"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
    empty: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/><path d="M8 11h6"/></svg>',
  };

  /* ما يضمّه كل موديل افتراضيًا */
  const DEFAULT_INCLUDES = [
    "شرح مفصّل للموضوع من البداية إلى النهاية",
    "حل الأسئلة أثناء الشرح مع تبرير كل إجابة",
    "مناقشة الأخطاء الشائعة والبدائل الخاطئة",
  ];

  const priceLabel = (course) => {
    if (course.price === 0) return "مجانًا";
    if (course.price === null || course.price === undefined) return "السعر عند الطلب";
    return `${course.price.toLocaleString("en-US")} دج`;
  };

  const yearLabel = (year) =>
    (window.YEARS && window.YEARS[year]) || `السنة ${year}`;

  const subjectLabel = (key) =>
    (window.SUBJECTS && window.SUBJECTS[key]) || key;

  /* ---------- 1. قائمة التنقّل للجوال ---------- */
  function initNav() {
    const toggle = $(".nav-toggle");
    const nav = $("#site-nav");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("is-open", !open);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  /* ---------- 2. ظهور العناصر عند التمرير ---------- */
  function initReveal() {
    const items = $$("[data-reveal]");
    if (!items.length) return;

    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const delay = Number(el.dataset.revealDelay || 0);
            setTimeout(() => el.classList.add("is-visible"), delay);
            io.unobserve(el);
          }
        });
      },
      { rootMargin: "0px 0px -60px 0px", threshold: 0.08 }
    );

    items.forEach((el) => io.observe(el));
  }

  /* ---------- 3. بطاقة الدورة ---------- */
  function courseCard(course) {
    const icon = (window.ICONS && window.ICONS[course.icon]) || "";
    const badge = course.badge
      ? `<span class="badge badge--${course.badgeType || "primary"}">${esc(course.badge)}</span>`
      : "";

    return `
      <article class="course-card">
        <div class="course-card__top">
          <div class="course-card__icon" aria-hidden="true">${icon}</div>
          ${badge}
        </div>
        <div class="course-card__body">
          <div class="course-card__cat">${esc(yearLabel(course.year))} · ${esc(subjectLabel(course.subject))}</div>
          <h3><a href="course.html?id=${encodeURIComponent(course.id)}">${esc(course.title)}</a></h3>
          <p class="course-card__desc">${esc(course.summary)}</p>
        </div>
        <div class="course-card__meta">
          <span>${UI_ICONS.play}موديل مشروح</span>
          <span>${UI_ICONS.globe}${esc(course.language)}</span>
          <span>${UI_ICONS.check}الأسئلة محلولة داخله</span>
        </div>
        <div class="course-card__foot">
          <div class="course-card__price">${esc(priceLabel(course))}<small>${esc(course.priceNote || "")}</small></div>
          <a class="link-arrow" href="course.html?id=${encodeURIComponent(course.id)}">
            التفاصيل ${UI_ICONS.arrow}
          </a>
        </div>
      </article>`;
  }

  /* ---------- 4. صفحة الدورات: فلاتر وبحث ---------- */
  function initCourseGrid() {
    const grid = $("#course-grid");
    if (!grid || !window.COURSES) return;

    const searchInput = $("#course-search");
    const chipsWrap = $("#course-chips");
    const subjectSelect = $("#course-subject");
    const sortSelect = $("#course-sort");
    const countEl = $("#course-count");

    let state = { q: "", year: "all", subject: "all", sort: "default" };

    // أزرار السنوات: 1..4 ثم الدورات العامة (0) في الآخر
    if (chipsWrap) {
      const present = Object.keys(window.YEARS).filter((y) =>
        window.COURSES.some((c) => String(c.year) === y)
      );
      const ordered = present.filter((y) => y !== "0").concat(present.filter((y) => y === "0"));

      const chips = [{ key: "all", label: "الكل" }].concat(
        ordered.map((y) => ({ key: String(y), label: window.YEARS[y] }))
      );

      chipsWrap.innerHTML = chips
        .map(
          (c) =>
            `<button type="button" class="chip" data-year="${c.key}" aria-pressed="${c.key === "all"}">${esc(c.label)}</button>`
        )
        .join("");

      chipsWrap.addEventListener("click", (e) => {
        const btn = e.target.closest(".chip");
        if (!btn) return;
        state.year = btn.dataset.year;
        $$(".chip", chipsWrap).forEach((b) =>
          b.setAttribute("aria-pressed", String(b === btn))
        );
        render();
      });
    }

    // تصفية مبدئية من الرابط: courses.html?year=2 أو ?subject=radiologie
    const params = new URLSearchParams(window.location.search);
    const initialYear = params.get("year");
    const initialSubject = params.get("subject");

    if (initialYear && chipsWrap && window.YEARS[initialYear] !== undefined) {
      state.year = initialYear;
      $$(".chip", chipsWrap).forEach((b) =>
        b.setAttribute("aria-pressed", String(b.dataset.year === initialYear))
      );
    }

    if (initialSubject && subjectSelect) {
      state.subject = initialSubject;
      subjectSelect.value = initialSubject;
    }

    if (searchInput) {
      searchInput.addEventListener("input", () => {
        state.q = searchInput.value.trim().toLowerCase();
        render();
      });
    }

    if (subjectSelect) {
      subjectSelect.addEventListener("change", () => {
        state.subject = subjectSelect.value;
        render();
      });
    }

    if (sortSelect) {
      sortSelect.addEventListener("change", () => {
        state.sort = sortSelect.value;
        render();
      });
    }

    const isTop = (c) => c.featured && c.badge === "الأكثر طلبًا";

    function apply() {
      let list = window.COURSES.slice();

      // في العرض الافتراضي لا نكرّر «الأكثر طلبًا» (لها قسم مستقل أعلى الصفحة)
      const isDefaultView =
        state.year === "all" && state.subject === "all" && state.q === "";
      if (isDefaultView) list = list.filter((c) => !isTop(c));

      if (state.year !== "all") list = list.filter((c) => String(c.year) === state.year);
      if (state.subject !== "all") list = list.filter((c) => c.subject === state.subject);

      if (state.q) {
        list = list.filter((c) => {
          const haystack = [
            c.title,
            c.summary,
            yearLabel(c.year),
            subjectLabel(c.subject),
            c.language,
            (c.topics || []).join(" "),
          ]
            .join(" ")
            .toLowerCase();
          return haystack.includes(state.q);
        });
      }

      if (state.sort === "free-first") {
        list.sort((a, b) => (a.price === 0 ? -1 : 0) - (b.price === 0 ? -1 : 0));
      }
      if (state.sort === "year") {
        list.sort((a, b) => a.year - b.year);
      }

      return list;
    }

    function render() {
      const list = apply();

      if (countEl) {
        countEl.textContent = list.length
          ? `عرض ${list.length} ${list.length === 1 ? "دورة" : "دورات"}`
          : "لا توجد نتائج";
      }

      if (!list.length) {
        grid.innerHTML = `
          <div class="empty-state" style="grid-column:1/-1">
            ${UI_ICONS.empty}
            <h3>لم نجد دورة مطابقة</h3>
            <p>جرّب كلمة بحث أخرى أو أعد ضبط السنة والمادة.</p>
            <button type="button" class="btn btn--ghost btn--sm" id="reset-filters">إعادة الضبط</button>
          </div>`;
        const resetBtn = $("#reset-filters");
        if (resetBtn) resetBtn.addEventListener("click", reset);
        return;
      }

      grid.innerHTML = list.map(courseCard).join("");
    }

    function reset() {
      state = { q: "", year: "all", subject: "all", sort: "default" };
      if (searchInput) searchInput.value = "";
      if (subjectSelect) subjectSelect.value = "all";
      if (sortSelect) sortSelect.value = "default";
      $$(".chip", chipsWrap).forEach((b) =>
        b.setAttribute("aria-pressed", String(b.dataset.year === "all"))
      );
      render();
    }

    render();
  }

  /* ---------- 4.b الأكثر طلبًا (صفحة الدورات) ---------- */
  function initTopCourses() {
    const grid = $("#top-grid");
    if (!grid || !window.COURSES) return;
    grid.innerHTML = window.COURSES.filter((c) => c.featured && c.badge === "الأكثر طلبًا")
      .map(courseCard)
      .join("");
  }

  /* ---------- 5. الدورات المختارة في الرئيسية ---------- */
  function initFeaturedCourses() {
    const grid = $("#featured-grid");
    if (!grid || !window.COURSES) return;
    grid.innerHTML = window.COURSES.filter((c) => c.featured)
      .map(courseCard)
      .join("");
  }

  /* ---------- 5.b إحصاءات الرئيسية (محسوبة من البيانات) ---------- */
  function initStats() {
    const root = $("#stats");
    if (!root || !window.COURSES) return;

    const years = new Set(window.COURSES.filter((c) => c.year > 0).map((c) => c.year));
    const subjects = new Set(window.COURSES.map((c) => c.subject));

    const values = {
      groups: window.COURSES.length,
      subjects: subjects.size,
      free: window.COURSES.filter((c) => c.price === 0).length,
      years: years.size,
    };

    Object.keys(values).forEach((key) => {
      const el = $("[data-stat=" + key + "]", root);
      if (el) el.textContent = values[key];
    });
  }

  /* ---------- 6. أكورديون ---------- */
  function initAccordion(root = document) {
    $$(".acc-btn", root).forEach((btn) => {
      btn.addEventListener("click", () => {
        const item = btn.closest(".acc-item");
        const open = item.classList.contains("is-open");

        $$(".acc-item", item.parentElement).forEach((other) => {
          if (other !== item) {
            other.classList.remove("is-open");
            const b = $(".acc-btn", other);
            if (b) b.setAttribute("aria-expanded", "false");
          }
        });

        item.classList.toggle("is-open", !open);
        btn.setAttribute("aria-expanded", String(!open));
      });
    });
  }

  /* ---------- 7. صفحة تفاصيل الدورة ---------- */
  function initCourseDetail() {
    const root = $("#course-main");
    if (!root || !window.COURSES) return;

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const course = window.COURSES.find((c) => c.id === id) || window.COURSES[0];

    document.title = `${course.title} | إحسان أكاديمي`;

    const hero = $("#course-hero");
    if (hero) {
      hero.innerHTML = `
        <ol class="breadcrumb">
          <li><a href="index.html">الرئيسية</a></li>
          <li><a href="courses.html">الدورات</a></li>
          <li aria-current="page">${esc(course.title)}</li>
        </ol>
        <div class="eyebrow">${esc(yearLabel(course.year))} · ${esc(subjectLabel(course.subject))}</div>
        <h1>${esc(course.title)}</h1>
        <p>${esc(course.summary)}</p>
        <div class="course-card__meta" style="padding:20px 0 0">
          <span>${UI_ICONS.play}موديل مشروح</span>
          <span>${UI_ICONS.globe}${esc(course.language)}</span>
          <span>${UI_ICONS.check}الأسئلة محلولة أثناء الشرح</span>
          <span>${UI_ICONS.tag}${esc(priceLabel(course))}</span>
        </div>`;
    }

    const includes = course.includes || DEFAULT_INCLUDES;

    const main = $("#course-main");
    if (main) {
      const facts = [
        ["السنة الدراسية", yearLabel(course.year)],
        ["المادة", subjectLabel(course.subject)],
        ["اللغة", course.language],
        ["السعر", priceLabel(course)],
      ];

      main.innerHTML = `
        <div class="course-facts">
          ${facts
            .map(
              ([label, value]) =>
                `<div class="fact"><span>${esc(label)}</span><strong>${esc(value)}</strong></div>`
            )
            .join("")}
        </div>

        <section>
          <h2>عن الموديل</h2>
          <p>${esc(course.intro)}</p>
        </section>

        <section>
          <h2>ماذا يضم الموديل؟</h2>
          <ul class="check-list">
            ${includes
              .map((i) => `<li>${UI_ICONS.check}<span>${esc(i)}</span></li>`)
              .join("")}
          </ul>
        </section>

        <section>
          <h2>ماذا ستستفيد؟</h2>
          <ul class="check-list">
            ${course.outcomes
              .map((o) => `<li>${UI_ICONS.check}<span>${esc(o)}</span></li>`)
              .join("")}
          </ul>
        </section>

        <section>
          <h2>محاور الموديل</h2>
          <ul class="topic-list">
            ${course.topics.map((t) => `<li>${esc(t)}</li>`).join("")}
          </ul>
        </section>

        <section>
          <h2>ما تحتاجه قبل البدء</h2>
          <ul>${course.requirements.map((r) => `<li>${esc(r)}</li>`).join("")}</ul>
        </section>`;
    }

    const aside = $("#course-aside");
    if (aside) {
      aside.innerHTML = `
        <div class="aside-card">
          <h3>تفاصيل سريعة</h3>
          <ul class="aside-list">
            <li><span>${UI_ICONS.play} الصيغة</span><strong>موديل مشروح</strong></li>
            <li><span>${UI_ICONS.globe} اللغة</span><strong>${esc(course.language)}</strong></li>
            <li><span>${UI_ICONS.calendar} الوصول</span><strong>فوري بعد التفعيل</strong></li>
            <li><span>${UI_ICONS.check} الأسئلة</span><strong>تُحلّ أثناء الشرح</strong></li>
          </ul>
          <div style="display:flex;align-items:baseline;gap:8px;margin-bottom:16px">
            <strong style="font-size:26px;color:var(--ink)">${esc(priceLabel(course))}</strong>
            <span style="font-size:13px;color:var(--muted)">${esc(course.priceNote || "")}</span>
          </div>
          <a class="btn btn--block" href="contact.html">اطلب تفاصيل الاشتراك</a>
          <p class="field__hint" style="text-align:center;margin-top:12px">
            هذا موقع تعريفي — الاشتراك يتم عبر إنستغرام أو البريد الإلكتروني.
          </p>
        </div>
        <div class="aside-card">
          <h3>قبل أن تشترك</h3>
          <p style="font-size:14.5px;color:var(--muted);margin-bottom:14px">
            تأكد أن هذه الدورة تناسب سنتك وطريقة شرحك المعتادة. راجع
            <a href="guide.html">إرشادات الدراسة</a> أولًا.
          </p>
          <a class="btn btn--ghost btn--block" href="https://www.instagram.com/i7ssen_academy/" target="_blank" rel="noopener">فتح صفحة إنستغرام</a>
        </div>`;
    }

    const related = $("#related-grid");
    if (related) {
      const sameYear = window.COURSES.filter(
        (c) => c.id !== course.id && c.year === course.year
      );
      const fallback = window.COURSES.filter((c) => c.id !== course.id);
      const list = (sameYear.length >= 2 ? sameYear : fallback).slice(0, 3);
      related.innerHTML = list.map(courseCard).join("");
    }
  }

  /* ---------- التشغيل ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    initNav();
    initReveal();
    initStats();
    initTopCourses();
    initFeaturedCourses();
    initCourseGrid();
    initCourseDetail();
    initAccordion();
  });
})();
