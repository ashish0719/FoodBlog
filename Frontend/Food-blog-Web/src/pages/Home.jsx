import React, { useState, useEffect } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import "../App.css";

import Foodimage1 from "../assets/bg1.jpg";
import Foodimage2 from "../assets/bg2.jpg";
import Foodimage3 from "../assets/bg3.jpg";

import Navbar from "../components/Navbar";
import Recipeitems from "../components/Recipeitems";
import Modal from "../components/Modal";
import Forms from "../components/Forms";

const backgroundImages = [Foodimage1, Foodimage2, Foodimage3];

function Home() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);
  const recipes = useLoaderData();

  const addRecipe = () => {
    const token = localStorage.getItem("token");
    if (token) navigate("/addRecipe");
    else setIsOpen(true);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 4000); // Change every 4 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <section
        className="home"
        style={{
          position: "relative",
          backgroundImage: `url(${backgroundImages[bgIndex]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          transition: "background-image 1s ease-in-out",
          minHeight: "80vh",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "40px",
          borderRadius: "50px",
          width: "98%",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: "98%",
            // backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1,
          }}
        />
        <div className="left" style={{ zIndex: 2 }}>
          <h1>Food Recipe</h1>
          <h5>
            Discover delicious recipes curated for food lovers! Browse and cook
            with ease.
          </h5>
          <button onClick={addRecipe}>Add Recipes</button>
        </div>
        <div className="right" style={{ zIndex: 2 }}>
          {/* Optional: image or graphic here */}
        </div>
      </section>

      {isOpen && (
        <Modal onClose={() => setIsOpen(false)}>
          <Forms setIsOpen={() => setIsOpen(false)} />
        </Modal>
      )}

      <div className="recipe">
        <Recipeitems recipes={recipes} />
      </div>

      <Footer />
    </>
  );
}

export default Home;
