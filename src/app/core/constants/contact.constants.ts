/**
 * Single source of truth for public contact details.
 * Change the number here and it updates everywhere on the site.
 */

/** E.164 digits only — used to build wa.me links. */
export const WHATSAPP_NUMBER = '17377342972';

/** Human-readable format for display in the UI. */
export const WHATSAPP_DISPLAY = '+1 (737) 734-2972';

/** tel: href for click-to-call. */
export const PHONE_HREF = `tel:+${WHATSAPP_NUMBER}`;

export const SUPPORT_EMAIL = 'support@edupilothelp.com';

/**
 * Build a WhatsApp deep link that opens a chat with a pre-filled message.
 * Works on mobile (app) and desktop (WhatsApp Web).
 */
export function waLink(message = ''): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Default pre-filled messages for different entry points. */
export const WA_MESSAGES = {
  general: "Hi EduPilotHelp! I'd like to know more about your online class help.",
  quote: "Hi EduPilotHelp! I'd like a free quote for my online class.",
  service: (name: string) => `Hi EduPilotHelp! I'd like help with ${name}.`,
};
