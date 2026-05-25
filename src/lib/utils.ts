import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function sendLoanNotification(params: {
  cargo: string;
  nombres_apellidos: string;
  cedula: string;
  telefono: string;
  monto_prestamo: string;
  plazo_prestamo: string;
}) {
  try {
    const phone = '+18096917244';
    const apikey = '8141876';
    const message = `*¡Nueva solicitud de préstamo recibida!* 📝\n\n*Tipo:* ${params.cargo}\n*Nombre:* ${params.nombres_apellidos}\n*Cédula:* ${params.cedula}\n*Teléfono:* ${params.telefono || 'No provisto'}\n*Monto:* $${params.monto_prestamo || 'No provisto'}\n*Plazo:* ${params.plazo_prestamo || 'No provisto'}`;
    const encodedText = encodeURIComponent(message);
    const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodedText}&apikey=${apikey}`;
    
    await fetch(url, { mode: 'no-cors' });
  } catch (e) {
    console.error('CallMeBot notification failed:', e);
  }
}
