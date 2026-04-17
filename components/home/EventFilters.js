import { Search, Filter } from 'lucide-react';
import { CATEGORY_OPTIONS, TYPE_OPTIONS } from '@/data/mockData';

export default function EventFilters({ searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, selectedType, setSelectedType }) {
  return (
    <div className="glass-card flex items-center justify-between gap-16 flex-wrap" style={{ padding: 16, marginBottom: 32 }}>
      <div className="input-group" style={{ flex: '1 1 300px' }}>
        <Search className="input-icon" size={18} />
        <input 
          type="text" 
          placeholder="Search events, organizers, or topics..." 
          className="input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="flex gap-12 flex-wrap" style={{ flex: '1 1 auto' }}>
        <div className="input-group" style={{ flex: 1, minWidth: 150 }}>
          <Filter className="input-icon" size={16} />
          <select className="input" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
             {CATEGORY_OPTIONS.map(opt => <option key={opt} value={opt} style={{color: '#000'}}>{opt}</option>)}
          </select>
        </div>
        
        <div className="input-group" style={{ flex: 1, minWidth: 150 }}>
          <select className="input" style={{ paddingLeft: 16 }} value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
             {TYPE_OPTIONS.map(opt => <option key={opt} value={opt} style={{color: '#000'}}>{opt}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}
