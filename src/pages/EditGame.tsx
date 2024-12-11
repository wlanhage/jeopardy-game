import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash, Image } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { IoIosArrowDown } from "react-icons/io";

import { supabase } from "@/lib/supabaseClient";

const EditGame = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState("");
  const [categories, setCategories] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    answer: "",
    image: "",
    imageFile: null,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategoryId, setCurrentCategoryId] = useState(null);

  useEffect(() => {
    const fetchGameDetails = async () => {
      const { data: game, error: gameError } = await supabase
        .from('jeopardy_games')
        .select('name')
        .eq('id', id)
        .single();

      if (gameError) {
        console.error(gameError);
        return;
      }

      setTitle(game.name);

      const { data: categories, error: categoriesError } = await supabase
        .from('categories')
        .select('id, name, questions(id, question_text, answer, points, picture_url)')
        .eq('game_id', id);

      if (categoriesError) {
        console.error(categoriesError);
        return;
      }

      setCategories(categories.map(category => ({
        ...category,
        questions: category.questions.map(question => ({
          ...question,
          question: question.question_text,
          image: question.picture_url,
        })),
      })));
    };

    fetchGameDetails();
  }, [id]);

  const addCategory = async () => {
    const { data: category, error } = await supabase
      .from('categories')
      .insert([{ name: "New Category", game_id: id }])
      .single();

    if (error) {
      console.error(error);
      return;
    }

    if (category) {
      setCategories([...categories, { ...category, questions: [] }]);
    }
  };

  const updateCategory = async (categoryId: string, name: string) => {
    const { error } = await supabase
      .from('categories')
      .update({ name })
      .eq('id', categoryId);

    if (error) {
      console.error(error);
      return;
    }

    setCategories(
      categories.map((cat) =>
        cat.id === categoryId ? { ...cat, name } : cat
      )
    );
  };

  const addQuestionToCategory = async () => {
    if (!currentCategoryId) {
      console.error("No category selected");
      return;
    }

    let imageUrl = newQuestion.image;
    if (newQuestion.imageFile) {
      imageUrl = await uploadImage(newQuestion.imageFile);
      if (!imageUrl) {
        return;
      }
    }

    const { data: question, error } = await supabase
      .from('questions')
      .insert([{
        question_text: newQuestion.question,
        answer: newQuestion.answer,
        points: (categories.find(cat => cat.id === currentCategoryId)?.questions.length + 1) * 100,
        picture_url: imageUrl,
        category_id: currentCategoryId,
      }])
      .select()
      .single();

    if (error) {
      console.error(error);
      toast.error("Failed to add question. Please try again.");
      return;
    }

    if (!question) {
      console.error("Failed to add question");
      toast.error("Failed to add question. Please try again.");
      return;
    }

    setCategories(
      categories.map((cat) =>
        cat.id === currentCategoryId
          ? { ...cat, questions: [...cat.questions, { ...question, question: question.question_text, image: question.picture_url }] }
          : cat
      )
    );

    setNewQuestion({ question: "", answer: "", image: "", imageFile: null });
    setIsModalOpen(false); 
    toast.success("Question added successfully!");
  };

  const updateQuestion = async (
    categoryId: string,
    questionId: string,
    field: string,
    value: string | number
  ) => {
    const { error } = await supabase
      .from('questions')
      .update({ [field === 'question' ? 'question_text' : field]: value })
      .eq('id', questionId);

    if (error) {
      console.error(error);
      return;
    }

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

  const deleteQuestion = async (categoryId: string, questionId: string) => {
    const { error } = await supabase
      .from('questions')
      .delete()
      .eq('id', questionId);

    if (error) {
      console.error(error);
      return;
    }

    setCategories(
      categories.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              questions: cat.questions.filter((q) => q.id !== questionId),
            }
          : cat
      )
    );
  };

  const deleteCategory = async (categoryId: string) => {
    const { error: questionsError } = await supabase
      .from('questions')
      .delete()
      .eq('category_id', categoryId);

    if (questionsError) {
      console.error(questionsError);
      return;
    }

    const { error: categoryError } = await supabase
      .from('categories')
      .delete()
      .eq('id', categoryId);

    if (categoryError) {
      console.error(categoryError);
      return;
    }

    setCategories(categories.filter((cat) => cat.id !== categoryId));
  };

  const handleSave = async () => {
    for (const category of categories) {
      for (const question of category.questions) {
        if (question.imageFile) {
          const imageUrl = await uploadImage(question.imageFile);
          if (imageUrl) {
            await updateQuestion(category.id, question.id, 'picture_url', imageUrl);
          }
        }
      }
    }

    toast.success("Game updated successfully!");
    navigate("/games");
  };

  const uploadImage = async (file: File) => {
    const fileName = `${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
      .from('questionImages')
      .upload(fileName, file);
  
    if (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image. Please try again.');
      return null;
    } else { 
      console.log('Image uploaded successfully!'); 
    }
  
    const { data: publicUrlData, error: publicUrlError } = supabase.storage
      .from('questionImages')
      .getPublicUrl(fileName);
  
    if (publicUrlError) {
      console.error('Error getting public URL:', publicUrlError);
      toast.error('Failed to get image URL. Please try again.');
      return null;
    }
  
    return publicUrlData.publicUrl;
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
          <h2 className="text-3xl">Game title</h2>
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
                <CollapsibleTrigger className="w-full flex justify-between items-center p-4">
                  <div className="flex gap-2 w-full items-center justify-between">
                    <div className="flex gap-2 items-center w-full">
                      <Input
                        value={category.name}
                        onChange={(e) => updateCategory(category.id, e.target.value)}
                        placeholder="Category Name"
                        className="text-lg w-2/3"
                      />
                      <IoIosArrowDown
                        className="transition-transform duration-300 data-[state=open]:rotate-180"
                        size={26}
                        color="black"
                      />
                    </div>
                    <Button
                      onClick={() => deleteCategory(category.id)}
                      className="glass-card bg-red-800 hover:bg-red-500"
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="space-y-4 p-4">
                    {category.questions.map((question) => (
                      <div key={question.id} className="flex gap-2 items-center">
                        <Input
                          value={question.question}
                          onChange={(e) => updateQuestion(category.id, question.id, 'question', e.target.value)}
                          placeholder="Question"
                          className="w-1/3"
                        />
                        <Input
                          value={question.answer}
                          onChange={(e) => updateQuestion(category.id, question.id, 'answer', e.target.value)}
                          placeholder="Answer"
                          className="w-1/3"
                        />
                        <div className="w-1/5 text-black">
                          {question.points} points
                        </div>
                        <div className="w-1/5 text-black flex gap-2">
                          <Image />
                          {question.picture_url ? question.picture_url.slice(-10) : " No image"}
                        </div>
                        <Button
                          onClick={() => deleteQuestion(category.id, question.id)}
                          className="glass-card bg-red-800 hover:bg-red-500"
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      onClick={() => {
                        setCurrentCategoryId(category.id);
                        setIsModalOpen(true);
                      }}
                      className="glass-card hover:bg-primary/20"
                    >
                      <Plus className="w-4 h-4 mr-2" /> Add Question
                    </Button>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </div>

        {isModalOpen && (
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Question</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  value={newQuestion.question}
                  onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                  placeholder="Question"
                  className="flex-1"
                />
                <Input
                  value={newQuestion.answer}
                  onChange={(e) => setNewQuestion({ ...newQuestion, answer: e.target.value })}
                  placeholder="Answer"
                  className="flex-1"
                />
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setNewQuestion({ ...newQuestion, imageFile: e.target.files[0] });
                    }
                  }}
                  className="flex-1"
                />
                <div className="flex justify-end gap-4">
                  <Button
                    onClick={() => setIsModalOpen(false)}
                    className="glass-card hover:bg-primary/20"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={addQuestionToCategory}
                    className="glass-card hover:bg-primary/20"
                  >
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

export default EditGame;