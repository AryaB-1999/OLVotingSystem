import Web3 from "web3";
import OLVoteSys from "../../build/contracts/OLVoteSys.json";
import Voter from "../../build/contracts/Voter.json";
import contract from "truffle-contract"


const App = {
  web3: null,
  admin: null,
  voter: null,
  voterID: null,

  start: async function () {
    const { web3 } = this;

    try {
      // get contract instance
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = OLVoteSys.networks[networkId];
      this.admin = new web3.eth.Contract(
        OLVoteSys.abi,
        deployedNetwork.address,
      );

      // get accounts
      const accounts = await web3.eth.getAccounts();
      this.account = accounts[0];

      // console.log(this.admin._address)

    } catch (error) {
      console.error("Could not connect to contract or chain.");
    }
  },

  registerVoter: async function () {
    const { web3 } = this;

    const voterName = document.getElementById("regNameVoter").value
    const voterID = document.getElementById("regIDVoter").value
    const voterAge = parseInt(document.getElementById("regAgeVoter").value)
    console.log("Got Voter Values, now deploying Voter contract")
    const voter = contract(Voter)
    const netID = await web3.eth.net.getId()
    voter.setProvider(this.web3.currentProvider)
    voter.setNetwork(netID)
    const patIns = await voter.new(this.admin._address, voterName, voterID, voterAge, { from: this.account })
    console.log(patIns.address)
    console.log("Voter has been registered, now fetching ID for voter")
    const res = await this.admin.methods.registerVoter(patIns.address).send({ from: this.account })
    console.log(res)
    var voterNo = parseInt(await this.admin.methods.getNoOfVoters().call())
    console.log(voterNo - 1)
    voterNo--;
    alert("Congratulations!! You have successfully been registered. Your voter ID is : " + voterNo + "\n" + "You may now login using your voter ID")
    document.location.href = "login.html"
  },
  loginVoter: async function () {
    const { web3 } = this;

    var voterID = document.getElementById("loginIDVoter").value
    if (voterID == 'admin') {
      console.log("Admin trying to access")
      this.loginAdmin();
    } else {
      voterID = parseInt(voterID)
      console.log(voterID)
      console.log("Voter contract has been accessed, now will redirect to voter dashboard")
      this.loadUserDetails(voterID)
    }
  },
  loginAdmin: async function () {
    document.location.href = "adminDash.html"
  },
  loadUserDetails: async function (arg) {
    document.location.href = "voterDash.html?voterID=" + arg
    console.log(document.body.innerHTML)
  },
  refresh: async function () {
    const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"))

    // console.log(document.body.innerHTML)
    const query = window.location.search
    console.log(query)
    const urlParams = new URLSearchParams(query)
    var voterID = urlParams.get('voterID')
    console.log(voterID)


    const networkId = await web3.eth.net.getId();
    const deployedNetwork = OLVoteSys.networks[networkId];
    this.admin = new web3.eth.Contract(
      OLVoteSys.abi,
      deployedNetwork.address,
    );

    // get accounts
    const accounts = await web3.eth.getAccounts();
    this.account = accounts[0];

    voterID = parseInt(voterID)
    console.log(voterID)
    console.log(this.admin)
    const address = await this.admin.methods.getVoterAddress(voterID).call()
    this.voter = new web3.eth.Contract(Voter.abi, address)
    console.log(this.voter)

    const result = await this.voter.methods.getVoterDetails().call()

    document.getElementById("userDet").innerHTML = "Hi, " + result[0];
    document.getElementById("loginName").innerHTML = result[0]
    document.getElementById("loginIDProof").innerHTML = result[1]
    document.getElementById("loginAge").innerHTML = result[2]
    document.getElementById("loginNum").innerHTML = voterID
    if (parseInt(result[3]) == -1) {
      document.getElementById("loginVotedTo").innerHTML = "Not Voted"
    } else {
      var a = await this.admin.methods.showCandidate(result[3]).call();
      document.getElementById("loginVotedTo").innerHTML = a[0] + " representing " + a[1]
    }
  },
  registerCandidate: async function () {
    const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"))

    const networkId = await web3.eth.net.getId();
    const deployedNetwork = OLVoteSys.networks[networkId];
    this.admin = new web3.eth.Contract(
      OLVoteSys.abi,
      deployedNetwork.address,
    );

    // get accounts
    const accounts = await web3.eth.getAccounts();
    this.account = accounts[0];

    const cName = document.getElementById("regNameCandidate").value
    const cParty = document.getElementById("regIDRepresent").value
    const cAge = parseInt(document.getElementById("regAgeCandidate").value)

    const res = await this.admin.methods.registerCandidate(cName, cParty, cAge).send({ from: this.account, gas: 692175 })
    console.log(res)

    document.location.href = "adminDash.html"
  },
  fillCandidateTable: async function () {
    const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"))

    const table = document.getElementById("adminDashTable")
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = OLVoteSys.networks[networkId];
    this.admin = new web3.eth.Contract(
      OLVoteSys.abi,
      deployedNetwork.address,
    );

    table.innerHTML = "<tr><td>Name</td><td>Party Name</td><td>Age</td><td>Votes Received</td></tr>"
    const candidates = await this.admin.methods.getNoOfCandidates().call()
    for (var i = 0; i < candidates; i++) {
      const info = await this.admin.methods.showCandidate(i).call();
      table.innerHTML += "<tr><td>" + info[0] + "</td><td>" + info[1] + "</td><td>" + info[2] + "</td><td>" + info[3] + "</td></tr>"
    }
  },
  populateVoters: async function () {
    const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"))

    const table = document.getElementById("loginPageVoteTable")
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = OLVoteSys.networks[networkId];
    this.admin = new web3.eth.Contract(
      OLVoteSys.abi,
      deployedNetwork.address,
    );

    const query = window.location.search
    console.log(query)
    const urlParams = new URLSearchParams(query)
    var voterID = urlParams.get('voterID')
    console.log(voterID)

    voterID = parseInt(voterID)
    console.log(voterID)
    console.log(this.admin)
    var address = await this.admin.methods.getVoterAddress(voterID).call()
    this.voter = new web3.eth.Contract(Voter.abi, address)
    console.log(this.voter)

    var isEligible = await this.voter.methods.isEligible().call()
    if (isEligible) {
      table.innerHTML = "<tr><td>Name</td><td>Party Name</td><td>Age</td><td></td></tr>"
      const candidates = await this.admin.methods.getNoOfCandidates().call()
      for (var i = 0; i < candidates; i++) {
        const info = await this.admin.methods.showCandidate(i).call();
        table.innerHTML += "<tr><td>" + info[0] + "</td><td>" + info[1] + "</td><td>" + info[2] + "</td><td><button onclick='App.Vote(" + i + ")' class='w3-button 'style='padding-top:0;padding-bottom:0;float: right;'>Vote</button></td></tr>"
      }
    } else {
      alert("Sorry, you either are under age or have voted before")
      document.location.reload(true) 
    }
  },
  Vote: async function (arg) {
    var conf = confirm("Do you want to proceed with selected option, once voted you cannot re-vote and cannot change your vote")
    if (conf) {
      const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"))

      const query = window.location.search
      console.log(query)
      const urlParams = new URLSearchParams(query)
      var voterID = urlParams.get('voterID')
      console.log(voterID)


      const networkId = await web3.eth.net.getId();
      const deployedNetwork = OLVoteSys.networks[networkId];
      this.admin = new web3.eth.Contract(
        OLVoteSys.abi,
        deployedNetwork.address,
      );

      // get accounts
      const accounts = await web3.eth.getAccounts();
      this.account = accounts[0];

      voterID = parseInt(voterID)
      console.log(voterID)
      console.log(this.admin)
      var address = await this.admin.methods.getVoterAddress(voterID).call()
      this.voter = new web3.eth.Contract(Voter.abi, address)
      console.log(this.voter)

      var res = await this.admin.methods.vote(arg).send({ from: this.account })
      console.log("Admin" + res)
      res = await this.voter.methods.vote(arg).send({ from: this.account })
      console.log("Voter" + res)
      alert("Thank you for voting")
      document.location.reload(true)
    }
  }
};

window.App = App;

window.addEventListener("load", function () {
  if (window.ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum);
    window.ethereum.enable(); // get permission to access accounts
  } else {
    console.warn(
      "No web3 detected. Falling back to http://127.0.0.1:7545. You should remove this fallback when you deploy live",
    );
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(
      new Web3.providers.HttpProvider("http://127.0.0.1:7545"),
    );
  }

  App.start();
});
