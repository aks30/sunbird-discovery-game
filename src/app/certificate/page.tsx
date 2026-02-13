
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGame } from '@/context/GameContext';
import Webcam from "react-webcam";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Camera, Download, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CertificatePage() {
    const router = useRouter();
    const { userName, setUserName, score, userPhoto, setUserPhoto, userEmail, setUserEmail } = useGame();

    const webcamRef = useRef<Webcam>(null);
    const certificateRef = useRef<HTMLDivElement>(null);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [showCertificate, setShowCertificate] = useState(false);
    const [emailInput, setEmailInput] = useState("");
    const [emailError, setEmailError] = useState("");
    const [containerWidth, setContainerWidth] = useState(800);
    const containerRef = useRef<HTMLDivElement>(null);
    const [showConsentModal, setShowConsentModal] = useState(false);

    useEffect(() => {
        const updateWidth = () => {
            if (containerRef.current) {
                setContainerWidth(containerRef.current.offsetWidth);
            }
        };

        window.addEventListener('resize', updateWidth);
        updateWidth();
        // Check again after a short delay for layout to settle
        const timer = setTimeout(updateWidth, 100);

        return () => {
            window.removeEventListener('resize', updateWidth);
            clearTimeout(timer);
        };
    }, [showCertificate]);

    const scale = Math.min(1, (containerWidth - 32) / 800); // 32px for padding
    const scaledHeight = scale < 1 ? 560 * scale : 'auto'; // Estimate height based on 800x560 landscape

    const validateEmail = (email: string) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleSnapClick = () => {
        if (!validateEmail(emailInput)) {
            setEmailError("Please enter a valid email address");
            return;
        }
        setShowConsentModal(true);
    };

    const handleConsentAccept = async () => {
        setShowConsentModal(false);
        if (!webcamRef.current) return;

        setIsSubmitting(true);
        const imageSrc = webcamRef.current.getScreenshot();
        setUserPhoto(imageSrc);
        setUserEmail(emailInput);

        try {
            // Send data to API (Local JSON)
            const response = await fetch('/api/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: userName,
                    email: emailInput,
                    score,
                    date: new Date().toISOString(),
                }),
            });

            if (response.ok) {
                setShowCertificate(true);
            } else {
                console.error("Failed to submit");
                setShowCertificate(true);
            }
        } catch (error) {
            console.error("Error submitting:", error);
            setShowCertificate(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleConsentDecline = () => {
        setShowConsentModal(false);
        router.push('/');
    };

    const downloadCertificate = async () => {
        if (!certificateRef.current) {
            console.error("Certificate ref is null");
            return;
        }

        console.log("Starting certificate download...");
        setIsDownloading(true);

        // Small delay to ensure rendering is complete
        await new Promise(resolve => setTimeout(resolve, 500));

        try {
            console.log("Generating canvas...");
            // Use a specific scale and ensure cross-origin is handled
            const canvas = await html2canvas(certificateRef.current, {
                scale: 3, // Higher scale for even better quality
                useCORS: true,
                backgroundColor: "#ffffff",
                scrollX: 0,
                scrollY: 0,
                windowWidth: 800, // Force desktop width for capture
                onclone: (clonedDoc) => {
                    const clonedElement = clonedDoc.getElementById('certificate-node-wrapper');
                    if (clonedElement) {
                        clonedElement.style.transform = 'none';
                        clonedElement.style.width = '800px';
                        clonedElement.style.margin = '0';
                    }
                }
            });

            console.log("Canvas generated. Size:", canvas.width, "x", canvas.height);
            const imgData = canvas.toDataURL("image/png");

            console.log("Creating PDF...");
            // Create PDF
            const pdf = new jsPDF({
                orientation: "landscape",
                unit: "px",
                format: [canvas.width, canvas.height],
            });

            pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
            console.log("Saving PDF...");
            pdf.save('sunbird-certificate.pdf');
            console.log("PDF saved successfully.");
        } catch (e) {
            console.error("PDF Gen Error:", e);
            alert("Could not generate PDF. Please try again. Error: " + (e instanceof Error ? e.message : String(e)));
        } finally {
            setIsDownloading(false);
        }
    };

    if (!userName) return null;

    if (showCertificate) {
        return (
            <div className="min-h-screen bg-sunbird-beige flex flex-col items-center py-12 px-4 font-sans overflow-x-hidden">
                <div className="w-full max-w-4xl flex flex-col items-center" ref={containerRef}>
                    <div
                        id="certificate-node-wrapper"
                        ref={certificateRef}
                        style={{
                            width: '800px',
                            height: '560px',
                            transform: `scale(${scale})`,
                            transformOrigin: 'top center',
                            marginBottom: scale < 1 ? `-${560 * (1 - scale)}px` : '0'
                        }}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative overflow-hidden w-full h-full"
                            id="certificate-node"
                            style={{ backgroundColor: '#FFFFFF', color: '#A36B41', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}
                        >
                            {/* Decorative Pattern Background - Use legacy-safe gradient */}
                            <div
                                className="absolute top-0 left-0 w-full h-4"
                                style={{ background: 'linear-gradient(to right, #A36B41, #FFCC66, #C98C56)' }}
                            />

                            <div
                                className="relative z-10 flex flex-col items-center text-center bg-white h-full justify-center"
                                style={{ border: '8px solid rgba(163, 107, 65, 0.1)', backgroundColor: '#FFFFFF', padding: '1.5rem', gap: '0.75rem' }}
                            >

                                {/* Header Logo - Only New Sunbird Logo */}
                                <div className="flex w-full justify-center items-center">
                                    <img
                                        src="/assets/sunbird-logo-new.png"
                                        alt="Sunbird"
                                        className="h-14 object-contain"
                                        crossOrigin="anonymous"
                                    />
                                </div>

                                <div className="h-px w-full max-w-md" style={{ backgroundColor: 'rgba(163, 107, 65, 0.2)' }}></div>

                                <div className="text-3xl font-bold tracking-wide uppercase font-serif" style={{ color: '#C98C56' }}>Certificate of Completion</div>

                                <p className="italic text-base" style={{ color: '#6B7280' }}>This certifies that</p>

                                <h1 className="text-4xl font-bold font-serif" style={{ color: '#A36B41' }}>{userName}</h1>

                                <p className="text-base max-w-xl mx-auto leading-snug px-4" style={{ color: '#374151' }}>
                                    has successfully completed the <span className="font-bold" style={{ color: '#C98C56' }}>Sunbird Discovery Game</span>, demonstrating knowledge of the open-source building blocks that power population-scale solutions.
                                </p>

                                <div className="flex justify-center items-center gap-8 w-full mt-2">
                                    {/* User Photo */}
                                    {userPhoto && (
                                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-sunbird-yellow shadow-lg relative">
                                            {/* Using standard img tag with crossOrigin for html2canvas compatibility */}
                                            <img
                                                src={userPhoto}
                                                alt="User"
                                                className="w-full h-full object-cover"
                                                crossOrigin="anonymous"
                                            />
                                        </div>
                                    )}

                                    {/* Signature / Date */}
                                    <div className="flex gap-8">
                                        <div className="flex flex-col items-center border-t-2 pt-2 px-6" style={{ borderTopColor: '#A36B41' }}>
                                            <span className="font-serif italic text-lg" style={{ color: '#A36B41' }}>The Sunbird Team</span>
                                        </div>

                                        <div className="flex flex-col items-center border-t-2 pt-2 px-6" style={{ borderTopColor: '#A36B41' }}>
                                            <span className="font-mono text-base" style={{ color: '#A36B41' }}>{new Date().toLocaleDateString()}</span>
                                            <span className="text-[10px] uppercase tracking-widest mt-1" style={{ color: '#9CA3AF' }}>Date Issued</span>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </motion.div>
                    </div>

                    <div className="mt-8 flex gap-4">
                        <button
                            onClick={downloadCertificate}
                            disabled={isDownloading}
                            className="flex items-center gap-2 bg-sunbird-orange hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1 transform disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isDownloading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Preparing...
                                </>
                            ) : (
                                <>
                                    <Download className="w-5 h-5" />
                                    Download Certificate
                                </>
                            )}
                        </button>
                        <button
                            onClick={() => router.push('/')}
                            className="flex items-center gap-2 bg-white text-sunbird-brown border-2 border-sunbird-brown hover:bg-sunbird-beige font-bold py-3 px-8 rounded-full transition-colors"
                        >
                            Start New Game
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-sunbird-beige text-sunbird-brown flex flex-col items-center justify-center p-4 font-sans">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-sunbird-brown/10"
            >
                <h2 className="text-3xl font-bold mb-8 text-center text-sunbird-brown">Claim Your Certificate</h2>

                <div className="space-y-6">
                    <div className="relative aspect-video bg-black rounded-2xl overflow-hidden border-4 border-sunbird-yellow shadow-inner">
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            videoConstraints={{ facingMode: "user" }}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none border-2 border-dashed border-white/30 m-6 rounded-xl">
                            <span className="bg-black/60 px-4 py-2 rounded-full text-white text-xs backdrop-blur-sm">Align face here</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-sunbird-brown/70 mb-2 uppercase tracking-wide">Email Address</label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={emailInput}
                            onChange={(e) => {
                                setEmailInput(e.target.value);
                                if (emailError) setEmailError("");
                            }}
                            className={`w-full bg-sunbird-beige border-2 rounded-xl p-4 text-sunbird-brown placeholder-gray-400 focus:outline-none transition-colors ${emailError ? 'border-red-500 focus:border-red-500' : 'border-sunbird-brown/20 focus:border-sunbird-orange'}`}
                        />
                        {emailError && (
                            <p className="text-red-500 text-xs mt-2 font-medium">{emailError}</p>
                        )}
                    </div>

                    <button
                        onClick={handleSnapClick}
                        disabled={!emailInput || !!emailError || isSubmitting}
                        className="w-full bg-sunbird-orange hover:bg-orange-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-orange-500/30 hover:-translate-y-0.5 transform"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Camera className="w-5 h-5" />
                                Snap & Get Certificate
                            </>
                        )}
                    </button>
                </div>
            </motion.div>

            {/* Privacy Consent Modal */}
            <AnimatePresence>
                {showConsentModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                        onClick={(e) => e.target === e.currentTarget && setShowConsentModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative"
                        >
                            <h3 className="text-2xl font-bold text-sunbird-brown mb-4">Privacy Notice</h3>

                            <div className="space-y-4 text-sunbird-brown/80 text-sm leading-relaxed mb-6">
                                <p>
                                    Before we generate your certificate, please note:
                                </p>

                                <ul className="space-y-2 list-disc list-inside">
                                    <li>Your <strong>name, email, and photo</strong> will be captured to create your personalized certificate</li>
                                    <li>Your <strong>name and email</strong> will be used to welcome you to the Sunbird Community</li>
                                    <li>Your <strong>photo and certificate</strong> will be deleted from our servers after generation—please download it if you'd like to keep a copy</li>
                                </ul>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleConsentDecline}
                                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-6 rounded-xl transition-colors"
                                >
                                    Decline
                                </button>
                                <button
                                    onClick={handleConsentAccept}
                                    className="flex-1 bg-sunbird-orange hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-lg"
                                >
                                    Accept & Continue
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
