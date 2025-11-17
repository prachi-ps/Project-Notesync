import { Footer } from "./_components/footer";
import { Heading } from "./_components/heading";
import { Heroes } from "./_components/heroes";
import { UIPreview } from "./_components/ui-preview";
import { TrustedBy } from "./_components/trusted-by";

const MarketingPage = () => {
    return ( 
        <div className="min-h-full flex flex-col bg-white dark:bg-gray-900 relative">
            {/* Hero Section */}
            <section className="flex flex-col items-center justify-center text-center gap-y-12 flex-1 px-6 py-12 relative z-10 pt-0">
                <Heading />
                <Heroes />
            </section>
            
            {/* Divider Line */}
            <div className="flex justify-center w-full py-8">
                <div className="w-1/2 h-1 bg-gray-300"></div>
            </div>
            
            {/* Preview Section */}
            <section id="preview" className="flex flex-col items-center justify-center px-6 py-20 relative scroll-mt-24">
                <div className="w-full max-w-7xl mx-auto mb-12">
                    <div className="text-center">
                        <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
                            See It In Action
                        </h2>
                        <p className="text-lg text-black max-w-2xl mx-auto">
                            Experience the power of NoteSync with our interactive preview
                        </p>
                    </div>
                </div>
                <UIPreview />
            </section>
            
            {/* Divider Line */}
            <div className="flex justify-center w-full py-8">
                <div className="w-1/2 h-1 bg-gray-300"></div>
            </div>
            
            {/* About Us Section */}
            <section id="about" className="w-full py-20 px-6 bg-gray-50/50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
                            About NoteSync
                        </h2>
                        <p className="text-lg text-black max-w-2xl mx-auto">
                            We're building the future of collaborative workspaces
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <h3 className="text-2xl font-semibold text-black">
                                Empowering Teams Worldwide
                            </h3>
                            <p className="text-black leading-relaxed">
                                NoteSync was born from a simple idea: teams should spend less time managing tools and more time creating. 
                                We've built a platform that seamlessly integrates note-taking, collaboration, and project management 
                                into one intuitive workspace.
                            </p>
                            <p className="text-black leading-relaxed">
                                Our mission is to help teams of all sizes work more efficiently, whether you're a startup of 7 or 
                                an enterprise of 700. With NoteSync, your team can capture knowledge, find answers instantly, and 
                                automate workflows without the busywork.
                            </p>
                        </div>
                        <div className="space-y-6">
                            <h3 className="text-2xl font-semibold text-black">
                                Built for Modern Teams
                            </h3>
                            <p className="text-black leading-relaxed">
                                We understand that modern teams need tools that adapt to their workflow, not the other way around. 
                                That's why NoteSync offers real-time collaboration, intelligent search, and powerful automation 
                                features that grow with your team.
                            </p>
                            <p className="text-black leading-relaxed">
                                From startups in Kothrud, Pune to global enterprises, thousands of teams trust NoteSync to power their 
                                daily work. Join us in redefining how teams collaborate and create together.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Divider Line */}
            <div className="flex justify-center w-full py-8">
                <div className="w-1/2 h-1 bg-gray-300"></div>
            </div>
            
            {/* Contact Section */}
            <section id="contact" className="w-full py-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
                            Get in Touch
                        </h2>
                        <p className="text-lg text-black max-w-2xl mx-auto">
                            Have questions? We'd love to hear from you.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-semibold text-black mb-2">Email</h3>
                                <a href="mailto:hello@notesync.com" className="text-black hover:text-black transition-colors">
                                    hello@notesync.com
                                </a>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-black mb-2">Office</h3>
                                <p className="text-black">
                                    7 Skyview Terrace<br />
                                    Aetheria, Cloudlands 98765<br />
                                    Republic of Imagination
                                </p>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-black mb-2">Follow Us</h3>
                                <div className="flex gap-4">
                                    <a href="#" className="text-black hover:text-black transition-colors">Twitter</a>
                                    <a href="#" className="text-black hover:text-black transition-colors">LinkedIn</a>
                                    <a href="#" className="text-black hover:text-black transition-colors">GitHub</a>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-black mb-2">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                                    placeholder="Your name"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-black mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                                    placeholder="your.email@example.com"
                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-black mb-2">
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    rows={5}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                                    placeholder="Your message"
                                />
                            </div>
                            <button className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200">
                                Send Message
                            </button>
                        </div>
                    </div>
                </div>
            </section>
            
            
            <TrustedBy />
            <Footer />
        </div> 
    ); 
}
  
export default MarketingPage;  