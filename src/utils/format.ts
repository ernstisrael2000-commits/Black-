export const formatPrice = (amount: number, currency: 'HTG' | 'USD'): string => {
  if (currency === 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  }
  return new Intl.NumberFormat('fr-HT', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount) + ' HTG';
};

export const formatDate = (date: Date | any): string => {
  if (!date) return '';
  const d = date?.toDate ? date.toDate() : new Date(date);
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d);
};

export const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    en_attente: 'En attente',
    confirme: 'Confirmé',
    en_cours: 'En cours de livraison',
    livre: 'Livré',
    annule: 'Annulé',
    paye: 'Payé',
    rembourse: 'Remboursé',
  };
  return labels[status] || status;
};

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    en_attente: 'text-yellow-400 bg-yellow-400/10',
    confirme: 'text-blue-400 bg-blue-400/10',
    en_cours: 'text-purple-400 bg-purple-400/10',
    livre: 'text-green-400 bg-green-400/10',
    annule: 'text-red-400 bg-red-400/10',
    paye: 'text-green-400 bg-green-400/10',
    rembourse: 'text-orange-400 bg-orange-400/10',
  };
  return colors[status] || 'text-gray-400 bg-gray-400/10';
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};
