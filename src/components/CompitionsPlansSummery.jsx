import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./CompitionspaymentSummery.css";
import StudentFooter from "./StudentFooter";
import Studentheaderhome from "./Studentheaderhome";
import credit from "../images/credit.svg";
import bank from "../images/bank.svg";
import upi from "../images/UPI.svg";
import "./CompitionspaymentSummery.css";
// Payment method options data
const PAYMENT_METHODS = [
  { id: "card", name: "Credit / Debit Card", icon: credit, selected: true },
  { id: "upi", name: "UPI", icon: upi, selected: false },
  { id: "netbanking", name: "Net Banking", icon: bank, selected: false },
];

// Card brand icons
const CARD_BRANDS = [
  {
    name: "Visa",
    src: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCA0MCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjI0IiByeD0iNCIgZmlsbD0iIzAwNTFBRCIvPgo8cGF0aCBkPSJNMTYuNSA3SDIzLjVWMTdIMTYuNVY3WiIgZmlsbD0iI0ZGQzEwNyIvPgo8cGF0aCBkPSJNMTYuNSA3SDIwVjE3SDE2LjVWN1oiIGZpbGw9IiMwMDUxQUQiLz4KPC9zdmc+Cg==",
  },
  {
    name: "Mastercard",
    src: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCA0MCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjI0IiByeD0iNCIgZmlsbD0iI0VCMjE0MjEiLz4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxMiIgcj0iNiIgZmlsbD0iI0VCMjE0MjEiLz4KPGNpcmNsZSBjeD0iMjQiIGN5PSIxMiIgcj0iNiIgZmlsbD0iI0Y2QzA0MyIvPgo8L3N2Zz4K",
  },
  {
    name: "RuPay",
    src: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCA0MCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjI0IiByeD0iNCIgZmlsbD0iIzAwNzBBNCIvPgo8cGF0aCBkPSJNMjAgN0MxNi42ODYzIDcgMTQgOS42ODYzIDE0IDEzQzE0IDE2LjMxMzcgMTYuNjg2MyAxOSAyMCAxOUMyMy4zMTM3IDE5IDI2IDE2LjMxMzcgMjYgMTNDMjYgOS42ODYzIDIzLjMxMzcgNyAyMCA3WiIgZmlsbD0iI0ZGRkZGRiIvPgo8L3N2Zz4K",
  },
];

const CompitionsPlansSummery = () => {
  const { competitionsid } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { plan } = location.state || {};

  // State management
  const [selectedPayment, setSelectedPayment] = useState("card");
  const [formData, setFormData] = useState({
    nameOnCard: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
  });
  const [errors, setErrors] = useState({});
  const [cardBrand, setCardBrand] = useState("");
  const [competitionOverview, setCompetitionOverview] = useState(null);
  const [competitionRegistration, setCompetitionRegistration] = useState(null);
  const [organiseridCompition, setOrganiseridCompition] = useState(null);

  // Calculate prices
  const planPrice = Number(plan?.price) || 1200;
  const convenienceFee = 0;
  const total = planPrice + convenienceFee;

  // Card number formatting and brand detection
  const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, "");
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const detectCardBrand = (number) => {
    const digits = number.replace(/\D/g, "");
    if (/^4/.test(digits)) return "Visa";
    if (/^5[1-5]/.test(digits)) return "Mastercard";
    if (/^3[47]/.test(digits)) return "Amex";
    return "";
  };

  // Event handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "cardNumber") {
      const formatted = formatCardNumber(value);
      setFormData((prev) => ({ ...prev, cardNumber: formatted }));
      setCardBrand(detectCardBrand(formatted));
    } else if (name === "expiry") {
      let digits = value.replace(/[^\d]/g, "");
      if (digits.length > 4) digits = digits.slice(0, 4);
      let formatted = digits;
      if (digits.length > 2) {
        formatted = digits.slice(0, 2) + " / " + digits.slice(2);
      }
      setFormData((prev) => ({ ...prev, expiry: formatted }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePaymentMethodSelect = (methodId) => {
    setSelectedPayment(methodId);
  };

  const validatePayment = () => {
    const newErrors = {};
    if (selectedPayment === "card") {
      if (!formData.nameOnCard.trim()) newErrors.nameOnCard = "Name on card is required";
      if (!formData.cardNumber.trim() || formData.cardNumber.replace(/\s/g, "").length < 12)
        newErrors.cardNumber = "Valid card number required";
      if (!formData.expiry.trim() || !/^(0[1-9]|1[0-2])\s*\/\s*\d{2}$/.test(formData.expiry))
        newErrors.expiry = "Expiry must be MM / YY";
      if (!formData.cvc.trim() || formData.cvc.length < 3) newErrors.cvc = "CVC required";
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validatePayment();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    // Simulate payment success
    window.alert("Payment successful! Registration complete.");
    navigate(`/Competitionsdetail/${competitionsid}`);
  };

  

  const fetchCompetitionData = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/competitions/getoverview/${competitionsid}`
      );
      const result = await response.json();
      setCompetitionOverview(result.data);
    } catch (error) {
      console.error("Error fetching competition overview:", error);
    }
  };
  const fetchRegisterCompetitionData = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/competitions/registration/${competitionsid}`
      );
      const result = await response.json();
      setCompetitionRegistration(result.data);
    } catch (error) {
      console.error("Error fetching competition registration:", error);
    }
  };



  const getcompitionbyid = ()=>{
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow"
      };
      
      fetch(`http://localhost:3001/api/competitions/getAllCompetitionsId?competitionsid=${competitionsid}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          setOrganiseridCompition(result.data.organizerId);
        })
        .catch((error) => console.error(error));
    } catch (error) {
      console.error(error);
    }
  }

const [orgniseridname, setOrgniseridname] = useState(null);

  const fetchOrganizerName = async () => {
    console.log(organiseridCompition, "organiseridCompitionfetchOrganizerName");
    try {
      const response = await fetch(`http://localhost:3001/api/competitions/getorganizer/${organiseridCompition}/${competitionsid}`, {
        method: "GET",
        redirect: "follow"
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Organizer API Response:", result);
        setOrgniseridname(result.data.name);
        
      }
    } catch (error) {
      console.error("Error fetching organizer name:", error);
    } finally {
      setOrganizerLoading(false);
    }
  };

  useEffect(() => {
    getcompitionbyid();
    fetchOrganizerName();
  }, [organiseridCompition]);

  useEffect(() => {
    fetchCompetitionData();
    fetchRegisterCompetitionData();
  }, [competitionsid]);


  return (
    <>
      <Studentheaderhome />
      <div>
        <section className="payment-section-container">
          <div className="payment-left-half">
            <div className="payment-heading-container">
              <div className="payment-placeholder-div"></div>
              <div className="payment-heading-text">
                <h1>{competitionOverview?.name || "Competition Name"}</h1>
                <h2>{orgniseridname || "N/A"}</h2>
              </div>
            </div>

            <div className="payment-plan-summary">
              <h2>Plan Summary</h2>
              <div className="payment-plan-details">
                <div className="payment-detail-row">
                  <p>{plan?.name || "Advanced Prep"}</p>
                  <p>INR {planPrice.toFixed(2)}</p>
                </div>
                <p className="payment-description">
                  {plan?.description || "Registration + Prep + Past Year Question Papers"}
                </p>
                <div className="payment-detail-row">
                  <p>Convenience Fee</p>
                  <p>INR {convenienceFee.toFixed(2)}</p>
                </div>
              </div>
              <div className="payment-total-row payment-detail-row">
                <p>Overall Total</p>
                <p>INR {total.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="payment-right-half">
            <div className="payment-sidebar">
              <h3>Pay with</h3>
              {PAYMENT_METHODS.map((method) => (
                <div
                  key={method.id}
                  className={`payment-option ${selectedPayment === method.id ? "selected" : ""}`}
                  onClick={() => handlePaymentMethodSelect(method.id)}
                >
                  <img src={method.icon} alt={method.name} className="payment-icon" />
                  <p>{method.name}</p>
                </div>
              ))}
            </div>

            <div className="payment-main-content">
              {selectedPayment === "card" && (
                <form onSubmit={handleSubmit}>
                  <label htmlFor="nameOnCard">Name on Card</label>
                  <input
                    type="text"
                    id="nameOnCard"
                    name="nameOnCard"
                    value={formData.nameOnCard}
                    onChange={handleInputChange}
                    placeholder="Name"
                  />
                  {errors.nameOnCard && <p className="payment-error">{errors.nameOnCard}</p>}

                  <label htmlFor="cardNumber" className="payment-mt-3">
                    Card Number
                  </label>
                  <div className="payment-card-input-container">
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 1234 1234 1234"
                      maxLength="19"
                    />
                    {cardBrand && (
                      <img
                        src={CARD_BRANDS.find((brand) => brand.name === cardBrand)?.src}
                        alt={cardBrand}
                        className="payment-card-brand-icon"
                      />
                    )}
                  </div>
                  {errors.cardNumber && <p className="payment-error">{errors.cardNumber}</p>}

                  <div className="payment-input-row">
                    <div>
                      <label htmlFor="expiry">Expiry</label>
                      <input
                        type="text"
                        id="expiry"
                        name="expiry"
                        value={formData.expiry}
                        onChange={handleInputChange}
                        placeholder="MM / YY"
                        maxLength="7"
                      />
                      {errors.expiry && <p className="payment-error">{errors.expiry}</p>}
                    </div>
                    <div>
                      <label htmlFor="cvc">CVC</label>
                      <input
                        type="text"
                        id="cvc"
                        name="cvc"
                        value={formData.cvc}
                        onChange={handleInputChange}
                        placeholder="CVC"
                        maxLength="4"
                      />
                      {errors.cvc && <p className="payment-error">{errors.cvc}</p>}
                    </div>
                  </div>

                  <button type="submit">Make Payment</button>
                </form>
              )}
              {selectedPayment === "upi" && (
                <div>
                  <p>Please enter your UPI ID to proceed with payment.</p>
                  {/* Add UPI payment form or logic here */}
                </div>
              )}
              {selectedPayment === "netbanking" && (
                <div>
                  <p>Please select your bank to proceed with net banking.</p>
                  {/* Add net banking payment form or logic here */}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
      <StudentFooter />
    </>
  );
};

export default CompitionsPlansSummery;