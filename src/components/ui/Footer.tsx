import { OrnamentalDivider } from '@/components/ornamental';
import { RESTAURANT } from '@/lib/restaurant';

export default function Footer() {
  return (
    <footer className="relative bg-warm-black border-t border-brass/15">
      {/* Textile-inspired border */}
      <div className="textile-border" />

      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-serif text-ivory tracking-wide mb-1">{RESTAURANT.name}</h3>
            <p className="text-brass/75 text-[11px] font-body mb-4 tracking-wide font-medium">{RESTAURANT.fullHindiName}</p>
            <p className="text-ivory/70 text-sm leading-relaxed font-body">
              {RESTAURANT.description} Takeaway & delivery available.
            </p>
            <div className="flex items-center gap-2 mt-6">
              <div className="w-1 h-1 rounded-full bg-brass/50" />
              <div className="w-1.5 h-1.5 rounded-full bg-brass/80" />
              <div className="w-1 h-1 rounded-full bg-brass/50" />
            </div>
          </div>

          {/* Address */}
          <div>
            <h4 className="text-[11px] uppercase tracking-[0.25em] text-brass/80 mb-5 font-body font-semibold">📍 Address</h4>
            <div className="space-y-1 text-ivory/75 text-sm font-body">
              <p>{RESTAURANT.address.street}</p>
              <p>{RESTAURANT.address.area}</p>
              <p>{RESTAURANT.address.city}, {RESTAURANT.address.state}</p>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[11px] uppercase tracking-[0.25em] text-brass/80 mb-5 font-body font-semibold">☎ Contact</h4>
            <div className="space-y-2 text-sm font-body">
              {RESTAURANT.phones.map((phone) => (
                <a key={phone.number} href={phone.tel} className="block text-ivory/75 hover:text-brass transition-colors duration-300">
                  {phone.display}
                </a>
              ))}
              <a href={`mailto:${RESTAURANT.email}`} className="block text-ivory/75 hover:text-brass transition-colors duration-300 pt-1">
                {RESTAURANT.email}
              </a>
            </div>
          </div>

          {/* Delivery & Payments */}
          <div>
            <h4 className="text-[11px] uppercase tracking-[0.25em] text-brass/80 mb-5 font-body font-semibold">🚚 Delivery</h4>
            <div className="space-y-1 text-ivory/75 text-sm font-body mb-6">
              {RESTAURANT.delivery.display.map((t) => (
                <p key={t}>{t}</p>
              ))}
            </div>
            <h4 className="text-[11px] uppercase tracking-[0.25em] text-brass/80 mb-3 font-body font-semibold">💳 Payments</h4>
            <div className="flex flex-wrap gap-2">
              {RESTAURANT.payments.map((p) => (
                <span key={p} className="text-[10px] text-ivory/80 bg-warm-dark/70 px-2 py-1 rounded-sm border border-brass/15 font-body">
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Facebook link + Copyright */}
        <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-4">
          <a
            href={RESTAURANT.facebook.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-ivory/70 hover:text-brass transition-colors duration-300 font-body tracking-wide"
          >
            Follow us on Facebook →
          </a>
          <p className="text-[11px] text-ivory/60 tracking-[0.15em] font-body">
            &copy; {new Date().getFullYear()} {RESTAURANT.name}. All Rights Reserved.
          </p>
        </div>

        <OrnamentalDivider variant="dot" className="my-8" />
      </div>
    </footer>
  );
}
