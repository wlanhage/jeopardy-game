import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabaseClient";
import { User } from "lucide-react";
import { ArrowLeft } from "lucide-react";


interface Question {
  id: number;
  points: number;
  question_text: string;
  answer: string;
  picture_url?: string;
}

interface Category {
  id: number;
  name: string;
  questions: Question[];
}

interface Team {
  id: number;
  name: string;
  points: number;
}

const GameBoard = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [teamsVisible, setTeamsVisible] = useState(true); 
  const [clickedQuestions, setClickedQuestions] = useState<Set<number>>(new Set()); 

  useEffect(() => {
    const fetchGameDetails = async () => {
      const { data: game, error: gameError } = await supabase
        .from('jeopardy_games')
        .select(`
          id,
          name,
          categories (
            id,
            name,
            questions (
              id,
              points,
              question_text,
              answer,
              picture_url
            )
          )
        `)
        .eq('id', id)
        .single();

      if (gameError) {
        console.error(gameError);
        return;
      }

      setCategories(game.categories);
    };

    fetchGameDetails();
  }, [id]);

  const handleQuestionClick = (question: Question) => {
    setCurrentQuestion(question);
    setShowAnswer(false);
    setIsModalOpen(true);
    setClickedQuestions((prev) => new Set(prev).add(question.id)); // Mark question as clicked
  };

  const addTeam = () => {
    if (newTeamName.trim() !== "") {
      setTeams([...teams, { id: teams.length + 1, name: newTeamName, points: 0 }]);
      setNewTeamName("");
      setIsModalOpen(false);
    }
  };

  const updateTeamPoints = (teamId: number, delta: number) => {
    setTeams(teams.map(team => team.id === teamId ? { ...team, points: team.points + delta } : team));
  };

  return (
    <div className="min-h-screen lg:p-8" style={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <div className="space-y-8 animate-fade-in" style={{ height: '100%', width: '100%' }}>
        <div className="fixed top-4 left-4">
          <Button onClick={() => navigate("/games")} className="glass-card hover:bg-primary/20">
            <ArrowLeft />
          </Button>
        </div>

        <div className="game-grid">
          {categories.map((category) => (
            <div key={category.id} className="space-y-4">
              <div className="category-header">
                
                  <h3 className="text-xl">{category.name}</h3>
                
              </div>
              {category.questions.map((question) => (
                <div
                  key={question.id}
                  className={`question-card ${clickedQuestions.has(question.id) ? "bg-gray-700" : ""}`}
                  onClick={() => handleQuestionClick(question)}
                >
                  {question.points}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="fixed bottom-4 right-4 flex gap-4">
          <Button onClick={() => setIsModalOpen(true)} className="glass-card hover:bg-primary/20">
            +
          </Button>
          {teams.length > 0 && (
            <Button onClick={() => setTeamsVisible(!teamsVisible)} className="glass-card hover:bg-primary/20">
              <User />
            </Button>
          )}
        </div>

        {teamsVisible && (
          <div className="fixed bottom-4 left-4 flex gap-4">
            {teams.map((team) => (
              <div key={team.id} className="glass-card p-4 flex flex-col items-center">
                <div className="text-xl font-bold">{team.name}</div>
                <div className="text-lg">{team.points} points</div>
                <div className="flex gap-2 mt-2">
                  <Button onClick={() => updateTeamPoints(team.id, 100)} className="glass-card hover:bg-primary/20">
                    +
                  </Button>
                  <Button onClick={() => updateTeamPoints(team.id, -100)} className="glass-card hover:bg-primary/20">
                    -
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {isModalOpen && currentQuestion && (
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{showAnswer ? "Answer" : "Question"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>{showAnswer ? currentQuestion.answer : currentQuestion.question_text}</div>
                {!showAnswer && currentQuestion.picture_url && (
                  <div className="image-container">
                    <img src={currentQuestion.picture_url} alt="Question" className="max-w-80 max-h-96" />
                  </div>
                )}
                <div className="flex justify-end gap-4">
                  <Button onClick={() => setIsModalOpen(false)} className="glass-card hover:bg-primary/20">
                    Close
                  </Button>
                  <Button onClick={() => setShowAnswer(!showAnswer)} className="glass-card hover:bg-primary/20">
                    {showAnswer ? "Show Question" : "Show Answer"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {isModalOpen && !currentQuestion && (
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Team</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  placeholder="Team Name"
                  className="flex-1"
                />
                <div className="flex justify-end gap-4">
                  <Button onClick={() => setIsModalOpen(false)} className="glass-card hover:bg-primary/20">
                    Cancel
                  </Button>
                  <Button onClick={addTeam} className="glass-card hover:bg-primary/20">
                    Add
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default GameBoard;