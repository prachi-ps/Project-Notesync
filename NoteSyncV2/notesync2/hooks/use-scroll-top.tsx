//so that navbar doesn't go up when we scroll down, so that it remains on the screen

import { useState, useEffect } from "react";

export const useScrollTop = (threshold = 10) => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if(window.scrollY > threshold){
                setScrolled(true);                     //setScrolled = user has scrolled
            } else{
                setScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return() => window.removeEventListener("scroll", handleScroll);
    }, [threshold]);
    return scrolled;
}