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

        mensagem.style.color = "#7f0606";

        return;
    }

    // VERIFICAR SE USUÁRIO JÁ EXISTE
    for(let i = 0; i < administradores.length; i++){

        if(administradores[i].usuario === usuario){

            mensagem.innerText =
            "Usuário já cadastrado";
            mensagem.style.color = "#7f0606";

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

    mensagem.style.color = "#FFF1CA";
}