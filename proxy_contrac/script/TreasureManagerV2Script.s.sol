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

contract TreasureManagerV2Script is Script {
    // 定义TreasureManager合约的实例
    TreasureManager public treasureManagerV2;
    // 定义TreasureManager合约实现的实例
    TreasureManager public treasureManagerV2Implementation;
    // 定义ProxyAdmin合约的实例
    ProxyAdmin public treasureManagerV2ProxyAdmin;

    // 部署和升级TreasureManager合约的方法
    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);

        // 部署新的TreasureManager实现合约
        treasureManagerV2Implementation = new TreasureManager();

        // 获取TreasureManager代理合约的地址
        treasureManagerV2 = TreasureManager(payable(0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512));
        // 获取ProxyAdmin合约的地址
        treasureManagerV2ProxyAdmin = ProxyAdmin(getProxyAdminAddress(0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266));

        // 使用ProxyAdmin升级TreasureManager代理合约到新实现，并调用初始化函数
        treasureManagerV2ProxyAdmin.upgradeAndCall(
            ITransparentUpgradeableProxy(address(treasureManagerV2)),
            address(treasureManagerV2Implementation),
            hex""
        );

        vm.stopBroadcast();
    }

    // 获取指定代理合约的ProxyAdmin地址的方法
    function getProxyAdminAddress(address proxy) internal view returns (address) {
        address CHEATCODE_ADDRESS = 0x7109709ECfa91a80626fF3989D68f67F5b1DD12D;
        Vm vm = Vm(CHEATCODE_ADDRESS);
        bytes32 adminSlot = vm.load(proxy, ERC1967Utils.ADMIN_SLOT);
        return address(uint160(uint256(adminSlot)));
    }
}