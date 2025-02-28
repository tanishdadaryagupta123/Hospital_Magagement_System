import React from "react";

const Hero = ({ title, imageUrl }) => {
  return (
    <>
      <div className="hero container">
        <div className="banner">
          <h1>{title}</h1>
          <p>
          ZeeCare Medical Institute is a cutting-edge healthcare facility dedicated to excellence, innovation, and compassionate care. Our team of highly skilled medical professionals is committed to delivering personalized treatments tailored to your unique health needs. With state-of-the-art technology and a patient-first approach, we ensure a seamless and supportive healthcare experience. At ZeeCare, your well-being is our priority, guiding you toward a healthier, happier life with expertise, empathy, and excellence.
          </p>
        </div>
        <div className="banner">
          <img src={imageUrl} alt="hero" className="animated-image" />
          <span>
            <img src="/Vector.png" alt="vector" />
          </span>
        </div>
      </div>
    </>
  );
};

export default Hero;
