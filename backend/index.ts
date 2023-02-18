import express from 'express';

const { v4: uuidv4 } = require('uuid');

const lodash = require('lodash');

const bp = require('body-parser');

interface Game {
	id: string,
	player_name: string,
	score: number
};
const games:Game[] = [];
const app: express.Application = express();

const port: number = 2400;

app.use(bp.json())

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,POST");
    res.header("Access-Control-Allow-Headers", "Content-Type, id_header");
    next();
});

app.post('/createGame', (req, res) => {
    const player_name:string = req.body.player_name;
    if (Object.keys(player_name).length === 0)
        res.status(400).send("no player name");
    const id:string = uuidv4();
    games.push({ id, 'player_name': player_name, 'score': 0 });
    res.status(200).json({ "id": id });
});

app.get('/playerMaxScore/:player_name', (req, res) => {
    const player_name:string = req.params.player_name;
    const player_games:Game[] = games.filter(game => game.player_name == player_name);
    if (player_games.length === 0)
        res.status(400).send('no games for this player');
    const max_score:number = player_games.reduce((prev, current) => (prev.score > current.score) ? prev : current).score;
    res.status(200).json({ "max_score": max_score });
});

app.post('/finishGame', (req, res) => {
    const game = req.body;
    const id:string = req.headers["id_header"] as string;
    if (Object.keys(game).length === 0)
        res.status(400).send("no game details");
    const index:number = lodash.findIndex(games, { id: id });
    games[index] = { id, 'player_name': game.player_name, 'score': game.score };
    res.status(200).send(`Game Over!! Your Score: ${game.score}`);
});

app.listen(port, () => {
	console.log(`app listen in port: ${port}`);
});
