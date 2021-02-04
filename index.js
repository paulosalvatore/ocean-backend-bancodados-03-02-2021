const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

(async () => {
    const url = 'mongodb://localhost:27017';

    const dbName = 'ocean_database_03_02_2021';

    console.info('Conectando ao banco de dados...');

    const client = await MongoClient.connect(url, { useUnifiedTopology: true });

    console.info('MongoDB conectado com sucesso!');

    const db = client.db(dbName);

    const app = express()

    app.use(bodyParser.json());

    const port = 3000;

  /*
  Create, Read (All/Single), Update & Delete
  Criar, Ler (Tudo ou Individual), Atualizar e Remover
  */

  const mensagens = db.collection('mensagens');

  app.get('/', (req, res) => {
    res.send('Hello World!');
  });

  // Criar (Create)
  app.post('/mensagens', (req, res) => {
    const mensagem = req.body;

    mensagem.id = mensagens.length + 1;

    mensagens.push(mensagem);

    res.send('Mensagem criada com sucesso.');
  });

  // Ler Tudo (Read All)
  app.get('/mensagens', async (req, res) => {
    res.send(await mensagens.find().toArray());
  });

  // Ler Individual (Read Single)
  app.get('/mensagens/:id', (req, res) => {
    const id = +req.params.id;

    const mensagem = mensagens.find(msg => msg.id === id);
    
    res.send(mensagem);
  });

  // Atualizar (Update)
  app.put('/mensagens/:id', (req, res) => {
    const id = +req.params.id;

    const mensagem = req.body;

    mensagem.id = id;

    const index = mensagens.findIndex(msg => msg.id === id);
    mensagens[index] = mensagem;

    res.send('Mensagem editada com sucesso.');
  });

  // Remoção (Delete)
  app.delete('/mensagens/:id', (req, res) => {
    const id = +req.params.id;

    const index = mensagens.findIndex(msg => msg.id === id);
    delete mensagens[index];

    res.send('Mensagem removida com sucesso.');
  });

  app.listen(port, () => {
    console.info('Servidor rodando em http://localhost:' + port);
  });

})();
