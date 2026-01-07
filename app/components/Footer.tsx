import { Facebook, Instagram, ExternalLink, Smartphone } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="mt-auto pt-8  border-t border-[var(--border-primary)]">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">

                {/* Links Section */}
                <div className="flex flex-wrap justify-center gap-6">
                    <a
                        href="#"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--primary-400)] transition-colors"
                    >
                        <ExternalLink size={16} />
                        <span>Official Website</span>
                    </a>
                    <a
                        href="#"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--primary-400)] transition-colors"
                    >
                        <Smartphone size={16} />
                        <span>Play Store</span>
                    </a>
                    <a
                        href="#"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--primary-400)] transition-colors"
                    >
                        <Smartphone size={16} />
                        <span>App Store</span>
                    </a>
                </div>

                {/* Social Media Section */}
                <div className="flex items-center gap-4">
                    <a
                        href="https://instagram.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[#E1306C] hover:bg-[#E1306C]/10 transition-colors"
                        aria-label="Instagram"
                    >
                        <Instagram size={20} />
                    </a>
                    <a
                        href="https://facebook.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[#1877F2] hover:bg-[#1877F2]/10 transition-colors"
                        aria-label="Facebook"
                    >
                        <Facebook size={20} />
                    </a>
                </div>
            </div>

            <div className="mt-6 text-center text-sm text-[var(--text-tertiary)]">
                &copy; {new Date().getFullYear()} Hello Roomie. All rights reserved.
            </div>
        </footer>
    );
}
