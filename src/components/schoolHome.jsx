import { useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import "./schoolHome.css";
import { Link, useNavigate } from "react-router-dom";

import headerlogo from "../images/headerlogo.png";
import section2 from "../images/section2.png";
import section3 from "../images/Rectangle 157.png";

import herosec2 from "../images/trophy.png";
import Leo from "../images/Leo.png";
import {
  decore,
  decore1,
  frame37,
  frame38,
  frame39,
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
} from "../assets/images";
import Studentheaderhome from "./Studentheaderhome";
import StudentFooter from "./StudentFooter";

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
  centerPadding: "0",
  focusOnSelect: true,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
      },
    },
  ],
};
const featuresData = [
  {
    id: 1,
    title: "Variety of Competitions",
    description: "Built Wicket longer admire do barton vanity itself do in it.",
    img: frame37,
  },
  {
    id: 2,
    title: "Single School Registration",
    description: "Engrossed listening. Park gate sell they west hard for the.",
    img: frame38,
    special: true, // mark this for outer shape
  },
  {
    id: 3,
    title: "Collection of Accolades",
    description:
      "We deliver outsourced aviation services for military customers.",
    img: frame39,
  },
];

function SchoolHome() {
  return (
    <>
      <div className="schoolHome">
        <Studentheaderhome />

        <section className="hero">
          <div className="hero-content">
            <p
              className="subtitle"
              style={{ fontSize: "20px", fontWeight: "700" }}
            >
              Empower your students
            </p>
            <h1 style={{ fontSize: "57px", fontWeight: "700" }}>
              Igniting potential,
              <br />
              Nurturing Winners
            </h1>
            <p className="description">
              Where school talent thrives — in academics, and beyond.
              <br />
              Join us to shape tomorrow's leaders through healthy competition
            </p>
          </div>
          <div className="hero-image">
            <img src={herosec2} alt="Winner with trophy" />
          </div>
        </section>

        <img className="top-images" src={decore} alt="Decore" />

        <section className="organiser-features m-5">
          <h2 className="organiser-features-title">
          Provide the best to your students          </h2>

          <div className="organiser-features-grid1 container">
            {featuresData.map((feature) =>
              feature.special ? (
                <div
                  key={feature.id}
                  className="organiser-features-card-wrapper"
                >
                  <div className="organiser-features-outer-shap">
                    <img src={section3} alt="" />
                  </div>
                  <div
                    className="organiser-features-card organiser-features-card-3"
                    style={{ textAlign: "center" }}
                  >
                    <div className="organiser-features-icon">
                      <img src={feature.img} alt={feature.title} />
                    </div>
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                  </div>
                </div>
              ) : (
                <div
                  key={feature.id}
                  className="organiser-features-card"
                  style={{ textAlign: "center" }}
                >
                  <div className="organiser-features-icon">
                    <img style={{}} src={feature.img} alt={feature.title} />
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              )
            )}
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

        <StudentFooter />
      </div>
    </>
  );
}

export default SchoolHome;
