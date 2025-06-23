
// SPDX-License-Identifier: UNLICENSED
pragma solidity  ^0.8.28;
// import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

// gas optimiation 
// 523225  before immutable 
// 499748 after immutable 
 // 466643  after custom error 

// custom error 
error not_owner() ; 

contract FundMe {
    
    // uint256 minimum_usd = 50 ;

    address[] public funders;  // list of funders

    // => this is owner , and it is immutable , same as constant but it is use for run time constant 
    address immutable public i_owner;
    constructor() payable {
        i_owner = msg.sender; // this is owner
    } 

    mapping (address =>uint256)public fundersWithAmount; // how much ammount shoud each sender sended us 

    function Fund() public payable {
        // set minimum ammount of funding  mg  value means user send the xyz ammount 
        require(msg.value >=1e18 , "ETH value must be greater than or equal to 1 ETH"); //  1 * 10 ** 18 = 100000000000000000
        funders.push(msg.sender);
        fundersWithAmount[msg.sender] = msg.value ; 
    }   

  

    // function conveersion_rate() public  {  }

// owner of this conract can withdraw this 
 function withdraw() public OnlyOwner{
    // require(owner == msg.sender, "only owner can withdraw "); // check the caller of this function is must be ower

// clear array and map  
for (uint256 i=0; i < funders.length ; i=i+1) 
{
    delete funders ; 
   
    (bool  sucess_tranfer , bytes memory data_return) = payable (msg.sender).call{value:address(this).balance}("") ; 
    require(sucess_tranfer,"sender call faile");

        }
}

    modifier OnlyOwner {
        // require (msg.sender == i_owner , "Only Owner can call this function");
        // for gas effecny we use custom error 
        if(msg.sender != i_owner) {
            revert not_owner();
        }
        _; // its means first check the condition then run the code  , if we put it above the require statement then it run the code
        // the condtio check  
    }

    receive() external payable {
        Fund() ; 
     }
     fallback() external payable {
        Fund(); 
      }

 
}