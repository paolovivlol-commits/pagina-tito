// Buscamos las partes de la pagina que vamos a animar
const secciones = document.querySelectorAll('.seccion, footer');
const enlacesNavegacion = document.querySelectorAll('nav a');
const tarjetas = document.querySelectorAll('.tarjeta');
const ticket = document.querySelector('#ticket');
const boton = document.querySelector('.boton');
const hero = document.querySelector('.hero');
const videoHero = document.querySelector('.hero-video');
const contenidoHero = document.querySelector('.hero-contenido');
const rgb = document.querySelector('.rgb-glow');
const precios = document.querySelectorAll('.precio');
const prefiereReducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const menuToggle = document.querySelector('.menu-toggle');
const menuPrincipal = document.querySelector('#menu-principal');

// Esta cortina hace el efecto de cambiar de pagina
const transicionPagina = document.createElement('div');
transicionPagina.className = 'transicion-pagina';
transicionPagina.setAttribute('aria-hidden', 'true');
transicionPagina.innerHTML = '<span class="transicion-linea"></span>';
document.body.appendChild(transicionPagina);

// Barra que muestra cuanto hemos bajado
const barraProgreso = document.createElement('div');
barraProgreso.className = 'barra-progreso';
barraProgreso.setAttribute('aria-hidden', 'true');
document.body.appendChild(barraProgreso);

// Luz que sigue al mouse para que se vea mas moderno
const luzCursor = document.createElement('div');
luzCursor.className = 'luz-cursor';
luzCursor.setAttribute('aria-hidden', 'true');
document.body.appendChild(luzCursor);

// Las cosas aparecen una por una cuando entran en pantalla
document.querySelectorAll('.seccion').forEach((seccion) => {
  seccion.querySelectorAll(':scope > h2, :scope > p, .tarjeta, .sede-info, .horarios').forEach((elemento, indice) => {
    elemento.classList.add('revelar-deslizamiento');
    elemento.style.setProperty('--retraso', `${indice * 90}ms`);
  });
});

// Detecta cuando una seccion ya se puede ver
const observador = new IntersectionObserver((entradas) => {
  entradas.forEach((entrada) => {
    if (entrada.isIntersecting) {
      entrada.target.classList.add('visible');
    }
  });
}, { threshold: 0.15 });

secciones.forEach((seccion) => observador.observe(seccion));

// Intentamos iniciar el video automaticamente y sin sonido
if (videoHero) {
  videoHero.muted = true;
  videoHero.play().catch(() => {
    videoHero.setAttribute('controls', '');
  });
}

if (ticket) {
  ticket.classList.add('revelar-deslizamiento');
  ticket.style.setProperty('--retraso', '120ms');
}

precios.forEach((precio) => {
  const valor = Number(precio.textContent.replace(/[^0-9]/g, ''));
  precio.dataset.valorFinal = valor;
  precio.textContent = '$0';
});

// Los precios empiezan en cero y suben cuando aparecen
const observadorPrecios = new IntersectionObserver((entradas, observadorActual) => {
  entradas.forEach((entrada) => {
    if (!entrada.isIntersecting) return;
    const precio = entrada.target;
    const valorFinal = Number(precio.dataset.valorFinal);
    const inicio = performance.now();
    const duracion = 900;

    const animarPrecio = (tiempoActual) => {
      const progreso = Math.min((tiempoActual - inicio) / duracion, 1);
      const progresoSuave = 1 - Math.pow(1 - progreso, 3);
      precio.textContent = `$${Math.round(valorFinal * progresoSuave).toLocaleString('en-US')}`;
      if (progreso < 1) requestAnimationFrame(animarPrecio);
    };

    requestAnimationFrame(animarPrecio);
    observadorActual.unobserve(precio);
  });
}, { threshold: 0.7 });

precios.forEach((precio) => observadorPrecios.observe(precio));

const seccionesConId = document.querySelectorAll('main section[id], footer[id]');
const observadorNavegacion = new IntersectionObserver((entradas) => {
  entradas.forEach((entrada) => {
    if (!entrada.isIntersecting) return;
    enlacesNavegacion.forEach((enlace) => {
      enlace.classList.toggle('activo', enlace.getAttribute('href') === `#${entrada.target.id}`);
    });
  });
}, { rootMargin: '-35% 0px -55% 0px' });

seccionesConId.forEach((seccion) => observadorNavegacion.observe(seccion));

// Abre o cierra el menu de celular
const cambiarEstadoMenu = (estaAbierto) => {
  menuToggle.setAttribute('aria-expanded', String(estaAbierto));
  menuToggle.setAttribute('aria-label', estaAbierto ? 'Cerrar menu' : 'Abrir menu');
  menuPrincipal.classList.toggle('menu-visible', estaAbierto);
  document.body.classList.toggle('menu-bloqueado', estaAbierto);
};

menuToggle.addEventListener('click', () => {
  const estaAbierto = menuToggle.getAttribute('aria-expanded') === 'true';
  cambiarEstadoMenu(!estaAbierto);
});

// Hace el cambio de seccion con una animacion
const deslizarASeccion = (enlace) => {
  const destino = document.querySelector(enlace.getAttribute('href'));
  if (!destino) return;

  cambiarEstadoMenu(false);

  if (prefiereReducirMovimiento) {
    destino.scrollIntoView();
    history.replaceState(null, '', enlace.getAttribute('href'));
    return;
  }

  transicionPagina.classList.remove('salir');
  transicionPagina.classList.add('entrar');

  window.setTimeout(() => {
    destino.scrollIntoView({ behavior: 'auto' });
    history.replaceState(null, '', enlace.getAttribute('href'));
    transicionPagina.classList.replace('entrar', 'salir');
  }, 420);
};

document.querySelectorAll('a[href^="#"]').forEach((enlace) => {
  enlace.addEventListener('click', (evento) => {
    evento.preventDefault();
    deslizarASeccion(enlace);
  });
});

tarjetas.forEach((tarjeta) => {
  tarjeta.addEventListener('pointermove', (evento) => {
    if (prefiereReducirMovimiento) return;
    const rectangulo = tarjeta.getBoundingClientRect();
    const rotacionX = ((evento.clientY - rectangulo.top) / rectangulo.height - 0.5) * -7;
    const rotacionY = ((evento.clientX - rectangulo.left) / rectangulo.width - 0.5) * 7;
    tarjeta.style.transform = `perspective(700px) rotateX(${rotacionX}deg) rotateY(${rotacionY}deg) translateY(-6px)`;
  });

  tarjeta.addEventListener('pointerleave', () => {
    tarjeta.style.transform = '';
  });
});

// Movimiento 3D del boleto cuando pasamos el mouse
if (ticket) {
  let marcoTicket;
  let movimientoPendiente;
  let frameTicket;

  const actualizarTicket = () => {
    frameTicket = null;
    if (!marcoTicket || !movimientoPendiente) return;
    const { clientX, clientY } = movimientoPendiente;
    const x = (clientX - marcoTicket.left) / marcoTicket.width - 0.5;
    const y = (clientY - marcoTicket.top) / marcoTicket.height - 0.5;
    const rotacionY = x * 12;
    const rotacionX = y * -10;

    ticket.style.transform = `perspective(1400px) rotateX(${rotacionX}deg) rotateY(${rotacionY}deg) scale(1.035)`;
    ticket.style.setProperty('--sombra-x', `${-rotacionY * 2}px`);
    ticket.style.setProperty('--sombra-y', `${rotacionX * 2 + 40}px`);
  };

  ticket.addEventListener('pointerenter', () => {
    marcoTicket = ticket.getBoundingClientRect();
    ticket.classList.add('ticket-activo');
  });

  ticket.addEventListener('pointermove', (evento) => {
    movimientoPendiente = evento;
    if (!frameTicket) frameTicket = requestAnimationFrame(actualizarTicket);
  });

  ticket.addEventListener('pointerleave', () => {
    movimientoPendiente = null;
    marcoTicket = null;
    ticket.classList.remove('ticket-activo');
    ticket.style.transform = 'perspective(1400px) rotateX(0deg) rotateY(0deg) scale(1)';
    ticket.style.removeProperty('--sombra-x');
    ticket.style.removeProperty('--sombra-y');
  });
}

boton.addEventListener('click', (evento) => {
  const rectangulo = boton.getBoundingClientRect();
  const onda = document.createElement('span');
  onda.className = 'ripple';
  onda.style.left = `${evento.clientX - rectangulo.left - 6}px`;
  onda.style.top = `${evento.clientY - rectangulo.top - 6}px`;
  boton.appendChild(onda);
  onda.addEventListener('animationend', () => onda.remove());
});

// Efectos del video cuando hacemos scroll
const actualizarScroll = () => {
  const altoDesplazable = document.documentElement.scrollHeight - window.innerHeight;
  const porcentaje = altoDesplazable > 0 ? (window.scrollY / altoDesplazable) * 100 : 0;
  barraProgreso.style.setProperty('--progreso-scroll', `${porcentaje}%`);

  if (hero) {
    const progresoHero = Math.min(window.scrollY / Math.max(hero.offsetHeight, 1), 1);
    hero.style.setProperty('--desplazamiento-hero', `${window.scrollY * 0.16}px`);
    hero.style.setProperty('--video-scale', `${1.06 + progresoHero * 0.1}`);
    hero.style.setProperty('--scroll-darken', `${progresoHero * 0.24}`);
    if (contenidoHero) contenidoHero.style.opacity = `${1 - progresoHero * 0.82}`;
  }
};

let desplazamientoPendiente = false;
window.addEventListener('scroll', () => {
  if (desplazamientoPendiente) return;
  desplazamientoPendiente = true;
  requestAnimationFrame(() => {
    actualizarScroll();
    desplazamientoPendiente = false;
  });
}, { passive: true });

// Parallax suave del hero y la luz del cursor
if (!prefiereReducirMovimiento) {
  // El brillo rojo sigue al cursor sin tapar el video
  if (hero && rgb) {
    let rgbX = 0;
    let rgbY = 0;
    let velocidad = 0;
    let ultimoX = 0;
    let ultimoY = 0;
    let animandoRgb = false;

    const animarRgb = () => {
      const mouseX = Number(rgb.dataset.mouseX || 0);
      const mouseY = Number(rgb.dataset.mouseY || 0);
      rgbX += (mouseX - rgbX) * 0.18;
      rgbY += (mouseY - rgbY) * 0.18;
      rgb.style.transform = `translate3d(${rgbX}px, ${rgbY}px, 0) translate(-50%, -50%) scale(${1 + velocidad / 80})`;
      velocidad *= 0.9;
      requestAnimationFrame(animarRgb);
    };

    hero.addEventListener('pointermove', (evento) => {
      const rectangulo = hero.getBoundingClientRect();
      const mouseX = evento.clientX - rectangulo.left;
      const mouseY = evento.clientY - rectangulo.top;
      rgb.dataset.mouseX = mouseX;
      rgb.dataset.mouseY = mouseY;
      velocidad = Math.min(Math.hypot(mouseX - ultimoX, mouseY - ultimoY), 40);
      ultimoX = mouseX;
      ultimoY = mouseY;
      rgb.style.opacity = `${Math.min(velocidad / 30, 0.7)}`;
      if (!animandoRgb) {
        animandoRgb = true;
        animarRgb();
      }
    });

    hero.addEventListener('pointerleave', () => {
      rgb.style.opacity = '0';
    });

    if (boton) {
      boton.addEventListener('pointermove', (evento) => {
        const rectangulo = boton.getBoundingClientRect();
        const movimientoX = (evento.clientX - (rectangulo.left + rectangulo.width / 2)) * 0.08;
        const movimientoY = (evento.clientY - (rectangulo.top + rectangulo.height / 2)) * 0.08;
        boton.style.transform = `translate(${movimientoX}px, ${movimientoY}px) scale(1.04)`;
      });

      boton.addEventListener('pointerleave', () => {
        boton.style.transform = '';
      });
    }
  }

  if (hero && videoHero && contenidoHero) {
    hero.addEventListener('pointermove', (evento) => {
      const rectangulo = hero.getBoundingClientRect();
      const desplazamientoX = ((evento.clientX - rectangulo.left) / rectangulo.width - 0.5) * -8;
      const desplazamientoY = ((evento.clientY - rectangulo.top) / rectangulo.height - 0.5) * -5;
      hero.style.setProperty('--video-x', `${desplazamientoX}px`);
      hero.style.setProperty('--video-y', `${desplazamientoY}px`);
      hero.style.setProperty('--parallax-x', `${desplazamientoX * -0.35}px`);
      hero.style.setProperty('--parallax-y', `${desplazamientoY * -0.35}px`);
    });

    hero.addEventListener('pointerleave', () => {
      hero.style.setProperty('--video-x', '0px');
      hero.style.setProperty('--video-y', '0px');
      hero.style.setProperty('--parallax-x', '0px');
      hero.style.setProperty('--parallax-y', '0px');
    });
  }

  window.addEventListener('pointermove', (evento) => {
    luzCursor.style.transform = `translate3d(${evento.clientX - 110}px, ${evento.clientY - 110}px, 0)`;
  }, { passive: true });

  document.addEventListener('pointerover', (evento) => {
    if (evento.target.closest('a, .tarjeta, .boton')) luzCursor.classList.add('activo');
  });

  document.addEventListener('pointerout', (evento) => {
    if (evento.target.closest('a, .tarjeta, .boton')) luzCursor.classList.remove('activo');
  });
}

actualizarScroll();