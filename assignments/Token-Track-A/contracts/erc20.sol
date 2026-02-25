// SPDX-License-Identifier: UNLICENSE
pragma solidity ^0.8.28;

contract ERC20 {
    string public name;
    string public symbol;
    uint8 public decimals;

    uint256 private _totalSupply;

    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    constructor(string memory _name, string memory _symbol, uint8 _decimals, uint256 initialSupply) {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
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

    function _transfer(address from, address to, uint256 amount) internal {
        // Sender is `from`, receiver is `to` (caller can be sender or an approved spender).
        require(from != address(0), "ERC20: transfer from the zero address");
        require(to != address(0), "ERC20: transfer to the zero address");

        uint256 senderBalance = _balances[from];
        require(senderBalance >= amount, "ERC20: transfer amount exceeds balance");

        unchecked {
            _balances[from] -= amount;
            _balances[to] += amount;
        }
        emit Transfer(from, to, amount);
    }

    function _mint(address account, uint256 amount) internal {
        // Receiver is `account` (called by the contract, e.g., constructor).
        require(account != address(0), "ERC20: mint to the zero address");

        _totalSupply += amount;
        _balances[account] += amount;

        emit Transfer(address(0), account, amount);
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        // Sender (msg.sender) is the token owner; receiver is the `spender` being approved.
        require(msg.sender != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");

        _allowances[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function _burn(uint256 amount) internal  {
        // Sender (msg.sender) burns their own tokens; no receiver (sent to address(0)).
        require(msg.sender != address(0), "ERC20: cannot burn from address(0)");

        // uint256 _balances = _balances[msg.sender];
        require(_balances[msg.sender] >= amount, "ERC20: burn amount exceeds balance");

        unchecked {
            _balances[msg.sender] -= amount;
            _totalSupply -= amount;
            _balances[address(0)] += amount;
        }
        emit Transfer(msg.sender, address(0), amount);
    }

    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        // Sender (msg.sender) is the spender; `from` is the token owner; `to` is the receiver.
        require(from != address(0), "ERC20: transfer from the zero address");
        require(to != address(0), "ERC20: transfer to the zero address");

        uint256 currentAllowance = _allowances[from][msg.sender];
        require(currentAllowance >= amount, "ERC20: transfer amount exceeds allowance");

        unchecked {
            _allowances[from][msg.sender] = currentAllowance - amount;
        }
        emit Approval(from, msg.sender, _allowances[from][msg.sender]);
        _transfer(from, to, amount);
        return true;
    }

    function transfer(address to, uint256 amount) external returns (bool) {
    _transfer(msg.sender, to, amount);
    return true;
    }

    function mint (uint256 amount) external returns (bool) {
        _mint(msg.sender, amount);
        return true;
    }
}    