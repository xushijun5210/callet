const ethers = require("ethers" )
import { Interface } from '@ethersproject/abi';
const BigNumber = require('BigNumber.js');
import {FeeMarketEIP1559Transaction, Transaction} from '@ethereumjs/tx'
import Common from '@ethereumjs/common'


// ETH SDK 支持的 EVM链
const SUPPORT_CHAIN_NETWORK = {
    1: 'Ethereum',
    324: 'ZksyncEra',
    42161: 'Arbitrum',
    42170: 'ArbitrumNova',
    5000: 'Mantle',
    56: 'BscChain',
    128: 'Heco',
    137: 'Polygon',
    10001: 'EthereumPow',
    61: 'EthereumClassic',
    8217: 'klay',
    1101: 'PolygonZk',
    66: 'OkexChain',
    9001: 'Evmos',
    10: 'Optimism',
    59144: 'Linea',
    8453: 'Base',
    17000: 'Holesky',
    11155111: 'Sepolia'
};
// 将任意值转换为十六进制字符串
export function numberToHex(value: any)
 {
    // 将输入的值转换为 BigNumber 类型
    const number = BigNumber(value);
    // 将 BigNumber 类型的值转换为十六进制字符串
    const result = number.toString(16);
    // 返回带有 '0x' 前缀的十六进制字符串
    return '0x' + result;
}
// 创建 ETH 钱包地址
export function createAddress(seedHex: string, addressIndex: string)  {
   // 从种子十六进制字符串创建根节点
   const rootNode = ethers.utils.HDNode.fromSeed(Buffer.from(seedHex, "hex"))
    // 根据指定路径派生出子节点，并提取私钥、公钥和地址
    const {
        privateKey,
        publicKey,
        address
    } = rootNode.derivePath("m/44'/60'/0'/0/" + addressIndex + '')
    // 将私钥、公钥和地址转换为 JSON 字符串并返回
    return JSON.stringify({
        privateKey,
        publicKey,
        address
    })
}
// 使用提供的私钥创建以太坊钱包实例
export function importEthWallet(privateKey: string) {
    // 使用提供的私钥创建以太坊钱包实例
    const wallet = new ethers.Wallet(Buffer.from(privateKey, "hex"))
    // 返回包含私钥和钱包地址的JSON字符串
    return JSON.stringify({
        privateKey,
        address: wallet.address
    })
}

export function publicKeyToAddress(publicKey: string) {
    // 根据给定的公钥计算以太坊地址
    return ethers.utils.computeAddress(publicKey)
}

export function verifyAddress(address: string) {
    // 验证给定的地址是否为有效的以太坊地址
    return ethers.utils.isAddress(address)
}
//签名交易
export async function signTransaction(params: any) {
    // 解构从参数对象中提取的必要字段
    const { privateKey, nonce, from, to, gasLimit, gasPrice, amount, data, chainId, decimal, maxFeePerGas, maxPriorityFeePerGas, tokenAddress } = params;
    // @ts-ignore
    // 检查链ID是否在支持的网络列表中，如果不支持则抛出错误
    if (!SUPPORT_CHAIN_NETWORK[chainId]) {
        throw new Error(`chain id ${chainId} is not support.`);
    }
    // 使用提供的私钥创建一个以太坊钱包实例
    const wallet = new ethers.Wallet(Buffer.from(privateKey, 'hex'));
    // 初始化交易数据对象
    const txData: any = {
        nonce: ethers.utils.hexlify(nonce),
        from,
        to,
        gasLimit: ethers.utils.hexlify(gasLimit),
        value: ethers.utils.hexlify(ethers.utils.parseUnits(amount, decimal)),
        chainId
    };
    // 根据EIP-1559设置交易的费用参数
    if (maxFeePerGas && maxPriorityFeePerGas) {
        txData.maxFeePerGas = numberToHex(maxFeePerGas);
        txData.maxPriorityFeePerGas = numberToHex(maxPriorityFeePerGas);
    } else {
        txData.gasPrice = ethers.utils.hexlify(gasPrice);
    }
    // 如果提供了token地址，则构建一个代币转移交易
    if (tokenAddress && tokenAddress !== '0x00') {
        const ABI = [
            'function transfer(address to, uint amount)'
        ];
        const iface = new Interface(ABI);
        txData.data = iface.encodeFunctionData('transfer', [to, ethers.utils.hexlify(ethers.utils.parseUnits(amount, decimal))]);
        txData.to = tokenAddress;
        txData.value = 0;
    }
    // 如果提供了额外的数据，则将其添加到交易数据中
    if (data) {
        txData.data = data;
    }
    // 返回签名后的交易
    return wallet.signTransaction(txData);
}


export function ethSign(params:any) {
    // 解构参数对象以获取所需的交易数据
    let { privateKey, nonce, from, to, gasPrice, gasLimit, amount, tokenAddress, decimal, maxPriorityFeePerGas, maxFeePerGas, chainId, data } = params;
    // 将交易的nonce转换为16进制字符串
    const transactionNonce = numberToHex(nonce);
    // 将gasLimit转换为16进制字符串
    const gasLimits = numberToHex(gasLimit);
    // 将chainId转换为16进制字符串
    const chainIdHex = numberToHex(chainId);
    // 根据代币的小数位数计算实际的交易金额
    let newAmount = BigNumber(amount).times((BigNumber(10).pow(decimal)));
    // 将计算出的交易金额转换为16进制字符串
    const numBalanceHex = numberToHex(newAmount);
    // 初始化交易数据对象
    let txData: any = {
        nonce: transactionNonce,
        gasLimit: gasLimits,
        to,
        from,
        chainId: chainIdHex,
        value: numBalanceHex
    }
    // 如果提供了maxFeePerGas和maxPriorityFeePerGas，则使用EIP-1559交易格式
    if (maxFeePerGas && maxPriorityFeePerGas) {
        txData.maxFeePerGas = numberToHex(maxFeePerGas);
        txData.maxPriorityFeePerGas = numberToHex(maxPriorityFeePerGas);
    } else {
        // 否则使用旧的交易格式，并将gasPrice转换为16进制字符串
        txData.gasPrice = numberToHex(gasPrice);
    }
    // 如果提供了tokenAddress且不为默认值"0x00"，则构建代币转移交易
    if (tokenAddress && tokenAddress !== "0x00") {
        const ABI = [
            "function transfer(address to, uint amount)"
        ];
        const iface = new Interface(ABI);
        // 编码代币转移函数的调用数据
        txData.data = iface.encodeFunctionData("transfer", [to, numBalanceHex]);
        // 将交易的接收地址设置为代币合约地址
        txData.to = tokenAddress;
        // 代币转移交易的value字段设为0
        txData.value = 0;
    }
    // 如果提供了自定义的交易data，则覆盖之前的data字段
    if (data) {
        txData.data = data;
    }
    // 根据交易数据创建Common对象和Transaction对象
    let common: any, tx: any;
    if (txData.maxFeePerGas && txData.maxPriorityFeePerGas) {
        common = (Common as any).custom({
            chainId: chainId,
            defaultHardfork: "london"
        });
        tx = FeeMarketEIP1559Transaction.fromTxData(txData, {
            common
        });
    } else {
        common = (Common as any).custom({ chainId: chainId })
        tx = Transaction.fromTxData(txData, {
            common
        });
    }
    // 将私钥转换为Buffer对象
    const privateKeyBuffer = Buffer.from(privateKey, "hex");
    // 使用私钥对交易进行签名
    const signedTx = tx.sign(privateKeyBuffer);
    // 序列化签名后的交易
    const serializedTx = signedTx.serialize();
    // 如果序列化后的交易为空，则抛出错误
    if (!serializedTx) {
        throw new Error("sign is null or undefined");
    }
    // 返回序列化后的交易的16进制字符串表示
    return `0x${serializedTx.toString('hex')}`;
}