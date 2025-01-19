import React from "react";
import './footer.css';

export default function Footer() {
    return (
        <footer class="footer">
            <div class="footer-content">
                <div class="footer-about">
                    <h4>About MazdoorMitr</h4>
                    <p>Connecting laborers and workers with opportunities seamlessly.</p>
                </div>
                <div class="footer-links">
                    <h4>About Us</h4>
                    <ul>
                        <li><a href="/privacy-policy">Privacy Policy</a></li>
                        <li><a href="/terms-and-conditions">Terms & Conditions</a></li>
                        <li><a href="/about">Our Story</a></li>
                        <li><a href="/contact">Contact Us</a></li>
                    </ul>
                </div>
                <div class="footer-social">
                    <h4>Follow Us</h4>
                    <a href="https://facebook.com/mazdoormitr" target="_blank">Facebook</a>
                    <a href="https://twitter.com/mazdoormitr" target="_blank">Twitter</a>
                    <a href="https://linkedin.com/company/mazdoormitr" target="_blank">LinkedIn</a>
                </div>
            </div>
            <div class="footer-legal">
                <p>© 2025 MazdoorMitr. All rights reserved.</p>
            </div>
        </footer>

    )
}