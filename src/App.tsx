import React, { useState } from 'react';
import {fetchQuizQuestions } from './API';
import QuestionCard from './Components/QuestionCard';
import {QuestionState, Difficulty} from './API';
import { type } from 'os';
import {GlobalStyle, Wrapper} from './App.styles';

const TOTAL_QUESTIONS=10;

export type AnswerObject = {
  question : string;
  answer:string;
  correct:boolean;
  correctAnswer: string;
}

const App = () => {

  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] =  useState(true);

  

  const startTrivia = async () => {
    setLoading(true);
    setGameOver(false);

    const newQuestions = await fetchQuizQuestions(
      TOTAL_QUESTIONS,
      Difficulty.EASY
    );

    setQuestions(newQuestions);
    setScore(0);
    setUserAnswers([]);
    setNumber(0);
    setLoading(false);

  };

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if(!gameOver){
      //users ans
      const answer = e.currentTarget.value;
      //check ans ahainst correct ans
      const correct = questions[number].correct_answer === answer;
      //add score if ans correct
      if(correct) setScore(prev => prev + 1);
      //save ans in array for user ans
      const answerObject ={
        question : questions[number].question,
        answer,
        correct,
        correctAnswer : questions[number].correct_answer,

      };
      setUserAnswers((prev) => [...prev, answerObject])
    }
  }

  const nextQuestion = () => {
    //move on to next ques if not the last ques
    const nextQuestion = number + 1;

    if(nextQuestion === TOTAL_QUESTIONS){
      setGameOver(true);

    }else{
      setNumber(nextQuestion);
    }
  }

  return (<>
  <GlobalStyle />
    <Wrapper>
      <h1>QUIZ</h1>
      {gameOver || userAnswers.length === TOTAL_QUESTIONS ?(
      <button className="start" onClick={startTrivia}>Start</button>)
      :null }
        {! gameOver ? <p className="score">Score:{score}</p>: null }
        {loading && <p>Loading Questions..</p>}
        {!loading && !gameOver && ( <QuestionCard
          questioNr={number + 1}
          totalQuestions = {TOTAL_QUESTIONS}
          question={questions[number].question}
          answers={questions[number].answers}
          userAnswer={userAnswers ? userAnswers[number]: undefined}
          callback={checkAnswer}
        /> )}
        {!gameOver && !loading && userAnswers.length === number +1 && number !== TOTAL_QUESTIONS - 1?(
        <button className="next" onClick={nextQuestion}>
          Next Question
        </button>
        ): null}
    </Wrapper>
    </>
  );
}

export default App;
