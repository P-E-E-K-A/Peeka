export function TodoApp() {
    return (
        <div className="bg-gray-400 min-w-auto text-xs">
            <h3 className="text-xl font-bold mb-4">Tasks</h3>
            <section className="overflow-y-auto max-h-48">
                <ul>
                    <li className="flex border-b border-gray-300 py-2 justify-between px-2">Task 1 <input type="checkbox" name="task1" id="task1" /></li>
                    <li className="flex border-b border-gray-300 py-2 justify-between px-2">Task 2 <input type="checkbox" name="task2" id="task2" /></li>
                    <li className="flex border-b border-gray-300 py-2 justify-between px-2">Task 3 <input type="checkbox" name="task3" id="task3" /></li>
                    <li className="flex border-b border-gray-300 py-2 justify-between px-2">Task 4 <input type="checkbox" name="task4" id="task4" /></li>
                    <li className="flex border-b border-gray-300 py-2 justify-between px-2">Task 5 <input type="checkbox" name="task5" id="task5" /></li>
                    <li className="flex border-b border-gray-300 py-2 justify-between px-2">Task 6 <input type="checkbox" name="task6" id="task6" /></li>
                    <li className="flex border-b border-gray-300 py-2 justify-between px-2">Task 7 <input type="checkbox" name="task7" id="task7" /></li>
                    <li className="flex border-b border-gray-300 py-2 justify-between px-2">Task 8 <input type="checkbox" name="task8" id="task8" /></li>
                </ul>
            </section>
            <footer className="flex mt-2 px-2 justify-between gap-2">
                <input type="text" placeholder="Add a new task" className="py-1 px-4 w-full" />
                <button className="bg-blue-500 text-white py-1 px-4 rounded">Add</button>
            </footer>
        </div>
    );
}