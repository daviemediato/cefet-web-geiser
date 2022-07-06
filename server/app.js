// variáveis globais deste módulo
const fs = require('fs');
const express = require('express')
const app = express()
const PORT = 3000


// carregar "banco de dados" (data/jogadores.json e data/jogosPorJogador.json)
// você pode colocar o conteúdo dos arquivos json no objeto "db" logo abaixo
// dica: 1-4 linhas de código (você deve usar o módulo de filesystem (fs))
const jogadores = JSON.parse(fs.readFileSync("server/data/jogadores.json"));
const jogos = JSON.parse(fs.readFileSync("server/data/jogosPorJogador.json"));
const db = { players: jogadores, games: jogos };

// configurar qual templating engine usar. Sugestão: hbs (handlebars)
//app.set('view engine', '???qual-templating-engine???');
//app.set('views', '???caminho-ate-pasta???');
// dica: 2 linhas
app.set('view engine', 'hbs');
app.set('views', 'server/views');


// EXERCÍCIO 2
// definir rota para página inicial --> renderizar a view index, usando os
// dados do banco de dados "data/jogadores.json" com a lista de jogadores
// dica: o handler desta função é bem simples - basta passar para o template
//       os dados do arquivo data/jogadores.json (~3 linhas)
app.get("/", (req, res) => {
    res.render("index", db.players);
});


// EXERCÍCIO 3
// definir rota para página de detalhes de um jogador --> renderizar a view
// jogador, usando os dados do banco de dados "data/jogadores.json" e
// "data/jogosPorJogador.json", assim como alguns campos calculados
// dica: o handler desta função pode chegar a ter ~15 linhas de código
app.get("/jogador/:numero_identificador", (req, res) => {
    const numeroIdentificador = req.params.numero_identificador;
    const jogador = db.players.players.find(jogador => jogador.steamid === numeroIdentificador);
    const jogosPorJogador = db.games[numeroIdentificador]

    jogador.nao_jogados = jogosPorJogador.games.filter((game) => game.playtime_forever === 0).length;
    jogador.quantidade_jogos = jogosPorJogador.game_count;
    jogador.top5 = jogosPorJogador.games.sort((a, b) => b.playtime_forever - a.playtime_forever).slice(0, 5)
        .map((game) => (game.playtime_forever = Math.floor(game.playtime_forever / 60)));
    jogador.top1 = jogador.top5[0];

    res.render("jogador", { jogador, jogosPorJogador });
});


// EXERCÍCIO 1
// configurar para servir os arquivos estáticos da pasta "client"
// dica: 1 linha de código
app.use(express.static('client/'))


// abrir servidor na porta 3000 (constante PORT)
app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})
