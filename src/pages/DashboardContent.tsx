//Components import
import { WelcomeCard } from "../components/WelcomCard";

// Tests
import { CustomButton } from "../components/CustomButton";

// Section imports
import GoalsSummary from "../sections/GoalsSummary";

// Local dashboard content component
export function DashboardContent() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        <WelcomeCard />
      </h1>
      <div className="flex flex-col space-y-6">
        <div>
          <GoalsSummary />
        </div>
        <div className="bg-neutral-800 p-6 rounded-lg border border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-white">Quick Stats</h3>
              <p className="text-gray-400">View your latest metrics here.</p>
            </div>
            <CustomButton variant="primary" size="sm">
              View Details
            </CustomButton>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-700 last:border-b-0">
              <span className="text-gray-400">Active Goals</span>
              <span className="text-white font-medium">12</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-700 last:border-b-0">
              <span className="text-gray-400">Tasks Due Today</span>
              <span className="text-white font-medium">3</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-700 last:border-b-0">
              <span className="text-gray-400">Documents</span>
              <span className="text-white font-medium">24</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-gray-400">Revenue</span>
              <span className="text-white font-medium">$2,450</span>
            </div>
          </div>
        </div>
        <div className="bg-neutral-800 p-6 rounded-lg border border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-white">Recent Activity</h3>
              <p className="text-gray-400">See what's been happening.</p>
            </div>
            <CustomButton variant="primary" size="sm">
              View All
            </CustomButton>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-3 border-b border-gray-700 last:border-b-0">
              <span className="text-gray-400">Task completed</span>
              <span className="text-gray-500">2h ago</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-700 last:border-b-0">
              <span className="text-gray-400">Goal updated</span>
              <span className="text-gray-500">1d ago</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-700 last:border-b-0">
              <span className="text-gray-400">Document added</span>
              <span className="text-gray-500">3d ago</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-gray-400">Meeting scheduled</span>
              <span className="text-gray-500">5d ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}