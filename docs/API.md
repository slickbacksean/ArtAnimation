# Save as: docs/API.md

# API Documentation

## Endpoints

### POST /upload

Upload an image for object detection.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: file (image file)

**Response:**
- Status: 200 OK
- Body: 
  ```json
  {
    "message": "File uploaded successfully",
    "results": [
      {
        "class": "person",
        "confidence": 0.95,
        "bbox": [10, 20, 100, 200]
      },
      ...
    ]
  }