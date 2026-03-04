// js/script.js
(function () {
    "use strict";

    // --- Slides: 26 páginas HTML locais ---
    const TOTAL = 26;
    const slides = Array.from({ length: TOTAL }, (_, i) => ({
        src:   `slides/page_${i + 1}.html`,
        label: `Slide ${i + 1}`
    }));

    // --- Elementos DOM ---
    const frame        = document.getElementById("slide-frame");
    const captionEl    = document.getElementById("slide-caption");
    const currentEl    = document.getElementById("current-slide");
    const totalEl      = document.getElementById("total-slides");
    const prevBtn      = document.getElementById("prev-slide");
    const nextBtn      = document.getElementById("next-slide");
    const thumbPanel   = document.getElementById("thumbnails-panel");
    const thumbList    = document.getElementById("thumbnails-list");
    const slideWrapper = document.querySelector(".slide-wrapper");
    const headerBtns   = document.querySelectorAll(".control-btn");

    // --- Estado ---
    let currentIndex  = 0;
    let autoTimer     = null;
    const AUTO_MS     = 5000;

    // --- Init ---
    totalEl.textContent = String(TOTAL);
    renderSlide(0);
    buildThumbnails();
    scaleFrame();
    window.addEventListener("resize", scaleFrame);

    // -------------------------------------------------------
    // SCALE: ajusta o iframe 1280×720 ao tamanho do wrapper
    // -------------------------------------------------------
    function scaleFrame() {
        const w = slideWrapper.clientWidth;
        const h = slideWrapper.clientHeight;
        const scale = Math.min(w / 1280, h / 720);
        frame.style.transform = `scale(${scale})`;

        // centraliza horizontal e verticalmente
        const scaledW = 1280 * scale;
        const scaledH = 720  * scale;
        frame.style.left = `${(w - scaledW) / 2}px`;
        frame.style.top  = `${(h - scaledH) / 2}px`;
    }

    // -------------------------------------------------------
    // RENDER
    // -------------------------------------------------------
    function renderSlide(index) {
        const slide = slides[index];
        frame.src = slide.src;
        frame.title = slide.label;
        currentEl.textContent = String(index + 1);
        captionEl.textContent = `${index + 1} / ${TOTAL} — ${slide.label}`;
        updateActiveThumbnail(index);
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % TOTAL;
        renderSlide(currentIndex);
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + TOTAL) % TOTAL;
        renderSlide(currentIndex);
    }

    // -------------------------------------------------------
    // THUMBNAILS
    // -------------------------------------------------------
    function buildThumbnails() {
        thumbList.innerHTML = "";
        slides.forEach((slide, i) => {
            const li  = document.createElement("li");
            li.className = "thumbnails__item";

            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "thumbnail-btn";
            if (i === 0) btn.classList.add("active");
            btn.dataset.slide = String(i);
            btn.title = slide.label;

            const wrap = document.createElement("div");
            wrap.className = "thumb-wrap";

            const ifr = document.createElement("iframe");
            ifr.src = slide.src;
            ifr.scrolling = "no";
            ifr.tabIndex = -1;
            ifr.setAttribute("aria-hidden", "true");

            wrap.appendChild(ifr);
            btn.appendChild(wrap);
            li.appendChild(btn);
            thumbList.appendChild(li);
        });

        thumbList.addEventListener("click", (e) => {
            const btn = e.target.closest(".thumbnail-btn");
            if (!btn) return;
            const idx = parseInt(btn.dataset.slide, 10);
            if (!isNaN(idx)) {
                currentIndex = idx;
                renderSlide(currentIndex);
            }
        });
    }

    function updateActiveThumbnail(index) {
        thumbList.querySelectorAll(".thumbnail-btn").forEach((btn, i) => {
            btn.classList.toggle("active", i === index);
        });
    }

    // -------------------------------------------------------
    // FULLSCREEN
    // -------------------------------------------------------
    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen?.();
        } else {
            document.exitFullscreen?.();
        }
    }

    document.addEventListener("fullscreenchange", () => {
        setTimeout(scaleFrame, 100);
    });

    // -------------------------------------------------------
    // THUMBNAILS PANEL
    // -------------------------------------------------------
    function toggleThumbnails() {
        const hidden = thumbPanel.hasAttribute("hidden");
        if (hidden) {
            thumbPanel.removeAttribute("hidden");
        } else {
            thumbPanel.setAttribute("hidden", "");
        }
        setTimeout(scaleFrame, 50);
    }

    // -------------------------------------------------------
    // AUTO PLAY
    // -------------------------------------------------------
    function startAuto() {
        stopAuto();
        autoTimer = setInterval(nextSlide, AUTO_MS);
        document.querySelector('[data-action="auto"]').textContent = "⏹ Stop";
    }

    function stopAuto() {
        if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
        const btn = document.querySelector('[data-action="auto"]');
        if (btn) btn.textContent = "▶ Auto";
    }

    // -------------------------------------------------------
    // EVENTOS
    // -------------------------------------------------------
    prevBtn.addEventListener("click", prevSlide);
    nextBtn.addEventListener("click", nextSlide);

    headerBtns.forEach((btn) => {
        const action = btn.dataset.action;
        if (!action) return;
        btn.addEventListener("click", () => {
            switch (action) {
                case "fullscreen":  toggleFullscreen(); break;
                case "thumbnails":  toggleThumbnails(); break;
                case "auto":        autoTimer ? stopAuto() : startAuto(); break;
            }
        });
    });

    window.addEventListener("keydown", (e) => {
        switch (e.key) {
            case "ArrowLeft":  prevSlide(); break;
            case "ArrowRight": nextSlide(); break;
            case "f": case "F": toggleFullscreen(); break;
            case "t": case "T": toggleThumbnails(); break;
            case "a": case "A": autoTimer ? stopAuto() : startAuto(); break;
            case "Escape": stopAuto(); break;
        }
    });

})();
