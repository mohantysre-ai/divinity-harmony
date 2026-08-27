import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, Eye, FileCheck2, ShieldCheck } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { ThemeProvider } from '@/hooks/use-theme';

const pages={
 privacy:{title:'Privacy Policy',icon:ShieldCheck,intro:'How Divinity Harmony handles account, profile, location and practice information.',sections:[
  ['Information we process','Account email and authentication are handled by Supabase when configured. Profile name, optional gotra, preferred language and avatar are stored in your Supabase user metadata or locally for guests. Japa, favorites and guest profile data use an anonymous browser device identifier.'],
  ['Location','Location is requested only after you select a location feature. Coordinates are used to localize Panchang or calculate temple distance and are not added to your public profile.'],
  ['Media and external services','The app may load YouTube, Wikimedia Commons, OpenStreetMap, Google Maps, Justdial and licensed sacred-text sources. Opening or embedding them may send normal browser information to those providers.'],
  ['Your choices','You may browse as a guest, deny location access, change profile information, sign out, or request account deletion through the configured contact channel.'],
  ['Security and retention','Authentication uses Supabase sessions. Uploaded avatars are restricted by storage policies. Guest records remain until removed by the site operator or deployment retention process.']
 ]},
 terms:{title:'Terms of Use',icon:FileCheck2,intro:'Conditions for using this educational devotional platform.',sections:[
  ['Educational purpose','Mantras, Panchang summaries, scripture notes and Puja Vidhi guides are educational. They do not replace a qualified priest, regional Panchang, medical professional or other specialist.'],
  ['External content','Live streams, directory results, audio, images and source texts may be provided by third parties. Availability, accuracy and licensing remain subject to their providers.'],
  ['Respectful use','Do not misuse the platform, attempt unauthorized access, upload harmful files or use devotional material in a deceptive or abusive manner.'],
  ['Accounts','You are responsible for your login credentials. The service may remove abusive accounts or content where necessary for security and lawful operation.'],
  ['Availability','Features can change or become temporarily unavailable. No uninterrupted availability or ceremonial outcome is promised.']
 ]},
 accessibility:{title:'Accessibility',icon:Eye,intro:'Our approach to making devotional learning usable by more people.',sections:[
  ['Keyboard and structure','Navigation, forms and interactive controls use semantic elements and visible focus behavior.'],
  ['Motion and display','Animations respect reduced-motion preferences. Light and dark themes are supported, with responsive layouts for mobile and desktop.'],
  ['Media alternatives','Images include alternative text where meaningful. Mantra text remains available if an audio recording or image fails.'],
  ['Continuous improvement','Accessibility issues are treated as functional defects. Please report a specific page, control and assistive technology through the configured contact link.']
 ]}
} as const;

export default function LegalPage(){const{type}=useParams();const page=pages[type as keyof typeof pages];if(!page)return <Navigate to="/" replace/>;const Icon=page.icon;return <ThemeProvider><Layout><main className="container mx-auto max-w-4xl px-5 py-12"><Link to="/" className="inline-flex items-center text-sm text-orange-700 hover:underline"><ArrowLeft className="mr-2 h-4 w-4"/>Back home</Link><div className="mt-8 rounded-[2rem] bg-gradient-to-br from-orange-50 to-amber-50 p-8 dark:from-orange-950/25 dark:to-background md:p-12"><Icon className="h-10 w-10 text-orange-700"/><h1 className="mt-5 text-4xl font-bold md:text-5xl">{page.title}</h1><p className="mt-4 max-w-2xl leading-7 text-muted-foreground">{page.intro}</p><p className="mt-5 text-xs uppercase tracking-[.16em] text-muted-foreground">Effective 27 August 2026</p></div><div className="mt-10 space-y-8">{page.sections.map(([title,body])=><section key={title} className="rounded-2xl border bg-card p-6"><h2 className="text-xl font-bold">{title}</h2><p className="mt-3 leading-7 text-muted-foreground">{body}</p></section>)}</div></main></Layout></ThemeProvider>;}
