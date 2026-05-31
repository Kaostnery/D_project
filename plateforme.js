/* =========================
   DONNÉES
   ========================= */

const ARCHIVES = {
    PRMCDE: { title: "Coucou, c'est nous les esprits !",  content: "Une équation simple comme bonjour" },
    RAY:    { title: "Journal de Ray",        content: "Je ne sais plus si les gens vont bien." },
    DAEMON: { title: "Rapport Daemon",        content: "L'humanité ne souffrirait plus si elle cessait de ressentir." }
};

const ECHOES = [
    "◈ Une présence semble vous observer.",
    "◈ Elle progresse.",
    "◈ Vous êtes plus nombreux aujourd'hui.",
    "◈ Quelqu'un a laissé une trace ici.",
    "◈ Le voile s'amincit."
];

const STORAGE_KEY = "spiritsV3";

/* =========================
   ÉTAT
   ========================= */

let unlocked = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

/* =========================
   UTILITAIRES
   ========================= */

const $ = id => document.getElementById(id);

function showMessage(text, duration = 5000) {
    const m = $("msg");
    m.innerText = text;
    m.style.display = "block";
    setTimeout(() => { m.style.display = "none"; }, duration);
}

/* =========================
   FRAGMENTS
   ========================= */

function caesar(str, shift) {
    return str
        .toUpperCase()
        .split("")
        .map(c => {
            if (c < "A" || c > "Z") return c;
            return String.fromCharCode((c.charCodeAt(0) - 65 + shift) % 26 + 65);
        })
        .join("")
        .toLowerCase();
}

/* =========================
   FRAGMENTS
   ========================= */

function render() {
    $("docs").innerHTML = unlocked
        .filter(code => ARCHIVES[code])
        .map(code => `
            <div class="doc">
                <h3><a href="${caesar(code, 3)}.html">${ARCHIVES[code].title}</a></h3>
                <p>${ARCHIVES[code].content}</p>
            </div>`)
        .join("");
}

/* =========================
   DÉVERROUILLAGE
   ========================= */

function unlock() {
    const code = $("code").value.trim().toUpperCase();
    const statusEl = $("status");

    if (!ARCHIVES[code]) {
        statusEl.innerText = "◈ Aucune résonance détectée.";
        return;
    }

    if (!unlocked.includes(code)) {
        unlocked.push(code);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(unlocked));
        showMessage("◈ Signature reconnue.\nLe réseau a réagi.");
    }

    statusEl.innerText = "◈ Résonance détectée.";
    render();
}

/* =========================
   PARTICULES
   ========================= */

const canvas = $("particles");
const ctx = canvas.getContext("2d");

function resize() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
}

const particles = Array.from({ length: 80 }, () => ({
    x: Math.random() * innerWidth,
    y: Math.random() * innerHeight,
    s: 1 + Math.random() * 3,
    v: 0.2 + Math.random()
}));

function anim() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(76,201,240,.35)";

    for (const p of particles) {
        p.y -= p.v;
        if (p.y < 0) p.y = innerHeight;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2);
        ctx.fill();
    }

    requestAnimationFrame(anim);
}

/* =========================
   FANTÔMES
   ========================= */

function spawnGhost() {
    const g = document.createElement("div");
    g.className = "ghost";
    g.style.left = `${Math.random() * innerWidth}px`;
    g.style.top  = `${innerHeight - 100}px`;
    $("ghosts").appendChild(g);
    setTimeout(() => g.remove(), 20000);
}

/* =========================
   INIT
   ========================= */

document.addEventListener("DOMContentLoaded", () => {
    resize();
    addEventListener("resize", resize);
    anim();

    $("code")?.addEventListener("keydown", e => {
        if (e.key === "Enter") unlock();
    });

    const title = document.querySelector(".title");
    if (title) {
        title.addEventListener("click", () => location.reload());
        title.style.cursor = "pointer";
    }

    setInterval(spawnGhost, 12000);
    setInterval(() => showMessage(ECHOES[Math.floor(Math.random() * ECHOES.length)]), 25000);
    setInterval(() => { $("souls").innerText = 40 + Math.floor(Math.random() * 60); }, 4000);

    render();
});
