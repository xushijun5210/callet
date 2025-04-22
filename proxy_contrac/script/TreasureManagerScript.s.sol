// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {TreasureManager} from "../src/TreasureManager.sol";

import "forge-std/Vm.sol";
import {Script, console } from "forge-std/Script.sol";
import "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";
import "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";

import "../src/TreasureManager.sol";
import "../test/EmptyContract.sol";

contract TreasureManagerScript is Script {
    //此合约定义了部署和升级TreasureManager智能合约的脚本。
    TreasureManagerScript.s.sol
    
    EmptyContract public emptyContract;
    TreasureManager public treasureManager;
    TreasureManager public treasureManagerImplementation;
    ProxyAdmin public treasureManagerProxyAdmin;
    
    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployerAddress = vm.addr(deployerPrivateKey);
    
        vm.startBroadcast(deployerPrivateKey);
    
        emptyContract = new EmptyContract();
        TransparentUpgradeableProxy proxyTreasureManager = new TransparentUpgradeableProxy(address(emptyContract), deployerAddress, "");
    
        treasureManager = TreasureManager(payable(address(proxyTreasureManager)));
    
        treasureManagerImplementation = new TreasureManager();
        treasureManagerProxyAdmin = ProxyAdmin(getProxyAdminAddress(address(proxyTreasureManager)));
    
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
    
        console.log("address=====", address(treasureManager));
        console.log("treasureManagerProxyAdmin=====", address(treasureManagerProxyAdmin));
    
        vm.stopBroadcast();
    }
    
    function getProxyAdminAddress(address proxy) internal view returns (address) {
        address CHEATCODE_ADDRESS = 0x7109709ECfa91a80626fF3989D68f67F5b1DD12D;
        Vm vm = Vm(CHEATCODE_ADDRESS);
        bytes32 adminSlot = vm.load(proxy, ERC1967Utils.ADMIN_SLOT);
        return address(uint160(uint256(adminSlot)));
    }
}