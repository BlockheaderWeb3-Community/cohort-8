// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract STKToken {
    string public name = "Staker";
    string public symbol = "STK";
    uint8 public decimals = 18;
    uint256 private _totalSupply;
    
    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    
    constructor(uint256 initialSupply) {
        _mint(msg.sender, initialSupply);
    }
    
    function totalSupply() external view returns (uint256) {
        return _totalSupply;
    }
    
    function balanceOf(address account) external view returns (uint256) {
        return _balances[account];
    }
    
    function allowance(address owner, address spender) external view returns (uint256) {
        return _allowances[owner][spender];
    }
    
    function approve(address spender, uint256 amount) external returns (bool) {
        _allowances[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }
    
    function transfer(address to, uint256 amount) external returns (bool) {
        _transfer(msg.sender, to, amount);
        return true;
    }
    
    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        uint256 currentAllowance = _allowances[from][msg.sender];
        require(currentAllowance >= amount, "Insufficient allowance");
        _allowances[from][msg.sender] = currentAllowance - amount;
        emit Approval(from, msg.sender, _allowances[from][msg.sender]);
        _transfer(from, to, amount);
        return true;
    }
    
    function _transfer(address from, address to, uint256 amount) internal {
        require(to != address(0), "Transfer to zero address");
        uint256 senderBalance = _balances[from];
        require(senderBalance >= amount, "Insufficient balance");
        unchecked {
            _balances[from] = senderBalance - amount;
            _balances[to] += amount;
        }
        emit Transfer(from, to, amount);
    }
    
    function _mint(address account, uint256 amount) internal {
        require(account != address(0), "Mint to zero address");
        _totalSupply += amount;
        _balances[account] += amount;
        emit Transfer(address(0), account, amount);
    }
    
    function mint(uint256 amount) external returns (bool) {
        _mint(msg.sender, amount);
        return true;
    }
}