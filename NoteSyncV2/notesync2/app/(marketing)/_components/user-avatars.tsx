'use client';

import { BookOpen, Lightbulb, HardHat, Headphones, CheckSquare } from "lucide-react";

export const UserAvatars = () => {
    const avatars = [
        { icon: BookOpen, bg: "bg-blue-500", text: "text-white" },
        { icon: null, bg: "bg-gray-200", text: "text-gray-600", emoji: "👤" },
        { icon: null, bg: "bg-gray-300", text: "text-gray-700", emoji: "👨" },
        { icon: Lightbulb, bg: "bg-orange-500", text: "text-white" },
        { icon: HardHat, bg: "bg-yellow-400", text: "text-white" },
        { icon: Headphones, bg: "bg-blue-400", text: "text-white" },
        { icon: null, bg: "bg-gray-200", text: "text-gray-600", emoji: "👩" },
        { icon: CheckSquare, bg: "bg-green-500", text: "text-white" },
    ];

    return (
        <div className="flex items-center justify-center gap-3 mb-8">
            {avatars.map((avatar, index) => {
                const Icon = avatar.icon;
                return (
                    <div
                        key={index}
                        className={`w-12 h-12 rounded-full ${avatar.bg} ${avatar.text} flex items-center justify-center text-lg shadow-sm border-2 border-white`}
                    >
                        {Icon ? <Icon className="h-6 w-6" /> : <span>{avatar.emoji}</span>}
                    </div>
                );
            })}
        </div>
    );
};

