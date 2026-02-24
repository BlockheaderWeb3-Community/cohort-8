
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract CrowdFunding{
  
    address private immutable owner;

    
    uint private nextId;
    bool private locked;

    modifier nonReentrant() {
        require(!locked, "Reentrant call");
        locked = true;
        _;
        locked = false;
    }

    struct Campaign {
    uint id;
    string title;
    address creator;
    uint goal;
    uint deadline;
    uint amountRaised;
    STATUS status;
    uint startsAt;
    uint endsAt;
    uint totalContributions;
    bool claimed;
    mapping(address => uint) contributions;
    //uint[] contributionAmounts;
    }

    enum STATUS {
        ACTIVE,
        DELETED,
        SUCCESSFUL,
        UNSUCCEEDED
    }

    mapping(uint => Campaign) public campaigns;
    uint public campaignCount;

    event CampaignCreated(uint indexed campaignId, address campaignCreator, string title, STATUS status);
    event CampaignDeleted(uint indexed campaignId, address campaignCreator, STATUS status);
    event ContributionMade(uint indexed campaignId, address contributor, uint amount);
    event RefundMade(uint indexed campaignId, address contributor, uint amount);

    function createCampaign(
        string memory _title,
        uint _goal,
        uint _duration)public {
        require(bytes(_title).length > 0, "Title must not be empty");
        require(_goal > 0, "Goal must be greater than zero");
        require(_duration > 0, "Ends time must be greater than zero");

        campaignCount++;
        nextId++;
        Campaign storage campaign = campaigns[campaignCount];
        campaign.id = nextId;
        campaign.creator = msg.sender;
        campaign.title =_title;
        campaign.goal = _goal;
        campaign.startsAt = block.timestamp;
        campaign.status = STATUS.ACTIVE;
        campaign.endsAt = block.timestamp + _duration;

        emit CampaignCreated(nextId , msg.sender, _title, STATUS.ACTIVE);
    }


    function contribute(uint _id) 
    public 
    payable 
    nonReentrant 
{
    Campaign storage campaign = campaigns[_id];

    require(msg.value > 0, "Must send ETH");
    require(block.timestamp < campaign.endsAt, "Campaign ended");
    require(campaign.status == STATUS.ACTIVE, "Not active");

    uint remaining = campaign.goal - campaign.totalContributions;

    uint acceptedAmount = msg.value;

    if (msg.value > remaining) {
        acceptedAmount = remaining;

        uint excess = msg.value - remaining;

        (bool success, ) = payable(msg.sender).call{value: excess}("");
        require(success, "Refund failed");
    }

    campaign.totalContributions += acceptedAmount;
    campaign.contributions[msg.sender] += acceptedAmount;

    if (campaign.totalContributions >= campaign.goal) {
        campaign.status = STATUS.SUCCESSFUL;
    }

    emit ContributionMade(_id, msg.sender, acceptedAmount);
}

    function requestRefund(uint _id) 
    public 
    nonReentrant 
{
    Campaign storage campaign = campaigns[_id];


    if (
        block.timestamp >= campaign.endsAt &&
        campaign.totalContributions < campaign.goal
    ) {
        campaign.status = STATUS.UNSUCCEEDED;
    }

    require(campaign.status == STATUS.UNSUCCEEDED, "Refund not allowed");

    uint contributedAmount = campaign.contributions[msg.sender];
    require(contributedAmount > 0, "No contribution found");

    
    campaign.contributions[msg.sender] = 0;
    campaign.totalContributions -= contributedAmount;

    (bool success, ) = payable(msg.sender).call{value: contributedAmount}("");
    require(success, "Refund failed");

    emit RefundMade(_id, msg.sender, contributedAmount);
}

   function withdraw(uint _id) 
    public 
    nonReentrant 
{
    Campaign storage campaign = campaigns[_id];

    
    require(msg.sender == campaign.creator, "Not campaign creator");


    require(campaign.status == STATUS.SUCCESSFUL, "Campaign not successful");


    require(!campaign.claimed, "Funds already withdrawn");

    uint amount = campaign.totalContributions;
    require(amount > 0, "No funds to withdraw");

    campaign.claimed = true;

    (bool success, ) = payable(msg.sender).call{value: amount}("");
    require(success, "Withdrawal failed");

    emit RefundMade(_id, msg.sender, amount);
}



}

