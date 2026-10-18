import type { Sponsor, SponsorId } from '@/types';
import { brandLogo, SMART_LOGO } from '@/data/images';

/** tint = each brand's real primary color — the one sanctioned use of raw hex. */
export const sponsors: Record<SponsorId, Sponsor> = {
  globe: {
    id: 'globe',
    name: 'Globe',
    logo: brandLogo('globe.com.ph'),
    tint: '#0060FF',
  },
  smart: {
    id: 'smart',
    name: 'Smart',
    logo: SMART_LOGO,
    tint: '#00A94F',
  },
  dito: {
    id: 'dito',
    name: 'DITO',
    logo: brandLogo('dito.ph'),
    tint: '#E4002B',
  },
  jollibee: {
    id: 'jollibee',
    name: 'Jollibee',
    logo: brandLogo('jollibee.com.ph'),
    tint: '#E01E26',
  },
  puregold: {
    id: 'puregold',
    name: 'Puregold',
    logo: brandLogo('puregold.com'),
    tint: '#D5001C',
  },
  sevenEleven: {
    id: 'sevenEleven',
    name: '7-Eleven',
    logo: brandLogo('7-eleven.com.ph'),
    tint: '#008061',
  },
  sm: {
    id: 'sm',
    name: 'SM',
    logo: brandLogo('smsupermalls.com'),
    tint: '#0054A6',
  },
  grab: {
    id: 'grab',
    name: 'Grab',
    logo: brandLogo('grab.com'),
    tint: '#00B14F',
  },
  mcdo: {
    id: 'mcdo',
    name: "McDonald's",
    logo: brandLogo('mcdonalds.com.ph'),
    tint: '#DA291C',
  },
  shopee: {
    id: 'shopee',
    name: 'Shopee',
    logo: brandLogo('shopee.ph'),
    tint: '#EE4D2D',
  },
};
