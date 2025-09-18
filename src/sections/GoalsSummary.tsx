
import { TodoApp } from "../apps/TodoApp";
import HabitTracker from "../apps/HabitTracker";
import { Scheduler } from "../apps/SchedulerApp";
import  WeatherApp  from "../apps/WeatherApp";
import TimeAndDateApp from "../apps/TimeAndDateApp";

export default function GoalsSummary() {
    return (
        <div className="min-w-full flex flex-col">
            <h2 className="text-2xl font-bold mb-4">Goals</h2>

            <section className="flex flex-row gap-2 py-4">
                <section className="flex flex-col gap-4 min-w-1/2">
                    <div className="flex justify-center">
                        <TodoApp />
                    </div>
                    <div className="flex justify-center">
                        <HabitTracker />
                    </div>
                    <div className="flex justify-center">
                        <Scheduler />
                    </div>
                </section>

                <div className="min-h-full min-w-0.5 bg-white"></div>

                <section className="flex flex-row gap-4 min-w-1/2">
                    <WeatherApp />
                    <TimeAndDateApp />
                </section>
            </section>
        </div>
    );
}