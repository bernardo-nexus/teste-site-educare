import clsx from 'clsx';
import type { ReactNode } from 'react';

interface SectionHeadingProps {
  align?: 'center' | 'left';
  badge?: string;
  className?: string;
  highlight?: string;
  subtitle?: ReactNode;
  title: string;
  tone?: 'dark' | 'light';
}

export function SectionHeading({
  align = 'center',
  badge,
  className,
  highlight,
  subtitle,
  title,
  tone = 'dark',
}: SectionHeadingProps) {
  const light = tone === 'light';
  return (
    <div
      className={clsx(
        'flex flex-col gap-4',
        align === 'center' ? 'mx-auto max-w-3xl items-center text-center' : 'max-w-2xl items-start',
        className,
      )}
    >
      {badge && <span className={clsx('eyebrow', light && 'text-lime')}>{badge}</span>}
      <h2
        className={clsx(
          'text-[2.1rem] sm:text-5xl lg:text-[3.4rem]',
          light ? 'text-white' : 'text-ink',
        )}
      >
        {title}
        {highlight && (
          <>
            {' '}
            <span className={light ? 'text-lime' : 'marker'}>{highlight}</span>
          </>
        )}
      </h2>
      {subtitle && (
        <p
          className={clsx(
            'max-w-2xl text-lg leading-relaxed',
            light ? 'text-white/70' : 'text-ink-soft',
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
