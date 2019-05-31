typeof web3 !== 'undefined'
  ? (web3 = new Web3(web3.currentProvider))
  : (web3 = new Web3(new Web3.providers.HttpProvider('http://192.168.0.106:8545')));

if (web3.isConnected()) {
  console.log('connected');
} else {
  console.log('not connected');
  exit;
}

const contractAddress = '0xaad0229387246e9812faa11fb0a38019aaa8fe04';
const smartContract = web3.eth.contract(abi).at(contractAddress);



function shownewList() {  
  const ntable = document.getElementById('body2');
  smartContract.product().watch((err, res) => {
    if (!err) {
      console.dir(res);
      const nrow = ntable.insertRow();
      const ncell1 = nrow.insertCell(0);
      const ncell2 = nrow.insertCell(1);
      const ncell3 = nrow.insertCell(2);
      const ncell4 = nrow.insertCell(3);
      const ncell5 = nrow.insertCell(4);
      const ncell6 = nrow.insertCell(5);
      ncell6.innerHTML = res.args.userid;
      ncell5.innerHTML = res.args.corpid;
      ncell4.innerHTML = res.args.number.c[0];
      ncell2.innerHTML = res.args.productName;
      ncell3.innerHTML = res.args.location;
      ncell1.style.width = '40%';
      ncell1.innerHTML = new Date(res.args.timestamp.c[0] * 1000);
    }
  });
}

function showList() {
  $( '#table1 > tbody').empty();
  if(chkempty1()){ 
  const table = document.getElementById('body1');
  const length = smartContract.getNumOfProducts();
  const clength=smartContract.getcorpcount();
  const account=document.getElementById('account').value;
  var _idx =-1;
 
  for(let i=0; i<clength; i++){
    const corpinfo = smartContract.getaccountStruct(i);
    const toString = corpinfo.toString();
    const strArray = toString.split(',');

    if(account==strArray[0]) {_idx=i;break;}
  }
 
  if(_idx!=-1){
  for (let i = 0; i < length; i++) {
    const product = smartContract.getProductStruct(_idx,i);
    const toString = product.toString();
    const strArray = toString.split(',');
    

    const timestamp = new Date(strArray[3] * 1000);
    const row = table.insertRow();
    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1);
    const cell3 = row.insertCell(2);
    const cell4 = row.insertCell(3);
    const cell5 = row.insertCell(4);
    const cell6 = row.insertCell(5);
    cell6.innerHTML = strArray[5];
    cell5.innerHTML = strArray[4];
    cell4.innerHTML = strArray[0];
    cell2.innerHTML = strArray[1];
    cell3.innerHTML = strArray[2];
    cell1.style.width = '40%';
    cell1.innerHTML = timestamp;
  }
}alert("Transaction success");
}
}

function newAccount() {
  if(chkempty1()){
    const clength=smartContract.getcorpcount();
    const corpname=document.getElementById('corp_name').value;
    const username=document.getElementById('username').value;
    const account=document.getElementById('account').value;
          for(let i=0; i<clength; i++){
            const corpinfo = smartContract.getaccountStruct(i);
            const toString = corpinfo.toString();
            const strArray = toString.split(',');
            if(account==strArray[0]) {alert('이미 가입된 회원입니다.\n'+'ID: '+strArray[0]+'\n이름: '+strArray[1]+'\n사명: '+strArray[2]); return;}
          }
        smartContract.newaccount(
          account,
          username,
          corpname,
          { from: account, gas: 2000000 },
          (err, result) => {
            if (!err) {alert('계정이 성공적으로 등록되었습니다.\n' + result);
            web3.personal.lockAccount(account);}
          }
        );
    }
}

function addProduct() {
  if(chkempty1()&&chkempty2()){
    
  const pronumber = document.getElementById('pronumber').value;
  const proname = document.getElementById('proname').value;
  const proloc = document.getElementById('proloc').value;
  const account = document.getElementById('account').value;
  const clength=smartContract.getcorpcount();
  if(clength==0) {alert('등록되지 않은 회원입니다.\n'); return;}

  for(let i=0; i<clength; i++){
      const corpinfo = smartContract.getaccountStruct(i);
      const toString = corpinfo.toString();
      const strArray = toString.split(',');
      if(account==strArray[0]) break;
      else if(i==clength-1 && account!=strArray[0]) {alert('등록되지 않은 회원입니다.\n'); return;}
  }
    smartContract.addProStru(
      pronumber,
      proname,
      proloc,
      account,
      { from: account, gas: 2000000 },
      (err, result) => {
        if (!err) {alert('트랜잭션이 성공적으로 전송되었습니다.\n' + result);
        web3.personal.lockAccount(account);}
        shownewList();
      }
    );
  }
}

function chkempty1(){
  const account = document.getElementById('account').value;
  const username=document.getElementById('username').value;
  const corpname=document.getElementById('corp_name').value;

  
  if(web3.personal.unlockAccount(account, document.getElementById('pass').value)){
  if(account=="" || username =="" || corpname =='nonchoose') {alert("value undefined");return false;}
  else return true;
  }
}
function chkempty2(){
  const pronumber = document.getElementById('pronumber').value;
  const proname = document.getElementById('proname').value;
  const proloc = document.getElementById('proloc').value;
  if(pronumber=="" || proname =="" || proloc =="") {alert("value undefined");return false;}
  else return true;
}



function datasort(){

}
