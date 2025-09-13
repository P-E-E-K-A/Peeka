import { Calendar } from "../apps/CalenderApp";
import { TodoApp } from "../apps/TodoApp";
import HabitTracker from "../apps/HabitTracker";
import { Scheduler } from "../apps/SchedulerApp";

export default function GoalsSummary() {
    return (
        <div className="min-w-full flex flex-col">
            <h2 className="text-2xl font-bold mb-4">Goals Summary</h2>
            <section className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
                <div>
                    <TodoApp />
                </div>
                <div>
                    <HabitTracker />
                </div>
                <section className="flex flex-col gap-2">
                    <div className="h-auto max-w-64">
                        <Calendar />
                    </div>
                    <div>
                        <Scheduler />
                    </div>
                </section>
                

            </section>
        </div>
    );
}
