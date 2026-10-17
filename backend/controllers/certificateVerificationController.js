const IssuedCertificate = require('../models/IssuedCertificate');

const verifyCertificate = async (req, res) => {
  try {
    const { certNo } = req.params;
    const cert = await IssuedCertificate.findOne({ certificate_no: certNo.trim() })
      .populate('school_id', 'name logo_url affiliation_number slogan')
      .populate('campus_id', 'name address contact_number')
      .lean();
    if (!cert) return res.status(404).json({ success: false, message: 'Certificate not found or invalid' });
    res.status(200).json({ success: true, certificate: cert });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Verification error', error: err.message });
  }
};

module.exports = { verifyCertificate };
