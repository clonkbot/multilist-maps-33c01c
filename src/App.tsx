import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Plus, Trash2, Check, Building2, Globe, ChevronDown, Search, AlertCircle } from 'lucide-react';

interface CityListing {
  id: string;
  city: string;
  state: string;
  status: 'pending' | 'active' | 'review';
  addedDate: string;
  coordinates: { lat: number; lng: number };
}

interface Business {
  name: string;
  category: string;
  phone: string;
  website: string;
}

const SAMPLE_CITIES: CityListing[] = [
  { id: '1', city: 'New York', state: 'NY', status: 'active', addedDate: '2024-01-15', coordinates: { lat: 40.7128, lng: -74.006 } },
  { id: '2', city: 'Los Angeles', state: 'CA', status: 'active', addedDate: '2024-01-20', coordinates: { lat: 34.0522, lng: -118.2437 } },
  { id: '3', city: 'Chicago', state: 'IL', status: 'review', addedDate: '2024-02-01', coordinates: { lat: 41.8781, lng: -87.6298 } },
  { id: '4', city: 'Houston', state: 'TX', status: 'pending', addedDate: '2024-02-10', coordinates: { lat: 29.7604, lng: -95.3698 } },
];

const US_CITIES = [
  { city: 'Miami', state: 'FL', coordinates: { lat: 25.7617, lng: -80.1918 } },
  { city: 'Seattle', state: 'WA', coordinates: { lat: 47.6062, lng: -122.3321 } },
  { city: 'Denver', state: 'CO', coordinates: { lat: 39.7392, lng: -104.9903 } },
  { city: 'Boston', state: 'MA', coordinates: { lat: 42.3601, lng: -71.0589 } },
  { city: 'Phoenix', state: 'AZ', coordinates: { lat: 33.4484, lng: -112.074 } },
  { city: 'San Francisco', state: 'CA', coordinates: { lat: 37.7749, lng: -122.4194 } },
  { city: 'Atlanta', state: 'GA', coordinates: { lat: 33.749, lng: -84.388 } },
  { city: 'Dallas', state: 'TX', coordinates: { lat: 32.7767, lng: -96.797 } },
  { city: 'Portland', state: 'OR', coordinates: { lat: 45.5152, lng: -122.6784 } },
  { city: 'Austin', state: 'TX', coordinates: { lat: 30.2672, lng: -97.7431 } },
];

function App() {
  const [listings, setListings] = useState<CityListing[]>(SAMPLE_CITIES);
  const [business, setBusiness] = useState<Business>({
    name: 'Artisan Coffee Co.',
    category: 'Coffee Shop',
    phone: '(555) 123-4567',
    website: 'artisancoffee.com'
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<typeof US_CITIES[0] | null>(null);
  const [editingBusiness, setEditingBusiness] = useState(false);

  const filteredCities = US_CITIES.filter(
    c =>
      !listings.some(l => l.city === c.city && l.state === c.state) &&
      (c.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
       c.state.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const addListing = () => {
    if (!selectedCity) return;
    const newListing: CityListing = {
      id: Date.now().toString(),
      city: selectedCity.city,
      state: selectedCity.state,
      status: 'pending',
      addedDate: new Date().toISOString().split('T')[0],
      coordinates: selectedCity.coordinates
    };
    setListings([...listings, newListing]);
    setShowAddModal(false);
    setSelectedCity(null);
    setSearchQuery('');
  };

  const removeListing = (id: string) => {
    setListings(listings.filter(l => l.id !== id));
  };

  const getStatusColor = (status: CityListing['status']) => {
    switch (status) {
      case 'active': return 'bg-sage text-navy';
      case 'review': return 'bg-gold/20 text-gold-dark';
      case 'pending': return 'bg-navy/10 text-navy/70';
    }
  };

  const getStatusIcon = (status: CityListing['status']) => {
    switch (status) {
      case 'active': return <Check className="w-3 h-3" />;
      case 'review': return <AlertCircle className="w-3 h-3" />;
      case 'pending': return <div className="w-2 h-2 rounded-full bg-current animate-pulse" />;
    }
  };

  return (
    <div className="min-h-screen bg-cream relative overflow-hidden">
      {/* Texture overlay */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIvPjwvc3ZnPg==')]" />

      {/* Grid pattern background */}
      <div className="fixed inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #1a2744 1px, transparent 1px),
            linear-gradient(to bottom, #1a2744 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="border-b border-navy/10 bg-cream/80 backdrop-blur-sm sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-navy rounded-xl flex items-center justify-center shadow-lg">
                  <Globe className="w-5 h-5 md:w-6 md:h-6 text-cream" />
                </div>
                <div>
                  <h1 className="font-display text-xl md:text-2xl text-navy tracking-tight">MultiList</h1>
                  <p className="text-xs md:text-sm text-navy/50 font-body">Google Maps Presence Manager</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowAddModal(true)}
                className="bg-terracotta text-cream px-4 md:px-6 py-2.5 md:py-3 rounded-xl font-body font-medium flex items-center gap-2 shadow-lg shadow-terracotta/20 hover:shadow-xl hover:shadow-terracotta/30 transition-shadow text-sm md:text-base"
              >
                <Plus className="w-4 h-4 md:w-5 md:h-5" />
                <span className="hidden sm:inline">Add City</span>
              </motion.button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10 w-full">
          {/* Business Card */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 md:mb-12"
          >
            <div className="bg-white rounded-2xl md:rounded-3xl p-5 md:p-8 shadow-xl shadow-navy/5 border border-navy/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 md:w-64 h-48 md:h-64 bg-gradient-to-br from-terracotta/5 to-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

              <div className="relative">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-navy to-navy/80 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-7 h-7 md:w-8 md:h-8 text-cream" />
                    </div>
                    <div className="min-w-0">
                      {editingBusiness ? (
                        <input
                          type="text"
                          value={business.name}
                          onChange={(e) => setBusiness({ ...business, name: e.target.value })}
                          className="font-display text-xl md:text-2xl text-navy bg-transparent border-b-2 border-terracotta outline-none w-full"
                        />
                      ) : (
                        <h2 className="font-display text-xl md:text-2xl text-navy truncate">{business.name}</h2>
                      )}
                      <p className="text-navy/50 font-body text-sm md:text-base">{business.category}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setEditingBusiness(!editingBusiness)}
                    className="text-sm font-body text-terracotta hover:text-terracotta/80 transition-colors self-start"
                  >
                    {editingBusiness ? 'Save' : 'Edit'}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                  <div className="bg-cream/50 rounded-xl p-3 md:p-4">
                    <p className="text-xs text-navy/40 font-body uppercase tracking-wider mb-1">Phone</p>
                    {editingBusiness ? (
                      <input
                        type="tel"
                        value={business.phone}
                        onChange={(e) => setBusiness({ ...business, phone: e.target.value })}
                        className="font-body text-navy bg-transparent border-b border-navy/20 outline-none w-full text-sm md:text-base"
                      />
                    ) : (
                      <p className="font-body text-navy text-sm md:text-base">{business.phone}</p>
                    )}
                  </div>
                  <div className="bg-cream/50 rounded-xl p-3 md:p-4">
                    <p className="text-xs text-navy/40 font-body uppercase tracking-wider mb-1">Website</p>
                    {editingBusiness ? (
                      <input
                        type="text"
                        value={business.website}
                        onChange={(e) => setBusiness({ ...business, website: e.target.value })}
                        className="font-body text-navy bg-transparent border-b border-navy/20 outline-none w-full text-sm md:text-base"
                      />
                    ) : (
                      <p className="font-body text-navy text-sm md:text-base">{business.website}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Stats */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-3 gap-3 md:gap-6 mb-8 md:mb-12"
          >
            {[
              { label: 'Active', value: listings.filter(l => l.status === 'active').length, color: 'bg-sage' },
              { label: 'In Review', value: listings.filter(l => l.status === 'review').length, color: 'bg-gold' },
              { label: 'Pending', value: listings.filter(l => l.status === 'pending').length, color: 'bg-navy/20' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg shadow-navy/5 border border-navy/5 text-center"
              >
                <div className={`w-2 md:w-3 h-2 md:h-3 ${stat.color} rounded-full mx-auto mb-2 md:mb-3`} />
                <p className="font-display text-2xl md:text-4xl text-navy">{stat.value}</p>
                <p className="text-xs md:text-sm text-navy/50 font-body mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </motion.section>

          {/* City Listings */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h3 className="font-display text-lg md:text-xl text-navy">Your Listings</h3>
              <p className="text-xs md:text-sm text-navy/50 font-body">{listings.length} cities</p>
            </div>

            <div className="grid gap-3 md:gap-4">
              <AnimatePresence mode="popLayout">
                {listings.map((listing, index) => (
                  <motion.div
                    key={listing.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg shadow-navy/5 border border-navy/5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 group hover:shadow-xl transition-shadow"
                  >
                    <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-terracotta/10 to-terracotta/5 rounded-xl flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 md:w-6 md:h-6 text-terracotta" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-display text-base md:text-lg text-navy truncate">{listing.city}, {listing.state}</h4>
                        <p className="text-xs md:text-sm text-navy/40 font-body">Added {new Date(listing.addedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 justify-between sm:justify-end">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-body font-medium ${getStatusColor(listing.status)}`}>
                        {getStatusIcon(listing.status)}
                        {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeListing(listing.id)}
                        className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-red-50 text-red-400 flex items-center justify-center opacity-60 sm:opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {listings.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 md:py-16"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 bg-navy/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 md:w-10 md:h-10 text-navy/30" />
                </div>
                <h4 className="font-display text-lg md:text-xl text-navy/50 mb-2">No listings yet</h4>
                <p className="text-sm md:text-base text-navy/30 font-body">Add your first city to get started</p>
              </motion.div>
            )}
          </motion.section>
        </main>

        {/* Footer */}
        <footer className="border-t border-navy/5 py-4 md:py-6 mt-auto">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <p className="text-center text-xs text-navy/30 font-body">
              Requested by <span className="text-navy/40">@keloism</span> · Built by <span className="text-navy/40">@clonkbot</span>
            </p>
          </div>
        </footer>
      </div>

      {/* Add City Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-navy/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-cream rounded-t-3xl sm:rounded-3xl p-6 md:p-8 w-full sm:max-w-lg shadow-2xl max-h-[85vh] overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-xl md:text-2xl text-navy">Add New City</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="w-10 h-10 rounded-xl bg-navy/5 flex items-center justify-center text-navy/50 hover:bg-navy/10 transition-colors"
                >
                  <ChevronDown className="w-5 h-5" />
                </button>
              </div>

              <div className="relative mb-4">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy/30" />
                <input
                  type="text"
                  placeholder="Search cities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white rounded-xl pl-12 pr-4 py-3 md:py-4 font-body text-navy placeholder:text-navy/30 outline-none border-2 border-transparent focus:border-terracotta/30 transition-colors"
                />
              </div>

              <div className="flex-1 overflow-y-auto -mx-2 px-2 min-h-0">
                <div className="grid gap-2">
                  {filteredCities.map((city) => (
                    <motion.button
                      key={`${city.city}-${city.state}`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedCity(city)}
                      className={`w-full text-left p-3 md:p-4 rounded-xl transition-all flex items-center gap-3 ${
                        selectedCity?.city === city.city
                          ? 'bg-terracotta text-cream'
                          : 'bg-white hover:bg-navy/5 text-navy'
                      }`}
                    >
                      <MapPin className={`w-5 h-5 flex-shrink-0 ${selectedCity?.city === city.city ? 'text-cream' : 'text-terracotta'}`} />
                      <span className="font-body text-sm md:text-base">{city.city}, {city.state}</span>
                    </motion.button>
                  ))}
                  {filteredCities.length === 0 && (
                    <p className="text-center text-navy/40 font-body py-8 text-sm md:text-base">
                      {searchQuery ? 'No matching cities found' : 'All available cities have been added'}
                    </p>
                  )}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={addListing}
                disabled={!selectedCity}
                className="mt-4 w-full bg-navy text-cream py-3 md:py-4 rounded-xl font-body font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-navy/20 text-sm md:text-base"
              >
                Add {selectedCity ? `${selectedCity.city}, ${selectedCity.state}` : 'Selected City'}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
