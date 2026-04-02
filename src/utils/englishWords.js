const numberToEnglishWords = (num) => {
  const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
  const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

  if (num === 0) return 'zero';
  const n = Math.floor(num);

  if (n >= 1000000) {
    const m = Math.floor(n / 1000000);
    const r = n % 1000000;
    return numberToEnglishWords(m) + ' million' + (r > 0 ? ' ' + numberToEnglishWords(r) : '');
  }
  if (n >= 1000) {
    const t = Math.floor(n / 1000);
    const r = n % 1000;
    return numberToEnglishWords(t) + ' thousand' + (r > 0 ? ' ' + numberToEnglishWords(r) : '');
  }
  if (n >= 100) {
    const h = Math.floor(n / 100);
    const r = n % 100;
    return ones[h] + ' hundred' + (r > 0 ? ' and ' + numberToEnglishWords(r) : '');
  }
  if (n >= 20) {
    const t = Math.floor(n / 10);
    const r = n % 10;
    return tens[t] + (r > 0 ? '-' + ones[r] : '');
  }
  if (n >= 10) return teens[n - 10];
  return ones[n];
};

export default numberToEnglishWords;
