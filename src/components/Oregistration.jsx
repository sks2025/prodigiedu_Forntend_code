import { useState, useEffect } from "react"
import {
  Card,
  Input,
  DatePicker,
  Select,
  Button,
  Form,
  Row,
  Col,
  Typography,
  Space,
  message
} from 'antd';
import {
  CalendarOutlined,
  PlusOutlined,
  CloseOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useParams, useNavigate } from "react-router-dom";

const { Title } = Typography;
const { TextArea } = Input;

// Student Details options for dropdowns (for future use)
const studentDetailOptions = [
  "Student's Name",
  "Parent's / Guardian's Name",
  "Contact number",
  "Email ID",
  "City",
  "Address",
  "Roll number",
  "Grade",
  "Section",
  "Birth Date"
];

export default function Oregistration({ fun, ID }) {
  const { id } = useParams();
  const [plans, setPlans] = useState([]);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [stages, setStages] = useState([]); // New state for stages
  const [bankAccounts, setBankAccounts] = useState([]); // New state for bank accounts
  const navigate = useNavigate();


  // Use ID from props if available, otherwise use id from params
  const competitionId = ID || id;

  // Form data state
  const [registrationData, setRegistrationData] = useState({
    totalRegistrationFee: '',
    registrationStartDate: '',
    registrationEndDate: '',
    bankAccount: '', // Remove default value
    bankAccountNumber: ''
  });

  // Fetch bank accounts data
  const fetchBankAccounts = async () => {
    try {

      const userDataString = localStorage.getItem('user_Data');
      if (!userDataString) {
        console.log('⚠️ No user data found in localStorage');
        return;
      }
      
      const userData = JSON.parse(userDataString);
      const organizerId = userData?._id;

      
      if (!organizerId) {
        console.log('⚠️ No user_id found in user data');
        return;
      }
      
      console.log('📋 Organizer ID:', organizerId);
      
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      };

      const response = await fetch(
        `https://api.prodigiedu.com/api/competitions/bankaccount/${organizerId}`,
        requestOptions
      );

      console.log('📡 Bank account API response status:', response.status, response.ok);

      if (response.ok) {
        const result = await response.json();
        console.log("✅ Fetched bank accounts successfully:", result);
        
        if (result.success && result.data) {
          // Transform the data to match your Select options format
          const transformedAccounts = [
            
          ];
          
          // Add fetched accounts if any
          if (result.data.accountNumber) {
            console.log('💳 Adding fetched bank account:', result.data.accountNumber);
            transformedAccounts.push({
              value: `custom_${result.data.accountNumber}`,
              label: "BANK",
              number: `****${result.data.accountNumber.slice(-4)}`,
              color: "#52c41a"
            });
          }
          
          console.log('🔄 Setting transformed bank accounts:', transformedAccounts);
          setBankAccounts(transformedAccounts);
        }
      } else {
        console.log('⚠️ No bank accounts found, using default options');
        // Set default bank account options
        const defaultAccounts = [
          {
            value: "visa_6798",
            label: "VISA",
            number: "XXXX XXXX XXXX 6798",
            color: "#1e40af"
          },
          {
            value: "mastercard",
            label: "MASTER",
            number: "XXXX XXXX XXXX 1234", 
            color: "#eb001b"
          },
          {
            value: "custom",
            label: "CUSTOM",
            number: "Enter Account Number",
            color: "#666"
          }
        ];
        console.log('🔧 Setting default bank accounts:', defaultAccounts);
        setBankAccounts(defaultAccounts);
      }
    } catch (error) {
      console.error("❌ Error fetching bank accounts:", error);
      // Set default options on error
      const fallbackAccounts = [
        {
          value: "visa_6798",
          label: "VISA",
          number: "XXXX XXXX XXXX 6798",
          color: "#1e40af"
        },
        {
          value: "mastercard",
          label: "MASTER",
          number: "XXXX XXXX XXXX 1234", 
          color: "#eb001b"
        },
        {
          value: "custom",
          label: "CUSTOM",
          number: "Enter Account Number",
          color: "#666"
        }
      ];
      console.log('🔄 Setting fallback bank accounts due to error:', fallbackAccounts);
      setBankAccounts(fallbackAccounts);
    }
  };

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
      console.log("Fetched competition data:", result);

      // Extract stages from overviewdata
      if (result.overviewdata && Array.isArray(result.overviewdata.stages)) {
        const stagesData = result.overviewdata.stages;
        setStages(stagesData);
        console.log("Stages loaded:", stagesData);
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
        console.log('Fetched Registration Data:', result);
        
        if (result.success && result.data) {
          const { registration_type, plans: fetchedPlans } = result.data;
          
          // Update registration data
          if (registration_type) {
            console.log('Setting registration data:', registration_type);
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
            console.log('Setting plans data:', fetchedPlans);
            const formattedPlans = fetchedPlans.map((plan, index) => ({
              id: Date.now() + index,
              name: plan.name || '',
              planFee: plan.plan_fee || '',
              studentLimit: plan.student_limit || '',
              description: plan.description || '',
              included: plan.included || '',
              notIncluded: plan.not_included || ''
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
    console.log('🚀 useEffect triggered with competitionId:', competitionId);
    if (competitionId) {
      console.log('📡 Fetching data for competition ID:', competitionId);
      fetchCompetitionData(); // Fetch stages data
      fetchRegistrationData(); // Fetch registration data
      fetchBankAccounts(); // Fetch bank accounts
    } else {
      console.log('⚠️ No competition ID available, skipping data fetch');
    }
  }, [competitionId]);

  console.log('🔍 Oregistration Component State:', {
    competitionId,
    plansCount: plans.length,
    bankAccountsCount: bankAccounts.length,
    stagesCount: stages.length,
    registrationData,
    loading,
    fetchLoading
  });

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
    console.log('➕ Adding new plan:', newPlan);
    setPlans([...plans, newPlan]);
  };

  const removePlan = (planId) => {
    console.log('🗑️ Removing plan with ID:', planId);
    const updatedPlans = plans.filter(plan => plan.id !== planId);
    console.log('📋 Plans after removal:', updatedPlans.length);
    setPlans(updatedPlans);
  };

  const updatePlan = (planId, field, value) => {
    console.log('✏️ Updating plan:', { planId, field, value });
    
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
        console.log('🔧 Auto-formatted bullet points:', { original: value, formatted: formattedValue });
      }
    }
    
    setPlans(plans.map(plan =>
      plan.id === planId ? { ...plan, [field]: formattedValue } : plan
    ));
    
    console.log('✅ Plan updated successfully');
  };

  const updateRegistrationData = (field, value) => {
    setRegistrationData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    console.log('🚀 Starting form submission...');
    console.log('📋 Current form data:', { registrationData, plans });
    
    try {
      // Validate required fields
      if (!registrationData.totalRegistrationFee) {
        console.log('❌ Validation failed: Missing total registration fee');
        message.error('Please enter total registration fee');
        return;
      }

      // if ((registrationData.bankAccount === 'custom' || registrationData.bankAccount?.startsWith('custom_')) && !registrationData.bankAccountNumber) {
      //   console.log('❌ Validation failed: Missing bank account number for custom account');
      //   message.error('Please enter bank account number');
      //   return;
      // }

      if (plans.length === 0) {
        console.log('❌ Validation failed: No plans added');
        message.error('Please add at least one plan');
        return;
      }

      // Validate plans
      for (let i = 0; i < plans.length; i++) {
        const plan = plans[i];
        if (!plan.name || !plan.planFee || !plan.description || !plan.included || !plan.notIncluded) {
          console.log(`❌ Validation failed: Plan ${i + 1} missing required fields:`, plan);
          message.error(`Please fill all required fields for Plan ${i + 1}`);
          return;
        }
        
        // Check if included and notIncluded have content beyond just bullet points
        if (plan.included.trim() === '•' || plan.included.trim() === '') {
          console.log(`❌ Validation failed: Plan ${i + 1} missing included content:`, plan.included);
          message.error(`Please add content for "What Is Included?" in Plan ${i + 1}`);
          return;
        }
        
        if (plan.notIncluded.trim() === '•' || plan.notIncluded.trim() === '') {
          console.log(`❌ Validation failed: Plan ${i + 1} missing not included content:`, plan.notIncluded);
          message.error(`Please add content for "What Is Not Included?" in Plan ${i + 1}`);
          return;
        }
      }

      console.log('✅ All validations passed, proceeding with submission');
      setLoading(true);

      // Prepare API data structure
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const apiData = {
        registration_type: {
          total_registration_fee: registrationData.totalRegistrationFee,
          registration_start_date: registrationData.registrationStartDate,
          registration_end_date: registrationData.registrationEndDate,
          bank_account: registrationData.bankAccount,
          bank_account_number: registrationData.bankAccountNumber
        },
        plans: plans.map(plan => ({
          name: plan.name,
          plan_fee: plan.planFee,
          student_limit: plan.studentLimit || null,
          description: plan.description,
          included: plan.included,
          not_included: plan.notIncluded
        }))
      };
      const raw = JSON.stringify(apiData);

      // Determine if this is create or update
      const isUpdate = plans.length > 0 && registrationData.totalRegistrationFee; // Assuming if data exists, it's an update
      console.log('🔄 Operation type:', isUpdate ? 'UPDATE' : 'CREATE');
      
      const requestOptions = {
        method: "POST", // Backend uses POST for both create and update
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      }; 
      
      console.log('🌐 Calling registration API:', `https://api.prodigiedu.com/api/competitions/registration/${competitionId}`);
      const response = await fetch(`https://api.prodigiedu.com/api/competitions/registration/${competitionId}`, requestOptions);
      
      console.log('📡 API response status:', response.status, response.ok);
      
      if (response.ok) {
        const result = await response.text();
        console.log('✅ API Response received:', result);
        message.success('Registration data saved successfully!');

        // Call parent function if provided
        if (fun) {
          console.log('📞 Calling parent function with:', 5, competitionId);
          fun(5, competitionId);
        } else {
          console.log('⚠️ No parent function provided');
        }
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

    } catch (error) {
      console.error('❌ API Error during submission:', error);
      message.error('Failed to save registration data. Please try again.');
    } finally {
      console.log('🏁 Form submission completed');
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

  console.log('🎨 Rendering main component UI');

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
                  onChange={(e) => updateRegistrationData('totalRegistrationFee', e.target.value)}
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
                onClick={()=>{fetchBankAccounts()}}
                  value={registrationData.bankAccount}
                  onChange={(value) => updateRegistrationData('bankAccount', value)}
                  style={{
                    width: '400px',
                    height: '48px'
                  }}
                  dropdownStyle={{ borderRadius: '6px' }}
                >
                  {bankAccounts.map(account => (
                    <Select.Option key={account.value} value={account.value}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{
                          backgroundColor: account.color,
                          color: 'white',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          marginRight: '12px'
                        }}>
                          {account.label}
                        </span>
                        <span style={{ fontSize: '16px', color: '#000000' }}>
                          {account.number}
                        </span>
                      </div>
                    </Select.Option>
                  ))}
                </Select>
                <Button
                onClick={()=>{
                  navigate('/BankAcount')
                  
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
              
           
            </div>

            {/* Plans */}
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
                      onChange={(e) => updatePlan(plan.id, 'planFee', e.target.value)}
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

            {/* Add a Plan Button */}
            <div style={{ marginBottom: '40px' }}>
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
                onClick={handleSubmit}
                style={{
                  backgroundColor: plans.length > 0 && registrationData.totalRegistrationFee ? '#4CAF50' : '#d9d9d9',
                  // borderColor: plans.length > 0 && registrationData.totalRegistrationFee ? '#1890ff' : '#d9d9d9',
                  color: plans.length > 0 && registrationData.totalRegistrationFee ? '#ffffff' : '#666666',
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
