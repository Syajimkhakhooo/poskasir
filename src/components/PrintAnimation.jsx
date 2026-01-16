import { Printer } from 'lucide-react';

const PrintAnimation = () => {
    return (
        <div className="flex flex-col items-center justify-center py-8">
            <div className="relative">
                {/* Printer */}
                <div className="bg-gray-800 dark:bg-gray-700 rounded-lg p-6 shadow-lg">
                    <Printer className="w-16 h-16 text-gray-300" />
                </div>

                {/* Paper coming out */}
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-12 h-20 bg-white border-2 border-gray-300 rounded-sm shadow-md animate-print">
                    <div className="p-1 space-y-1">
                        <div className="h-1 bg-gray-300 rounded"></div>
                        <div className="h-1 bg-gray-300 rounded w-3/4"></div>
                        <div className="h-1 bg-gray-300 rounded w-1/2"></div>
                    </div>
                </div>
            </div>

            <p className="mt-16 text-gray-600 dark:text-gray-400 font-medium animate-pulse">
                Mencetak struk...
            </p>
        </div>
    );
};

export default PrintAnimation;
