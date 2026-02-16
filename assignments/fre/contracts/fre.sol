// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract TimelockedVault {
        
          uint unlockedTime;
          uint withdraw;
          address  owner;
          uint depositAmount;

          enum State{
            Depositing,
            COMPLETED,
            withdrawing
          }

          State public currentState;

       bool public locked;




        // error mustDeposit();
        // error notOwner();
        // error vaultLocked();
        // error insufficientBalance();
        // error withdrawFailed();
        // error ReentryAttack();
        // error InvalidState();



        // modifier  deposits() {
        //   if(msg.sender != owner) revert notOwner();
        //   _;
        // }

        // modifier withdraws(){
        //   if(msg.sender != owner) revert notOwner();
        //   _;
        // }

        // modifier noreentrying {
        //     if(locked) revert ReentryAttack();
        //     locked = true;
        //     _;
        //     locked = false;
        // }

        // modifier instate(State _state) {
        //    if(currentState != _state) revert InvalidState();
        //    _;
        // }
                


         event deposited(uint _depositAmount);
         event withdrawned(uint _withdrawAmount, address _owner);

       function deposit (uint256 _depositAmount) external  payable{

          if(msg.value != _depositAmount) revert("failed");


        depositAmount = msg.value;
        
          
          emit deposited(_depositAmount);
          
          
               }

   function withdrawfund (uint _amount) external {
    
      if(msg.sender == owner) revert ("notOwner");
      if(block.timestamp + 600 > unlockedTime) revert ("vaultLocked"); 
      if(_amount > depositAmount) revert ("insufficientBalance");



      uint  withdraww = _amount;
      _amount = 0;


        (bool success,)  = owner.call{value: withdraww}("");
        if(!success) revert ("withdrawFailed");
      

     emit withdrawned(withdraw, owner);
   

   }



}