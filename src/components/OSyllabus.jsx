import { useState, useEffect } from "react";
import {
  Tabs,
  Select,
  Form,
  Button,
  Typography,
  Space,
  Input,
  Row,
  Col,
  Card,
  Tag,
  Checkbox,
  List,
  message,
} from "antd";
import {
  CloseOutlined,
  DownOutlined,
  SearchOutlined,
  CaretDownOutlined,
  CaretUpOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useParams } from "react-router-dom";

const { Title, Text } = Typography;
const { Option } = Select;

const OSyllabus = ({ fun, ID }) => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("");
  const [expandedTopics, setExpandedTopics] = useState([]);
  const [topicsByTab, setTopicsByTab] = useState({});
  const [selectedTopicFromDropdown, setSelectedTopicFromDropdown] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stages, setStages] = useState([]);
  const [showWeightage, setShowWeightage] = useState(false); // New state for weightage visibility
  const [subjects, setSubjects] = useState([]); // New state for subjects
  
  // Use ID from props if available, otherwise use id from params
  const competitionId = ID || id;

  // Updated subject list from excel sheet
  const allSubjects = [
    "Academic",
    "Extra-curricular", 
    "Others"
  ];

  // Updated topic list from excel sheet
  const allTopics = [
    "Maths",
    "English", 
    "Physics",
    "Chemistry",
    "Environmental Studies",
    "History",
    "General Knowledge",
    "Computer Science",
    "Biology",
    "Geography",
    "Economics",
    "Literature",
    "Art",
    "Music",
    "Sports",
    "Dance",
    "Drama",
    "Debate",
    "Quiz",
    "Science Fair",
    "Robotics",
    "Coding",
    "Photography",
    "Creative Writing"
  ];

  // Updated subtopic list from excel sheet
  const allSubtopics = {
    "Maths": [
      "Algebra",
      "Geometry", 
      "Trigonometry",
      "Calculus",
      "Statistics",
      "Probability",
      "Number Theory",
      "Linear Algebra",
      "Discrete Mathematics",
      "Vector Calculus"
    ],
    "English": [
      "Grammar",
      "Vocabulary",
      "Reading Comprehension",
      "Writing Skills",
      "Literature Analysis",
      "Poetry",
      "Drama",
      "Novel Study",
      "Essay Writing",
      "Creative Writing"
    ],
    "Physics": [
      "Mechanics",
      "Thermodynamics",
      "Electromagnetism",
      "Optics",
      "Modern Physics",
      "Quantum Mechanics",
      "Relativity",
      "Nuclear Physics",
      "Wave Motion",
      "Energy Conservation"
    ],
    "Chemistry": [
      "Organic Chemistry",
      "Inorganic Chemistry",
      "Physical Chemistry",
      "Analytical Chemistry",
      "Biochemistry",
      "Chemical Bonding",
      "Reaction Kinetics",
      "Thermochemistry",
      "Electrochemistry",
      "Surface Chemistry"
    ],
    "Computer Science": [
      "Programming",
      "Data Structures",
      "Algorithms",
      "Database Systems",
      "Computer Networks",
      "Operating Systems",
      "Software Engineering",
      "Artificial Intelligence",
      "Machine Learning",
      "Web Development"
    ]
  };

  const handleSubjectSelect = (subjectName) => {
    if (!subjects.includes(subjectName)) {
      setSubjects([...subjects, subjectName]);
    }
  };

  const handleSubjectRemove = (subjectName) => {
    setSubjects(subjects.filter(subject => subject !== subjectName));
  };

  const handleTopicSelect = (topicName) => {
    const currentTopics = topicsByTab[activeTab] || [];
    if (currentTopics.some((topic) => topic.name === topicName)) {
      return;
    }

    // Add new topic with default weight of 0 instead of forcing equal distribution
    const newTopic = {
      name: topicName,
      weight: 0, // Default to 0, let user set manually
      subtopics: [],
      searchTerm: "",
      searchResults: [],
      selectedSearchItems: [],
    };

    setTopicsByTab({
      ...topicsByTab,
      [activeTab]: [...currentTopics, newTopic],
    });
    setSelectedTopicFromDropdown(null);
  };

  const handleCustomTopicAdd = (topicName) => {
    if (!topicName.trim()) return;
    
    const currentTopics = topicsByTab[activeTab] || [];
    if (currentTopics.some((topic) => topic.name === topicName.trim())) {
      message.warning("This topic already exists");
      return;
    }

    // Add new topic with default weight of 0 instead of forcing equal distribution
    const newTopic = {
      name: topicName.trim(),
      weight: 0, // Default to 0, let user set manually
      subtopics: [],
      searchTerm: "",
      searchResults: [],
      selectedSearchItems: [],
    };

    setTopicsByTab({
      ...topicsByTab,
      [activeTab]: [...currentTopics, newTopic],
    });
  };

  const handleTopicRemove = (index) => {
    const newTopics = (topicsByTab[activeTab] || []).filter((_, i) => i !== index);
    
    // Don't force weightage recalculation - let users maintain their own values
    // setTopicsByTab({
    //   ...topicsByTab,
    //   [activeTab]: newTopics,
    // });
    
    setTopicsByTab({
      ...topicsByTab,
      [activeTab]: newTopics,
    });

    if (expandedTopics.includes(index)) {
      setExpandedTopics(expandedTopics.filter((i) => i !== index));
    }
  };

  const handleWeightChange = (index, value) => {
    const newTopics = [...(topicsByTab[activeTab] || [])];
    newTopics[index].weight = parseFloat(value) || 0;
    setTopicsByTab({
      ...topicsByTab,
      [activeTab]: newTopics,
    });
  };

  const handleSearchChange = (index, value) => {
    const newTopics = [...(topicsByTab[activeTab] || [])];
    newTopics[index].searchTerm = value;

    if (value.trim()) {
      const topicName = newTopics[index].name;
      const availableSubtopics = allSubtopics[topicName] || [];
      const searchResults = availableSubtopics.filter(
        (subtopic) =>
          subtopic.toLowerCase().includes(value.toLowerCase()) &&
          !newTopics[index].subtopics.includes(subtopic)
      );
      newTopics[index].searchResults = searchResults;
    } else {
      newTopics[index].searchResults = [];
    }

    setTopicsByTab({
      ...topicsByTab,
      [activeTab]: newTopics,
    });
  };

  const handleSearchItemSelect = (topicIndex, subtopic, checked) => {
    const newTopics = [...(topicsByTab[activeTab] || [])];
    if (checked) {
      if (!newTopics[topicIndex].selectedSearchItems.includes(subtopic)) {
        newTopics[topicIndex].selectedSearchItems.push(subtopic);
      }
    } else {
      newTopics[topicIndex].selectedSearchItems = newTopics[
        topicIndex
      ].selectedSearchItems.filter((item) => item !== subtopic);
    }
    setTopicsByTab({
      ...topicsByTab,
      [activeTab]: newTopics,
    });
  };

  const addSelectedSubtopics = (topicIndex) => {
    const newTopics = [...(topicsByTab[activeTab] || [])];
    const selectedItems = newTopics[topicIndex].selectedSearchItems;

    selectedItems.forEach((item) => {
      if (!newTopics[topicIndex].subtopics.includes(item)) {
        newTopics[topicIndex].subtopics.push(item);
      }
    });

    newTopics[topicIndex].searchTerm = "";
    newTopics[topicIndex].searchResults = [];
    newTopics[topicIndex].selectedSearchItems = [];

    setTopicsByTab({
      ...topicsByTab,
      [activeTab]: newTopics,
    });
  };

  const removeSubtopic = (topicIndex, subtopicIndex) => {
    const newTopics = [...(topicsByTab[activeTab] || [])];
    newTopics[topicIndex].subtopics.splice(subtopicIndex, 1);
    setTopicsByTab({
      ...topicsByTab,
      [activeTab]: newTopics,
    });
  };

  const toggleTopicExpansion = (index) => {
    if (expandedTopics.includes(index)) {
      setExpandedTopics(expandedTopics.filter((i) => i !== index));
    } else {
      setExpandedTopics([...expandedTopics, index]);
    }
  };

  const addWeightage = () => {
    setShowWeightage(true);
    // Don't force equal distribution - let users set their own values
    // Users can manually enter any weightage they want
  };

  const removeWeightage = () => {
    setShowWeightage(false);
    const newTopics = (topicsByTab[activeTab] || []).map((topic) => ({
      ...topic,
      weight: 0,
    }));
    setTopicsByTab({
      ...topicsByTab,
      [activeTab]: newTopics,
    });
  };

  const availableTopics = allTopics.filter(
    (topic) =>
      !(topicsByTab[activeTab] || []).some(
        (selectedTopic) => selectedTopic.name === topic
      )
  );

  // Create tab items dynamically based on stages
  const tabItems = stages.map((stage) => ({
    key: stage.id.toString(),
    label: stage.name,
  }));

  // Transform data to API format, sending syllabus with topics based on stages
  const transformDataForAPI = () => {
    const topics = [];
    
    stages.forEach((stage) => {
      const stageTopics = topicsByTab[stage.id.toString()] || [];
      stageTopics.forEach((topic) => {
        topics.push({
          name: topic.name,
          weight: topic.weight,
          subtopics: topic.subtopics || [],
          stage: stage.name
        });
      });
    });
    
    return { syllabus: { topics, subjects } };
  };

  // Check if weightage total is 100%
  const isWeightageValid = () => {
    // Remove strict validation - allow any weightage total
    return true;
  };

  // Get weightage total for display
  const getWeightageTotal = () => {
    const currentTopics = topicsByTab[activeTab] || [];
    return currentTopics.reduce((sum, topic) => sum + (topic.weight || 0), 0);
  };

  // Modified saveSyllabus function to handle create or update
  const saveSyllabus = async () => {
    // Validate subjects
    if (subjects.length === 0) {
      message.warning("Please select at least one subject before saving.");
      return;
    }

    // Remove weightage validation - allow any weightage values
    // if (showWeightage && !isWeightageValid()) {
    //   message.error(`Weightage total must be 100%. Current total: ${getWeightageTotal()}%`);
    //   return;
    // }

    const data = transformDataForAPI();
    const topics = data.syllabus.topics;

    if (!Array.isArray(topics) || topics.length === 0) {
      message.warning(
        "Please select at least one topic in any stage before saving."
      );
      return;
    }

    // Check if all stages have at least one topic
    const stagesWithoutTopics = stages.filter(stage => {
      const stageTopics = topicsByTab[stage.id.toString()] || [];
      return stageTopics.length === 0;
    });

    if (stagesWithoutTopics.length > 0) {
      const stageNames = stagesWithoutTopics.map(stage => stage.name).join(', ');
      message.warning(
        `Please add at least one topic to the following stage(s): ${stageNames}`
      );
      return;
    }

    setLoading(true);

    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      // Log the payload for debugging
      console.log("Payload being sent to API:", JSON.stringify(data, null, 2));

      const raw = JSON.stringify(data);

      if (!competitionId) {
        message.error("Competition ID is required to save syllabus");
        return;
      }

      const requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      const url = `https://api.prodigiedu.com/api/competitions/updatesyllabus/${competitionId}`;

      const response = await fetch(url, requestOptions);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const result = await response.json();
      console.log("Syllabus saved/updated successfully:", result);
      message.success("Syllabus saved successfully!");

      fun(2, competitionId);
    } catch (error) {
      console.error("Error:", error);
      message.error("Failed to save syllabus. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch syllabus and update state
  const getsyllabus = async () => {
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
      console.log("Fetched syllabus:", result);

      // Extract stages from overviewdata
      if (result.overviewdata && Array.isArray(result.overviewdata.stages)) {
        const stagesData = result.overviewdata.stages;
        setStages(stagesData);
        
        // Initialize topicsByTab for each stage
        const initialTopicsByTab = {};
        stagesData.forEach((stage) => {
          initialTopicsByTab[stage.id.toString()] = [];
        });
        
        // Set the first stage as active tab if available
        if (stagesData.length > 0 && !activeTab) {
          setActiveTab(stagesData[0].id.toString());
        }
        
        // Process existing topics if any
        if (result.success && result.data && Array.isArray(result.data.topics)) {
          const topics = result.data.topics;
          console.log("Fetched topics from API:", topics);
          
          if (topics.length > 0) {
            // Group topics by stage
            stagesData.forEach((stage) => {
              const stageTopics = topics
                .filter((topic) => {
                  // Match by stage name or if stage is not defined, put in first stage
                  return topic.stage === stage.name || (!topic.stage && stage === stagesData[0]);
                })
                .map((topic) => ({
                  name: topic.name,
                  weight: topic.weight || 0,
                  subtopics: topic.subtopics || [],
                  searchTerm: "",
                  searchResults: [],
                  selectedSearchItems: [],
                }));
              
              initialTopicsByTab[stage.id.toString()] = stageTopics;
            });
          }
        }

        // Process existing subjects if any
        if (result.success && result.data && Array.isArray(result.data.subjects)) {
          setSubjects(result.data.subjects);
        }
        
        setTopicsByTab(initialTopicsByTab);
      } else {
        console.warn("No stages found in overviewdata");
        message.error("No stages found for this competition");
      }
    } catch (error) {
      console.error("Error fetching syllabus:", error);
      message.error("Failed to fetch syllabus. Please try again.");
    }
  };

  useEffect(() => {
    if (competitionId) {
      getsyllabus();
    }
  }, [competitionId]);

  // Update active tab when stages change
  useEffect(() => {
    if (stages.length > 0 && !activeTab) {
      setActiveTab(stages[0].id.toString());
    }
  }, [stages, activeTab]);

  // Check if all stages have topics for save button state
  const allStagesHaveTopics = stages.length > 0 && stages.every(stage => {
    const stageTopics = topicsByTab[stage.id.toString()] || [];
    return stageTopics.length > 0;
  });

  return (
    <div>
      <Card
        style={{
          margin: "0 auto",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        {stages.length > 0 && (
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
            style={{ marginBottom: "32px" }}
          />
        )}

        <Title
          level={3}
          style={{
            marginBottom: "32px",
            fontWeight: "normal",
            fontSize: "28px",
          }}
        >
          Syllabus
        </Title>

        {stages.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <Text>No stages found for this competition. Please add stages first.</Text>
          </div>
        ) : (
          <Form layout="vertical">
            {/* Subjects Field */}
            <Row gutter={24} align="middle" style={{ marginBottom: "32px" }}>
              <Col span={24}>
                <Form.Item
                  label={
                    <span style={{ fontSize: "16px", fontWeight: "500" }}>
                      Subjects<span style={{ color: "red" }}>*</span>
                    </span>
                  }
                  style={{ marginBottom: 0 }}
                >
                  <Select
                    mode="multiple"
                    placeholder="Select All Subjects"
                    style={{ width: "100%" }}
                    suffixIcon={<DownOutlined />}
                    size="large"
                    value={subjects}
                    onChange={setSubjects}
                  >
                    {allSubjects.map((subject, index) => (
                      <Option key={index} value={subject}>
                        {subject}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            {/* Topics Field */}
            <Row gutter={24} align="middle" style={{ marginBottom: "32px" }}>
              <Col span={24}>
                <Form.Item
                  label={
                    <span style={{ fontSize: "16px", fontWeight: "500" }}>
                      Topics<span style={{ color: "red" }}>*</span>
                    </span>
                  }
                  style={{ marginBottom: 0 }}
                >
                  <Select
                    placeholder="Select All Topics"
                    style={{ width: "100%" }}
                    suffixIcon={<DownOutlined />}
                    size="large"
                    value={selectedTopicFromDropdown}
                    onChange={handleTopicSelect}
                    onSelect={() => setSelectedTopicFromDropdown(null)}
                  >
                    {availableTopics.map((topic, index) => (
                      <Option key={index} value={topic}>
                        {topic}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            {(topicsByTab[activeTab] || []).length > 0 && (
              <div style={{ marginBottom: "32px" }}>
                {(topicsByTab[activeTab] || []).map((topic, index) => (
                  <div key={index} style={{ marginBottom: "2px" }}>
                    <Row
                      align="middle"
                      style={{
                        padding: "16px 20px",
                        backgroundColor: "#fff",
                        border: "1px solid #d9d9d9",
                        borderRadius: "6px",
                        marginBottom: expandedTopics.includes(index) ? 0 : "8px",
                      }}
                    >
                      <Col span={12}>
                        <Text style={{ fontSize: "16px", fontWeight: "500" }}>
                          {topic.name}
                        </Text>
                      </Col>
                      <Col span={3}>
                        <Button
                          type="text"
                          icon={
                            expandedTopics.includes(index) ? (
                              <CaretUpOutlined />
                            ) : (
                              <CaretDownOutlined />
                            )
                          }
                          onClick={() => toggleTopicExpansion(index)}
                          style={{ color: "#666" }}
                        />
                      </Col>
                      <Col span={3}>
                        <Button
                          type="text"
                          icon={<CloseOutlined />}
                          onClick={() => handleTopicRemove(index)}
                          style={{ color: "#666" }}
                        />
                      </Col>

                      {showWeightage && (
                        <Col span={6}>
                          <Row gutter={8} align="middle">
                            <Col span={12}>
                              <Input
                                value={topic.weight}
                                onChange={(e) =>
                                  handleWeightChange(index, e.target.value)
                                }
                                style={{ textAlign: "center" }}
                                size="large"
                              />
                            </Col>
                            <Col span={12}>
                              <Text style={{ fontSize: "16px" }}>%</Text>
                            </Col>
                          </Row>
                        </Col>
                      )}
                    </Row>

                    {expandedTopics.includes(index) && (
                      <div
                        style={{
                          backgroundColor: "#fafafa",
                          border: "1px solid #d9d9d9",
                          borderTop: "none",
                          borderRadius: "0 0 6px 6px",
                          padding: "20px",
                          marginBottom: "8px",
                        }}
                      >
                        <Row
                          gutter={16}
                          style={{ marginBottom: "16px" }}
                          className="search-subjects"
                        >
                          <Col span={20}>
                            <Input
                              placeholder="Search subtopics"
                              prefix={<SearchOutlined />}
                              value={topic.searchTerm}
                              onChange={(e) =>
                                handleSearchChange(index, e.target.value)
                              }
                              size="large"
                            />
                          </Col>
                          <Col span={4}>
                            {topic.selectedSearchItems.length > 0 && (
                              <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => addSelectedSubtopics(index)}
                                size="large"
                                style={{ background: "#4CAF50", color: "#fff" }}
                              >
                                Add
                              </Button>
                            )}
                          </Col>
                        </Row>

                        {topic.searchResults.length > 0 && (
                          <div
                            style={{
                              marginBottom: "16px",
                              maxHeight: "200px",
                              overflowY: "auto",
                              border: "1px solid #d9d9d9",
                              borderRadius: "4px",
                              backgroundColor: "#fff",
                            }}
                          >
                            <List
                              size="small"
                              dataSource={topic.searchResults}
                              renderItem={(item) => (
                                <List.Item style={{ padding: "8px 16px" }}>
                                  <Checkbox
                                    className="vvvvv"
                                    checked={topic.selectedSearchItems.includes(
                                      item
                                    )}
                                    onChange={(e) =>
                                      handleSearchItemSelect(
                                        index,
                                        item,
                                        e.target.checked
                                      )
                                    }
                                  >
                                    {item}
                                  </Checkbox>
                                </List.Item>
                              )}
                            />
                          </div>
                        )}

                        {topic.subtopics.length > 0 && (
                          <div>
                            <Text
                              strong
                              style={{ display: "block", marginBottom: "8px" }}
                            >
                              Selected Subtopics:
                            </Text>
                            <Space wrap>
                              {topic.subtopics.map((subtopic, subIndex) => (
                                <Tag
                                  key={subIndex}
                                  closable
                                  onClose={() => removeSubtopic(index, subIndex)}
                                  style={{
                                    fontSize: "14px",
                                    padding: "4px 8px",
                                    border: "1px solid #4CAF50",
                                    borderRadius: "999px",
                                    color: "#4CAF50",
                                  }}
                                >
                                  {subtopic}
                                </Tag>
                              ))}
                            </Space>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Weightage Controls */}
            {(topicsByTab[activeTab] || []).length > 0 && (
              <div
                style={{
                  marginBottom: "40px",
                  display: "flex",
                  justifyContent: "end",
                  alignItems: "center",
                }}
              >
                {/* <div>
                  {showWeightage && (
                    <Text style={{ color: "#666", fontSize: "14px" }}>
                      Total Weightage: {getWeightageTotal()}%
                      <span style={{ color: "#1890ff", marginLeft: "8px" }}>
                        (Flexible - can be any percentage)
                      </span>
                    </Text>
                  )}
                </div> */}
                <div style={{ textAlign: "end"  }}>
                  {!showWeightage ? (
                    <Button
                      type="link"
                      onClick={addWeightage}
                      style={{
                        padding: 0,
                        color: "#1890ff",
                        fontSize: "16px",
                        textAlign: "end",
                      }}
                    >
                      Add Weightage
                    </Button>
                  ) : (
                    <Button
                      type="link"
                      onClick={removeWeightage}
                      style={{
                        padding: 0,
                        color: "#1890ff",
                        fontSize: "16px",
                        textAlign: "end",
                      }}
                    >
                      Remove Weightage
                    </Button>
                  )}
                </div>
              </div>
            )}

            <div style={{ textAlign: "right" }}>
              <Button
                type="primary"
                size="large"
                style={{
                  backgroundColor: allStagesHaveTopics ? "#4CAF50" : "#d9d9d9",
                  color: allStagesHaveTopics ? "#fff" : "#666",
                  fontWeight: "normal",
                  fontSize: "16px",
                  height: "48px",
                  paddingLeft: "32px",
                  paddingRight: "32px",
                }}
                onClick={saveSyllabus}
                loading={loading}
                disabled={!allStagesHaveTopics}
              >
                Save and Continue
              </Button>
            </div>
          </Form>
        )}
      </Card>
    </div>
  );
};

export default OSyllabus;