import { useAuth } from "../contexts/AuthContext";

export function WelcomeCard() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col bg-neutral-800 w-full">
      {user ? (
        <>
          <h2 className="text-xl font-bold ">
            Welcome, {user?.user_metadata?.full_name || 'User'}&nbsp;!
          </h2>
        </>
      ) : (
        <h2 className="text-2xl font-bold">Welcome to Our Application!</h2>
      )}
    </div>
  );
}