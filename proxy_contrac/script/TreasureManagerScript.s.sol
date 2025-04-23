// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {TreasureManager} from "../src/TreasureManager.sol";
import "forge-std/Vm.sol";
import {Script, console } from "forge-std/Script.sol";
import "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";
import "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";
import "../src/TreasureManager.sol";
import "../src/EmptyContract.sol";

contract TreasureManagerScript is Script {
    //此合约定义了部署和升级TreasureManager智能合约的脚本。
    EmptyContract public emptyContract; // 定义一个 EmptyContract 类型的公共变量 emptyContract
    TreasureManager public treasureManager; // 定义一个 TreasureManager 类型的公共变量 treasureManager
    TreasureManager public treasureManagerImplementation; // 定义一个 TreasureManager 类型的公共变量 treasureManagerImplementation
    ProxyAdmin public treasureManagerProxyAdmin; // 定义一个 ProxyAdmin 类型的公共变量 treasureManagerProxyAdmin
        function run() public {
            // 获取部署者的私钥
            uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
            // 根据私钥生成部署者的地址
            address deployerAddress = vm.addr(deployerPrivateKey);
        
            // 开始广播交易，使用部署者的私钥
            vm.startBroadcast(deployerPrivateKey);
        
            // 部署空合约
            emptyContract = new EmptyContract();
            
            // 部署透明代理合约，设置初始逻辑合约地址和管理员地址 proxyTreasureManager指向空合约的地址
            TransparentUpgradeableProxy proxyTreasureManager = new TransparentUpgradeableProxy(address(emptyContract), deployerAddress, "");
        
            // 将代理合约地址转换为 TreasureManager 类型
            treasureManager = TreasureManager(payable(address(proxyTreasureManager)));
        
            // 部署 TreasureManager 的实现合约
            treasureManagerImplementation = new TreasureManager();
            // 获取代理合约的管理员
            treasureManagerProxyAdmin = ProxyAdmin(getProxyAdminAddress(address(proxyTreasureManager)));
        
            // 升级代理合约的逻辑合约并调用初始化方法
            treasureManagerProxyAdmin.upgradeAndCall(
                ITransparentUpgradeableProxy(address(treasureManager)),
                address(treasureManagerImplementation),
                abi.encodeWithSelector(
                    TreasureManager.initialize.selector,
                    msg.sender,
                    msg.sender,
                    msg.sender
                )
            );
        
            // 输出 TreasureManager 代理合约地址
            console.log("Agency contract address=====", address(treasureManager));
            // 输出 TreasureManager 代理合约的管理员地址
            console.log("The administrator address of the proxy contract(treasureManagerProxyAdmin) =====", address(treasureManagerProxyAdmin));
        
            // 停止广播交易
            vm.stopBroadcast();
        }
    
    function getProxyAdminAddress(address proxy) internal view returns (address) {
        // 获取用于访问VM作弊代码的地址
        address CHEATCODE_ADDRESS = 0x7109709ECfa91a80626fF3989D68f67F5b1DD12D;
        // 创建VM对象实例
        Vm vm = Vm(CHEATCODE_ADDRESS);
        // 加载指定代理合约的管理槽地址
        bytes32 adminSlot = vm.load(proxy, ERC1967Utils.ADMIN_SLOT);
        // 将管理槽地址转换为uint160的地址格式并返回
        return address(uint160(uint256(adminSlot)));
    }
}