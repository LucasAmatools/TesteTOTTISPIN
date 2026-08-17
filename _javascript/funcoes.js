/* ============================================================
   TOTTISPIN - ACADEMIA DE TÊNIS
   Interatividade do site
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

    /* ---------- Segurança de imagens ----------
       Se qualquer imagem falhar ao carregar, adiciona um fundo de
       reserva para a área nunca ficar vazia. */
    document.addEventListener('error', function (evento) {
        const alvo = evento.target;
        if (alvo.tagName === 'IMG') {
            alvo.style.display = 'none';
            const pai = alvo.closest('.card-imagem, .galeria-item, .introducao-imagem, .esporte-imagem, .ranking-imagem');
            if (pai) {
                pai.classList.add('img-falha');
                pai.setAttribute('data-aviso', 'Imagem indisponível');
            }
        }
    }, true);

    /* ---------- Referências de elementos ---------- */
    const cabecalho = document.getElementById('cabecalho');
    const btnTopo = document.getElementById('btnTopo');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxLegenda = document.getElementById('lightboxLegenda');
    const lightboxFechar = document.getElementById('lightboxFechar');
    const lightboxAnterior = document.getElementById('lightboxAnterior');
    const lightboxProximo = document.getElementById('lightboxProximo');
    const galeriaItems = document.querySelectorAll('.galeria-item');

    /* ============================================================
       NAVEGAÇÃO: fundo ao rolar + botão de topo
       ============================================================ */
    function aoRolar() {
        // Cabeçalho com fundo
        if (window.scrollY > 50) {
            cabecalho.classList.add('rolado');
        } else {
            cabecalho.classList.remove('rolado');
        }

        // Botão voltar ao topo
        if (window.scrollY > 500) {
            btnTopo.classList.add('visivel');
        } else {
            btnTopo.classList.remove('visivel');
        }

        // Ativar link da seção visível
        ativarLinkAtivo();
    }

    window.addEventListener('scroll', aoRolar);
    aoRolar();

    /* ============================================================
       MENU MOBILE (hamburger)
       ============================================================ */
    hamburger.addEventListener('click', function () {
        hamburger.classList.toggle('ativo');
        navMenu.classList.toggle('ativo');
        document.body.style.overflow = navMenu.classList.contains('ativo') ? 'hidden' : '';
    });

    // Fechar menu ao clicar em um link
    navLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            hamburger.classList.remove('ativo');
            navMenu.classList.remove('ativo');
            document.body.style.overflow = '';
        });
    });

    /* ============================================================
       DESTACAR LINK ATIVO DURANTE A ROLAGEM
       ============================================================ */
    const secoes = document.querySelectorAll('section[id]');

    function ativarLinkAtivo() {
        const posicao = window.scrollY + 100;
        let atual = '';

        secoes.forEach(function (secao) {
            const topo = secao.offsetTop;
            const altura = secao.offsetHeight;
            if (posicao >= topo && posicao < topo + altura) {
                atual = secao.getAttribute('id');
            }
        });

        navLinks.forEach(function (link) {
            link.classList.remove('ativo');
            if (link.getAttribute('href') === '#' + atual) {
                link.classList.add('ativo');
            }
        });
    }

    /* ============================================================
       BOTÃO VOLTAR AO TOPO
       ============================================================ */
    btnTopo.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* ============================================================
       ANIMAÇÕES DE REVEAL (seguras e opcionais)
       O conteúdo é SEMPRE visível (garantido pelo CSS). Esta
       função apenas adiciona uma leve animação decorativa de
       carregamento, sem NUNCA esconder conteúdo.
       ============================================================ */
    const itensReveal = document.querySelectorAll('.reveal');

    // Garante que TODOS os elementos .reveal estejam visíveis,
    // mesmo que o IntersectionObserver não exista no navegador.
    itensReveal.forEach(function (item) {
        item.style.opacity = '1';
        item.style.transform = 'none';
        item.style.visibility = 'visible';
        item.classList.remove('animar');
        item.classList.add('anima-suave');
    });

    if ('IntersectionObserver' in window) {
        const observerReveal = new IntersectionObserver(function (entradas) {
            entradas.forEach(function (entrada) {
                // Apenas adiciona a classe animada; nunca oculta.
                if (entrada.isIntersecting) {
                    entrada.target.classList.add('visivel');
                    observerReveal.unobserve(entrada.target);
                }
            });
        }, { threshold: 0.05 });

        itensReveal.forEach(function (item) {
            observerReveal.observe(item);
        });
    }

    /* ============================================================
       CONTADORES ANIMADOS
       ============================================================ */
    const contadores = document.querySelectorAll('.contador');

    if ('IntersectionObserver' in window) {
        const observerContador = new IntersectionObserver(function (entradas) {
            entradas.forEach(function (entrada) {
                if (entrada.isIntersecting) {
                    const elemento = entrada.target;
                    const alvo = parseInt(elemento.getAttribute('data-alvo'), 10);
                    const duracao = 2000;
                    const inicio = performance.now();
                    const temSufixo = elemento.getAttribute('data-sufixo');

                    function atualizar(agora) {
                        const progresso = Math.min((agora - inicio) / duracao, 1);
                        const valorAtual = Math.floor(progresso * alvo);
                        elemento.textContent = valorAtual + (temSufixo || '');
                        if (progresso < 1) {
                            requestAnimationFrame(atualizar);
                        } else {
                            elemento.textContent = alvo + (temSufixo || '');
                        }
                    }
                    requestAnimationFrame(atualizar);
                    observerContador.unobserve(elemento);
                }
            });
        }, { threshold: 0.5 });

        contadores.forEach(function (contador) {
            observerContador.observe(contador);
        });
    }

/* ============================================================
       GALERIA / LIGHTBOX
       A implementação fica no final do arquivo, com funções
       GLOBAIS (window.abrirGaleria) que são chamadas direto
       pelo atributo onclick de cada item da galeria no HTML.
       Isso garante que o clique SEMPRE amplie a imagem.
       ============================================================ */

    /* ============================================================
       GALERIA / LIGHTBOX (configuração interna)
       ============================================================ */
    window.__galeriaConfig = {
        galeriaItems: galeriaItems,
        lightbox: lightbox,
        lightboxImg: lightboxImg,
        lightboxLegenda: lightboxLegenda
    };

});

/* ============================================================
   FUNÇÕES GLOBAIS DA GALERIA / LIGHTBOX
   Chamadas diretamente pelo atributo onclick no HTML.
   Ficam FORA do DOMContentLoaded para estarem sempre acessíveis.
   ============================================================ */
let indiceGaleriaAtual = 0;

function obterLightbox() {
    return document.getElementById('lightbox');
}

function obterImgLightbox() {
    return document.getElementById('lightboxImg');
}

function obterLegendaLightbox() {
    return document.getElementById('lightboxLegenda');
}

function obterItensGaleria() {
    return document.querySelectorAll('.galeria-item');
}

function codificarUrl(url) {
    return String(url).replace(/ /g, '%20');
}

function abrirGaleria(indice) {
    const itens = obterItensGaleria();
    if (indice < 0 || indice >= itens.length) return;

    indiceGaleriaAtual = indice;
    const item = itens[indice];
    const img = item.querySelector('img');
    const legendaEl = item.querySelector('.galeria-overlay span');
    const src = (item.dataset && item.dataset.img) ? item.dataset.img : (img ? img.src : '');
    const legenda = (item.dataset && item.dataset.legenda) ? item.dataset.legenda : (legendaEl ? legendaEl.textContent : '');

    const lightbox = obterLightbox();
    const lightboxImg = obterImgLightbox();
    const lightboxLegenda = obterLegendaLightbox();

    lightboxImg.src = codificarUrl(src);
    lightboxImg.alt = legendaEl ? legendaEl.textContent : 'Imagem ampliada';
    lightboxLegenda.textContent = legenda;
    lightbox.classList.add('ativo');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function fecharGaleria() {
    const lightbox = obterLightbox();
    lightbox.classList.remove('ativo');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

function navegarGaleria(direcao) {
    const itens = obterItensGaleria();
    if (itens.length === 0) return;
    indiceGaleriaAtual = (indiceGaleriaAtual + direcao + itens.length) % itens.length;
    abrirGaleria(indiceGaleriaAtual);
}

// Configura os eventos de fechar, navegar e teclado (executa quando o DOM carrega)
document.addEventListener('DOMContentLoaded', function () {
    const fecharBtn = document.getElementById('lightboxFechar');
    const anteriorBtn = document.getElementById('lightboxAnterior');
    const proximoBtn = document.getElementById('lightboxProximo');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');

    if (fecharBtn) fecharBtn.addEventListener('click', function (e) { e.stopPropagation(); fecharGaleria(); });
    if (anteriorBtn) anteriorBtn.addEventListener('click', function (e) { e.stopPropagation(); navegarGaleria(-1); });
    if (proximoBtn) proximoBtn.addEventListener('click', function (e) { e.stopPropagation(); navegarGaleria(1); });

    if (lightbox) {
        lightbox.addEventListener('click', function (e) {
            if (e.target === lightbox || e.target === lightboxImg) fecharGaleria();
        });
    }

    document.addEventListener('keydown', function (e) {
        if (!lightbox || !lightbox.classList.contains('ativo')) return;
        if (e.key === 'Escape') fecharGaleria();
        if (e.key === 'ArrowLeft') navegarGaleria(-1);
        if (e.key === 'ArrowRight') navegarGaleria(1);
    });
});
