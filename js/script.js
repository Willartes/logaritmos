document.addEventListener('DOMContentLoaded', () => {
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;
    const currentDisplay = document.getElementById('current-slide-display');
    const slideNumberBtn = document.getElementById('slideNumber');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    let slide7Timeouts = [];

    function showSlide(index) {
        // Limpa animações anteriores do slide 7
        slide7Timeouts.forEach(t => clearTimeout(t));
        slide7Timeouts = [];
        resetSlide7();

        // Troca de slide
        slides.forEach(s => {
            s.classList.remove('active', 'visible');
        });

        slides[index].classList.add('active');
        // Pequeno delay para o efeito de fade
        setTimeout(() => {
            slides[index].classList.add('visible');
        }, 50);

        currentSlide = index;
        
        // Atualiza contadores
        if(currentDisplay) currentDisplay.textContent = currentSlide + 1;
        if(slideNumberBtn) slideNumberBtn.textContent = currentSlide + 1;

        // Dispara animação se for o slide 7
        if (currentSlide === 6) { 
            animateSlide7();
        }
    }

    function nextSlide() {
        if (currentSlide < totalSlides - 1) showSlide(currentSlide + 1);
    }

    function prevSlide() {
        if (currentSlide > 0) showSlide(currentSlide - 0);
    }

    // Navegação Eventos
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', () => {
        if (currentSlide > 0) showSlide(currentSlide - 1);
    });

    // Teclado
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === ' ') nextSlide();
        if (e.key === 'ArrowLeft') showSlide(Math.max(0, currentSlide - 1));
    });

    // Lógica Específica Slide 7
    function resetSlide7() {
        const els = document.querySelectorAll('#presentation-container .fade-in, #presentation-container td, #presentation-container th');
        els.forEach(el => {
            el.classList.remove('show', 'highlight-blue', 'highlight-green', 'highlight-yellow');
        });
    }

    function animateSlide7() {
        const d = 1000; // delay base
        const add = (id, cls) => {
            const el = document.getElementById(id);
            if(el) el.classList.add(cls);
        };

        slide7Timeouts.push(setTimeout(() => add('multiplication-section', 'show'), d));
        slide7Timeouts.push(setTimeout(() => {
            add('mult-expression', 'show');
            add('pow-5', 'highlight-blue');
            add('pow-9', 'highlight-blue');
        }, d * 2.5));

        slide7Timeouts.push(setTimeout(() => {
            add('mult-log-step', 'show');
            add('exp-5', 'highlight-yellow');
            add('exp-9', 'highlight-yellow');
        }, d * 4.5));

        slide7Timeouts.push(setTimeout(() => {
            add('mult-result', 'show');
            add('pow-14', 'highlight-green');
        }, d * 6.5));

        slide7Timeouts.push(setTimeout(() => {
            add('division-section', 'show');
        }, d * 8.5));
    }

    // Inicializa
    showSlide(0);
});