//Components import
import { WelcomeCard } from "../components/WelcomCard";



// Section imports
import GoalsSummary from "../sections/GoalsSummary";
// Local dashboard content component
export function DashboardContent() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        <WelcomeCard />
      </h1>
      <div className="flex flex-col">
        <div>
          <GoalsSummary />
        </div>
        <div className="bg-neutral-800 p-6">
          <h3 className="text-lg font-semibold mb-2 text-white">Quick Stats</h3>
          <p className="text-gray-600">View your latest metrics here.</p>
        </div>
        <div className="bg-neutral-800 p-6">
          <h3 className="text-lg font-semibold mb-2 text-white">Recent Activity</h3>
          <p className="text-gray-600">See what's been happening.</p>
        </div>
      </div>
    </div>
  );
}
 