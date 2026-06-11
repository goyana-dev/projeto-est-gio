// bd/firebase.js
// ==========================================
// 1. IMPORTAÇÕES DOS MÓDULOS DO FIREBASE
// ==========================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-analytics.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";
import {
    getDatabase,
    ref,
    set
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-database.js";

// ==========================================
// 2. CONFIGURAÇÃO DO FIREBASE
// ==========================================
const firebaseConfig = {
    apiKey: "AIzaSyDY0MUFqLNdikiBYeIlPPEYvCl-1AOkTh4",
    authDomain: "projeto-estagio-6be49.firebaseapp.com",
    projectId: "projeto-estagio-6be49",
    storageBucket: "projeto-estagio-6be49.firebasestorage.app",
    messagingSenderId: "163566937029",
    appId: "1:163566937029:web:a3da954efaab039ef261ac",
    measurementId: "G-P455NRXN24"
};

// ==========================================
// 3. INICIALIZAÇÃO DOS SERVIÇOS
// ==========================================
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const database = getDatabase(app);

// ==========================================
// 4. FUNÇÃO DE CADASTRO / LOGIN (INTACTA)
// ==========================================
window.cadastrar = async function () {
    const usuario = document.getElementById("usuario").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;
    const mensagem = document.getElementById("mensagem");

    if (!usuario || !email || !senha) {
        mensagem.innerText = "Preencha usuário, e-mail e senha.";
        mensagem.style.color = "#ffffff";
        mensagem.style.backgroundColor = "#b32424";
        mensagem.style.padding = "6px";
        mensagem.style.borderRadius = "7px";
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
        const user = userCredential.user;

        await set(ref(database, "administradores/" + user.uid), {
            usuario: usuario,
            email: email,
            uid: user.uid,
            dataCadastro: new Date().toLocaleString("pt-BR")
        });

        mensagem.innerText = `Usuário ${usuario} cadastrado com sucesso!`;
        mensagem.style.color = "#D28F01";
        mensagem.style.backgroundColor = "#2D4F2B";
        mensagem.style.padding = "6px";
        mensagem.style.borderRadius = "7px";

        document.getElementById("usuario").value = "";
        document.getElementById("email").value = "";
        document.getElementById("senha").value = "";

        setTimeout(() => { window.location.href = "../../index.html"; }, 2000);

    } catch (error) {
        console.log(error);

        if (error.code === "auth/email-already-in-use") {
            try {
                await signInWithEmailAndPassword(auth, email, senha);
                mensagem.innerText = "Login realizado com sucesso!";
                mensagem.style.color = "#D28F01";
                mensagem.style.backgroundColor = "#2D4F2B";
                mensagem.style.padding = "6px";
                mensagem.style.borderRadius = "7px";

                setTimeout(() => { window.location.href = "../../index.html"; }, 2000);
            } catch (loginError) {
                if (loginError.code === "auth/wrong-password" || loginError.code === "auth/invalid-credential") {
                    mensagem.innerText = "E-mail existe, mas a senha está incorreta.";
                } else {
                    mensagem.innerText = loginError.message;
                }
                mensagem.style.color = "#ffffff";
                mensagem.style.backgroundColor = "#b32424";
                mensagem.style.padding = "6px";
                mensagem.style.borderRadius = "7px";
            }
        } else if (error.code === "auth/weak-password") {
            mensagem.innerText = "A senha deve possuir pelo menos 6 caracteres.";
            mensagem.style.color = "#ffffff";
            mensagem.style.backgroundColor = "#b32424";
            mensagem.style.padding = "6px";
            mensagem.style.borderRadius = "7px";
        } else if (error.code === "auth/invalid-email") {
            mensagem.innerText = "Digite um e-mail válido.";
            mensagem.style.color = "#ffffff";
            mensagem.style.backgroundColor = "#b32424";
            mensagem.style.padding = "6px";
            mensagem.style.borderRadius = "7px";
        } else {
            mensagem.innerText = "Erro: " + error.message;
            mensagem.style.color = "#ffffff";
            mensagem.style.backgroundColor = "#b32424";
            mensagem.style.padding = "6px";
            mensagem.style.borderRadius = "7px";
        }
    }
};

// ==========================================
// 5. FUNÇÃO DE RECUPERAÇÃO DE SENHA
// ==========================================
window.recuperarSenha = async function () {
    const email = document.getElementById("emailRecuperacao").value.trim();
    const mensagem = document.getElementById("mensagem");

    if (!email) {
        mensagem.innerText = "Digite seu e-mail para recuperar a senha.";
        aplicarEstiloErro(mensagem);
        return;
    }

    try {
        const codigoVerificacao = Math.floor(100000 + Math.random() * 900000).toString();
        const emailChave = email.replace(/\./g, ','); 
        
        await set(ref(database, 'recuperacoes/' + emailChave), {
            codigo: codigoVerificacao,
            timestamp: Date.now()
        });

        const response = await fetch("/api/enviar-codigo", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email, codigo: codigoVerificacao })
        });

        const dados = await response.json();

        if (response.ok) {
            mensagem.innerText = "Código enviado com sucesso!";
            aplicarEstiloSucesso(mensagem);

            // Ajustado para redirecionar corretamente para codigo.html
            setTimeout(() => {
                window.location.href = "codigo.html?email=" + encodeURIComponent(email);
            }, 2000);
        } else {
            throw new Error(dados.error || "Erro ao enviar e-mail.");
        }

    } catch (error) {
        console.error(error);
        mensagem.innerText = error.message;
        aplicarEstiloErro(mensagem);
    }
};

function aplicarEstiloErro(elemento) {
    elemento.style.color = "#ffffff";
    elemento.style.backgroundColor = "#b32424";
    elemento.style.padding = "6px";
    elemento.style.borderRadius = "7px";
}

function aplicarEstiloSucesso(elemento) {
    elemento.style.color = "#D28F01";
    elemento.style.backgroundColor = "#2D4F2B";
    elemento.style.padding = "6px";
    elemento.style.borderRadius = "7px";
}