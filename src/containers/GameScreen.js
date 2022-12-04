import { useState, useEffect, useRef } from 'react';
import { generateSlug } from "random-word-slugs";
import './GameScreen.css';

import Start from '../components/Start';
import TrivimonName from '../components/TrivimonName';
import TrivimonImage from '../components/TrivimonImage';
import TrivimonNPValues from '../components/TrivimonNPValues';
import TrivimonNPBar from '../components/TrivimonNPBar';
import InfoBoard from '../components/InfoBoard';


const GameScreen = () => {

    // game logic
    const [gameLoaded, changeGameLoaded] = useState(false);
    const [gameStarted, changeGameState] = useState(false);
    const [winner, setWinner] = useState(null)
    const [playerTurn, changePlayerTurn] = useState(false);
    const [selectedMove, changeSelectedMove] = useState(null);
    const [triviaAnswered, changeTriviaAnswered] = useState(null);
    const [triviaToAnswer, changeTriviaToAnswer] = useState(null);

    // data
    const [trivimonCollection, setTrivimonCollection] = useState(null);
    const [playerTrivimon, setPlayerTrivimon] = useState(null);
    const [playerHPremaining, changePlayerHPremaining] = useState(null);
    const [computerTrivimon, setComputerTrivimon] = useState(null);
    const [computerHPremaining, changeComputerHPremaining] = useState(null);
    const [trivia, setTrivia] = useState(null);

    // other
    const [textFinished, changeTextFinished] = useState(false);
    const [moveHovered, changeMoveHovered] = useState(null);


    useEffect( () => { 
        if (!gameLoaded) {
            if (!trivimonCollection) getTrivimonCollection();
            else if (!playerTrivimon) getTrivimon(setPlayerTrivimon, changePlayerHPremaining);
            else if (!computerTrivimon) getTrivimon(setComputerTrivimon, changeComputerHPremaining);
            else if (!trivia) getTrivia();
            else if (!triviaToAnswer) {
                const randomIndex = Math.floor(Math.random() * trivia.length);
                changeTriviaToAnswer(trivia[randomIndex]);
            } else {
                playerTrivimon.pace >= computerTrivimon.pace ? changePlayerTurn(true) : changePlayerTurn(false);
                changeGameLoaded(true);
            }
        } else {

            if (!triviaToAnswer) {
                const randomIndex = Math.floor(Math.random() * trivia.length);
                changeTriviaToAnswer(trivia[randomIndex]);
            }

            if (triviaAnswered) {

                if (playerHPremaining === 0 || computerHPremaining === 0) {
                    setWinner(playerHPremaining === 0 ? "computer" : "player");
                    changeGameState(false);
                } else {

                    if (!playerTurn && !selectedMove) {
                        const computerMoves = computerTrivimon.moves;
                        console.log("computerMoves", computerMoves)
                        const randomIndex = Math.floor(Math.random() * computerMoves.length);
                        changeSelectedMove(computerMoves[randomIndex]);
                    }

                    if (selectedMove) {
                        if (textFinished) {
                            setTimeout(function() {
                                changePlayerTurn(!playerTurn);
                                triviaDamage();
                                changeSelectedMove(null);
                            }, 1000);
                            changeTextFinished(false);
                            changeMoveHovered(null);
                        }
                    }
                }
            }
        }
    }, [gameStarted, trivimonCollection, playerTrivimon, computerTrivimon, playerHPremaining, computerHPremaining, playerTurn, selectedMove, textFinished, triviaToAnswer]);


    const onStartChange = () => {
        changeGameState(true);
    }

    const onNewGame = () => {
        setTrivia(null);
        changeSelectedMove(null);
        setWinner(null);
        setPlayerTrivimon(null);
        setComputerTrivimon(null);
        changePlayerHPremaining(null);
        changeComputerHPremaining(null);
        changeGameLoaded(false);
        changeGameState(true);
    }

    const triviaDamage = () => {
        const damageTotal = (((2 / 5) + 2) * selectedMove.power * playerTurn ? 
            playerTrivimon.iq / computerTrivimon.resilience
            :
            computerTrivimon.iq / playerTrivimon.resilience
            / 50) + 5;
        
        console.log("triviaDamage", playerTurn, damageTotal)
        playerTurn ? 
        (computerHPremaining - damageTotal) < 0 ? changeComputerHPremaining(0) : changeComputerHPremaining(Math.round(computerHPremaining - damageTotal))
        :
        (playerHPremaining - damageTotal) < 0 ? changePlayerHPremaining(0) : changePlayerHPremaining(Math.round(playerHPremaining - damageTotal))
    }

    const getTrivia = () => {
        fetch("https://opentdb.com/api.php?amount=50&difficulty=hard&type=multiple")
        .then(res => res.json())
        .then(trivia => setTrivia(trivia.results));
    }

    const getTrivimonCollection = () => {
        fetch("https://pokeapi.co/api/v2/generation/1/")
        .then(res => res.json())
        .then(trivimon => setTrivimonCollection(trivimon.pokemon_species));
    }

    const getTrivimon = (allocateTrivimon, setHPRemaining) => {
        let trivimonStats;
        const moves = [];

        const randomIndex = Math.floor(Math.random() * 150);
        fetch(`https://pokeapi.co/api/v2/pokemon/${trivimonCollection[Number(randomIndex)].name}`)
        .then(trivimonData => trivimonData.json())
        .then(trivimon => {
            trivimonStats = {
                name: generateSlug(2, { format: "title", categories: {adjective: ["personality", "time", "shapes", "taste"]}}),
                np: trivimon.stats[0].base_stat,
                iq: trivimon.stats[1].base_stat,
                resilience: trivimon.stats[2].base_stat,
                pace: trivimon.stats[5].base_stat,
                moves: trivimon.moves.filter(move => 
                    move.version_group_details[0].level_learned_at === 1 
                    && move.version_group_details[0].version_group.name === "red-blue"
                    ).map(move => {
                        return {name: move.move.name, url: move.move.url}
                    }),
                frontImage: trivimon.sprites.front_default,
                backImage: trivimon.sprites.back_default
            }

            trivimonStats.moves.forEach(move => {
                fetch(move.url)
                .then(movesData => movesData.json())
                .then(moveDetails => {
                    moves.push({
                        name: generateSlug(2, { format: "title", categories: {adjective: ["sounds", "touch"]}}),
                        precision: moveDetails.accuracy ? moveDetails.accuracy : 90,
                        competence: moveDetails.power ? moveDetails.power : 1
                    })
                });
            });

            trivimonStats.moves = moves;
            console.log("trivimonStats", trivimonStats)
            allocateTrivimon(trivimonStats);
            setHPRemaining(trivimonStats.np)
        });
    }

    const updateSelectedMove = (move) => {
        changeSelectedMove(move);
    }

    const updateTextFinished = (bool) => {
        changeTextFinished(bool);
    }

    const onMoveHover = (move) => {
        changeMoveHovered(move);
    }

    return (
        <div className="GameScreen">
            {!gameStarted ? 
                !winner ?
                <div className="Start">
                <Start winner={winner} onStartChange={onStartChange}/>
                </div>
                :
                <div className="Start">
                    <Start winner={winner} onNewGame={onNewGame} computerTrivimonName={computerTrivimon.name} onStartChange={onStartChange}/>
                </div>
            :
                !gameLoaded ?
                    <div className="Start">
                        <p>Loading...</p>
                    </div>
                :
                    <>
                        <div className="Trivinoms">
                            <div className="Player">
                                <TrivimonName name={playerTrivimon.name}/>
                                <TrivimonNPBar np={playerTrivimon.np} npLeft={playerHPremaining}/>
                                <TrivimonNPValues np={playerTrivimon.np} npLeft={playerHPremaining}/>
                                <TrivimonImage image={playerTrivimon.backImage}/>
                            </div>

                            <div className="Computer">
                                <TrivimonImage image={computerTrivimon.frontImage}/>
                                <TrivimonName name={computerTrivimon.name}/>
                                <TrivimonNPBar np={computerTrivimon.np} npLeft={computerHPremaining}/>
                                <TrivimonNPValues np={computerTrivimon.np} npLeft={computerHPremaining}/>
                            </div>
                        </div>
                        
                        <div className="InfoBoard">
                            <InfoBoard 
                                playerTrivimonName={playerTrivimon.name} 
                                computerTrivimonName={computerTrivimon.name} 
                                playerMoves={playerTrivimon.moves} 
                                selectedMove={selectedMove} 
                                onMoveSelection={updateSelectedMove}
                                textFinished={updateTextFinished}
                                onMoveHover={onMoveHover}
                                moveHovered={moveHovered}
                                playerTurn={playerTurn}
                                triviaToAnswer={triviaToAnswer}
                                triviaAnswered={triviaAnswered}
                                changeTriviaAnswered={changeTriviaAnswered}
                                />
                        </div>
                    </>
            }
        </div>
    );
}

export default GameScreen;