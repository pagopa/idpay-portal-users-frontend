export const formatCurrency = (amountCents: number): string =>
  new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(amountCents / 100);

export const formatDate = (dateString: string): string =>
  new Date(dateString).toLocaleDateString('it-IT');