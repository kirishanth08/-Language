document.addEventListener('DOMContentLoaded', () => {
    // 1. Theme Toggle (Fallback if not already handled by inline script)
    const themeToggleBtn = document.getElementById('theme-toggle');
    const html = document.documentElement;
    
    if (themeToggleBtn && !themeToggleBtn.dataset.themeBound) {
        themeToggleBtn.dataset.themeBound = 'true';
        themeToggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (html.classList.contains('dark')) {
                html.classList.remove('dark');
                html.classList.add('light');
                localStorage.setItem('theme', 'light');
            } else {
                html.classList.remove('light');
                html.classList.add('dark');
                localStorage.setItem('theme', 'dark');
            }
        });
    }

    // 2. RTL/LTR Toggle (Fallback if not already handled by inline script)
    const dirToggleBtn = document.getElementById('dir-toggle');
    
    function updateDirUI() {
        const currentDir = html.getAttribute('dir');
        if (dirToggleBtn) {
            dirToggleBtn.textContent = currentDir === 'rtl' ? 'RTL' : 'LTR';
        }
    }
    
    if (dirToggleBtn && !dirToggleBtn.dataset.dirBound) {
        dirToggleBtn.dataset.dirBound = 'true';
        updateDirUI();
        dirToggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const currentDir = html.getAttribute('dir');
            if (currentDir === 'ltr') {
                html.setAttribute('dir', 'rtl');
                localStorage.setItem('dir', 'rtl');
            } else {
                html.setAttribute('dir', 'ltr');
                localStorage.setItem('dir', 'ltr');
            }
            updateDirUI();
        });
    }

    // 3. Navbar Sticky Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('shadow-lg');
            navbar.querySelector('.absolute').classList.replace('bg-white/70', 'bg-white/90');
            navbar.querySelector('.absolute').classList.replace('dark:bg-slate-900/70', 'dark:bg-slate-900/95');
        } else {
            navbar.classList.remove('shadow-lg');
            navbar.querySelector('.absolute').classList.replace('bg-white/90', 'bg-white/70');
            navbar.querySelector('.absolute').classList.replace('dark:bg-slate-900/95', 'dark:bg-slate-900/70');
        }
    });

    // 4. Scroll Animations (Intersection Observer)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const animateObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('opacity-100', 'translate-y-0');
                entry.target.classList.remove('opacity-0', 'translate-y-10');
                
                // Count up animation for stats
                if (entry.target.classList.contains('stat-counter')) {
                    startCountUp(entry.target);
                    entry.target.classList.remove('stat-counter'); // Run once
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        el.classList.add('opacity-0', 'translate-y-10', 'transition-all', 'duration-700', 'ease-out');
        animateObserver.observe(el);
    });

    function startCountUp(el) {
        const target = parseInt(el.getAttribute('data-target'));
        const duration = 2000; // ms
        const frameRate = 1000 / 60;
        const totalFrames = Math.round(duration / frameRate);
        let currentFrame = 0;
        
        const counter = setInterval(() => {
            currentFrame++;
            const progress = currentFrame / totalFrames;
            const currentCount = Math.round(target * easeOutExpo(progress));
            el.textContent = currentCount + (el.getAttribute('data-suffix') || '');
            
            if (currentFrame === totalFrames) {
                clearInterval(counter);
                el.textContent = target + (el.getAttribute('data-suffix') || '');
            }
        }, frameRate);
    }
    
    function easeOutExpo(x) {
        return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
    }

    // 5. Canvas Particles Background (Hero)
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let w, h;
        
        function resize() {
            w = canvas.width = window.innerWidth;
            h = canvas.height = canvas.parentElement.offsetHeight;
        }
        window.addEventListener('resize', resize);
        resize();
        
        class Particle {
            constructor() {
                this.x = Math.random() * w;
                this.y = Math.random() * h;
                this.size = Math.random() * 3 + 1;
                this.speedX = Math.random() * 1 - 0.5;
                this.speedY = Math.random() * 1 - 0.5;
                this.color = `rgba(${Math.floor(Math.random()*100+100)}, ${Math.floor(Math.random()*100+100)}, 255, ${Math.random()*0.5+0.1})`;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x > w || this.x < 0) this.speedX *= -1;
                if (this.y > h || this.y < 0) this.speedY *= -1;
            }
            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        function initParticles() {
            particles = [];
            let particleCount = Math.floor(w / 10);
            for(let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }
        
        function animateParticles() {
            ctx.clearRect(0, 0, w, h);
            particles.forEach((p, index) => {
                p.update();
                p.draw();
                // Connect particles
                for(let j = index; j < particles.length; j++) {
                    const dx = p.x - particles[j].x;
                    const dy = p.y - particles[j].y;
                    const distance = Math.sqrt(dx*dx + dy*dy);
                    if(distance < 120) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(200, 200, 255, ${0.15 - distance/120})`;
                        ctx.lineWidth = 1;
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            });
            requestAnimationFrame(animateParticles);
        }
        
        initParticles();
        animateParticles();
    }

    // 6. Mobile Menu
    const mobileBtn = document.getElementById('mobile-menu-btn');
    if (mobileBtn) {
        // Setup mobile menu logic
        // We'll dynamically create it or toggle a hidden class
        let mobileMenu = document.getElementById('mobile-menu');
        mobileBtn.addEventListener('click', () => {
            if(mobileMenu) {
                mobileMenu.classList.toggle('hidden');
            }
        });
    }

});
