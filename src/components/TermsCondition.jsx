import React, { useState } from 'react';
import Studentheaderhome from './Studentheaderhome';
import StudentFooter from './StudentFooter';

const TermsCondition = () => {
  const [terms, setTerms] = useState("student");

  // CSS styles for smaller headings
  const headingStyle = {
    fontSize: '18px',
    marginBottom: '10px',
    marginTop: '20px',
    fontWeight: '600'
  };

  return (
    <div>
      <Studentheaderhome />

      <div>
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
        <div className="data-tabs">
          <div className="student-section">
            <h1>Terms and Condition</h1>
          
            <div style={{ display: terms === "student" ? "block" : "none" }}>
              {terms === "student" && (
                <div className="terms-content">
                  <h2>Introduction</h2>
                  <p>We are Prodigiedu Services Private Limited, doing business as Prodigi ('Company', 'we', 'us', or 'our'), a company registered in India at A-401, Oberoi Park View, Thakur Village, Kandivali (East), Mumbai, Maharashtra - 400101.</p>
                  
                  <p>We operate the website http://www.prodigiedu.com (the 'Site'), as well as any other related products and Platform that refer or link to these legal terms (the 'Legal Terms') (collectively, the 'Platform').</p>
                  
                  <p>We provide Platform-as-a-Service (PaaS) to schools, students and competition organisers for end-to-end competition management.</p>
                  
                  <p>You can contact us by phone at +91 8828313338, email at support@prodigiedu.com, or by mail to A-401, Oberoi Park View, Thakur Village, Kandivali (East), Mumbai, Maharashtra 400101, India.</p>
                  
                  <p>These Legal Terms constitute a legally binding agreement made between you, whether personally or on behalf of an entity ('you'), and Prodigiedu Services Private Limited, concerning your access to and use of the Platform. You agree that by accessing the Platform, you have read, understood, and agreed to be bound by all of these Legal Terms. IF YOU DO NOT AGREE WITH ALL OF THESE LEGAL TERMS, THEN YOU ARE EXPRESSLY PROHIBITED FROM USING THE Platform AND YOU MUST DISCONTINUE USE IMMEDIATELY.</p>
                  
                  <h2>TABLE OF CONTENTS</h2>
                  <ol>
                    <li>OUR PLATFORM</li>
                    <li>INTELLECTUAL PROPERTY RIGHTS</li>
                    <li>USER REPRESENTATIONS</li>
                    <li>USER REGISTRATION</li>
                    <li>PURCHASES AND PAYMENT</li>
                    <li>EDUCATIONAL PARTICIPANTS</li>
                    <li>USER CONTENT</li>
                    <li>PROHIBITED ACTIVITIES</li>
                    <li>PLATFORM SECURITY</li>
                    <li>LIMITED LICENSE</li>
                    <li>GUIDELINES FOR REVIEWS</li>
                    <li>SOCIAL MEDIA</li>
                    <li>THIRD-PARTY WEBSITES AND CONTENT</li>
                    <li>PLATFORM MANAGEMENT</li>
                    <li>PRIVACY POLICY</li>
                    <li>COPYRIGHT INFRINGEMENTS</li>
                    <li>TERM AND TERMINATION</li>
                    <li>MODIFICATIONS AND INTERRUPTIONS</li>
                    <li>GOVERNING LAW</li>
                    <li>CORRECTIONS</li>
                    <li>DISCLAIMER</li>
                    <li>LIMITATIONS OF LIABILITY</li>
                    <li>INDEMNIFICATION</li>
                    <li>ELECTRONIC COMMUNICATIONS, TRANSACTIONS, AND SIGNATURES</li>
                    <li>SMS TEXT MESSAGING</li>
                    <li>CALIFORNIA USERS AND RESIDENTS</li>
                    <li>MISCELLANEOUS</li>
                    <li>CONTACT US</li>
                  </ol>

                  <h2>1. OUR PLATFORM</h2>
                  <p>The information provided when using the Platform is not intended for distribution to or use by any person or entity in any jurisdiction or country where such distribution or use would be contrary to law or regulation or which would subject us to any registration requirement within such jurisdiction or country.</p>

                  <h2>2. INTELLECTUAL PROPERTY RIGHTS</h2>
                  <p>We are the owner or the licensee of all intellectual property rights in our Platform, including all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics in the Platform (collectively, the 'Content'), as well as the trademarks, service marks, and logos contained therein (the 'Marks').</p>

                  <h2>3. USER REPRESENTATIONS</h2>
                  <p>By using the Platform, you represent and warrant that: (1) all registration information you submit will be true, accurate, current, and complete; (2) you will maintain the accuracy of such information and promptly update such registration information as necessary; (3) you have the legal capacity and you agree to comply with these Legal Terms.</p>

                  <h2>4. USER REGISTRATION</h2>
                  <p>In order to participate in most Platform activities and to enroll in a Competition, you will need to register for a personal account ("User Account") by undergoing a two-step verification process to verify your login credentials.</p>

                  <h2>5. PURCHASES AND PAYMENT</h2>
                  <p>We accept the following forms of payment: Visa, Mastercard, UPI, Net Banking. You agree to provide current, complete, and accurate purchase and account information for all purchases made via the Platform.</p>

                  <h2>6. EDUCATIONAL PARTICIPANTS</h2>
                  <p>Prodigi is NOT a university, tutor or competition organiser, but a competition service provider, offering a Platform in consultation with Indian and International schools, educational institutions, competition organiser, governmental authorities, NGOs, corporates, etc.</p>

                  <h2>7. USER CONTENT</h2>
                  <p>The Platform may allow you to upload forum posts, chat with other users and Prodigi's counsellors, user discussions, profile pages, and other content and media for social interaction.</p>

                  <h2>8. PROHIBITED ACTIVITIES</h2>
                  <p>You may not access or use the Platform for any purpose other than that for which we make the Platform available. The Platform may not be used in connection with any commercial endeavours except those that are specifically endorsed or approved by us.</p>

                  <h2>9. PLATFORM SECURITY</h2>
                  <p>You are prohibited from violating or attempting to violate the security of the Platform or any other associate Platform of Prodigi.</p>

                  <h2>10. LIMITED LICENSE</h2>
                  <p>The Platform on the Platform are licensed, not sold. In consideration for your agreement to these Terms, Prodigi grants you a personal, non-exclusive, non-transferable, revocable license to access and use the Platform and Competition resources.</p>

                  <h2>11. GUIDELINES FOR REVIEWS</h2>
                  <p>We may provide you areas on the Platform to leave reviews or ratings. When posting a review, you must comply with the following criteria: (1) you should have firsthand experience with the person/entity being reviewed; (2) your reviews should not contain offensive profanity, or abusive, racist, offensive, or hateful language.</p>

                  <h2>12. SOCIAL MEDIA</h2>
                  <p>As part of the functionality of the Platform, you may link your account with online accounts you have with third-party service providers (each such account, a 'Third-Party Account').</p>

                  <h2>13. THIRD-PARTY WEBSITES AND CONTENT</h2>
                  <p>The Platform may contain links to pages on other websites ("Linked Sites"), and those Linked Sites may contain Content or offer products and/or services for sale.</p>

                  <h2>14. PLATFORM MANAGEMENT</h2>
                  <p>We reserve the right, but not the obligation, to: (1) monitor the Platform for violations of these Legal Terms; (2) take appropriate legal action against anyone who, in our sole discretion, violates the law or these Legal Terms.</p>

                  <h2>15. PRIVACY POLICY</h2>
                  <p>We care about data privacy and security. Please review our Privacy Policy: http://www.prodigiedu.com/privacypolicy. By using the Platform, you agree to be bound by our Privacy Policy, which is incorporated into these Legal Terms.</p>

                  <h2>16. COPYRIGHT INFRINGEMENTS</h2>
                  <p>We respect the intellectual property rights of others. If you believe that any material available on or through the Platform infringes upon any copyright you own or control, please immediately notify us using the contact information provided below.</p>

                  <h2>17. TERM AND TERMINATION</h2>
                  <p>These Legal Terms shall remain in full force and effect while you use the Platform. Without limiting any other provision of these legal terms, we reserve the right to, in our sole discretion and without notice or liability, deny access to and use of the Platform.</p>

                  <h2>18. MODIFICATIONS AND INTERRUPTIONS</h2>
                  <p>We reserve the right to change, modify, or remove the contents of the Platform at any time or for any reason at our sole discretion without notice.</p>

                  <h2>19. GOVERNING LAW</h2>
                  <p>These Legal Terms shall be governed by and defined following the laws of India. Prodigiedu Services Private Limited and yourself irrevocably consent that the courts of India shall have exclusive jurisdiction to resolve any dispute which may arise in connection with these Legal Terms.</p>

                  <h2>20. CORRECTIONS</h2>
                  <p>There may be information on the Platform that contains typographical errors, inaccuracies, or omissions, including descriptions, pricing, availability, and various other information.</p>

                  <h2>21. DISCLAIMER</h2>
                  <p>The Platform are provided on an as-is and as-available basis. You agree that your use of the Platform will be at your sole risk. To the fullest extent permitted by law, we disclaim all warranties, express or implied, in connection with the Platform and your use thereof.</p>

                  <h2>22. LIMITATIONS OF LIABILITY</h2>
                  <p>In no event will we or our directors, employees, agents, educational participants or vendors be liable to you or any third party for any direct, indirect, consequential, exemplary, incidental, special, or punitive damages.</p>

                  <h2>23. INDEMNIFICATION</h2>
                  <p>You agree to defend, indemnify, and hold us harmless, including our subsidiaries, affiliates, and all of our officers, agents, educational partners, and employees, from and against any loss, damage, liability, claim, or demand.</p>

                  <h2>24. ELECTRONIC COMMUNICATIONS, TRANSACTIONS, AND SIGNATURES</h2>
                  <p>Visiting the Platform, sending us emails, and completing online forms constitute electronic communications. You consent to receive electronic communications, and you agree that all agreements, notices, disclosures, and other communications we provide to you electronically satisfy any legal requirement that such communication be in writing.</p>

                  <h2>25. SMS TEXT MESSAGING</h2>
                  <p>By opting into any Prodigi text messaging program, you expressly consent to receive text messages (SMS) to your mobile number. Prodigi text messages may include: order updates, account alerts, special offers and appointment reminders.</p>

                  <h2>26. CALIFORNIA USERS AND RESIDENTS</h2>
                  <p>If any complaint with us is not satisfactorily resolved, you can contact the Complaint Assistance Unit of the Division of Consumer Platform of the California Department of Consumer Affairs.</p>

                  <h2>27. MISCELLANEOUS</h2>
                  <p>By accepting the Terms through your use of the Platform, you certify that you are 18 years of age or older. If you are under the age of 18 or under the legal age in your jurisdiction to enter into a binding contract, you may use the Platform only under the supervision of a parent or legal guardian who agrees to be bound by the Terms.</p>

                  <h2>28. CONTACT US</h2>
                  <p>In compliance of the Information Technology Act, 2000 and rules made thereunder and also in compliance of the Consumer Protection (E-Commerce) Rules, 2020 the name and contact details of the Grievance Officer are herein as under:</p>
                  <p><strong>Grievance Officer:</strong> Saumyata Khandelwal</p>
                  <p><strong>Email ID:</strong> support@prodigiedu.com</p>
                  <p><strong>Phone:</strong> +91 8828313338</p>
                  <p><strong>Address:</strong> Prodigiedu Services Private Limited<br/>
                  A-401, Oberoi Park View, Thakur Village, Kandivali (East)<br/>
                  Mumbai, Maharashtra 400101, India</p>
                </div>
              )}
            </div>

            <div style={{ display: terms === "school" ? "block" : "none" }}>
              {terms === "school" && (
                <div className="terms-content">
                  <h2>Introduction</h2>
                  <p>We are Prodigiedu Services Private Limited, doing business as Prodigi ('Company', 'we', 'us', or 'our'), a company registered in India at A-401, Oberoi Park View, Thakur Village, Kandivali (East), Mumbai, Maharashtra - 400101.</p>
                  
                  <p>We operate the website http://www.prodigiedu.com (the 'Site'), as well as any other related products and Platform that refer or link to these legal terms (the 'Legal Terms') (collectively, the 'Platform').</p>
                  
                  <p>We provide Platform-as-a-Service (PaaS) to schools, students and competition organisers for end-to-end competition management.</p>
                  
                  <p>You can contact us by phone at +91 8828313338, email at support@prodigiedu.com, or by mail to A-401, Oberoi Park View, Thakur Village, Kandivali (East), Mumbai, Maharashtra 400101, India.</p>
                  
                  <p>These Legal Terms constitute a legally binding agreement made between you, whether personally or on behalf of an entity ('you'), and Prodigiedu Services Private Limited, concerning your access to and use of the Platform. You agree that by accessing the Platform, you have read, understood, and agreed to be bound by all of these Legal Terms. IF YOU DO NOT AGREE WITH ALL OF THESE LEGAL TERMS, THEN YOU ARE EXPRESSLY PROHIBITED FROM USING THE Platform AND YOU MUST DISCONTINUE USE IMMEDIATELY.</p>
                  
                  <h2>TABLE OF CONTENTS</h2>
                  <ol>
                    <li>OUR PLATFORM</li>
                    <li>INTELLECTUAL PROPERTY RIGHTS</li>
                    <li>USER REPRESENTATIONS</li>
                    <li>USER REGISTRATION</li>
                    <li>PURCHASES AND PAYMENT</li>
                    <li>EDUCATIONAL PARTICIPANTS</li>
                    <li>USER CONTENT</li>
                    <li>PROHIBITED ACTIVITIES</li>
                    <li>PLATFORM SECURITY</li>
                    <li>LIMITED LICENSE</li>
                    <li>GUIDELINES FOR REVIEWS</li>
                    <li>SOCIAL MEDIA</li>
                    <li>THIRD-PARTY WEBSITES AND CONTENT</li>
                    <li>PLATFORM MANAGEMENT</li>
                    <li>PRIVACY POLICY</li>
                    <li>COPYRIGHT INFRINGEMENTS</li>
                    <li>TERM AND TERMINATION</li>
                    <li>MODIFICATIONS AND INTERRUPTIONS</li>
                    <li>GOVERNING LAW</li>
                    <li>CORRECTIONS</li>
                    <li>DISCLAIMER</li>
                    <li>LIMITATIONS OF LIABILITY</li>
                    <li>INDEMNIFICATION</li>
                    <li>ELECTRONIC COMMUNICATIONS, TRANSACTIONS, AND SIGNATURES</li>
                    <li>SMS TEXT MESSAGING</li>
                    <li>CALIFORNIA USERS AND RESIDENTS</li>
                    <li>MISCELLANEOUS</li>
                    <li>CONTACT US</li>
                  </ol>

                  <h2>1. OUR PLATFORM</h2>
                  <p>The information provided when using the Platform is not intended for distribution to or use by any person or entity in any jurisdiction or country where such distribution or use would be contrary to law or regulation or which would subject us to any registration requirement within such jurisdiction or country.</p>

                  <h2>2. INTELLECTUAL PROPERTY RIGHTS</h2>
                  <p>We are the owner or the licensee of all intellectual property rights in our Platform, including all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics in the Platform (collectively, the 'Content'), as well as the trademarks, service marks, and logos contained therein (the 'Marks').</p>

                  <h2>3. USER REPRESENTATIONS</h2>
                  <p>By using the Platform, you represent and warrant that: (1) all registration information you submit will be true, accurate, current, and complete; (2) you will maintain the accuracy of such information and promptly update such registration information as necessary; (3) you have the legal capacity and you agree to comply with these Legal Terms.</p>

                  <h2>4. USER REGISTRATION</h2>
                  <p>In order to participate in most Platform activities and to enroll in a Competition, you will need to register for a personal account ("User Account") by undergoing a two-step verification process to verify your login credentials.</p>

                  <h2>5. PURCHASES AND PAYMENT</h2>
                  <p>We accept the following forms of payment: Visa, Mastercard, UPI, Net Banking. You agree to provide current, complete, and accurate purchase and account information for all purchases made via the Platform.</p>

                  <h2>6. EDUCATIONAL PARTICIPANTS</h2>
                  <p>Prodigi is NOT a university, tutor or competition organiser, but a competition service provider, offering a Platform in consultation with Indian and International schools, educational institutions, competition organiser, governmental authorities, NGOs, corporates, etc.</p>

                  <h2>7. USER CONTENT</h2>
                  <p>The Platform may allow you to upload forum posts, chat with other users and Prodigi's counsellors, user discussions, profile pages, and other content and media for social interaction.</p>

                  <h2>8. PROHIBITED ACTIVITIES</h2>
                  <p>You may not access or use the Platform for any purpose other than that for which we make the Platform available. The Platform may not be used in connection with any commercial endeavours except those that are specifically endorsed or approved by us.</p>

                  <h2>9. PLATFORM SECURITY</h2>
                  <p>You are prohibited from violating or attempting to violate the security of the Platform or any other associate Platform of Prodigi.</p>

                  <h2>10. LIMITED LICENSE</h2>
                  <p>The Platform on the Platform are licensed, not sold. In consideration for your agreement to these Terms, Prodigi grants you a personal, non-exclusive, non-transferable, revocable license to access and use the Platform and Competition resources.</p>

                  <h2>11. GUIDELINES FOR REVIEWS</h2>
                  <p>We may provide you areas on the Platform to leave reviews or ratings. When posting a review, you must comply with the following criteria: (1) you should have firsthand experience with the person/entity being reviewed; (2) your reviews should not contain offensive profanity, or abusive, racist, offensive, or hateful language.</p>

                  <h2>12. SOCIAL MEDIA</h2>
                  <p>As part of the functionality of the Platform, you may link your account with online accounts you have with third-party service providers (each such account, a 'Third-Party Account').</p>

                  <h2>13. THIRD-PARTY WEBSITES AND CONTENT</h2>
                  <p>The Platform may contain links to pages on other websites ("Linked Sites"), and those Linked Sites may contain Content or offer products and/or services for sale.</p>

                  <h2>14. PLATFORM MANAGEMENT</h2>
                  <p>We reserve the right, but not the obligation, to: (1) monitor the Platform for violations of these Legal Terms; (2) take appropriate legal action against anyone who, in our sole discretion, violates the law or these Legal Terms.</p>

                  <h2>15. PRIVACY POLICY</h2>
                  <p>We care about data privacy and security. Please review our Privacy Policy: http://www.prodigiedu.com/privacypolicy. By using the Platform, you agree to be bound by our Privacy Policy, which is incorporated into these Legal Terms.</p>

                  <h2>16. COPYRIGHT INFRINGEMENTS</h2>
                  <p>We respect the intellectual property rights of others. If you believe that any material available on or through the Platform infringes upon any copyright you own or control, please immediately notify us using the contact information provided below.</p>

                  <h2>17. TERM AND TERMINATION</h2>
                  <p>These Legal Terms shall remain in full force and effect while you use the Platform. Without limiting any other provision of these legal terms, we reserve the right to, in our sole discretion and without notice or liability, deny access to and use of the Platform.</p>

                  <h2>18. MODIFICATIONS AND INTERRUPTIONS</h2>
                  <p>We reserve the right to change, modify, or remove the contents of the Platform at any time or for any reason at our sole discretion without notice.</p>

                  <h2>19. GOVERNING LAW</h2>
                  <p>These Legal Terms shall be governed by and defined following the laws of India. Prodigiedu Services Private Limited and yourself irrevocably consent that the courts of India shall have exclusive jurisdiction to resolve any dispute which may arise in connection with these Legal Terms.</p>

                  <h2>20. CORRECTIONS</h2>
                  <p>There may be information on the Platform that contains typographical errors, inaccuracies, or omissions, including descriptions, pricing, availability, and various other information.</p>

                  <h2>21. DISCLAIMER</h2>
                  <p>The Platform are provided on an as-is and as-available basis. You agree that your use of the Platform will be at your sole risk. To the fullest extent permitted by law, we disclaim all warranties, express or implied, in connection with the Platform and your use thereof.</p>

                  <h2>22. LIMITATIONS OF LIABILITY</h2>
                  <p>In no event will we or our directors, employees, agents, educational participants or vendors be liable to you or any third party for any direct, indirect, consequential, exemplary, incidental, special, or punitive damages.</p>

                  <h2>23. INDEMNIFICATION</h2>
                  <p>You agree to defend, indemnify, and hold us harmless, including our subsidiaries, affiliates, and all of our officers, agents, educational partners, and employees, from and against any loss, damage, liability, claim, or demand.</p>

                  <h2>24. ELECTRONIC COMMUNICATIONS, TRANSACTIONS, AND SIGNATURES</h2>
                  <p>Visiting the Platform, sending us emails, and completing online forms constitute electronic communications. You consent to receive electronic communications, and you agree that all agreements, notices, disclosures, and other communications we provide to you electronically satisfy any legal requirement that such communication be in writing.</p>

                  <h2>25. SMS TEXT MESSAGING</h2>
                  <p>By opting into any Prodigi text messaging program, you expressly consent to receive text messages (SMS) to your mobile number. Prodigi text messages may include: order updates, account alerts, special offers and appointment reminders.</p>

                  <h2>26. CALIFORNIA USERS AND RESIDENTS</h2>
                  <p>If any complaint with us is not satisfactorily resolved, you can contact the Complaint Assistance Unit of the Division of Consumer Platform of the California Department of Consumer Affairs.</p>

                  <h2>27. MISCELLANEOUS</h2>
                  <p>By accepting the Terms through your use of the Platform, you certify that you are 18 years of age or older. If you are under the age of 18 or under the legal age in your jurisdiction to enter into a binding contract, you may use the Platform only under the supervision of a parent or legal guardian who agrees to be bound by the Terms.</p>

                  <h2>28. CONTACT US</h2>
                  <p>In compliance of the Information Technology Act, 2000 and rules made thereunder and also in compliance of the Consumer Protection (E-Commerce) Rules, 2020 the name and contact details of the Grievance Officer are herein as under:</p>
                  <p><strong>Grievance Officer:</strong> Saumyata Khandelwal</p>
                  <p><strong>Email ID:</strong> support@prodigiedu.com</p>
                  <p><strong>Phone:</strong> +91 8828313338</p>
                  <p><strong>Address:</strong> Prodigiedu Services Private Limited<br/>
                  A-401, Oberoi Park View, Thakur Village, Kandivali (East)<br/>
                  Mumbai, Maharashtra 400101, India</p>
                </div>
              )}
            </div>

            <div style={{ display: terms === "organiser" ? "block" : "none" }}>
              {terms === "organiser" && (
                <div className="terms-content">
                  <h2>Introduction</h2>
                  <p>We are Prodigiedu Services Private Limited, doing business as Prodigi ('Company', 'we', 'us', or 'our'), a company registered in India at A-401, Oberoi Park View, Thakur Village, Kandivali (East), Mumbai, Maharashtra - 400101.</p>
                  
                  <p>We operate the website http://www.prodigiedu.com (the 'Site'), as well as any other related products and Platform that refer or link to these legal terms (the 'Legal Terms') (collectively, the 'Platform').</p>
                  
                  <p>We provide Platform-as-a-Service (PaaS) to schools, students and competition organisers for end-to-end competition management.</p>
                  
                  <p>You can contact us by phone at +91 8828313338, email at support@prodigiedu.com, or by mail to A-401, Oberoi Park View, Thakur Village, Kandivali (East), Mumbai, Maharashtra 400101, India.</p>
                  
                  <p>These Legal Terms constitute a legally binding agreement made between you, whether personally or on behalf of an entity ('you'), and Prodigiedu Services Private Limited, concerning your access to and use of the Platform. You agree that by accessing the Platform, you have read, understood, and agreed to be bound by all of these Legal Terms. IF YOU DO NOT AGREE WITH ALL OF THESE LEGAL TERMS, THEN YOU ARE EXPRESSLY PROHIBITED FROM USING THE Platform AND YOU MUST DISCONTINUE USE IMMEDIATELY.</p>
                  
                  <h2>TABLE OF CONTENTS</h2>
                  <ol>
                    <li>OUR PLATFORM</li>
                    <li>INTELLECTUAL PROPERTY RIGHTS</li>
                    <li>USER REPRESENTATIONS</li>
                    <li>USER REGISTRATION</li>
                    <li>PURCHASES AND PAYMENT</li>
                    <li>EDUCATIONAL PARTICIPANTS</li>
                    <li>USER CONTENT</li>
                    <li>PROHIBITED ACTIVITIES</li>
                    <li>PLATFORM SECURITY</li>
                    <li>LIMITED LICENSE</li>
                    <li>GUIDELINES FOR REVIEWS</li>
                    <li>SOCIAL MEDIA</li>
                    <li>THIRD-PARTY WEBSITES AND CONTENT</li>
                    <li>PLATFORM MANAGEMENT</li>
                    <li>PRIVACY POLICY</li>
                    <li>COPYRIGHT INFRINGEMENTS</li>
                    <li>TERM AND TERMINATION</li>
                    <li>MODIFICATIONS AND INTERRUPTIONS</li>
                    <li>GOVERNING LAW</li>
                    <li>CORRECTIONS</li>
                    <li>DISCLAIMER</li>
                    <li>LIMITATIONS OF LIABILITY</li>
                    <li>INDEMNIFICATION</li>
                    <li>ELECTRONIC COMMUNICATIONS, TRANSACTIONS, AND SIGNATURES</li>
                    <li>SMS TEXT MESSAGING</li>
                    <li>CALIFORNIA USERS AND RESIDENTS</li>
                    <li>MISCELLANEOUS</li>
                    <li>CONTACT US</li>
                  </ol>

                  <h2>1. OUR PLATFORM</h2>
                  <p>The information provided when using the Platform is not intended for distribution to or use by any person or entity in any jurisdiction or country where such distribution or use would be contrary to law or regulation or which would subject us to any registration requirement within such jurisdiction or country.</p>

                  <h2>2. INTELLECTUAL PROPERTY RIGHTS</h2>
                  <p>We are the owner or the licensee of all intellectual property rights in our Platform, including all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics in the Platform (collectively, the 'Content'), as well as the trademarks, service marks, and logos contained therein (the 'Marks').</p>

                  <h2>3. USER REPRESENTATIONS</h2>
                  <p>By using the Platform, you represent and warrant that: (1) all registration information you submit will be true, accurate, current, and complete; (2) you will maintain the accuracy of such information and promptly update such registration information as necessary; (3) you have the legal capacity and you agree to comply with these Legal Terms.</p>

                  <h2>4. USER REGISTRATION</h2>
                  <p>In order to participate in most Platform activities and to enroll in a Competition, you will need to register for a personal account ("User Account") by undergoing a two-step verification process to verify your login credentials.</p>

                  <h2>5. PURCHASES AND PAYMENT</h2>
                  <p>We accept the following forms of payment: Visa, Mastercard, UPI, Net Banking. You agree to provide current, complete, and accurate purchase and account information for all purchases made via the Platform.</p>

                  <h2>6. EDUCATIONAL PARTICIPANTS</h2>
                  <p>Prodigi is NOT a university, tutor or competition organiser, but a competition service provider, offering a Platform in consultation with Indian and International schools, educational institutions, competition organiser, governmental authorities, NGOs, corporates, etc.</p>

                  <h2>7. USER CONTENT</h2>
                  <p>The Platform may allow you to upload forum posts, chat with other users and Prodigi's counsellors, user discussions, profile pages, and other content and media for social interaction.</p>

                  <h2>8. PROHIBITED ACTIVITIES</h2>
                  <p>You may not access or use the Platform for any purpose other than that for which we make the Platform available. The Platform may not be used in connection with any commercial endeavours except those that are specifically endorsed or approved by us.</p>

                  <h2>9. PLATFORM SECURITY</h2>
                  <p>You are prohibited from violating or attempting to violate the security of the Platform or any other associate Platform of Prodigi.</p>

                  <h2>10. LIMITED LICENSE</h2>
                  <p>The Platform on the Platform are licensed, not sold. In consideration for your agreement to these Terms, Prodigi grants you a personal, non-exclusive, non-transferable, revocable license to access and use the Platform and Competition resources.</p>

                  <h2>11. GUIDELINES FOR REVIEWS</h2>
                  <p>We may provide you areas on the Platform to leave reviews or ratings. When posting a review, you must comply with the following criteria: (1) you should have firsthand experience with the person/entity being reviewed; (2) your reviews should not contain offensive profanity, or abusive, racist, offensive, or hateful language.</p>

                  <h2>12. SOCIAL MEDIA</h2>
                  <p>As part of the functionality of the Platform, you may link your account with online accounts you have with third-party service providers (each such account, a 'Third-Party Account').</p>

                  <h2>13. THIRD-PARTY WEBSITES AND CONTENT</h2>
                  <p>The Platform may contain links to pages on other websites ("Linked Sites"), and those Linked Sites may contain Content or offer products and/or services for sale.</p>

                  <h2>14. PLATFORM MANAGEMENT</h2>
                  <p>We reserve the right, but not the obligation, to: (1) monitor the Platform for violations of these Legal Terms; (2) take appropriate legal action against anyone who, in our sole discretion, violates the law or these Legal Terms.</p>

                  <h2>15. PRIVACY POLICY</h2>
                  <p>We care about data privacy and security. Please review our Privacy Policy: http://www.prodigiedu.com/privacypolicy. By using the Platform, you agree to be bound by our Privacy Policy, which is incorporated into these Legal Terms.</p>

                  <h2>16. COPYRIGHT INFRINGEMENTS</h2>
                  <p>We respect the intellectual property rights of others. If you believe that any material available on or through the Platform infringes upon any copyright you own or control, please immediately notify us using the contact information provided below.</p>

                  <h2>17. TERM AND TERMINATION</h2>
                  <p>These Legal Terms shall remain in full force and effect while you use the Platform. Without limiting any other provision of these legal terms, we reserve the right to, in our sole discretion and without notice or liability, deny access to and use of the Platform.</p>

                  <h2>18. MODIFICATIONS AND INTERRUPTIONS</h2>
                  <p>We reserve the right to change, modify, or remove the contents of the Platform at any time or for any reason at our sole discretion without notice.</p>

                  <h2>19. GOVERNING LAW</h2>
                  <p>These Legal Terms shall be governed by and defined following the laws of India. Prodigiedu Services Private Limited and yourself irrevocably consent that the courts of India shall have exclusive jurisdiction to resolve any dispute which may arise in connection with these Legal Terms.</p>

                  <h2>20. CORRECTIONS</h2>
                  <p>There may be information on the Platform that contains typographical errors, inaccuracies, or omissions, including descriptions, pricing, availability, and various other information.</p>

                  <h2>21. DISCLAIMER</h2>
                  <p>The Platform are provided on an as-is and as-available basis. You agree that your use of the Platform will be at your sole risk. To the fullest extent permitted by law, we disclaim all warranties, express or implied, in connection with the Platform and your use thereof.</p>

                  <h2>22. LIMITATIONS OF LIABILITY</h2>
                  <p>In no event will we or our directors, employees, agents, educational participants or vendors be liable to you or any third party for any direct, indirect, consequential, exemplary, incidental, special, or punitive damages.</p>

                  <h2>23. INDEMNIFICATION</h2>
                  <p>You agree to defend, indemnify, and hold us harmless, including our subsidiaries, affiliates, and all of our officers, agents, educational partners, and employees, from and against any loss, damage, liability, claim, or demand.</p>

                  <h2>24. ELECTRONIC COMMUNICATIONS, TRANSACTIONS, AND SIGNATURES</h2>
                  <p>Visiting the Platform, sending us emails, and completing online forms constitute electronic communications. You consent to receive electronic communications, and you agree that all agreements, notices, disclosures, and other communications we provide to you electronically satisfy any legal requirement that such communication be in writing.</p>

                  <h2>25. SMS TEXT MESSAGING</h2>
                  <p>By opting into any Prodigi text messaging program, you expressly consent to receive text messages (SMS) to your mobile number. Prodigi text messages may include: order updates, account alerts, special offers and appointment reminders.</p>

                  <h2>26. CALIFORNIA USERS AND RESIDENTS</h2>
                  <p>If any complaint with us is not satisfactorily resolved, you can contact the Complaint Assistance Unit of the Division of Consumer Platform of the California Department of Consumer Affairs.</p>

                  <h2>27. MISCELLANEOUS</h2>
                  <p>By accepting the Terms through your use of the Platform, you certify that you are 18 years of age or older. If you are under the age of 18 or under the legal age in your jurisdiction to enter into a binding contract, you may use the Platform only under the supervision of a parent or legal guardian who agrees to be bound by the Terms.</p>

                  <h2>28. CONTACT US</h2>
                  <p>In compliance of the Information Technology Act, 2000 and rules made thereunder and also in compliance of the Consumer Protection (E-Commerce) Rules, 2020 the name and contact details of the Grievance Officer are herein as under:</p>
                  <p><strong>Grievance Officer:</strong> Saumyata Khandelwal</p>
                  <p><strong>Email ID:</strong> support@prodigiedu.com</p>
                  <p><strong>Phone:</strong> +91 8828313338</p>
                  <p><strong>Address:</strong> Prodigiedu Services Private Limited<br/>
                  A-401, Oberoi Park View, Thakur Village, Kandivali (East)<br/>
                  Mumbai, Maharashtra 400101, India</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <StudentFooter />
    </div>
  );
};

export default TermsCondition;