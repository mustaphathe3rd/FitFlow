# server.py
from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import os

app = Flask(__name__)

home_dir = os.path.expanduser("~")
MODEL_PATH = os.path.join(home_dir, "FitFlowApp/frontend/assets/ml/fitflow_gym_detector.tflite")
LABELS_PATH = os.path.join(home_dir, "FitFlowApp/frontend/assets/ml/fitflow_gym_detector.txt")
# Load your TFLite model and labels
try:
    interpreter = tf.lite.Interpreter(model_path=MODEL_PATH)
    interpreter.allocate_tensors()
    input_details = interpreter.get_input_details()
    output_details = interpreter.get_output_details()
    with open(LABELS_PATH, "r") as f:
        label_map = [line.strip() for line in f.readlines()]
    print("✅ Model and labels loaded successfully.")
except Exception as e:
    print(f"❌ ERROR LOADING MODEL: {e}")
    label_map = []
    interpreter = None


@app.route('/detect', methods=['POST'])
def detect():
    if not interpreter:
        return jsonify({'error': 'Model is not loaded'}), 500

    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400

    image_file = request.files['image']
    image = Image.open(image_file.stream).convert('RGB')

    # Preprocess the image
    input_shape = input_details[0]['shape']
    image_resized = image.resize((input_shape[1], input_shape[2]))
    image_array = np.array(image_resized)
    input_data = np.expand_dims(image_array, axis=0)

    # Run inference
    interpreter.set_tensor(input_details[0]['index'], input_data)
    interpreter.invoke()

    # Get and process results from your 4-part model output
    scores = interpreter.get_tensor(output_details[0]['index'])[0]
    boxes = interpreter.get_tensor(output_details[1]['index'])[0]
    num_detections = interpreter.get_tensor(output_details[2]['index'])[0]
    classes = interpreter.get_tensor(output_details[3]['index'])[0]

    detections = []
    for i in range(int(num_detections)):
        if scores[i] > 0.5: # Confidence threshold
            class_id = int(classes[i])
            if class_id < len(label_map):
                detections.append({
                    "label": label_map[class_id],
                    "confidence": float(scores[i])
                })

    print(f"--> Detected: {[d['label'] for d in detections]}")
    return jsonify(detections)

if __name__ == '__main__':
    # Run on 0.0.0.0 to make it accessible from your emulator
    app.run(host='0.0.0.0', port=5001)