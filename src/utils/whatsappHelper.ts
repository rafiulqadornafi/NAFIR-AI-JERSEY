/**
 * Helper to construct a reliable WhatsApp URL whether the input is a direct link
 * (e.g., https://wa.me/qr/MV2Z72HWCIQZD1 or wa.me/qr/...) or a standard phone number (e.g. 01402580064).
 */
export const DEFAULT_WHATSAPP_LINK = 'https://wa.me/qr/MV2Z72HWCIQZD1';

export function formatWhatsAppLink(input?: string | null, textMessage?: string): string {
  const target = (input && input.trim()) ? input.trim() : DEFAULT_WHATSAPP_LINK;

  // If already a full URL or wa.me link
  if (target.startsWith('http://') || target.startsWith('https://') || target.startsWith('wa.me/')) {
    const fullUrl = target.startsWith('http') ? target : `https://${target}`;
    if (textMessage) {
      const separator = fullUrl.includes('?') ? '&' : '?';
      return `${fullUrl}${separator}text=${encodeURIComponent(textMessage)}`;
    }
    return fullUrl;
  }

  // Otherwise, process as phone digits
  const cleanDigits = target.replace(/[^0-9]/g, '');
  if (!cleanDigits) {
    return DEFAULT_WHATSAPP_LINK;
  }

  const phone = cleanDigits.startsWith('88') ? cleanDigits : `88${cleanDigits}`;
  if (textMessage) {
    return `https://wa.me/${phone}?text=${encodeURIComponent(textMessage)}`;
  }
  return `https://wa.me/${phone}`;
}
