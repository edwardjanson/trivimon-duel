import { useState, useEffect, useRef } from 'react';
import './GameScreen.css';

import Start from '../components/Start';
import TrivimonName from '../components/TrivimonName';
import TrivimonImage from '../components/TrivimonImage';
import TrivimonHPValues from '../components/TrivimonHPValues';
import TrivimonHPBar from '../components/TrivimonHPBar';
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


    useEffect( () => { 
        if (!trivimonCollection) {
            getTrivimonCollection();
        } else if (!playerTrivimon) {
            getTrivimon(setPlayerTrivimon);
        } else if (!computerTrivimon) {
            getTrivimon(setComputerTrivimon);
        } else if (playerTrivimon) {
            changePlayerHPremaining(playerTrivimon["hp"]);
            changeComputerHPremaining(computerTrivimon["hp"]);

            try {
                if (Object.keys(playerTrivimon.moves[0]).length === 2) {
                    getTrivimonMoves(playerTrivimon, setPlayerTrivimon);
                }
            } catch {}
            
        } else if (computerTrivimon) {
            try {
                if (Object.keys(computerTrivimon.moves[0]).length === 2) {
                    getTrivimonMoves(computerTrivimon, setComputerTrivimon);
                }
            } catch {}
        }

        if (selectedMove) {
            if (textFinished) {
                setTimeout(function() {
                    changeSelectedMove(null);
                }, 2000);
                changePlayerTurn(false);
                changeTextFinished(false);
                changeMoveHovered(null);
            }
        }

    }, [trivimonCollection, playerTrivimon, computerTrivimon, selectedMove, textFinished]);

    const onStartChange = () => {
        changeGameState(true);
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
            name: trivimon.forms[0].name,
            hp: trivimon.stats[0].base_stat,
            attack: trivimon.stats[1].base_stat,
            defense: trivimon.stats[2].base_stat,
            speed: trivimon.stats[5].base_stat,
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
                    name: move.name,
                    accuracy: moveDetails.accuracy ? moveDetails.accuracy : 0,
                    power: moveDetails.power ? moveDetails.power : 0
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

            <div className="Start">
                <Start onStartChange={onStartChange}/>
            </div>

            :
            <>
                <div className="Trivinoms">
                    <div className="Player">
                        <TrivimonName name={playerTrivimon.name}/>
                        <TrivimonHPBar hp={playerTrivimon.hp} hpLeft={playerHPremaining}/>
                        <TrivimonImage image={playerTrivimon.backImage}/>
                    </div>

                    <div className="Computer">
                        <TrivimonImage image={computerTrivimon.frontImage}/>
                        <TrivimonName name={computerTrivimon.name}/>
                        <TrivimonHPBar hp={computerTrivimon.hp} hpLeft={computerHPremaining}/>
                        <TrivimonHPValues hp={computerTrivimon.hp} hpLeft={computerHPremaining}/>
                    </div>
                </div>
                
                <div className="InfoBoard">
                    <InfoBoard 
                        playerTrivimonName={playerTrivimon.name} 
                        computerTrivimonName={computerTrivimon.name} 
                        moves={playerTrivimon.moves} 
                        selectedMove={selectedMove} 
                        onMoveSelection={updateSelectedMove}
                        textFinished={updateTextFinished}
                        onMoveHover={onMoveHover}
                        moveHovered={moveHovered}
                        />
                </div>
            </>
            }
        </div>
    );
}

export default GameScreen;