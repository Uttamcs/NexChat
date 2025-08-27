import React from "react";

const Footer = () => {
    return (
        <footer className="hidden sm:flex footer footer-horizontal justify-center items-center bg-base-300 text-base-content p-4">
            <aside>
                <p className="text-center">
                    Copyright © {new Date().getFullYear()} - Made with ❤️ by{" "}
                    <a
                        href="https://uttamroy01-portfolio.web.app/"
                        target="_blank"
                        className="font-semibold hover:text-primary transition"
                    >
                        Uttam Roy
                    </a>
                </p>
            </aside>
        </footer>
    );
};

export default Footer;
