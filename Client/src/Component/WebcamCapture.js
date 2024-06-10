import React, { useState, useEffect, useRef } from "react";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Webcam from "react-webcam";
import ProgressBar from "react-bootstrap/ProgressBar";
import "./WebcamCapture.css";
import RockImg from "../Assets/rock.png";
import PaperImg from "../Assets/paper.png";
import ScissorImg from "../Assets/scissor.png";

const WebcamCapture = () => {
  const [showWebcam, setShowWebcam] = useState(false);
  const [count, setCount] = useState(false);
  const [progress, setProgress] = useState(100);
  const [prediction, setPrediction] = useState("");
  const webcamRef = useRef(null);
  const [computerGuess, setComputerGuess] = useState("");
  const [winner, setWinner] = useState("");

  const handleButtonClick = () => {
    setShowWebcam(true);
  };

  const handleCloseCam = () => {
    setPrediction("");
    setWinner("");
    setShowWebcam(false);
    setComputerGuess("");
  };

  const handleStartGame = () => {
    setCount(true);
    decreaseProgress();
    setComputerGuess("");
    setPrediction("");
    setWinner("");
  };

  const decreaseProgress = () => {
    let currentProgress = 100;
    const interval = setInterval(() => {
      currentProgress -= 25;
      if (currentProgress >= 0) {
        setProgress(currentProgress);
      } else {
        clearInterval(interval);
        captureAndSaveImage();
      }
    }, 1000);
  };

  const captureAndSaveImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    fetch("http://localhost:5000/save-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageSrc }),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Image saved successfully!");
          return response.json();
        } else {
          console.error("Failed to save image.");
        }
      })
      .then((data) => {
        setPrediction(data.prediction);
        const computerGuess = getRandomGuess();
        setComputerGuess(computerGuess);
        determineWinner(computerGuess, data.prediction);
      })
      .catch((error) => {
        console.error("Error saving image:", error);
      });
  };

  const handleCapture = () => {};

  useEffect(() => {
    if (count) {
      decreaseProgress();
    }
  }, [count]);

  const getRandomGuess = () => {
    const options = ["rock", "paper", "scissor"];
    const randomIndex = Math.floor(Math.random() * options.length);
    return options[randomIndex];
  };

  const determineWinner = (computerGuess, userGuess) => {
    if (
      (computerGuess === "rock" && userGuess === "scissor") ||
      (computerGuess === "scissor" && userGuess === "paper") ||
      (computerGuess === "paper" && userGuess === "rock") 

    ) {
      setWinner("Computer");
    } else if (
      (userGuess === "rock" && computerGuess === "scissor") ||
      (userGuess === "scissor" && computerGuess === "paper") ||
      (userGuess === "paper" && computerGuess === "rock")
    ) {
      setWinner("You");
    } else {
      setWinner("It's a tie");
    }
  };

  return (
    <>
      <Row>
        <div>
          {!showWebcam && (
            <Button onClick={handleButtonClick}>Start Game</Button>
          )}
          {winner && (
            <h2>
              The winner of this round is{" "}
              <span style={{ color: "red" }}>{winner}</span>
            </h2>
          )}
        </div>
        <Col>
          {showWebcam && (
            <div className="web-cam-container">
              <h2>You says</h2>
              <Webcam
                audio={false}
                height={400}
                width={400}
                screenshotFormat="image/jpeg"
                ref={webcamRef}
                onTakePhoto={handleCapture}
              />
              <div className="buttons">
                <Button variant="primary" onClick={handleStartGame}>
                  Start Count
                </Button>
                <Button variant="danger" onClick={handleCloseCam}>
                  Close Webcam
                </Button>
              </div>
            </div>
          )}
          <br />
          {count && <ProgressBar striped variant="danger" now={progress} />}
          {prediction && <h1>Prediction: {prediction}</h1>}
        </Col>
        <Col>
          {showWebcam && (
            <div>
              <h2>Computer says</h2>
              <div className="image-container">
                {computerGuess === "rock" && <img src={RockImg} />}
                {computerGuess === "paper" && <img src={PaperImg} />}
                {computerGuess === "scissors" && <img src={ScissorImg} />}
              </div>
              <h1>{computerGuess}</h1>
            </div>
          )}
        </Col>
      </Row>
    </>
  );
};

export default WebcamCapture;
