// Single source of truth for contact info and brand constants.
// TODO: replace placeholder numbers/emails with the real ones before launch.
export const LC = {
  brandName: 'Legal Connections',
  tagline: { en: 'Connected by Trust', es: 'Conectados por la Confianza', pt: 'Conectados pela Confiança' },
  phoneDisplay: '(407) 603-3030',
  phoneHref: 'tel:+14076033030',
  whatsappNumber: '14076033030', // TODO real number, digits only with country code
  email: 'contact@legal-connections.com', // TODO real email
  // Physical business address. Published in the footer and the legal pages —
  // required by the SMS messaging partner (Ooma) to verify that the address and
  // phone number belong to the business. Must match the address registered with
  // Ooma character for character.
  // TODO: replace with the real registered street address before launch.
  address: {
    street: '123 Test Dr.',
    city: 'Orlando',
    state: 'FL',
    zip: '32828',
    country: 'USA',
  },
  siteUrl: 'https://www.legal-connections.com',
  social: {
    facebook: 'https://www.facebook.com/profile.php?id=61592322682478',
    instagram: 'https://instagram.com/legalconnections.us', // TODO real handle
    tiktok: 'https://tiktok.com/@legalconnections.us', // TODO real handle
    youtube: 'https://youtube.com/@legalconnections', // TODO real handle
  },
};

// One-line address string, e.g. "123 Test Dr., Orlando, FL 32828".
// Used in the footer and in the legal documents.
export const addressLine = () =>
  `${LC.address.street}, ${LC.address.city}, ${LC.address.state} ${LC.address.zip}`;

// Google Maps link for the address above. Works on desktop and hands off to the
// native maps app on iOS/Android.
export const addressHref = () =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${addressLine()}, ${LC.address.country}`,
  )}`;
