//Landing Page Navbar

import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "./_components/navbar"

const MarketingLayout = ({
    children
}: {
    children: React.ReactNode
}) => {
    return (
        <div className="h-full ">
            <Navbar /> 
            <main className="h-full pt-40">
                {children} 
            </main>
            <Toaster position="top-center" />
        </div>
    )
}

export default MarketingLayout;