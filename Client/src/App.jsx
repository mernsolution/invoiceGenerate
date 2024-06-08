import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CiCalendar } from "react-icons/ci";
import "./App.css";
import { getInvoiceData, reqSentCountTotalValue } from "./Api/Api";
import PrintModal from "./PrintModal";
import { toast } from "react-toastify";
function App() {
  const [invoiceData, setInvoiceData] = useState([]);
  const [selectedPickupDate, setSelectedPickupDate] = useState(null);
  const [selectedReturnDate, setSelectedReturnDate] = useState(null);
  const [reservationID, setReservationID] = useState("");
  const [discountValue, setDiscountValue] = useState("");
  const [totalValues, setTotalValues] = useState({});
  const [selectedValues, setSelectedValues] = useState({
    collisionDamageWaiver: false,
    liabilityInsurance: false,
    rentalText: false,
  });
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [collisionDamageWaiverCharge, setCollisionDamageWaiverCharge] =
    useState(0);
  const [liabilityInsuranceCharge, setLiabilityInsuranceCharge] = useState(0);
  const [rentalTextCharge, setRentalTextCharge] = useState(0);
  const [selectedMake, setSelectedMake] = useState("");
  const [duration, setDuration] = useState("");
  const [Hours, setHours] = useState("");
  const [WeeklyTime, setWeeklyTime] = useState("");
  const [DailyTime, setDailyTime] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hourlyRate, setHourlyRate] = useState(0);
  const [dailyRate, setDailyRate] = useState(0);
  const [weeklyRate, setWeeklyRate] = useState(0);
  const [objectData, setObjectData] = useState({});
  const [errors, setErrors] = useState({});

  const handleIconClick = (inputClass) => {
    document.querySelector(inputClass).focus();
  };

  useEffect(() => {
    if (selectedMake && duration && duration !== "0 Days") {
      const fetchTotalValue = async () => {
        try {
          const res = await reqSentCountTotalValue(
            selectedMake,
            Hours,
            WeeklyTime,
            DailyTime,
            discountValue,
            selectedValues.collisionDamageWaiver
              ? collisionDamageWaiverCharge
              : null,
            selectedValues.liabilityInsurance ? liabilityInsuranceCharge : null,
            selectedValues.rentalText ? rentalTextCharge : null
          );

          if (res && Object.keys(res).length > 0) {
            setTotalValues(res);
          } else {
            console.error("Error fetching total value:", res.statusText);
          }
        } catch (error) {
          console.error("Error fetching total value:", error);
        }
      };
      fetchTotalValue();
    }
  }, [
    selectedMake,
    duration,
    Hours,
    WeeklyTime,
    DailyTime,
    discountValue,
    selectedValues.collisionDamageWaiver,
    selectedValues.liabilityInsurance,
    selectedValues.rentalText,
  ]);

  useEffect(() => {
    async function fetchData() {
      const data = await getInvoiceData();

      if (data && data.length > 0) {
        setInvoiceData(data);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedPickupDate && selectedReturnDate) {
      const msInDay = 24 * 60 * 60 * 1000;
      const msInHour = 60 * 60 * 1000;
      const diffTime = Math.abs(selectedReturnDate - selectedPickupDate);
      const diffDays = Math.floor(diffTime / msInDay);
      const remainingMs = diffTime % msInDay;
      const hours = Math.floor(remainingMs / msInHour);
      const weeks = Math.floor(diffDays / 7);
      const days = diffDays % 7;
      const parts = [];

      if (weeks > 0) {
        parts.push(`${weeks} week${weeks !== 1 ? "s" : ""}`);
      }
      if (days > 0) {
        parts.push(`${days} day${days !== 1 ? "s" : ""}`);
      }
      if (hours > 0) {
        parts.push(`${hours} hour${hours !== 1 ? "s" : ""}`);
      }

      setDuration(parts.length > 0 ? parts.join(" ") : "0 Days");
      setHours(hours);
      setDailyTime(days);
      setWeeklyTime(weeks);
    } else {
      setDuration("0 Days");
    }
  }, []);

  useEffect(() => {
    if (invoiceData.length > 0 && selectedMake) {
      const selectedCar = invoiceData.find((car) => car.make === selectedMake);

      if (selectedCar) {
        setHourlyRate(selectedCar.rates.hourly);
        setDailyRate(selectedCar.rates.daily);
        setWeeklyRate(selectedCar.rates.weekly);
        setObjectData(selectedCar);
      }
    }
  }, []);

  const handleMakeChange = (event) => {
    setSelectedMake(event.target.value);
  };

  const handleCheckboxChange = (name, charge) => {
    setSelectedValues((prevValues) => ({
      ...prevValues,
      [name]: !prevValues[name],
    }));
    switch (name) {
      case "collisionDamageWaiver":
        setCollisionDamageWaiverCharge(!selectedValues[name] ? 9 : charge);
        break;
      case "liabilityInsurance":
        setLiabilityInsuranceCharge(!selectedValues[name] ? 15 : charge);
        break;
      case "rentalText":
        setRentalTextCharge(!selectedValues[name] ? 11.5 : charge);
        break;
      default:
        break;
    }
  };

  const reservationIDHandle = (event) => {
    setReservationID(event.target.value);
  };

  const discountHandler = (event) => {
    setDiscountValue(event.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!reservationID) {
      newErrors.reservationID = "Reservation ID is required";
      toast.error("Reservation ID is required");
    } else if (!selectedPickupDate) {
      newErrors.selectedPickupDate = "Pickup date is required";
      toast.error("Pickup date is required");
    } else if (!selectedReturnDate) {
      newErrors.selectedReturnDate = "Return date is required";
      toast.error("Return date is required");
    } else if (!formData.firstName) {
      newErrors.firstName = "First name is required";
      toast.error("First name is required");
    } else if (!formData.lastName) {
      newErrors.lastName = "Last name is required";
      toast.error("Last name is required");
    } else if (!formData.email) {
      newErrors.email = "Email is required";
      toast.error("Email is required");
    } else if (!formData.phone) {
      newErrors.phone = "Phone number is required";
      toast.error("Phone number is required");
    } else if (!selectedMake) {
      newErrors.selectedMake = "Vehicle type is required";
      toast.error("Vehicle type is required");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePrintButtonClick = () => {
    if (validateForm()) {
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <section className="invoice-section">
        <div className="container container-area">
          <div className="row">
            <div className="col-md-12 col-xxl-12">
              <div className="invoice-top-title">
                <h2>Reservation</h2>
                <div className="button">
                  <button onClick={handlePrintButtonClick}>
                    Print / Download
                  </button>
                </div>
              </div>

              <PrintModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                data={objectData}
                reservation={{
                  reservationID,
                  selectedReturnDate,
                  selectedPickupDate,
                }}
                clientInfo={formData}
                totalInfo={totalValues}
              />
            </div>
            <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-4 col-xxl-4">
              <div className="item-section-reservation">
                <div className="item-section-subtitle">
                  <h2>Reservation Details</h2>
                </div>
                <div className="item-section-body">
                  <div className="pt-1">
                    <label className="form-label" for="id">Reservation ID</label>
                    <input
                      type="text"
                      id="id"
                      value={reservationID}
                      onChange={reservationIDHandle}
                      className="form-control "
                    />
                  </div>
                  <div className="pt-3">
                    <label className="form-label">
                      Pickup Date <span>*</span>
                    </label>
                    <div className="reservation-Date">
                      <div className="pickup-date">
                        <DatePicker
                          selected={selectedPickupDate}
                          onChange={(date) => setSelectedPickupDate(date)}
                          showTimeSelect
                          dateFormat="MM/dd/yyyy h:mm aa"
                          className="date-input-area"
                          placeholderText="Select a date and time"
                          showPopperArrow={false}
                        />
                      </div>
                      <div className="date-chat-icon">
                        <CiCalendar
                          onClick={() => handleIconClick(".pickup-date input")}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="pt-3">
                    <label className="form-label">
                      Return Date <span>*</span>
                    </label>
                    <div className="reservation-Date">
                      <div className="return-date">
                        <DatePicker
                          selected={selectedReturnDate}
                          onChange={(returnDate) =>
                            setSelectedReturnDate(returnDate)
                          }
                          showTimeSelect
                          dateFormat="MM/dd/yyyy h:mm aa"
                          className="date-input-area"
                          placeholderText="Select a date and time"
                          showPopperArrow={false}
                        />
                      </div>
                      <div className="date-chat-icon">
                        <CiCalendar
                          onClick={() => handleIconClick(".return-date input")}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 duration-area">
                    <label className="form-label pt-1">Duration</label>
                    <h2>{duration}</h2>
                  </div>
                  <div className="pt-3">
                    <label className="form-label" id="discount">Discount</label>
                    <input
                      type="text"
                      name="discount"
                      id="discount"
                      value={discountValue}
                      onChange={discountHandler}
                      className="form-control "
                    />
                  </div>
                </div>
              </div>

              {/* 2nd section and Vehicle Information  area*/}

              <div className="item-section-reservation">
                <div className="item-section-subtitle">
                  <h2>Vehicle Information</h2>
                </div>
                <div className="item-section-body">
                  <div className="pt-1">
                    <label className="form-label">
                      Vehicle Type <span>*</span>
                    </label>
                    <select
                      className="form-select"
                      aria-label="Default select example"
                      value={selectedMake}
                      onChange={handleMakeChange}
                    >
                      {invoiceData.map((item, index) => (
                        <option
                          className="vehicle-css"
                          key={index}
                          value={item.make}
                        >
                          {item.make}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="pt-3">
                    <label className="form-label">
                      Vehicle <span>*</span>
                    </label>
                    <select
                      className="form-select"
                      aria-label="Default select example"
                    >
                      {invoiceData.map((item, index) => (
                        <option
                          className="vehicle-css"
                          key={index}
                          value={item.model}
                        >
                          {item.model}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-4 col-xxl-4">
              <div className="item-section-reservation">
                <div className="item-section-subtitle">
                  <h2>Customer Information</h2>
                </div>
                <div className="item-section-body">
                  <div className="pt-1">
                    
                    <label className="form-label" for="firstName">First Name<span>*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      name="firstName"
                      id="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="pt-3">
                    <label className="form-label" for="lastName">
                      Last Name <span>*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="lastName"
                      id="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="pt-3">
                    <label className="form-label" for="email">
                      Email <span>*</span>
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="pt-3">
                    <label className="form-label" for="phone">
                      Phone <span>*</span>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="phone"
                      id="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                {/* 2nd section and Vehicle Information  area*/}
                <div className="item-section-reservation">
                  <div className="item-section-subtitle">
                    <h2>Additional Charges</h2>
                  </div>
                  <div className="item-section-body">
                    <div className="pt-1 Additional-Charges-item">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="collisionDamageWaiver"
                          checked={selectedValues.collisionDamageWaiver}
                          onChange={() =>
                            handleCheckboxChange("collisionDamageWaiver", 9.0)
                          }
                        />
                      </div>
                      <label className="form-label mb-0">
                        Collision Damage Waiver
                      </label>
                      <h3 className="ms-2">
                        ${collisionDamageWaiverCharge.toFixed(2)}
                      </h3>
                    </div>
                    <div className="pt-3 d-flex align-items-center">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="liabilityInsurance"
                          checked={selectedValues.liabilityInsurance}
                          onChange={() =>
                            handleCheckboxChange("liabilityInsurance", 15)
                          }
                        />
                      </div>
                      <label className="form-label mb-0">
                        Liability Insurance
                      </label>
                      <h3 className="mb-0 ms-2">
                        ${liabilityInsuranceCharge.toFixed(2)}
                      </h3>
                    </div>
                    <div className="pt-3 d-flex align-items-center">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="rentalText"
                          checked={selectedValues.rentalText}
                          onChange={() =>
                            handleCheckboxChange("rentalText", 11.5)
                          }
                        />
                      </div>
                      <label className="form-label mb-0">Rental Text</label>
                      <h3 className="mb-0 ms-2">
                        ${rentalTextCharge.toFixed(2)}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-4 col-xxl-4">
              <div className="item-section-reservation">
                <div className="item-section-subtitle">
                  <h2>Vehicle Information</h2>
                </div>
                <div className="item-section-table-section">
                  <table className="table custom-table">
                    <thead>
                      <tr>
                        <th>Charge</th>
                        <th>Unite</th>
                        <th>Rate</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Hourly</td>
                        <td>1</td>
                        <td>${hourlyRate}</td>
                        <td>${totalValues.totalCostHourly || 0}</td>
                      </tr>
                      <tr>
                        <td>Daily</td>
                        <td>1</td>
                        <td>${dailyRate}</td>
                        <td>${totalValues.totalCostDaily || 0}</td>
                      </tr>
                      <tr>
                        <td>Weekly</td>
                        <td>1</td>
                        <td>${weeklyRate}</td>
                        <td>${totalValues.totalCostWeekly || 0}</td>
                      </tr>
                      <tr>
                        <td>Collision Damage Waiver</td>
                        <td></td>
                        <td>$9.0</td>
                        <td>$9.0</td>
                      </tr>
                      <tr className="table-total-css">
                        <td>Amount</td>
                        <td></td>
                        <td></td>
                        <td>${totalValues.totalCost || 0}</td>
                      </tr>
                      <tr className="table-total-css">
                        <td>Discount</td>
                        <td></td>
                        <td></td>
                        <td>${totalValues.discountAmount || 0}</td>
                      </tr>
                      <tr className="table-total-css">
                        <td>Total Amount</td>
                        <td></td>
                        <td></td>
                        <td>${totalValues.totalValue || 0}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default App;
