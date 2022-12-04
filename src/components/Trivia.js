import { useState, useEffect, useRef } from 'react';
import './Trivia.css';

import Typewriter from 'typewriter-effect';

const Trivia = ({triviaToAnswer, changeTriviaAnswered}) => {

    const [questionFinished, updateQuestionFinished] = useState(false);

    useEffect( () => { 

    }, []);
    

    const checkIfCorrect = (answer) => {
        if (answer === triviaToAnswer.correct_answer) {
            changeTriviaAnswered("correct")
        } else {
            changeTriviaAnswered("incorrect")
        }
        updateQuestionFinished(false);

    }

    const randomIndex = Math.floor(Math.random() * 3);
    const options = triviaToAnswer.incorrect_answers
    if (options.length != 4) options.splice(randomIndex, 0, triviaToAnswer.correct_answer)
    
    return (
                <>
                <div className="Question">
                    <Typewriter
                        options={{
                            cursor: '',
                            delay: 20,
                            skipAddStyles: true
                        }}
                        onInit={(typewriter) => {
                            typewriter.typeString(triviaToAnswer.question)
                            .callFunction(() => updateQuestionFinished(true))
                            .start();
                        }}
                    />
                </div>
                <div className="Options">
                    {questionFinished ?
                        <>
                            <span key="0" >
                                <button className="Option" key="" onClick={() => checkIfCorrect(options[0])}>

                                    <Typewriter
                                        options={{
                                            cursor: '',
                                            delay: 20,
                                            skipAddStyles: true
                                        }}
                                        onInit={(typewriter) => {
                                            typewriter.typeString(options[0])
                                            .start();
                                        }}      
                                    />
                            
                                </button>
                            </span>

                            <span key="1" >
                                <button className="Option" key="" onClick={() => checkIfCorrect(options[1])}>

                                    <Typewriter
                                        options={{
                                            cursor: '',
                                            delay: 20,
                                            skipAddStyles: true
                                        }}
                                        onInit={(typewriter) => {
                                            setTimeout(function() {
                                                typewriter.typeString(options[1])
                                                .callFunction(() => updateQuestionFinished(true))
                                                .start();
                                            }, 1000);
                                        }}      
                                    />
                            
                                </button>
                            </span>

                            <span key="2" >
                                <button className="Option" key="" onClick={() => checkIfCorrect(options[2])}>

                                    <Typewriter
                                        options={{
                                            cursor: '',
                                            delay: 20,
                                            skipAddStyles: true
                                        }}
                                        onInit={(typewriter) => {
                                            setTimeout(function() {
                                                typewriter.typeString(options[2])
                                                .callFunction(() => updateQuestionFinished(true))
                                                .start();
                                            }, 2000);
                                        }}      
                                    />
                            
                                </button>
                            </span>

                            <span key="3" >
                                <button className="Option" key="" onClick={() => checkIfCorrect(options[3])}>

                                    <Typewriter
                                        options={{
                                            cursor: '',
                                            delay: 20,
                                            skipAddStyles: true
                                        }}
                                        onInit={(typewriter) => {
                                            setTimeout(function() {
                                                typewriter.typeString(options[3])
                                                .callFunction(() => updateQuestionFinished(true))
                                                .start();
                                            }, 3000);
                                        }}      
                                    />
                            
                                </button>
                            </span>
                        </>
                    :
                        ""
                    }
                </div>
                </>
    );
}

export default Trivia;