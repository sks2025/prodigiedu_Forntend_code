import React, { useState, useEffect } from "react";
import {
  Tabs,
  Select,
  Button,
  Collapse,
  Input,
  Tag,
  Space,
  Row,
  Col,
  Typography,
  message,
  Spin
} from "antd";
import {
  DownOutlined,
  CloseOutlined,
  CaretRightOutlined,
  PlusOutlined
} from "@ant-design/icons";
import { useParams } from "react-router-dom";

const { Option } = Select;
const { Panel } = Collapse;
const { Title, Text } = Typography;

const OEligibility = ({ fun, ID }) => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("");
  const [activeKeys, setActiveKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataByTab, setDataByTab] = useState({});
  const [stages, setStages] = useState([]); // New state for stages
  const [additionalForms, setAdditionalForms] = useState([]); // New state for additional forms
  
  // Use ID from props if available, otherwise use id from params
  const competitionId = ID || id;

  const criteriaOptions = [
    { value: 'current_grade', label: 'Current Grade' },
    { value: 'marks_last_year', label: 'Marks in last academic year' },
    { value: 'age', label: 'Age' },
    { value: 'rank_previous_round', label: 'Rank in previous round' },
    { value: 'team_size', label: 'Team Size' },
    { value: 'participation_same_school', label: 'Participation from same school' }
  ];

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

  const schoolDetailOptions = [
    "School Name",
    "Address",
    "Contact Number",
    "City",
    "Type of School",
    "POC Name",
    "Email ID",
    "Student Strength"
  ];

  // Fetch competition data and stages when component mounts
  useEffect(() => {
    const getCompetitionData = async () => {
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
          
          // Initialize dataByTab for each stage
          const initialDataByTab = {};
          stagesData.forEach((stage) => {
            initialDataByTab[stage.id.toString()] = {
              selectedCriteria: [],
              criteriaData: {},
              studentDetails: ["Student's Name", "Parent's / Guardian's Name", "Contact number", "Email ID"],
              schoolDetails: ["School Name", "Address", "Contact Number", "City"]
            };
          });
          
          // Set the first stage as active tab if available
          if (stagesData.length > 0 && !activeTab) {
            setActiveTab(stagesData[0].id.toString());
          }

                     // Process existing eligibility data if any
           if (result.success && result.data && result.data.eligibility) {
             // You can process existing eligibility data here if needed
             // For now, we'll use the default values
           }
          
          setDataByTab(initialDataByTab);
        } else {
          console.warn("No stages found in overviewdata");
          message.error("No stages found for this competition");
        }
             } catch (error) {
         console.error("Error fetching competition data:", error);
         message.error("Failed to fetch competition data.");
       }
     };

     getCompetitionData();
  }, [competitionId]);

  // Update active tab when stages change
  useEffect(() => {
    if (stages.length > 0 && !activeTab) {
      setActiveTab(stages[0].id.toString());
    }
  }, [stages, activeTab]);

  // Check if all stages have required data for save button state
  const allStagesHaveData = stages.length > 0 && stages.every(stage => {
    const stageData = dataByTab[stage.id.toString()];
    return stageData && stageData.selectedCriteria.length > 0 && stageData.studentDetails.length > 0;
  });

  // Check if additional forms have required data
  const additionalFormsValid = additionalForms.every(form => 
    form.name.trim() && form.type
  );

  // API call function
  const saveEligibilityData = async () => {
    setLoading(true);

    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      // Check if all stages have required data
      const stagesWithoutData = stages.filter(stage => {
        const stageData = dataByTab[stage.id.toString()];
        return !stageData || stageData.selectedCriteria.length === 0 || stageData.studentDetails.length === 0;
      });

      if (stagesWithoutData.length > 0) {
        const stageNames = stagesWithoutData.map(stage => stage.name).join(', ');
        message.warning(
          `Please select at least one criteria and student detail in the following stage(s): ${stageNames}`
        );
        return;
      }

      // Combine eligibility criteria from all stages into a single array
      const eligibility = [];
      
      stages.forEach((stage) => {
        const stageData = dataByTab[stage.id.toString()];
        if (stageData && stageData.selectedCriteria.length > 0) {
          stageData.selectedCriteria.forEach(criteria => {
            const criteriaLabel = criteriaOptions.find(opt => opt.value === criteria)?.label;
            const data = stageData.criteriaData[criteria];
            
            let requirement = "";
            if (data?.min && data?.max) {
              requirement = `Range: ${data.min} to ${data.max}`;
            } else if (data?.min) {
              requirement = `Minimum: ${data.min}`;
            } else if (data?.max) {
              requirement = `Maximum: ${data.max}`;
            } else {
              requirement = `${criteriaLabel} criteria applies`;
            }

            eligibility.push({
              title: criteriaLabel,
              requirement: requirement,
              stage: stage.name // Add stage information
            });
          });
        }
      });

      // Combine StudentDetails and SchoolDetails from all stages, ensuring uniqueness
      const studentDetails = [
        ...new Set(
          stages.flatMap(stage => {
            const stageData = dataByTab[stage.id.toString()];
            return stageData?.studentDetails || [];
          })
        )
      ];
      
      const schoolDetails = [
        ...new Set(
          stages.flatMap(stage => {
            const stageData = dataByTab[stage.id.toString()];
            return stageData?.schoolDetails || [];
          })
        )
      ];

      // Format data for API
      const formattedData = {
        eligibility,
        StudentInformation: {
          StudentDetails: studentDetails.length > 0 ? studentDetails : [],
          SchoolDetails: schoolDetails.length > 0 ? schoolDetails : []
        },
        additionalDetails: additionalForms.filter(form => form.name.trim() && form.type) // Only include valid forms
      };

      const raw = JSON.stringify(formattedData);

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };

      const response = await fetch(`https://api.prodigiedu.com/api/competitions/eligibility/${competitionId}`, requestOptions);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.text();
      console.log('API Response:', result);
      
      message.success('Eligibility criteria saved successfully!');
      fun(4, competitionId);
      
    } catch (error) {
      console.error('API Error:', error);
      message.error('Failed to save eligibility criteria. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCriteriaChange = (values) => {
    setDataByTab({
      ...dataByTab,
      [activeTab]: {
        ...dataByTab[activeTab],
        selectedCriteria: values
      }
    });
    setActiveKeys(values);
  };

  const handleCriteriaDataChange = (criteriaKey, field, value) => {
    setDataByTab({
      ...dataByTab,
      [activeTab]: {
        ...dataByTab[activeTab],
        criteriaData: {
          ...dataByTab[activeTab].criteriaData,
          [criteriaKey]: {
            ...dataByTab[activeTab].criteriaData[criteriaKey],
            [field]: value
          }
        }
      }
    });
  };

  const removeCriteria = (criteriaToRemove) => {
    const currentTabData = dataByTab[activeTab] || { selectedCriteria: [], criteriaData: {} };
    const newSelectedCriteria = currentTabData.selectedCriteria.filter(c => c !== criteriaToRemove);
    const newCriteriaData = { ...currentTabData.criteriaData };
    delete newCriteriaData[criteriaToRemove];

    setDataByTab({
      ...dataByTab,
      [activeTab]: {
        ...currentTabData,
        selectedCriteria: newSelectedCriteria,
        criteriaData: newCriteriaData
      }
    });
    setActiveKeys(newSelectedCriteria);
  };

  const handleStudentDetailsChange = (values) => {
    setDataByTab({
      ...dataByTab,
      [activeTab]: {
        ...dataByTab[activeTab],
        studentDetails: values
      }
    });
  };

  const handleSchoolDetailsChange = (values) => {
    setDataByTab({
      ...dataByTab,
      [activeTab]: {
        ...dataByTab[activeTab],
        schoolDetails: values
      }
    });
  };

  // Function to add additional detail form
  const addAdditionalForm = () => {
    const newFormId = Date.now();
    const newForm = {
      id: newFormId,
      name: "",
      type: "Short Answer",
      options: [],
      selectedOptions: [],
      stage: activeTab
    };
    setAdditionalForms([...additionalForms, newForm]);
  };

  // Function to handle form type change and initialize options if needed
  const handleFormTypeChange = (formId, newType) => {
    const form = additionalForms.find(f => f.id === formId);
    if (form) {
      let newOptions = [...form.options];
      
      // Initialize with default options for types that need them
      if ((newType === "Multiple Choice" || newType === "Checkbox" || newType === "Drop Down") && form.options.length === 0) {
        newOptions = ["Option 1", "Option 2"];
      }
      
      // Clear options for types that don't need them
      if (newType === "Short Answer" || newType === "Date" || newType === "Photo Upload") {
        newOptions = [];
      }
      
      updateAdditionalForm(formId, 'type', newType);
      if (newOptions.length !== form.options.length) {
        setAdditionalForms(additionalForms.map(f =>
          f.id === formId ? { ...f, options: newOptions } : f
        ));
      }
    }
  };

  // Function to duplicate additional detail form
  const duplicateAdditionalForm = (formId) => {
    const formToDuplicate = additionalForms.find(form => form.id === formId);
    if (formToDuplicate) {
      const newFormId = Date.now();
      const duplicatedForm = {
        ...formToDuplicate,
        id: newFormId,
        name: `${formToDuplicate.name} (Copy)`,
        options: [...formToDuplicate.options],
        selectedOptions: []
      };
      setAdditionalForms([...additionalForms, duplicatedForm]);
    }
  };

  // Function to remove additional detail form
  const removeAdditionalForm = (formId) => {
    setAdditionalForms(additionalForms.filter(form => form.id !== formId));
  };

  // Function to update additional form data
  const updateAdditionalForm = (formId, field, value) => {
    setAdditionalForms(additionalForms.map(form =>
      form.id === formId ? { ...form, [field]: value } : form
    ));
  };

  // Function to add option to dropdown form
  const addOptionToForm = (formId) => {
    const newOption = `Option ${additionalForms.find(f => f.id === formId)?.options.length + 1}`;
    setAdditionalForms(additionalForms.map(form =>
      form.id === formId 
        ? { ...form, options: [...form.options, newOption] }
        : form
    ));
  };

  // Function to update option in dropdown form
  const updateOptionInForm = (formId, optionIndex, value) => {
    setAdditionalForms(additionalForms.map(form =>
      form.id === formId
        ? {
            ...form,
            options: form.options.map((option, index) =>
              index === optionIndex ? value : option
            )
          }
        : form
    ));
  };

  // Function to remove option from dropdown form
  const removeOptionFromForm = (formId, optionIndex) => {
    setAdditionalForms(additionalForms.map(form =>
      form.id === formId
        ? {
            ...form,
            options: form.options.filter((_, index) => index !== optionIndex)
          }
        : form
    ));
  };

  // Function to toggle checkbox selection (single selection only)
  const toggleCheckboxOption = (formId, optionIndex) => {
    setAdditionalForms(additionalForms.map(form =>
      form.id === formId
        ? {
            ...form,
            selectedOptions: form.selectedOptions?.includes(optionIndex) 
              ? [] // If already selected, deselect it
              : [optionIndex] // Otherwise, select only this option
          }
        : form
    ));
  };

  const renderCriteriaContent = (criteriaKey) => (
    <Row gutter={16}>
      <Col xs={24} sm={12}>
        <div style={{ marginBottom: 8 }}>
          <span style={{ fontSize: '12px', color: '#666' }}>Min.</span>
        </div>
        <Input
          placeholder="Enter"
          value={dataByTab[activeTab]?.criteriaData[criteriaKey]?.min || ''}
          onChange={(e) => handleCriteriaDataChange(criteriaKey, 'min', e.target.value)}
        />
      </Col>
      <Col xs={24} sm={12}>
        <div style={{ marginBottom: 8 }}>
          <span style={{ fontSize: '12px', color: '#666' }}>Max.</span>
        </div>
        <Input
          placeholder="Enter"
          value={dataByTab[activeTab]?.criteriaData[criteriaKey]?.max || ''}
          onChange={(e) => handleCriteriaDataChange(criteriaKey, 'max', e.target.value)}
        />
      </Col>
    </Row>
  );

  const renderTabContent = () => {
    const currentTabData = dataByTab[activeTab] || {
      selectedCriteria: [],
      criteriaData: {},
      studentDetails: ["Student's Name", "Parent's / Guardian's Name", "Contact number", "Email ID"],
      schoolDetails: ["School Name", "Address", "Contact Number", "City"]
    };

    return (
    <div style={{ 
      height: 'calc(100vh - 120px)', 
      overflowY: 'auto',
      overflowX: 'hidden',
      padding: '24px 40px 0px 40px',
      scrollbarWidth: 'thin',
      scrollbarColor: '#d4d4d4 #f1f1f1',
      paddingBottom: '80px'
    }}>
      <style>
        {`
          .tab-content::-webkit-scrollbar {
            width: 8px;
          }
          .tab-content::-webkit-scrollbar-track {
            background: #f1f1f1;
            borderRadius: 4px;
          }
          .tab-content::-webkit-scrollbar-thumb {
            background: #d4d4d4;
            borderRadius: 4px;
          }
          .tab-content::-webkit-scrollbar-thumb:hover {
            background: #bbb;
          }
        `}
      </style>
      
      {/* Eligibility Section */}
      <div style={{ marginBottom: '32px' }}>
        <Title level={3} style={{ 
          marginBottom: '16px', 
          fontSize: '18px', 
          fontWeight: '600',
          '@media (max-width: 768px)': {
            fontSize: '16px'
          }
        }}>
          Eligibility
        </Title>
        
        <div style={{ marginBottom: '24px' }}>
          <div style={{ marginBottom: '8px' }}>
            <span style={{ fontSize: '14px', color: '#333' }}>Criteria</span>
          </div>
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Select All Criteria"
            value={currentTabData.selectedCriteria}
            onChange={handleCriteriaChange}
            suffixIcon={<DownOutlined />}
            size="large"
          >
            {criteriaOptions.map(option => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </div>

        {/* Criteria Accordions */}
                  {currentTabData.selectedCriteria.length > 0 && (
          <Collapse
            activeKey={activeKeys}
            onChange={setActiveKeys}
            expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
            style={{ background: '#fff' }}
          >
                         {currentTabData.selectedCriteria.map(criteria => {
              const criteriaLabel = criteriaOptions.find(opt => opt.value === criteria)?.label;
              return (
                <Panel
                  key={criteria}
                  header={
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      width: '100%'
                    }}>
                      <span style={{ 
                        fontSize: window.innerWidth <= 768 ? '14px' : '16px' 
                      }}>
                        {criteriaLabel}
                      </span>
                      <CloseOutlined
                        onClick={(e) => {
                          e.stopPropagation();
                          removeCriteria(criteria);
                        }}
                        style={{ color: '#999', fontSize: '12px' }}
                      />
                    </div>
                  }
                >
                  {renderCriteriaContent(criteria)}
                </Panel>
              );
            })}
          </Collapse>
        )}
      </div>

      {/* Student Information Section */}
      <div style={{ marginBottom: '32px' }}>
        <Title level={3} style={{ 
          marginBottom: '16px', 
          fontSize: '18px', 
          fontWeight: '600',
          '@media (max-width: 768px)': {
            fontSize: '16px'
          }
        }}>
          Student Information
        </Title>
        
        <div style={{ marginBottom: '24px' }}>
          <div style={{ marginBottom: '8px' }}>
            <span style={{ fontSize: '14px', color: '#333' }}>
              Student Details<span style={{ color: '#ff4d4f' }}>*</span>
            </span>
          </div>
          <Select
            style={{ width: '100%' }}
            placeholder="Select Information fields"
            value={undefined}
            onChange={(value) => {
              if (value && !currentTabData.studentDetails.includes(value)) {
                handleStudentDetailsChange([...currentTabData.studentDetails, value]);
              }
            }}
            suffixIcon={<DownOutlined />}
            size="large"
          >
            {studentDetailOptions.filter(option => !currentTabData.studentDetails.includes(option)).map(option => (
              <Option key={option} value={option}>
                {option}
              </Option>
            ))}
          </Select>
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '8px',
            maxWidth: '100%',
            marginTop: '12px'
          }}>
            {currentTabData.studentDetails?.map(detail => (
              <Tag
                key={detail}
                closable
                onClose={() => {
                  handleStudentDetailsChange(currentTabData.studentDetails.filter(d => d !== detail));
                }}
                style={{
                  background: '#f0f9f0',
                  border: '1px solid #95de64',
                  color: '#52c41a',
                  borderRadius: '16px',
                  padding: '4px 12px',
                  fontSize: window.innerWidth <= 768 ? '12px' : '14px',
                  margin: '2px'
                }}
              >
                {detail}
              </Tag>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <div style={{ marginBottom: '8px' }}>
            <span style={{ fontSize: '14px', color: '#333' }}>School Details</span>
          </div>
          <Select
            style={{ width: '100%' }}
            placeholder="Select Information fields"
            value={undefined}
            onChange={(value) => {
              if (value && !currentTabData.schoolDetails.includes(value)) {
                handleSchoolDetailsChange([...currentTabData.schoolDetails, value]);
              }
            }}
            suffixIcon={<DownOutlined />}
            size="large"
          >
            {schoolDetailOptions.filter(option => !currentTabData.schoolDetails.includes(option)).map(option => (
              <Option key={option} value={option}>
                {option}
              </Option>
            ))}
          </Select>
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '8px',
            maxWidth: '100%',
            marginTop: '12px'
          }}>
            {currentTabData.schoolDetails.map(detail => (
              <Tag
                key={detail}
                closable
                onClose={() => {
                  handleSchoolDetailsChange(currentTabData.schoolDetails.filter(d => d !== detail));
                }}
                style={{
                  background: '#f0f9f0',
                  border: '1px solid #95de64',
                  color: '#52c41a',
                  borderRadius: '16px',
                  padding: '4px 12px',
                  fontSize: window.innerWidth <= 768 ? '12px' : '14px',
                  margin: '2px'
                }}
              >
                {detail}
              </Tag>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Details Section */}
      <div style={{ marginBottom: '32px' }}>
        <Title level={3} style={{ 
          marginBottom: '16px', 
          fontSize: '18px', 
          fontWeight: '600',
          '@media (max-width: 768px)': {
            fontSize: '16px'
          }
        }}>
          Additional Details
        </Title>
        
        {/* Existing Additional Forms */}
        {additionalForms.filter(form => form.stage === activeTab).map((form, index) => (
          <div key={form.id} style={{
            border: '1px solid #f0f0f0',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '16px',
            backgroundColor: '#fafafa'
          }}>
            {/* Form Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <Text strong style={{ fontSize: '16px' }}>Additional Detail {index + 1}</Text>
            </div>

            {/* Question, Type, and Action Icons in Same Row */}
            <div style={{ marginBottom: '20px' }}>
              <Row align="middle" gutter={[16, 0]}>
                <Col span={12}>
                  <Input
                    placeholder="Enter Question"
                    value={form.name}
                    onChange={(e) => updateAdditionalForm(form.id, 'name', e.target.value)}
                    style={{ width: '100%' }}
                  />
                </Col>
                <Col span={8}>
                  <Select
                    placeholder="Select Type"
                    value={form.type}
                    onChange={(value) => handleFormTypeChange(form.id, value)}
                    style={{ width: '100%' }}
                  >
                    <Option value="Short Answer">Short Answer</Option>
                    <Option value="Multiple Choice">Multiple Choice</Option>
                    <Option value="Checkbox">Checkbox</Option>
                    <Option value="Drop Down">Drop Down</Option>
                    <Option value="Date">Date</Option>
                    <Option value="Photo Upload">Photo Upload</Option>
                  </Select>
                </Col>
                <Col span={4}>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <Button
                      type="text"
                      icon={<PlusOutlined />}
                      onClick={() => duplicateAdditionalForm(form.id)}
                      size="small"
                      style={{ color: '#1890ff' }}
                      title="Duplicate"
                    />
                    <Button
                      type="text"
                      icon={<CloseOutlined />}
                      onClick={() => removeAdditionalForm(form.id)}
                      size="small"
                      style={{ color: '#999' }}
                      title="Delete"
                    />
                  </div>
                </Col>
              </Row>
            </div>

            {/* Options for Drop Down, Multiple Choice, and Checkbox Types */}
            {(form.type === "Drop Down" || form.type === "Multiple Choice" || form.type === "Checkbox") && (
              <div style={{ marginBottom: '20px' }}>
                {form.options.map((option, optionIndex) => (
                  <div key={optionIndex} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    marginBottom: '8px',
                    gap: '8px'
                  }}>
                    {/* Checkbox for Checkbox type questions */}
                    {form.type === "Checkbox" && (
                      <div 
                        onClick={() => toggleCheckboxOption(form.id, optionIndex)}
                        style={{ 
                          width: '16px', 
                          height: '16px', 
                          border: `2px solid ${form.selectedOptions?.includes(optionIndex) ? '#1890ff' : '#d9d9d9'}`, 
                          borderRadius: '3px',
                          backgroundColor: form.selectedOptions?.includes(optionIndex) ? '#1890ff' : '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {form.selectedOptions?.includes(optionIndex) && (
                          <div style={{ 
                            width: '8px', 
                            height: '5px', 
                            border: '2px solid #fff',
                            borderTop: 'none',
                            borderRight: 'none',
                            transform: 'rotate(-45deg)',
                            marginTop: '-2px'
                          }} />
                        )}
                      </div>
                    )}
                    
                    <Input
                      placeholder={`Option ${optionIndex + 1}`}
                      value={option}
                      onChange={(e) => updateOptionInForm(form.id, optionIndex, e.target.value)}
                      style={{ width: '100%' }}
                    />
                    <Button
                      type="text"
                      icon={<CloseOutlined />}
                      onClick={() => removeOptionInForm(form.id, optionIndex)}
                      size="small"
                      style={{ color: '#999' }}
                    />
                  </div>
                ))}
                <Button
                  type="link"
                  icon={<PlusOutlined />}
                  onClick={() => addOptionToForm(form.id)}
                  style={{ padding: '0', color: '#1890ff', fontSize: '14px', marginTop: '8px' }}
                >
                  Add
                </Button>
              </div>
            )}

            {/* Photo Upload Instructions */}
            {form.type === "Photo Upload" && (
              <div style={{ marginBottom: '20px' }}>
                <Row align="middle" gutter={[16, 0]}>
                  <Col span={6}>
                    <Text strong>Upload Settings</Text>
                  </Col>
                  <Col span={18}>
                    <div style={{ 
                      padding: '12px', 
                      backgroundColor: '#f6ffed', 
                      border: '1px solid #b7eb8f', 
                      borderRadius: '6px',
                      fontSize: '14px',
                      color: '#52c41a'
                    }}>
                      <Text>Students will be able to upload photos for this question. Supported formats: JPG, PNG, GIF (Max size: 5MB)</Text>
                    </div>
                  </Col>
                </Row>
              </div>
            )}
          </div>
        ))}

        {/* Add Additional Detail Button */}
        <Button
          type="link"
          icon={<PlusOutlined />}
          onClick={addAdditionalForm}
          style={{ padding: '0', color: '#1890ff', fontSize: '14px', marginTop: '8px' }}
        >
          Add Additional Detail
        </Button>
      </div>
    </div>
    );
  };

  // Create tab items dynamically based on stages
  const tabItems = stages.map((stage) => ({
    key: stage.id.toString(),
    label: stage.name,
    children: renderTabContent(),
  }));

  return (
    <div style={{ 
      background: '#f5f5f5', 
      minHeight: '100vh',
      padding: '0',
      overflow: 'hidden',
      width: '100%',
      position: 'relative'
    }}>
      <div style={{
        background: '#fff',
        minHeight: '100vh',
        maxHeight: '100vh',
        overflow: 'hidden'
      }}>
        {stages.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <Title level={4}>No stages found for this competition. Please add stages first.</Title>
          </div>
        ) : (
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
            style={{ 
              height: '100vh',
              overflow: 'hidden'
            }}
            tabBarStyle={{
              margin: '0',
              paddingLeft: window.innerWidth <= 768 ? '16px' : '40px',
              paddingRight: window.innerWidth <= 768 ? '16px' : '40px',
              background: '#fff',
              borderBottom: '1px solid #f0f0f0',
              position: 'sticky',
              top: 0,
              zIndex: 100
            }}
          />
        )}
        
        {/* Fixed Footer */}
        <div style={{ 
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: '#fff',
          borderTop: '1px solid #f0f0f0',
          padding: '16px 40px',
          display: 'flex',
          justifyContent: 'flex-end',
          zIndex: 1000,
          boxShadow: '0 -2px 8px rgba(0,0,0,0.1)'
        }}>
          <Button
            type="primary"
            size="large"
            disabled={!allStagesHaveData || !additionalFormsValid || loading}
            loading={loading}
            style={{
              background: (!allStagesHaveData || !additionalFormsValid || loading) ? '#d9d9d9' : '#4CAF50',
              borderRadius: '6px',
              padding: '0 32px',
              height: '40px',
              minWidth: window.innerWidth <= 768 ? '120px' : '180px'
            }}
            onClick={saveEligibilityData}
          >
            Save and Continue
          </Button>
        </div>
      </div>
      
      {/* Media Queries for Additional Responsive Styling */}
      <style>
        {`
          @media (max-width: 768px) {
            .ant-tabs-content-holder {
              padding: 16px !important;
            }
            .ant-select-selector {
              padding: 8px 12px !important;
            }
            .ant-collapse-header {
              padding: 12px 16px !important;
            }
            .ant-collapse-content-box {
              padding: 16px !important;
            }
            .fixed-footer {
              padding: 12px 16px !important;
            }
          }
          
          @media (max-width: 480px) {
            .ant-tabs-tab {
              padding: 8px 12px !important;
              font-size: 14px !important;
            }
            .ant-btn-lg {
              height: 36px !important;
              padding: 0 20px !important;
              font-size: 14px !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default OEligibility;