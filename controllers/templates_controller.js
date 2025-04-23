const option = { month: "long", day: "numeric", year: "numeric" };

const converter = function (n) {
  if (n < 0) return false;

  // Arrays to hold words for single-digit, double-digit, and below-hundred numbers
  var single_digit = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
  ];
  var double_digit = [
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  var below_hundred = [
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  if (n === 0) return "Zero";

  // Recursive function to translate the number into words
  function translate(n) {
    let word = "";
    if (n < 10) {
      word = single_digit[n] + " ";
    } else if (n < 20) {
      word = double_digit[n - 10] + " ";
    } else if (n < 100) {
      let rem = translate(n % 10);
      word = below_hundred[(n - (n % 10)) / 10 - 2] + " " + rem;
    } else if (n < 1000) {
      word =
        single_digit[Math.trunc(n / 100)] + " Hundred " + translate(n % 100);
    } else if (n < 1000000) {
      word =
        translate(parseInt(n / 1000)).trim() +
        " Thousand " +
        translate(n % 1000);
    } else if (n < 1000000000) {
      word =
        translate(parseInt(n / 1000000)).trim() +
        " Million " +
        translate(n % 1000000);
    } else {
      word =
        translate(parseInt(n / 1000000000)).trim() +
        " Billion " +
        translate(n % 1000000000);
    }
    return word;
  }

  // Get the result by translating the given number
  let result = translate(n);
  return result.trim();
};

const getdatatodisplay = function (name, address, permittype, permitsubtype) {
  let datatodisplay;

  if (permittype === "tree_cutting" && permitsubtype != "") {
    if (permitsubtype === "Public Safety Permit") {
      datatodisplay = {
        client: name,
        address: address,
        totalfee: "1,286.00",
        totalfeeinwords: converter(parseInt(1286)),
        fee1: "Certification Fee",
        fee2: "Oath Fee",
        fee3: "Inventory Fee",
        fee1_amount: "50.00",
        fee2_amount: "36.00",
        fee3_amount: "1,200.00",
        permittype: "Tree Cutting Permit",
        permitsubtype: `${permitsubtype}`,
        datenow: new Date().toLocaleDateString("en-us", option),
      };
    } else if (permitsubtype === "Private Land Timber Permit") {
      datatodisplay = {
        client: name,
        address: address,
        totalfee: "1,286.00",
        totalfeeinwords: converter(parseInt(1286)),
        fee1: "Certification Fee",
        fee2: "Oath Fee",
        fee3: "Inventory Fee",
        fee1_amount: "50.00",
        fee2_amount: "36.00",
        fee3_amount: "1,200.00",
        permittype: "Tree Cutting Permit",
        permitsubtype: `${permitsubtype}`,
        datenow: new Date().toLocaleDateString("en-us", option),
      };
    } else {
      datatodisplay = {
        client: name,
        address: address,
        totalfee: "86.00",
        totalfeeinwords: converter(parseInt(86)),
        fee1: "Certification Fee",
        fee2: "Oath Fee",
        fee3: "",
        fee1_amount: "50.00",
        fee2_amount: "36.00",
        fee3_amount: "",
        permittype: "Tree Cutting Permit",
        permitsubtype: `${permitsubtype}`,
        datenow: new Date().toLocaleDateString("en-us", option),
      };
    }
  } else if (permittype === "chainsaw" && permitsubtype != "") {
    if (permitsubtype === "Chainsaw Registration") {
      datatodisplay = {
        client: name,
        address: address,
        totalfee: "500.00",
        totalfeeinwords: converter(parseInt(500)),
        fee1: "Registration Fee",
        fee2: "",
        fee3: "",
        fee1_amount: "500.00",
        fee2_amount: "",
        fee3_amount: "",
        permittype: "Chainsaw",
        permitsubtype: `${permitsubtype}`,
        datenow: new Date().toLocaleDateString("en-us", option),
      };
    } else if (permitsubtype === "Permit To Sell") {
      datatodisplay = {
        client: name,
        address: address,
        totalfee: "500.00",
        totalfeeinwords: converter(parseInt(500)),
        fee1: "Registration Fee",
        fee2: "",
        fee3: "",
        fee1_amount: "500.00",
        fee2_amount: "",
        fee3_amount: "",
        permittype: "Chainsaw",
        permitsubtype: `${permitsubtype}`,
        datenow: new Date().toLocaleDateString("en-us", option),
      };
    } else {
      datatodisplay = {
        client: name,
        address: address,
        totalfee: "500.00",
        totalfeeinwords: converter(parseInt(500)),
        fee1: "Registration Fee",
        fee2: "",
        fee3: "",
        fee1_amount: "500.00",
        fee2_amount: "",
        fee3_amount: "",
        permittype: "Chainsaw",
        permitsubtype: `${permitsubtype}`,
        datenow: new Date().toLocaleDateString("en-us", option),
      };
    }
  } else if (permittype === "transport_permit") {
    datatodisplay = {
      client: name,
      address: address,
      totalfee: "446.00",
      totalfeeinwords: converter(parseInt(446)),

      fee1: "Certification of Verification Fee",
      fee2: "Oath Fee",
      fee3: "Inspection Fee",
      fee1_amount: "50.00",
      fee2_amount: "36.00",
      fee3_amount: "360.00",
      permittype: "Transport Permit",
      permitsubtype: "",
      datenow: new Date().toLocaleDateString("en-us", option),
    };
  } else if (permittype === "wildlife") {
    datatodisplay = {
      client: name,
      address: address,
      totalfee: "500.00",
      totalfeeinwords: converter(parseInt(500)),
      fee1: "Registration Fee",
      fee2: "",
      fee3: "",
      fee1_amount: "500.00",
      fee2_amount: "",
      fee3_amount: "",
      permittype: "Wildlife Registration",
      permitsubtype: "",
      datenow: new Date().toLocaleDateString("en-us", option),
    };
  } else {
    datatodisplay = {
      client: name,
      address: address,
      totalfee: "446.00",
      totalfeeinwords: converter(parseInt(446)),
      fee1: "Truck Load",
      fee2: "Oath Fee",
      fee3: "Scaling Fee",
      fee1_amount: "50.00",
      fee2_amount: "36.00",
      fee3_amount: "360.00",
      permittype: "Plantation and Wood Processing",
      permitsubtype: "",
      datenow: new Date().toLocaleDateString("en-us", option),
    };
  }

  return datatodisplay;
};

export const renderOrderofPayment = (req, res) => {
  let datatodisplay;

  const permitsubtype = req.params.permitsubtype;
  const permittype = req.params.permittype;
  const name = req.params.name;
  const address = req.params.address;

  datatodisplay = getdatatodisplay(name, address, permittype, permitsubtype);

  console.log(datatodisplay);

  res.render("./templates/order_of_payment", { data: datatodisplay });
};
