import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import IntroSection from "@/components/IntroSection";
import ClassesSection from "@/components/ClassesSection";
import Marquee from "@/components/Marquee";
import ArtGallery from "@/components/ArtGallery";
import DanceShowcase from "@/components/DanceShowcase";
import WhyLearnHere from "@/components/WhyLearnHere";
import InstagramGallery from "@/components/InstagramGallery";
import EnquiryForm from "@/components/EnquiryForm";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useSmoothAnchors } from "@/hooks";

const DISCIPLINES = [
    "Drawing",
    "Painting",
    "Art & Craft",
    "Dance",
    "Zumba",
    "Choreography",
];

/**
 * Home — the single-page composition.
 *
 * Section order matches the brief (A → J) and every id used by the navbar:
 *   home · art (classes) · dance · gallery · about (intro) · contact
 * plus the extra anchors: classes, art-detail, why, instagram, enquiry.
 */
export default function Home() {
    useSmoothAnchors(true);

    return (
        <>
            <ScrollProgress />
            <Navbar />
            <main id="main">
                <Hero />
                <IntroSection />
                <ClassesSection />
                <Marquee items={DISCIPLINES} tone="art" />
                <ArtGallery />
                <DanceShowcase />
                <WhyLearnHere />
                <InstagramGallery />
                <EnquiryForm />
                <ContactSection />
            </main>
            <Footer />
            <WhatsAppButton />
        </>
    );
}
