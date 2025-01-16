"use client"

import Link from "next/link"
import { CenterUnderline, ComesInGoesOutUnderline, GoesOutComesInUnderline } from "@/components/ui/underline-animation"

export function Footer() {
  return (
    <footer className="w-full bg-black/50 border-t border-[#15397F] backdrop-blur-lg">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          {/* Contact Section */}
          <div className="space-y-4">
            <h3 className="text-[#FFDA00] font-semibold text-lg">Contact</h3>
            <ul className="space-y-2">
              <li>
                <Link href="mailto:contact@rocketportal.com">
                  <GoesOutComesInUnderline
                    label="contact@rocketportal.com"
                    direction="left"
                  />
                </Link>
              </li>
              <li>
                <Link href="mailto:support@rocketportal.com">
                  <GoesOutComesInUnderline
                    label="support@rocketportal.com"
                    direction="right"
                  />
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-[#FFDA00] font-semibold text-lg">Follow Us</h3>
            <ul className="space-y-2">
              <li>
                <Link href="https://linkedin.com" target="_blank">
                  <CenterUnderline label="LINKEDIN" />
                </Link>
              </li>
              <li>
                <Link href="https://twitter.com" target="_blank">
                  <ComesInGoesOutUnderline label="X (TWITTER)" direction="left" />
                </Link>
              </li>
              <li>
                <Link href="https://instagram.com" target="_blank">
                  <ComesInGoesOutUnderline label="INSTAGRAM" direction="right" />
                </Link>
              </li>
            </ul>
          </div>
        </div>
        {/* Copyright */}
        <div className="mt-12 pt-4 border-t border-[#15397F]/30 text-center text-sm text-[#15397F]">
          <p>© {new Date().getFullYear()} Rocket Portal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
} 