import { useAuth } from "../contexts/AuthContext";

export function WelcomeCard() {
  const { user } = useAuth();

  // Extract name from email using regex
  const extractNameFromEmail = (email: string): string => {
    // Remove everything after @ symbol
    const username = email.replace(/@.*$/, '');
    
    // Replace dots, underscores, hyphens, and numbers with spaces
    const cleanName = username.replace(/[._\-0-9]+/g, ' ');
    
    // Split into words and capitalize each word
    const formattedName = cleanName
      .trim()
      .split(/\s+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
    
    return formattedName || 'User';
  };

  return (
    <div className="flex flex-col bg-white w-full">
      {user ? (
        <>
          <h2 className="text-xl font-bold ">
            Welcome, {extractNameFromEmail(user.email ?? '')}!
          </h2>
        </>
      ) : (
        <h2 className="text-2xl font-bold">Welcome to Our Application!</h2>
      )}
    </div>
  );
}