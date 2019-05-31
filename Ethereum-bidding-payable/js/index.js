console.log('Web3 check...');
typeof web3 !== 'undefined'
  ? (web3 = new Web3(web3.currentProvider))
  : (web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545')));

web3.isConnected() ? console.log('connected') : console.log('Not connected');

web3.eth.defaultAccount = web3.eth.accounts[0];

const contractAddress =
  '0xf77a50e77f4701f6f1dabdcddba13872abb0c5f4'; /* your contract address */

const ABI = [
	{
		"constant": false,
		"inputs": [
			{
				"name": "_title",
				"type": "string"
			},
			{
				"name": "_name",
				"type": "string"
			}
		],
		"name": "voting",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "rtitle",
				"type": "string"
			},
			{
				"indexed": false,
				"name": "rName",
				"type": "string"
			},
			{
				"indexed": false,
				"name": "rAmount",
				"type": "uint256"
			}
		],
		"name": "recentVoter",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "htitle",
				"type": "string"
			},
			{
				"indexed": false,
				"name": "hName",
				"type": "string"
			},
			{
				"indexed": false,
				"name": "hAmount",
				"type": "uint256"
			}
		],
		"name": "highestVoter",
		"type": "event"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "beneficiary",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getVoter",
		"outputs": [
			{
				"name": "",
				"type": "string"
			},
			{
				"name": "",
				"type": "string"
			},
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "highestBid",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
];

const bidding = web3.eth.contract(ABI).at(contractAddress);

function init() {
  /* init home page */
  const voter = bidding.getVoter().toString();
  console.log(voter);
  const voterInfo = voter.split(',');

  console.log(bidding.getVoter());

  document.getElementById('hTitle').innerText = voterInfo[0];
  document.getElementById('hName').innerText = voterInfo[1];
  document.getElementById('hBid').innerText = voterInfo[2] / 1000000000000000000;;
  

  // 계정 목록 추가
  accountList();
}

/* 계정 목록 추가 */
function accountList() {
  const list = web3.eth.accounts;
  console.log(list);
  const select = document.getElementById('receiver');

  list.map(el => {
    const opt = document.createElement('option');
    opt.value = el;
    opt.innerHTML = el;

    select.appendChild(opt);
  });
}

function showList() {
  const eventVote = bidding.recentVoter();
  const highestVote = bidding.highestVoter();
  const highestTitle = document.getElementById('hTitle');
  const highestName = document.getElementById('hName');
  const highestBid = document.getElementById('hBid');

  eventVote.watch((error, result) => {
    console.log(`result = ${result}`);
    if (!error) {
      document.getElementById('rTitle').innerText = result.args.rtitle;
      document.getElementById('rFname').innerText = result.args.rName;
      document.getElementById('rAmount').innerText = result.args.rAmount / 1000000000000000000;
    } else console.log(error);
  });

  highestVote.watch((error, result) => {
    console.dir(result);
    if (!error) {
      highestTitle.innerText = result.args.htitle;
      highestName.innerText = result.args.hName;
	  highestBid.innerText = result.args.hAmount / 1000000000000000000;
    } else console.log(error);
  });

  /* save your name button */
  const button = document.getElementById('savebutton');

  button.addEventListener('click', () => {
    const address = document.getElementById('receiver').value;
	const pass = document.getElementById('pass').value;
    const title = document.getElementById('title').value;
    const name = document.getElementById('name').value;
    const bid = document.getElementById('bid').value;

    // from Wei to eth
    const etherValue = bid * 1000000000000000000;
    console.log(`ether = ${web3.fromWei(etherValue)}`);

    try {
      if (web3.personal.unlockAccount(address, pass, 1000)) {
        bidding.voting(title, name, {
          from: address,
          value: etherValue,
          gas: 3000000,
        });
        console.log('데이터를 입력했습니다.');
      }
    } catch {
      alert('unlock 오류났습니다.');
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  init();
  showList();
});
