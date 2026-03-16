// --- CUSTOM CURSOR LOGIC ---
        const dot = document.getElementById('cursor-dot');
        const ring = document.getElementById('cursor-ring');
        
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let ringX = mouseX;
        let ringY = mouseY;

        // Update dot position instantly
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            dot.style.transform = `translate3d(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%), 0)`;
        });

        // Smooth trailing loop for ring
        function animate() {
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;
            ring.style.transform = `translate3d(calc(${ringX}px - 50%), calc(${ringY}px - 50%), 0)`;
            requestAnimationFrame(animate);
        }
        animate();

        // Enlarge cursor based on element size
        const hoverLg = document.querySelectorAll('.hero-title, .statement-text, .quote-centered h2, .large-hover-desc, .code-snippet, .about-title, .exp-item, .project-item');
        hoverLg.forEach(target => {
            target.addEventListener('mouseenter', () => ring.classList.add('hovered-lg'));
            target.addEventListener('mouseleave', () => ring.classList.remove('hovered-lg'));
        });

        const hoverSm = document.querySelectorAll('a:not(.project-item), button, .menu-icon, .close-btn, .tech-chip');
        hoverSm.forEach(target => {
            target.addEventListener('mouseenter', () => ring.classList.add('hovered-sm'));
            target.addEventListener('mouseleave', () => ring.classList.remove('hovered-sm'));
        });

        // --- MENU TOGGLE LOGIC ---
        const menuOverlay = document.getElementById('menuOverlay');

        function toggleMenu() {
            menuOverlay.classList.toggle('active');
        }

        // --- SNOWFALL EFFECT ---
        const canvas = document.getElementById('snowfall');
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];

        function resizeCanvas() {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 1.5 + 0.5;
                this.speedY = Math.random() * 0.5 + 0.1;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random() * 0.5 + 0.1;
            }
            update() {
                this.y += this.speedY;
                this.x += this.speedX;
                if (this.y > height) {
                    this.y = 0;
                    this.x = Math.random() * width;
                }
                if (this.x > width) this.x = 0;
                if (this.x < 0) this.x = width;
            }
            draw() {
                ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initSnowfall() {
            particles = [];
            let numParticles = window.innerWidth < 768 ? 50 : 150;
            for (let i = 0; i < numParticles; i++) {
                particles.push(new Particle());
            }
        }
        initSnowfall();

        function animateSnowfall() {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animateSnowfall);
        }
        animateSnowfall();

        // --- SCROLL REVEAL LOGIC ---
        // Dynamically add reveal class to specified sections
        const revealElements = document.querySelectorAll('.statement-section, .about-section, .quote-centered, .stack-row, .exp-item, .project-item');
        revealElements.forEach(el => el.classList.add('reveal'));

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                } else {
                    entry.target.classList.remove('active');
                }
            });
        }, { threshold: 0.1, rootMargin: "0px 0px -20px 0px" });

        document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

        // --- PROJECT HOVER IMAGE PREVIEW ---
        const projectItems = document.querySelectorAll('.project-item');
        const projectPreview = document.getElementById('projectPreview');

        projectItems.forEach(item => {
            const imageUrl = item.getAttribute('data-image');
            if (imageUrl) {
                // Dynamically inject mobile image header into project items
                const mobileImg = document.createElement('div');
                mobileImg.classList.add('mobile-project-img');
                mobileImg.style.backgroundImage = `url(${imageUrl})`;
                item.insertBefore(mobileImg, item.firstChild);
                
                // Desktop hover functionality
                item.addEventListener('mouseenter', () => {
                    projectPreview.style.backgroundImage = `url(${imageUrl})`;
                    projectPreview.classList.add('show');
                });
                
                item.addEventListener('mouseleave', () => {
                    projectPreview.classList.remove('show');
                });
            }
        });