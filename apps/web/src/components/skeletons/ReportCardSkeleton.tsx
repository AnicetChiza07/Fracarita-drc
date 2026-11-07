export default function ReportCardSkeleton() {
    return (
        <div className="bg-white rounded-3xl overflow-hidden border border-gray-200 flex flex-col">
            {/* Image placeholder */}
            <div className="relative aspect-[16/10] bg-gray-200 animate-pulse">
                <div className="absolute top-4 left-4 w-16 h-6 bg-gray-300 rounded-full animate-pulse" />
                <div className="absolute top-4 right-4 w-20 h-6 bg-gray-300 rounded-full animate-pulse" />
            </div>

            {/* Contenu */}
            <div className="p-6 flex flex-col flex-grow">
                <div className="w-full h-5 bg-gray-200 rounded mb-2 animate-pulse" />
                <div className="w-3/4 h-5 bg-gray-200 rounded mb-6 animate-pulse" />
                
                <div className="w-full h-3 bg-gray-200 rounded mb-2 animate-pulse" />
                <div className="w-5/6 h-3 bg-gray-200 rounded mb-6 animate-pulse" />

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-black/5 mt-auto">
                    <div className="w-20 h-3 bg-gray-200 rounded animate-pulse" />
                    <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
                </div>
            </div>
        </div>
    );
}