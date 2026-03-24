const englishNumbers = {
  zero: '0',
  one: '1',
  two: '2',
  three: '3',
  four: '4',
  five: '5',
  six: '6',
  seven: '7',
  eight: '8',
  nine: '9',
  ten: '10',
  eleven: '11',
  twelve: '12',
  thirteen: '13',
  fourteen: '14',
  fifteen: '15',
  sixteen: '16',
  seventeen: '17',
  eighteen: '18',
  nineteen: '19',
  twenty: '20',
  thirty: '30',
  forty: '40',
  fifty: '50',
  sixty: '60',
  seventy: '70',
  eighty: '80',
  ninety: '90',
  hundred: '100',
  threehundredsixty: '360',
}

const hindiNumbers = {
  'शून्य': '0',
  'जीरो': '0',
  'एक': '1',
  'दो': '2',
  'तीन': '3',
  'चार': '4',
  'पांच': '5',
  'पाँच': '5',
  'छह': '6',
  'सात': '7',
  'आठ': '8',
  'नौ': '9',
  'दस': '10',
  'ग्यारह': '11',
  'बारह': '12',
  'तेरह': '13',
  'चौदह': '14',
  'पंद्रह': '15',
  'पन्द्रह': '15',
  'सोलह': '16',
  'सत्रह': '17',
  'अठारह': '18',
  'उन्नीस': '19',
  'बीस': '20',
  'तीस': '30',
  'चालीस': '40',
  'पचास': '50',
  'साठ': '60',
  'सत्तर': '70',
  'अस्सी': '80',
  'नब्बे': '90',
  'सौ': '100',
  'तीन सौ साठ': '360',
}

export function parseVoiceInput(input) {
  if (!input || typeof input !== 'string') return ''

  let text = input.toLowerCase().trim()

  text = text
    .replace(/root under of/g, '√')
    .replace(/root under/g, '√')
    .replace(/square root of/g, '√')
    .replace(/square root/g, '√')
    .replace(/square of/g, '')
    .replace(/squared/g, '²')
    .replace(/sin of/g, 'sin(')
    .replace(/cos of/g, 'cos(')
    .replace(/tan of/g, 'tan(')
    .replace(/sin/g, 'sin(')
    .replace(/cos/g, 'cos(')
    .replace(/tan/g, 'tan(')
    .replace(/multiplied by/g, '*')
    .replace(/multiply by/g, '*')
    .replace(/into/g, '*')
    .replace(/plus/g, '+')
    .replace(/minus/g, '-')
    .replace(/divided by/g, '/')
    .replace(/divide by/g, '/')
    .replace(/point/g, '.')
    .replace(/percent/g, '%')
    .replace(/open bracket/g, '(')
    .replace(/close bracket/g, ')')

  text = text
    .replace(/वर्गमूल/g, '√')
    .replace(/रूट/g, '√')
    .replace(/स्क्वायर/g, '²')
    .replace(/का स्क्वायर/g, '²')
    .replace(/साइन/g, 'sin(')
    .replace(/कोस/g, 'cos(')
    .replace(/टैन/g, 'tan(')
    .replace(/प्लस/g, '+')
    .replace(/जोड़/g, '+')
    .replace(/माइनस/g, '-')
    .replace(/घटा/g, '-')
    .replace(/गुणा/g, '*')
    .replace(/इंटू/g, '*')
    .replace(/भाग/g, '/')
    .replace(/दशमलव/g, '.')
    .replace(/प्रतिशत/g, '%')
    .replace(/खुला ब्रैकेट/g, '(')
    .replace(/बंद ब्रैकेट/g, ')')

  Object.keys(englishNumbers).forEach((word) => {
    const regex = new RegExp(`\\b${word}\\b`, 'g')
    text = text.replace(regex, englishNumbers[word])
  })

  Object.keys(hindiNumbers).forEach((word) => {
    const regex = new RegExp(word, 'g')
    text = text.replace(regex, hindiNumbers[word])
  })

  text = text.replace(/\s+/g, '')

  // auto close trig bracket: sin30 -> sin(30)
  text = text.replace(/sin\((\d+(\.\d+)?)(?!\))/g, 'sin($1)')
  text = text.replace(/cos\((\d+(\.\d+)?)(?!\))/g, 'cos($1)')
  text = text.replace(/tan\((\d+(\.\d+)?)(?!\))/g, 'tan($1)')

  // square of 5 type support
  if (/^\d+(\.\d+)?$/.test(text)) {
    return text
  }

  if (
    !/^[0-9+\-*/%.()√²a-z]+$/.test(text) &&
    !text.includes('sin(') &&
    !text.includes('cos(') &&
    !text.includes('tan(')
  ) {
    return ''
  }

  return text
}