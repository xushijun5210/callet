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
        const mnemonic = "strike expose clean input matter exchange critic flip ask twenty path glove";
        const seed = mnemonicToSeed( { mnemonic: mnemonic, password: 'xushijun5210' });
        console.log("create seed===", seed.toString('hex'))
    });
    //助记词生成公钥,私钥和地址
    test("create address", () => {
        const mnemonic = "strike expose clean input matter exchange critic flip ask twenty path glove";
        const seed = mnemonicToSeed( { mnemonic: mnemonic, password: '' });
        const addressInfo = createAddress(seed.toString('hex'), "0")
        //{"privateKey":"0xdd896beb517d6ef3ba27d68f5117b2cbc0ebb0bad4ed2e481f786d6999bfea6b",
        // "publicKey":"0x038de742233a575d9b60842f0c4dcebd652039ce7cf5682fa6951f40e63c7c6295",
        // "address":"0x33C901956Aa770CEEFdCBb605883f47c5A48d83c"}
        console.log(addressInfo)
    });
     //公钥生成地址
     test("public key to address", () => {
        const publicKey = "0x038de742233a575d9b60842f0c4dcebd652039ce7cf5682fa6951f40e63c7c6295";
        const address = publicKeyToAddress(publicKey)
        //0x33C901956Aa770CEEFdCBb605883f47c5A48d83c
        console.log("public key to address===", address)
    })
    //私钥生成地址
    test("import eth wallet", () => {
        const privateKey = "dd896beb517d6ef3ba27d68f5117b2cbc0ebb0bad4ed2e481f786d6999bfea6b";
        const addressInfo = importEthWallet(privateKey)
        //{"privateKey":"dd896beb517d6ef3ba27d68f5117b2cbc0ebb0bad4ed2e481f786d6999bfea6b",
        // "address":"0x33C901956Aa770CEEFdCBb605883f47c5A48d83c"}
        console.log("import eth wallet===", addressInfo)   
     });
     //验证给定的地址是否为有效的以太坊地址
     test("verify address", () => {
        const isOk = verifyAddress("0x33C901956Aa770CEEFdCBb605883f47c5A48d83c")
        console.log("verify address===", isOk)
    })
    //签名交易
    test("sign transaction", async () => {
        const rawHex =  await signTransaction({
            "privateKey":"dd896beb517d6ef3ba27d68f5117b2cbc0ebb0bad4ed2e481f786d6999bfea6b",
            "nonce": 0,
            "from": "0x33C901956Aa770CEEFdCBb605883f47c5A48d83c",
            "to": "0x79a72cd9C1A3dc76BcA8e685fAB7c58eA51CB24a",
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
        const rawHex =  await signTransaction({
            "privateKey": "dd896beb517d6ef3ba27d68f5117b2cbc0ebb0bad4ed2e481f786d6999bfea6b",
            "nonce": 1,
            "from": "0x33C901956Aa770CEEFdCBb605883f47c5A48d83c",
            "to": "0x79a72cd9C1A3dc76BcA8e685fAB7c58eA51CB24a",
            "gasLimit": 91000,
            "amount": "0.01",
            "gasPrice": 195000000000,
            "decimal": 18,
            "chainId": 11155111,
            "tokenAddress": "0x00"
        })
        console.log("sign transaction===", rawHex)
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
            "decimal": 18,
            "chainId": 11155111,
            "tokenAddress": "0x00"
        })
        console.log('sign eip1559 transaction===', rawHex)
    })
});