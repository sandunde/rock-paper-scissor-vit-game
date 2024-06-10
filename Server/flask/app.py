import base64
import os
from flask import Flask, request, jsonify
from flask_cors import CORS 
import torch
from torchvision import transforms
from PIL import Image

app = Flask(__name__)
CORS(app)

# Load the pretrained ViT model
model_path = "/Users/sandundesilva/Documents/4th year/machine vision/cw final/backend/pretrainedModel/pretrained_vit_model_final.pth"
pretrained_vit = torch.load(model_path)
pretrained_vit.eval()

# Define class names
class_names = ['paper', 'rock', 'scissor']

# Define transformation for inference
preprocess = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
])

# Function to predict on an image
def predict_image(model, image_path, class_names):
    image = Image.open(image_path)
    image_tensor = preprocess(image).unsqueeze(0)
    with torch.no_grad():
        outputs = model(image_tensor)
    _, predicted = torch.max(outputs, 1)
    class_index = predicted.item()
    predicted_class = class_names[class_index]
    return predicted_class

@app.route("/save-image", methods=["POST"])
def save_image():
    try:
        data = request.json
        image_src = data.get("imageSrc")
        
        if image_src:
            # Decode base64 encoded image
            img_data = base64.b64decode(image_src.split(",")[1])
            
            # Save image to specified directory
            image_path = "/Users/sandundesilva/Documents/4th year/machine vision/cw final/backend/flask/webcam_capture.jpeg"
            with open(image_path, "wb") as f:
                f.write(img_data)
            
            # Predict on the saved image
            prediction = predict_image(pretrained_vit, image_path, class_names)
            
            # Console log the predicted output
            print("Prediction:", prediction)
                
            return jsonify({"message": "Image saved successfully!", "imagePath": image_path, "prediction": prediction}), 200
        else:
            return jsonify({"message": "No image data provided."}), 400
    except Exception as e:
        return jsonify({"message": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
