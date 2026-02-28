// Simple particles
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];

for (let i = 0; i < 100; i++) {
    particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 2 + 1,
    dx: (Math.random() - 0.5) * 0.4,
    dy: (Math.random() - 0.5) * 0.4,
    opacity: Math.random() * 0.6 + 0.2
});
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
        
        p.x += p.dx;
        p.y += p.dy;

        if (p.x > canvas.width) p.x = 0;    
        if (p.y > canvas.height) p.y = 0;
        if (p.x < 0) p.x = canvas.width;
        if (p.y < 0) p.y = canvas.height;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,80,60,${p.opacity})`;
        ctx.fill();

        p.opacity -= 0.001;
        if (p.opacity <= 0) {
            p.x = Math.random() * canvas.width;
            p.y = Math.random() * canvas.height;
            p.radius = Math.random() * 2 + 1;
            p.dx = (Math.random() - 0.5) * 0.4;
            p.dy = (Math.random() - 0.5) * 0.4;
            p.opacity = Math.random() * 0.6 + 0.2;
        }

        // Mouse repel
        if (mouse.x !== null && mouse.y !== null) {
            let dx = p.x - mouse.x;
            let dy = p.y - mouse.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            let repelRadius = 120; // how far mouse affects particles

            if (distance < repelRadius) {
                let force = (repelRadius - distance) / repelRadius;
                p.x += (dx / distance) * force * 1;
                p.y += (dy / distance) * force * 1;
            }
        }
    });

    requestAnimationFrame(animate);
}

let mouse = {
    x: null,
    y: null
};

window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

animate();

// Load content from JSON
function insertParagraphs(sectionId, paragraphs) {
    const section = document.getElementById(sectionId);
    if (!section) return;

    paragraphs.forEach(text => {
        const p = document.createElement("p");
        p.innerHTML = text;
        p.classList.add("fade-in");
        section.appendChild(p);

        observer.observe(p);
    });
}

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target); // animate once only
        }
    });
}, {
    threshold: 0.25
});

document.querySelectorAll(".fade-title").forEach(title => {
    observer.observe(title);
});

function formatExponents(text) {
    return text.replace(/\[(\d+)\]/g,
        "<sup class='exponent'>$1</sup>");
}

fetch("content.json")
    .then(res => res.json())
    .then(data => {
        insertParagraphs("home-text", data.home.text);
        insertParagraphs("meiji-text", data.meiji.text);
        insertParagraphs("satsuma-text", data.satsuma.text);
        insertParagraphs("shiroyama-text", data.shiroyama.text);
        insertParagraphs("saigo-text", data.saigo.text);
        insertParagraphs("urmari-si-impact-text", data.urmari_si_impact.text);
    })
    .catch(err => console.error("JSON loading error:", err));

// Scroll progress bar
const progressLine = document.getElementById("progress-line");

window.addEventListener("scroll", () => {
    const doc = document.documentElement;

    const maxScroll = doc.scrollHeight - doc.clientHeight;
    const percent = window.scrollY / maxScroll;

    progressLine.style.height = `${percent * 100}%`;
});

// Section detection
const sections = document.querySelectorAll("section");
const sidebarLinks = document.querySelectorAll(".sidebar a");

window.addEventListener("scroll", () => {

    let current = "";

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;

        if (window.scrollY >= sectionTop) {
            current = section.getAttribute("id");
        }
    });

    sidebarLinks.forEach(link => {
        link.classList.remove("active");

        if (link.getAttribute("href").includes(current)) {
            link.classList.add("active");
        }
    });

});

// Dynamic shadow on sidebar
window.addEventListener("scroll", () => {
    const sidebar = document.querySelector(".sidebar");

    const intensity = Math.min(window.scrollY / 800, 1);

    sidebar.style.boxShadow =
        `8px 0 40px rgba(0,0,0,${0.25 + intensity * 0.25})`;
});

// Smooth scroll for sidebar links
document.querySelectorAll(".sidebar a").forEach(anchor => {
    anchor.addEventListener("click", function(e) {
        e.preventDefault();

        const target = document.querySelector(this.getAttribute("href"));

        if (!target) return;

        const offset = 120;

        window.scrollTo({
            top: target.offsetTop - offset,
            behavior: "smooth"
        });
    });
});

//Imagine fullscreen
document.querySelectorAll(".content-image").forEach(img => {
    img.addEventListener("click", () => {

        if (!document.fullscreenElement) {
            img.requestFullscreen();
        } else {
            document.exitFullscreen();
        }

    });
});