import { Calendar } from "../apps/CalenderApp";

export default function GoalsSummary() {
    return (
        <div className="min-w-full flex flex-col">
            <div>
                <Calendar />
                <h1 className="text-2xl font-bold mb-4">Goals Summary</h1>
            </div>
            
        </div>
    );
}
 