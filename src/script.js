let UID = '';

// Função para abrir o modal
function openModal() {
    document.getElementById('modal').style.display = 'block';
}

// Função para fechar o modal
function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

async function handleRemoveUser(element) {
    // Pega o valor do atributo 'key' do botão clicado
    const id = element.getAttribute('userID');

    try {
        // Faz a requisição DELETE passando o UID no corpo
        const response = await fetch("http://localhost:3333/api/users", {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id }), // Passa o UID no corpo da requisição
        });

        // Verifica se a requisição foi bem-sucedida
        if (response.ok) {
            console.log("Usuário removido com sucesso!");
            fetchUsuarios(); // Atualiza a lista de usuários após a remoção
        } else {
            console.error("Erro ao remover usuário:", response.statusText);
        }
    } catch (error) {
        console.error("Erro ao enviar requisição:", error);
    }
}

// Função para buscar usuários
async function fetchUsuarios() {
    try {
        const response = await fetch("http://localhost:3333/api/users");
        const data = await response.json();
        const listaUsuarios = document.getElementById("lista_de_usuarios");

        // Limpar a lista atual antes de adicionar novos itens
        listaUsuarios.innerHTML = "";

        if (data.users.length === 0) {
            const li = document.createElement("li");
            li.innerHTML = `<div class="card_user">  
                                Nenhum usuário cadastrado.
                            </div>`
            listaUsuarios.appendChild(li);
            listaUsuarios.appendChild(li);
        } else {
          // Adicionar cada usuário à lista
            data.users.forEach(usuario => {
            const li = document.createElement("li");
            li.innerHTML = `<div class="card_user">  
                                <h3>${usuario.name}</h3>
                                <p>CPF: ${usuario.cpf}</p>
                                <p>UID: ${usuario.UID}</p>
                                <button class="btn-remover-usuario" onclick="handleRemoveUser(this)" userID="${usuario.id}">Remover</button>
                            </div>`
            listaUsuarios.appendChild(li);
            });  
        }

        
    } catch (error) {
        console.error("Erro ao buscar usuários:", error);
    }
}

// Inicializar a lista de usuários
fetchUsuarios();

// Configurar o Electron IPC
const { ipcRenderer } = require('electron');
const UID_campo = document.getElementById('UID');

ipcRenderer.on('frid', (event, value) => {
    UID_campo.innerText = value.substring(5);
    UID = value.substring(5);
    console.log(UID);
});

// Adicionar evento para abrir o modal
document.getElementById('open-modal').addEventListener('click', openModal);

// Adicionar evento para fechar o modal
document.getElementById('close-modal').addEventListener('click', closeModal);

// Adicionar evento para enviar o formulário
const formCadastro = document.getElementById('formCadastro');

formCadastro.addEventListener('submit', async function (event) {
    event.preventDefault(); // Evita que o formulário recarregue a página

    const name = document.getElementById('name').value;
    const cpf = document.getElementById('cpf').value;
    const user = { name, cpf, UID };

    try {
        const response = await fetch("http://localhost:3333/api/users", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });

        if (response.ok) {
            console.log("Usuário cadastrado com sucesso!");
            fetchUsuarios(); // Atualiza a lista de usuários após o cadastro
            closeModal(); // Fecha o modal após o cadastro
        } else {
            console.error("Erro ao cadastrar usuário:", response.statusText);
        }
    } catch (error) {
        console.error("Erro ao enviar requisição:", error);
    }
});
