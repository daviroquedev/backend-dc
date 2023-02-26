# BACKEND DO DIGITAL COMMERCE FEITO NA DIGITAL COLLEGE - DRIP STORE 1.0.0

Este é um projeto de backend que utiliza Node.js com o framework Express e segue os princípios da arquitetura de API Restful. O objetivo deste projeto é fornecer uma base sólida de conhecimento para o desenvolvimento de uma API escalável, confiável e de fácil manutenção. Desenvolvido por alunos da Digital College.

## INTEGRANTES DA EQUIPE
<ul>
<li>Davi Roque</li>
<li>Lucas Monteiro</li>
<li>Darlan Mendes</li>
<li>Emerson Souza</li>
<li>José Antonio</li>
 <li>Antonio Rodrigues</li>
<li>Matheus Freire</li>
<li>Ivan Praciano</li>
<li>Nivea Natalia</li>
<li>Andre Soares</li>
<li>Jorge Silva</li>

</ul>


## FEATURES

<ul>
<li>Integração com Banco de Dados</li>
<li>Autenticação JWT</li>
<li>Deploy</li>
<li>Arquitetura MVC </li>
</ul>

## REQUISITOS

<p>Antes de começar, certifique-se de ter as seguintes ferramentas instaladas em sua máquina:</p>
    <ul>
      <li>Node.js</li>
      <li>NPM (gerenciador de pacotes do Node.js)</li>
    </ul>
    
## INSTALAÇÃO

<ol>
      <li>Clone o repositório em sua máquina local:</li>
      <pre><code>git clone https://github.com/daviroquedev/backend-dc.git </code></pre>
      <li>Instale as dependências do projeto:</li>
      <pre><code>npm install</code></pre>
      <li>Execute o projeto:</li>
      <pre><code>npm start</code></pre>
</ol>
 
## DOCUMENTAÇÃO 


  <p>Este projeto possui as seguintes rotas:</p>
    <ul>
      <li><code>GET /</code>: Retorna uma mensagem de boas-vindas.</li>
      <li><code>GET /produtos </code>: Retorna uma lista de todos os produtos cadastrados.</li>
      <li><code>GET /produtos/:id</code>: Retorna os dados do produto com o ID especificado.</li>
      <li><code>GET /produtos/search?palavra_chave=&info=</code>: Retorna os dados do produto com o filtro especificado.</li>
      <li><code>POST /produtos</code>: Cria um novo produto.</li>
      <li><code>PUT /produtos/:id</code>: Atualiza os dados do produto com o ID especificado.</li>
      <li><code>DELETE /produtos/:id</code>: Exclui o produto com o ID especificado.</li>
    </ul>
    
    
Para testar as rotas do produto Acesse: `http://localhost:3000/produtos/`

Para testar a rota que busca os produtos baseado em sua categoria utilizar
<br/>`http://localhost:3000/produtos/search?palavra_chave=categoria&infto=calçado`

Em primeiro momento criação de uma API que ler o Arquivos em JSON, utilizando o modulo FS.
Essa API será integrada com o projeto front-end <a href="https://github.com/DarlanMendes/digital-store">Projeto DRIP-STORE</a>. 

## TECNOLOGIAS UTILIZADAS

 <p>O projeto utiliza as seguintes tecnologias:</p>
    <ul>
      <li><a href="https://nodejs.org/">Node.js</a>: Plataforma de desenvolvimento JavaScript utilizada para criar aplicações de alta escalabilidade e desempenho.</li>
      <li><a href="https://expressjs.com/">Express</a>: Framework para Node.js que fornece recursos para criação de APIs Restful de forma fácil e rápida.</li>
 </ul>

 ## PARA CONTRIBUIR 

 <p>Contribuições são sempre bem-vindas! Para contribuir com este projeto, siga os seguintes passos:</p>
    <ol>
      <li>Faça um fork deste repositório.</li>
      <li>Crie uma nova branch para sua contribuição:</li>
      <pre><code>git checkout -b minha-nova-feature</code></pre>
      <li>Realize as alterações necessárias e faça os commits:</li>
      <pre><code>git commit -am 'Adicionando nova feature'</code></pre>
      <li>Envie as alterações para o seu repositório:</li>
      <pre><code>git push origin minha-nova-feature</code></pre>
      <li>Crie um pull request para este repositório.</li>
    </ol>

