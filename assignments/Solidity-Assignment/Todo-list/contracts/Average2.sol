// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;


contract Calculator {
    uint public a;
    uint public b;
    uint public c;

    constructor(uint _a, uint _b){
        a = _a;
        b = _b;
    }


    function sub() public  returns(uint){
        c = a - b;

        return c;
    }

      function add() public returns(uint){
         c = a + b;

        return c;
    }

     function div() public returns(uint){
        c = a / b;

        return c;
    }

     function mul() public returns(uint){
         c = a * b;

        return c;
    }

    function set(uint _a, uint _b) public{
        a = _a;
        b = _b; 
    }

    
}

interface ICalculation {
    function add() external returns(uint);
    function sub() external returns(uint);
    function mul() external returns(uint);
    function div() external returns(uint);
    
}

contract InteractWithCalculatorContract{

    ICalculation calculationContract;

    constructor(address _calculationContractAddress){
        calculationContract = ICalculation(_calculationContractAddress);
    }

    function addInCalculationContract() public {
        calculationContract.add();
    }

}



contract AverageInheritance is Calculator(20, 4){

    function average() public returns(uint){
        uint d = div();
         c = d / 2;

        return c;
    }

    
}
// contract SubFactory{
//     Sub sub;

//     function createNewSub() public returns(address){
//         Sub _sub = new Sub();

//         return address(_sub);
//     }
// }