'use client';
import dynamic from 'next/dynamic';

const SmartAssistant = dynamic(() => import('./SmartAssistant'), {
  ssr: false,
});

export default function DynamicAssistant() {
  return <SmartAssistant />;
}
