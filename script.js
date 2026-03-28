let jogadorAtual = "X";
let tabuleiro = ["", "", "", "", "", "", "", "", ""];
let posicaoEscolhida = null;
let num1, num2;
let modoJogo = "PvP";

document.getElementById("modoJogo").addEventListener("change", (e) => {
    modoJogo = e.target.value;
});
    
let pontosX = 0; 
let pontosO = 0;
pontosX = parseInt(localStorage.getItem("pontosX")) || 0;
pontosO = parseInt(localStorage.getItem("pontosO")) || 0;

function criarTabuleiro() {
    const tabuleiroHTML = document.getElementById("tabuleiro");

    tabuleiroHTML.innerHTML = ""; // limpa (importante)

    for (let i = 0; i < 9; i++) {
        const celula = document.createElement("button");
        celula.classList.add("celula");
        celula.onclick = () => escolherPosicao(i);
        tabuleiroHTML.appendChild(celula);
    }
}

// gerar nova pergunta
function gerarPergunta(isComputador = false) {
    num1 = Math.floor(Math.random() *10) + 1;
    num2 = Math.floor(Math.random() *10) +1;

    const perguntaDiv = document.getElementById("pergunta");
    perguntaDiv.innerText = `${num1} x ${num2} = ?`;
    
    if (isComputador) {
        const respostaComputador = num1 * num2;
        setTimeout(() => {
            verificarResposta(respostaComputador);
        }, 500);
      }
}

function escolherPosicao(index) {
    if (tabuleiro[index] !== "" || posicaoEscolhida !== null) return;

    const celulas = document.querySelectorAll(".celula");
    celulas.forEach(c => c.classList.remove("selecionada"));

    posicaoEscolhida = index;
    celulas[index].classList.add("selecionada");
}

function verificarResposta(resposta) {

    if(posicaoEscolhida === null) {
        alert("Escolha uma posição no tabuleiro primeiro!");
        return;
    }

const celula = document.querySelectorAll(".celula")[posicaoEscolhida];

    if (resposta === num1 * num2) {
        tabuleiro[posicaoEscolhida] = jogadorAtual;
        atualizarTabuleiro();
    celula.classList.remove("selecionada");
    celula.classList.add(jogadorAtual);

        if (verificarVitoria()) {
            if (jogadorAtual === "X") pontosX++;
             else pontosO++;

            atualizarPlacar();
            animacaoVitoria();

            document.getElementById("mensagem").innerText=
                `Jogador ${jogadorAtual} venceu!`;
                 desativarTabuleiro();
                 posicaoEscolhida = null;
                 return;
        } 
        if (verificarEmpate()) {
            document.getElementById("mensagem").innerText = "Empate!";
         desativarTabuleiro();
         posicaoEscolhida = null;
         return;
        }


    } else {
        document.getElementById("mensagem").innerText =
        `Resposta errada! Jogador ${jogadorAtual} perdeu a sua vez.`
        celula.classList.remove("selecionada");
    
    }

    posicaoEscolhida = null;
    trocarJogador();
}

function responder() {
    const campo = document.getElementById("resposta")
    const resposta = parseInt(campo.value);

    if (isNaN(resposta)) {
        document.getElementById("mensagem").innerText = "Digite uma resposta!";
    return;
    }

    verificarResposta(resposta);

    campo.value = "";
    campo.focus();
}
 document.getElementById("resposta").addEventListener("keypress", function (e){
    if(e.key === "Enter"){
        responder();
    }
 });

function atualizarPlacar() {
    const placarX = document.getElementById("pontosX");
    const placarO = document.getElementById("pontosO");
    
    placarX.innerText = pontosX;
    placarO.innerText = pontosO;

    localStorage.setItem("pontosX", pontosX);
    localStorage.setItem("pontosO", pontosO);

    const alvo = jogadorAtual === "X" ? placarX : placarO;

    alvo.classList.remove("animar");
    void alvo.offsetWidth;
    alvo.classList.add("animar");

        setTimeout(()=>{
            alvo.classList.remove("animar");
        },400);
    }

function animacaoVitoria(){
    document.body.classList.add("vitoria");

    setTimeout(()=>{
        document.body.classList.remove("vitoria");
    },1000);
}


function zerarPlacar(){
    pontosX = 0;
    pontosO = 0;

    atualizarPlacar();
}

function atualizarTabuleiro() {
    const celulas = document.querySelectorAll(".celula");
    celulas.forEach((celula, index) => {
        celula.innerText = tabuleiro[index];
    });
}

function trocarJogador() {
    jogadorAtual = jogadorAtual === "X" ? "O" : "X";

    posicaoEscolhida = null

    //se o modo for PvC e for vez do computador
    if (modoJogo === "PvC" && jogadorAtual === "O") {
            computadorResponder();
    } else {
        gerarPergunta(false);
    }
    
}

function computadorResponder() {
    // escolhe uma posição aleatória vazia
    const vazias = tabuleiro.map((val, idx) => val === "" ? idx : null).filter(v => v !== null);
    if (vazias.length === 0) return;

    let escolha = null;

    for (let i of vazias) {
        tabuleiro[i] = "O";
        if (verificarVitoria()) {escolha = i; }
        tabuleiro[i] = "";
        if (escolha !== null) break;
    }

    if (escolha === null) {
        for (let i of vazias) {
            tabuleiro[i] = "X";
            if (verificarVitoria()) { escolha = i; }
            tabuleiro[i] = "";
            if (escolha !== null) break;
        }
    }

    if (escolha === null) {
        escolha = vazias[Math.floor(Math.random() * vazias.length)];
    } 

    posicaoEscolhida = escolha;

    setTimeout(() => {
        tabuleiro[posicaoEscolhida] = jogadorAtual;
        atualizarTabuleiro();

        if (verificarVitoria()) {
            pontosO++;
            atualizarPlacar();
            document.getElementById("mensagem").innerText = "Computador venceu!";
            desativarTabuleiro();
            return;
        }

        if (verificarEmpate()) {
            document.getElementById("mensagem").innerText = "Empate!";
            desativarTabuleiro();
            return;
        }

        trocarJogador();
    }, 500);
}

function verificarVitoria() {
    const combinacoes = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];

    return combinacoes.some(comb => {
        const [a,b,c] = comb;
        return tabuleiro[a] &&
               tabuleiro[a] === tabuleiro[b] &&
               tabuleiro [a] === tabuleiro[c];
    });
}

function verificarEmpate() {
    return tabuleiro.every(celula => celula !== "");
}

function desativarTabuleiro() {
    const celulas = document.querySelectorAll(".celula");
    celulas.forEach(c => c.disabled = true);
};


// iniciar jogo
gerarPergunta();
atualizarPlacar();

// funçao reiniciar jogo
function reiniciarJogo() {
    tabuleiro = ["", "", "", "", "", "", "", "", ""];
    jogadorAtual = "X";
    posicaoEscolhida = null;

    atualizarTabuleiro();

    document.getElementById("mensagem").innerText = "";
    document.getElementById("resposta").value = "";

// reativar as células
    const celulas = document.querySelectorAll (".celula");
    celulas.forEach(c => {
        c.disabled = false;
        c.classList.remove("X", "O", "selecionada");
    });

}

criarTabuleiro();
gerarPergunta();
atualizarPlacar();
