// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;


contract crownfunding{


  enum State {
        AWAITING_PAYMENT,
        AWAITING_DELIVERY,
        COMPLETE,
        DISPUTED
    }
    

   uint amountcontributed;
   address contributors;
   address owner;
   bool locked;


   State public currentstate;



    event deposited(uint _amountcontributed, address _contributors);
    event withdrawned(uint _amountwithdrawn, address _owner);
    event sendback(uint _amountcontributed, address _contributors);


     error mustDeposit();
     error notContributor();
     error insufficientBalance();
     error withdrawFailed();
     error sendbackFailed();
     error notOwner();
     error ReentryAttack();
     error InvalidState();
     error InvalidAdress();
     error buyerAndSellerCannotBeSame();

      modifier depositedFund {
        if(contributors != msg.sender) revert notContributor();
        _;
      }

      modifier withdrawFund {
         if(msg.sender != owner) revert notOwner();
         _;
      }
      modifier noreentry {
        if(locked) revert ReentryAttack();
        locked = true;
        _;
        locked =  false;
      }
   
     modifier instate(State state){
        if(currentstate != state) revert InvalidState();
        _;
     }

     constructor(address _contributors, address _owner) {
         if(contributors != address(0) && owner != address(0)) revert InvalidAdress();
         if(contributors != owner) revert buyerAndSellerCannotBeSame();

         contributors = _contributors;
         owner = _owner;
         currentstate = State.AWAITING_PAYMENT;

     }




  
     function deposit(uint _amountcontributed, address _contributors) external depositedFund instate(State.AWAITING_PAYMENT) payable {
      

           if(msg.value != _amountcontributed) revert mustDeposit();
           if(msg.sender != contributors) revert notContributor();

        
             amountcontributed = msg.value;
                contributors = _contributors;

          emit deposited(amountcontributed, contributors);

     }

    function withdrawneder(uint _amountwithdrawn) external withdrawFund noreentry instate(State.AWAITING_DELIVERY) {

        if(msg.sender != owner) revert notOwner();
     if(_amountwithdrawn >= amountcontributed) revert insufficientBalance();

            uint payout = amountcontributed;
            amountcontributed = 0;

     (bool success,) = owner.call{value:payout}("");
     if (!success) revert withdrawFailed();
     emit withdrawned(_amountwithdrawn, owner);
     
    }

    function sendbackfund(uint _amountcontributed) external instate(State.DISPUTED) noreentry{
      
  
    if(msg.sender != contributors) revert notContributor();
    if(amountcontributed != _amountcontributed) revert insufficientBalance();

       uint amountcontributedSave = amountcontributed;
       amountcontributed = 0;


      (bool success,) = contributors.call{value: _amountcontributed}("");
      if (!success) revert sendbackFailed();
      
        emit sendback(amountcontributedSave, contributors);


    }


}