// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

contract Poq {

    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;

    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;
    address public owner;  

    constructor(string memory _name, string memory _symbol, uint8 _decimals, uint256 _totalSupply) {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        totalSupply = _totalSupply;
        owner = msg.sender;
        _balances[owner] = totalSupply;
    }

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);
    event Mint(address indexed _to, uint256 _value);
    event Burn(address indexed _from, uint256 _value);


    function balanceOf(address _account) public view returns (uint256 _balance) {
        return _balances[_account];
    }

    function allowance(address _owner, address _spender) public view returns (uint256 _value) {
        return _allowances[_owner][_spender];
    }


    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(_value <= _balances[msg.sender], "Insufficient Balance");

        _balances[msg.sender] -= _value;
        _balances[_to] += _value;

        emit Transfer(msg.sender, _to, _value);

        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        require(_to != address(0), "Send to zero-address");
        require(_value <= _balances[_from], "Insufficient Balance");
        require(_value <= _allowances[_from][_to], "No Allowance");

        _balances[_from] -= _value;
        _balances[_to] += _value;

        // _allowances[_from][_to] -= _value;

        emit Transfer(_from, _to, _value);

        return true;
    }

    function approve(address _account, uint256 _value) public returns (bool _success) {
        _allowances[msg.sender][_account] = _value;

        emit Approval(msg.sender, _account, _value);

        return true;
    }

    function mint(address _account, uint256 _value) public returns (bool success) {
        require(msg.sender == owner, "Mint must call contract's owner");

        totalSupply += _value;
        _balances[_account] += _value;

        // emit Transfer(address(0), _account, _value);
        emit Mint(_account, _value);

        return true;
    }


    function burn(address _account, uint256 _value) public returns (bool success) {
        require(msg.sender == owner, "Burn must call contract's owner");

        totalSupply -= _value;
        _balances[_account] -= _value;

        // emit Transfer(_account, address(0), _value);
        emit Burn(_account, _value);

        return true;
    }
    
}