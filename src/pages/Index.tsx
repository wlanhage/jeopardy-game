import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 space-y-12 animate-fade-in">
      <div className="text-center space-y-6">
        <h1 className="text-7xl font-bold tracking-tight bg-gradient-to-r from-secondary to-white bg-clip-text text-transparent animate-pulse">
          Jeopardy Quest
        </h1>
        <p className="text-2xl text-secondary/80">
          Create and manage your custom Jeopardy games
        </p>
      </div>
      
      <div className="flex gap-6">
        <Button
          onClick={() => navigate("/login")}
          className="glass-card hover:bg-primary/20 text-xl px-8 py-6 transform hover:scale-105 transition-all duration-300"
        >
          Login
        </Button>
        <Button
          onClick={() => navigate("/register")}
          className="glass-card hover:bg-primary/20 text-xl px-8 py-6 transform hover:scale-105 transition-all duration-300"
        >
          Register
        </Button>
      </div>

      <div className="glass-card p-8 space-y-4 max-w-xl w-full transform hover:scale-105 transition-all duration-300">
        <h3 className="text-2xl font-semibold text-center text-secondary">Create Games</h3>
        <p className="text-center text-lg text-secondary/80">
          Design your own Jeopardy games with custom categories and questions
        </p>
        <Button 
          onClick={() => navigate("/games/create")}
          className="w-full glass-card hover:bg-primary/20 text-lg py-4"
        >
          Start Creating
        </Button>
      </div>
    </div>
  );
};

export default Index;