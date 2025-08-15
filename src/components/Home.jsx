
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import section2 from "../images/section2.png";
import { Link } from 'react-router-dom';
import headerlogo from "../images/headerlogo.png";
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
    socialIcon11,
    sendIcon,
} from '../assets/images'
import home from "../images/home.png"
import "./home.css"
import Studentheaderhome from "./Studentheaderhome";
import StudentFooter from "./StudentFooter";

const testimonials = [
    {
        name: "Leo",
        title: "Lead Designer",
        message: "It was a very good experience",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur rhoncus nec tortor vel malesuada. Suspendisse sed magna eget nibh iaculis lacinia.",
        image: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
        name: "Jane",
        title: "Project Manager",
        message: "Super smooth process!",
        description:
            "Suspendisse sed magna eget nibh iaculis lacinia. Fusce ut nisi a quam ultrices fermentum.",
        image: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
        name: "Alex",
        title: "Software Engineer",
        message: "Loved the teamwork",
        description:
            "Elementum felis magna tempus in tristique. Suspendisse sed magna eget nibh in turpis.",
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

function Home() {
    return (
        <>
            <Studentheaderhome />

            <section className="hero">
                <div className="hero-content">
                    <p  style={{fontSize:"20px"}}>PARTICIPATE IN COMPETITIONS ACROSS THE WORLD</p>
                    <h1 style={{ fontSize: '67px', fontWeight: "900" }}>Crafting winners,<br />Creating futures</h1>
                    <p className="description">From first steps to final wins — your journey starts here.<br />
                        Discover your strength and prove your skills!</p>
                </div>
                <div className="hero-image">
                    <img src={home} alt="Winner with trophy" />
                </div>
            </section>

            <img class="top-images" src={decore} alt="Decore" />

            <section class="features">
                <img class="section2" style={{zIndex: '-1'}} src={section2} alt="Exam" />
                <h2 class="features-title">One Stop For All Your Competitions</h2>
                <div class="features-grid">
                    <div class="feature-card">
                        <div class="icon">
                            <img src={frame37} alt="Exam" />
                        </div>
                        <h3 className="pt-3">Exam Recommendations</h3>
                        <p>Get curated competition suggestions tailored to your interests and strengths.</p>
                    </div>
                    <div className="feature-card-wrapper ">
                        <div className='outer-shap' style={{zIndex: '99999'}}></div>
                        <div class="feature-card feature-card-2 shadow bg-body-tertiary rounded rounded-bl-lg">
                            <div class="icon">
                                <img src={frame38} alt="Registration" />
                            </div>
                            <h3 className="pt-3">Quick Registration</h3>
                            <p>Seamless, one-time sign-ups to access multiple competitions.</p>
                        </div>
                    </div>
                    <div class="feature-card">
                        <div class="icon">
                            <img src={frame39} alt="Learning" />
                        </div>
                        <h3 className="pt-3">Personalized Learning</h3>
                        <p>AI-based learning from official competition resources.</p>
                    </div>
                    <div class="feature-card">
                        <div class="icon">
                            <img src={frame40} alt="Trophy" />
                        </div>
                        <h3 className="pt-3">Tangible Achievements</h3>
                        <p>Earn certificates and awards to showcase your success.</p>
                    </div>
                </div>
            </section>

            <div class="comb-sec">
                {/* <section class="partners">
                    <h2 class="hedi-text">Our Partners</h2>
                    <p>We are partnered with 15+ top exam institutes globally</p>
                    <div class="partners-grid">
                        <div class="item-company"> <img src={logo} alt="Partner" /></div>
                        <div class="item-company"> <img src={logo1} alt="Partner" /></div>
                        <div class="item-company"> <img src={logo2} alt="Partner" /></div>
                        <div class="item-company"> <img src={logo3} alt="Partner" /></div>
                        <div class="item-company"> <img src={logo4} alt="Partner" /></div>
                        <div class="item-company"> <img src={logo5} alt="Partner" /></div>
                        <div class="item-company"> <img src={logo6} alt="Partner" /></div>
                    </div>
                </section> */}

                {/* <section class="testimonials">
                    <h2>What Our Students Say</h2>
                    <div class="testimonial-slider">
                        <Slider {...settings}>
                            {testimonials.map((testimonial, index) => (
                                <div key={index} class="testimonial-card">
                                    <div class="profile">
                                        <img src={testimonial.image} alt={testimonial.name} class="profile-img" />
                                        <div class="profile-info">
                                            <h4>{testimonial.name}</h4>
                                            <p class="role">{testimonial.title}</p>
                                        </div>
                                    </div>
                                    <h3 class="title">{testimonial.message}</h3>
                                    <p class="testimonial">{testimonial.description}</p>
                                </div>
                            ))}
                        </Slider>
                    </div>
                </section> */}
                <img src={decore1} alt="Decore" class="bottom-images" />
            </div>

            <StudentFooter />
        </>
    );
}

export default Home; 