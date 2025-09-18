export function PlaceholderText({ text }: { text: string }) {
    return (
        <div className="bg-neutral-800 text-white max-w-2/3 mx-auto text-center p-4  flex-row border-l-12 border-white min-h-full align-center flex items-center justify-center ">
            <div className="flex-1 max-w-70">{text}</div>
        </div> 
    );
}