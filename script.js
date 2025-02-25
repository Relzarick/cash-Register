let price = 1.87;

// ? penny = one cent
// ? nickle = five cents
// ? dime = 10 cents
// ? quarter = 25 cents

let cid = [
  ["PENNY", 1.01],
  ["NICKEL", 2.05],
  ["DIME", 3.1],
  ["QUARTER", 4.25],
  ["ONE", 90],
  ["FIVE", 55],
  ["TEN", 20],
  ["TWENTY", 60],
  ["ONE HUNDRED", 100],
];

const purchaseBtn = document.getElementById("purchase-btn");
const userCash = document.getElementById("cash");
const changeDisplay = document.getElementById("change-due");
const drawerDisplay = document.getElementById("change-container");

// * record indvidual denominations
let changeDisplayDenominations = [];
// * Used to convert object to string to display change returned
let assignDenominations = {};

const centsArray = [10000, 2000, 1000, 500, 100, 25, 10, 5, 1];

const check = () => {
  const cashGiven = Math.round(Number(userCash.value) * 100);

  const priceInCents = Math.round(price * 100);
  const changeDue = cashGiven - priceInCents;

  console.log(priceInCents);
  console.log(cashGiven);

  //todo based on cid need to change
  // todo the getval method messes up the calc
  let changeOnHand =
    Number(
      cidCopy
        .getVal()
        .reduce((acc, curVal) => acc + curVal[1], 0)
        .toFixed(2)
    ) * 100;

  if (cashGiven < priceInCents) {
    // * not enough cash to purchase
    alert("Customer does not have enough money to purchase the item");
  } else if (cashGiven === priceInCents) {
    // * paid exact value
    calc(changeDue, cashGiven);
    updateUi(0);
  } else if (changeDue > changeOnHand || !checkDenom(changeDue)) {
    // * not enough change
    updateUi(1);
  } else if (priceInCents < cashGiven && changeOnHand === changeDue) {
    // * gave all change
    calc(changeDue, cashGiven);
    updateUi(3);
  } else {
    // * normal procedures
    calc(changeDue, cashGiven);
    updateUi(2);
  }
  //console.log(changeOnHand);
};
//33541;

const checkDenom = (changeDue) => {
  let arrayOrderReversed = cidCopy
    .getVal()
    .map((arr) => Math.round(arr[1] * 100))
    .reverse();

  for (let i = 0; i < arrayOrderReversed.length; i++) {
    // * the second condition checks if current arrOrderReversed has enough value to match centsArray
    while (
      changeDue >= centsArray[i] &&
      arrayOrderReversed[i] >= centsArray[i]
    ) {
      // * still have to simulate deductions if it returns true it will proceed to next else block
      changeDue -= Math.round(centsArray[i]);
      arrayOrderReversed[i] -= Math.round(centsArray[i]);
    }
  }
  return changeDue === 0;
};

const calc = (change, cashGiven) => {
  let noChange = true;
  let cashRemaining = cashGiven;
  changeDisplayDenominations = [];

  // * check if userInput is > 0
  while (cashRemaining > 0) {
    noChange = true;
    for (let i = 0; i < centsArray.length; i++) {
      // * check if cash is > curr denom
      if (cashRemaining >= centsArray[i]) {
        cashRemaining -= Math.round(centsArray[i]);
        cidCopy.addVal(i, centsArray[i]);
        noChange = false;
        break;
      }
    }
    if (noChange) {
      // * This means no more change to give
      break;
    }
  }

  // * assume that no changes will be made unless proven otherwise within the iteration

  if (cashGiven === Math.round(price * 100)) {
    while (cashGiven > 0) {
      noChange = true;
      for (let i = 0; i < centsArray.length; i++) {
        if (
          // * check if userInput is >= than curr denom & curr cidArr val is >= curr denom
          cashGiven >= centsArray[i] &&
          cidCopy.getVal()[cidCopy.getVal().length - 1 - i][1] * 100 >=
            centsArray[i]
        ) {
          cashGiven -= Math.round(centsArray[i]);

          changeDisplayDenominations.push(centsArray[i]);
          noChange = false;
          break;
        }
      }
      if (noChange) {
        break;
      }
    }
  }

  while (change > 0) {
    noChange = true;
    for (let i = 0; i < centsArray.length; i++) {
      if (
        change >= centsArray[i] &&
        cidCopy.getVal()[cidCopy.getVal().length - 1 - i][1] * 100 >=
          centsArray[i]
      ) {
        change -= Math.round(centsArray[i]);
        cidCopy.deductVal(i, centsArray[i]);
        // * break is used to exit the innder for loop first, restarting the while loop
        // * used to exit early after highest val is deducted, ensuring highest value is deducted first
        changeDisplayDenominations.push(centsArray[i]);
        //console.log(changeDisplayDenominations);

        noChange = false;
        break;
      }
    }
    if (noChange) {
      break;
    }
  }

  //console.log(changeOnHand);
  //console.log(arrayOrderReversed);
};

const updateArrayMethods = () => {
  // * Deep copy so as to not mutate original Arr (same as the old function, but no longer modify the cid)
  // ! this keeps the first iteration
  const cidCopy = JSON.parse(JSON.stringify(cid));

  //console.log(cidCopy);
  return {
    // * returns the copied arr
    getVal() {
      return JSON.parse(JSON.stringify(cidCopy));
    },
    deductVal(index, cash) {
      // ! the cash is used to deduct (All calc in cents)
      // *  locate current value to update cidCopy
      return (cidCopy[cidCopy.length - 1 - index][1] =
        Math.round(cidCopy[cidCopy.length - 1 - index][1] * 100 - cash) / 100);
    },
    // * return back after checking
    addVal(index, cash) {
      return (cidCopy[cidCopy.length - 1 - index][1] =
        Math.round(cidCopy[cidCopy.length - 1 - index][1] * 100 + cash) / 100);
    },
  };
};

const cidCopy = updateArrayMethods();
// ? Cannot access 'updateArrayMethods' before initialization

// console.log(updateCidCopy.mutateVal(0, 100));
//console.log(cidCopy.getVal().length);

const updateDenominationsUi = (stat) => {
  assignDenominations = {};

  const denominations = {
    10000: "ONE HUNDRED",
    2000: "TWENTY",
    1000: "TEN",
    500: "FIVE",
    100: "ONE",
    25: "QUARTER",
    10: "DIME",
    5: "NICKEL",
    1: "PENNY",
  };
  changeDisplayDenominations.forEach((val) => {
    const key = denominations[val];
    if (assignDenominations[key]) {
      // * this checks if it exists, then adds it to the object
      assignDenominations[key] += val;
    } else {
      // * this will run if it does not exists, adding a new value to the object
      assignDenominations[key] = val;
    }
  });
  //console.log(assignDenominations);

  let assignDenominationsString = "";
  // * the for loop will loop through the object and log the key into a string
  for (let key in assignDenominations) {
    if (assignDenominations.hasOwnProperty(key)) {
      assignDenominationsString += `${key}: $${
        Math.round((assignDenominations[key] / 100) * 100) / 100
      }<br>`;
    }
  }

  if (stat === 1) {
    changeDisplay.innerHTML = `Status: OPEN<br>${assignDenominationsString}`;
    console.log(assignDenominationsString);
  } else if (stat === 2) {
    changeDisplay.innerHTML = `Status: CLOSED<br>${assignDenominationsString}`;
  }
};

const updateUi = (stat) => {
  const ui = cidCopy.getVal();
  drawerDisplay.innerHTML = `<h2>Change in Drawer:</h2>
        <p>Pennies: $${ui[0][1]}</p>
        <p>Nickels: $${ui[1][1]}</p>
        <p>Dimes: $${ui[2][1]}</p>
        <p>Quarters: $${ui[3][1]}</p>
        <p>Ones: $${ui[4][1]}</p>
        <p>Fives: $${ui[5][1]}</p>
        <p>Tens: $${ui[6][1]}</p>
        <p>Twenties: $${ui[7][1]}</p>
        <p>Hundreds: $${ui[8][1]}</p>`;

  if (stat === 0) {
    changeDisplay.style.display = "flex";
    changeDisplay.textContent = "No change due - customer paid with exact cash";
  } else if (stat === 1) {
    changeDisplay.style.display = "flex";
    changeDisplay.textContent = "Status: INSUFFICIENT_FUNDS";
  } else if (stat === 2) {
    changeDisplay.style.display = "flex";
    updateDenominationsUi(1);
  } else if (stat === 3) {
    changeDisplay.style.display = "flex";
    updateDenominationsUi(2);
  }
};

// todo this might be the issue
let arrayOrderReversed = cidCopy
  .getVal()
  .map((arr) => Math.round(arr[1] * 100)).reverse;
//console.log(arrayOrderReversed);

purchaseBtn.addEventListener("click", () => {
  check();
  userCash.value = "";
});

userCash.addEventListener("keydown", () => {
  if (event.key === "Enter") {
    check();
    userCash.value = "";
  }
});

// ! legacy code
// const calChangeDue = (userInput) => {

//   const changeDue = Math.round((userInput - price) * 100);
//   // NEED TO REMEBER TO CONVERT BACK TO 2 DECI
//   return changeDue;
// };

// const updateCid = (index, cash) => {
// * cents array index, to locate current value to update cid
//   cid[cid.length - 1 - index][1] =
//     Math.round(cid[cid.length - 1 - index][1] * 100 - cash) / 100;
//   return cid;
//   console.log(cidCopy);
// };
