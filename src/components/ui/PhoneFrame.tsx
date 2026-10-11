import clsx from 'clsx';
import type { ReactNode } from 'react';

interface PhoneFrameProps {
  children?: ReactNode;
  className?: string;
  /** Real app screenshot. When set, it replaces the coded screen. */
  src?: string;
  alt?: string;
}

/** iPhone-style frame. Width drives everything; height follows the 19.5:9 ratio. */
export function PhoneFrame({ children, className, src, alt = '' }: PhoneFrameProps) {
  return (
    <div
      className={clsx(
        'relative aspect-[9/19.5] rounded-[3rem] bg-[#1d1d1f] p-[0.55rem] shadow-[0_40px_80px_-30px_rgb(0_0_0/0.45),inset_0_0_0_1.5px_#3a3a3c]',
        className,
      )}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[2.5rem] bg-white">
        <div className="absolute top-[0.6rem] left-1/2 z-20 h-[1.55rem] w-[30%] -translate-x-1/2 rounded-full bg-black" />
        {src ? (
          <img src={src} alt={alt} className="h-full w-full object-cover object-top" loading="lazy" />
        ) : (
          children
        )}
      </div>
    </div>
  );
}

export function StatusBar({ dark = false }: { dark?: boolean }) {
  return (
    <div
      className={clsx(
        'flex items-center justify-between px-7 pt-[0.95rem] pb-1 text-[11px] font-semibold',
        dark ? 'text-white' : 'text-ink',
      )}
    >
      <span>9:41</span>
      <span className="flex items-center gap-1">
        <span className={clsx('h-[7px] w-[15px] rounded-[2px]', dark ? 'bg-white' : 'bg-ink')} />
      </span>
    </div>
  );
}
