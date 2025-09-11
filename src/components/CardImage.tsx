export function CardImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="flex justify-center h-64 bg-gray-200 overflow-hidden">
      <img 
        className="w-full h-full object-cover shadow-md" 
        src={src} 
        alt={alt} 
      />
    </div>
  );
}