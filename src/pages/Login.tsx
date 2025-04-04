import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import bcrypt from 'bcryptjs';
import { useUser } from "@/context/UserContext";

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Fetch the user from the custom users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, username, password_hash, role')
      .eq('email', email)
      .single();

    if (userError || !userData) {
      setError("Invalid email or password.");
      return;
    }

    // Compare the provided password with the stored password hash
    const isPasswordValid = await bcrypt.compare(password, userData.password_hash);

    if (!isPasswordValid) {
      setError("Invalid email or password.");
      return;
    }

    // Set the user in the context
    setUser(userData);
    localStorage.setItem("userEmail", email);
    navigate('/games');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-md p-8 space-y-6 animate-fade-in">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Welcome Back</h2>
          <p className="text-muted-foreground mt-2">Login to your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="glass-card"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="glass-card"
              required
            />
          </div>

          {error && <p className="text-red-500">{error}</p>}

          <Button type="submit" className="w-full glass-card hover:bg-primary/20">
            Login
          </Button>
        </form>

        <div className="text-center">
          <button
            onClick={() => navigate("/register")}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Don't have an account? Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;