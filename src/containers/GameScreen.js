import { useState, useEffect, useRef } from 'react';
import { generateSlug } from "random-word-slugs";
import './GameScreen.css';

import Start from '../components/Start';
import TrivimonName from '../components/TrivimonName';
import TrivimonImage from '../components/TrivimonImage';
import TrivimonNPValues from '../components/TrivimonNPValues';
import TrivimonNPBar from '../components/TrivimonNPBar';
import InfoBoard from '../components/InfoBoard';
import AttackInfo from '../components/AttackInfo';



const GameScreen = () => {

    const [trivimonCollection, setTrivimonCollection] = useState(null);
    const [gameStarted, changeGameState] = useState(false);
    const [playerTrivimon, setPlayerTrivimon] = useState(null);
    const [playerHPremaining, changePlayerHPremaining] = useState(null)
    const [computerTrivimon, setComputerTrivimon] = useState(null);
    const [computerHPremaining, changeComputerHPremaining] = useState(null)
    const [playerTurn, changePlayerTurn] = useState(false);
    const [selectedMove, changeSelectedMove] = useState(null);
    const [textFinished, changeTextFinished] = useState(false);
    const [moveHovered, changeMoveHovered] = useState(null);
    const [winner, setWinner] = useState(null)


    useEffect( () => { 
        if (!trivimonCollection) {
            getTrivimonCollection();
        } else if (!playerTrivimon) {
            getTrivimon(setPlayerTrivimon);
        } else if (!computerTrivimon) {
            getTrivimon(setComputerTrivimon);
        } else if (!playerHPremaining) {
            changePlayerHPremaining(playerTrivimon["np"]);
        } else if (!computerHPremaining) {
            changeComputerHPremaining(computerTrivimon["np"]);
        } else if (playerTrivimon || computerTrivimon) {
            try {
                if (Object.keys(playerTrivimon.moves[0]).length === 2) {
                    getTrivimonMoves(playerTrivimon, setPlayerTrivimon);
                }
            } catch {}

            try {
                if (Object.keys(computerTrivimon.moves[0]).length === 2) {
                    getTrivimonMoves(computerTrivimon, setComputerTrivimon);
                }
            } catch {}
        }

        if (playerHPremaining === 0 || computerHPremaining === 0) {
            setWinner(playerHPremaining === 0 ? "computer" : "player");
            setPlayerTrivimon(null);
            setComputerTrivimon(null);
            changePlayerHPremaining(null);
            changeComputerHPremaining(null);
            changeGameState(false);
            setWinner(false);
        }

        if (!playerTurn && computerTrivimon) {
            const computerMoves = computerTrivimon.moves;
            const randomIndex = Math.floor(Math.random() * computerMoves.length);
            changeSelectedMove(computerMoves[randomIndex]);
        }

        if (selectedMove) {
            if (textFinished) {
                setTimeout(function() {
                    triviaDamage();
                    changeSelectedMove(null);
                    playerTurn ? changePlayerTurn(false) : changePlayerTurn(true);
                }, 1000);
                changeTextFinished(false);
                changeMoveHovered(null);
            }
        }

    }, [gameStarted, trivimonCollection, playerTrivimon, computerTrivimon, selectedMove, textFinished]);

    const onStartChange = () => {
        playerTrivimon.pace > computerTrivimon.pace ? changePlayerTurn(true) : changePlayerTurn(false);
        changeGameState(true);
    }

    const triviaDamage = () => {
        const damageTotal = (((2 / 5) + 2) * selectedMove.power * playerTurn ? 
            playerTrivimon.iq / computerTrivimon.resilience
            :
            computerTrivimon.iq / playerTrivimon.resilience
            / 50) + 3;
        
        console.log("triviaDamage", playerTurn, damageTotal)
        playerTurn ? 
        (computerHPremaining - damageTotal) < 0 ? changeComputerHPremaining(0) : changeComputerHPremaining(Math.round(computerHPremaining - damageTotal))
        :
        (playerHPremaining - damageTotal) < 0 ? changePlayerHPremaining(0) : changePlayerHPremaining(Math.round(playerHPremaining - damageTotal))
    }

    const getTrivimonCollection = () => {
        fetch("https://pokeapi.co/api/v2/generation/1/")
        .then(res => res.json())
        .then(trivimon => setTrivimonCollection(trivimon.pokemon_species));
    }

    const getTrivimon = (allocateTrivimon) => {
        let randomIndex = Math.floor(Math.random() * 150);
        fetch(`https://pokeapi.co/api/v2/pokemon/${trivimonCollection[Number(randomIndex)].name}`)
        .then(res => res.json())
        .then(trivimon => allocateTrivimon({
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
        }));
    }

    const getTrivimonMoves = (trivimon, updateTrivimon) => {
        const newState = {...trivimon};
        const moves = [];

        trivimon["moves"].forEach(move => {
            fetch(move.url)
            .then(res => res.json())
            .then(moveDetails => {
                moves.push({
                    name: generateSlug(2, { format: "title", categories: {adjective: ["sounds", "touch"]}}),
                    precision: moveDetails.accuracy ? moveDetails.accuracy : 90,
                    competence: moveDetails.power ? moveDetails.power : 1
                });
            });
        });

        newState["moves"] = moves;
        updateTrivimon(newState);
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
                    <Start winner={winner} computerTrivimonName={computerTrivimon.name} onStartChange={onStartChange}/>
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
                        />
                </div>
            </>
            }
        </div>
    );
}

export default GameScreen;