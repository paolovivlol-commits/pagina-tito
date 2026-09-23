const secciones = document.querySelectorAll(".seccion, footer"),
  enlacesNavegacion = document.querySelectorAll("nav a"),
  tarjetas = document.querySelectorAll(".tarjeta"),
  ticket = document.querySelector("#ticket"),
  boton = document.querySelector(".boton"),
  hero = document.querySelector(".hero"),
  videoHero = document.querySelector(".hero-video"),
  contenidoHero = document.querySelector(".hero-contenido"),
  rgb = document.querySelector(".rgb-glow"),
  precios = document.querySelectorAll(".precio"),
  prefiereReducirMovimiento = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches,
  menuToggle = document.querySelector(".menu-toggle"),
  menuPrincipal = document.querySelector("#menu-principal"),
  soportaObservador = "IntersectionObserver" in window,
  transicionPagina = document.createElement("div");
((transicionPagina.className = "transicion-pagina"),
  transicionPagina.setAttribute("aria-hidden", "true"),
  (transicionPagina.innerHTML = '<span class="transicion-linea"></span>'),
  document.body.appendChild(transicionPagina));
const barraProgreso = document.createElement("div");
((barraProgreso.className = "barra-progreso"),
  barraProgreso.setAttribute("aria-hidden", "true"),
  document.body.appendChild(barraProgreso));
const luzCursor = document.createElement("div");
if (
  ((luzCursor.className = "luz-cursor"),
  luzCursor.setAttribute("aria-hidden", "true"),
  document.body.appendChild(luzCursor),
  document.querySelectorAll(".seccion").forEach((e) => {
    Array.from(e.children)
      .filter((e) => e.matches("h2, p, .tarjeta, .sede-info, .horarios"))
      .forEach((e, t) => {
        (e.classList.add("revelar-deslizamiento"),
          e.style.setProperty("--retraso", 90 * t + "ms"));
      });
  }),
  soportaObservador)
) {
  const e = new IntersectionObserver(
    (e) => {
      e.forEach((e) => {
        e.isIntersecting && e.target.classList.add("visible");
      });
    },
    { threshold: 0.15 },
  );
  secciones.forEach((t) => e.observe(t));
} else secciones.forEach((e) => e.classList.add("visible"));
if (videoHero) {
  videoHero.muted = !0;
  const e = () => {
    videoHero.play().catch(() => {});
  };
  (e(),
    window.addEventListener("pointerdown", e, { once: !0, passive: !0 }),
    window.addEventListener("keydown", e, { once: !0 }));
}
(ticket &&
  (ticket.classList.add("revelar-deslizamiento"),
  ticket.style.setProperty("--retraso", "120ms")),
  precios.forEach((e) => {
    const t = Number(e.textContent.replace(/[^0-9]/g, ""));
    ((e.dataset.valorFinal = t), (e.textContent = "$0"));
  }));
const animarPrecio = (e) => {
  const t = Number(e.dataset.valorFinal),
    r = performance.now(),
    o = (n) => {
      const i = Math.min((n - r) / 900, 1),
        a = 1 - Math.pow(1 - i, 3);
      ((e.textContent = `$${Math.round(t * a).toLocaleString("en-US")}`),
        i < 1 && requestAnimationFrame(o));
    };
  requestAnimationFrame(o);
};
if (soportaObservador) {
  const e = new IntersectionObserver(
    (e, t) => {
      e.forEach((e) => {
        if (!e.isIntersecting) return;
        const r = e.target;
        (animarPrecio(r), t.unobserve(r));
      });
    },
    { threshold: 0.7 },
  );
  precios.forEach((t) => e.observe(t));
} else precios.forEach(animarPrecio);
const seccionesConId = document.querySelectorAll(
  "main section[id], footer[id]",
);
if (soportaObservador) {
  const e = new IntersectionObserver(
    (e) => {
      e.forEach((e) => {
        e.isIntersecting &&
          enlacesNavegacion.forEach((t) => {
            t.classList.toggle(
              "activo",
              t.getAttribute("href") === `#${e.target.id}`,
            );
          });
      });
    },
    { rootMargin: "-35% 0px -55% 0px" },
  );
  seccionesConId.forEach((t) => e.observe(t));
}
const cambiarEstadoMenu = (e) => {
  (menuToggle.setAttribute("aria-expanded", String(e)),
    menuToggle.setAttribute("aria-label", e ? "Cerrar menu" : "Abrir menu"),
    menuPrincipal.classList.toggle("menu-visible", e),
    document.body.classList.toggle("menu-bloqueado", e));
};
menuToggle &&
  menuPrincipal &&
  menuToggle.addEventListener("click", () => {
    const e = "true" === menuToggle.getAttribute("aria-expanded");
    cambiarEstadoMenu(!e);
  });
const deslizarASeccion = (e) => {
  const t = document.querySelector(e.getAttribute("href"));
  if (t) {
    if ((cambiarEstadoMenu(!1), prefiereReducirMovimiento))
      return (
        t.scrollIntoView(),
        void history.replaceState(null, "", e.getAttribute("href"))
      );
    (transicionPagina.classList.remove("salir"),
      transicionPagina.classList.add("entrar"),
      window.setTimeout(() => {
        (t.scrollIntoView({ behavior: "auto" }),
          history.replaceState(null, "", e.getAttribute("href")),
          transicionPagina.classList.replace("entrar", "salir"));
      }, 420));
  }
};
if (
  (document.querySelectorAll('a[href^="#"]').forEach((e) => {
    e.addEventListener("click", (t) => {
      (t.preventDefault(), deslizarASeccion(e));
    });
  }),
  tarjetas.forEach((e) => {
    (e.addEventListener("pointermove", (t) => {
      if (prefiereReducirMovimiento) return;
      const r = e.getBoundingClientRect(),
        o = -7 * ((t.clientY - r.top) / r.height - 0.5),
        n = 7 * ((t.clientX - r.left) / r.width - 0.5);
      e.style.transform = `perspective(700px) rotateX(${o}deg) rotateY(${n}deg) translateY(-6px)`;
    }),
      e.addEventListener("pointerleave", () => {
        e.style.transform = "";
      }));
  }),
  ticket)
) {
  let e, t, r;
  const o = () => {
    if (((r = null), !e || !t)) return;
    const { clientX: o, clientY: n } = t,
      i = 12 * ((o - e.left) / e.width - 0.5),
      a = -10 * ((n - e.top) / e.height - 0.5);
    ((ticket.style.transform = `perspective(1400px) rotateX(${a}deg) rotateY(${i}deg) scale(1.035)`),
      ticket.style.setProperty("--sombra-x", 2 * -i + "px"),
      ticket.style.setProperty("--sombra-y", 2 * a + 40 + "px"));
  };
  (ticket.addEventListener("pointerenter", () => {
    ((e = ticket.getBoundingClientRect()),
      ticket.classList.add("ticket-activo"));
  }),
    ticket.addEventListener("pointermove", (e) => {
      ((t = e), r || (r = requestAnimationFrame(o)));
    }),
    ticket.addEventListener("pointerleave", () => {
      ((t = null),
        (e = null),
        ticket.classList.remove("ticket-activo"),
        (ticket.style.transform =
          "perspective(1400px) rotateX(0deg) rotateY(0deg) scale(1)"),
        ticket.style.removeProperty("--sombra-x"),
        ticket.style.removeProperty("--sombra-y"));
    }));
}
boton &&
  boton.addEventListener("click", (e) => {
    const t = boton.getBoundingClientRect(),
      r = document.createElement("span");
    ((r.className = "ripple"),
      (r.style.left = e.clientX - t.left - 6 + "px"),
      (r.style.top = e.clientY - t.top - 6 + "px"),
      boton.appendChild(r),
      r.addEventListener("animationend", () => r.remove()));
  });
const actualizarScroll = () => {
  const e = document.documentElement.scrollHeight - window.innerHeight,
    t = e > 0 ? (window.scrollY / e) * 100 : 0;
  if ((barraProgreso.style.setProperty("--progreso-scroll", `${t}%`), hero)) {
    const e = Math.min(window.scrollY / Math.max(hero.offsetHeight, 1), 1);
    (hero.style.setProperty(
      "--desplazamiento-hero",
      0.16 * window.scrollY + "px",
    ),
      hero.style.setProperty("--video-scale", "" + (1.06 + 0.1 * e)),
      hero.style.setProperty("--scroll-darken", "" + 0.24 * e),
      contenidoHero && (contenidoHero.style.opacity = "" + (1 - 0.82 * e)));
  }
};
let desplazamientoPendiente = !1;
if (
  (window.addEventListener(
    "scroll",
    () => {
      desplazamientoPendiente ||
        ((desplazamientoPendiente = !0),
        requestAnimationFrame(() => {
          (actualizarScroll(), (desplazamientoPendiente = !1));
        }));
    },
    { passive: !0 },
  ),
  !prefiereReducirMovimiento)
) {
  if (hero && rgb) {
    let e = 0,
      t = 0,
      r = 0,
      o = 0,
      n = 0,
      i = !1;
    const a = () => {
      const o = Number(rgb.dataset.mouseX || 0),
        n = Number(rgb.dataset.mouseY || 0);
      ((e += 0.18 * (o - e)),
        (t += 0.18 * (n - t)),
        (rgb.style.transform = `translate3d(${e}px, ${t}px, 0) translate(-50%, -50%) scale(${1 + r / 80})`),
        (r *= 0.9),
        requestAnimationFrame(a));
    };
    (hero.addEventListener("pointermove", (e) => {
      const t = hero.getBoundingClientRect(),
        s = e.clientX - t.left,
        c = e.clientY - t.top;
      ((rgb.dataset.mouseX = s),
        (rgb.dataset.mouseY = c),
        (r = Math.min(Math.hypot(s - o, c - n), 40)),
        (o = s),
        (n = c),
        (rgb.style.opacity = `${Math.min(r / 30, 0.7)}`),
        i || ((i = !0), a()));
    }),
      hero.addEventListener("pointerleave", () => {
        rgb.style.opacity = "0";
      }));
  }
  (hero &&
    videoHero &&
    contenidoHero &&
    (hero.addEventListener("pointermove", (e) => {
      const t = hero.getBoundingClientRect(),
        r = -8 * ((e.clientX - t.left) / t.width - 0.5),
        o = -5 * ((e.clientY - t.top) / t.height - 0.5);
      (hero.style.setProperty("--video-x", `${r}px`),
        hero.style.setProperty("--video-y", `${o}px`),
        hero.style.setProperty("--parallax-x", -0.35 * r + "px"),
        hero.style.setProperty("--parallax-y", -0.35 * o + "px"));
    }),
    hero.addEventListener("pointerleave", () => {
      (hero.style.setProperty("--video-x", "0px"),
        hero.style.setProperty("--video-y", "0px"),
        hero.style.setProperty("--parallax-x", "0px"),
        hero.style.setProperty("--parallax-y", "0px"));
    })),
    window.addEventListener(
      "pointermove",
      (e) => {
        luzCursor.style.transform = `translate3d(${e.clientX - 110}px, ${e.clientY - 110}px, 0)`;
      },
      { passive: !0 },
    ),
    document.addEventListener("pointerover", (e) => {
      e.target.closest("a, .tarjeta, .boton") &&
        luzCursor.classList.add("activo");
    }),
    document.addEventListener("pointerout", (e) => {
      e.target.closest("a, .tarjeta, .boton") &&
        luzCursor.classList.remove("activo");
    }));
}
(boton &&
  !prefiereReducirMovimiento &&
  (boton.addEventListener("pointermove", (e) => {
    const t = boton.getBoundingClientRect(),
      r = 0.08 * (e.clientX - (t.left + t.width / 2)),
      o = 0.08 * (e.clientY - (t.top + t.height / 2));
    boton.style.transform = `translate(${r}px, ${o}px) scale(1.04)`;
  }),
  boton.addEventListener("pointerleave", () => {
    boton.style.transform = "";
  })),
  actualizarScroll());
