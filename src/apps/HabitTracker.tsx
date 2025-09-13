import { PlusIcon } from "lucide-react";

export function HabitTracker() {
    return (
        <div className="bg-gray-400 min-w-auto text-xs">
            <h3 className="text-xl font-bold mb-4">Habits</h3>
            <section className="overflow-y-auto max-h-48">
                <ul>
                    <li className="flex border-b border-gray-300 py-2 justify-between px-2">Read a book <input type="checkbox" name="task1" id="task1" /></li>
                    <li className="flex border-b border-gray-300 py-2 justify-between px-2">Exercise for 30 minutes <input type="checkbox" name="task2" id="task2" /></li>
                    <li className="flex border-b border-gray-300 py-2 justify-between px-2">Meditate for 10 minutes <input type="checkbox" name="task3" id="task3" /></li>
                    <li className="flex border-b border-gray-300 py-2 justify-between px-2">Drink 2 liters of water <input type="checkbox" name="task4" id="task4" /></li>
                </ul>
            </section>
            <footer className="flex mt-2 px-2 justify-between gap-2">
                <input type="text" placeholder="Add a new Habit" className="py-1 px-4 w-full" />
                <button className="bg-blue-500 text-white px-1 py-1 rounded-full">
                    <PlusIcon  className="w-5 h-5 text-white"/>
                </button>
            </footer>
        </div>
    );
}