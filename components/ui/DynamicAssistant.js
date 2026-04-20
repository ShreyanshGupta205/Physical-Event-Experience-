'use client';
import dynamic from 'next/dynamic';

const SmartAssistant = dynamic(() => import('./SmartAssistant'), {
  ssr: false,
});

export default function DynamicAssistant() {
  if (typeof window === 'undefined') return null;
  return <SmartAssistant />;
}
