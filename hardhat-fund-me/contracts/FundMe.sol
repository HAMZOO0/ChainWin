// SPDX-License-Identifier: UNLICENSED
//1 :pragma
pragma solidity ^0.8.28;
//2 :imports
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

//3 : Error code
// custom error
error FundMe__not_owner(); // we use just not_owner but FundMe__not_owner is good practice

/**
 * @title FundMe - A simple crowdfunding contract
 * @author Hamza Sajid
 * @notice This contract allows users to fund and the owner to withdraw funds.
 * @dev Utilizes Chainlink price feeds for ETH/USD conversion.
 */
contract FundMe {
    address[] public funders; // list of funders
    // => this is owner , and it is immutable , same as constant but it is use for run time constant
    address private immutable i_owner;
    uint256 constant minimum_usd = 50 * 1e18;
    AggregatorV3Interface public priceFeed;
    mapping(address => uint256) public fundersWithAmount; // how much ammount shoud each sender sended us

    constructor(address _priceFeed) payable {
        i_owner = msg.sender; // this is owner
        priceFeed = AggregatorV3Interface(_priceFeed);
    }

    function Fund() public payable {
        // set minimum ammount of funding  mg  value means user send the xyz ammount
        require(
            getConverstionRate(msg.value) >= minimum_usd,
            "ETH value must be greater than or equal to 50 USD"
        ); //  1 * 10 ** 18 = 100000000000000000
        fundersWithAmount[msg.sender] = msg.value;
        funders.push(msg.sender);
    }

    function getPrice() public view returns (uint256) {
        (, int256 price, , , ) = priceFeed.latestRoundData();
        return uint256(price * 1e10); // chain link provide 8 decimal places value so we multiply with 1e10 to make it 1e18
    }

    function getConverstionRate(
        uint256 ethAmount
    ) public view returns (uint256) {
        uint256 ethprice = getPrice(); // 500.000000... 8 -- 100.00...8  ----- 300.0000000
        return (ethAmount * ethprice) / 1e18;
    }

    // owner of this conract can withdraw this
    function withdraw() public OnlyOwner {
        // require(owner == msg.sender, "only owner can withdraw "); // check the caller of this function is must be ower

        // clear array and map
        for (uint256 i = 0; i < funders.length; i = i + 1) {
            for (
                uint256 funderIndex = 0;
                funderIndex < funders.length;
                funderIndex++
            ) {
                address funder = funders[funderIndex];
                fundersWithAmount[funder] = 0;
            }
            delete funders;

            (bool sucess_tranfer, ) = payable(msg.sender).call{
                value: address(this).balance
            }("");

            require(sucess_tranfer, "sender call fail");
        }
    }

    modifier OnlyOwner() {
        // require (msg.sender == i_owner , "Only Owner can call this function");
        // for gas effecny we use custom error
        if (msg.sender != i_owner) {
            revert FundMe__not_owner();
        }
        _; // its means first check the condition then run the code  , if we put it above the require statement then it run the code
    }

    receive() external payable {
        Fund();
    }
    fallback() external payable {
        Fund();
    }
}
