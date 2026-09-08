"use client";

import React, { useEffect, useState } from "react";
import { Lottie } from "lottie-react";
import dogAnimation from "@/public/long-dog.json";

interface PuppyLoaderProps {
  title?: string;
  subtitle?: string;
  size?: "sm" | "md" | "lg" | "fullscreen";
}

export default function PuppyLoader({
  title = "Loading...",
  subtitle = "Sniffing out the details...",
  size = "md",
}: PuppyLoaderProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const sizeClasses = {
    sm: "w-36 h-36",
    md: "w-52 h-52",
    lg: "w-64 h-64",
    fullscreen: "w-64 h-64",
  };

  const containerClasses =
    size === "fullscreen"
      ? "min-h-[60vh] flex flex-col items-center justify-center p-6 text-center"
      : "flex flex-col items-center justify-center p-8 text-center my-auto";

  return (
    <div className={containerClasses}>
      <div className={`relative flex items-center justify-center ${sizeClasses[size]}`}>
        {/* Soft emerald ambient glow fitting the app theme */}
        <div className="absolute inset-0 rounded-full bg-emerald-500/10 blur-2xl animate-pulse" />
        
        {mounted ? (
          <Lottie
            src={dogAnimation}
            loop={true}
            autoplay={true}
            className="w-full h-full relative z-10 drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-10 h-10 border-2 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin" />
          </div>
        )}
      </div>

      {(title || subtitle) && (
        <div className="mt-4 space-y-1.5 z-10">
          {title && (
            <h3 className="text-xs font-semibold tracking-widest text-zinc-300 uppercase">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-xs text-zinc-400 flex items-center justify-center gap-1.5">
              <span>{subtitle}</span>
              <span className="inline-flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" />
              </span>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
