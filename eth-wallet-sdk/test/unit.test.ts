import {createAddress, ethSign, importEthWallet, signTransaction, verifyAddress,publicKeyToAddress} from "../wallet";
import { generateMnemonic, mnemonicToSeed ,validateMnemonic,} from "../wallet/bip/bip";
describe("eth wallet test", () => {
    //创建助记词和验证助记词
    test("create Mnemonic", () => {
        const mnemonic = generateMnemonic({ number: 12, language: 'english' });
        console.log(mnemonic)
        const isValid = validateMnemonic({ mnemonic: mnemonic, language: 'english' });
        console.log(isValid)
    });
    //根据助记词生成种子
    test("create seed", () => {
        const mnemonic = "attend control tragic rough possible you coral jelly earn fringe bullet loop";
        const seed = mnemonicToSeed( { mnemonic: mnemonic, password: 'xushijun5210' });
        console.log("create seed===", seed.toString('hex'))
    });
    //助记词生成公钥,私钥和地址
    test("create address", () => {
        const mnemonic = "attend control tragic rough possible you coral jelly earn fringe bullet loop";
        const seed = mnemonicToSeed( { mnemonic: mnemonic, password: '' });
        const addressInfo = createAddress(seed.toString('hex'), "0")
        // {"privateKey":"0xc30e09a462d429803c0592db0c52a9cb0bdcbf80fb6cfe3ea351c9fd67e103c1",
        // "publicKey":"0x0332950879b045701d360b60272cd98de440f269f73c5d29d23302d89cfbd3a1a5",
        // "address":"0xee2E207D30383430a815390431298EBa3c1C8c2d"}
        console.log(addressInfo)
    });
     //公钥生成地址
     test("public key to address", () => {
        const publicKey = "0x0332950879b045701d360b60272cd98de440f269f73c5d29d23302d89cfbd3a1a5";
        const address = publicKeyToAddress(publicKey)
        //0xee2E207D30383430a815390431298EBa3c1C8c2d
        console.log("public key to address===", address)
    })
    //私钥生成地址
    test("import eth wallet", () => {
        const privateKey = "c30e09a462d429803c0592db0c52a9cb0bdcbf80fb6cfe3ea351c9fd67e103c1";
        const addressInfo = importEthWallet(privateKey)
        // {"privateKey":"c30e09a462d429803c0592db0c52a9cb0bdcbf80fb6cfe3ea351c9fd67e103c1",
        // "address":"0xee2E207D30383430a815390431298EBa3c1C8c2d"}
        console.log("import eth wallet===", addressInfo)   
     });
     //验证给定的地址是否为有效的以太坊地址
     test("verify address", () => {
        const isOk = verifyAddress("0xee2E207D30383430a815390431298EBa3c1C8c2d")
        console.log("verify address===", isOk)
    })
    //签名交易
    test("sign transaction", async () => {
        const rawHex =  await signTransaction({
            "privateKey": "c30e09a462d429803c0592db0c52a9cb0bdcbf80fb6cfe3ea351c9fd67e103c1",
            "nonce": 0,
            "from": "0xee2E207D30383430a815390431298EBa3c1C8c2d",
            "to": "0x72fFaA289993bcaDa2E01612995E5c75dD81cdBC",
            "gasLimit": 91000,
            "amount": "0.01",
            "gasPrice": 195000000000,
            "decimal": 18,
            "chainId": 11155111,
            "tokenAddress": "0x00"
        })
        console.log('sign transaction111===', rawHex)
    })
   
    test("sign transaction", async () => {
        const privateKey = "c30e09a462d429803c0592db0c52a9cb0bdcbf80fb6cfe3ea351c9fd67e103c1";
        const nonce = 0;
        const from = "0xee2E207D30383430a815390431298EBa3c1C8c2d";
        const to = "0x72fFaA289993bcaDa2E01612995E5c75dD81cdBC";
        const gasLimit = 21000;
        const gasPrice = 10000000000;
        const amount = '0.01';
        const data = "";
        const chainId = 1;
        const decimal = 18;
        const maxPriorityFeePerGas = 1000000000;
        const tokenAddress = "0x00";
        const params = {
            privateKey,
            nonce,
            from,
            to,
            gasLimit,
            gasPrice,
            amount,
            data,
            chainId,
            decimal,
            maxPriorityFeePerGas,
            tokenAddress
        };
        const signedTx = await signTransaction(params);
        console.log("sign transaction===", signedTx)
    })
    //签名eip1559交易
    test("sign eip1559 transaction", async () => {
        // privateKey, nonce, from, to, gasLimit, gasPrice, amount, data, chainId, decimal, maxFeePerGas, maxPriorityFeePerGas, tokenAddress
        const rawHex =  ethSign({
            "privateKey": "c30e09a462d429803c0592db0c52a9cb0bdcbf80fb6cfe3ea351c9fd67e103c1",
            "nonce": 1,
            "from": "0xee2E207D30383430a815390431298EBa3c1C8c2d",
            "to": "0xF60Eb3263C138525b6a324aFC9b93c610F60E833",
            "amount": "1",
            "gasLimit": 91000,
            "maxFeePerGas": 45000000000,
            "maxPriorityFeePerGas": 35000000000,
            "decimal": 6,
            "chainId": 137,
            "tokenAddress": "0x84eBc138F4Ab844A3050a6059763D269dC9951c6"
        })
        console.log('sign eip1559 transaction===', rawHex)
    })
});