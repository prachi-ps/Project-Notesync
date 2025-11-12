import { Button } from "@/components/ui/button"
import { Logo } from "./logo"

export const Footer = () => {
    return(
        <div className="flex items-center w-full p-6 bg-background z-50">
            <Logo />
            <div className="md:ml-auto w-full justify-between md:justify-end flex items-center gap-x-2 text-black">
                <Button variant="ghost" size="sm" className="text-black hover:text-black">
                    Privacy Policy    
                </Button>              
                <Button variant="ghost" size="sm" className="text-black hover:text-black">
                    Terms and conditions     
                </Button>         
            </div>
        </div>
    )
}