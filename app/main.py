import logging
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename
from werkzeug.exceptions import RequestEntityTooLarge
from yolo_inference import detect_objects
from logging_config import configure_logging
from animation_engine import AnimationEngine
from queue_manager import queue_manager
from cache_manager import cache_manager
import uuid
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

# Configure logging
configure_logging()
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Add rate limiting
limiter = Limiter(
    app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)

# Configuration
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # Limit upload size to 16MB
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg', 'gif'}

animation_engine = AnimationEngine()

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

@app.errorhandler(RequestEntityTooLarge)
def handle_request_entity_too_large(error):
    logger.warning('File upload exceeds size limit')
    return jsonify({'error': 'File too large', 'message': 'The uploaded file exceeds the maximum allowed size.'}), 413

@app.route('/upload', methods=['POST'])
@limiter.limit("10 per minute")
def upload_image():
    if 'file' not in request.files:
        logger.error('No file part in the request')
        return jsonify({'error': 'No file part', 'message': 'No file was uploaded.'}), 400
    file = request.files['file']
    if file.filename == '':
        logger.error('No selected file')
        return jsonify({'error': 'No selected file', 'message': 'No file was selected for upload.'}), 400
    if file and allowed_file(file.filename):
        try:
            filename = secure_filename(file.filename)
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(file_path)
            logger.info(f'File saved to {file_path}')
            
            # Process the image with YOLO
            results = detect_objects(file_path)
            if results is None:
                logger.error('Object detection failed')
                return jsonify({'error': 'Object detection failed', 'message': 'Unable to detect objects in the image.'}), 500
            
            logger.info(f'File processed successfully: {filename}')
            return jsonify({'results': results, 'file_path': file_path, 'message': 'File uploaded and processed successfully.'}), 200
        except Exception as e:
            logger.exception('Error processing the image')
            return jsonify({'error': str(e), 'message': 'An error occurred while processing the image.'}), 500
    else:
        logger.warning(f'Invalid file type: {file.filename}')
        return jsonify({'error': 'File type not allowed', 'message': 'The uploaded file type is not supported.'}), 400

@app.route('/animate', methods=['POST'])
@limiter.limit("5 per minute")
def animate_image():
    try:
        data = request.json
        image_path = data.get('image_path')
        animation_type = data.get('animation_type')
        objects = data.get('objects')

        if not all([image_path, animation_type, objects]):
            logger.error('Missing required parameters for animation')
            return jsonify({'error': 'Missing required parameters', 'message': 'Please provide all required parameters.'}), 400

        # Check cache
        cache_key = f"{image_path}:{animation_type}:{hash(frozenset(map(frozenset, objects)))}"
        cached_result = cache_manager.get_cached_animation(cache_key)
        if cached_result:
            logger.info(f'Animation retrieved from cache: {cache_key}')
            return jsonify({**cached_result, 'message': 'Animation retrieved from cache.'}), 200

        # Queue the animation job
        job_id = str(uuid.uuid4())
        queue_manager.enqueue_animation(
            animation_engine.apply_animation,
            job_id,
            image_path,
            animation_type,
            objects
        )

        logger.info(f'Animation job queued: {job_id}')
        return jsonify({'job_id': job_id, 'message': 'Animation job queued successfully.'}), 202
    except Exception as e:
        logger.exception('Error queueing animation job')
        return jsonify({'error': str(e), 'message': 'An error occurred while queueing the animation job.'}), 500

@app.route('/animation_status/<job_id>', methods=['GET'])
def animation_status(job_id):
    job = queue_manager.get_job(job_id)
    if job is None:
        logger.warning(f'Animation job not found: {job_id}')
        return jsonify({'error': 'Job not found', 'message': 'The requested animation job was not found.'}), 404
    
    if job.is_finished:
        result = job.result
        # Cache the result
        cache_manager.cache_animation(job_id, result)
        logger.info(f'Animation completed: {job_id}')
        return jsonify({**result, 'message': 'Animation completed successfully.'}), 200
    elif job.is_failed:
        logger.error(f'Animation job failed: {job_id}')
        return jsonify({'error': 'Job failed', 'message': 'The animation job failed to complete.'}), 500
    else:
        logger.info(f'Animation job in progress: {job_id}')
        return jsonify({'status': 'pending', 'message': 'The animation job is still in progress.'}), 202

@app.route('/download_animation/<filename>', methods=['GET'])
def download_animation(filename):
    try:
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        if not os.path.exists(file_path):
            logger.warning(f'Animation file not found: {filename}')
            return jsonify({'error': 'File not found', 'message': 'The requested animation file does not exist.'}), 404
        logger.info(f'Downloading animation: {filename}')
        return send_file(file_path, as_attachment=True)
    except Exception as e:
        logger.exception('Error downloading animation')
        return jsonify({'error': str(e), 'message': 'An error occurred while downloading the animation.'}), 500

@app.route('/health', methods=['GET'])
def health_check():
    logger.info('Health check performed')
    return jsonify({'status': 'healthy', 'message': 'The server is running and healthy.'}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)  # Set debug to False in production