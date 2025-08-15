import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { ChevronDown, X } from "lucide-react";
import "./OverviewZero.css";
import JoditEditor from "jodit-react";
import {
  Input,
  Button,
  Select,
  DatePicker,
  Checkbox,
  Radio,
  Space,
  Row,
  Col,
  Typography,
  Card,
  Modal,
} from "antd";
import { CiCirclePlus } from "react-icons/ci";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";

const { Option } = Select;
const { Title, Text } = Typography;

const Orightcontaint = ({ fun, ID }) => {
  const { id } = useParams();
  const [showImage, setShowImage] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const editor = useRef(null);
  const userData = JSON.parse(localStorage.getItem("user_Data"));
  const userId = userData?._id;
  
  // Use ID from props if available, otherwise use id from params
  const competitionId = ID || id;

  const [competitionData, setCompetitionData] = useState({
    name: "",
    image: "",
    description: "",
           stages: [
         {
           id: Date.now(),
           name: "",
           date: "",
           endDate: "",
           mode: "Online",
           participation: "Individual",
           location: ["India"],
           duration: "",
         },
       ],
  });

  const [isFormValid, setIsFormValid] = useState(false);
  const locationOptions = ["India"];

  // Strip HTML to plain text
  const stripHtml = (html) => {
    if (!html) return "";
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  // JoditEditor configuration - using useMemo to prevent re-creation
  const editorConfig = useMemo(() => ({
    placeholder:
      "Tell the students about the competition and why they should register for this one.",
    height: 400,
    toolbarAdaptive: false,
    buttons: [
      "bold",
      "italic",
      "underline",
      "|",
      "ul",
      "ol",
      "|",
      "outdent",
      "indent",
      "|",
      "font",
      "fontsize",
      "brush",
      "paragraph",
      "|",
      "image",
      "table",
      "link",
      "|",
      "align",
      "undo",
      "redo",
      "|",
      "hr",
      "eraser",
      "copyformat",
    ],
    removeButtons: ["fullsize", "about"],
    uploader: {
      insertImageAsBase64URI: true,
    },
    style: {
      fontSize: "14px",
    },
  }), []);

  // Update competition field - using useCallback to prevent re-creation
  const updateCompetitionField = useCallback((field, value) => {
    setCompetitionData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

     // Add a new stage
   const addStage = useCallback(() => {
     const newStage = {
       id: Date.now(),
       name: "",
       date: "",
       endDate: "",
       mode: "Online",
       participation: "Individual",
       location: ["India"],
       duration: "",
     };
     setCompetitionData((prev) => ({
       ...prev,
       stages: [...prev.stages, newStage],
     }));
   }, []);

  // Remove a stage
  const removeStage = useCallback((stageId) => {
    setCompetitionData((prev) => ({
      ...prev,
      stages: prev.stages.filter((stage) => stage.id !== stageId),
    }));
  }, []);

  // Update stage field
  const updateStage = useCallback((stageId, field, value) => {
    setCompetitionData((prev) => ({
      ...prev,
      stages: prev.stages.map((stage) =>
        stage.id === stageId ? { ...stage, [field]: value } : stage
      ),
    }));
  }, []);

  // Handle image upload
  const handleImageUpload = useCallback((event) => {
    console.log("Image upload triggered", event.target.files);
    const file = event.target.files[0];
    if (file) {
      console.log("File selected:", file.name, file.size, file.type);
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log("File read complete");
        setShowImage(reader.result);
        setFileName(file.name);
        const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
        setFileSize(sizeInMB);
        setCompetitionData((prev) => ({
          ...prev,
          image: file,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      console.log("No file selected");
    }
  }, []);

  // Remove uploaded image
  const handleRemoveImage = useCallback(() => {
    setShowImage("");
    setFileName("");
    setFileSize(0);
    setCompetitionData((prev) => ({
      ...prev,
      image: "",
    }));
  }, []);

  // Handle editor content change - using useCallback to prevent re-creation
  const handleEditorChange = useCallback((newContent) => {
    setCompetitionData((prev) => ({
      ...prev,
      description: newContent,
    }));
  }, []);

  // Validate form
  useEffect(() => {
    const isOverviewValid =
      competitionData.name.trim() !== "" &&
      stripHtml(competitionData.description).trim() !== "" &&
      competitionData.image !== "";

    const areStagesValid = competitionData.stages.every(
      (stage) =>
        stage.name.trim() !== "" &&
        stage.date !== "" &&
        stage.mode.trim() !== "" &&
        stage.participation.trim() !== "" &&
        stage.location.length > 0 &&
        stage.duration.trim() !== ""
    );

    setIsFormValid(isOverviewValid && areStagesValid);
  }, [competitionData]);

  // Fetch overview data if ID exists
  const getOverview = async () => {
    if (!competitionId) return;
    // alert(competitionId)
    // Check localStorage first
    const localKey = `competition_overview_${competitionId}`;
    const saved = localStorage.getItem(localKey);
    // alert(saved)
    if (saved) {
      setCompetitionData(JSON.parse(saved));
      // Also set image preview if available
      const savedData = JSON.parse(saved);
      if (savedData.image && typeof savedData.image === "string") {
        setShowImage(savedData.image);
        setFileName(savedData.image.split("/").pop() || "Uploaded Image");
      }
      // return;
    }
    try {
      const response = await fetch(
        `https://api.prodigiedu.com/api/competitions/getoverview/${competitionId}`,
        {
          method: "GET",
          redirect: "follow",
        }
      );
      const result = await response.json();
      console.log("API Response:", result); // Debug: Log API response
      if (result.success && result.data) {
        const fetchedData = result.data;
        // Normalize stages to ensure all required fields
        const normalizedStages = fetchedData.stages?.length
          ? fetchedData.stages.map((stage, index) => ({
              id: stage.id || Date.now() + index, // Ensure unique ID
              name: stage.name || "",
              date: stage.date ? dayjs(stage.date).format("YYYY-MM-DD") : "",
              endDate: stage.endDate
                ? dayjs(stage.endDate).format("YYYY-MM-DD")
                : "",
              mode: stage.mode || "Online",
              participation: stage.participation || "Individual",
              location: Array.isArray(stage.location)
                ? stage.location
                : ["India"],
                             duration: stage.duration || "",
            }))
          : [
              {
                id: Date.now(),
                name: "",
                date: "",
                endDate: "",
                mode: "Online",
                participation: "Individual",
                location: ["India"],
                duration: "",
              },
            ];

        const updatedCompetitionData = {
          name: fetchedData.name || "",
          description: fetchedData.description || "",
          image: fetchedData.image || "",
          stages: normalizedStages,
        };

        setCompetitionData(updatedCompetitionData);
        console.log("Updated competitionData:", updatedCompetitionData); // Debug: Log state

        if (fetchedData.image) {
          // Assuming image is a relative path; prepend base URL if needed
          const imageUrl = fetchedData.image.startsWith("http")
            ? fetchedData.image
            : `https://api.prodigiedu.com${fetchedData.image}`;
          setShowImage(imageUrl);
          setFileName(fetchedData.image.split("/").pop() || "Uploaded Image");
          setFileSize(fetchedData.imageSize || 0); // Update if API provides imageSize
        }

        // Save to localStorage
        localStorage.setItem(localKey, JSON.stringify(updatedCompetitionData));
      } else {
        console.error("No valid data found in response:", result);
      }
    } catch (error) {
      console.error("Error fetching overview:", error);
    }
  };

  useEffect(() => {
    getOverview();
  }, [competitionId]);

  // Persist competitionData to localStorage on change
  useEffect(() => {
    if (competitionId) {
      const localKey = `competition_overview_${competitionId}`;
      localStorage.setItem(localKey, JSON.stringify(competitionData));
    }
  }, [competitionData, competitionId]);

  // Save or update competition data
  const handleSave = useCallback(async () => {
    try {
      const formdata = new FormData();
      formdata.append("organizerId", userId);
      formdata.append("name", competitionData.name);
      formdata.append("description", stripHtml(competitionData.description));
      if (competitionData.image && typeof competitionData.image !== "string") {
        formdata.append("image", competitionData.image);
      }
      formdata.append("user_id", userId);
      formdata.append("stages", JSON.stringify(competitionData.stages));

      const url = competitionId
        ? `https://api.prodigiedu.com/api/competitions/updateoverview/${competitionId}`
        : `https://api.prodigiedu.com/api/competitions/overview`;

      const method = competitionId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: formdata,
        redirect: "follow",
      });

      const result = await response.json();
      console.log("Save/Update Response:", result); // Debug: Log API response
      
      // Pass the ID to next step - use existing ID for updates, new ID for creates
      const resultId = competitionId || result._id;
      // Clear localStorage for this step on successful save
      if (competitionId) {
        localStorage.removeItem(`competition_overview_${competitionId}`);
      } else if (result._id) {
        localStorage.removeItem(`competition_overview_${result._id}`);
      }
      fun(1, resultId);
    } catch (error) {
      console.error(`${competitionId ? "Update" : "Save"} error:`, error);
    }
  }, [competitionData, userId, competitionId, fun]);

  const [deleteModal, setDeleteModal] = useState({ open: false, stageId: null });

  return (
    <div style={{ padding: "24px", backgroundColor: "#fff" }}>
      <Title
        level={2}
        style={{ marginBottom: "24px", color: "#000", fontWeight: 500 }}
      >
        Competition Overview
      </Title>

      <Row gutter={24} style={{ marginBottom: "24px" }}>
        <Col span={12}>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Text strong style={{ color: "#000" }}>
              Name<span style={{ color: "#ef4444" }}>*</span>
            </Text>
            <Input
              placeholder="Create a unique name for your competition"
              value={competitionData.name}
              onChange={(e) => updateCompetitionField("name", e.target.value)}
              size="large"
            />
          </Space>
        </Col>
        <Col span={12}>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Text strong style={{ color: "#000" }}>
              Image<span style={{ color: "#4CAF50" }}>*</span>
            </Text>
            <div>
                             <input
                 type="file"
                 accept="image/*"
                 onChange={handleImageUpload}
                 style={{ display: "none" }}
                 id="image-upload"
                 ref={(input) => {
                   if (input) {
                     console.log("File input ref set:", input);
                   }
                 }}
               />
              {!showImage ? (
                                 <Button
                   type="primary"
                   icon={<CiCirclePlus size={16} />}
                   onClick={() => {
                     console.log("Upload button clicked");
                     const fileInput = document.getElementById("image-upload");
                     console.log("File input element:", fileInput);
                     if (fileInput) {
                       fileInput.click();
                     } else {
                       console.error("File input not found");
                     }
                   }}
                   size="large"
                   style={{
                     backgroundColor: "#4CAF50",
                     borderColor: "#10b981",
                     borderRadius: "8px",
                     height: "40px",
                     display: "flex",
                     alignItems: "center",
                     gap: "8px",
                     fontWeight: "500",
                   }}
                 >
                   Upload Image
                 </Button>
              ) : (
                                 <div style={{ 
                   display: "flex", 
                   alignItems: "center", 
                   gap: "16px",
                   padding: "12px",
                   border: "1px solid #e5e7eb",
                   borderRadius: "8px",
                   backgroundColor: "#f9fafb"
                 }}>
                   <img
                     src={showImage}
                     alt="Competition"
                     style={{ 
                       width: "60px", 
                       height: "60px", 
                       objectFit: "cover",
                       borderRadius: "8px"
                     }}
                   />
                   <div style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
                     <Text style={{ fontWeight: "600", fontSize: "14px", color: "#000" }}>
                       {fileName}
                     </Text>
                     <Text style={{ fontSize: "12px", color: "#6b7280" }}>
                       {fileSize} MB
                     </Text>
                   </div>
                   <Button
                     type="text"
                     size="small"
                     icon={<X size={16} />}
                     onClick={handleRemoveImage}
                     style={{
                       color: "#ef4444",
                       border: "1px solid #ef4444",
                       borderRadius: "6px",
                       minWidth: "32px",
                       height: "32px",
                     }}
                   />
                 </div>
              )}
            </div>
          </Space>
        </Col>
      </Row>

      <div style={{ marginBottom: "32px" }}>
        <Text
          strong
          style={{
            color: "#000",
            fontSize: "16px",
            display: "block",
            marginBottom: "12px",
          }}
        >
          Competition Description<span style={{ color: "#ef4444" }}>*</span>
        </Text>
        <Card
          style={{
            boxShadow: "0px 0px 20px 0px #00000012",
            borderRadius: "12px",
            border: "1px solid #f0f0f0",
          }}
        >
          <JoditEditor
            ref={editor}
            value={competitionData.description}
            config={editorConfig}
            onChange={handleEditorChange}
          />
        </Card>
      </div>

      <div>
        <Title level={3} style={{ marginBottom: "16px", color: "#000" }}>
          Stages
        </Title>

        <Space direction="vertical" style={{ width: "100%" }} size="large">
          {competitionData.stages.map((stage, index) => (
            <Card
              key={stage.id}
              style={{
                boxShadow: "0px 0px 20px 0px #00000012",
                borderRadius: "12px",
              }}
              bodyStyle={{ padding: "24px" }}
            >
              <div className="stage-header-container">
                <Title level={4} className="stage-title">
                  Stage {index + 1}
                </Title>
                {competitionData.stages.length > 1 && (
                  <Button
                    type="text"
                    size="small"
                    icon={<X size={16} />}
                    onClick={() => setDeleteModal({ open: true, stageId: stage.id })}
                    className="remove-stage-btn"
                  />
                )}
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "24px",
                }}
              >
                {/* Name Field */}
                <div
                  style={{ display: "flex", alignItems: "center", gap: "32px" }}
                >
                  <div style={{ minWidth: "80px" }}>
                    <Text strong style={{ color: "#000", fontSize: "14px" }}>
                      Name<span style={{ color: "#ef4444" }}>*</span>
                    </Text>
                  </div>
                  <div style={{ flex: 1 }}>
                    <Input
                      placeholder="Name of the Stage"
                      value={stage.name}
                      onChange={(e) =>
                        updateStage(stage.id, "name", e.target.value)
                      }
                      size="large"
                      style={{ fontSize: "14px", height: "40px" }}
                    />
                  </div>
                </div>

                {/* Date Field */}
                <div
                  style={{ display: "flex", alignItems: "center", gap: "32px" }}
                >
                  <div style={{ minWidth: "80px" }}>
                    <Text strong style={{ color: "#000", fontSize: "14px" }}>
                      Date<span style={{ color: "#ef4444" }}>*</span>
                    </Text>
                  </div>
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                    }}
                  >
                                         <DatePicker
                       placeholder="Select"
                       value={stage.date ? dayjs(stage.date) : null}
                       onChange={(date, dateString) =>
                         updateStage(stage.id, "date", dateString)
                       }
                       size="large"
                       style={{ width: "160px", height: "40px" }}
                       format="YYYY-MM-DD"
                       disabledDate={(current) => {
                         return current && current < dayjs().startOf('day');
                       }}
                     />
                    {stage.endDate && (
                      <>
                        <Text
                          style={{
                            color: "#666",
                            fontSize: "14px",
                            margin: "0 8px",
                          }}
                        >
                          to
                        </Text>
                                                 <DatePicker
                           placeholder="Select"
                           value={stage.endDate ? dayjs(stage.endDate) : null}
                           onChange={(date, dateString) =>
                             updateStage(stage.id, "endDate", dateString)
                           }
                           size="large"
                           style={{ width: "160px", height: "40px" }}
                           format="YYYY-MM-DD"
                           disabledDate={(current) => {
                             return current && current < dayjs(stage.date).startOf('day');
                           }}
                         />
                      </>
                    )}
                    <Checkbox
                      checked={!!stage.endDate}
                      onChange={(e) => {
                        if (e.target.checked) {
                          const endDateValue =
                            stage.date || dayjs().format("YYYY-MM-DD");
                          updateStage(stage.id, "endDate", endDateValue);
                        } else {
                          updateStage(stage.id, "endDate", "");
                        }
                      }}
                      style={{ marginLeft: "16px" }}
                    >
                      <Text style={{ color: "#757575", fontSize: "14px" }}>
                        Add a Date Range
                      </Text>
                    </Checkbox>
                  </div>
                </div>

                {/* Mode and Participation Row */}
                <div
                  style={{ display: "flex", alignItems: "center", gap: "32px" }}
                >
                  <div style={{ minWidth: "80px" }}>
                    <Text strong style={{ color: "#000", fontSize: "14px" }}>
                      Mode<span style={{ color: "#ef4444" }}>*</span>
                    </Text>
                  </div>
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: "80px",
                    }}
                  >
                                         <div
                       style={{
                         display: "flex",
                         gap: "8px",
                       }}
                     >
                                               <button
                          onClick={() => updateStage(stage.id, "mode", "Online")}
                          style={{
                            padding: "8px 24px",
                            fontSize: "14px",
                            fontWeight: "500",
                            border: "1px solid #10b981",
                            cursor: "pointer",
                            backgroundColor: stage.mode === "Online" ? "#4CAF50" : "transparent",
                            color: stage.mode === "Online" ? "#ffffff" : "#4CAF50",
                            borderRadius: "25px",
                            transition: "all 0.2s ease",
                            minWidth: "80px",
                          }}
                        >
                          Online
                        </button>
                        <button
                          onClick={() => updateStage(stage.id, "mode", "Offline")}
                          style={{
                            padding: "8px 24px",
                            fontSize: "14px",
                            fontWeight: "500",
                            border: "1px solid #10b981",
                            cursor: "pointer",
                            backgroundColor: stage.mode === "Offline" ? "#4CAF50" : "transparent",
                            color: stage.mode === "Offline" ? "#ffffff" : "#4CAF50",
                            borderRadius: "25px",
                            transition: "all 0.2s ease",
                            minWidth: "80px",
                          }}
                        >
                          Offline
                        </button>
                     </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "20px",
                      }}
                    >
                      <Text
                        strong
                        style={{
                          color: "#000",
                          fontSize: "14px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Participation<span style={{ color: "#ef4444" }}>*</span>
                      </Text>
                                             <div
                         style={{
                           display: "flex",
                           gap: "8px",
                         }}
                       >
                                                   <button
                            onClick={() => updateStage(stage.id, "participation", "Individual")}
                            style={{
                              padding: "8px 24px",
                              fontSize: "14px",
                              fontWeight: "500",
                              border: "1px solid #10b981",
                              cursor: "pointer",
                              backgroundColor: stage.participation === "Individual" ? "#4CAF50" : "transparent",
                              color: stage.participation === "Individual" ? "#ffffff" : "#4CAF50",
                              borderRadius: "25px",
                              transition: "all 0.2s ease",
                              minWidth: "80px",
                            }}
                          >
                            Individual
                          </button>
                                                     <button
                             onClick={() => updateStage(stage.id, "participation", "School")}
                             style={{
                               padding: "8px 24px",
                               fontSize: "14px",
                               fontWeight: "500",
                               border: "1px solid #10b981",
                               cursor: "pointer",
                               backgroundColor: stage.participation === "School" ? "#4CAF50" : "transparent",
                               color: stage.participation === "School" ? "#ffffff" : "#4CAF50",
                               borderRadius: "25px",
                               transition: "all 0.2s ease",
                               minWidth: "80px",
                             }}
                           >
                             School
                           </button>
                       </div>
                    </div>
                  </div>
                </div>

                {/* Locations Field */}
                <div
                  style={{ display: "flex", alignItems: "center", gap: "32px" }}
                >
                  <div style={{ minWidth: "80px" }}>
                    <Text strong style={{ color: "#000", fontSize: "14px" }}>
                      Locations<span style={{ color: "#ef4444" }}>*</span>
                    </Text>
                  </div>
                  <div style={{ flex: 1, maxWidth: "300px" }}>
                    <Select
                      mode="multiple"
                      placeholder="Select locations"
                      value={stage.location}
                      onChange={(value) =>
                        updateStage(stage.id, "location", value)
                      }
                      style={{ width: "100%" }}
                      size="large"
                      suffixIcon={<ChevronDown size={16} />}
                    >
                      {locationOptions.map((location) => (
                        <Option key={location} value={location}>
                          {location}
                        </Option>
                      ))}
                    </Select>
                  </div>
                </div>

                {/* Duration Field */}
                <div
                  style={{ display: "flex", alignItems: "center", gap: "32px" }}
                >
                  <div style={{ minWidth: "80px" }}>
                    <Text strong style={{ color: "#000", fontSize: "14px" }}>
                      Duration<span style={{ color: "#ef4444" }}>*</span>
                    </Text>
                  </div>
                  <div style={{ flex: 1, maxWidth: "300px" }}>
                                         <Input
                       placeholder="Enter Duration"
                       value={stage.duration}
                       onChange={(e) =>
                         updateStage(stage.id, "duration", e.target.value)
                       }
                       size="large"
                       style={{ fontSize: "14px", height: "40px" }}
                     />
                  </div>
                </div>
              </div>
            </Card>
          ))}

                                                                                       <Button
               onClick={addStage}
               icon={<CiCirclePlus size={16} />}
               size="large"
               style={{
                 backgroundColor: "#ffffff",
                 color: "#3b82f6",
                 borderRadius: "8px",
                 height: "40px",
                 display: "flex",
                 alignItems: "center",
                 gap: "8px",
                 fontWeight: "500",
                 border: "none",
               }}
             >
               Add Stage
             </Button>
        </Space>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "40px",
        }}
      >
        <Button
          type="primary"
          size="large"
          onClick={handleSave}
          disabled={!isFormValid}
          style={{
            backgroundColor: isFormValid ? "#4CAF50" : "#dadada",
            borderColor: isFormValid ? "#4CAF50" : "#dadada",
            color: isFormValid ? "#fff" : "#888",
            padding: "12px 24px",
          }}
        >
          Save and Continue
        </Button>
      </div>

      <Modal
        open={deleteModal.open}
        onCancel={() => setDeleteModal({ open: false, stageId: null })}
        footer={null}
        centered
      >
        <div style={{ textAlign: "center" }}>
          <h2>Are you sure you want to delete the stage?</h2>
          <p>All details about the stage would be deleted.</p>
          <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 24 }}>
            <Button
              onClick={() => setDeleteModal({ open: false, stageId: null })}
              style={{ borderColor: "#4CAF50", color: "#4CAF50" }}
            >
              No, Back
            </Button>
            <Button
              type="primary"
              style={{ backgroundColor: "#4CAF50", borderColor: "#4CAF50" }}
              onClick={() => {
                removeStage(deleteModal.stageId);
                setDeleteModal({ open: false, stageId: null });
              }}
            >
              Yes, Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Orightcontaint;