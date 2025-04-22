### 合约项目初始化
```shell
forge init 项目名称
```

### 编译项目
```shell
forge build
```
### 运行测试
```shell
forge test
```
### 安装不可升级合约库
'''shell
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


### 安装可升级合约库
```shell
forge install OpenZeppelin/openzeppelin-contracts-upgradeable --no-commit
```
## 生成remappings.txt
'''shell
forge remappings > remappings.txt
```

### 启动本地测试网节点
```shell
anvil
```
### 部署合约
```shell
forge script script/xxx.s.sol:xxxScript --rpc-url <your_rpc_url> --private-key <your_private_key>
```
## 验证合约：步骤分为生成验证数据和执行验证命令
## 设置 EtherScan API Key
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