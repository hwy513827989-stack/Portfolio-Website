"use strict";

/* =================================================================
   Shared site behaviour
   Each module exits quietly when its required elements are absent.
   ================================================================= */

document.addEventListener("DOMContentLoaded", () => {
    initRevealMotion();
    initMobileNavigation();
    initHomepageGallery();
    initDreamEnvironmentCarousel();
    initAssetLightbox();
    initCmcProcessLightbox();
    initVisualWorkLightbox();
    initCopyEmailButton();
});

function initRevealMotion() {
    const elements = document.querySelectorAll(".reveal");
    if (!elements.length) return;

    if (!("IntersectionObserver" in window)) {
        elements.forEach((element) => element.classList.add("visible"));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) entry.target.classList.add("visible");
        });
    }, { threshold: 0.08 });

    elements.forEach((element) => observer.observe(element));
}

function initMobileNavigation() {
    const toggle = document.querySelector(".nav-toggle");
    const backdrop = document.querySelector(".nav-backdrop");
    const nav = document.getElementById("site-nav");
    if (!toggle || !nav) return;

    const close = () => {
        document.body.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
    };

    const open = () => {
        document.body.classList.add("nav-open");
        toggle.setAttribute("aria-expanded", "true");
    };

    toggle.addEventListener("click", () => {
        document.body.classList.contains("nav-open") ? close() : open();
    });

    backdrop?.addEventListener("click", close);
    nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", close));
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") close();
    });
}

function initHomepageGallery() {
    const gallery = document.querySelector(".project-row-gallery .project-gallery");
    if (!gallery || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            gallery.classList.toggle("is-expanded", entry.intersectionRatio > 0.5);
        });
    }, { threshold: [0, 0.25, 0.5, 0.75, 1] });

    observer.observe(gallery);
}

function initDreamEnvironmentCarousel() {
    const track = document.getElementById("bgTrack");
    const prevButton = document.getElementById("bgPrev");
    const nextButton = document.getElementById("bgNext");
    const dotsContainer = document.getElementById("bgDots");
    if (!track || !prevButton || !nextButton || !dotsContainer) return;

    const slides = track.querySelectorAll(".bg-carousel-slide");
    if (!slides.length) return;

    const gap = 24;
    let current = 0;
    let visible = 3;
    let stops = 1;

    const getVisible = () => {
        if (window.innerWidth <= 480) return 1;
        if (window.innerWidth <= 900) return 2;
        return 3;
    };

    const goTo = (index) => {
        if (index >= stops) index = 0;
        if (index < 0) index = stops - 1;
        current = index;

        const carouselWidth = track.parentElement.offsetWidth;
        const slideWidth = (carouselWidth - gap * (visible - 1)) / visible + gap;
        track.style.transform = `translateX(-${current * slideWidth}px)`;

        dotsContainer.querySelectorAll(".bg-carousel-dot").forEach((dot, dotIndex) => {
            dot.classList.toggle("active", dotIndex === current);
        });
    };

    const buildDots = () => {
        dotsContainer.innerHTML = "";
        for (let index = 0; index < stops; index += 1) {
            const dot = document.createElement("button");
            dot.className = `bg-carousel-dot${index === current ? " active" : ""}`;
            dot.type = "button";
            dot.setAttribute("aria-label", `Go to slide ${index + 1}`);
            dot.addEventListener("click", () => goTo(index));
            dotsContainer.appendChild(dot);
        }
    };

    const recalculate = () => {
        const nextVisible = getVisible();
        const nextStops = Math.max(1, slides.length - nextVisible + 1);
        if (nextVisible !== visible || nextStops !== stops) {
            visible = nextVisible;
            stops = nextStops;
            current = Math.min(current, stops - 1);
            buildDots();
        }
        goTo(current);
    };

    prevButton.addEventListener("click", () => goTo(current - 1));
    nextButton.addEventListener("click", () => goTo(current + 1));
    window.addEventListener("resize", recalculate);
    recalculate();
}

function initAssetLightbox() {
    const box = document.getElementById("assetLightbox");
    const image = document.getElementById("assetLightboxImg");
    const caption = document.getElementById("assetLightboxCap");
    const closeButton = document.getElementById("assetLightboxClose");
    if (!box || !image || !caption || !closeButton) return;

    let lastTrigger = null;

    const close = () => {
        box.classList.remove("open");
        box.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
        image.src = "";
        caption.textContent = "";
        lastTrigger?.focus();
    };

    document.querySelectorAll(".zoomable-image, .zoomable-asset").forEach((trigger) => {
        trigger.addEventListener("click", (event) => {
            event.stopPropagation();
            lastTrigger = trigger;
            image.src = trigger.dataset.full || trigger.querySelector("img")?.src || "";
            image.alt = trigger.dataset.cap || "Expanded project image";
            caption.textContent = trigger.dataset.cap || "";
            box.classList.add("open");
            box.setAttribute("aria-hidden", "false");
            document.body.style.overflow = "hidden";
            closeButton.focus();
        });
    });

    closeButton.addEventListener("click", close);
    box.addEventListener("click", (event) => {
        if (event.target !== image) close();
    });
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && box.classList.contains("open")) close();
    });
}

function initCmcProcessLightbox() {
    const box = document.getElementById("lightbox");
    const image = document.getElementById("lightboxImg");
    const caption = document.getElementById("lightboxCap");
    const closeButton = document.getElementById("lightboxClose");
    if (!box || !image || !caption || !closeButton) return;

    let lastTrigger = null;

    const close = () => {
        box.classList.remove("open");
        box.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
        image.src = "";
        lastTrigger?.focus();
    };

    document.querySelectorAll(".thumb").forEach((trigger) => {
        trigger.addEventListener("click", () => {
            image.src = trigger.dataset.full || "";
            caption.textContent = trigger.dataset.cap || "";
            lastTrigger = trigger;
            box.classList.add("open");
            box.setAttribute("aria-hidden", "false");
            document.body.style.overflow = "hidden";
            closeButton.focus();
        });
    });

    closeButton.addEventListener("click", close);
    box.addEventListener("click", (event) => {
        if (event.target !== image) close();
    });
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && box.classList.contains("open")) close();
    });
}

function initVisualWorkLightbox() {
    const box = document.getElementById("visualLightbox");
    const image = document.getElementById("visualLightboxImage");
    const title = document.getElementById("visualLightboxTitle");
    const detail = document.getElementById("visualLightboxDetail");
    const closeButton = document.getElementById("visualLightboxClose");
    if (!box || !image || !title || !detail || !closeButton) return;

    let lastTrigger = null;

    const close = () => {
        box.classList.remove("open");
        box.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
        image.src = "";
        title.textContent = "";
        detail.textContent = "";
        lastTrigger?.focus();
    };

    document.querySelectorAll(".visual-work-card").forEach((trigger) => {
        trigger.addEventListener("click", () => {
            lastTrigger = trigger;
            image.src = trigger.dataset.full || "";
            image.alt = trigger.querySelector("img")?.alt || "Expanded visual work";
            title.textContent = trigger.dataset.title || "";
            detail.textContent = trigger.dataset.detail || "";
            box.classList.add("open");
            box.setAttribute("aria-hidden", "false");
            document.body.style.overflow = "hidden";
            closeButton.focus();
        });
    });

    closeButton.addEventListener("click", close);
    box.addEventListener("click", (event) => {
        if (event.target !== image) close();
    });
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && box.classList.contains("open")) close();
    });
}

function initCopyEmailButton() {
    const button = document.getElementById("copyEmailButton");
    if (!button) return;

    button.addEventListener("click", async () => {
        try {
            await navigator.clipboard.writeText("wha75@sfu.ca");
            button.textContent = "Copied ✓";
            window.setTimeout(() => {
                button.textContent = "wha75@sfu.ca";
            }, 2000);
        } catch (error) {
            button.textContent = "wha75@sfu.ca";
        }
    });
}
