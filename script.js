 const SENHA_CORRETA = "1234";

/* =========================================================================
   TEXTOS EDITÁVEIS DA CONVERSA (Pietra x Pedro Henrique)
   Altere qualquer frase entre aspas aqui e salve o arquivo.
   ========================================================================= */
const ROTEIRO_PEDRO_HENRIQUE = {
  turno1: [
    {
      texto: "que porra foi essa?",
      respostaPedro: [
        "já falei pra tu esquecer cara.",
        "tu namora e eu n to afim de estragar nossa amizade"
      ],
      proximaEtapa: "turno2"
    },
    {
      texto: "como voce fala esse monte de coisa e quer que eu esqueça?",
      respostaPedro: [
        "e vai mudar alguma coisa, pietra?",
        "porque sendo sincero contigo, to pouco me fudendo pra tua namorada, so me importo com você e com a gente"
      ],
      proximaEtapa: "turno2"
    },
    {
      texto: "henri? o que foi isso?",
      respostaPedro: [
        "brisa errada",
        "vamo fingir que isso nunca aconteceu."
      ],
      proximaEtapa: "turno2"
    }
  ],

  turno2: [
    {
      texto: "eu acabei de terminar meu relacionamento",
      respostaPedro: [
        "como assim?",
        "tu ta falando serio porque felicidade de pobre dura pouco?"
      ],
      proximaEtapa: "turno3"
    },
    {
      texto: "não fica se achando porque não é sobre você mas eu acabei de terminar...",
      respostaPedro: [
        "não precisa ser sobre mim pra eu ficar feliz",
        "ta precisando de um ombro amigo?"
      ],
      proximaEtapa: "turno3"
    },
    {
      texto: "seu idiota eu nem to namorando mais",
      respostaPedro: [
        "finalmente puta que pariu",
        "pode postar tua ex é uma delicia já?"
      ],
      proximaEtapa: "turno3"
    }
  ],

  turno3: [
    {
      texto: "você é maluco",
      respostaPedro: [
        "to maluco por tu, me espera 5 minuto to ai"
      ],
      proximaEtapa: "fim"
    },
    {
      texto: "vc é muito sem noção",
      respostaPedro: [
        "o crl vou brotar na tua casa em 10 min."
      ],
      proximaEtapa: "fim"
    },
    {
      texto: "kkkkkkkkkkkkk menino doente",
      respostaPedro: [
        "doente pra te ver gemendo meu nome, jaja to ai."
      ],
      proximaEtapa: "fim"
    }
  ]
};

const telaBloqueio = document.getElementById("tela-bloqueio");
const telaSenha = document.getElementById("tela-senha");
const telaLigacao = document.getElementById("tela-ligacao");
const telaInicial = document.getElementById("tela-inicial");
const appWhatsapp = document.getElementById("app-whatsapp");

const btnIrSenha = document.getElementById("btn-ir-senha");
const btnVoltarBloqueio = document.getElementById("btn-voltar-bloqueio");
const btnApagarSenha = document.getElementById("btn-apagar-senha");
const teclasNum = document.querySelectorAll(".tecla-num");
const pontos = document.querySelectorAll(".ponto");
const mensagemSenha = document.getElementById("mensagem-senha");

// Elementos da Ligação
const ligacaoStatus = document.getElementById("ligacao-status");
const btnAtender = document.getElementById("btn-atender");
const btnDesligar = document.getElementById("btn-desligar");
const audioToque = document.getElementById("audio-toque");
const audioVoz = document.getElementById("audio-voz");

// Ícones da Tela Inicial
const iconesApp = document.querySelectorAll(".app-icone");

// Elementos do WhatsApp
const wppVoltarHome = document.getElementById("wpp-voltar-home");
const wppMensagens = document.getElementById("wpp-mensagens");
const wppEscolhas = document.getElementById("wpp-escolhas");
const wppStatusContato = document.getElementById("wpp-status-contato");
const wppForm = document.getElementById("wpp-form");
const wppInput = document.getElementById("wpp-input");

// Player da tela de bloqueio
const btnPlayPause = document.getElementById("btn-play-pause");
let tocando = true;

let senhaDigitada = "";
let cronometroLigacao = null;
let segundosLigacao = 0;
let conversaIniciada = false;

function horaAtual() {
  const agora = new Date();
  return agora.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function adicionarMensagem(texto, tipo = "recebida") {
  const balao = document.createElement("div");
  balao.classList.add("wpp-msg", tipo);

  const p = document.createElement("p");
  p.textContent = texto;

  const spanHora = document.createElement("span");
  spanHora.classList.add("wpp-hora");
  spanHora.textContent = horaAtual();

  balao.appendChild(p);
  balao.appendChild(spanHora);
  wppMensagens.appendChild(balao);
  wppMensagens.scrollTop = wppMensagens.scrollHeight;
}

function renderizarEscolhas(opcoes) {
  wppEscolhas.innerHTML = "";

  opcoes.forEach((opcao) => {
    const botao = document.createElement("button");
    botao.type = "button";
    botao.classList.add("wpp-opcao-btn");
    botao.textContent = opcao.texto;

    botao.addEventListener("click", () => {
      wppEscolhas.innerHTML = "";
      adicionarMensagem(opcao.texto, "enviada");
      processarTurno(opcao);
    });

    wppEscolhas.appendChild(botao);
  });
}

function responderPedro(falas, proximasOpcoes, delay = 1200) {
  wppEscolhas.innerHTML = "";
  wppStatusContato.textContent = "digitando...";

  setTimeout(() => {
    falas.forEach((fala) => adicionarMensagem(fala, "recebida"));
    wppStatusContato.textContent = "online";

    if (proximasOpcoes && proximasOpcoes.length > 0) {
      renderizarEscolhas(proximasOpcoes);
    }
  }, delay);
}

function processarTurno(opcao) {
  if (opcao.proximaEtapa === "turno2") {
    responderPedro(opcao.respostaPedro, ROTEIRO_PEDRO_HENRIQUE.turno2);
  } else if (opcao.proximaEtapa === "turno3") {
    responderPedro(opcao.respostaPedro, ROTEIRO_PEDRO_HENRIQUE.turno3, 1400);
  } else {
    responderPedro(opcao.respostaPedro, []);
  }
}

function iniciarConversaWhatsapp() {
  if (!conversaIniciada) {
    conversaIniciada = true;
    renderizarEscolhas(ROTEIRO_PEDRO_HENRIQUE.turno1);
  }
}

function atualizarVisor() {
  pontos.forEach((ponto, indice) => {
    if (indice < senhaDigitada.length) {
      ponto.classList.add("preenchido");
    } else {
      ponto.classList.remove("preenchido");
    }
  });
}

function limparSenha() {
  senhaDigitada = "";
  atualizarVisor();
}

function iniciarLigacao() {
  telaSenha.classList.add("escondida");
  telaLigacao.classList.remove("escondida");
  ligacaoStatus.textContent = "Ligação recebida...";
  btnAtender.style.display = "flex";

  if (audioToque) {
    audioToque.currentTime = 0;
    audioToque.play().catch(() => {});
  }
}

function encerrarLigacao() {
  clearInterval(cronometroLigacao);

  if (audioToque) {
    audioToque.pause();
    audioToque.currentTime = 0;
  }

  if (audioVoz) {
    audioVoz.pause();
    audioVoz.currentTime = 0;
  }

  telaLigacao.classList.add("escondida");
  telaInicial.classList.add("escondida");
  appWhatsapp.classList.remove("escondida");
  iniciarConversaWhatsapp();
}

btnIrSenha.addEventListener("click", () => {
  mensagemSenha.textContent = "";
  limparSenha();
  telaBloqueio.classList.add("escondida");
  telaSenha.classList.remove("escondida");
});

btnVoltarBloqueio.addEventListener("click", () => {
  limparSenha();
  mensagemSenha.textContent = "";
  telaSenha.classList.add("escondida");
  telaBloqueio.classList.remove("escondida");
});

btnApagarSenha.addEventListener("click", () => {
  if (senhaDigitada.length > 0) {
    senhaDigitada = senhaDigitada.slice(0, -1);
    mensagemSenha.textContent = "";
    atualizarVisor();
  }
});

teclasNum.forEach((tecla) => {
  tecla.addEventListener("click", () => {
    if (senhaDigitada.length >= 4) return;

    senhaDigitada += tecla.dataset.num;
    mensagemSenha.textContent = "";
    atualizarVisor();

    if (senhaDigitada.length === 4) {
      if (senhaDigitada === SENHA_CORRETA) {
        setTimeout(() => {
          limparSenha();
          iniciarLigacao();
        }, 180);
      } else {
        mensagemSenha.textContent = "Senha incorreta. Tente novamente.";
        setTimeout(() => {
          limparSenha();
        }, 350);
      }
    }
  });
});

btnAtender.addEventListener("click", () => {
  if (audioToque) {
    audioToque.pause();
    audioToque.currentTime = 0;
  }

  btnAtender.style.display = "none";
  segundosLigacao = 0;
  ligacaoStatus.textContent = "00:00";

  if (audioVoz) {
    audioVoz.currentTime = 0;
    audioVoz.play().catch(() => {});
  }

  cronometroLigacao = setInterval(() => {
    segundosLigacao++;
    const min = String(Math.floor(segundosLigacao / 60)).padStart(2, "0");
    const seg = String(segundosLigacao % 60).padStart(2, "0");
    ligacaoStatus.textContent = `${min}:${seg}`;
  }, 1000);
});

if (audioVoz) {
  audioVoz.addEventListener("ended", () => {
    clearInterval(cronometroLigacao);
    ligacaoStatus.textContent = "Chamada encerrada";
    setTimeout(encerrarLigacao, 900);
  });
}

btnDesligar.addEventListener("click", encerrarLigacao);

iconesApp.forEach((icone) => {
  icone.addEventListener("click", () => {
    if (icone.dataset.app === "whatsapp") {
      telaInicial.classList.add("escondida");
      appWhatsapp.classList.remove("escondida");
      iniciarConversaWhatsapp();
    } else if (icone.dataset.app === "instagram" && appInstagram) {
      telaInicial.classList.add("escondida");
      appInstagram.classList.remove("escondida");
      iniciarInstagram();
    } else if (icone.dataset.app === "chrome" && appChrome) {
      telaInicial.classList.add("escondida");
      appChrome.classList.remove("escondida");
      iniciarChrome();

      } else if (icone.dataset.app === "notas" && appNotas) {
      telaInicial.classList.add("escondida");
      appNotas.classList.remove("escondida");
      iniciarNotas();
    }
    }
  });
});

if (wppVoltarHome) {
  wppVoltarHome.addEventListener("click", () => {
    appWhatsapp.classList.add("escondida");
    telaInicial.classList.remove("escondida");
  });
}

if (wppForm) {
  wppForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const texto = wppInput.value.trim();
    if (!texto) return;

    adicionarMensagem(texto, "enviada");
    wppInput.value = "";
  });
}

if (btnPlayPause) {
  btnPlayPause.addEventListener("click", () => {
    tocando = !tocando;
    btnPlayPause.textContent = tocando ? "⏸" : "▶";
  });
}

/* =========================================================================
   CONTEÚDO EDITÁVEL DO INSTAGRAM
   Altere fotos (caminhos em ./images/), textos e comentários aqui.
   ========================================================================= */
const DADOS_INSTAGRAM = {
  perfil: {
    nome: "pietra moretti",
    bio: "complexada bipolar e ruiva",
    foto: "./images/foto-perfil.jpg",
    postsCount: "9",
    seguidores: "1.482",
    seguindo: "419",
    gradeFotos: [
      "./images/feed-um.jpg",
      "./images/feed-dois.jpg",
      "./images/feed-tres.jpg",
      "./images/feed-quatro.jpg",
      "./images/feed-cinco.jpg",
      "./images/feed-seis.jpg",
      "./images/feed-sete.jpg",
      "./images/feed-oito.jpg",
      "./images/feed-nove.jpg"
    ]
  },

  stories: [
    {
      nome: "Seu story",
      avatar: "./images/foto-perfil.jpg",
      foto: "./images/story-um.jpg",
  
    },
    {
      nome: "ph",
      avatar: "./images/perfil-ph.jpg",
      foto: "./images/story-dois.jpg",
    
    }
  ],

  posts: [
    {
      usuario: "pietra moretti",
      avatar: "./images/foto-perfil.jpg",
      foto: "./images/empregado.jpg",
      curtidas: 134,
      legenda: "meu empregado",
      comentario: {
        autor: "ph",
        texto: "vsf otaria"
      }
    },
    {
      usuario: "ph",
      avatar: "./images/perfil-ph.jpg",
      foto: "./images/sobremesa.jpg",
      curtidas: 219,
      legenda: "vim jantar e a sobremsa nao para de reclamar",
      comentario: {
        autor: "pietra moretti",
        texto: "KKKKKKKKKKK APAGA ISSO"
      }
    }
  ]
};

const appInstagram = document.getElementById("app-instagram");
const igVoltarHome = document.getElementById("ig-voltar-home");
const igStories = document.getElementById("ig-stories");
const igFeed = document.getElementById("ig-feed");
const igAbaFeed = document.getElementById("ig-aba-feed");
const igAbaPerfil = document.getElementById("ig-aba-perfil");
const igTabFeed = document.getElementById("ig-tab-feed");
const igTabPerfil = document.getElementById("ig-tab-perfil");

const igStoryModal = document.getElementById("ig-story-modal");
const igStoryAvatar = document.getElementById("ig-story-avatar");
const igStoryNome = document.getElementById("ig-story-nome");
const igStoryImg = document.getElementById("ig-story-img");
const igStoryLegenda = document.getElementById("ig-story-legenda");
const igFecharStory = document.getElementById("ig-fechar-story");

let instagramIniciado = false;

function iniciarInstagram() {
  if (instagramIniciado || !appInstagram) return;
  instagramIniciado = true;

  // Renderizar Stories
  DADOS_INSTAGRAM.stories.forEach((story) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.classList.add("ig-story-item");
    btn.innerHTML = `
      <div class="ig-story-anel">
        <img src="${story.avatar}" alt="${story.nome}">
      </div>
      <span>${story.nome}</span>
    `;

    btn.addEventListener("click", () => {
      igStoryAvatar.src = story.avatar;
      igStoryNome.textContent = story.nome;
      igStoryImg.src = story.foto;
      igStoryLegenda.textContent = story.legenda;
      igStoryModal.classList.remove("escondida");
    });

    igStories.appendChild(btn);
  });

  // Renderizar Feed
  DADOS_INSTAGRAM.posts.forEach((post) => {
    const article = document.createElement("article");
    article.classList.add("ig-post");

    let curtido = false;
    let total = post.curtidas;

    article.innerHTML = `
      <div class="ig-post-topo">
        <img src="${post.avatar}" alt="${post.usuario}" class="ig-post-avatar">
        <strong class="ig-post-user">${post.usuario}</strong>
      </div>
      <img src="${post.foto}" alt="Post" class="ig-post-foto">
      <div class="ig-post-acoes">
        <button type="button" class="ig-btn-like">♡</button>
      </div>
      <div class="ig-post-info">
        <strong class="ig-curtidas-txt">${total} curtidas</strong>
        <p><strong>${post.usuario}</strong> ${post.legenda}</p>
        ${post.comentario ? `<p class="ig-comentario"><strong>${post.comentario.autor}</strong> ${post.comentario.texto}</p>` : ""}
      </div>
    `;

    const btnLike = article.querySelector(".ig-btn-like");
    const txtCurtidas = article.querySelector(".ig-curtidas-txt");

    btnLike.addEventListener("click", () => {
      curtido = !curtido;
      total += curtido ? 1 : -1;
      btnLike.classList.toggle("curtido", curtido);
      btnLike.textContent = curtido ? "♥" : "♡";
      txtCurtidas.textContent = `${total} curtidas`;
    });

    igFeed.appendChild(article);
  });

  // Preencher Perfil
  const p = DADOS_INSTAGRAM.perfil;
  document.getElementById("ig-perfil-foto").src = p.foto;
  document.getElementById("ig-perfil-nome").textContent = p.nome;
  document.getElementById("ig-perfil-texto").textContent = p.bio;
  document.getElementById("ig-num-posts").textContent = p.postsCount;
  document.getElementById("ig-num-seguidores").textContent = p.seguidores;
  document.getElementById("ig-num-seguindo").textContent = p.seguindo;

  const grade = document.getElementById("ig-perfil-grade");
  p.gradeFotos.forEach((src) => {
    const img = document.createElement("img");
    img.src = src;
    img.alt = "Foto do perfil";
    grade.appendChild(img);
  });
}

if (igFecharStory) {
  igFecharStory.addEventListener("click", () => {
    igStoryModal.classList.add("escondida");
  });
}

if (igTabFeed && igTabPerfil) {
  igTabFeed.addEventListener("click", () => {
    igAbaPerfil.classList.add("escondida");
    igAbaFeed.classList.remove("escondida");
    igTabFeed.classList.add("ativo");
    igTabPerfil.classList.remove("ativo");
  });

  igTabPerfil.addEventListener("click", () => {
    igAbaFeed.classList.add("escondida");
    igAbaPerfil.classList.remove("escondida");
    igTabPerfil.classList.add("ativo");
    igTabFeed.classList.remove("ativo");
  });
}

if (igVoltarHome && appInstagram) {
  igVoltarHome.addEventListener("click", () => {
    appInstagram.classList.add("escondida");
    telaInicial.classList.remove("escondida");
  });
}
/* =========================================================================
   PESQUISAS RECENTES DO CHROME (EDITÁVEL)
   ========================================================================= */
const PESQUISAS_CHROME = [
  "como terminar um namoro sem se sentir culpada",
  "minha namorada é ausente oq fazer",
  "como parar de sentir atração pelo melhor amigo",
  "buzzfeed teste tenho bipolaridade ou não?"
];

const appChrome = document.getElementById("app-chrome");
const chrListaPesquisas = document.getElementById("chr-lista-pesquisas");
const chrVoltarHome = document.getElementById("chr-voltar-home");
let chromeIniciado = false;

function iniciarChrome() {
  if (chromeIniciado || !chrListaPesquisas) return;
  chromeIniciado = true;

  PESQUISAS_CHROME.forEach((termo) => {
    const li = document.createElement("li");
    li.classList.add("chr-item");
    li.innerHTML = `<span class="chr-relogio">🕒</span><span>${termo}</span>`;
    chrListaPesquisas.appendChild(li);
  });
}

if (chrVoltarHome && appChrome) {
  chrVoltarHome.addEventListener("click", () => {
    appChrome.classList.add("escondida");
    telaInicial.classList.remove("escondida");
  });
}

function iniciarChrome() {
  if (chromeIniciado || !chrListaPesquisas) return;
  chromeIniciado = true;

  const inputBusca = document.getElementById("chr-input-busca");

  PESQUISAS_CHROME.forEach((termo) => {
    const li = document.createElement("li");
    li.classList.add("chr-item");
    li.innerHTML = `
      <span class="chr-relogio">🕒</span>
      <span class="chr-texto-termo">${termo}</span>
      <span class="chr-seta-preencher">↖</span>
    `;

    li.addEventListener("click", () => {
      if (inputBusca) inputBusca.value = termo;
    });

    chrListaPesquisas.appendChild(li);
  });
}

/* =========================================================================
   NOTAS DO CELULAR (EDITÁVEL)
   ========================================================================= */
const NOTAS_CELULAR = [
  {
    titulo: "Pra você",
    data: "Hoje às 03:12",
    texto: "Eu não sei disfarçar quando o assunto é você. Pode fingir que tá tudo normal, mas a gente sabe o que ficou no ar."
  }
];

const appNotas = document.getElementById("app-notas");
const ntsVoltarHome = document.getElementById("nts-voltar-home");
const ntsListaView = document.getElementById("nts-lista-view");
const ntsDetalheView = document.getElementById("nts-detalhe-view");
const ntsLista = document.getElementById("nts-lista");
const ntsVoltarLista = document.getElementById("nts-voltar-lista");
let notasIniciadas = false;

function iniciarNotas() {
  if (notasIniciadas || !ntsLista) return;
  notasIniciadas = true;

  NOTAS_CELULAR.forEach((nota) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.classList.add("nts-item");
    btn.innerHTML = `
      <strong>${nota.titulo}</strong>
      <span>${nota.data} — ${nota.texto}</span>
    `;

    btn.addEventListener("click", () => {
      document.getElementById("nts-data").textContent = nota.data;
      document.getElementById("nts-nota-titulo").textContent = nota.titulo;
      document.getElementById("nts-nota-texto").textContent = nota.texto;
      ntsListaView.classList.add("escondida");
      ntsDetalheView.classList.remove("escondida");
    });

    ntsLista.appendChild(btn);
  });
}

if (ntsVoltarLista) {
  ntsVoltarLista.addEventListener("click", () => {
    ntsDetalheView.classList.add("escondida");
    ntsListaView.classList.remove("escondida");
  });
}

if (ntsVoltarHome && appNotas) {
  ntsVoltarHome.addEventListener("click", () => {
    appNotas.classList.add("escondida");
    telaInicial.classList.remove("escondida");
  });
}