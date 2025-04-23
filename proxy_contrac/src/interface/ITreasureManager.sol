// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface ITreasureManager {
    // 存入以太币到合约
    function depositETH() external payable returns (bool);

    // 存入 ERC20 代币到合约
    function depositERC20(IERC20 tokenAddress, uint256 amount) external returns (bool);

    // 给tokenAddress地址授权可以给receiptAddress地址发放amount数量的代币奖励
    function grantRewards(address tokenAddress, address receiptAddress, uint256 amount) external;

    // 任何人都可以存人所有可用代币
    function claimAllTokens() external;

    // 任何人都可以存人代币
    function claimToken(address tokenAddress) external;

    // 从合约中提取以太币
    function withdrawETH(address payable withdrawAddress, uint256 amount) external payable returns (bool);

    // 从合约中提取 ERC20 代币
    function withdrawERC20(IERC20 tokenAddress, address withdrawAddress, uint256 amount) external returns (bool);

    // 设置代币白名单
    function setTokenWhiteList(address tokenAddress) external;

    // 设置提取管理器地址
    function setWithdrawManager(address _withdrawManager) external;

    // 查询指定代币的奖励数量
    function queryRewards(address tokenAddress) external view returns(uint256);

    // 获取代币白名单列表
    function getTokenWhiteList() external view returns(address[] memory);

    // 返回一个固定值（具体值未定义）
    function getValue() external pure returns(uint256);
}