// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./interface/ITreasureManager.sol";

contract TreasureManager is Initializable, OwnableUpgradeable, AccessControlUpgradeable, ReentrancyGuardUpgradeable, ITreasureManager {
    using SafeERC20 for IERC20;

    // 定义以太币地址常量
    address public constant ethAddress = address(0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE);

    // 定义宝藏管理器地址
    address public treasureManager;
    // 定义提币管理器地址
    address public withdrawManager;

    // 定义代币白名单数组
    address[] public tokenWhiteList;

    // 定义每个代币的余额映射
    mapping(address => uint256) public tokenBalances;
    // 定义每个用户的每个代币奖励金额映射
    mapping(address => mapping(address => uint256)) public userRewardAmounts;

    // 自定义错误，用于地址为零的情况
    error IsZeroAddress();

    // 存储以太币事件
    event DepositToken(
        address indexed tokenAddress,
        address indexed sender,
        uint256 amount
    );

    // 提币事件
    event WithdrawToken(
        address indexed tokenAddress,
        address sender,
        address withdrawAddress,
        uint256 amount
    );

    // 授予奖励事件
    event GrantRewardTokenAmount(
        address indexed tokenAddress,
        address granter,
        uint256 amount
    );

    // 提币管理器更新事件
    event WithdrawManagerUpdate(
        address indexed withdrawManager
    );

    // 仅允许宝藏管理器调用修饰符
    modifier onlyTreasureManager() {
        require(msg.sender == address(treasureManager), "TreasureManager.onlyTreasureManager");
        _;
    }

    // 仅允许提币管理器调用修饰符
    modifier onlyWithdrawManager() {
        require(msg.sender == address(withdrawManager), "TreasureManager.onlyWithdrawer");
        _;
    }

    // 初始化函数，设置初始所有者，宝藏管理器和提币管理器
    function initialize(address _initialOwner, address _treasureManager, address _withdrawManager) public initializer {
        treasureManager = _treasureManager;
        withdrawManager = _withdrawManager;
        _transferOwnership(_initialOwner);
    }

    // 接收以太币并调用存款函数
    receive() external payable {
        depositETH();
    }

    // 存入以太币函数
    function depositETH() public payable nonReentrant returns (bool) {
        tokenBalances[ethAddress] += msg.value;
        emit DepositToken(
            ethAddress,
            msg.sender,
            msg.value
        );
        return true;
    }

    // 存入 ERC20 代币函数
    function depositERC20(IERC20 tokenAddress, uint256 amount) external returns (bool) {
        tokenBalances[address(tokenAddress)] += amount;
        tokenAddress.safeTransferFrom(msg.sender, address(this), amount);
        emit DepositToken(
            address(tokenAddress),
            msg.sender,
            amount
        );
        return true;
    }

    // 授予用户奖励函数
    function grantRewards(address tokenAddress, address granter, uint256 amount) external onlyTreasureManager {
        require(address(tokenAddress) != address(0) && granter != address(0), "Invalid address");
        userRewardAmounts[granter][address(tokenAddress)] += amount;
        emit GrantRewardTokenAmount(address(tokenAddress), granter, amount);
    }

    // 用户领取所有代币奖励函数
    function claimAllTokens() external {
        for (uint256 i = 0; i < tokenWhiteList.length; i++) {
            address tokenAddress = tokenWhiteList[i];
            uint256 rewardAmount = userRewardAmounts[msg.sender][tokenAddress];
            if (rewardAmount > 0) {
                userRewardAmounts[msg.sender][tokenAddress] = 0;
                tokenBalances[tokenAddress] -= rewardAmount;
                if (tokenAddress == ethAddress) {
                    (bool success, ) = msg.sender.call{value: rewardAmount}("");
                    require(success, "ETH transfer failed");
                } else {
                    IERC20(tokenAddress).safeTransfer(msg.sender, rewardAmount);
                }
            }
        }
    }

    // 用户领取特定代币奖励函数
    function claimToken(address tokenAddress) external {
        require(tokenAddress != address(0), "Invalid token address");
        uint256 rewardAmount = userRewardAmounts[msg.sender][tokenAddress];
        require(rewardAmount > 0, "No reward available");
        userRewardAmounts[msg.sender][tokenAddress] = 0;
        tokenBalances[tokenAddress] -= rewardAmount;
        if (tokenAddress == ethAddress) {
            (bool success, ) = msg.sender.call{value: rewardAmount}("");
            require(success, "ETH transfer failed");
        } else {
            IERC20(tokenAddress).safeTransfer(msg.sender, rewardAmount);
        }
    }

    // 提取以太币函数，仅限提币管理器调用
    function withdrawETH(address payable withdrawAddress, uint256 amount) external payable onlyWithdrawManager returns (bool) {
        require(address(this).balance >= amount, "Insufficient ETH balance in contract");
        (bool success, ) = withdrawAddress.call{value: amount}("");
        if (!success) {
            return false;
        }
        tokenBalances[ethAddress] -= amount;
        emit WithdrawToken(
            ethAddress,
            msg.sender,
            withdrawAddress,
            amount
        );
        return true;
    }

    // 提取 ERC20 代币函数，仅限提币管理器调用
    function withdrawERC20(IERC20 tokenAddress, address withdrawAddress, uint256 amount) external onlyWithdrawManager returns (bool) {
        require(tokenBalances[address(tokenAddress)] >= amount, "Insufficient token balance in contract");
        tokenAddress.safeTransfer(withdrawAddress, amount);
        tokenBalances[address(tokenAddress)] -= amount;
        emit WithdrawToken(
            address(tokenAddress),
            msg.sender,
            withdrawAddress,
            amount
        );
        return true;
    }

    // 设置代币白名单函数
    function setTokenWhiteList(address tokenAddress) external onlyTreasureManager {
        if(tokenAddress == address(0)) {
            revert IsZeroAddress();
        }
        tokenWhiteList.push(tokenAddress);
    }

    // 获取代币白名单函数
    function getTokenWhiteList() external view returns (address[] memory) {
        return tokenWhiteList;
    }

    // 设置提币管理器函数
    function setWithdrawManager(address _withdrawManager) external onlyOwner {
        withdrawManager = _withdrawManager;
        emit WithdrawManagerUpdate(
            withdrawManager
        );
    }

    // 查询用户特定代币奖励函数
    function queryRewards(address _tokenAddress) public view returns (uint256) {
        return userRewardAmounts[msg.sender][_tokenAddress];
    }
    
    // V2 版本加的代码，返回固定值函数
    function getValue() external pure returns(uint256) {
        return 10000;
    }
}