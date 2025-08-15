import { useEffect, useState } from "react"
import { ChevronDown, Home, Upload, User, X } from "lucide-react"

import "./OverviewZero.css"

const Oleftsidbar = ({ fun,page,ID }) => {

  const [sidbar, setsidbar] = useState(0)
  const [completionStatus, setCompletionStatus] = useState({
    overview: false,
    syllabus: false,
    pattern: false,
    eligibility: false,
    registration: false,
    awards: false
  })

  const dataGet = async () => {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow"
      };
      
      fetch(`https://api.prodigiedu.com/api/competitions/field-completion/${ID}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log(result)
          if (result.success && result.data.length > 0) {
            const data = result.data[0];
            setCompletionStatus({
              overview: data.overview,
              syllabus: data.syllabus,
              pattern: data.pattern,
              eligibility: data.eligibility,
              registration: data.registration,
              awards: data.awards
            });
          }
        })
        .catch((error) => console.error(error));
    } catch (error) {
      console.log(error)
      
    }
  }

  useEffect(() => {
    dataGet();
    setsidbar(page)
  }, [page])

  return (

    <div className="sidebar">
      <div className="sidebar-title">Competition Name</div>
      <div className="stepper">
        {["Overview", "Syllabus", "Pattern", "Eligibility", "Registration", "Awards"].map((step, index) => {
          const stepKeys = ["overview", "syllabus", "pattern", "eligibility", "registration", "awards"];
          const isCompleted = completionStatus[stepKeys[index]];
          const isActive = index === sidbar;
          
          return (
            <div key={step} onClick={() => {
              fun(index,ID);
              setsidbar(index);
            }} className="step">
              <div className="step-content">
                <div className={`step-indicator 
                  ${isActive ? "active" : ""} 
                  ${isCompleted && !isActive ? "completed" : ""}
                  ${!isCompleted && !isActive ? "incomplete" : ""}`}>
                  {isActive && <div className="step-dot"></div>}
                </div>
                <div className={`step-label ${isActive ? "active" : ""}`}>{step}</div>
              </div>
              {index < 5 && <div className="step-line"></div>}
            </div>
          )
        })}
      </div>

      <button className="upload-button">
        <Upload size={16} />
        <span>Upload Competition Details</span>
      </button>
    </div>)
}

export default Oleftsidbar;