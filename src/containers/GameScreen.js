import { useState, useEffect, useRef } from 'react';
import Start from '../components/Start';

const GameScreen = () => {

    const [trivimonCollection, setTrivimonCollection] = useState(null);
    const [gameStarted, changeGameState] = useState(false);
    const [playerTrivimon, setPlayerTrivimon] = useState(null);
    const [playerHPremaining, changePlayerHPremaining] = useState(null)
    const [playerMoves, setPlayerMoves] = useState([])
    const [computerTrivimon, setComputerTrivimon] = useState(null);
    const [computerHPremaining, changeComputerHPremaining] = useState(null)
    const [computerMoves, setComputerMoves] = useState([])
    const [playerTurn, changePlayerTurn] = useState(false);
    const [moveSelected, changeMoveSelected] = useState(false);

    useEffect( () => { 
        if (!trivimonCollection) {
            getTrivimonCollection()
        } else if (!playerTrivimon) {
            getTrivimon(setPlayerTrivimon)
        } else if (!computerTrivimon) {
            getTrivimon(setComputerTrivimon)
        } else {
            getTrivimonMoves(playerTrivimon, setPlayerMoves)
            getTrivimonMoves(computerTrivimon, setComputerMoves)
        }
    }, [trivimonCollection, playerTrivimon, computerTrivimon]);

    const onStartChange = () => {
        changeGameState(true);
    }

    const getTrivimonCollection = async () => {
        await fetch("https://pokeapi.co/api/v2/generation/1/")
        .then(res => res.json())
        .then(trivimon => setTrivimonCollection(trivimon.trivimon_species));
    }

    const getTrivimon = async (allocateTrivimon) => {
        let randomIndex = Math.floor(Math.random() * 150);
        await fetch(`https://pokeapi.co/api/v2/trivimon/${trivimonCollection[Number(randomIndex)].name}`)
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

    const getTrivimonMoves = (player, setMoveDetails) => {
        const moves = []

        player["moves"].forEach(move => {
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

        setMoveDetails(moves)
    }

    return (
        <div className="GameScreen">

            {!gameStarted ? 

            <div className="Start">
                <Start onStartChange={onStartChange}/>
            </div>

            :
            <>
                <div className="Player">
                    <TrivimonName name={playerTrivimon.name}/>
                    <TrivimonHPBar hp={playerTrivimon.hp}/>
                    <TrivimonImage image={playerTrivimon.backImage}/>
                </div>

                <div className="Player">
                    <TrivimonImage image={computerTrivimon.frontImage}/>
                    <TrivimonName name={computerTrivimon.name}/>
                    <TrivimonHPBar hp={computerTrivimon.hp}/>
                    <TrivimonHPValues hp={computerTrivimon.hp}/>
                </div>
                
                {!attackSelected ?
                    <div className="MoveSelector">
                        <MoveSelector moves={playerMoves} onHover={} onSelection={}/>
                    </div>
                :
                    <div>
                        <AttackInfo selectedMove={}/>
                    </div>
                }

            </>
            }
        </div>
    );
}

export default GameScreen;