import clsx from 'clsx';

import icon from '../../assets/icon-192.png';

interface BrandMarkProps {
  className?: string;
  tone?: 'dark' | 'light';
}

export function BrandMark({ className, tone = 'dark' }: BrandMarkProps) {
  return (
    <span className={clsx('flex items-center gap-2', className)}>
      <img src={icon} alt="" className="h-7 w-7 rounded-[8px] object-cover" width={28} height={28} />
      <span
        className={clsx(
          'text-[15px] leading-none font-semibold tracking-tight',
          tone === 'dark' ? 'text-ink' : 'text-white',
        )}
      >
        Nexus EduCare
      </span>
    </span>
  );
}
