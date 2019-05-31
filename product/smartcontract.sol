pragma solidity >=0.4.22 <0.7.0;

contract ProductContract {
    uint8 numberOfProducts; // 총 제품의 수입니다.

    struct myStruct {
        uint   number;
        string productName;
        string locaton;
        uint timestamp;
    }

    event product (
        uint number,
        string productName,
        string location,
        uint timestamp
    );

    myStruct[] public productes;

    function addProStru (uint _initNumber, string memory _firstString, string memory _secondString) public {
        productes.push(myStruct(_initNumber, _firstString, _secondString, block.timestamp)) -1;
        numberOfProducts++;
        emit product(_initNumber, _firstString, _secondString, block.timestamp);
    }

    //제품 등록의 수를 리턴합니다.
    function getNumOfProducts() public view returns(uint8) {
        return numberOfProducts;
    }

    //번호에 해당하는 제품의 이름을 리턴합니다.
    function getProductStruct(uint _index) public view returns (uint, string memory, string memory, uint) {
        return (productes[_index].number, productes[_index].productName, productes[_index].locaton, productes[_index].timestamp);
    }
}