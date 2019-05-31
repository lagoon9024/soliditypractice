console.log('starting...');
//connect web3 and check if web3 is connected correctly
if (typeof web3 !== 'undefined') web3 = new Web3(web3.currentProvider);
// set the provider you want from Web3.providers
else web3 = new Web3(new Web3.providers.HttpProvider('http://private server address:8545'));

if (web3.isConnected()) console.log('connected');
else console.log('not connected');

web3.eth.defaultAccount = web3.eth.accounts[0];

const smartContract = web3.eth
  .contract(abi)
  .at('eth.account address');

function show() {
  smartContract.chat().watch((err, res) => {
    if (!err) {
      const div = document.createElement('div');
      div.className = 'card';
      const date = new Date(res.args.timeStamp.c[0]*1000);
      const string = `
        <h5 class="card-header">${res.args.name}</h5>
        <div class="card-body">
          <h5 class="card-title">${res.args.message}</h5>
          <p class="card-text">${date}</p>
        </div>
      `;
      div.innerHTML = string;

      document.getElementById('msg').appendChild(div);
    } else console.log(err);
  });
}

$(function() {
  show();

  $('#button').click(() => {
    console.log('submit');
    if (web3.personal.unlockAccount(web3.eth.defaultAccount, 'hello')) {
      smartContract.setChat($('#name').val(), $('#chatting').val());
      console.log('데이터를 입력했습니다.');
    }
  });
});
