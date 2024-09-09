const {app, BrowserWindow} = require('electron')

const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

const port = new SerialPort({ path: 'COM6', baudRate: 9600 }); // Substitua COM6 pelo número correto
const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

function createWindow () {
    const win = new BrowserWindow({
        width: 600, height: 600, webPreferences: {
            nodeIntegration: true,
            contextIsolation: false, // Recomenda-se ativar por razões de segurança
        }
    })
    win.loadFile('./src/index.html')
    // win.loadURL('https://youtube.com/')
    // win.webContents.openDevTools()
    win.once('ready-to-show', () => {
        win.show()
    })

    // Quando receber dados do Arduino
    parser.on('data', (data) => {
        console.log(`Cartão RFID lido: ${data}`);

        win.webContents.send('frid', data)
        
        // Adicione lógica aqui para enviar os dados para a aplicação Node.js
        // Por exemplo, usando fetch, axios, ou outro método para fazer um POST para a sua API REST
    });
}


//whenReady, quando nosso app estiver pronto pra rodar... ele retorna essa promise e a gente ativa a função no then.
app.whenReady()
    .then(() => {
        createWindow()
    })
    .catch((error) => {
        console.log('houve um erro.', error)
    })


// Log para indicar que a aplicação está esperando por novos cartões
console.log('Esperando pela leitura do cartão RFID...');

// Quando receber dados do Arduino
parser.on('data', (data) => {
    console.log(`Cartão RFID lido: ${data}`);
    
    // Adicione lógica aqui para enviar os dados para a aplicação Node.js
    // Por exemplo, usando fetch, axios, ou outro método para fazer um POST para a sua API REST
});