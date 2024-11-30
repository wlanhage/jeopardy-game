import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";

const EditGame = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Mock data - replace with actual data fetching
  const [title, setTitle] = useState("Science Quiz");
  const [categories, setCategories] = useState([
    { id: 1, name: "Physics", questions: [
      { id: 1, question: "What is gravity?", answer: "A force of attraction", points: 200 },
    ]},
  ]);

  const addCategory = () => {
    const newCategory = {
      id: categories.length + 1,
      name: "",
      questions: []
    };
    setCategories([...categories, newCategory]);
  };

  const addQuestion = (categoryId: number) => {
    const updatedCategories = categories.map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          questions: [...category.questions, {
            id: category.questions.length + 1,
            question: "",
            answer: "",
            points: 200
          }]
        };
      }
      return category;
    });
    setCategories(updatedCategories);
  };

  const updateCategory = (id: number, name: string) => {
    const updatedCategories = categories.map(category => 
      category.id === id ? { ...category, name } : category
    );
    setCategories(updatedCategories);
  };

  const updateQuestion = (categoryId: number, questionId: number, field: string, value: string | number) => {
    const updatedCategories = categories.map(category => {
      if (category.id === categoryId) {
        const updatedQuestions = category.questions.map(question => 
          question.id === questionId ? { ...question, [field]: value } : question
        );
        return { ...category, questions: updatedQuestions };
      }
      return category;
    });
    setCategories(updatedCategories);
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    toast.success("Game updated successfully!");
    navigate("/games");
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold">Edit Game</h1>
          <div className="flex gap-4">
            <Button
              onClick={() => navigate("/games")}
              className="glass-card hover:bg-primary/20"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="glass-card hover:bg-primary/20"
            >
              Save Changes
            </Button>
          </div>
        </div>

        <div className="glass-card p-6 space-y-6">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-xl font-bold"
            placeholder="Game Title"
          />

          <div className="space-y-6">
            {categories.map((category) => (
              <div key={category.id} className="glass-card p-4 space-y-4">
                <div className="flex gap-4">
                  <Input
                    value={category.name}
                    onChange={(e) => updateCategory(category.id, e.target.value)}
                    placeholder="Category Name"
                  />
                  <Button
                    onClick={() => addQuestion(category.id)}
                    className="glass-card hover:bg-primary/20"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Add Question
                  </Button>
                </div>

                <div className="space-y-4">
                  {category.questions.map((question) => (
                    <div key={question.id} className="glass-card p-4 space-y-4">
                      <Input
                        value={question.question}
                        onChange={(e) => updateQuestion(category.id, question.id, "question", e.target.value)}
                        placeholder="Question"
                      />
                      <Input
                        value={question.answer}
                        onChange={(e) => updateQuestion(category.id, question.id, "answer", e.target.value)}
                        placeholder="Answer"
                      />
                      <Input
                        type="number"
                        value={question.points}
                        onChange={(e) => updateQuestion(category.id, question.id, "points", parseInt(e.target.value))}
                        placeholder="Points"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <Button
            onClick={addCategory}
            className="w-full glass-card hover:bg-primary/20"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Category
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditGame;