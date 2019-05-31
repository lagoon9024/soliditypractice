typeof web3 !== 'undefined'
  ? (web3 = new Web3(web3.currentProvider))
  : (web3 = new Web3(new Web3.providers.HttpProvider('http://192.168.0.106:8545')));

if (web3.isConnected()) {
  console.log('connected');
} else {
  console.log('not connected');
  exit;
}

const contractAddress = '0xb0c9d1ec728c1eda51f493c3c18623dc05fd3cbd';
const smartContract = web3.eth.contract(abi).at(contractAddress);

function showList() {
  const table = document.getElementById('table1');
  const length = smartContract.getNumOfProducts();

  smartContract.product().watch((err, res) => {
    if (!err) {
      console.dir(res);
      const row = table.insertRow();
      const cell1 = row.insertCell(0);
      const cell2 = row.insertCell(1);
      const cell3 = row.insertCell(2);
      const cell4 = row.insertCell(3);
      cell4.innerHTML = res.args.number.c[0];
      cell2.innerHTML = res.args.productName;
      cell3.innerHTML = res.args.location;
      cell1.style.width = '60%';
      cell1.innerHTML = new Date(res.args.timestamp.c[0] * 1000);
    }
  });

  for (let i = 0; i < length; i++) {
    const product = smartContract.getProductStruct(i);
    const toString = product.toString();
    const strArray = toString.split(',');

    const timestamp = new Date(strArray[3] * 1000);
    const row = table.insertRow();
    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1);
    const cell3 = row.insertCell(2);
    const cell4 = row.insertCell(3);
    cell4.innerHTML = strArray[0];
    cell2.innerHTML = strArray[1];
    cell3.innerHTML = strArray[2];
    cell1.style.width = '60%';
    cell1.innerHTML = timestamp;
  }
}

function addProduct() {
  const pronumber = document.getElementById('pronumber').value;
  const proname = document.getElementById('proname').value;
  const proloc = document.getElementById('proloc').value;
  const account = document.getElementById('account').value;
  if (
    web3.personal.unlockAccount(account, document.getElementById('pass').value)
  ) {
    smartContract.addProStru(
      pronumber,
      proname,
      proloc,
      { from: account, gas: 2000000 },
      (err, result) => {
        if (!err) alert('트랜잭션이 성공적으로 전송되었습니다.\n' + result);
      }
    );
  }
}

$(function() {
  showList();
});
