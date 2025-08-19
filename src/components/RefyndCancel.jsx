import React, { useState } from 'react'
import Studentheaderhome from './Studentheaderhome'
import StudentFooter from './StudentFooter'

const RefyndCancel = () => {
    const [terms, setTerms] = useState("student");

    const policyContent = {
        student: `Refund & Cancellation Policy

Thank you for choosing Prodigi for registering in competitions. We value your trust and are committed to transparency in our policies. Please read this Refund & Cancellation Policy carefully before completing your registration.

1. No Cancellation or Refund After Registration
Once a student or school has successfully registered and made the payment for a competition through our platform, no cancellation or refund requests will be allowed.

This applies to all payment methods (online banking, credit/debit cards, UPI, wallets, etc.).

2. Event Cancellation or Non-Occurrence
In the unlikely event that a competition is cancelled, postponed, or not conducted by the organiser, the responsibility for issuing refunds lies solely with the respective competition organiser.

Prodigi acts only as a facilitator / marketplace platform and will not be liable to process or bear refunds on behalf of organisers.

Participants will be informed by the organiser in case of such changes, and refund / adjustment decisions will be communicated directly by them.

3. Duplicate Payments
If any participant accidentally makes a duplicate payment, we will verify the transaction(s) and initiate a refund for the duplicate amount within 7–10 working days, after deducting any applicable payment gateway charges.

4. Transaction Failures
In case of payment failures where the amount is debited but not reflected as a successful registration, the payment gateway/bank usually reverses such amounts automatically within 7–10 working days.

If the reversal is not received within this period, participants are requested to contact us at support@prodigiedu.com with transaction details for assistance.

5. Contact Information
For any queries regarding payments, please contact us at:

Prodigi
Email: support@prodigiedu.com
Phone: +91 9251033310
Address: 401, Oberoi Park View, Near Thakur Cinema, Kandivali East, Mumbai - 400101`,

        school: `Refund & Cancellation Policy

Thank you for choosing Prodigi for registering in competitions. We value your trust and are committed to transparency in our policies. Please read this Refund & Cancellation Policy carefully before completing your registration.

1. No Cancellation or Refund After Registration
Once a student or school has successfully registered and made the payment for a competition through our platform, no cancellation or refund requests will be allowed.

This applies to all payment methods (online banking, credit/debit cards, UPI, wallets, etc.).

2. Event Cancellation or Non-Occurrence
In the unlikely event that a competition is cancelled, postponed, or not conducted by the organiser, the responsibility for issuing refunds lies solely with the respective competition organiser.

Prodigi acts only as a facilitator / marketplace platform and will not be liable to process or bear refunds on behalf of organisers.

Participants will be informed by the organiser in case of such changes, and refund / adjustment decisions will be communicated directly by them.

3. Duplicate Payments
If any participant accidentally makes a duplicate payment, we will verify the transaction(s) and initiate a refund for the duplicate amount within 7–10 working days, after deducting any applicable payment gateway charges.

4. Transaction Failures
In case of payment failures where the amount is debited but not reflected as a successful registration, the payment gateway/bank usually reverses such amounts automatically within 7–10 working days.

If the reversal is not received within this period, participants are requested to contact us at support@prodigiedu.com with transaction details for assistance.

5. Contact Information
For any queries regarding payments, please contact us at:

Prodigi
Email: support@prodigiedu.com
Phone: +91 9251033310
Address: 401, Oberoi Park View, Near Thakur Cinema, Kandivali East, Mumbai - 400101`,

        organiser: `Refund & Cancellation Policy

Thank you for choosing Prodigi for registering in competitions. We value your trust and are committed to transparency in our policies. Please read this Refund & Cancellation Policy carefully before completing your registration.

1. No Cancellation or Refund After Registration
Once a student or school has successfully registered and made the payment for a competition through our platform, no cancellation or refund requests will be allowed.

This applies to all payment methods (online banking, credit/debit cards, UPI, wallets, etc.).

2. Event Cancellation or Non-Occurrence
In the unlikely event that a competition is cancelled, postponed, or not conducted by the organiser, the responsibility for issuing refunds lies solely with the respective competition organiser.

Prodigi acts only as a facilitator / marketplace platform and will not be liable to process or bear refunds on behalf of organisers.

Participants will be informed by the organiser in case of such changes, and refund / adjustment decisions will be communicated directly by them.

3. Duplicate Payments
If any participant accidentally makes a duplicate payment, we will verify the transaction(s) and initiate a refund for the duplicate amount within 7–10 working days, after deducting any applicable payment gateway charges.

4. Transaction Failures
In case of payment failures where the amount is debited but not reflected as a successful registration, the payment gateway/bank usually reverses such amounts automatically within 7–10 working days.

If the reversal is not received within this period, participants are requested to contact us at support@prodigiedu.com with transaction details for assistance.

5. Contact Information
For any queries regarding payments, please contact us at:

Prodigi
Email: support@prodigiedu.com
Phone: +91 9251033310
Address: 401, Oberoi Park View, Near Thakur Cinema, Kandivali East, Mumbai - 400101`
    };

    return (
        <div>
            <div>
                <Studentheaderhome />

                <div className="">

                <style>
                        {`
                            .terms-content h2 {
                                font-size: 18px !important;
                                margin-bottom: 10px !important;
                                margin-top: 20px !important;
                                font-weight: 600 !important;
                            }
                            .terms-content h1 {
                                font-size: 24px !important;
                                margin-bottom: 20px !important;
                            }
                            .terms-tabs {
                                display: flex;
                                gap: 10px;
                                margin-bottom: 30px;
                                border-bottom: 2px solid #e5e7eb;
                            }
                            .terms-tab {
                                padding: 12px 24px;
                                cursor: pointer;
                                border-radius: 8px 8px 0 0;
                                background-color: #f3f4f6;
                                color: #6b7280;
                                transition: all 0.3s ease;
                                font-weight: 500;
                            }
                            .terms-tab:hover {
                                background-color: #e5e7eb;
                                color: #374151;
                            }
                            .terms-tab.active {
                                background-color: #3b82f6;
                                color: white;
                            }
                            .policy-content {
                               
                           
                                border-radius: 12px;
                                line-height: 1.6;
                                white-space: pre-line;
                            }
                            .policy-content h1 {
                                color: #1f2937;
                                margin-bottom: 20px;
                                font-size: 28px;
                                font-weight: 700;
                            }
                            .policy-content h2 {
                                color: #374151;
                                margin-top: 25px;
                                margin-bottom: 15px;
                                font-size: 20px;
                                font-weight: 600;
                            }
                            .policy-content p {
                                margin-bottom: 15px;
                                color: #4b5563;
                            }
                        `}
                    </style>
                    <div className="terms shadow-lg p-3 mb-5 bg-body-tertiary rounded">
                        <div
                            className={terms === "student" ? "tab-active" : ""}
                            onClick={() => {
                                setTerms("student");
                            }}
                        >
                            Student
                        </div>
                        <div
                            className={terms === "school" ? "tab-active" : ""}
                            onClick={() => {
                                setTerms("school");
                            }}
                        >
                            School
                        </div>
                        <div
                            className={terms === "organiser" ? "tab-active" : ""}
                            onClick={() => {
                                setTerms("organiser");
                            }}
                        >
                            Organiser
                        </div>
                    </div>

                    <div className="policy-content">
                    <h1>Refund & Cancellation Policy</h1>


                        <div style={{ display: terms === "student" ? "block" : "none" }}>
                            {terms === "student" && (
                                <div className="terms-content">
                                    {policyContent.student}
                                </div>
                            )}
                        </div>

                        <div style={{ display: terms === "school" ? "block" : "none" }}>
                            {terms === "school" && (
                                <div className="terms-content">
                                    {policyContent.school}
                                </div>
                            )}
                        </div>

                        <div style={{ display: terms === "organiser" ? "block" : "none" }}>
                            {terms === "organiser" && (
                                <div className="terms-content">
                                    {policyContent.organiser}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <StudentFooter />
            </div>
        </div>
    )
}

export default RefyndCancel