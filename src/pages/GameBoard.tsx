import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface Question {
  id: number;
  points: number;
  question: string;
  answer: string;
  revealed: boolean;
}

interface Category {
  id: number;
  title: string;
  questions: Question[];
}

const GameBoard = () => {
  const navigate = useNavigate();
  const [score, setScore] = useState(0);

  // Mock data - replace with Firebase data
  const [categories] = useState<Category[]>([
    {
      id: 1,
      title: "Science",
      questions: [
        { id: 1, points: 200, question: "What is H2O?", answer: "Water", revealed: false },
        { id: 2, points: 400, question: "What is the closest planet to the Sun?", answer: "Mercury", revealed: false },
        { id: 3, points: 600, question: "What is the hardest natural substance?", answer: "Diamond", revealed: false },
        { id: 4, points: 800, question: "What is the largest organ in the human body?", answer: "Skin", revealed: false },
        { id: 5, points: 1000, question: "What is absolute zero in Celsius?", answer: "-273.15°C", revealed: false },
      ],
    },
    // Add more categories here
  ]);

  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);

  const handleQuestionClick = (question: Question) => {
    if (!question.revealed) {
      setSelectedQuestion(question);
    }
  };

  const handleAnswerReveal = () => {
    if (selectedQuestion) {
      const points = selectedQuestion.points;
      setScore(score + points);
      setSelectedQuestion(null);
      // Mark question as revealed in the state
    }
  };

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
        <div className="flex justify-between items-center">
          <Button
            onClick={() => navigate("/games")}
            className="glass-card hover:bg-primary/20"
          >
            Exit Game
          </Button>
          <div className="text-2xl font-bold">Score: {score}</div>
        </div>

        <div className="game-grid">
          {categories.map((category) => (
            <div key={category.id} className="space-y-4">
              <div className="category-header">{category.title}</div>
              {category.questions.map((question) => (
                <div
                  key={question.id}
                  className={`question-card ${
                    question.revealed ? "bg-primary/10" : ""
                  }`}
                  onClick={() => handleQuestionClick(question)}
                >
                  {question.revealed ? "" : `$${question.points}`}
                </div>
              ))}
            </div>
          ))}
        </div>

        {selectedQuestion && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="glass-card max-w-2xl w-full p-8 space-y-6 animate-slide-up">
              <h3 className="text-2xl font-bold text-center">
                ${selectedQuestion.points}
              </h3>
              <p className="text-xl text-center">{selectedQuestion.question}</p>
              <div className="flex justify-center gap-4">
                <Button
                  onClick={() => setSelectedQuestion(null)}
                  className="glass-card hover:bg-primary/20"
                >
                  Close
                </Button>
                <Button
                  onClick={handleAnswerReveal}
                  className="glass-card hover:bg-primary/20"
                >
                  Show Answer
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameBoard;