import React, { useState, useEffect } from 'react';
import { Proposal, QuizQuestion } from '../types';
import { generateQuizForProposal } from '../services/geminiService';

interface QuizModuleProps {
  proposal: Proposal;
  onSuccess: () => void;
  onFailure: () => void;
}

export const QuizModule: React.FC<QuizModuleProps> = ({ proposal, onSuccess, onFailure }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const loadQuiz = async () => {
      setLoading(true);
      try {
        const generatedQuestions = await generateQuizForProposal(proposal);
        if (isMounted) {
            setQuestions(generatedQuestions);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) {
            setLoading(false);
        }
      }
    };
    loadQuiz();
    return () => { isMounted = false; };
  }, [proposal]);

  const handleOptionSelect = (questionId: number, optionIndex: number) => {
    if (submitted) return;
    setUserAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = () => {
    let calculatedScore = 0;
    questions.forEach(q => {
      if (userAnswers[q.id] === q.correctOptionIndex) {
        calculatedScore++;
      }
    });
    setScore(calculatedScore);
    setSubmitted(true);
  };

  const handleContinue = () => {
    if (score === questions.length) {
      onSuccess();
    } else {
      onFailure();
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl shadow-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-marianne-blue mb-4"></div>
        <p className="text-slate-600 font-medium">Génération du test de vérification via IA...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-xl p-8">
      <div className="mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-slate-800">Vérification de compréhension</h2>
        <p className="text-slate-500 text-sm mt-1">
          Pour accéder au vote, vous devez répondre correctement à ces {questions.length} questions basées sur le document précédent.
        </p>
      </div>

      <div className="space-y-8">
        {questions.map((q, idx) => {
          const isCorrect = userAnswers[q.id] === q.correctOptionIndex;
          const showResult = submitted;

          return (
            <div key={q.id} className="space-y-3">
              <p className="font-semibold text-slate-800">Question {idx + 1}: {q.question}</p>
              <div className="grid gap-2">
                {q.options.map((opt, optIdx) => {
                  let buttonClass = "w-full text-left p-3 rounded-lg border transition-all text-sm ";
                  
                  if (showResult) {
                    if (optIdx === q.correctOptionIndex) {
                      buttonClass += "bg-green-100 border-green-500 text-green-800 font-medium";
                    } else if (userAnswers[q.id] === optIdx) {
                      buttonClass += "bg-red-100 border-red-500 text-red-800";
                    } else {
                      buttonClass += "bg-gray-50 border-gray-200 opacity-50";
                    }
                  } else {
                    if (userAnswers[q.id] === optIdx) {
                      buttonClass += "bg-blue-50 border-blue-500 text-blue-900 ring-1 ring-blue-500";
                    } else {
                      buttonClass += "bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300";
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleOptionSelect(q.id, optIdx)}
                      disabled={submitted}
                      className={buttonClass}
                    >
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded-full border mr-3 flex items-center justify-center ${
                          userAnswers[q.id] === optIdx ? 'border-current' : 'border-gray-400'
                        }`}>
                          {userAnswers[q.id] === optIdx && <div className="w-2 h-2 rounded-full bg-current" />}
                        </div>
                        {opt}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 pt-6 border-t flex justify-end">
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={Object.keys(userAnswers).length !== questions.length}
            className="bg-slate-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Valider mes réponses
          </button>
        ) : (
          <div className="w-full flex items-center justify-between">
            <div className={`font-bold ${score === questions.length ? 'text-green-600' : 'text-red-600'}`}>
               Note: {score} / {questions.length}
               {score === questions.length ? " - Excellent !" : " - Insuffisant pour voter."}
            </div>
            <button
              onClick={handleContinue}
              className={`px-6 py-2 rounded-lg font-medium text-white ${
                score === questions.length ? 'bg-marianne-blue hover:bg-blue-900' : 'bg-gray-600 hover:bg-gray-700'
              }`}
            >
              {score === questions.length ? 'Accéder au vote' : 'Relire la proposition'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};