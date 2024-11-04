# Save as: server/yolo_inference.py

import torch
from PIL import Image
import torchvision.transforms as transforms
from logging_config import logger

# Load YOLO model
model = torch.hub.load('ultralytics/yolov5', 'yolov5s', pretrained=True)

def detect_objects(image_path):
    try:
        logger.info(f'Processing image: {image_path}')
        image = Image.open(image_path)
        transform = transforms.Compose([transforms.ToTensor()])
        input_tensor = transform(image).unsqueeze(0)
        
        with torch.no_grad():
            results = model(input_tensor)
        
        detections = results.xyxy[0].cpu().numpy()
        processed_results = []
        for detection in detections:
            x1, y1, x2, y2, conf, cls = detection
            processed_results.append({
                'class': model.names[int(cls)],
                'confidence': float(conf),
                'bbox': [float(x1), float(y1), float(x2), float(y2)]
            })
        
        logger.info(f'Detected {len(processed_results)} objects')
        return processed_results
    except Exception as e:
        logger.exception(f'Error processing image: {image_path}')
        raise