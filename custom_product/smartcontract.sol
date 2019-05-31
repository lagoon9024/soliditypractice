pragma solidity >=0.4.22 <0.7.0;

contract ProductContract {
    uint8 numberOfProducts; // 총 제품의 수입니다.
    uint8 corpcount;
    address Owner = address(owner address);

    struct myStruct {
        uint   number;
        string productName;
        string locaton;
        uint256 timestamp;
        string userid;
        string corpid;
    }
    
    struct corpinfo{
        address _persinfo;
        string userid;
        string corpid;
    }

    event product (
        uint number,
        string productName,
        string location,
        uint256 timestamp,
        string userid,
        string corpid
    );
    
    event welcome(address _persinfo, string userid, string corpid);

    myStruct[] public productes;
    corpinfo[] public corps;
    
    function newaccount(address _account, string memory _username, string memory _corpname) public{
        corps.push(corpinfo(_account, _username, _corpname))-1;
        corpcount++;
        emit welcome(_account, _username, _corpname);
    }

    function addProStru (uint _initNumber, string memory _firstString, string memory _secondString, address _account) public {
       uint tmp;
        for(uint i=0; i<corpcount; i++){
            if(keccak256(abi.encodePacked(_account)) == keccak256(abi.encodePacked(corps[i]._persinfo))){tmp=i; break;}
        }
        
        productes.push(myStruct(_initNumber, _firstString, _secondString, block.timestamp, corps[i].userid, corps[i].corpid)) -1;
        numberOfProducts++;
        emit product(_initNumber, _firstString, _secondString, block.timestamp, corps[i].userid, corps[i].corpid);
    }

    //제품 등록의 수를 리턴합니다.
    function getNumOfProducts() public view returns(uint8) {
        return numberOfProducts;
    }

    function getcorpcount() public view returns(uint8) {
        return corpcount;
    }

    //번호에 해당하는 제품의 이름을 리턴합니다.
    function getProductStruct(uint _corpidx, uint _index) public view returns (uint, string memory, string memory, uint256, string memory, string memory) {
        if(keccak256(abi.encodePacked(corps[_corpidx]._persinfo))==keccak256(abi.encodePacked(Owner))){
        return (productes[_index].number, 
        productes[_index].productName, 
        productes[_index].locaton, 
        productes[_index].timestamp, 
        productes[_index].corpid, 
        productes[_index].userid);
        }
        else require(keccak256(abi.encodePacked(corps[_corpidx].corpid))==keccak256(abi.encodePacked(productes[_index].corpid)));
        {return (productes[_index].number, 
        productes[_index].productName, 
        productes[_index].locaton, 
        productes[_index].timestamp, 
        productes[_index].corpid, 
        productes[_index].userid);}
        
    }

    function getaccountStruct(uint _index) public view returns (uint, string memory, string memory) {
        return (uint(corps[_index]._persinfo)%10000, corps[_index].userid, corps[_index].corpid);//address의 뒷자리 4숫자만 리턴
    }
}
