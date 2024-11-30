import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const EditGame = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState("Science Quiz");
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: "Physics",
      questions: [
        { id: 1, question: "What is gravity?", answer: "A force of attraction", points: 100, image: "" },
        { id: 2, question: "What is inertia?", answer: "Resistance to change", points: 200, image: "" },
      ],
    },
  ]);

  const [newQuestion, setNewQuestion] = useState({
    question: "",
    answer: "",
    image: "",
  });

  const addCategory = () => {
    const newCategory = {
      id: categories.length + 1,
      name: "New Category",
      questions: [],
    };
    setCategories([...categories, newCategory]);
  };

  const updateCategory = (categoryId: number, name: string) => {
    setCategories(
      categories.map((cat) =>
        cat.id === categoryId ? { ...cat, name } : cat
      )
    );
  };

  const addQuestionToCategory = (categoryId: number) => {
    const category = categories.find((cat) => cat.id === categoryId);
    if (category) {
      const questionCount = category.questions.length;
      const newQuestionObj = {
        id: Date.now(),
        question: newQuestion.question,
        answer: newQuestion.answer,
        points: (questionCount + 1) * 100,
        image: newQuestion.image,
      };
      
      setCategories(
        categories.map((cat) =>
          cat.id === categoryId
            ? { ...cat, questions: [...cat.questions, newQuestionObj] }
            : cat
        )
      );
      
      setNewQuestion({ question: "", answer: "", image: "" });
    }
  };

  const updateQuestion = (
    categoryId: number,
    questionId: number,
    field: string,
    value: string | number
  ) => {
    setCategories(
      categories.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              questions: cat.questions.map((q) =>
                q.id === questionId ? { ...q, [field]: value } : q
              ),
            }
          : cat
      )
    );
  };

  const handleSave = () => {
    toast.success("Game updated successfully!");
    navigate("/games");
  };

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <Button
            onClick={() => navigate("/games")}
            className="glass-card hover:bg-primary/20"
          >
            Back to Games
          </Button>
          <Button onClick={handleSave} className="glass-card hover:bg-primary/20">
            Save Changes
          </Button>
        </div>

        <div className="glass-card p-8 space-y-8">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Game Title"
            className="text-2xl"
          />

          <Button onClick={addCategory} className="glass-card hover:bg-primary/20">
            <Plus className="w-4 h-4 mr-2" /> Add Category
          </Button>

          <div className="space-y-6">
            {categories.map((category) => (
              <Collapsible key={category.id} className="glass-card">
                <CollapsibleTrigger className="w-full">
                  <div className="flex justify-between items-center p-4">
                    <Input
                      value={category.name}
                      onChange={(e) => updateCategory(category.id, e.target.value)}
                      placeholder="Category Name"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          onClick={(e) => e.stopPropagation()}
                          className="glass-card hover:bg-primary/20"
                        >
                          <Plus className="w-4 h-4 mr-2" /> Add Question
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add New Question</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <Input
                            value={newQuestion.question}
                            onChange={(e) =>
                              setNewQuestion({ ...newQuestion, question: e.target.value })
                            }
                            placeholder="Question"
                          />
                          <Input
                            value={newQuestion.answer}
                            onChange={(e) =>
                              setNewQuestion({ ...newQuestion, answer: e.target.value })
                            }
                            placeholder="Answer"
                          />
                          <Input
                            value={newQuestion.image}
                            onChange={(e) =>
                              setNewQuestion({ ...newQuestion, image: e.target.value })
                            }
                            placeholder="Image URL (optional)"
                          />
                          <Button
                            onClick={() => addQuestionToCategory(category.id)}
                            className="w-full"
                          >
                            Add Question
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <div className="space-y-4 p-4">
                    {category.questions.map((question, index) => (
                      <Collapsible key={question.id}>
                        <CollapsibleTrigger className="w-full text-left p-2 hover:bg-primary/10 rounded">
                          {question.question} (${(index + 1) * 100})
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="glass-card p-4 space-y-4 mt-2">
                            <Input
                              value={question.answer}
                              onChange={(e) =>
                                updateQuestion(category.id, question.id, "answer", e.target.value)
                              }
                              placeholder="Answer"
                            />
                            <Input
                              value={question.image || ""}
                              onChange={(e) =>
                                updateQuestion(category.id, question.id, "image", e.target.value)
                              }
                              placeholder="Image URL (optional)"
                            />
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditGame;