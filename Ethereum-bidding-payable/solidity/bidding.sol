pragma solidity ^0.5.0;

contract bidding {
    address payable public beneficiary;

    /* 최고 입찰자 */
    string highestTitle;
    string highestName;
    uint public highestBid;

    event recentVoter(
        string rtitle,
        string rName,
        uint rAmount
    );

    event highestVoter(
        string htitle,
        string hName,
        uint hAmount
    );

    function voting(string memory _title, string memory _name) public payable {
        if (msg.value > highestBid) {
            highestTitle = _title;
            highestName = _name;
            highestBid = msg.value;
            emit highestVoter(_title, _name, msg.value);
        }
        emit recentVoter(_title, _name, msg.value);
    }

    function getVoter() public view returns(string memory, string memory, uint) {
        return (highestTitle, highestName, highestBid);
    }
}