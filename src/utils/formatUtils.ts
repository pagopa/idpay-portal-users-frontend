export const formatCurrency = (amountCents: number): string =>
  new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(amountCents / 100);

export const formatDate = (dateString: string): string =>
  new Date(dateString).toLocaleDateString('it-IT');

export const formatDateTime = (dateString: string): string =>
  new Intl.DateTimeFormat('it-IT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
    .format(new Date(dateString))
    .replace(/\./g, '');