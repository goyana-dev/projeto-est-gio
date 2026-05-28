let administradores = [];

function cadastrarAdministrador(){

    let usuario =
    document.getElementById("usuario").value;

    let senha =
    document.getElementById("senha").value;

    let mensagem =
    document.getElementById("mensagem");

    // VALIDAR CAMPOS
    if(usuario === "" || senha === ""){

        mensagem.innerText =
        "Preencha todos os campos";

        mensagem.style.color = "#ffffff";
        mensagem.style.backgroundColor = "#2D4F2B";
        mensagem.style.height = "30px";
        mensagem.style.borderRadius = "7px";
        return;
    }

    // VERIFICAR SE USUÁRIO JÁ EXISTE
    for(let i = 0; i < administradores.length; i++){

        if(administradores[i].usuario === usuario){

            mensagem.innerText =
            "Usuário já cadastrado";
            mensagem.style.color = "#ffffff";
            mensagem.style.backgroundColor = "#2D4F2B";
            mensagem.style.height = "30px";
            mensagem.style.borderRadius = "7px";

            return;
        }
    }

    // CADASTRAR
    administradores.push({

        usuario: usuario,

        senha: senha
    });

    // MENSAGEM SUCESSO
    mensagem.innerText =
    `Usuário ${usuario} cadastrado com sucesso`;

    mensagem.style.color = "#D28F01";
    mensagem.style.backgroundColor = "#2D4F2B";
    mensagem.style.padding = "6px";
    mensagem.style.height = "30px";
    mensagem.style.borderRadius = "7px";
}
function MostrarSenha(){

    const senha = document.getElementById("senha");

    const icone = document.getElementById("iconeSenha");

    if(senha.type === "text"){

        senha.type = "password";

        icone.classList.remove("fa-eye");

        icone.classList.add("fa-eye-slash");

    }else{

        senha.type = "text";

        icone.classList.remove("fa-eye-slash");

        icone.classList.add("fa-eye");
    }
}