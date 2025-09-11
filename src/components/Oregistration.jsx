import { useState, useEffect } from "react"
import {
  Input,
  DatePicker,
  Select,
  Button,
  Form,
  Row,
  Col,
  Typography,
  message
} from 'antd';
import {
  PlusOutlined,
  CloseOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useParams, useNavigate } from "react-router-dom";

const { Title } = Typography;
const { TextArea } = Input;

// Student Details options for dropdowns (for future use)
// Note: This array is currently not used but kept for future functionality

export default function Oregistration({ fun, ID }) {
  const { id } = useParams();
  const [plans, setPlans] = useState([]); // Remove default plan
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [stages, setStages] = useState([]); // New state for stages
  const [bankAccounts, setBankAccounts] = useState([]); // Remove default bank account
  const navigate = useNavigate();


  // Use ID from props if available, otherwise use id from params
  const competitionId = ID || id;

  // Form data state
  const [registrationData, setRegistrationData] = useState({
    totalRegistrationFee: '', // Remove default fee
    registrationStartDate: '',
    registrationEndDate: '',
    bankAccount: '', // Remove default bank account
    bankAccountNumber: ''
  });

  // Safely get bank data from localStorage
  const bankDataString = localStorage.getItem("bankAccount");
  const bankData = bankDataString ? JSON.parse(bankDataString) : null;
  // Note: bankId is not currently used in this component


  // Fetch bank accounts by organizer ID
  const fetchBankAccounts = async () => {
    try {
      const userDataString = localStorage.getItem('user_Data');
      if (!userDataString) {
        setBankAccounts([]);
        return;
      }
      
      const userData = JSON.parse(userDataString);
      const organizerId = userData?._id;

      if (!organizerId) {
        setBankAccounts([]);
        return;
      }
      
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      };

      const response = await fetch(
        `https://api.prodigiedu.com/api/competitions/bankaccount/${organizerId}`,
        requestOptions
      );

      if (response.ok) {
        const result = await response.json();
        console.log(result.data,"result.data");
        
        if (result.success && result.data) {
          // Handle both single object and array responses
          let accountsArray = result.data;
          
          // If result.data is not an array, convert it to an array
          if (!Array.isArray(result.data)) {
            accountsArray = [result.data];
          }
          
          // Format the data for Select component
          const formattedAccounts = accountsArray.map(account => ({
            value: account._id,
            label: `Bank Account - ${account.accountNumber}`,
            accountNumber: account.accountNumber,
            color: '#1890ff'
          }));
          console.log('Formatted accounts:', formattedAccounts);
          setBankAccounts(formattedAccounts);
        } else {
          console.log('No valid data in response');
          setBankAccounts([]);
        }
       
      } else {
        console.log("error");
      }
    } catch (error) {
      setBankAccounts([]);
    }
  };

  console.log(bankAccounts,"bankAccounts");

  // Fetch competition data and stages
  const fetchCompetitionData = async () => {
    if (!competitionId) return;

    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      };

      const response = await fetch(
        `https://api.prodigiedu.com/api/competitions/getsyllabus/${competitionId}`,
        requestOptions
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Extract stages from overviewdata
      if (result.overviewdata && Array.isArray(result.overviewdata.stages)) {
        const stagesData = result.overviewdata.stages;
        setStages(stagesData);
      } else {
        console.warn("No stages found in overviewdata");
      }
    } catch (error) {
      console.error("Error fetching competition data:", error);
    }
  };

  // Fetch registration data
  const fetchRegistrationData = async () => {
    
    if (!competitionId) return;

    setFetchLoading(true);
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
      };

      const response = await fetch(`https://api.prodigiedu.com/api/competitions/registration/${competitionId}`, requestOptions);
      
      if (response.ok) {
        const result = await response.json();
        
        if (result.success && result.data) {
          const { registration_type, plans: fetchedPlans } = result.data;
          
          // Update registration data
          if (registration_type) {
            setRegistrationData({
              totalRegistrationFee: registration_type.total_registration_fee || '',
              registrationStartDate: registration_type.registration_start_date || '',
              registrationEndDate: registration_type.registration_end_date || '',
              bankAccount: registration_type.bank_account || '',
              bankAccountNumber: registration_type.bank_account_number || ''
            });
          }
          
          // Update plans data
          if (fetchedPlans && Array.isArray(fetchedPlans)) {
            const formattedPlans = fetchedPlans.map((plan, index) => ({
              id: Date.now() + index,
              name: plan.name || '',
              planFee: plan.plan_fee || '',
              studentLimit: plan.student_limit || '',
              description: plan.description || '',
              included: plan.included || '',
              not_included: plan.not_included || ''
            }));
            setPlans(formattedPlans);
          }
        }
      } else {
        console.log('No existing registration data found');
      }
    } catch (error) {
      console.error('Error fetching registration data:', error);
      // Don't show error message as this might be the first time creating registration
    } finally {
      setFetchLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    if (competitionId) {
      fetchCompetitionData(); // Fetch stages data
      fetchRegistrationData(); // Fetch registration data
      // Don't fetch bank accounts automatically - only when user clicks
      // fetchBankAccounts(); // Removed automatic fetch
    } else {
      console.log('⚠️ No competition ID available, skipping data fetch');
    }
  }, [competitionId]);

  const addPlan = () => {
    const newPlan = {
      id: Date.now(),
      name: '',
      planFee: '',
      studentLimit: '',
      description: '',
      included: '• ',
      notIncluded: '• '
    };
    setPlans([...plans, newPlan]);
  };

  const removePlan = (planId) => {
    const updatedPlans = plans.filter(plan => plan.id !== planId);
    setPlans(updatedPlans);
  };

  const updatePlan = (planId, field, value) => {
    
    // Auto-format bullet points for included and notIncluded fields
    let formattedValue = value;
    if ((field === 'included' || field === 'notIncluded') && value) {
      // Split by lines and ensure each line starts with a bullet point
      const lines = value.split('\n');
      formattedValue = lines.map(line => {
        const trimmedLine = line.trim();
        if (trimmedLine && !trimmedLine.startsWith('•') && !trimmedLine.startsWith('-')) {
          return `• ${trimmedLine}`;
        }
        return trimmedLine;
      }).join('\n');
      
      if (formattedValue !== value) {
      }
    }
    
    setPlans(plans.map(plan =>
      plan.id === planId ? { ...plan, [field]: formattedValue } : plan
    ));
    
  };

  const updateRegistrationData = (field, value) => {
    setRegistrationData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
  
    
    try {
      // Validate required fields
      console.log('Validating registration data:', registrationData);
      
      if (!registrationData.totalRegistrationFee || registrationData.totalRegistrationFee.trim() === '') {
        message.error('Please enter total registration fee');
        return;
      }

      if (!registrationData.registrationStartDate) {
        message.error('Please select registration start date');
        return;
      }

      if (!registrationData.registrationEndDate) {
        message.error('Please select registration end date');
        return;
      }

      if (!registrationData.bankAccount) {
        message.error('Please select a bank account');
        return;
      }

      // Validate custom bank account number if custom account is selected
      if ((registrationData.bankAccount === 'custom' || registrationData.bankAccount?.startsWith('custom_')) && !registrationData.bankAccountNumber) {
        message.error('Please enter bank account number');
        return;
      }

      // Plans are now optional - no validation required
      // if (plans.length === 0) {
      //   message.error('Please add at least one plan');
      //   return;
      // }

      // Validate plans only if they exist
      if (plans.length > 0) {
        for (let i = 0; i < plans.length; i++) {
          const plan = plans[i];
          if (!plan.name || !plan.planFee || !plan.description) {
            message.error(`Please fill all required fields for Plan ${i + 1}`);
            return;
          }
          
          // Check if included and notIncluded have content beyond just bullet points
          if (!plan.included || plan.included.trim() === '•' || plan.included.trim() === '') {
            message.error(`Please add content for "What Is Included?" in Plan ${i + 1}`);
            return;
          }
          
          if (!plan.notIncluded || plan.notIncluded.trim() === '•' || plan.notIncluded.trim() === '') {
            message.error(`Please add content for "What Is Not Included?" in Plan ${i + 1}`);
            return;
          }
        }
      }

      setLoading(true);

      // Prepare API data structure
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const apiData = {
        registration_type: {
          total_registration_fee: parseFloat(registrationData.totalRegistrationFee),
          registration_start_date: registrationData.registrationStartDate,
          registration_end_date: registrationData.registrationEndDate,
          bank_account: registrationData.bankAccount,
          bank_account_number: registrationData.bankAccountNumber || ''
        },
        plans: plans.length > 0 ? plans.map(plan => ({
          name: plan.name,
          plan_fee: parseFloat(plan.planFee),
          student_limit: plan.studentLimit ? parseInt(plan.studentLimit) : null,
          description: plan.description,
          included: plan.included,
          not_included: plan.notIncluded
        })) : []
      };
      
      console.log('Sending API Data:', apiData);
      const raw = JSON.stringify(apiData);

      // Note: Backend handles both create and update with the same POST endpoint
      
      const requestOptions = {
        method: "POST", // Backend uses POST for both create and update
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      }; 
      
      const response = await fetch(`https://api.prodigiedu.com/api/competitions/registration/${competitionId}`, requestOptions);
      
      if (response.ok) {
        let result;
        try {
          result = await response.json();
        } catch (jsonError) {
          result = await response.text();
        }
        
        console.log('Registration API Response:', result);
        message.success('Registration data saved successfully!');

        // Wait a moment for the message to be visible
        setTimeout(() => {
          // Call parent function if provided
          if (fun) {
            fun(5, competitionId);
          } else {
            // If no parent function, navigate manually to next step
            try {
              navigate(`/competition/${competitionId}/overview`);
            } catch (navError) {
              navigate(`/overview/${competitionId}`);
            }
          }
        }, 1000);
      } else {
        const errorText = await response.text();
        console.error('Registration API Error:', {
          status: response.status,
          statusText: response.statusText,
          response: errorText
        });
        throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`);
      }

    } catch (error) {
      console.error('Registration Error Details:', error);
      message.error(`Failed to save registration data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '16px', color: '#666' }}>Loading registration data...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      height: '100vh',
      overflow: 'hidden',
      backgroundColor: '#ffffff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      width: '100%'
    }}>
      <div style={{
        height: '100%',
        overflowY: 'auto',
        overflowX: 'hidden',
        padding: '40px',
        scrollbarWidth: 'thin',
        scrollbarColor: '#c1c1c1 #f1f1f1'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <Title level={2} style={{
            marginBottom: '40px',
            fontWeight: '600',
            color: '#000000',
            fontSize: '32px'
          }}>
            Registration
          </Title>

          <Form form={form} layout="vertical">
            {/* Total Registration Fee */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '16px',
                fontWeight: '500',
                color: '#000000'
              }}>
                Total Registration Fee<span style={{ color: '#ff4d4f' }}>*</span>
              </label>
              <div className="registration-fee-input">
                <Input
                  placeholder="Enter"
                  addonBefore={<span style={{ color: '#000000' }}>₹</span>}
                  value={registrationData.totalRegistrationFee}
                  onChange={(e) => {
                    // Only allow numbers and decimal point
                    const value = e.target.value;
                    if (value === '' || /^\d*\.?\d*$/.test(value)) {
                      updateRegistrationData('totalRegistrationFee', value);
                    }
                  }}
                  onKeyPress={(e) => {
                    // Prevent non-numeric characters except decimal point
                    if (!/[\d.]/.test(e.key)) {
                      e.preventDefault();
                    }
                    // Prevent multiple decimal points
                    if (e.key === '.' && e.target.value.includes('.')) {
                      e.preventDefault();
                    }
                  }}
                  style={{
                    height: '48px',
                    fontSize: '16px',
                    borderColor: '#d9d9d9',
                    borderRadius: '6px',
                    maxWidth: '400px'
                  }}
                />
              </div>
            </div>

            {/* Registrations Open */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '16px',
                fontWeight: '500',
                color: '#000000'
              }}>
                Registrations Open<span style={{ color: '#ff4d4f' }}>*</span>
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }} className="form-registration">
                <DatePicker
                  value={registrationData.registrationStartDate ? dayjs(registrationData.registrationStartDate) : null}
                  onChange={(date, dateString) => updateRegistrationData('registrationStartDate', dateString || '')}
                  format="DD MMM YYYY"
                  placeholder="Select start date"
                  allowClear
                  style={{
                    height: '48px',
                    fontSize: '16px',
                    borderRadius: '6px',
                    width: '200px',
                    backgroundColor: '#ffffff'
                  }}
                />
                <span style={{ fontSize: '16px', color: '#000000' }}>to</span>
                <DatePicker
                  value={registrationData.registrationEndDate ? dayjs(registrationData.registrationEndDate) : null}
                  onChange={(date, dateString) => updateRegistrationData('registrationEndDate', dateString || '')}
                  format="DD MMM YYYY"
                  placeholder="Select end date"
                  allowClear
                  style={{
                    height: '48px',
                    fontSize: '16px',
                    borderColor: '#d9d9d9',
                    borderRadius: '6px',
                    width: '200px',
                    backgroundColor: '#ffffff'
                  }}
                />
              </div>
            </div>

            {/* Bank Account */}
            <div style={{ marginBottom: '40px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '16px',
                fontWeight: '500',
                color: '#000000'
              }}>
                Bank Account<span style={{ color: '#ff4d4f' }}>*</span>
              </label>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
                <Select
                  value={registrationData.bankAccount}
                  onChange={(value) => {
                    updateRegistrationData('bankAccount', value);
                  }}
                  style={{
                    width: '400px',
                    height: '48px'
                  }}
                  dropdownStyle={{ borderRadius: '6px' }}
                  placeholder={bankAccounts.length === 0 ? "Click to load bank accounts" : "Select bank account"}
                  onClick={() => {
                    if (bankAccounts.length === 0) {
                      fetchBankAccounts();
                      message.info('Loading bank account options...');
                    }
                  }}
                >
                  {bankAccounts.map(account => (
                    <Select.Option key={account.value} value={account.value}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ 
                          width: '12px', 
                          height: '12px', 
                          borderRadius: '50%', 
                          backgroundColor: account.color 
                        }} />
                        <span>{account.label}</span>
                        <span style={{ color: '#666', fontSize: '12px' }}>({account.accountNumber})</span>
                      </div>
                    </Select.Option>
                  ))}
                </Select>
                
                <Button
                onClick={()=>{
                  navigate('/BankAcount', {state: {competitionId: competitionId}})
                  
                }}
                  type="primary"
                  style={{
                    backgroundColor: '#52c41a',
                    borderColor: '#52c41a',
                    height: '48px',
                    fontSize: '16px',
                    fontWeight: '500',
                    borderRadius: '6px',
                    paddingLeft: '24px',
                    paddingRight: '24px'
                  }}
                >
                  Add Bank Account
                </Button>
              
              </div>
              
              {/* Custom Bank Account Number Input - Only show when custom account is selected */}
              {(registrationData.bankAccount === 'custom' || registrationData.bankAccount?.startsWith('custom_')) && (
                <div style={{ marginTop: '16px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '16px',
                    fontWeight: '500',
                    color: '#000000'
                  }}>
                    Bank Account Number<span style={{ color: '#ff4d4f' }}>*</span>
                  </label>
                  <Input
                    placeholder="Enter bank account number"
                    value={registrationData.bankAccountNumber}
                    onChange={(e) => updateRegistrationData('bankAccountNumber', e.target.value)}
                    style={{
                      height: '48px',
                      fontSize: '16px',
                      borderColor: '#d9d9d9',
                      borderRadius: '6px',
                      maxWidth: '400px'
                    }}
                  />
                </div>
              )}
         
            </div>

            {/* Plans - Optional */}
            {plans.map((plan, index) => (
              <div
                key={plan.id}
                style={{
                  border: '1px solid #d9d9d9',
                  borderRadius: '8px',
                  padding: '24px',
                  marginBottom: '24px',
                  backgroundColor: '#ffffff'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '24px'
                }}>
                  <span style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#000000'
                  }}>
                    Plan {index + 1}
                  </span>
                  <Button
                    type="text"
                    icon={<CloseOutlined />}
                    onClick={() => removePlan(plan.id)}
                    style={{
                      color: '#666',
                      border: 'none',
                      background: 'transparent'
                    }}
                  />
                </div>

                {/* Name, Plan Fee, Student Limit Row */}
                <Row gutter={24} style={{ marginBottom: '24px' }}>
                  <Col span={8}>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontSize: '16px',
                      fontWeight: '500',
                      color: '#000000'
                    }}>
                      Name<span style={{ color: '#ff4d4f' }}>*</span>
                    </label>
                   
                      
                    <Input
                      placeholder="Enter plan name"
                      value={plan.name}
                      onChange={(e) => updatePlan(plan.id, 'name', e.target.value)}
                      style={{
                        height: '48px',
                        fontSize: '16px',
                        borderColor: '#d9d9d9',
                        borderRadius: '6px'
                      }}
                    /> 
                  </Col>
                  <Col span={8}>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontSize: '16px',
                      fontWeight: '500',
                      color: '#000000'
                    }}>
                      Plan Fee<span style={{ color: '#ff4d4f' }}>*</span>
                    </label>
                     <div className="registration-fee-input">

                    <Input
                      placeholder="Enter"
                      addonBefore={<span style={{ color: '#000000' }}>₹</span>}
                      value={plan.planFee}
                      onChange={(e) => {
                        // Only allow numbers and decimal point
                        const value = e.target.value;
                        if (value === '' || /^\d*\.?\d*$/.test(value)) {
                          updatePlan(plan.id, 'planFee', value);
                        }
                      }}
                      onKeyPress={(e) => {
                        // Prevent non-numeric characters except decimal point
                        if (!/[\d.]/.test(e.key)) {
                          e.preventDefault();
                        }
                        // Prevent multiple decimal points
                        if (e.key === '.' && e.target.value.includes('.')) {
                          e.preventDefault();
                        }
                      }}
                      style={{
                        height: '48px',
                        fontSize: '16px',
                        borderColor: '#d9d9d9',
                        borderRadius: '6px'
                      }}
                    />
                     </div>
                  </Col>
                  <Col span={8}>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontSize: '16px',
                      fontWeight: '500',
                      color: '#000000'
                    }}>
                      Student Limit
                    </label>
                    <Input
                      placeholder="Enter"
                      value={plan.studentLimit}
                      onChange={(e) => updatePlan(plan.id, 'studentLimit', e.target.value)}
                      style={{
                        height: '48px',
                        fontSize: '16px',
                        borderColor: '#d9d9d9',
                        borderRadius: '6px'
                      }}
                    />
                  </Col>
                </Row>

                {/* Plan Description */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '16px',
                    fontWeight: '500',
                    color: '#000000'
                  }}>
                    Plan Description<span style={{ color: '#ff4d4f' }}>*</span>
                  </label>
                  <TextArea
                    placeholder="Short Description of the Plan"
                    rows={3}
                    value={plan.description}
                    onChange={(e) => updatePlan(plan.id, 'description', e.target.value)}
                    style={{
                      fontSize: '16px',
                      borderColor: '#d9d9d9',
                      borderRadius: '6px',
                      backgroundColor: '#ffffff'
                    }}
                  />
                </div>

                {/* What Is Included and What Is Not Included */}
                <Row gutter={24}>
                  <Col span={12}>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontSize: '16px',
                      fontWeight: '500',
                      color: '#000000'
                    }}>
                      What Is Included?<span style={{ color: '#ff4d4f' }}>*</span>
                    </label>
                    <div style={{ marginBottom: '8px' }}>
                      <small style={{ color: '#666', fontSize: '12px' }}>
                        Use • or - for bullet points (e.g., "• Feature 1\n• Feature 2")
                      </small>
                    </div>
                    <TextArea
                      placeholder="• Feature 1&#10;• Feature 2&#10;• Feature 3"
                      rows={6}
                      value={plan.included}
                      onChange={(e) => updatePlan(plan.id, 'included', e.target.value)}
                      style={{
                        fontSize: '16px',
                        borderColor: '#d9d9d9',
                        borderRadius: '6px',
                        backgroundColor: '#fafafa'
                      }}
                    />
                  </Col>
                  <Col span={12}>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontSize: '16px',
                      fontWeight: '500',
                      color: '#000000'
                    }}>
                      What Is Not Included?<span style={{ color: '#ff4d4f' }}>*</span>
                    </label>
                    <div style={{ marginBottom: '8px' }}>
                      <small style={{ color: '#666', fontSize: '12px' }}>
                        Use • or - for bullet points (e.g., "• Feature 1\n• Feature 2")
                      </small>
                    </div>
                    <TextArea
                      placeholder="• Feature 1&#10;• Feature 2&#10;• Feature 3"
                      rows={6}
                      value={plan.notIncluded}
                      onChange={(e) => updatePlan(plan.id, 'notIncluded', e.target.value)}
                      style={{
                        fontSize: '16px',
                        borderColor: '#d9d9d9',
                        borderRadius: '6px',
                        backgroundColor: '#fafafa'
                      }}
                    />
                  </Col>
                </Row>
              </div>
            ))}

            {/* Add a Plan Button - Optional */}
            <div style={{ marginBottom: '40px' }}>
              <div style={{ marginBottom: '16px' }}>
                <Title level={4} style={{
                  marginBottom: '8px',
                  fontWeight: '500',
                  color: '#000000',
                  fontSize: '16px'
                }}>
                  Plans (Optional)
                </Title>
                <p style={{ 
                  color: '#666', 
                  fontSize: '14px', 
                  margin: '0 0 16px 0' 
                }}>
                  Add registration plans to offer different pricing options to participants
                </p>
              </div>
              <Button
                type="link"
                icon={<PlusOutlined />}
                onClick={addPlan}
                style={{
                  color: '#1890ff',
                  fontSize: '16px',
                  padding: '0',
                  height: 'auto',
                  fontWeight: '500'
                }}
              >
                Add a Plan
              </Button>
            </div>

            {/* Save and Continue Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingBottom: '40px' }}>
              <Button
                type="primary"
                size="large"
                loading={loading}
                disabled={!registrationData.totalRegistrationFee || !registrationData.registrationStartDate || !registrationData.registrationEndDate || !registrationData.bankAccount}
                onClick={handleSubmit}
                style={{
                  backgroundColor: (registrationData.totalRegistrationFee && registrationData.registrationStartDate && registrationData.registrationEndDate && registrationData.bankAccount) ? '#4CAF50' : '#d9d9d9',
                  // borderColor: registrationData.totalRegistrationFee ? '#1890ff' : '#d9d9d9',
                  color: (registrationData.totalRegistrationFee && registrationData.registrationStartDate && registrationData.registrationEndDate && registrationData.bankAccount) ? '#ffffff' : '#666666',
                  height: '48px',
                  paddingLeft: '32px',
                  paddingRight: '32px',
                  fontSize: '16px',
                  fontWeight: '500',
                  borderRadius: '6px'
                }}
              >
                Save and Continue
              </Button>
            </div>
          </Form>
        </div>
      </div>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        /* Webkit browsers (Chrome, Safari, Edge) */
        div::-webkit-scrollbar {
          width: 8px;
        }
        
        div::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        
        div::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 4px;
        }
        
        div::-webkit-scrollbar-thumb:hover {
          background: #a1a1a1;
        }
        
        /* Firefox */
        div {
          scrollbar-width: thin;
          scrollbar-color: #c1c1c1 #f1f1f1;
        }
      `}</style>
    </div>
  )
}
