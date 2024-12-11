import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/context/UserContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, setUser } = useUser();

  useEffect(() => {
    const fetchUser = async () => {
      const email = localStorage.getItem("userEmail");
      if (email) {
        const { data: userData, error } = await supabase
          .from('users')
          .select('username, role')
          .eq('email', email)
          .single();

        if (error) {
          console.error("Error fetching user role:", error);
        } else {
          setUser(userData);
        }
      }
    };

    fetchUser();
  }, [setUser]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error);
    } else {
      setUser(null);
      localStorage.removeItem("userEmail");
      navigate("/login");
    }
  };

  return (
    <>
      {user && (
        <div className="flex justify-between p-2 w-full">
          {user.role === 'admin' && (
            <Button
              onClick={() => navigate("/admin")}
              className="glass-card hover:bg-primary/20 text-xl px-8 py-6 transform hover:scale-105 transition-all duration-300"
            >
              Admin
            </Button>
          )}
          <Button
            onClick={handleLogout}
            className="glass-card hover:bg-primary/20 text-xl px-8 py-6 transform hover:scale-105 transition-all duration-300"
          >
            Logout
          </Button>
        </div>
      )}

      <div className="relative flex justify-between items-center py-1 px-4">
        <div className="flex gap-6">
          {user ? (
            <div className="text-xl px-8 py-6">
              Hello, {user.username}
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </>
  );
}