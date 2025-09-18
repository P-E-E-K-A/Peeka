import { PlaceholderText } from "../components/PlaceholderText";
import { TodoApp } from "../apps/TodoApp";
import HabitTracker from "../apps/HabitTracker";
import { Scheduler } from "../apps/SchedulerApp";
import  WeatherApp  from "../apps/WeatherApp";
import TimeAndDateApp from "../apps/TimeAndDateApp";
import  { Notes }  from "../apps/NotesApp";    

export default function GoalsSummary() {
    return (
        <div className="min-w-full flex flex-col">
            <div className="border-b-1 border-white pb-2">
                <h2 className="text-2xl font-bold mb-4">Goals</h2>
            </div>
            <section className="flex flex-row gap-2 py-4">
                <section className="flex flex-col gap-4 min-w-1/2">
                    <div className="flex justify-center">
                        <TodoApp />
                    </div>
                    <div className="flex justify-center">
                        <HabitTracker />
                    </div>
                    <div>
                        <PlaceholderText text="What do you plan to do today? Lets take our time." />
                    </div>
                    <div className="flex justify-center">
                        <Scheduler />
                    </div>
                </section>

                <div className="min-h-full min-w-0.5 bg-white"></div>

                <section className="flex flex-col gap-4 min-w-1/2">
                    <section className="flex  gap-4 w-full">
                        <WeatherApp />
                        <TimeAndDateApp />
                    </section>
                    <div>
                        <PlaceholderText text="Here you can jot down your thoughts, ideas, or anything else you'd like to remember." />
                    </div>
                    <Notes/>
                </section>
            </section>
        </div>
    );
}