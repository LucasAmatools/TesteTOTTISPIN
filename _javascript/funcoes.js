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
    const contatoForm = document.getElementById('contatoForm');

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
       FORMULÁRIO DE CONTATO (validação)
       ============================================================ */
    function mostraErro(campoId, mensagem) {
        const grupo = document.getElementById(campoId).closest('.form-grupo');
        const erro = document.getElementById('erro' + campoId.charAt(0).toUpperCase() + campoId.slice(1));
        grupo.classList.add('invalido');
        erro.textContent = mensagem;
    }

    function limpaErro(campoId) {
        const grupo = document.getElementById(campoId).closest('.form-grupo');
        const erro = document.getElementById('erro' + campoId.charAt(0).toUpperCase() + campoId.slice(1));
        grupo.classList.remove('invalido');
        erro.textContent = '';
    }

    function validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    function validarTelefone(telefone) {
        // Aceita formatos: (11) 99999-9999, 11999999999, etc.
        return telefone === '' || /^[()\s\d-]{8,18}$/.test(telefone);
    }

    contatoForm.addEventListener('submit', function (evento) {
        evento.preventDefault();

        let valido = true;

        // Nome
        const nome = document.getElementById('nome');
        if (nome.value.trim().length < 3) {
            mostraErro('nome', 'Informe seu nome completo (mínimo 3 letras).');
            valido = false;
        } else {
            limpaErro('nome');
        }

        // E-mail
        const email = document.getElementById('email');
        if (!validarEmail(email.value.trim())) {
            mostraErro('email', 'Informe um e-mail válido.');
            valido = false;
        } else {
            limpaErro('email');
        }

        // Telefone (opcional)
        const telefone = document.getElementById('telefone');
        if (!validarTelefone(telefone.value.trim())) {
            mostraErro('telefone', 'Informe um telefone válido.');
            valido = false;
        } else {
            limpaErro('telefone');
        }

        // Assunto
        const assunto = document.getElementById('assunto');
        if (assunto.value === '') {
            mostraErro('assunto', 'Selecione um assunto.');
            valido = false;
        } else {
            limpaErro('assunto');
        }

        // Mensagem
        const mensagem = document.getElementById('mensagem');
        if (mensagem.value.trim().length < 10) {
            mostraErro('mensagem', 'Escreva uma mensagem com pelo menos 10 caracteres.');
            valido = false;
        } else {
            limpaErro('mensagem');
        }

        // Se válido, mostra sucesso e limpa o formulário
        if (valido) {
            // Captura os dados antes de limpar o formulário
            const dados = {
                _subject: 'Nova mensagem - Fale Conosco (Site Tottispin)',
                _template: 'table',
                _captcha: 'false',
                Nome: nome.value.trim(),
                Email: email.value.trim(),
                Telefone: telefone.value.trim(),
                Assunto: assunto.value,
                Mensagem: mensagem.value.trim()
            };

            // Envia o formulário para o e-mail (FormSubmit.co) via AJAX
            enviarFormulario(dados);

            // Abre o pop-up de confirmação IMEDIATAMENTE
            abrirModalSucesso();

            // Reseta o formulário e mostra o aviso inline
            const sucesso = document.getElementById('formSucesso');
            sucesso.classList.add('visivel');
            contatoForm.reset();
            setTimeout(function () {
                sucesso.classList.remove('visivel');
            }, 6000);
        }
    });

    // Envia os dados do formulário para o e-mail via FormSubmit.co
    function enviarFormulario(dados) {
        const endpoint = 'https://formsubmit.co/ajax/lucas@amatools.com.br';
        fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(dados)
        })
        .then(function (resposta) {
            if (!resposta.ok) {
                throw new Error('Falha no envio do e-mail');
            }
            return resposta.json();
        })
        .catch(function (erro) {
            // Não bloqueia o usuário; apenas registra o erro no console.
            console.error('Erro ao enviar formulário:', erro);
        });
    }

    // Limpar erros ao digitar
    ['nome', 'email', 'telefone', 'assunto', 'mensagem'].forEach(function (campo) {
        const el = document.getElementById(campo);
        el.addEventListener('input', function () {
            limpaErro(campo);
        });
    });

    /* ============================================================
       MODAL DE CONFIRMAÇÃO DE ENVIO (pop-up)
       ============================================================ */
    const modalSucesso = document.getElementById('modalSucesso');
    const modalSucessoFechar = document.getElementById('modalSucessoFechar');
    const modalSucessoEnviarOutra = document.getElementById('modalSucessoEnviarOutra');

    function abrirModalSucesso() {
        if (!modalSucesso) return;
        modalSucesso.classList.add('ativo');
        modalSucesso.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function fecharModalSucesso() {
        if (!modalSucesso) return;
        modalSucesso.classList.remove('ativo');
        modalSucesso.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    if (modalSucessoFechar) {
        modalSucessoFechar.addEventListener('click', function (e) {
            e.stopPropagation();
            fecharModalSucesso();
        });
    }

    if (modalSucessoEnviarOutra) {
        modalSucessoEnviarOutra.addEventListener('click', function (e) {
            e.stopPropagation();
            fecharModalSucesso();
            const nomeInput = document.getElementById('nome');
            if (nomeInput) nomeInput.focus();
        });
    }

    if (modalSucesso) {
        modalSucesso.addEventListener('click', function (e) {
            if (e.target === modalSucesso) fecharModalSucesso();
        });
    }

    document.addEventListener('keydown', function (e) {
        if (modalSucesso && modalSucesso.classList.contains('ativo') && e.key === 'Escape') {
            fecharModalSucesso();
        }
    });

/* ============================================================
       MÁSCARA SIMPLES DE TELEFONE
       ============================================================ */
    const telefoneInput = document.getElementById('telefone');
    telefoneInput.addEventListener('input', function () {
        let valor = telefoneInput.value.replace(/\D/g, '');
        if (valor.length > 11) valor = valor.slice(0, 11);
        let formatado = '';
        if (valor.length > 0) formatado = '(' + valor.slice(0, 2);
        if (valor.length >= 3) formatado += ') ' + valor.slice(2);
        if (valor.length >= 7) formatado = '(' + valor.slice(0, 2) + ') ' + valor.slice(2, 7) + '-' + valor.slice(7);
        if (valor.length >= 11) formatado = '(' + valor.slice(0, 2) + ') ' + valor.slice(2, 7) + '-' + valor.slice(7, 11);
        telefoneInput.value = formatado;
    });

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

    const lightbox = obterLightbox();
    const lightboxImg = obterImgLightbox();
    const lightboxLegenda = obterLegendaLightbox();

    lightboxImg.src = codificarUrl(src);
    lightboxImg.alt = legendaEl ? legendaEl.textContent : 'Imagem ampliada';
    lightboxLegenda.textContent = legendaEl ? legendaEl.textContent : '';
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
