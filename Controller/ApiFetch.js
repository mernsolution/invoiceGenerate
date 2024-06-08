const axios = require("axios");

const ApiData = async (req, res) => {
  try {
    const response = await axios.get(
      "https://exam-server-7c41747804bf.herokuapp.com/carsList"
    );
    res.status(200).json(response.data);
  } catch (error) {
    console.log(error);
  }
};

const sentCountTotalValueController = async (req, res) => {
  try {
    const {
      selectedMake,
      Hours,
      WeeklyTime,
      DailyTime,
      discountValue,
      collisionDamageWaiverCharge,
      rentalTextCharge,
      liabilityInsuranceCharge,
    } = req.body;

    // Fetch data from the external API
    const response = await axios.get(
      "https://exam-server-7c41747804bf.herokuapp.com/carsList"
    );
    const carData = response.data.data;

    // Find matching car data
    const matchingCar = carData.find((car) => car.make === selectedMake);
    if (!matchingCar) {
      return res.status(404).json({ message: "Car make not found" });
    }

    // Calculate total cost based on Hours, WeeklyTime, and DailyTime
    let totalCostWeekly = 0;
    let totalCostDaily = 0;
    let totalCostHourly = 0;

    if (WeeklyTime && matchingCar.rates.weekly) {
      totalCostWeekly = WeeklyTime * matchingCar.rates.weekly;
    }
    if (DailyTime && matchingCar.rates.daily) {
      totalCostDaily = DailyTime * matchingCar.rates.daily;
    }
    if (Hours && matchingCar.rates.hourly) {
      totalCostHourly = Hours * matchingCar.rates.hourly;
    }

    // Calculate total cost including additional charges
    const totalCost =
      totalCostWeekly +
      totalCostDaily +
      totalCostHourly +
      collisionDamageWaiverCharge +
      liabilityInsuranceCharge +
      rentalTextCharge;

    const discountAmount = (totalCost * discountValue) / 100;
    const totalValue = totalCost - discountAmount;

    const data = {
      totalCostWeekly,
      totalCostDaily,
      totalCostHourly,
      totalCost,
      discountAmount,
      totalValue,
    };

    res.status(200).json({ data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error processing data" });
  }
};

module.exports = { ApiData, sentCountTotalValueController };
