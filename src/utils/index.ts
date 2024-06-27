export const validateEmail = (email: string) => {
  return email.match(
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
  );
};

export const getTranscationTypeNameByNumber = (id: number) => {
  let name = "";
  switch (id) {
    case 1:
      name = "Topup";
      break;
    case 2:
      name = "Bundle";
      break;
    case 3:
      name = "SIMWithPlan";
      break;
    case 4:
      name = "SIMWithCredit";
      break;
    case 5:
      name = "SIMWithCreditandPlan";
      break;
    case 6:
      name = "TopupBundle";
      break;
    case 7:
      name = "ChangePlan";
      break;
    case 8:
      name = "EarlyTerminationCharges";
      break;
    case 9:
      name = "CancelBundleRefund";
      break;
    case 10:
      name = "AddCard";
      break;
    default:
      break;
  }
  return name;
};

export const getPaymentMethodByNumber = (id: number) => {
  let name = "";
  switch (id) {
    case 1:
      name = "Card";
      break;
    case 2:
      name = "Paypal";
      break;
    case 3:
      name = "Balance";
      break;
    case 4:
      name = "Voucher";
      break;
    default:
      break;
  }
  return name;
};

export const getOrderStatus = (id: string) => {
  let name = "";
  switch (id) {
    case "1":
      name = "Create";
      break;
    case "2":
      name = "Success";
      break;
    case "3":
      name = "Failure";
      break;
    case "4":
      name = "Refunded";
      break;
    case "5":
      name = "Pending";
      break;
    case "6":
      name = "Cancel Bundle Refunded";
      break;
    case "7":
      name = "Cancelled";
      break;
    default:
      break;
  }
  return name;
};
