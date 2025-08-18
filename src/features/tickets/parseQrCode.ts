import { parseISO } from "date-fns"

export type QrResult = {
  isValid: false
  error: string
} | {
  isValid: true
  entryTime: Date
  code: string
  folio: string
}

export function parseQRCode(qrCode: string): QrResult {
  try {
    // Expected format: YYYYMMDDHHmmCCCCCCCC (20 characters)
    if (qrCode.length !== 20) {
      return {
        isValid: false,
        error: 'Código QR inválido: longitud incorrecta'
      };
    }

    // Extract date/time part (first 14 digits)
    const dateTimePart = qrCode.substring(0, 12);
    const code = qrCode.substring(12, 16)
    const folio = qrCode.substring(16);

    // Parse date: YYYYMMDDHHMMSS
    const year = dateTimePart.substring(0, 4);
    const month = dateTimePart.substring(4, 6);
    const day = dateTimePart.substring(6, 8);
    const hour = dateTimePart.substring(8, 10);
    const minute = dateTimePart.substring(10, 12);
    const second = '00';

    // Create ISO string
    const isoString = `${year}-${month}-${day}T${hour}:${minute}:${second}`;
    const entryTime = parseISO(isoString);

    if (isNaN(entryTime.getTime())) {
      return {
        isValid: false,
        error: 'Código QR inválido: fecha/hora incorrecta'
      };
    }

    return {
      entryTime,
      code,
      folio,
      isValid: true
    };
  } catch (error) {
    return {
      isValid: false,
      error: 'Error al procesar código QR'
    };
  }
}