import { useState, useEffect, useRef } from 'react';

import Typewriter from 'typewriter-effect';

const Trivia = ({triviaToAnswer, changeTriviaAnswered}) => {

    const [questionFinished, updateQuestionFinished] = useState(false);
    const [optionFinished, updateOptionFinished] = useState(0);
    

    const checkIfCorrect = (answer) => {
        if (answer === triviaToAnswer.correct_answer) {
            changeTriviaAnswered("correct")
        } else {
            changeTriviaAnswered("incorrect")
        }
        updateQuestionFinished(false);
        updateOptionFinished(0);
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

                {questionFinished ?
                    optionFinished === 0 ?
                        <div className="Options">
                            <span key="0" >
                                <button className="Option" key="0" onClick={() => checkIfCorrect(options[0])} >

                                    <Typewriter
                                        options={{
                                            cursor: '',
                                            delay: 20,
                                            skipAddStyles: true
                                        }}
                                        onInit={(typewriter) => {
                                            typewriter.typeString(options[0])
                                            .callFunction(() => updateOptionFinished(0))
                                            .start();
                                        }}      
                                    />
                                    
                                </button>
                            </span>
                        </div>
                        :
                            ""
                :
                    ""
                }
                </>
    );
}

export default Trivia;