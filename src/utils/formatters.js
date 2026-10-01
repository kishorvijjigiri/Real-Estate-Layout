// Format currency to Indian Rupees (e.g. ₹6,750 or ₹1.82 Cr or ₹45.50 Lakh)
export function formatCurrency(amount) {
  if (amount === null || amount === undefined || isNaN(amount)) return '₹0';
  const num = Number(amount);
  if (num >= 10000000) {
    return `₹${(num / 10000000).toFixed(2)} Cr`;
  }
  if (num >= 100000) {
    return `₹${(num / 100000).toFixed(2)} Lakh`;
  }
  return `₹${num.toLocaleString('en-IN')}`;
}

export function formatSqFt(sqft) {
  if (sqft === null || sqft === undefined || isNaN(sqft)) return '0 Sq. Ft.';
  return `${Number(sqft).toLocaleString('en-IN', { maximumFractionDigits: 2 })} Sq. Ft.`;
}
