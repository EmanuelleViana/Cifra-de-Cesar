/*****************************************************************************
 *  Criptografia de Júlio César 
 *   (Essa criptografia se baseia na substituição da letra do alfabeto avançado um determinado número de casas.)
 *  1. As mensagens serão convertidas para minúsculas tanto para a criptografia quanto para descriptografia.
 *  2. Os números e pontos serão mantidos
 *  @author Emanuelle Viana Evangelista
 *  Linkedin: https://www.linkedin.com/in/emanuelle-viana/
 *  Github: https://github.com/EmanuelleViana
 *******************************************************************
 */
var token = "b0de898a0ca11b81730df3eac38fe53c6f8f7bcf";
var url = "https://api.codenation.dev/v1/challenge/dev-ps/generate-data?token=" + token;
var submitUrl = "https://api.codenation.dev/v1/challenge/dev-ps/submit-solution?token=" + token;

var sha1 = require('sha1');
var FormData = require('form-data');
var axios = require('axios');
var fs = require('fs');

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var xhttp = new XMLHttpRequest();

xhttp.open("GET", url, false);
xhttp.send();

var jsonDesafio = xhttp.responseText;
var dados = JSON.parse(jsonDesafio);

function isLetter(caractere) {
    return caractere >= 'a' && caractere <= 'z';
}

function decifrar(textoCifrado, numCasas) {
    var resultado = [...textoCifrado.toLowerCase()].map(caractere => {
      
        if (isLetter(caractere) && caractere !== 'a') {
            return String.fromCharCode(caractere.charCodeAt(0) - numCasas)
        } else if(caractere == 'a') {
            return String.fromCharCode('z'.charCodeAt(0) - (numCasas - 1));
        } else {
            return caractere
        }
    });
    return resultado.join('');
}

function writeJSONToFile(json, nomeArquivo) {
    fs.writeFileSync(nomeArquivo, JSON.stringify(json));
}

function convertJSONFileToFormData(nomeArquivo) {
    var formData = new FormData();
    const file = fs.createReadStream(nomeArquivo);
    formData.append('answer', file);
    return formData;
}

/* Decifrar texto e adicionar SHA1 */
let textoDecifrado = decifrar(dados.cifrado, dados.numero_casas);
dados.decifrado = textoDecifrado;
dados.resumo_criptografico = sha1(dados.decifrado);

/* Atualizar arquivo de resposta */
writeJSONToFile(dados, 'answer.json' );
var formData = convertJSONFileToFormData('answer.json');

/* Enviar resposta */
axios.post(submitUrl, formData, { headers: formData.getHeaders() })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
});