"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { contactLinks } from "@/data/site";

/**
 * WhatsAppButton — floating chip, hidden while the mobile menu is open
 * (menu locks scroll and covers full screen beneath the header anyway).
 * Deep-links to the institute's verified WhatsApp line.
 */
export default function WhatsAppButton() {
  const reduce = useReducedMotion();
  return (
    <motion.a
      href={contactLinks.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with the institute on WhatsApp"
      initial={reduce ? false : { opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.8 }}
      whileHover={reduce ? undefined : { scale: 1.06 }}
      className="fixed bottom-5 right-5 z-40 grid h-13 w-13 place-items-center rounded-full bg-[#25d366] text-white shadow-[0_16px_36px_-12px_rgba(37,211,102,0.55)]"
      style={{ height: "3.25rem", width: "3.25rem" }}
    >
      <MessageCircle className="h-6 w-6" aria-hidden="true" />
    </motion.a>
  );
}
