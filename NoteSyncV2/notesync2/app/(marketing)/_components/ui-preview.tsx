'use client';

export const UIPreview = () => {
    return (
        <div className="w-full max-w-7xl mx-auto mt-12 px-4">
            <div className="relative rounded-lg border-2 border-border bg-white shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-5 bg-white border-b">
                    <h1 className="text-xl font-semibold">John's Space</h1>
                    <div className="flex items-center gap-3">
                        <div className="text-sm text-muted-foreground">Home / doc / Project Plan</div>
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center overflow-hidden border-2 border-white text-white text-xs font-semibold">
                            J
                        </div>
                    </div>
                </div>
                
                {/* Main Content - Sidebar + Document Area */}
                <div className="flex h-[500px] md:h-[600px]">
                    {/* Sidebar */}
                    <div className="w-48 bg-gray-200 p-4 space-y-4 border-r">
                        <div className="w-full h-9 bg-primary rounded text-white text-sm font-medium flex items-center justify-center cursor-pointer hover:bg-primary/90 transition">
                            New Document
                        </div>
                        <div className="space-y-3">
                            <h2 className="text-gray-500 font-semibold text-xs">My Documents</h2>
                            <div className="space-y-2">
                                <div className="border border-gray-400 p-2 rounded-md bg-gray-300">
                                    <p className="text-sm truncate font-semibold">Project Plan</p>
                                </div>
                                <div className="border border-gray-400 p-2 rounded-md hover:bg-gray-100 cursor-pointer">
                                    <p className="text-sm truncate">Meeting Notes</p>
                                </div>
                                <div className="border border-gray-400 p-2 rounded-md hover:bg-gray-100 cursor-pointer">
                                    <p className="text-sm truncate">Team Roadmap</p>
                                </div>
                            </div>
                            <h2 className="text-gray-500 font-semibold text-xs pt-2">Shared with me</h2>
                            <div className="space-y-2">
                                <div className="border border-gray-400 p-2 rounded-md hover:bg-gray-100 cursor-pointer">
                                    <p className="text-sm truncate">Design System</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Document Editor Area */}
                    <div className="flex-1 bg-gray-100 overflow-y-auto">
                        <div className="h-full bg-white m-4 rounded-lg shadow-sm">
                            {/* Document Title Section */}
                            <div className="flex justify-center items-center w-full max-w-3xl mx-auto gap-2 py-3 px-4 border-b">
                                <input 
                                    type="text" 
                                    value="Project Plan - Q1 2024"
                                    readOnly
                                    className="flex-1 h-9 px-3 bg-gray-50 rounded border text-sm"
                                />
                                <button className="h-9 w-20 bg-primary text-white text-xs rounded hover:bg-primary/90 transition">
                                    Update
                                </button>
                                <button className="h-9 w-24 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300 transition">
                                    Invite
                                </button>
                                <button className="h-9 w-24 bg-red-100 text-red-700 text-xs rounded hover:bg-red-200 transition">
                                    Delete
                                </button>
                            </div>
                            
                            {/* Avatars and Tools */}
                            <div className="flex max-w-6xl mx-auto justify-between items-center px-4 py-3 border-b">
                                <div className="flex items-center gap-3">
                                    <p className="font-light text-xs text-muted-foreground">Users currently editing:</p>
                                    <div className="flex -space-x-3">
                                        <div className="w-8 h-8 rounded-full border-2 border-white bg-green-500 flex items-center justify-center text-white text-xs font-semibold">
                                            S
                                        </div>
                                        <div className="w-8 h-8 rounded-full border-2 border-white bg-purple-500 flex items-center justify-center text-white text-xs font-semibold">
                                            M
                                        </div>
                                        <div className="w-8 h-8 rounded-full border-2 border-white bg-pink-500 flex items-center justify-center text-white text-xs font-semibold">
                                            E
                                        </div>
                                    </div>
                                </div>
                                <button className="h-8 w-32 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300 transition">
                                    Manage Users
                                </button>
                            </div>
                            
                            {/* Editor Content */}
                            <div className="max-w-6xl mx-auto">
                                {/* Action Buttons */}
                                <div className="flex items-center gap-2 max-w-4xl justify-end mb-6 px-8 pt-4">
                                    <button className="h-9 px-4 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300 transition">
                                        Chat
                                    </button>
                                    <button className="h-9 px-4 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300 transition">
                                        Translate
                                    </button>
                                    <button className="h-9 w-9 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition flex items-center justify-center">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                        </svg>
                                    </button>
                                </div>
                                
                                {/* Editor Blocks */}
                                <div className="px-8 pb-8 space-y-4 max-w-4xl mx-auto">
                                    {/* Heading */}
                                    <h1 className="text-3xl font-bold pt-2">Project Overview</h1>
                                    
                                    {/* Paragraph */}
                                    <div className="space-y-2 pt-2 text-gray-700">
                                        <p className="leading-relaxed">This document outlines our Q1 2024 project plan and strategic initiatives. We'll be focusing on improving collaboration, enhancing user experience, and delivering value to our customers.</p>
                                    </div>
                                    
                                    {/* Another Heading */}
                                    <h2 className="text-2xl font-semibold pt-6">Key Objectives</h2>
                                    
                                    {/* Bullet Points */}
                                    <ul className="space-y-2 pt-2 pl-6 list-disc text-gray-700">
                                        <li>Launch new collaboration features by end of Q1</li>
                                        <li>Improve platform performance and reliability</li>
                                        <li>Onboard 500+ new active users</li>
                                    </ul>
                                    
                                    {/* Paragraph */}
                                    <div className="space-y-2 pt-4 text-gray-700">
                                        <p className="leading-relaxed">Our team is committed to delivering exceptional results. We'll be working closely with stakeholders to ensure alignment and transparency throughout the quarter.</p>
                                    </div>
                                    
                                    {/* Quote Block */}
                                    <div className="pt-4">
                                        <div className="bg-gray-50 rounded border-l-4 border-primary/30 p-4 space-y-2 italic text-gray-600">
                                            <p>"Success is not final, failure is not fatal: it is the courage to continue that counts."</p>
                                            <p className="text-sm not-italic text-gray-500">- Winston Churchill</p>
                                        </div>
                                    </div>
                                    
                                    {/* More Paragraph */}
                                    <div className="space-y-2 pt-4 text-gray-700">
                                        <p className="leading-relaxed">Let's make this quarter our best one yet. Together, we can achieve great things and push the boundaries of what's possible.</p>
                                    </div>
                                    
                                    {/* Cursor/Active Line */}
                                    <div className="pt-2 flex items-center gap-1">
                                        <div className="h-5 w-0.5 bg-primary animate-pulse"></div>
                                        <span className="text-gray-400 text-sm">Start typing...</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

