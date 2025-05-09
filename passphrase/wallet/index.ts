
/*
- 随机熵生成：128-256， 128-12，160-15，192-18，224-21， 256-24
- 计算校验和：对熵进行 SHA-256 的计算，并取 Hash的前几位做为校验和，校验和的长度取决于熵的长度
  - 128-4
  - 160-5
  - 192-6
  - 224-7
  - 256-8
- 组合熵和校验和: 将校验和加到熵的末尾，形成一个新到二进制序列，序列的长度：熵长度 + 校验和的长度
- 分割助记词索引：将组合后的二进制序列切割成每组 11 位的片段，每一片段转换成一个数字，这个数字作为助记词在列表中索引
- 映射为助记词：使用索引提取助记词，词库里面有 2048 个单词
***/
const bip39 = require('bip39');
const crypto = require('crypto');
const fs = require('fs');
export function createMnemonic(): void {
  const entropy = crypto.randomBytes(16);// 128-256位随机熵 16字节 128位 16*8=128
  console.log("生成随机熵==", entropy.toString('hex'));
  const hash = crypto.createHash('sha256').update(entropy).digest(); // 计算 SHA-256 哈希值
  console.log("计算 SHA-256 哈希值==", hash.toString('hex'));
  const checksum : number = hash[0] >> 4; // 取 Hash 的前几位做为校验和
  console.log("取 Hash 的前几位做为校验和==", checksum);
  let bits:string='';
  for(let i:number=0;i<entropy.length;i++){
    bits+=entropy[i].toString(2).padStart(8,'0'); // 转换为二进制字符串，并补齐到 8 位
  }
  console.log("转换为二进制字符串==", bits);
  bits+=checksum.toString(2).padStart(4,'0'); // 补上校验和
  console.log("补上校验和==", bits);
 // 分割助记词索引
 const indexBits = bits.match(/.{1,11}/g); // 切割成每组 11 位的片段
 console.log("切割成每组 11 位的片段==", indexBits);
//  const indicies any[] = [];
//  for(let i:number=0;i<bits.length;i+=11){
//    indicies.push(parseInt(bits.slice(i,i+11),2)); // 转换为数字数组
//  }
 const index = indexBits.map(segment => parseInt(segment, 2)); // 转换为数字数组
 console.log("转换为数字数组==", index);
 // 映射为助记词
 const words = index.map(index => bip39.wordlists.english[index]); // 映射为助记词
 console.log("映射为助记词==", words);
 const mnemonic = words.join(' '); // 助记词
 console.log("助记词==", mnemonic);
 fs.writeFileSync('mnemonic.txt', mnemonic); // 保存助记词到文件
}
/*
2. 助记词的验证
- 检查单词的数量是否落在 12，15，18，21 和 24
- 检查单词是否在 2048 个单词里面，任何一个词不在这个词库里面都是无效的助记词
- 将助记词转换成位串：将每个单词在词库中的索引转换成 11 位的二进制数，将所有的二进制数连接起来形成一个位串
- 提取种子和校验和：和上面的过程是逆过程
- 计算校验和：
- 验证校验和
*/
export function verifyMnemonic(mnemonic: string): boolean {
  return bip39.validateMnemonic(mnemonic); // 验证助记词是否有效
}