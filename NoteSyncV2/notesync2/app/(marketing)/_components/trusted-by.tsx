'use client';

export const TrustedBy = () => {
    const companies = [
        "OpenAI",
        "Figma",
        "Vercel",
        "NVIDIA",
        "Cursor",
        "Perplexity"
    ];

    return (
        <div className="w-full border-t bg-background py-8 px-6">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                <p className="text-sm font-medium text-black whitespace-nowrap">
                    Trusted by top teams
                </p>
                <div className="flex items-center gap-8 md:gap-12 flex-wrap justify-center">
                    {companies.map((company, index) => (
                        <div
                            key={index}
                            className="text-sm font-semibold text-black hover:text-black transition-colors"
                        >
                            {company}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

