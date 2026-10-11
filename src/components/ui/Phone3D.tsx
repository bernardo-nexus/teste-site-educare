import { motion, type MotionValue, useTransform } from 'framer-motion';
import type { ReactNode } from 'react';

import icon from '../../assets/icon-192.png';

/*
 * iPhone 17 Pro Max, built in CSS 3D.
 * Proportions follow the real device (163.4 × 78 mm). The front face holds the app screen,
 * the back face has the 17 Pro full-width camera plateau, and a stack of thin slices
 * between them gives the aluminium frame real thickness while it turns.
 */

const DEPTH_SLICES = 10; // ~8.75 mm body, rendered as stacked slices
const SLICE_GAP = 1.1; // px between slices

interface Phone3DProps {
  /** Rotation around the vertical axis, in degrees. */
  rotateY: MotionValue<number>;
  /** Content shown on the screen (front face). */
  screen: ReactNode;
  className?: string;
}

export function Phone3D({ rotateY, screen, className }: Phone3DProps) {
  // A light tilt that follows the spin, so the turn reads as a hand-held motion
  const rotateX = useTransform(rotateY, (v) => Math.sin((v * Math.PI) / 180) * 6);
  // Specular sweep across the glass as the device turns
  const sheen = useTransform(rotateY, (v) => {
    const x = 50 + Math.sin((v * Math.PI) / 180) * 70;
    return `linear-gradient(105deg, transparent ${x - 25}%, rgb(255 255 255 / 0.55) ${x}%, transparent ${x + 25}%)`;
  });

  return (
    <div className={className} style={{ perspective: '1800px' }}>
      <motion.div
        className="relative aspect-[78/163.4] w-full"
        style={{ rotateY, rotateX, transformStyle: 'preserve-3d' }}
      >
        {/* Frame thickness */}
        {Array.from({ length: DEPTH_SLICES }).map((_, i) => {
          const z = (i - (DEPTH_SLICES - 1) / 2) * SLICE_GAP;
          return (
            <div
              key={i}
              className="absolute inset-0 rounded-[13.5%/6.4%] bg-gradient-to-r from-[#8e9196] via-[#d9dbde] to-[#8e9196]"
              style={{ transform: `translateZ(${z}px)` }}
            />
          );
        })}

        {/* Front: aluminium rim + black bezel + screen */}
        <div
          className="absolute inset-0 rounded-[13.5%/6.4%] bg-gradient-to-br from-[#e4e6e9] via-[#a7aaaf] to-[#e4e6e9] p-[1.6%] [backface-visibility:hidden]"
          style={{ transform: `translateZ(${(DEPTH_SLICES / 2) * SLICE_GAP}px)` }}
        >
          <div className="relative h-full w-full overflow-hidden rounded-[12.4%/5.9%] bg-black p-[2.6%]">
            <div className="relative h-full w-full overflow-hidden rounded-[10.6%/5%] bg-white">
              {/* Dynamic Island */}
              <div className="absolute top-[1.9%] left-1/2 z-30 h-[3.9%] w-[30%] -translate-x-1/2 rounded-full bg-black" />
              {screen}
              <motion.div
                className="pointer-events-none absolute inset-0 z-40 mix-blend-soft-light"
                style={{ background: sheen }}
              />
            </div>
          </div>
          {/* Side buttons */}
          <span className="absolute top-[17%] -left-[1.4%] h-[4%] w-[1.6%] rounded-l-sm bg-[#9a9da2]" />
          <span className="absolute top-[24%] -left-[1.4%] h-[7%] w-[1.6%] rounded-l-sm bg-[#9a9da2]" />
          <span className="absolute top-[33%] -left-[1.4%] h-[7%] w-[1.6%] rounded-l-sm bg-[#9a9da2]" />
          <span className="absolute top-[27%] -right-[1.4%] h-[11%] w-[1.6%] rounded-r-sm bg-[#9a9da2]" />
          <span className="absolute top-[62%] -right-[1.4%] h-[9%] w-[1.6%] rounded-r-sm bg-[#9a9da2]" />
        </div>

        {/* Back: aluminium unibody, camera plateau across the top, glass panel below */}
        <div
          className="absolute inset-0 overflow-hidden rounded-[13.5%/6.4%] bg-gradient-to-b from-[#d6d8db] to-[#c3c6ca] [backface-visibility:hidden]"
          style={{ transform: `rotateY(180deg) translateZ(${(DEPTH_SLICES / 2) * SLICE_GAP}px)` }}
        >
          {/* Plateau */}
          <div className="absolute inset-x-0 top-0 h-[24%] bg-gradient-to-b from-[#e2e4e7] to-[#cfd2d6] shadow-[0_6px_14px_-6px_rgb(0_0_0/0.35)]">
            <div className="absolute top-[14%] left-[7%] grid h-[72%] aspect-square grid-cols-2 grid-rows-2 place-items-center gap-[6%] rounded-[30%] bg-[#bfc2c6] p-[5%] shadow-[inset_0_1px_2px_rgb(0_0_0/0.25)]">
              {[0, 1, 2].map((l) => (
                <span
                  key={l}
                  className="aspect-square w-full rounded-full bg-[radial-gradient(circle_at_40%_35%,#5b6470_0%,#1b1f24_45%,#0a0c0f_70%)] ring-[3px] ring-[#9ea2a7]"
                />
              ))}
              <span className="flex aspect-square w-[55%] items-center justify-center gap-[12%]">
                <span className="aspect-square w-1/2 rounded-full bg-[#f3e9c8]" />
                <span className="aspect-square w-1/3 rounded-full bg-[#2a2d31]" />
              </span>
            </div>
          </div>
          {/* Glass panel */}
          <div className="absolute inset-x-[4%] top-[27%] bottom-[2.5%] rounded-[11%/5.5%] bg-gradient-to-b from-[#cdd0d4] to-[#bfc3c7] shadow-[inset_0_1px_0_rgb(255_255_255/0.6)]" />
          {/* Brand mark where the logo usually sits */}
          <img
            src={icon}
            alt=""
            className="absolute top-[52%] left-1/2 w-[16%] -translate-x-1/2 -translate-y-1/2 rounded-[22%] opacity-90"
          />
        </div>
      </motion.div>
    </div>
  );
}
