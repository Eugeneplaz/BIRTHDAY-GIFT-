const herName = "Marry Grace P. Argawanon";

const PHOTO_SECONDS = 3;

const photoFiles = [
    "photo1.png",
    "photo2.png",
    "photo3.jpeg",
    "photo4.jpeg",
    "photo5.jpeg",
    "photo6.jpeg",
    "photo7.jpg",
    "photo8.jpg",
    "photo9.jpeg",
    "photo10.jpeg"
];

const slides = document.querySelectorAll(".slide");
const dotsBox = document.getElementById("dots");
const backBtn = document.getElementById("backBtn");
const nextBtn = document.getElementById("nextBtn");
const music = document.getElementById("music");
const musicBtn = document.getElementById("musicBtn");
const intro = document.getElementById("intro");
const envelope = document.getElementById("envelope");
const cake = document.getElementById("cake");
const wishText = document.getElementById("wishText");
const wishBtn = document.getElementById("wishBtn");

const photoView = document.getElementById("photoView");
const photoCount = document.getElementById("photoCount");
const gallery = document.getElementById("gallery");

const GALLERY_SLIDE = Array.prototype.findIndex.call(slides, function (slide) {
    return slide.querySelector("#gallery") !== null;
});

let current = 0;
let started = false;
let opened = false;
let musicStarted = false;
let typeToken = 0;
let photoList = [];
let photoIndex = 0;

document.querySelectorAll(".name").forEach(function (element) {
    element.textContent = herName;
});

slides.forEach(function () {
    dotsBox.appendChild(document.createElement("span"));
});

const dots = dotsBox.querySelectorAll("span");

document.querySelectorAll(".type").forEach(function (element) {
    element.dataset.full = element.textContent.replace(/\s+/g, " ").trim();
    element.textContent = "";

    const on = document.createElement("span");
    const off = document.createElement("span");

    on.className = "t-on";
    off.className = "t-off";

    element.appendChild(on);
    element.appendChild(off);
});

function setTyped(element, index) {
    const full = element.dataset.full;

    element.firstChild.textContent = full.slice(0, index);
    element.lastChild.textContent = full.slice(index);
}

function typeSlide(slide) {
    const token = ++typeToken;
    const elements = Array.from(slide.querySelectorAll(".type"));

    elements.forEach(function (element) {
        setTyped(element, 0);
    });

    let index = 0;

    function nextElement() {
        if (token !== typeToken || index >= elements.length) {
            return;
        }

        const element = elements[index++];
        const full = element.dataset.full;
        let i = 0;

        function tick() {
            if (token !== typeToken) {
                return;
            }

            i++;
            setTyped(element, i);

            if (i < full.length) {
                setTimeout(tick, 26);
            } else {
                setTimeout(nextElement, 250);
            }
        }

        tick();
    }

    setTimeout(nextElement, 500);
}

function openEnvelope() {
    if (opened) return;

    opened = true;

    envelope.classList.add("open");

    music.play().then(function () {
        musicBtn.textContent = "Music: On";
        musicStarted = true;
    }).catch(function () {
        musicBtn.textContent = "Music: Off";
    });

    const rect = envelope.getBoundingClientRect();

    setTimeout(function () {
        burst(
            rect.left + rect.width / 2,
            rect.top + rect.height / 2
        );
    }, 700);

    setTimeout(function () {
        intro.classList.add("gone");
    }, 2400);

    setTimeout(function () {
        intro.style.display = "none";
        document.body.classList.add("started");

        started = true;
        showSlide(0);
    }, 3200);
}

function resetCake() {
    cake.classList.remove("out");

    wishText.textContent = "Close your eyes and make a wish.";

    wishBtn.disabled = false;
    wishBtn.textContent = "Blow the Candles";
}

function blowCandles() {
    if (cake.classList.contains("out")) return;

    cake.classList.add("out");

    wishText.textContent = "Your wish is on its way. Never stop believing in it.";

    wishBtn.disabled = true;
    wishBtn.textContent = "Wish sent";

    const rect = cake.getBoundingClientRect();

    burst(
        rect.left + rect.width / 2,
        rect.top + 20
    );

    setTimeout(function () {
        burst(
            rect.left + rect.width / 2,
            rect.top + 20
        );
    }, 300);
}

function showSlide(number) {
    if (number < 0 || number >= slides.length) return;

    typeToken++;

    slides.forEach(function (slide) {
        slide.classList.remove("active");
    });

    dots.forEach(function (dot) {
        dot.classList.remove("on");
    });

    slides[number].classList.add("active");
    dots[number].classList.add("on");

    current = number;

    backBtn.style.visibility = number === 0 ? "hidden" : "visible";

    nextBtn.textContent =
        number === slides.length - 1 ? "Start Over" : "Next";

    resetCake();

    targetCount = number === slides.length - 1 ? 80 : 35;
    heartRate = number === slides.length - 1 ? 0.08 : 0.02;

    if (started) {
        typeSlide(slides[number]);
    }
}

function nextSlide() {
    if (!musicStarted && started) {
        music.play().then(function () {
            musicBtn.textContent = "Music: On";
            musicStarted = true;
        }).catch(function () {});
    }

    const rect = nextBtn.getBoundingClientRect();

    burst(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2
    );

    const next = current < slides.length - 1 ? current + 1 : 0;

    showSlide(next);
}

function prevSlide() {
    if (current > 0) {
        showSlide(current - 1);
    }
}

function toggleMusic() {
    if (music.paused) {
        music.play().then(function () {
            musicBtn.textContent = "Music: On";
            musicStarted = true;
        }).catch(function () {
            musicBtn.textContent = "Music: Off";
        });
    } else {
        music.pause();
        musicBtn.textContent = "Music: Off";
    }

    musicStarted = true;
}

function loadPhotos() {
    let loaded = 0;

    photoFiles.forEach(function (file) {
        const img = new Image();

        img.onload = function () {
            photoList.push(file);
            loaded++;
            finishLoading();
        };

        img.onerror = function () {
            loaded++;
            finishLoading();
        };

        img.src = file;
    });

    function finishLoading() {
        if (loaded === photoFiles.length) {
            photoList = photoFiles.filter(function (file) {
                return photoList.includes(file);
            });

            startGallery();
        }
    }
}

function showPhoto(index) {
    if (photoList.length === 0) return;

    photoView.style.opacity = 0;

    setTimeout(function () {
        photoView.src = photoList[index];

        photoView.style.transform =
            "rotate(" + (Math.random() * 6 - 3).toFixed(1) + "deg)";

        photoCount.textContent =
            (index + 1) + " / " + photoList.length;

        photoView.style.opacity = 1;
    }, 250);
}

function nextPhoto() {
    if (photoList.length <= 1) return;

    photoIndex = (photoIndex + 1) % photoList.length;

    showPhoto(photoIndex);
}

function startGallery() {
    if (photoList.length === 0) {
        gallery.style.display = "none";
        return;
    }

    photoIndex = 0;

    photoView.src = photoList[0];
    photoView.style.transform = "rotate(-2deg)";

    photoCount.textContent = "1 / " + photoList.length;

    if (photoList.length > 1) {
        photoView.addEventListener("click", nextPhoto);

        setInterval(function () {
            if (started && current === GALLERY_SLIDE) {
                nextPhoto();
            }
        }, PHOTO_SECONDS * 1000);
    }
}

loadPhotos();

const canvas = document.getElementById("petals");
const ctx = canvas.getContext("2d");

const petalColors = [
    "#ff1744",
    "#d50000",
    "#b71c1c",
    "#ff5252",
    "#c62828",
    "#e53935",
    "#ff8a80"
];

const heartColors = [
    "#ff1744",
    "#ff4d6d",
    "#ff8a95",
    "#ffb3bd"
];

const fwColors = [
    "#ffe2b8",
    "#ff5252",
    "#ffd08a",
    "#ff8a95",
    "#ffffff",
    "#ffb74d"
];

let particles = [];
let targetCount = 35;
let heartRate = 0.02;
let fallingCount = 0;

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resize();

window.addEventListener("resize", resize);

function rand(a, b) {
    return a + Math.random() * (b - a);
}

function pick(list) {
    return list[Math.floor(Math.random() * list.length)];
}

function addPetal() {
    particles.push({
        type: "petal",
        burst: false,
        x: rand(0, canvas.width),
        y: -20,
        vx: 0,
        vy: rand(1, 3),
        size: rand(6, 14),
        angle: rand(0, 6),
        spin: rand(-0.03, 0.03),
        t: rand(0, 6),
        alpha: 0.9,
        color: pick(petalColors)
    });
}

function addHeart() {
    particles.push({
        type: "heart",
        x: rand(0, canvas.width),
        y: canvas.height + 20,
        vy: -rand(0.8, 2),
        size: rand(10, 22),
        t: rand(0, 6),
        color: pick(heartColors)
    });
}

function addSpark() {
    particles.push({
        type: "spark",
        x: rand(0, canvas.width),
        y: rand(0, canvas.height),
        size: rand(3, 8),
        life: 0,
        speed: rand(0.012, 0.025)
    });
}

function burst(x, y) {
    for (let i = 0; i < 28; i++) {
        const angle = rand(0, Math.PI * 2);
        const speed = rand(2, 7);

        particles.push({
            type: "petal",
            burst: true,
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 3,
            size: rand(5, 11),
            angle: rand(0, 6),
            spin: rand(-0.2, 0.2),
            t: 0,
            alpha: 1,
            color: pick(petalColors)
        });
    }
}

function firework(x, y) {
    const color = pick(fwColors);

    for (let i = 0; i < 36; i++) {
        const angle = (i / 36) * Math.PI * 2 + rand(-0.1, 0.1);
        const speed = rand(1.5, 4.5);

        particles.push({
            type: "fw",
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 1,
            color: color
        });
    }
}

function heartPath(size) {
    ctx.beginPath();
    ctx.moveTo(0, size / 4);
    ctx.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, size / 4);
    ctx.bezierCurveTo(-size / 2, size / 2, 0, size * 0.7, 0, size * 0.9);
    ctx.bezierCurveTo(0, size * 0.7, size / 2, size / 2, size / 2, size / 4);
    ctx.bezierCurveTo(size / 2, 0, 0, 0, 0, size / 4);
    ctx.closePath();
}

function starPath(size) {
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.quadraticCurveTo(0, 0, size, 0);
    ctx.quadraticCurveTo(0, 0, 0, size);
    ctx.quadraticCurveTo(0, 0, -size, 0);
    ctx.quadraticCurveTo(0, 0, 0, -size);
    ctx.closePath();
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (fallingCount < targetCount && Math.random() < 0.5) {
        addPetal();
    }

    if (Math.random() < heartRate) {
        addHeart();
    }

    if (Math.random() < 0.06) {
        addSpark();
    }

    if (
        started &&
        current === slides.length - 1 &&
        Math.random() < 0.025
    ) {
        firework(
            rand(canvas.width * 0.15, canvas.width * 0.85),
            rand(canvas.height * 0.1, canvas.height * 0.5)
        );
    }

    fallingCount = 0;

    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        let dead = false;

        ctx.save();

        if (p.type === "petal") {
            if (p.burst) {
                p.vy += 0.18;
                p.vx *= 0.985;
                p.x += p.vx;
                p.y += p.vy;
                p.alpha -= 0.012;

                if (p.alpha <= 0) {
                    dead = true;
                }
            } else {
                fallingCount++;

                p.t += 0.03;
                p.y += p.vy;
                p.x += Math.sin(p.t) * 0.9;
            }

            if (p.y > canvas.height + 30) {
                dead = true;
            }

            p.angle += p.spin;

            ctx.translate(p.x, p.y);
            ctx.rotate(p.angle);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = Math.max(p.alpha, 0);

            ctx.beginPath();
            ctx.ellipse(
                0,
                0,
                p.size,
                p.size * 0.6,
                0,
                0,
                Math.PI * 2
            );
            ctx.fill();

        } else if (p.type === "heart") {
            p.t += 0.03;
            p.y += p.vy;
            p.x += Math.sin(p.t) * 0.6;

            if (p.y < -30) {
                dead = true;
            }

            ctx.translate(p.x, p.y);
            ctx.translate(0, -p.size * 0.45);

            ctx.globalAlpha = Math.max(
                0,
                Math.min(0.85, p.y / (canvas.height * 0.35))
            );

            ctx.fillStyle = p.color;

            heartPath(p.size);
            ctx.fill();

        } else if (p.type === "spark") {
            p.life += p.speed;

            if (p.life >= 1) {
                dead = true;
            }

            ctx.translate(p.x, p.y);
            ctx.globalAlpha = Math.sin(
                Math.min(p.life, 1) * Math.PI
            );

            ctx.fillStyle = "#ffe2b8";

            starPath(p.size * (0.5 + p.life));
            ctx.fill();

        } else if (p.type === "fw") {
            p.vy += 0.04;
            p.vx *= 0.985;

            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.015;

            if (p.life <= 0) {
                dead = true;
            }

            ctx.globalAlpha = Math.max(p.life, 0);
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 8;

            ctx.beginPath();
            ctx.arc(p.x, p.y, 2.2, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();

        if (dead) {
            particles.splice(i, 1);
        }
    }

    requestAnimationFrame(animate);
}

showSlide(0);
animate();