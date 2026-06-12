// ==========================================
// 1. IMPORTAÇÕES DOS MÓDULOS DO FIREBASE
// ==========================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-analytics.js";

import { 
    getAuth, 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updatePassword 
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";

import { 
    getDatabase, 
    ref, 
    set, 
    get,
    update,
    query,
    orderByChild,
    equalTo
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-database.js";

// ==========================================
// 2. CONFIGURAÇÃO E INICIALIZAÇÃO
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

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const database = getDatabase(app);

console.log("✅ Firebase inicializado com sucesso");

// Fazer as funções GLOBAIS de forma segura
console.log("📝 Registrando funções globais...");

if (typeof window !== 'undefined') {
    console.log("✅ window existe, registrando funções...");
} else {
    console.error("❌ window não está disponível!");
}

// Função auxiliar para gerar o token de 6 dígitos
function gerarCodigoSeisDigitos() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// ==========================================
// 3. FUNÇÕES GLOBAIS (RECEBEM PARÂMETROS DIRETO)
// ==========================================

/**
 * CADASTRO COMPLETO COM CÓDIGO PERMANENTE
 * Chame assim: window.cadastrarAdministrador("nomeUsuario", "email@exemplo.com", "senha123", "codigoPermanente");
 */
window.cadastrarAdministrador = async function(usuario, email, senha, codigoPermanente) {
    console.log("🔍 Parâmetros recebidos:", {usuario, email, codigoPermanente});
    
    if (!usuario || !email || !senha || !codigoPermanente) {
        console.error("❌ Erro: Faltam parâmetros");
        console.error("  - usuario:", usuario || "VAZIO");
        console.error("  - email:", email || "VAZIO");
        console.error("  - senha:", senha ? "ok" : "VAZIO");
        console.error("  - codigoPermanente:", codigoPermanente || "VAZIO");
        return { sucesso: false, erro: "parametros_obrigatorios" };
    }
    
    const emailLimpo = email.trim().toLowerCase();

    try {
        console.log("🔐 Criando usuário no Firebase Auth...");
        const userCredential = await createUserWithEmailAndPassword(auth, emailLimpo, senha);
        const user = userCredential.user;
        
        console.log("💾 Salvando dados no Realtime Database...");
        await set(ref(database, 'administradores/' + user.uid), {
            usuario: usuario,
            email: emailLimpo,
            senha: senha,
            codigoPermanente: codigoPermanente,
            dataCadastro: new Date().toLocaleString("pt-BR"),
            uidFirebase: user.uid
        });

        console.log(`✅ [Sucesso] Usuário ${usuario} (${emailLimpo}) cadastrado com código: [OCULTO]`);
        return { sucesso: true, uid: user.uid, codigo: codigoPermanente };

    } catch (error) {
        console.error("❌ Erro no cadastro:", error.message);
        console.error("   Código do erro:", error.code);
        return { sucesso: false, erro: error.code };
    }
};

console.log("✅ window.cadastrarAdministrador foi registrada!");

/**
 * CADASTRO DIRETO (compatibilidade com versão anterior)
 * Chame assim: window.cadastrar("usuario@email.com", "senha123");
 */
window.cadastrar = async function(email, senha) {
    if (!email || !senha) {
        console.error("Erro: E-mail e senha são obrigatórios para o cadastro.");
        return;
    }
    
    const emailLimpo = email.trim().toLowerCase();

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, emailLimpo, senha);
        const user = userCredential.user;
        
        await set(ref(database, 'administradores/' + user.uid), {
            email: emailLimpo,
            senha: senha,
            dataCadastro: new Date().toLocaleString("pt-BR")
        });

        console.log(`[Sucesso] Usuário ${emailLimpo} cadastrado.`);
        return { sucesso: true, uid: user.uid };

    } catch (error) {
        console.error("Erro no cadastro:", error.message);
        return { sucesso: false, erro: error.code };
    }
};

console.log("✅ window.cadastrar foi registrada!");

/**
 * PASSO 1: GERAR CÓDIGO DE TROCA
 * Chame assim: const codigo = await window.solicitarTrocaSenha("usuario@email.com");
 * Retorna o código de 6 dígitos para você usar na sua automação ou envio.
 */
window.solicitarTrocaSenha = async function(email) {
    if (!email) {
        console.error("Erro: É necessário informar o e-mail.");
        return null;
    }

    const emailLimpo = email.trim().toLowerCase();

    try {
        const dbRef = ref(database, 'administradores');
        const consulta = query(dbRef, orderByChild('email'), equalTo(emailLimpo));
        const snapshot = await get(consulta);

        if (snapshot.exists()) {
            const uids = Object.keys(snapshot.val());
            const uidUsuario = uids[0];

            const codigoTroca = gerarCodigoSeisDigitos();

            // Salva o código de 6 dígitos no banco
            await update(ref(database, 'administradores/' + uidUsuario), {
                codigoRecuperacao: codigoTroca
            });

            console.log(`[Código Gerado] Envie para ${emailLimpo}: ${codigoTroca}`);
            return codigoTroca; // Retorna o código gerado para o seu fluxo coletar

        } else {
            console.error("Erro: E-mail não encontrado no banco de dados.");
            return null;
        }
    } catch (error) {
        console.error("Erro ao gerar código:", error.message);
        return null;
    }
};

/**
 * PASSO 2: CONFIRMAR A TROCA DE SENHA
 * Chame assim: window.confirmarTrocaSenha("usuario@email.com", "senhaAntiga", "123456", "novaSenha123");
 */
window.confirmarTrocaSenha = async function(email, senhaAtual, codigoRecebido, novaSenha) {
    if (!email || !senhaAtual || !codigoRecebido || !novaSenha) {
        console.error("Erro: Todos os parâmetros são obrigatórios para a troca de senha.");
        return false;
    }

    const emailLimpo = email.trim().toLowerCase();

    try {
        // 1. Autentica o usuário com a credencial atual
        const userCredential = await signInWithEmailAndPassword(auth, emailLimpo, senhaAtual);
        const user = userCredential.user;

        // 2. Puxa os dados do banco
        const snapshot = await get(ref(database, 'administradores/' + user.uid));
        
        if (snapshot.exists()) {
            const dadosDoBanco = snapshot.val();

            // 3. Valida o código de 6 dígitos enviado por parâmetro
            if (dadosDoBanco.codigoRecuperacao && dadosDoBanco.codigoRecuperacao === codigoRecebido.toString()) {
                
                // 4. Aplica a nova senha no Auth
                await updatePassword(user, novaSenha);

                // 5. Atualiza no Realtime Database e limpa o token
                await update(ref(database, 'administradores/' + user.uid), {
                    senha: novaSenha,
                    codigoRecuperacao: null 
                });

                console.log(`[Sucesso] Senha alterada para o e-mail: ${emailLimpo}`);
                await auth.signOut(); 
                return true;
            } else {
                console.error("Erro: Código de segurança inválido.");
                await auth.signOut();
                return false;
            }
        }
    } catch (error) {
        console.error("Erro na validação da troca de senha:", error.message);
        return false;
    }
};