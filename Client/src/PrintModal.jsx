import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const PrintModal = ({
  isOpen,
  onClose,
  data,
  reservation,
  clientInfo,
  totalInfo,
}) => {
  const bodyRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => bodyRef.current,
  });

  const handleDownload = async () => {
    const input = bodyRef.current;
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: [input.clientWidth, input.clientHeight],
    });
    pdf.addImage(imgData, "PNG", 0, 0, input.clientWidth, input.clientHeight);
    pdf.save("invoice.pdf");
  };

  if (!isOpen) {
    return null;
  }

  const formatDate = (date) => {
    if (!date) return "";
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return new Date(date).toLocaleString("en-US", options);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <div className="modal-header">
          <h2>Print / Download Invoice</h2>
          <button onClick={handlePrint}>Print</button>
          <button onClick={handleDownload}>Download PDF</button>
        </div>
        <div className="modal-body" ref={bodyRef}>
          <div className="row">
            <div className="col-md-6">
              <div className="row">
                <div className="col-md-6 image-section-area-cart">
                  <img src={data.imageURL} alt="Car" />
                  <div className="pt-4">
                    <h3>Renter Info</h3>
                    <p>
                      {clientInfo.firstName} {clientInfo.lastName}
                    </p>
                    <p>{clientInfo.email}</p>
                    <p>{clientInfo.phone}</p>
                  </div>
                </div>
                <div className="col-md-6 time-schedule-section">
                  <p>
                    <strong>Car Name:</strong> {data.make}
                  </p>
                  <p>
                    <strong>Car Model:</strong> {data.model}
                  </p>
                  <p>
                    <strong>Car Type:</strong> {data.type}
                  </p>
                  <div className="schedule">
                    <p>Monday 9:00am - 6:00pm</p>
                    <p>Tuesday 9:00am - 6:00pm</p>
                    <p>Wed-day 9:00am - 6:00pm</p>
                    <p>Thursday 9:00am - 6:00pm</p>
                    <p>Friday 9:00am - 6:00pm</p>
                    <p>Saturday 9:00am - 6:00pm</p>
                  </div>
                </div>
              </div>
              <div className="popup-unite-area">
                <h2>Additional Authorized Driver(s)</h2>
                <h2>Unit Details</h2>
                <p>Unit: Ipsum is simply dummy</p>
                <p>Lorem Ipsum is simply dummy</p>
              </div>
              <div className="popup-bling-area">
                <p>Bill To</p>
                <p>Payment type: Unpaid</p>
                <p>Auth: $0.00</p>
              </div>
              <div className="popup-rafael-area">
                <p>
                  Rafael:
                  <br />
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever since the 1500s, when an unknown
                </p>
                <div className="popup-rafael-area-button mb-2">
                  <h3>Accept</h3> <h3>Reject</h3>
                </div>
                <p>
                  Lorem Ipsum is simply dummy text of the printing and standard
              
                </p>
              </div>
            </div>
            <div className="col-md-6 reservation-section">
              <h2>Reservation</h2>
              <p>Reservation ID: {reservation.reservationID}</p>
              <p>
                Pickup Date:
                {formatDate(reservation.selectedPickupDate)}
              </p>
              <p>
                Return Date:
                {formatDate(reservation.selectedReturnDate)}
              </p>
              <div className="item-section-reservation">
                <div className="item-section-table-section popup-section-table">
                  <h2>Vehicle Information</h2>
                  <table className="table custom-table">
                    <thead>
                      <tr>
                        <th>Charge</th>
                        <th>Unit</th>
                        <th>Rate</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Hourly</td>
                        <td>1</td>
                        <td>${data.rates.hourly}</td>
                        <td>${totalInfo.totalCostHourly}</td>
                      </tr>
                      <tr>
                        <td>Daily</td>
                        <td>1</td>
                        <td>${data.rates.daily}</td>
                        <td>${totalInfo.totalCostDaily}</td>
                      </tr>
                      <tr>
                        <td>Weekly</td>
                        <td>1</td>
                        <td>${data.rates.weekly}</td>
                        <td>${totalInfo.totalCostWeekly}</td>
                      </tr>
                      <tr>
                        <td>Collision Damage Waiver</td>
                        <td></td>
                        <td>$9.0</td>
                        <td>$9.0</td>
                      </tr>
                      <tr className="table-total-css">
                        <td>Total Amount</td>
                        <td></td>
                        <td></td>
                        <td>${totalInfo.totalCost}</td>
                      </tr>
                      <tr className="table-total-css">
                        <td>Discount</td>
                        <td></td>
                        <td></td>
                        <td>-${totalInfo.discountAmount}</td>
                      </tr>
                      <tr className="table-total-css">
                        <td>Total Paid</td>
                        <td></td>
                        <td></td>
                        <td>${totalInfo.totalValue}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="text-info-invoice ">
                <h5>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever since the 1500s, when an unknown
                  printer took a galley of type and scrambled it to make a type
                </h5>
              </div>
              <div className="text-info-invoice ">
                <p>Renter Signature</p>
                <span>---------------------------</span>
                <p className="signature">Additional Driver 1</p>
                <span>---------------------------</span>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer"></div>
      </div>
    </div>
  );
};

export default PrintModal;

