//components/milestone-craft.tsx

'use client'

import { useMemo, useRef, useState } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import {
  Check,
  CheckCircle2,
  Crown,
  Download,
  FileCode,
  Globe,
  Image as ImageIcon,
  LockKeyhole,
  RefreshCw,
  Share2,
  Sparkles,
  Star,
  Upload,
  UserCheck,
  WandSparkles,
  X,
} from 'lucide-react'
import { toPng, toSvg } from 'html-to-image'
import { Button } from '@/components/ui/button'

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
    <path d="M9 18c-4.51 2-5-2-7-2"/>
  </svg>
)

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
  </svg>
)

const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.56 49.56 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
    <path d="m10 15 5-3-5-3z"/>
  </svg>
)

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
)

type ThemeCategory = 'Light' | 'Dark' | 'Glass' | '3D & Neon'

type ThemeKey =
  | 'Aurora'
  | 'Sunset'
  | 'Ocean'
  | 'Mono'
  | 'Obsidian'
  | 'Glassmorphic'
  | 'Carbon3D'
  | 'MidnightGold'
  | 'EmeraldGlow'
  | 'Cyberpunk'
  | 'PaperCraft'
  | 'RetroTerminal'
  | 'ElectricViolet'
  | 'RoseGold'
  | 'FrostGlass'
  | 'MinimalSlate'

type ThemeData = {
  label: string
  category: ThemeCategory
  isPro?: boolean
  colors: [string, string, string]
  accent: string
  cardBg: string
  cardBorder: string
  textColor?: string
  subTextColor?: string
  confetti: string[]
}

const themes: Record<ThemeKey, ThemeData> = {
  Aurora: {
    label: 'Aurora',
    category: 'Light',
    colors: ['#e5e9ff', '#8f9dff', '#d8dbff'],
    accent: '#4338ca',
    cardBg: '#ffffffef',
    cardBorder: '#ffffffb5',
    confetti: ['#2563eb', '#7c3aed', '#f59e0b', '#14b8a6', '#ef4444'],
  },
  Sunset: {
    label: 'Sunset',
    category: 'Light',
    colors: ['#ffe5dc', '#ff9b72', '#ffd4b8'],
    accent: '#c2410c',
    cardBg: '#ffffffef',
    cardBorder: '#ffffffb5',
    confetti: ['#ea580c', '#f59e0b', '#db2777', '#7c3aed', '#2563eb'],
  },
  Ocean: {
    label: 'Ocean',
    category: 'Light',
    colors: ['#d9f7fb', '#59bdd1', '#d7f1fa'],
    accent: '#087f9b',
    cardBg: '#ffffffef',
    cardBorder: '#ffffffb5',
    confetti: ['#0369a1', '#06b6d4', '#f59e0b', '#7c3aed', '#14b8a6'],
  },
  Mono: {
    label: 'Mono',
    category: 'Light',
    colors: ['#eeeeee', '#a9a9a9', '#f6f6f6'],
    accent: '#222222',
    cardBg: '#ffffffef',
    cardBorder: '#ffffffb5',
    confetti: ['#171717', '#525252', '#a3a3a3', '#737373', '#d4d4d4'],
  },
  PaperCraft: {
    label: 'Paper Craft',
    category: 'Light',
    colors: ['#f4efe6', '#e2d7c5', '#ede4d4'],
    accent: '#524237',
    cardBg: '#fbf9f5f0',
    cardBorder: '#d6cbb9',
    confetti: ['#8c6d58', '#d97706', '#059669', '#2563eb', '#dc2626'],
  },
  RoseGold: {
    label: 'Rose Gold',
    category: 'Light',
    colors: ['#fde2e4', '#f4acb7', '#ffcad4'],
    accent: '#9d0208',
    cardBg: '#fffffffa',
    cardBorder: '#ffcad4',
    confetti: ['#e63946', '#f4a261', '#2a9d8f', '#e76f51', '#9d0208'],
  },
  Obsidian: {
    label: 'Obsidian',
    category: 'Dark',
    isPro: true,
    colors: ['#0f172a', '#1e1b4b', '#020617'],
    accent: '#818cf8',
    cardBg: '#0f172ae6',
    cardBorder: '#33415580',
    textColor: '#f8fafc',
    subTextColor: '#94a3b8',
    confetti: ['#818cf8', '#38bdf8', '#c084fc', '#f43f5e', '#fbbf24'],
  },
  MidnightGold: {
    label: 'Midnight Gold',
    category: 'Dark',
    isPro: true,
    colors: ['#141414', '#262626', '#0a0a0a'],
    accent: '#fbbf24',
    cardBg: '#171717f0',
    cardBorder: '#404040',
    textColor: '#fafafa',
    subTextColor: '#a3a3a3',
    confetti: ['#fbbf24', '#f59e0b', '#d97706', '#fef08a', '#ffffff'],
  },
  EmeraldGlow: {
    label: 'Emerald',
    category: 'Dark',
    isPro: true,
    colors: ['#022c22', '#064e3b', '#021f17'],
    accent: '#34d399',
    cardBg: '#064e3be6',
    cardBorder: '#05966980',
    textColor: '#ecfdf5',
    subTextColor: '#6ee7b7',
    confetti: ['#34d399', '#10b981', '#6ee7b7', '#f59e0b', '#38bdf8'],
  },
  ElectricViolet: {
    label: 'Violet Dark',
    category: 'Dark',
    isPro: true,
    colors: ['#2e1065', '#4c1d95', '#1e1b4b'],
    accent: '#c084fc',
    cardBg: '#3b0764e6',
    cardBorder: '#6b21a880',
    textColor: '#faf5ff',
    subTextColor: '#c084fc',
    confetti: ['#c084fc', '#e879f9', '#38bdf8', '#f43f5e', '#facc15'],
  },
  MinimalSlate: {
    label: 'Minimal Slate',
    category: 'Dark',
    colors: ['#18181b', '#27272a', '#09090b'],
    accent: '#38bdf8',
    cardBg: '#18181be6',
    cardBorder: '#3f3f46',
    textColor: '#f4f4f5',
    subTextColor: '#a1a1aa',
    confetti: ['#38bdf8', '#a855f7', '#ec4899', '#f59e0b', '#10b981'],
  },
  Glassmorphic: {
    label: 'Frosted Glass',
    category: 'Glass',
    isPro: true,
    colors: ['#818cf8', '#c084fc', '#e879f9'],
    accent: '#312e81',
    cardBg: 'rgba(255, 255, 255, 0.45)',
    cardBorder: 'rgba(255, 255, 255, 0.65)',
    confetti: ['#4f46e5', '#9333ea', '#db2777', '#0284c7', '#d97706'],
  },
  FrostGlass: {
    label: 'Ice Glass',
    category: 'Glass',
    isPro: true,
    colors: ['#38bdf8', '#818cf8', '#c084fc'],
    accent: '#0369a1',
    cardBg: 'rgba(255, 255, 255, 0.52)',
    cardBorder: 'rgba(255, 255, 255, 0.75)',
    confetti: ['#0284c7', '#4f46e5', '#7c3aed', '#06b6d4', '#f59e0b'],
  },
  Carbon3D: {
    label: 'Carbon 3D',
    category: '3D & Neon',
    isPro: true,
    colors: ['#111827', '#1f2937', '#030712'],
    accent: '#22c55e',
    cardBg: '#111827f2',
    cardBorder: '#374151',
    textColor: '#f9fafb',
    subTextColor: '#9ca3af',
    confetti: ['#22c55e', '#4ade80', '#10b981', '#f59e0b', '#3b82f6'],
  },
  Cyberpunk: {
    label: 'Cyberpunk',
    category: '3D & Neon',
    isPro: true,
    colors: ['#422006', '#701a75', '#1e1b4b'],
    accent: '#facc15',
    cardBg: '#18181be6',
    cardBorder: '#f43f5e',
    textColor: '#fef08a',
    subTextColor: '#f472b6',
    confetti: ['#facc15', '#f43f5e', '#06b6d4', '#a855f7', '#22c55e'],
  },
  RetroTerminal: {
    label: 'CRT Terminal',
    category: '3D & Neon',
    isPro: true,
    colors: ['#052e16', '#022c22', '#000000'],
    accent: '#4ade80',
    cardBg: '#022c22f0',
    cardBorder: '#15803d',
    textColor: '#4ade80',
    subTextColor: '#86efac',
    confetti: ['#4ade80', '#22c55e', '#a3e635', '#10b981', '#14b8a6'],
  },
}

type ConfettiPiece = {
  x: number
  y: number
  size: number
  rotate: number
  color: string
  shape: 'ribbon' | 'dot' | 'diamond' | 'burst'
}

function makeConfetti(themeKey: ThemeKey): ConfettiPiece[] {
  const palette = themes[themeKey].confetti
  return Array.from({ length: 42 }, (_, i) => ({
    x: 2 + ((i * 23) % 96),
    y: 2 + ((i * 37) % 96),
    size: 5 + ((i * 7) % 11),
    rotate: (i * 43) % 360,
    color: palette[i % palette.length],
    shape: (['ribbon', 'dot', 'diamond', 'burst'] as ConfettiPiece['shape'][])[i % 4],
  }))
}

function Confetti({ themeKey }: { themeKey: ThemeKey }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-[2rem]" aria-hidden="true">
      {makeConfetti(themeKey).map((piece, i) => (
        <span
          key={i}
          className="absolute block shadow-sm"
          style={{
            left: `${piece.x}%`,
            top: `${piece.y}%`,
            width: piece.shape === 'dot' ? piece.size : piece.size * 1.5,
            height: piece.shape === 'dot' ? piece.size : piece.size * 0.58,
            backgroundColor: piece.color,
            transform: `rotate(${piece.rotate}deg)`,
            opacity: 0.72 + (i % 3) * 0.09,
            borderRadius: piece.shape === 'dot' ? '50%' : piece.shape === 'ribbon' ? '2px' : '0',
            clipPath: piece.shape === 'diamond' ? 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' : piece.shape === 'burst' ? 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' : 'none'
          }}
        />
      ))}
    </div>
  )
}

function PreviewCard({
  cardRef,
  current,
  target,
  metric,
  message,
  handle,
  avatarUrl,
  themeKey,
  confetti,
  watermark,
}: {
  cardRef: React.RefObject<HTMLDivElement | null>
  current: number
  target: number
  metric: string
  message: string
  handle: string
  avatarUrl: string
  themeKey: ThemeKey
  confetti: boolean
  watermark: boolean
}) {
  const t = themes[themeKey]
  const percent = Math.min(100, Math.max(0, (current / Math.max(target, 1)) * 100))
  const remaining = Math.max(target - current, 0)

  return (
    <div
      ref={cardRef}
      className="relative flex min-h-[480px] w-full items-center justify-center overflow-hidden rounded-[2rem] p-6 shadow-2xl transition-all duration-500 sm:p-10"
      style={{
        background: `linear-gradient(135deg, ${t.colors[0]}, ${t.colors[1]} 50%, ${t.colors[2]})`,
      }}
    >
      <div className="pointer-events-none absolute inset-0 mix-blend-overlay bg-gradient-to-br from-white/30 to-transparent" aria-hidden="true" />
      
      <div
        className="relative z-10 flex w-full max-w-[420px] flex-col items-center rounded-[2.5rem] border border-white/20 p-8 text-center shadow-[0_0_80px_-20px_rgba(0,0,0,0.3)] transition-all duration-500 sm:p-10"
        style={{
          background: t.cardBg,
          borderColor: t.cardBorder,
          backdropFilter: t.category === 'Glass' ? 'blur(24px)' : 'blur(12px)',
          boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2), inset 0 -1px 0 rgba(0, 0, 0, 0.1)',
        }}
      >
        <div className="pointer-events-none absolute inset-0 rounded-[2.5rem] opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '16px 16px' }} aria-hidden="true" />
        
        <div className="relative mb-8 flex items-center justify-center gap-3 rounded-full border border-white/10 bg-black/5 p-2 pr-6 shadow-inner backdrop-blur-md">
          {avatarUrl && (
            <img src={avatarUrl} alt="Avatar" className="h-8 w-8 rounded-full border border-white/30 object-cover shadow-md" />
          )}
          {handle && (
            <span className="font-mono text-sm font-semibold tracking-wider uppercase" style={{ color: t.subTextColor || '#334155' }}>
              {handle.startsWith('@') ? handle : `@${handle}`}
            </span>
          )}
        </div>

        <div className="relative text-7xl font-black leading-none tracking-tighter tabular-nums drop-shadow-md sm:text-[5.5rem]" style={{ color: t.accent, textShadow: `0 4px 20px ${t.accent}40` }}>
          {current.toLocaleString()}
        </div>
        <div className="mt-3 text-3xl font-extrabold tracking-tight opacity-95" style={{ color: t.textColor || '#0f172a' }}>
          {metric || 'followers'}
        </div>
        <div className="mt-3 text-xl font-medium italic opacity-80" style={{ color: t.subTextColor || '#64748b' }}>
          "{message || 'Thank you!'}" <span aria-hidden="true" className="not-italic">🚀</span>
        </div>

        <div className="relative mt-10 h-4 w-full overflow-hidden rounded-full bg-black/10 shadow-inner">
          <div
            className="absolute left-0 top-0 h-full rounded-full transition-all duration-1000 ease-out"
            style={{
              width: `${percent}%`,
              background: `linear-gradient(90deg, ${t.accent}, ${t.colors[1] || t.accent})`,
              boxShadow: `0 0 10px ${t.accent}80`
            }}
          />
          {percent > 0 && percent < 100 && (
            <div
              className="absolute -ml-4 -mt-4 top-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-xl transition-all duration-1000"
              style={{ left: `${percent}%` }}
            >
              <Star size={16} fill="#f5b51b" color="#e3a412" />
            </div>
          )}
          {percent === 100 && (
            <div className="absolute -mr-0 -mt-3 right-0 top-1/2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-xl transition-all duration-1000">
              <CheckCircle2 size={14} className="text-emerald-500" />
            </div>
          )}
        </div>

        <div className="mt-4 flex w-full justify-between font-mono text-sm font-bold opacity-70" style={{ color: t.textColor || '#334155' }}>
          <span>{current.toLocaleString()}</span>
          <span>{target.toLocaleString()}</span>
        </div>

        <div className="mt-8 flex flex-col items-center gap-1 rounded-2xl bg-black/5 px-8 py-4 backdrop-blur-sm border border-white/5 shadow-sm">
          <div className="text-3xl font-black tracking-tight" style={{ color: t.accent }}>
            {remaining.toLocaleString()} left
          </div>
          <div className="text-xs font-bold opacity-80 uppercase tracking-[0.2em]" style={{ color: t.textColor || '#0f172a' }}>
            Road to {target.toLocaleString()}
          </div>
        </div>
      </div>

      {confetti && <Confetti themeKey={themeKey} />}
      
      {watermark && (
        <div 
          className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5 rounded-full bg-black/20 px-3 py-1.5 font-mono text-[10px] font-bold tracking-widest uppercase text-white shadow-sm backdrop-blur-md"
        >
          <Sparkles size={12} className="text-amber-400" />
          <span>Made with MilestoneCraft</span>
        </div>
      )}
    </div>
  )
}

function UpgradeModal({
  isOpen,
  onClose,
  onUnlockPro,
  isCheckingOut,
}: {
  isOpen: boolean
  onClose: () => void
  onUnlockPro: () => void
  isCheckingOut: boolean
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl">
        <button onClick={onClose} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground">
          <X size={18} />
        </button>

        <div className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-amber-500">
          <Crown size={16} /> Upgrade to Pro
        </div>
        <h3 className="mt-2 text-2xl font-bold tracking-tight">Unlock Full Potential</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Remove watermarks, export vector SVGs, and access all 16 dark & glassmorphic themes.
        </p>

        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 p-4">
            <div>
              <div className="text-sm font-semibold">Lifetime Access</div>
              <div className="text-xs text-muted-foreground">Pay once, own forever</div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-extrabold">$19</span>
              <span className="text-xs text-muted-foreground"> /one-time</span>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border p-4">
            <div>
              <div className="text-sm font-semibold">Monthly Pro</div>
              <div className="text-xs text-muted-foreground">Cancel anytime</div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-extrabold">$5</span>
              <span className="text-xs text-muted-foreground"> /month</span>
            </div>
          </div>
        </div>

        <ul className="mt-6 space-y-2 text-xs text-muted-foreground">
          <li className="flex items-center gap-2"><Check size={14} className="text-emerald-500" /> Remove MilestoneCraft Watermark</li>
          <li className="flex items-center gap-2"><Check size={14} className="text-emerald-500" /> High-Resolution Vector SVG Exports</li>
          <li className="flex items-center gap-2"><Check size={14} className="text-emerald-500" /> All Glassmorphic, 3D & Dark Themes</li>
        </ul>

        <div className="mt-6 flex flex-col gap-2">
          <Button
            disabled={isCheckingOut}
            className="h-11 w-full rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 font-semibold text-white shadow-md"
            onClick={onUnlockPro}
          >
            {isCheckingOut ? (
              <span className="flex items-center gap-2"><RefreshCw size={14} className="animate-spin" /> Preparing Checkout...</span>
            ) : (
              'Unlock Pro Access Now'
            )}
          </Button>
          <Button variant="ghost" className="w-full" onClick={onClose}>
            Maybe Later
          </Button>
        </div>
      </div>
    </div>
  )
}

export function MilestoneCraft() {
  const { data: session, status: authStatus } = useSession() || {}

  const [current, setCurrent] = useState(265)
  const [target, setTarget] = useState(300)
  const [metric, setMetric] = useState('followers')
  const [message, setMessage] = useState('Thank you!')
  const [handle, setHandle] = useState('TiborAntal')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [themeKey, setThemeKey] = useState<ThemeKey>('Aurora')
  const [activeCategory, setActiveCategory] = useState<ThemeCategory>('Light')
  const [confetti, setConfetti] = useState(true)

  // Derive Pro state from NextAuth session
  const isPro = !!session?.user?.isPro
  const [watermark, setWatermark] = useState(!isPro)
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false)
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  // Platform auto-fetch state
  const [platform, setPlatform] = useState<'github' | 'x' | 'youtube' | 'newsletter'>('github')
  const [isFetching, setIsFetching] = useState(false)
  const [status, setStatus] = useState('')

  const cardRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const remaining = useMemo(() => Math.max(target - current, 0), [current, target])

  // Handle Lemon Squeezy Checkout
  const handleCheckout = async () => {
    if (!session) {
      signIn('google')
      return
    }

    setIsCheckingOut(true)
    setStatus('Redirecting to checkout...')

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await res.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        setStatus(data.error || 'Checkout initiation failed.')
        setTimeout(() => setStatus(''), 3000)
      }
    } catch (err) {
      console.error('Checkout Error:', err)
      setStatus('Failed to launch checkout.')
      setTimeout(() => setStatus(''), 3000)
    } finally {
      setIsCheckingOut(false)
    }
  }

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        setStatus('Image must be under 3MB')
        return
      }
      const reader = new FileReader()
      reader.onload = (uploadEvent) => {
        setAvatarUrl(uploadEvent.target?.result as string)
        setStatus('Avatar updated!')
        setTimeout(() => setStatus(''), 2000)
      }
      reader.readAsDataURL(file)
    }
  }

  const autoFetchStats = async () => {
    if (!handle) {
      setStatus('Please enter a handle first')
      return
    }

    setIsFetching(true)
    setStatus('Fetching stats...')

    try {
      const res = await fetch(`/api/stats?platform=${platform}&handle=${encodeURIComponent(handle)}`)
      if (!res.ok) throw new Error('Fetch failed')

      const data = await res.json()
      setCurrent(data.current || 0)
      if (data.metric) setMetric(data.metric)
      if (data.avatarUrl) setAvatarUrl(data.avatarUrl)

      setStatus(`Fetched ${platform} stats!`)
      setTimeout(() => setStatus(''), 2200)
    } catch (err) {
      console.error(err)
      setStatus('Failed to fetch. Try manual entry.')
      setTimeout(() => setStatus(''), 2500)
    } finally {
      setIsFetching(false)
    }
  }

  const downloadPNG = async () => {
    if (!cardRef.current) return
    setStatus('Generating PNG...')

    try {
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 3, cacheBust: true })
      const link = document.createElement('a')
      link.download = `milestone-${current}-${metric.replaceAll(' ', '-')}.png`
      link.href = dataUrl
      link.click()

      setStatus('PNG downloaded!')
      setTimeout(() => setStatus(''), 2200)
    } catch (err) {
      console.error('Export failed:', err)
      setStatus('Failed to export image')
      setTimeout(() => setStatus(''), 2200)
    }
  }

  const downloadSVG = async () => {
    if (!isPro) {
      setIsUpgradeModalOpen(true)
      return
    }

    if (!cardRef.current) return
    setStatus('Generating SVG...')

    try {
      const dataUrl = await toSvg(cardRef.current, { cacheBust: true })
      const link = document.createElement('a')
      link.download = `milestone-${current}-${metric.replaceAll(' ', '-')}.svg`
      link.href = dataUrl
      link.click()

      setStatus('SVG exported!')
      setTimeout(() => setStatus(''), 2200)
    } catch (err) {
      console.error('SVG Export failed:', err)
      setStatus('Failed to export SVG')
      setTimeout(() => setStatus(''), 2200)
    }
  }

  const shareOnX = () => {
    const text = encodeURIComponent(
      `Just reached ${current.toLocaleString()} ${metric} on ${platform}! 🚀\n\n${remaining > 0 ? `${remaining.toLocaleString()} to go until ${target.toLocaleString()} 📈\n\n` : ''}Generated with @MilestoneCraft_`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank", "noopener,noreferrer");
    setStatus('Share window opened')
  }

  const selectTheme = (key: ThemeKey) => {
    const selected = themes[key]
    if (selected.isPro && !isPro) {
      setIsUpgradeModalOpen(true)
      return
    }
    setThemeKey(key)
  }

  return (
    <main className="min-h-screen bg-background px-4 py-6 text-foreground sm:px-6 sm:py-8 lg:px-10">
      <header className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <Sparkles size={16} />
          </div>
          <span className="font-mono text-sm font-semibold tracking-tight">MilestoneCraft</span>
          {isPro && (
            <span className="flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 font-mono text-[10px] font-medium text-amber-600">
              <Crown size={11} /> PRO
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {authStatus === 'loading' ? (
            <div className="h-8 w-20 animate-pulse rounded-lg bg-muted" />
          ) : session ? (
            <div className="flex items-center gap-3">
              {session.user?.image && (
                <img src={session.user.image} alt="User" className="h-7 w-7 rounded-full border border-border" />
              )}
              {!isPro ? (
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 border-amber-500/40 font-mono text-xs text-amber-700 hover:bg-amber-500/10 dark:text-amber-400"
                  onClick={() => setIsUpgradeModalOpen(true)}
                >
                  <Crown size={13} className="text-amber-500" /> Unlock Pro
                </Button>
              ) : (
                <span className="flex items-center gap-1 font-mono text-xs text-muted-foreground">
                  <UserCheck size={14} className="text-emerald-500" /> Pro Member
                </span>
              )}
              <Button size="sm" variant="ghost" className="font-mono text-xs" onClick={() => signOut()}>
                Sign Out
              </Button>
            </div>
          ) : (
            <Button size="sm" className="gap-1.5 font-mono text-xs" onClick={() => signIn('google')}>
              <GoogleIcon className="h-3.5 w-3.5" /> Sign in with Google
            </Button>
          )}
        </div>
      </header>

      <section className="mx-auto max-w-7xl pb-10 pt-10 sm:pt-12 lg:pt-16">
        <div className="mb-8 max-w-2xl">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">Social milestone generator</p>
          <h1 className="text-balance text-4xl font-semibold tracking-tighter md:text-5xl">
            Turn your progress into a post worth sharing.
          </h1>
          <p className="mt-4 max-w-xl text-pretty text-base leading-7 text-muted-foreground">
            Create beautiful milestone cards in seconds. Connect your stats, personalize branding with your avatar, and share your next milestone.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(320px,400px)_1fr] lg:gap-12">
          <aside className="order-2 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6 lg:order-1">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-mono text-sm font-semibold">Your milestone</h2>
              <span className="font-mono text-[11px] text-muted-foreground">Live editor</span>
            </div>

            {/* Auto Fetch Section */}
            <div className="mb-5 rounded-xl border border-border bg-muted/30 p-3.5">
              <div className="mb-2.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-mono text-xs font-semibold text-muted-foreground">
                  <RefreshCw size={12} /> Auto-Fetch Live Stats
                </span>
              </div>
              <div className="mb-2.5 flex gap-2">
                {(['github', 'youtube', 'x', 'newsletter'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPlatform(p)}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-2 py-1.5 font-mono text-[11px] capitalize transition-all ${
                      platform === p ? 'border-primary bg-primary text-primary-foreground shadow-sm' : 'border-border bg-card text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    {p === 'github' && <GithubIcon className="h-3 w-3" />}
                    {p === 'youtube' && <YoutubeIcon className="h-3 w-3" />}
                    {p === 'x' && <TwitterIcon className="h-3 w-3" />}
                    {p === 'newsletter' && <Globe size={12} />}
                    {p}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="@username"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  className="flex-1 rounded-lg border border-input bg-card px-3 py-1.5 font-mono text-xs text-foreground outline-none focus:border-ring"
                />
                <Button size="sm" onClick={autoFetchStats} disabled={isFetching} className="gap-1 text-xs">
                  {isFetching ? <RefreshCw size={12} className="animate-spin" /> : 'Fetch'}
                </Button>
              </div>
            </div>

            {/* Inputs Stack */}
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <label className="flex flex-col gap-1.5 text-sm font-medium text-foreground">
                  Current
                  <input 
                    type="number" 
                    min="0" 
                    value={current} 
                    onChange={(e) => setCurrent(Number(e.target.value) || 0)} 
                    className="rounded-xl border border-input bg-background px-3 py-2.5 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </label>
                <label className="flex flex-col gap-1.5 text-sm font-medium text-foreground">
                  Target
                  <input 
                    type="number" 
                    min="1" 
                    value={target} 
                    onChange={(e) => setTarget(Number(e.target.value) || 1)} 
                    className="rounded-xl border border-input bg-background px-3 py-2.5 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </label>
              </div>

              <label className="flex flex-col gap-1.5 text-sm font-medium text-foreground">
                Metric Name
                <input 
                  value={metric} 
                  onChange={(e) => setMetric(e.target.value)} 
                  maxLength={24} 
                  placeholder="followers, subscribers, MRR" 
                  className="rounded-xl border border-input bg-background px-3 py-2.5 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </label>

              <label className="flex flex-col gap-1.5 text-sm font-medium text-foreground">
                Message
                <input 
                  value={message} 
                  onChange={(e) => setMessage(e.target.value)} 
                  maxLength={40} 
                  placeholder="Thank you!" 
                  className="rounded-xl border border-input bg-background px-3 py-2.5 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </label>

              {/* Avatar Upload */}
              <div className="grid gap-1.5">
                <span className="font-mono text-[11px] font-semibold text-muted-foreground">Avatar / Brand Logo</span>
                <div className="flex items-center gap-3">
                  {avatarUrl ? (
                    <div className="group relative">
                      <img src={avatarUrl} alt="Preview" className="h-10 w-10 rounded-full border border-border object-cover" />
                      <button
                        onClick={() => setAvatarUrl('')}
                        className="absolute -right-1 -top-1 rounded-full bg-destructive p-0.5 text-destructive-foreground shadow"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-dashed border-border bg-muted/20 text-muted-foreground">
                      <ImageIcon size={16} />
                    </div>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-1.5 font-mono text-xs"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload size={13} /> {avatarUrl ? 'Change' : 'Upload Image'}
                  </Button>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                </div>
              </div>
            </div>

            {/* Themes Section */}
            <div className="mt-6 border-t border-border pt-5">
              <div className="mb-3 flex items-center justify-between">
                <p className="font-mono text-xs font-semibold">Themes (16 Styles)</p>
                <div className="flex gap-1">
                  {(['Light', 'Dark', 'Glass', '3D & Neon'] as ThemeCategory[]).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`rounded px-2 py-0.5 font-mono text-[10px] transition-colors ${
                        activeCategory === cat ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="max-h-52 overflow-y-auto pr-1 grid grid-cols-2 gap-2">
                {(Object.keys(themes) as ThemeKey[])
                  .filter((key) => themes[key].category === activeCategory)
                  .map((key) => {
                    const t = themes[key]
                    const isSelected = themeKey === key
                    const isLocked = t.isPro && !isPro

                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => selectTheme(key)}
                        className={`flex items-center justify-between rounded-xl border p-3 text-sm font-medium transition-all ${
                          isSelected
                            ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                            : 'border-border bg-card hover:border-primary/50 hover:bg-accent'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span 
                            className="h-4 w-4 rounded-full border border-black/10 shadow-sm"
                            style={{ background: `linear-gradient(135deg, ${t.colors.join(',')})` }} 
                          />
                          <span className="truncate">{t.label}</span>
                        </div>
                        {isLocked && <Crown size={12} className="shrink-0 text-amber-500" />}
                      </button>
                    )
                  })}
              </div>
            </div>

            {/* Toggles */}
            <div className="mt-6 space-y-3">
              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-border bg-card p-4 shadow-sm transition-colors hover:bg-accent/50">
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-semibold text-foreground">Confetti Effect</span>
                  <span className="text-xs text-muted-foreground">42-piece celebration layer</span>
                </div>
                <div className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background ${confetti ? 'bg-primary' : 'bg-muted'}`}>
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={confetti}
                    onChange={(e) => setConfetti(e.target.checked)}
                  />
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${confetti ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </div>
              </label>

              <label className={`flex cursor-pointer items-center justify-between rounded-xl border border-border bg-card p-4 shadow-sm transition-colors hover:bg-accent/50 ${!isPro ? 'opacity-80' : ''}`}>
                <div className="flex flex-col gap-0.5">
                  <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    Show Watermark
                    {!isPro && <span className="rounded bg-amber-500/10 px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-amber-600">Pro Only</span>}
                  </span>
                  <span className="text-xs text-muted-foreground">Made with MilestoneCraft badge</span>
                </div>
                <div className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background ${watermark ? 'bg-primary' : 'bg-muted'}`}>
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={watermark}
                    onChange={(e) => {
                      if (!isPro && !e.target.checked) {
                        setIsUpgradeModalOpen(true)
                        return
                      }
                      setWatermark(e.target.checked)
                    }}
                  />
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${watermark ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </div>
              </label>
            </div>

            {/* Export Actions */}
            <div className="mt-6 space-y-2">
              <button 
                className="group relative inline-flex h-12 w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-[1px] font-bold text-white transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)]" 
                onClick={downloadPNG}
              >
                <span className="relative flex h-full w-full items-center justify-center gap-2 rounded-[11px] bg-black/10 px-6 transition-all duration-300 group-hover:bg-transparent">
                  <Download size={16} /> Download PNG ✨
                </span>
              </button>
              <Button variant="outline" className="h-10 w-full gap-2 rounded-xl font-mono text-xs" onClick={downloadSVG}>
                <FileCode size={14} /> Export Vector SVG {!isPro && <Crown size={12} className="text-amber-500" />}
              </Button>
              <button 
                type="button" 
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card py-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground" 
                onClick={shareOnX}
              >
                <Share2 size={16} /> Share on X
              </button>
            </div>

            {status && <p className="mt-3 text-center font-mono text-[11px] text-muted-foreground">{status}</p>}
          </aside>

          {/* Preview Right Column */}
          <div className="order-1 lg:order-2">
            <PreviewCard
              cardRef={cardRef}
              current={current}
              target={target}
              metric={metric}
              message={message}
              handle={handle}
              avatarUrl={avatarUrl}
              themeKey={themeKey}
              confetti={confetti}
              watermark={watermark}
            />
            <div className="mt-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <WandSparkles size={14} />
                {remaining.toLocaleString()} remaining until your next milestone
              </div>
              <div className="hidden items-center gap-1.5 font-mono text-[10px] text-muted-foreground sm:flex">
                <LockKeyhole size={11} /> Client-side export engine
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="mx-auto flex max-w-7xl items-center justify-between border-t border-border pt-5 text-xs text-muted-foreground">
        <span>Made for builders celebrating every milestone.</span>
        <span className="font-mono">2026</span>
      </footer>

      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        onUnlockPro={handleCheckout}
        isCheckingOut={isCheckingOut}
      />
    </main>
  )
}

export default MilestoneCraft