import { useEffect, useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import "./schoolHome.css";
import section2 from "../images/Rectangle 157.png";
import "./home.css"

import headerlogo from "../images/headerlogo.png";
import herosec3 from "../images/organiserhome.png";
import { decore, decore1, frame37, frame38, frame40, frame39, socialIcon1, socialIcon2, socialIcon, socialIcon11, sendIcon } from "../assets/images";
import { FaUserCircle } from "react-icons/fa";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import settings from "../images/settings.png";
import AccountHistory from "../images/clock.png";
import LogOut from "../images/sign-out.png";
import Help from "../images/help.png";
import { NavLink } from "react-router-dom";
import Organisersheader from "./Organisersheader";
import OrganiserFooter from "./OrganiserFooter";

const testimonials = [
  {
    name: "Leo",
    title: "Lead Designer",
    message: "It was a very good experience",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cursus nibh mauris, nec turpis orci lectus maecenas. Suspendisse sed magna eget nibh in turpis. Consequat duis diam lacus arcu.",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Jane",
    title: "Lead Developer",
    message: "Amazing platform for organizers",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cursus nibh mauris, nec turpis orci lectus maecenas. Suspendisse sed magna eget nibh in turpis. Consequat duis diam lacus arcu.",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Sam",
    title: "Event Manager",
    message: "Streamlined our events",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cursus nibh mauris, nec turpis orci lectus maecenas. Suspendisse sed magna eget nibh in turpis. Consequat duis diam lacus arcu.",
    image: "https://randomuser.me/api/portraits/men/45.jpg",
  },
];

const featuresData = [
  {
    id: 1,
    title: "Expanded Reach",
    description: "Reach your target audience and scale-up your competitions.",
    img: frame37,
  },
  {
    id: 2,
    title: "Seamless registration",
    description: "Let students register directly in a short and simple flow",
    img: frame38,
    special: true, // mark this for outer shape
  },
  {
    id: 3,
    title: "Gamified practice",
    description:
      "Personalise and gamify your prep material, and get instant insights.",
    img: frame39,
  },
  {
    id: 4,
    title: "Effortless certification",
    description: "Publish certificates instantly to every student",
    img: frame40,
  },
];


const sliderSettings = {
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

function Organiserhome() {

  return (
    <div className="schoolHome">
      <Organisersheader />

      <section className="organiser-hero-section container">
        <div className="row align-items-center">
          {/* Left Content */}
          <div className="col-md-6 organiser-hero-text" style={{ position: "relative", zIndex: 10 }}>
            <p className="organiser-hero-subtitle">Your Competition, Our Technology</p>
            <h2 className="organiser-hero-title">Simplify Process, Deliver Excellence</h2>
            <p className="organiser-hero-description">
              Digitizing Your Competitions for Wider Reach and Efficiency.
              <br /> From Registration to Results — All in One Platform.
            </p>
          </div>

          {/* Right Image */}
          <div className="col-md-6 text-center organiser-hero-image">
            <img
              src={herosec3}
              alt="Winner holding a trophy"
              className="img-fluid"
            />
          </div>
        </div>
      </section>




      <img className="top-images" src={decore} alt="Decorative element" />


      <section className="organiser-features m-5" >
        <h2 className="organiser-features-title">
          One Stop For All Your Competitions
        </h2>

        <div className="organiser-features-grid">
          {featuresData.map((feature) =>
            feature.special ? (
              <div key={feature.id} className="organiser-features-card-wrapper">
                <div className="organiser-features-outer-shap">
                  <img src={section2} alt="" />
                </div>
                <div className="organiser-features-card organiser-features-card-2" style={{ textAlign: "center" }}>
                  <div className="organiser-features-icon">
                    <img src={feature.img} alt={feature.title} />
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              </div>
            ) : (
              <div key={feature.id} className="organiser-features-card" style={{ textAlign: "center" }}>
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
        <section className="testimonials">
          <h2>Testimonials From Schools</h2>
          <div className="testimonial-slider">
            <Slider {...sliderSettings}>
              {testimonials.map((testimonial, index) => (
                <div key={index} className="testimonial-card">
                  <div className="profile">
                    <img
                      src={testimonial.image}
                      alt={`${testimonial.name}'s profile`}
                      className="profile-img"
                    />
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
        <img src={decore1} alt="Decorative element" className="bottom-images" />
      </div> */}
      <OrganiserFooter />
    </div>
  );
}

export default Organiserhome;