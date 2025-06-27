// SPDX-License-Identifier: UNLICENSED
//1 :pragma
pragma solidity ^0.8.28;
//2 :imports
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "hardhat/console.sol"; // testing logs

//3 : Error code
// custom error
error FundMe__not_owner(); // we use just not_owner but FundMe__not_owner is good practice

contract FundMe {
    address[] public s_funders; // list of funders
    // => this is owner , and it is immutable , same as constant but it is use for run time constant
    address private immutable i_owner;
    uint256 constant  MINIMUM_USD = 50 * 1e18;
    AggregatorV3Interface public s_priceFeed;
    mapping(address => uint256) public s_fundersWithAmount; // how much ammount shoud each sender sended us

    constructor(address _priceFeed) payable {
        i_owner = msg.sender; // this is owner
        s_priceFeed = AggregatorV3Interface(_priceFeed);
    }

    function Fund() public payable {
        // set minimum ammount of funding  mg  value means user send the xyz ammount
        require(
            getConverstionRate(msg.value) >= MINIMUM_USD,
            "ETH value must be greater than or equal to 50 USD"
        ); //  1 * 10 ** 18 = 100000000000000000
        s_fundersWithAmount[msg.sender] = msg.value;
        s_funders.push(msg.sender);

        // log print while testing
        // console.log(
        //     "Contract balance before withdraw:: ",
        //     address(this).balance
        // );
    }

    function getPrice() public view returns (uint256) {
        (, int256 price, , , ) = s_priceFeed.latestRoundData();
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
        for (uint256 i = 0; i < s_funders.length; i = i + 1) {
            for (
                uint256 funderIndex = 0;
                funderIndex < s_funders.length;
                funderIndex++
            ) {
                address funder = s_funders[funderIndex];
                s_fundersWithAmount[funder] = 0;
                console.log(" fundersWithAmount[funder] :: ",  s_fundersWithAmount[funder] );
            }
            delete s_funders;

            (bool sucess_tranfer, ) = payable(msg.sender).call{
                value: address(this).balance
            }("");

            require(sucess_tranfer, "sender call fail");
        }
        // console.log(
        //     "Contract balance after withdraw:: ",
        //     address(this).balance
        // );
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
