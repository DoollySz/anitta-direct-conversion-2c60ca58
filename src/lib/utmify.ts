// UTMify event tracking helper
// Docs: https://docs.utmify.com.br

declare global {
  interface Window {
    pixelId?: string;
    Utmify?: {
      sendEvent: (event: string, data?: Record<string, unknown>) => void;
    };
  }
}

type UtmifyEvent = 
  | 'PageView'
  | 'ViewContent'
  | 'InitiateCheckout'
  | 'AddPaymentInfo'
  | 'Purchase';

interface PurchaseData {
  value: number; // in BRL (e.g., 14.90)
  transaction_id?: string;
}

/**
 * Send UTMify tracking event
 */
export const sendUtmifyEvent = (event: UtmifyEvent, data?: Record<string, unknown>) => {
  try {
    if (typeof window !== 'undefined' && window.Utmify) {
      console.log(`[UTMify] Sending event: ${event}`, data);
      window.Utmify.sendEvent(event, data);
    } else {
      console.warn('[UTMify] Utmify not loaded yet');
    }
  } catch (error) {
    console.error('[UTMify] Error sending event:', error);
  }
};

/**
 * Track InitiateCheckout - call when user enters checkout page
 */
export const trackInitiateCheckout = (value: number) => {
  sendUtmifyEvent('InitiateCheckout', { value });
};

/**
 * Track AddPaymentInfo - call when PIX is generated
 */
export const trackAddPaymentInfo = (value: number) => {
  sendUtmifyEvent('AddPaymentInfo', { value });
};

/**
 * Track Purchase - call when payment is confirmed
 */
export const trackPurchase = (value: number, transactionId?: string) => {
  sendUtmifyEvent('Purchase', { 
    value, 
    transaction_id: transactionId 
  });
};
