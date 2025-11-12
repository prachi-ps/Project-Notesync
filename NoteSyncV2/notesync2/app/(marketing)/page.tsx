import { Footer } from "./_components/footer";
import { Heading } from "./_components/heading";
import { Heroes } from "./_components/heroes";
import { UIPreview } from "./_components/ui-preview";
import { TrustedBy } from "./_components/trusted-by";

const MarketingPage = () => {
    return ( 
        <div className="min-h-full flex flex-col bg-white dark:bg-gray-900 relative">
            {/* Subtle side decorations */}
            <div className="hidden lg:block fixed left-0 top-1/4 w-96 h-96 opacity-5 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full blur-3xl" />
            </div>
            <div className="hidden lg:block fixed right-0 top-1/2 w-96 h-96 opacity-5 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-3xl" />
            </div>
            
            <div className="flex flex-col items-center justify-center text-center gap-y-12 flex-1 px-6 py-12 relative z-10">
                <Heading />
                <Heroes />
                <UIPreview />
            </div>
            
            <TrustedBy />
            <Footer />
        </div> 
    ); 
}
  
export default MarketingPage;  