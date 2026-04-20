"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Home, MessageSquare, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: "var(--lyra-primary-bg)" }}
    >
      <div className="text-center max-w-md">
        {/* Floating stars */}
        <div className="relative mb-6 h-12">
          <span className="absolute left-1/4 text-3xl animate-float" style={{ animationDelay: "0s" }}>✦</span>
          <span className="absolute right-1/3 text-xl animate-float opacity-60" style={{ animationDelay: "0.6s" }}>✦</span>
          <span className="absolute right-1/4 text-2xl animate-float opacity-40" style={{ animationDelay: "1.2s" }}>✦</span>
        </div>

        {/* 404 display */}
        <div className="mb-2">
          <span className="text-8xl font-extrabold lyra-gradient-text">404</span>
        </div>
        <div className="mb-6">
          <span className="text-4xl">♪</span>
        </div>

        <h1 className="text-2xl font-bold mb-3" style={{ color: "var(--lyra-text-primary)" }}>
          Lost in the cosmos
        </h1>
        <p className="text-sm leading-relaxed mb-8" style={{ color: "var(--lyra-text-secondary)" }}>
          This page doesn&apos;t exist in any constellation we know of.
          Maybe it moved, maybe it never existed — either way, the stars
          have no record of it.
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            size="lg"
            icon={<MessageSquare size={18} />}
            onClick={() => router.push("/chat")}
          >
            Open Lyra
          </Button>
          <Button
            variant="secondary"
            size="lg"
            icon={<Home size={18} />}
            onClick={() => router.push("/")}
          >
            Go Home
          </Button>
          <Button
            variant="ghost"
            size="lg"
            icon={<ArrowLeft size={18} />}
            onClick={() => router.back()}
          >
            Go Back
          </Button>
        </div>

        {/* Footer note */}
        <p className="mt-10 text-xs" style={{ color: "var(--lyra-text-muted)" }}>
          ♪ Lyra — named after the constellation
        </p>
      </div>
    </div>
  );
}
