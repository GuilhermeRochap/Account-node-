// modulos usados
const chalk = require('chalk')
const inquirer = require('inquirer')

const fs = require('fs')

console.log("Iniciando Conta Node")

operacao()

function operacao(){
    inquirer.prompt([
        {
        type: 'list',
        name: 'action',
        message: 'Como podemos ajudar?',
        choices: [
            'Criar Conta Node',
            'Consultar Saldo',
            'Depositar',
            'Sacar',
            'Sair'
        ],
    },]).then((answers) => {
        const action = answers['action']

        if(action === 'Criar Conta Node'){
            criarConta()
        }else if(action === 'Depositar'){
            depositar()
        }else if(action === 'Consultar Saldo'){

        }else if(action === 'Sacar'){

        }else if(action === 'Sair'){
            console.log(chalk.bgYellow.black.bold('Saindo do Conta Node...'))
            process.exit()
        }
    }).catch(err => console.log(err))
}

// criando conta 
function criarConta(){
    console.log(chalk.bgGreen.bold.black('Obrigado por escolher o nosso banco'))
    console.log(chalk.bgGreen.bold.black('Defina as opções da conta'))
    montandoConta()
}

function montandoConta(){
    inquirer.prompt([
        {
        name: 'contaNOME',
        message: 'Digite um nome para sua Conta'
    },
    {
        name: 'contaDIGITO',
        message: 'Digite um numero para sua Conta'
    }
]).then((answer)=>{
    const contaNome = answer['contaNOME']
    const contaDigito = answer['contaDIGITO']
    console.info(contaNome)

    if(!fs.existsSync('contas')){
        fs.mkdirSync('contas')
    }
    if(fs.existsSync(`contas/${contaNome}.json`)){
        console.log(chalk.bgRed.bold.black('ESSA CONTA JA EXISTE, ESCOLHA OUTRO NOME'),
    )
     montandoConta()
     return
    }

    fs.writeFileSync(`contas/${contaNome}.json`, `{ "balance" : 0, "Account" : ${contaDigito} }`, function(err){
        console.log(err)
            },
        )
    console.log(chalk.bgBlue.bold.white("SUCESSO NA CRIAÇÃO DE CONTA!"))
    operacao()
}).catch((err) =>{
    console.error(err)
})
}
// adicionando saldo a conta do usuario 
function depositar(){
    inquirer.prompt([{
        name: 'contaDIGITO',
        message: 'Qual o numero da sua conta?'
    }
    ]).then((answer) =>{
        const contaDigito = answer['contaDIGITO']

        // verifica se a conta existe
         if(verificaConta(contaDigito)) {
            // Se existe, continua com o depósito
             inquirer.prompt([{
        name: 'amount',
        message: 'Qual o valor do deposito?'
    }]).then((answer) =>{
        const amount = answer['amount']

        //adicionar saldo a conta
        continuarDeposito(contaDigito, amount)
        operacao()
        return

    }).catch(err => console.error(err))
        } else {
            console.log(chalk.bgRed.bold.black('Conta não encontrada!'))
            depositar()
            return
        }

    })
    .catch(err => console.error(err))
}

function verificaConta(contaDigito){
    if(!fs.existsSync('contas')){
        return null
    }

    const arquivos = fs.readdirSync('contas')
    
     for(const arquivo of arquivos) {
        if(arquivo.endsWith('.json')) {
            const caminhoArquivo = `contas/${arquivo}`
            const contaData = JSON.parse(fs.readFileSync(caminhoArquivo, 'utf-8'))
            
            // Verifica se o Account do JSON é igual ao digitado
            if(contaData.Account == contaDigito) {
                return true // Conta encontrada
            }
        }
    }
    return false
}

function continuarDeposito(contaDigito, amount){
    const conta = getConta(contaDigito)
    
    if(conta) {
        // Atualiza o saldo
        conta.balance += parseFloat(amount)
        
        // Encontra o arquivo para salvar
        const arquivos = fs.readdirSync('contas')
        for(const arquivo of arquivos) {
            if(arquivo.endsWith('.json')) {
                const caminhoArquivo = `contas/${arquivo}`
                const contaData = JSON.parse(fs.readFileSync(caminhoArquivo, 'utf-8'))
                
                if(contaData.Account == contaDigito) {
                    // Salva as alterações no arquivo correto
                    fs.writeFileSync(caminhoArquivo, JSON.stringify(conta, null, 2))
                    console.log(chalk.bgGreen.bold.black(`Depósito de R$ ${amount} realizado com sucesso!`))
                    console.log(chalk.bgBlue.bold.white(`Novo saldo: R$ ${conta.balance}`))
                    break
                }
            }
        }
    }
    
}

function getConta(contaDigito){ 
    
    const arquivos = fs.readdirSync('contas')
    
    for(const arquivo of arquivos) {
        if(arquivo.endsWith('.json')) {
            const caminhoArquivo = `contas/${arquivo}`
            const contaData = JSON.parse(fs.readFileSync(caminhoArquivo, 'utf-8'))
            
            if(contaData.Account == contaDigito) {
                const contaJSON = fs.readFileSync(caminhoArquivo, {
                    encoding: 'utf-8',
                    flag: 'r'
                })
                return JSON.parse(contaJSON)
            }
        }
    }
    return null
}