import { useState, useEffect } from 'react';
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
    const [errorLoading, changeErrorLoading] = useState(false);
    const [gameStarted, changeGameState] = useState(false);
    const [firstTurn, changeFirstTurn] = useState(true);
    const [winner, setWinner] = useState(null);
    const [playerTurn, changePlayerTurn] = useState(false);
    const [selectedMove, changeSelectedMove] = useState(null);
    const [triviaAnswered, changeTriviaAnswered] = useState(null);
    const [triviaToAnswer, changeTriviaToAnswer] = useState(null);
    const [triviaMultiplier, changeTriviaMultiplier] = useState(null);

    // data
    const [playerTrivimon, setPlayerTrivimon] = useState(null);
    const [playerHPremaining, changePlayerHPremaining] = useState(null);
    const [computerTrivimon, setComputerTrivimon] = useState(null);
    const [computerHPremaining, changeComputerHPremaining] = useState(null);
    const [trivia, setTrivia] = useState(null);

    // other
    const [textFinished, changeTextFinished] = useState(false);
    const [moveHovered, changeMoveHovered] = useState(null);


    useEffect( () => { 
        if (gameStarted && !gameLoaded) {
            const fetchApis = async () => {
                try {
                    const pokeResponse = await fetch("https://pokeapi.co/api/v2/generation/1/")
                    const trivimons = await pokeResponse.json();
            
                    await getTrivimon(trivimons.pokemon_species, setPlayerTrivimon, changePlayerHPremaining);
                    await getTrivimon(trivimons.pokemon_species, setComputerTrivimon, changeComputerHPremaining);

                    const triviaResponse = await fetch("https://opentdb.com/api.php?amount=10&difficulty=medium&type=multiple")
                    const trivia = await triviaResponse.json();

                    setTrivia(trivia.results);
                    changeGameLoaded(true);                    

                } catch (error) {
                    changeErrorLoading(true)
                    console.log(error)
                }
            }

            fetchApis();
        } 
        else if (errorLoading) {
            return;
        }
        else if (gameLoaded && firstTurn) {
            playerTrivimon.pace >= computerTrivimon.pace ? changePlayerTurn(true) : changePlayerTurn(false);
            const randomIndex = Math.floor(Math.random() * trivia.length);
            changeTriviaToAnswer(trivia[randomIndex]);
            changeFirstTurn(false);
        }
        else if (gameLoaded) {
            if (!triviaToAnswer) {
                const randomIndex = Math.floor(Math.random() * trivia.length);
                changeTriviaToAnswer(trivia[randomIndex]);
                const updatedTrivia = [...trivia];
                updatedTrivia.splice(randomIndex, 1);
                setTrivia(updatedTrivia)
                changeTriviaAnswered(null);
            }

            if (triviaAnswered) {

                triviaAnswered === "correct" ?
                playerTurn ? changeTriviaMultiplier(3) : changeTriviaMultiplier(0.5)
                :
                playerTurn ? changeTriviaMultiplier(0.5) : changeTriviaMultiplier(3)

                if (playerHPremaining === 0 || computerHPremaining === 0) {
                    setWinner(playerHPremaining === 0 ? "computer" : "player");
                    changeGameState(false);
                } else {

                    if (!playerTurn && !selectedMove) {
                        const computerMoves = computerTrivimon.moves;
                        const randomIndex = Math.floor(Math.random() * computerMoves.length);
                        changeSelectedMove(computerMoves[randomIndex]);
                    }

                    if (selectedMove) {
                        if (textFinished) {
                            setTimeout(function() {
                                changePlayerTurn(!playerTurn);
                                triviaDamage();
                                changeSelectedMove(null);
                                changeTextFinished(false);
                                changeMoveHovered(null);
                                changeTriviaToAnswer(null);
                            }, 1000);
                        }
                    }
                }
            }
        }
        // eslint-disable-next-line
    }, [gameStarted, gameLoaded, firstTurn, errorLoading, triviaAnswered, textFinished]);


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
        changeFirstTurn(true);
        changeGameState(true);
    }

    const triviaDamage = () => {
        const damageTotal = ((((2 / 5) + 2) * selectedMove.power * playerTurn ? 
            playerTrivimon.iq / computerTrivimon.resilience
            :
            computerTrivimon.iq / playerTrivimon.resilience
            / 50) + 50) * triviaMultiplier;
        
        playerTurn ? 
        (computerHPremaining - damageTotal) < 0 ? changeComputerHPremaining(0) : changeComputerHPremaining(Math.round(computerHPremaining - damageTotal))
        :
        (playerHPremaining - damageTotal) < 0 ? changePlayerHPremaining(0) : changePlayerHPremaining(Math.round(playerHPremaining - damageTotal))
    }


    const getTrivimon = async (trivimons, allocateTrivimon, setHPRemaining) => {
        try {
            const randomIndex = Math.floor(Math.random() * 150);
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${trivimons[Number(randomIndex)].name}`)
            const trivimonData = await response.json()

            if (response.ok) {

                const trivimonStats = {
                    name: generateSlug(2, { format: "title", categories: {adjective: ["personality", "time", "shapes", "taste"]}}),
                    np: trivimonData.stats[0].base_stat,
                    iq: trivimonData.stats[1].base_stat,
                    resilience: trivimonData.stats[2].base_stat,
                    pace: trivimonData.stats[5].base_stat,
                    moves: trivimonData.moves.filter(move => 
                        move.version_group_details[0].level_learned_at === 1 
                        && move.version_group_details[0].version_group.name === "red-blue"
                        ).map(move => {
                            return {name: move.move.name, url: move.move.url}
                        }),
                    frontImage: trivimonData.sprites.front_default,
                    backImage: trivimonData.sprites.back_default
                }

                const movePromises = trivimonStats.moves.map(move => {
                    return fetch(move.url).then(response => response.json()).catch(error => changeErrorLoading(true));
                });

                if (!errorLoading) {
                await Promise.all(movePromises)
                    .then((moves) => {
                        const moveDetails = moves.map((move) => {
                        return {
                            name: generateSlug(2, { format: "title", categories: {adjective: ["sounds", "touch"]}}),
                            precision: move.accuracy ? move.accuracy : 90,
                            competence: move.power ? move.power : 1
                        }})

                        trivimonStats.moves = moveDetails;
                })}

                allocateTrivimon(trivimonStats);
                setHPRemaining(trivimonStats.np);
            }

        } catch {
            changeErrorLoading(true);
        }
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
            {errorLoading ?
                <div className="Start">
                            <p>There was an error loading the game, please refresh the page...</p>
                </div>
                :
                !gameStarted ? 
                    !winner ?
                    <div className="Start">
                    <Start onStartChange={onStartChange}/>
                    </div>
                    :
                    <div className="Start">
                        <Start winner={winner} onNewGame={onNewGame} computerTrivimonName={computerTrivimon.name} onStartChange={onStartChange}/>
                    </div>
                :
                    !gameLoaded || firstTurn ?
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
                                    updateTextFinished={updateTextFinished}
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