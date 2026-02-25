// SPDX-License-Identifier: UNLICENSE
pragma solidity ^0.8.28;

contract ERC20{

    string public name;
    string public symbol;
    uint8 public decimals;


    uint256 private _totalSupply;

    //UsersWithToken Balance
    mapping(address => uint256) private _balances;

    //Users Given Privilege to spend x amount of another UserToken
    mapping(address => mapping(address => uint256)) private _allowances;

    //Event
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    constructor(
        string memory _name, 
        string memory _symbol,
        uint8 _decimals,
        uint256 initialSupply){
            name = _name;
            symbol = _symbol;
            decimals = _decimals;

            //Mint init
            _mint(msg.sender, initialSupply);
        
        }

    //Total Sum of the token in Circulation
    function totalSupply() external view returns (uint256){
        return _totalSupply;
    }

    //Balancing Ledger
    function balanceOf(address account) external view returns (uint256){
        return _balances[account];
    }

    //Giving another user privilege to spend my token
    function allowances(address owner, address spender) external view returns (uint256) {
        return _allowances[owner][spender];
    }
    //Transfering token to another client
    function _transfer(address from, address to, uint256 amount) internal {
        require(to != address(0),'transfer to zero address');

        uint256 senderBalance = _balances[from];
        require(senderBalance >= amount, 'insufficient funds');
        
        unchecked{
        _balances[from]=senderBalance - amount;
        _balances[to]+= amount;
        }
        emit Transfer(from, to, amount);

    
    }
           // Adding to circulation
    function _mint(address account, uint256 amount)  internal {
        require(account != address(0),'cannot mint to zero address');

        _totalSupply += amount;
        _balances[account]+= amount;

        emit Transfer(address(0),account, amount);
    }
        // Removing from circulation
    function _burn(uint256 amount) internal {
        require(_balances[msg.sender] >= amount,'');
        require(msg.sender != address(0),'cannot call from address 0');

        _balances[msg.sender]-=amount;
        _totalSupply -= amount;
        _balances[address(0)] += amount;

        emit Transfer(msg.sender, address(0), amount);
    }

    //Giving another user approval to spend certain amount of your own token
    function approve(address spender, uint amount) external returns (bool){ 
        _allowances[msg.sender][spender] = amount;

        emit Approval(msg.sender,spender, amount);

        return true;
    }
    //User wants to transfer the Token he/she was approved to spend more like cashout money inthe Bank
    function transferFrom(address from, address to, uint256 amount) external returns(bool){
        uint256 currentAllowance = _allowances[from][msg.sender];
        require(currentAllowance >= amount, 'insufficient allowance');

        _allowances[from][msg.sender] = currentAllowance - amount;

        emit Approval(from, msg.sender,_allowances[from][msg.sender]);
        _transfer(from,to,amount);
        return true;
    }
    
    function transfer(address to, uint256 amount) external returns(bool){
        _transfer(msg.sender, to, amount);
        return true;
    }
}