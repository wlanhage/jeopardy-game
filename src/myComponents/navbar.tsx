import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      console.log("Fetched user:", user); // Log the user object to see its structure

      if (user) {
        // Fetch the user's role from the database
        const { data: userData, error } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error("Error fetching user role:", error);
        } else {
          console.log("Fetched user role:", userData.role);
          setUser({ ...user, role: userData.role });
        }
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error);
    } else {
      setUser(null);
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
            Hello, {user.user_metadata.username}
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