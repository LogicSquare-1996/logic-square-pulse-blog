
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

// AWS Configuration
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION
});

// @desc    Generate presigned URL for S3 uploads
// @route   GET /api/s3/upload-url
// @access  Private
exports.getPresignedUrl = async (req, res) => {
  try {
    const { fileType } = req.query;
    
    if (!fileType) {
      return res.status(400).json({
        success: false,
        error: 'File type is required'
      });
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain'];
    if (!validTypes.includes(fileType)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid file type'
      });
    }

    const fileExtension = fileType.split('/')[1];
    const fileName = `${uuidv4()}.${fileExtension}`;
    const key = `uploads/${req.user._id}/${fileName}`;

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      ContentType: fileType,
      Expires: 60 * 5 // URL expires in 5 minutes
    };

    const uploadURL = await s3.getSignedUrlPromise('putObject', params);

    res.json({
      success: true,
      uploadURL,
      key,
      fileUrl: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${key}`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete file from S3
// @route   DELETE /api/s3/delete
// @access  Private
exports.deleteFile = async (req, res) => {
  try {
    const { key } = req.body;
    
    if (!key) {
      return res.status(400).json({
        success: false,
        error: 'File key is required'
      });
    }

    // Check if file belongs to user
    if (!key.includes(`uploads/${req.user._id}/`) && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this file'
      });
    }

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key
    };

    await s3.deleteObject(params).promise();

    res.json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
