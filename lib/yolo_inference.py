from ultralytics import YOLO
import logging
import torch
from PIL import Image
import torchvision.transforms as transforms

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

model = YOLO('yolov11n.pt')

def detect_objects(image_path):
    try:
        results = model(image_path)
        objects = []
        for r in results:
            boxes = r.boxes
            for box in boxes:
                obj = {
                    'class': model.names[int(box.cls)],
                    'confidence': float(box.conf),
                    'bbox': box.xyxy[0].tolist()
                }
                objects.append(obj)
        logging.info(f'Detected {len(objects)} objects')
        return objects
    except Exception as e:
        logging.exception('Error during object detection')
        return None