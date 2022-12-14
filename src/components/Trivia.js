import { useState } from 'react';
import './Trivia.css';

import Typewriter from 'typewriter-effect';

const Trivia = ({triviaToAnswer, changeTriviaAnswered}) => {
    
    const [questionFinished, setQuestionFinished] = useState(false);
    const [answerSelected, setAnswerSelected] = useState(false);
    const [answerCorrect, changeAnswerCorrect] = useState(null);

    const checkIfCorrect = (answer) => {
        if (answer === triviaToAnswer.correct_answer) {
            changeAnswerCorrect(true);
        } else {
            changeAnswerCorrect(false);
        }
        setAnswerSelected(true);
        setQuestionFinished(false);
    }

    const randomIndex = Math.floor(Math.random() * 3);
    const options = triviaToAnswer.incorrect_answers;
    if (options.length !== 4) options.splice(randomIndex, 0, triviaToAnswer.correct_answer);
    
    return (
        <>
        {!answerSelected ?
            <>
                <div className="Question">
                    <Typewriter
                        options={{
                            cursor: '',
                            delay: 20,
                            skipAddStyles: true
                        }}
                        onInit={(typewriter) => {
                            typewriter.typeString(triviaToAnswer.question
                                                    .replaceAll("&quot;", "'")
                                                    .replaceAll("&#039;", "'")
                                                    .replaceAll("&eacute;", "é")
                                                    .replaceAll("&amp;", "&"))
                            .callFunction(() => setQuestionFinished(true))
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
                                            typewriter.typeString(options[0]
                                                                .replaceAll("&quot;", "'")
                                                                .replaceAll("&#039;", "'")
                                                                .replaceAll("&eacute;", "é")
                                                                .replaceAll("&amp;", "&"))
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
                                                typewriter.typeString(options[1]
                                                                .replaceAll("&quot;", "'")
                                                                .replaceAll("&#039;", "'")
                                                                .replaceAll("&eacute;", "é")
                                                                .replaceAll("&amp;", "&"))
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
                                                typewriter.typeString(options[2]
                                                                    .replaceAll("&quot;", "'")
                                                                    .replaceAll("&#039;", "'")
                                                                    .replaceAll("&eacute;", "é")
                                                                    .replaceAll("&amp;", "&"))
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
                                                typewriter.typeString(options[3]
                                                                    .replaceAll("&quot;", "'")
                                                                    .replaceAll("&#039;", "'")
                                                                    .replaceAll("&eacute;", "é")
                                                                    .replaceAll("&amp;", "&"))
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
            :

            <Typewriter
                options={{
                    cursor: '',
                    delay: 20,
                    skipAddStyles: true
                }}
                onInit={(typewriter) => {
                    typewriter.typeString(
                        answerCorrect ?
                            `Correct answer!`
                        :
                            `Incorrect, the correct answer is ${triviaToAnswer.correct_answer}`
                    )
                    .callFunction(() => {
                        setTimeout(function() {
                            answerCorrect ? changeTriviaAnswered("correct") : changeTriviaAnswered("incorrect")
                            setAnswerSelected(false);
                            changeAnswerCorrect(null);
                        }, 1000)
                    })
                    .start();
                }}
            />
        }   
        </>    
    );
}

export default Trivia;