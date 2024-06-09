import axios from "axios";
const BASE_URL = "http://localhost:5000/v1";

export async function getInvoiceData() {
  const URL = BASE_URL + "/getInvoiceData";
  try {
    const res = await axios.get(URL);
    if (res.status === 200) {
      return res.data.data;
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function reqSentCountTotalValue(
  selectedMake,
  Hours,
  WeeklyTime,
  DailyTime,
  discountValue,
  collisionDamageWaiverCharge,
  liabilityInsuranceCharge,
  rentalTextCharge
) {
  const URL = BASE_URL + "/sentCountTotalValue";
  const countValue = {
    selectedMake,
    Hours,
    WeeklyTime,
    DailyTime,
    discountValue,
    collisionDamageWaiverCharge,
    rentalTextCharge,
    liabilityInsuranceCharge,
  };
  try {
    const res = await axios.post(URL, countValue);
    if (res.status === 200) {
      return res.data.data;
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}
