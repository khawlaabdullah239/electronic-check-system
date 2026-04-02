// Number to Arabic Words Conversion (Standard Formal Arabic for banking)
const numberToArabicWords = (num) => {
  const ones = ['', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة'];
  const tens = ['', '', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون'];
  const teens = ['عشرة', 'أحد عشر', 'اثنا عشر', 'ثلاثة عشر', 'أربعة عشر', 'خمسة عشر', 'ستة عشر', 'سبعة عشر', 'ثمانية عشر', 'تسعة عشر'];
  const hundreds = ['', 'مائة', 'مائتان', 'ثلاثمائة', 'أربعمائة', 'خمسمائة', 'ستمائة', 'سبعمائة', 'ثمانمائة', 'تسعمائة'];

  if (num === 0) return 'صفر';

  let result = '';
  const number = Math.floor(num);

  if (number >= 1000000) {
    const millions = Math.floor(number / 1000000);
    if (millions === 1) result += 'مليون ';
    else if (millions === 2) result += 'مليونان ';
    else if (millions <= 10) result += numberToArabicWords(millions) + ' ملايين ';
    else result += numberToArabicWords(millions) + ' مليون ';

    const remainder = number % 1000000;
    if (remainder > 0) {
      result += 'و' + numberToArabicWords(remainder);
    }
    return result;
  }

  if (number >= 1000) {
    const thousands = Math.floor(number / 1000);
    if (thousands === 1) result += 'ألف ';
    else if (thousands === 2) result += 'ألفان ';
    else if (thousands <= 10) result += numberToArabicWords(thousands) + ' آلاف ';
    else result += numberToArabicWords(thousands) + ' ألف ';

    const remainder = number % 1000;
    if (remainder > 0) {
      result += 'و' + numberToArabicWords(remainder);
    }
    return result;
  }

  if (number >= 100) {
    result += hundreds[Math.floor(number / 100)];
    const remainder = number % 100;
    if (remainder > 0) {
      result += ' و' + numberToArabicWords(remainder);
    }
    return result;
  }

  if (number >= 20) {
    result += tens[Math.floor(number / 10)];
    const remainder = number % 10;
    if (remainder > 0) {
      result += ' و' + ones[remainder];
    }
    return result;
  }

  if (number >= 10) {
    return teens[number - 10];
  }

  return ones[number];
};

export default numberToArabicWords;
