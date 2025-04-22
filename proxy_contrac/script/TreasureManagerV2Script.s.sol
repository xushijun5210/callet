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
    TreasureManager public treasureManagerV2;
    TreasureManager public treasureManagerV2Implementation;
    ProxyAdmin public treasureManagerV2ProxyAdmin;

    // 部署 TreasureManagerV2 的实现合约并升级现有代理合约
    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);

        treasureManagerV2Implementation = new TreasureManager();

        treasureManagerV2 = TreasureManager(payable(0x5FC8d32690cc91D4c39d9d3abcBD16989F875707));
        treasureManagerV2ProxyAdmin = ProxyAdmin(getProxyAdminAddress(0x5FC8d32690cc91D4c39d9d3abcBD16989F875707));

        treasureManagerV2ProxyAdmin.upgradeAndCall(
            ITransparentUpgradeableProxy(address(treasureManagerV2)),
            address(treasureManagerV2Implementation),
            hex""
        );

        vm.stopBroadcast();
    }

    // 获取指定代理合约的 ProxyAdmin 地址
    function getProxyAdminAddress(address proxy) internal view returns (address) {
        address CHEATCODE_ADDRESS = 0x7109709ECfa91a80626fF3989D68f67F5b1DD12D;
        Vm vm = Vm(CHEATCODE_ADDRESS);
        bytes32 adminSlot = vm.load(proxy, ERC1967Utils.ADMIN_SLOT);
        return address(uint160(uint256(adminSlot)));
    }
}