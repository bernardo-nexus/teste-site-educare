import clsx from 'clsx';
import {
  BarChart3,
  Bell,
  CalendarDays,
  Check,
  Home,
  MessageCircle,
  MoreHorizontal,
  Users,
} from 'lucide-react';

import { useI18n } from '../../i18n';
import { StatusBar } from './PhoneFrame';

/*
 * Coded stand-ins for the app screens. They only use copy that already exists in the
 * locale files. Swap each one for a real screenshot via <PhoneFrame src=... /> later.
 */

const tabIcons = [Home, CalendarDays, MessageCircle, MoreHorizontal];

function TabBar({ active }: { active: number }) {
  const { t } = useI18n();
  return (
    <div className="absolute right-0 bottom-0 left-0 flex items-center justify-around border-t border-black/5 bg-white/95 px-3 pt-2 pb-5 backdrop-blur">
      {t.hero.phone.tabs.map((tab, i) => {
        const Icon = tabIcons[i] ?? MoreHorizontal;
        return (
          <span key={i} className="flex flex-col items-center gap-0.5">
            <Icon className={clsx('h-[15px] w-[15px]', i === active ? 'text-emerald' : 'text-ink-muted')} />
            <span className={clsx('text-[8.5px] font-medium', i === active ? 'text-emerald' : 'text-ink-muted')}>
              {tab}
            </span>
          </span>
        );
      })}
    </div>
  );
}

const dotColors = ['bg-emerald', 'bg-[#ff9f0a]', 'bg-[#0a84ff]', 'bg-[#ff6482]', 'bg-emerald', 'bg-[#ff9f0a]'];

export function ParentAgendaScreen() {
  const { t } = useI18n();
  const p = t.hero.phone;
  return (
    <div className="relative h-full bg-[#f2f2f7]">
      <StatusBar />
      <div className="px-5 pt-5 pb-3">
        <p className="text-[11px] font-medium text-ink-muted">{p.greeting}</p>
        <p className="text-[19px] font-bold tracking-tight text-ink">{p.todaySchedule}</p>
      </div>
      <div className="mx-4 mb-3 flex items-center gap-3 rounded-2xl bg-white p-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-peach text-base">👦</div>
        <div className="min-w-0">
          <p className="text-[13px] font-semibold text-ink">{p.childName}</p>
          <p className="text-[11px] font-medium text-emerald">{p.childStatus}</p>
        </div>
      </div>
      <div className="mx-4 overflow-hidden rounded-2xl bg-white">
        {p.activities.map((item, i) => (
          <div key={i} className="flex items-center gap-3 border-b border-black/5 px-3 py-[0.55rem] last:border-0">
            <span className="w-8 text-[10.5px] font-medium text-ink-muted tabular-nums">{item.time}</span>
            <span className={clsx('h-[7px] w-[7px] rounded-full', dotColors[i % dotColors.length])} />
            <span className="text-[12px] font-medium text-ink">{item.label}</span>
          </div>
        ))}
      </div>
      <TabBar active={1} />
    </div>
  );
}

export function TeacherScreen() {
  const { t } = useI18n();
  const role = t.solution.roles[1];
  const kids = ['👧', '👦', '🧒', '👶', '👧'];
  return (
    <div className="relative h-full bg-[#f2f2f7]">
      <StatusBar />
      <div className="px-5 pt-5 pb-3">
        <p className="text-[11px] font-medium text-ink-muted">{role.title}</p>
        <p className="text-[19px] font-bold tracking-tight text-ink">{t.features.teacher[0].title}</p>
      </div>
      <div className="mx-4 mb-3 grid grid-cols-5 gap-2 rounded-2xl bg-white p-3">
        {kids.map((k, i) => (
          <span key={i} className="relative flex aspect-square items-center justify-center rounded-full bg-sky text-base">
            {k}
            {i < 4 && (
              <span className="absolute -right-0.5 -bottom-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald ring-2 ring-white">
                <Check className="h-2 w-2 text-white" strokeWidth={4} />
              </span>
            )}
          </span>
        ))}
      </div>
      <div className="mx-4 overflow-hidden rounded-2xl bg-white">
        {role.highlights.map((h, i) => (
          <div key={i} className="flex items-center justify-between border-b border-black/5 px-3 py-2.5 last:border-0">
            <span className="text-[12px] font-medium text-ink">{h}</span>
            <span
              className={clsx(
                'h-[18px] w-[30px] rounded-full p-[2px] transition',
                i < 3 ? 'bg-emerald' : 'bg-[#e5e5ea]',
              )}
            >
              <span className={clsx('block h-[14px] w-[14px] rounded-full bg-white shadow', i < 3 && 'translate-x-3')} />
            </span>
          </div>
        ))}
      </div>
      <div className="mx-4 mt-3 rounded-full bg-emerald py-2.5 text-center text-[12px] font-semibold text-white">
        {t.features.teacher[5].title}
      </div>
      <TabBar active={0} />
    </div>
  );
}

export function ManagementScreen() {
  const { t } = useI18n();
  const m = t.features.management;
  const bars = [62, 78, 70, 88, 94, 81, 90];
  return (
    <div className="relative h-full bg-[#f2f2f7]">
      <StatusBar />
      <div className="flex items-start justify-between px-5 pt-5 pb-3">
        <div>
          <p className="text-[11px] font-medium text-ink-muted">{t.solution.roles[2].title}</p>
          <p className="text-[19px] font-bold tracking-tight text-ink">{m[0].title}</p>
        </div>
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
          <Bell className="h-3.5 w-3.5 text-ink" />
        </span>
      </div>
      <div className="mx-4 mb-3 rounded-2xl bg-white p-3">
        <div className="mb-2 flex items-center gap-1.5 text-[10.5px] font-semibold text-ink-muted">
          <BarChart3 className="h-3 w-3" /> {m[3].title}
        </div>
        <div className="flex h-20 items-end gap-1.5">
          {bars.map((h, i) => (
            <span
              key={i}
              className={clsx('flex-1 rounded-md', i === bars.length - 1 ? 'bg-emerald' : 'bg-[#d8efe2]')}
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>
      <div className="mx-4 grid grid-cols-2 gap-2">
        {m.slice(1, 5).map((f, i) => {
          const Icon = [Users, Bell, BarChart3, CalendarDays][i];
          return (
            <div key={f.title} className="rounded-2xl bg-white p-3">
              <Icon className="mb-2 h-4 w-4 text-emerald" />
              <p className="text-[11.5px] leading-tight font-semibold text-ink">{f.title}</p>
            </div>
          );
        })}
      </div>
      <TabBar active={0} />
    </div>
  );
}
