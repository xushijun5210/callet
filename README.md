### 项目目录
```shell
uups
proxy_contrac
passphrase
eth-wallet-sdk
```
### npx jest 运行测试
```shell
npx jest
```
### 安装forge
```shell
npm install -g @arcblock/forge-cli
```
### 安装依赖
```shell
npm install
```
### 编译合约
```shell
npx hardhat compile
```
### 运行测试
```shell
npx hardhat test
```
### 部署合约
```shell

### 合约项目初始化
```shell
forge init 项目名称
```
### 编译项目
```shell
forge build
```
### 清除缓存
```shell
forge clean
```
### 运行测试
```shell
forge test
```
### 安装可不升级合约库
```shell
forge install OpenZeppelin/openzeppelin-contracts --no-commit
```
### 安装可升级合约库
```shell
forge install OpenZeppelin/openzeppelin-contracts-upgradeable --no-commit
```
## 生成remappings.txt
```shell
forge remappings > remappings.txt
```
### 启动本地测试网节点
```shell
anvil
```
### 声明PRIVATE_KEY
```shell
export PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```
### 部署合约
```shell
forge script script/xxx.s.sol:xxxScript --rpc-url <your_rpc_url> --private-key <your_private_key>
forge script ./script/TreasureManagerScript.s.sol:TreasureManagerScript --rpc-url 127.0.0.1:8545  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --broadcast
```
### 根据部署的合约地址找到nvil公钥地址代理合约地址
```shell
cast call --rpc-url 127.0.0.1:8545 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512 "treasureManager()(address)"
```
### 查询地址余额 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE
```shell
cast call --rpc-url 127.0.0.1:8545 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512 "tokenBalances(address)(uint256)" 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE
```
### 往里面转账 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE
```shell
cast send --rpc-url 127.0.0.1:8545 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512 --value 1000000000000000000000 
```
### 判断一个地址是否是合约地址
```shell
cast code --rpc-url 127.0.0.1:8545 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
```
### owner
```shell
cast call --rpc-url 127.0.0.1:8545 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512 "owner()(address)"
```
### 升级合约
```shell
forge script ./script/TreasureManagerV2Script.s.sol:TreasureManagerV2Script --rpc-url 127.0.0.1:8545  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --broadcast --overwrite
```
### 调用升级后的合约
```shell
cast call --rpc-url 127.0.0.1:8545 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512 "getValue()(uint256)" 
```
###  验证合约：步骤分为生成验证数据和执行验证命令
###  设置 EtherScan API Key
```shell
export ETHERSCAN_API_KEY=G2KQYXZEAV4H3GB1A1T6N832412D4648KH
```
## 执行验证命令
```shell
forge verify-contract --chain-id 11155111 0x599a22f498e5e0000440860ee4ff1dd8a5f06b66 src/contracts/OneDollarTreasure.sol:OneDollarTreasure
```
## 与区块链交互：使用Cast与区块链交互
```shell
cast send --from <address> <contract-address> <method> <args>
```
