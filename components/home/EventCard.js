import Link from 'next/link';
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import ProgressBar from '@/components/ui/ProgressBar';

export default function EventCard({ event }) {
  const isAlmostFull = (event.registered / event.capacity) > 0.8;
  
  return (
    <div className="glass-card flex-col animate-fadeInUp" style={{ overflow: 'hidden', height: '100%', borderTop: `4px solid ${event.color}` }}>
      <div style={{ padding: '24px 24px 20px', flex: 1 }}>
        <div className="flex justify-between items-start" style={{ marginBottom: 16 }}>
          <Badge variant={event.featured ? 'primary' : 'ghost'} style={{ background: event.color + '20', color: event.color, borderColor: event.color + '40' }}>
            {event.category}
          </Badge>
          {event.trending && <Badge variant="warning">🔥 Trending</Badge>}
        </div>
        
        <h3 style={{ fontSize: 20, marginBottom: 12, lineHeight: 1.4 }}>{event.title}</h3>
        
        <div className="flex-col gap-8" style={{ marginBottom: 20, fontSize: 13, color: 'var(--text-muted)' }}>
          <div className="flex items-center gap-8">
            <Calendar size={14} />
            <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • {event.time}</span>
          </div>
          <div className="flex items-center gap-8">
            <MapPin size={14} />
            <span>{event.venue}</span>
          </div>
        </div>
        
        <div style={{ marginBottom: 20 }}>
          <div className="flex justify-between items-center" style={{ fontSize: 12, marginBottom: 8, color: 'var(--text-muted)' }}>
            <div className="flex items-center gap-4"><Users size={12} /> {event.registered} / {event.capacity} Registered</div>
            <span style={{ color: isAlmostFull ? 'var(--warning)' : 'var(--success)' }}>
              {isAlmostFull ? 'Filling Fast' : 'Available'}
            </span>
          </div>
          <ProgressBar progress={(event.registered / event.capacity) * 100} color={isAlmostFull ? 'var(--warning)' : 'var(--primary)'} />
        </div>
      </div>
      
      <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', background: 'var(--bg-glass-hover)' }}>
        <Link href={`/event/${event.id}`} className="flex justify-between items-center" style={{ color: 'var(--text)', fontWeight: 500, fontSize: 14 }}>
          View Details
          <ArrowRight size={16} style={{ color: 'var(--primary)' }} />
        </Link>
      </div>
    </div>
  );
}
