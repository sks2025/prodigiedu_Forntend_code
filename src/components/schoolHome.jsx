import { useState } from 'react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import './schoolHome.css';
import {Link ,useNavigate} from 'react-router-dom';

import section2 from "../images/section2.png";
import headerlogo from "../images/headerlogo.png";
import herosec2 from "../images/trophy.png";
import Leo from "../images/Leo.png";
import {
    decore,
    decore1,
    frame37,
    frame38,
    // frame39,
    frame40,
    logo,
    logo1,
    logo2,
    logo3,
    logo4,
    logo5,
    logo6,
    socialIcon1,
    socialIcon2,
    socialIcon,
    // socialIcon11,
    sendIcon,
} from '../assets/images'
import Studentheaderhome from './Studentheaderhome';
import StudentFooter from './StudentFooter';

const testimonials = [
    {
      name: "Leo",
      title: "Lead Designer",
      message: "It was a very good experience",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cursus nibh mauris, nec turpis orci lectus maecenas. Suspendisse sed magna eget nibh in turpis. Consequat duis diam lacus arcu. Faucibus venenatis felis id augue sit cursus pellentesque enim arcu. Elementum felis magna pretium in tincidunt. Suspendisse sed magna eget nibh in turpis. Consequat duis diam lacus arcu.",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      name: "Leo",
      title: "Lead Designer",
      message: "It was a very good experience",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cursus nibh mauris, nec turpis orci lectus maecenas. Suspendisse sed magna eget nibh in turpis. Consequat duis diam lacus arcu. Faucibus venenatis felis id augue sit cursus pellentesque enim arcu. Elementum felis magna pretium in tincidunt. Suspendisse sed magna eget nibh in turpis. Consequat duis diam lacus arcu.",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Leo",
      title: "Lead Designer",
      message: "It was a very good experience",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cursus nibh mauris, nec turpis orci lectus maecenas. Suspendisse sed magna eget nibh in turpis. Consequat duis diam lacus arcu. Faucibus venenatis felis id augue sit cursus pellentesque enim arcu. Elementum felis magna pretium in tincidunt. Suspendisse sed magna eget nibh in turpis. Consequat duis diam lacus arcu.",
      image: "https://randomuser.me/api/portraits/men/45.jpg",
    },
];

var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    centerMode: true,
    centerPadding: '0',
    focusOnSelect: true,
    responsive: [
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
            }
        },
        {
            breakpoint: 600,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                arrows: false
            }
        }
    ]
};

function SchoolHome() {
    return (
        <>
        <div className="schoolHome">
            <Studentheaderhome/>

            <section className="hero">
                <div className="hero-content">
                    <p className="subtitle" style={{fontSize: '20px',fontWeight: '700'}}>Empower your students</p>
                    <h1 style={{fontSize: '57px',fontWeight: '700'}}>Igniting potential,<br/>
                    Nurturing Winners</h1>
                    <p className="description">Where school talent thrives — in academics, and beyond.<br/>
                    Join us to shape tomorrow's leaders through healthy competition</p>
                </div>
                <div className="hero-image">
                    <img src={herosec2} alt="Winner with trophy"/>
                </div>
            </section>

            <img className="top-images" src={decore} alt="Decore"/>
            
            <section className="features">
            <img className="section2" style={{zIndex: '-1'}} src={section2} alt="Exam"/>
                <h2 className="features-title">Provide The Best To Your Students</h2>
                <div className="features-grid" style={{display: 'flex',flexDirection: 'row',justifyContent: 'space-between',alignItems: 'center'}}>
                    <div className="feature-card" style={{maxWidth: '320px', width: '100%'}}>
                        <div className="icon">
                            <img src={frame37} alt="Exam"/>
                        </div>
                        <h3 className="pt-3">Variety of Competitions</h3>
                        <p>Get complete visibility and transparency about all competitions in one place.</p>
                    </div>
                    <div className="feature-card-wrapper">
                        <div className='outer-shap'></div>
                        <div className="feature-card feature-card-2 shadow bg-body-tertiary rounded rounded-bl-lg" style={{maxWidth: '320px', width: '100%'}}>
                            <div className="icon">
                                <img src={frame38} alt="Registration"/>
                            </div>
                            <h3 className="pt-3">One-time Onboarding</h3>
                            <p>Onboard once and your students stay connected for all future competitions</p>
                        </div>
                    </div>
                    <div className="feature-card" style={{maxWidth: '320px', width: '100%'}}>
                        <div className="icon">
                            <img src={frame40} alt="Trophy"/>
                        </div>
                        <h3 className="pt-3">Smart Analytics and Insights</h3>
                        <p>Track student preparation, progress, and performance in real-time.</p>
                    </div>
                </div>
            </section>

            {/* <div className="comb-sec">
                <section className="partners">
                    <h2 className="hedi-text">Our Partners</h2>
                    <p>We are partnered with 15+ top exam institutes globally</p>
                    <div className="partners-grid">
                       <div className="item-company"> <img src={logo} alt="Partner"/></div>
                       <div className="item-company"> <img src={logo1} alt="Partner"/></div>
                       <div className="item-company"> <img src={logo2} alt="Partner"/></div>
                       <div className="item-company"> <img src={logo3} alt="Partner"/></div>
                       <div className="item-company"> <img src={logo4} alt="Partner"/></div>
                       <div className="item-company"> <img src={logo5} alt="Partner"/></div>
                       <div className="item-company"> <img src={logo6} alt="Partner"/></div>
                    </div>
                </section>

                <section className="testimonials">
                    <h2>Testimonials From Schools</h2>
                    <div className="testimonial-slider">
                        <Slider {...settings}>
                            {testimonials.map((testimonial, index) => (
                                <div key={index} className="testimonial-card">
                                    <div className="profile">
                                        <img src={Leo} alt={testimonial.name} className="profile-img"/>
                                        <div className="profile-info">
                                            <h4>{testimonial.name}</h4>
                                            <p className="role">{testimonial.title}</p>
                                        </div>
                                    </div>
                                    <h3 className="title">{testimonial.message}</h3>
                                    <p className="testimonial">{testimonial.description}</p>
                                </div>
                            ))}
                        </Slider>
                    </div>
                </section>
                <img src={decore1} alt="Decore" className="bottom-images"/>
            </div> */}

          <StudentFooter/>
            </div>
        </>
    );
}

export default SchoolHome; 