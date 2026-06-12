let administradores = [];

console.log("✅ admin.js foi carregado");

// Função para gerar código permanente único (6 dígitos)
function gerarCodigoPermanente() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

window.executarCadastro = async function(){

    console.log("🚀 Função executarCadastro() foi chamada!");

    let usuario =
    document.getElementById("usuario").value;

    let email =
    document.getElementById("email").value;

    let senha =
    document.getElementById("senha").value;

    let mensagem =
    document.getElementById("mensagem");

    console.log("1️⃣ Capturando valores do formulário:");
    console.log("   - usuario:", usuario, usuario === "" ? "❌ VAZIO" : "✅ OK");
    console.log("   - email:", email, email === "" ? "❌ VAZIO" : "✅ OK");
    console.log("   - senha:", senha ? "✅ OK" : "❌ VAZIO");

    // VALIDAR CAMPOS
    if(usuario === "" || email === "" || senha === ""){

        console.error("❌ ERRO: Campos vazios");
        mensagem.innerText =
        "Preencha todos os campos";

        mensagem.style.color = "#ffffff";
        mensagem.style.backgroundColor = "#2D4F2B";
        mensagem.style.height = "30px";
        mensagem.style.borderRadius = "7px";
        return;
    }

    console.log("2️⃣ Validação de campos ✅ PASSOU");

    // VALIDAR EMAIL
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!regexEmail.test(email)){

        console.error("❌ ERRO: Email inválido -", email);
        mensagem.innerText =
        "Email inválido";

        mensagem.style.color = "#ffffff";
        mensagem.style.backgroundColor = "#2D4F2B";
        mensagem.style.height = "30px";
        mensagem.style.borderRadius = "7px";

        return;
    }

    console.log("3️⃣ Validação de email ✅ PASSOU");

    // VERIFICAR SE USUÁRIO JÁ EXISTE
    for(let i = 0; i < administradores.length; i++){

        if(administradores[i].usuario === usuario){

            console.error("❌ ERRO: Usuário já cadastrado -", usuario);
            mensagem.innerText =
            "Usuário já cadastrado";
            mensagem.style.color = "#ffffff";
            mensagem.style.backgroundColor = "#2D4F2B";
            mensagem.style.height = "30px";
            mensagem.style.borderRadius = "7px";

            return;
        }
    }

    console.log("4️⃣ Verificação de usuário duplicado ✅ PASSOU");

    // GERAR CÓDIGO PERMANENTE
    const codigoPermanente = gerarCodigoPermanente();
    console.log("5️⃣ Código permanente gerado: [OCULTO]");

    // CADASTRAR NO FIREBASE
    try {
        console.log("6️⃣ Iniciando cadastro no Firebase...");
        console.log("   - usuario:", usuario);
        console.log("   - email:", email);
        console.log("   - codigoPermanente:", codigoPermanente);
        
        // Verificar se a função existe
        if(typeof window.cadastrarAdministrador !== 'function') {
            throw new Error("❌ window.cadastrarAdministrador não está definida!");
        }
        
        console.log("7️⃣ Chamando window.cadastrarAdministrador() do Firebase...");
        const resultado = await window.cadastrarAdministrador(usuario, email, senha, codigoPermanente);
        
        console.log("8️⃣ Resposta do Firebase:", resultado);
        
        if(resultado.sucesso){
            
            console.log("9️⃣ ✅ SUCESSO NO FIREBASE!");
            // CADASTRAR LOCALMENTE
            administradores.push({
                usuario: usuario,
                email: email,
                senha: senha,
                codigo: codigoPermanente,
                dataCadastro: new Date().toLocaleString("pt-BR")
            });

            // MENSAGEM SUCESSO
            mensagem.innerText =
            `Usuário ${usuario} cadastrado com sucesso!`;

            mensagem.style.color = "#D28F01";
            mensagem.style.backgroundColor = "#2D4F2B";
            mensagem.style.padding = "6px";
            mensagem.style.height = "auto";
            mensagem.style.borderRadius = "7px";

            // LIMPAR CAMPOS
            document.getElementById("usuario").value = "";
            document.getElementById("email").value = "";
            document.getElementById("senha").value = "";

        } else {
            console.error("❌ ERRO NO FIREBASE:", resultado.erro);
            mensagem.innerText =
            "Erro ao cadastrar: " + resultado.erro;

            mensagem.style.color = "#ffffff";
            mensagem.style.backgroundColor = "#8B0000";
            mensagem.style.height = "30px";
            mensagem.style.borderRadius = "7px";
        }

    } catch(error) {
        console.error("❌ ERRO NA REQUISIÇÃO:", error.message);
        console.error("Stack:", error.stack);
        mensagem.innerText =
        "Erro ao conectar com o servidor";

        mensagem.style.color = "#ffffff";
        mensagem.style.backgroundColor = "#8B0000";
        mensagem.style.height = "30px";
        mensagem.style.borderRadius = "7px";
        console.error(error);
    }
};

console.log("✅ window.executarCadastro foi registrada!");

// Função para alternar a visibilidade da senha (Olho aberto / fechado)
window.MostrarSenha = function() {
    const senha = document.getElementById("senha");
    const icone = document.getElementById("iconeSenha");

    if (senha.type === "text") {
        senha.type = "password";
        icone.classList.remove("fa-eye");
        icone.classList.add("fa-eye-slash");
    } else {
        senha.type = "text";
        icone.classList.remove("fa-eye-slash");
        icone.classList.add("fa-eye");
    }
};

console.log("✅ window.MostrarSenha foi registrada!");
