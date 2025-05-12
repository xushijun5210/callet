
const bip39 = require('bip39');

// 根据指定的语言生成指定长度的助记词
export function generateMnemonic (params: { number: any; language: any; }) {
  const { number, language } = params;
  if (!number && !language) throw new Error('Must have language and language');
  switch (language) {
    case 'chinese_simplified':
      if (number === 12) {
        return bip39.generateMnemonic(128, null, bip39.wordlists.chinese_simplified);
      } else if (number === 15) {
        return bip39.generateMnemonic(160, null, bip39.wordlists.chinese_simplified);
      } else if (number === 18) {
        return bip39.generateMnemonic(192, null, bip39.wordlists.chinese_simplified);
      } else if (number === 21) {
        return bip39.generateMnemonic(224, null, bip39.wordlists.chinese_simplified);
      } else if (number === 24) {
        return bip39.generateMnemonic(256, null, bip39.wordlists.chinese_simplified);
      } else {
        throw new Error("Don't support this number");
      }
    case 'chinese_traditional':
      if (number === 12) {
        return bip39.generateMnemonic(128, null, bip39.wordlists.chinese_traditional);
      } else if (number === 15) {
        return bip39.generateMnemonic(160, null, bip39.wordlists.chinese_traditional);
      } else if (number === 18) {
        return bip39.generateMnemonic(192, null, bip39.wordlists.chinese_traditional);
      } else if (number === 21) {
        return bip39.generateMnemonic(224, null, bip39.wordlists.chinese_traditional);
      } else if (number === 24) {
        return bip39.generateMnemonic(256, null, bip39.wordlists.chinese_traditional);
      } else {
        throw new Error("Don't support this number");
      }
    case 'english':
      if (number === 12) {
        return bip39.generateMnemonic(128, null, bip39.wordlists.english);
      } else if (number === 15) {
        return bip39.generateMnemonic(160, null, bip39.wordlists.english);
      } else if (number === 18) {
        return bip39.generateMnemonic(192, null, bip39.wordlists.english);
      } else if (number === 21) {
        return bip39.generateMnemonic(224, null, bip39.wordlists.english);
      } else if (number === 24) {
        return bip39.generateMnemonic(256, null, bip39.wordlists.english);
      } else {
        throw new Error("Don't support this number");
      }
    case 'french':
      if (number === 12) {
        return bip39.generateMnemonic(128, null, bip39.wordlists.french);
      } else if (number === 15) {
        return bip39.generateMnemonic(160, null, bip39.wordlists.french);
      } else if (number === 18) {
        return bip39.generateMnemonic(192, null, bip39.wordlists.french);
      } else if (number === 21) {
        return bip39.generateMnemonic(224, null, bip39.wordlists.french);
      } else if (number === 24) {
        return bip39.generateMnemonic(256, null, bip39.wordlists.french);
      } else {
        throw new Error("Don't support this number");
      }
    case 'italian':
      if (number === 12) {
        return bip39.generateMnemonic(128, null, bip39.wordlists.italian);
      } else if (number === 15) {
        return bip39.generateMnemonic(160, null, bip39.wordlists.italian);
      } else if (number === 18) {
        return bip39.generateMnemonic(192, null, bip39.wordlists.italian);
      } else if (number === 21) {
        return bip39.generateMnemonic(224, null, bip39.wordlists.italian);
      } else if (number === 24) {
        return bip39.generateMnemonic(256, null, bip39.wordlists.italian);
      } else {
        throw new Error("Don't support this number");
      }
    case 'japanese':
      if (number === 12) {
        return bip39.generateMnemonic(128, null, bip39.wordlists.japanese);
      } else if (number === 15) {
        return bip39.generateMnemonic(160, null, bip39.wordlists.japanese);
      } else if (number === 18) {
        return bip39.generateMnemonic(192, null, bip39.wordlists.japanese);
      } else if (number === 21) {
        return bip39.generateMnemonic(224, null, bip39.wordlists.japanese);
      } else if (number === 24) {
        return bip39.generateMnemonic(256, null, bip39.wordlists.japanese);
      } else {
        throw new Error("Don't support this number");
      }
    case 'korean':
      if (number === 12) {
        return bip39.generateMnemonic(128, null, bip39.wordlists.korean);
      } else if (number === 15) {
        return bip39.generateMnemonic(160, null, bip39.wordlists.korean);
      } else if (number === 18) {
        return bip39.generateMnemonic(192, null, bip39.wordlists.korean);
      } else if (number === 21) {
        return bip39.generateMnemonic(224, null, bip39.wordlists.korean);
      } else if (number === 24) {
        return bip39.generateMnemonic(256, null, bip39.wordlists.korean);
      } else {
        throw new Error("Don't support this number");
      }
    case 'spanish':
      if (number === 12) {
        return bip39.generateMnemonic(128, null, bip39.wordlists.spanish);
      } else if (number === 15) {
        return bip39.generateMnemonic(160, null, bip39.wordlists.spanish);
      } else if (number === 18) {
        return bip39.generateMnemonic(192, null, bip39.wordlists.spanish);
      } else if (number === 21) {
        return bip39.generateMnemonic(224, null, bip39.wordlists.spanish);
      } else if (number === 24) {
        return bip39.generateMnemonic(256, null, bip39.wordlists.spanish);
      } else {
        throw new Error("Don't support this number");
      }
    default:
      throw new Error('Temporarily does not support the situation you want');
  }
}

// 将助记词编码为熵值
export function encodeMnemonic (params: { mnemonic: any; language: any; }) {
  const { mnemonic, language } = params;
  if (!mnemonic && !language) throw new Error('Must have mnemonic and language');
  switch (language) {
    case 'chinese_simplified':
      return bip39.mnemonicToEntropy(mnemonic, bip39.wordlists.chinese_simplified);
    case 'chinese_traditional':
      return bip39.mnemonicToEntropy(mnemonic, bip39.wordlists.chinese_traditional);
    case 'english':
      return bip39.mnemonicToEntropy(mnemonic, bip39.wordlists.english);
    case 'french':
      return bip39.mnemonicToEntropy(mnemonic, bip39.wordlists.french);
    case 'italian':
      return bip39.mnemonicToEntropy(mnemonic, bip39.wordlists.italian);
    case 'japanese':
      return bip39.mnemonicToEntropy(mnemonic, bip39.wordlists.japanese);
    case 'korean':
      return bip39.mnemonicToEntropy(mnemonic, bip39.wordlists.korean);
    case 'spanish':
      return bip39.mnemonicToEntropy(mnemonic, bip39.wordlists.spanish);
    default:
      throw new Error('Temporarily does not support the situation you want');
  }
}

// 将熵值解码为助记词
export function decodeMnemonic (params: { encrytMnemonic: any; language: any; }) {
  const { encrytMnemonic, language } = params;
  if (!encrytMnemonic && !language) throw new Error('Must have mnemonic and language');
  switch (language) {
    case 'chinese_simplified':
      return bip39.entropyToMnemonic(encrytMnemonic, bip39.wordlists.chinese_simplified);
    case 'chinese_traditional':
      return bip39.entropyToMnemonic(encrytMnemonic, bip39.wordlists.chinese_traditional);
    case 'english':
      return bip39.entropyToMnemonic(encrytMnemonic, bip39.wordlists.english);
    case 'french':
      return bip39.entropyToMnemonic(encrytMnemonic, bip39.wordlists.french);
    case 'italian':
      return bip39.entropyToMnemonic(encrytMnemonic, bip39.wordlists.italian);
    case 'japanese':
      return bip39.entropyToMnemonic(encrytMnemonic, bip39.wordlists.japanese);
    case 'korean':
      return bip39.entropyToMnemonic(encrytMnemonic, bip39.wordlists.korean);
    case 'spanish':
      return bip39.entropyToMnemonic(encrytMnemonic, bip39.wordlists.spanish);
    default:
      throw new Error('Temporarily does not support the situation you want');
  }
}

// 将助记词转换为种子
export function mnemonicToSeed (params: { mnemonic: any; password: any; }) {
  const { mnemonic, password } = params;
  if (!mnemonic) throw new Error('Must have mnemonic');
  return bip39.mnemonicToSeedSync(mnemonic, password);
}

// 将助记词转换为熵值
export function mnemonicToEntropy (params: { mnemonic: any; password: any; }) {
  const { mnemonic, password } = params;
  if (!mnemonic) throw new Error('Must have mnemonic');
  return bip39.mnemonicToEntropy(mnemonic, password);
}

// 验证助记词是否有效
export function validateMnemonic (params: { mnemonic: any; language: any; }) {
  const { mnemonic, language } = params;
  if (!mnemonic && !language) throw new Error('Must have mnemonic and language');
  switch (language) {
    case 'chinese_simplified':
      return bip39.validateMnemonic(mnemonic, bip39.wordlists.chinese_simplified);
    case 'chinese_traditional':
      return bip39.validateMnemonic(mnemonic, bip39.wordlists.chinese_traditional);
    case 'english':
      return bip39.validateMnemonic(mnemonic, bip39.wordlists.english);
    case 'french':
      return bip39.validateMnemonic(mnemonic, bip39.wordlists.french);
    case 'italian':
      return bip39.validateMnemonic(mnemonic, bip39.wordlists.italian);
    case 'japanese':
      return bip39.validateMnemonic(mnemonic, bip39.wordlists.japanese);
    case 'korean':
      return bip39.validateMnemonic(mnemonic, bip39.wordlists.korean);
    case 'spanish':
      return bip39.validateMnemonic(mnemonic, bip39.wordlists.spanish);
    default:
      throw new Error('Temporarily does not support the situation you want');
  }
}