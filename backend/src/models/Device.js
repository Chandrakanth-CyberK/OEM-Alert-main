const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Device name is required'],
    trim: true
  },
  model: {
    type: String,
    required: [true, 'Device model is required'],
    trim: true
  },
  manufacturer: {
    type: String,
    required: [true, 'Manufacturer is required'],
    trim: true
  },
  serialNumber: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Critical Care', 'Diagnostic', 'Treatment', 'IT Systems', 'Laboratory', 'Surgical', 'Monitoring']
  },
  subcategory: {
    type: String,
    trim: true
  },
  location: {
    building: String,
    floor: String,
    room: String,
    department: {
      type: String,
      required: [true, 'Department is required'],
      enum: ['ICU', 'Emergency', 'Surgery', 'Radiology', 'Laboratory', 'Pharmacy', 'Cardiology', 'IT']
    }
  },
  networkInfo: {
    ipAddress: {
      type: String,
      match: [/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/, 'Invalid IP address format']
    },
    macAddress: {
      type: String,
      match: [/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/, 'Invalid MAC address format']
    },
    hostname: String,
    vlan: String,
    networkSegment: {
      type: String,
      enum: ['clinical', 'administrative', 'guest', 'iot', 'critical']
    }
  },
  status: {
    type: String,
    enum: ['online', 'offline', 'warning', 'critical', 'maintenance'],
    default: 'offline'
  },
  operationalStatus: {
    isOperational: {
      type: Boolean,
      default: true
    },
    lastHealthCheck: Date,
    uptime: Number, // in seconds
    lastMaintenanceDate: Date,
    nextMaintenanceDate: Date
  },
  softwareInfo: {
    operatingSystem: String,
    osVersion: String,
    firmwareVersion: String,
    applicationVersion: String,
    lastUpdateDate: Date
  },
  securityInfo: {
    vulnerabilityCount: {
      type: Number,
      default: 0
    },
    lastSecurityScan: Date,
    encryptionEnabled: {
      type: Boolean,
      default: false
    },
    authenticationMethod: {
      type: String,
      enum: ['password', 'certificate', 'biometric', 'multi-factor', 'none']
    },
    accessControlEnabled: {
      type: Boolean,
      default: false
    }
  },
  complianceInfo: {
    hipaaCompliant: {
      type: Boolean,
      default: false
    },
    fdaApproved: {
      type: Boolean,
      default: false
    },
    certifications: [String],
    lastComplianceAudit: Date,
    complianceScore: {
      type: Number,
      min: 0,
      max: 100
    }
  },
  patientSafetyClassification: {
    type: String,
    enum: ['life-supporting', 'life-sustaining', 'non-life-supporting'],
    required: [true, 'Patient safety classification is required']
  },
  criticality: {
    type: String,
    enum: ['critical', 'high', 'medium', 'low'],
    required: [true, 'Criticality level is required']
  },
  owner: {
    department: String,
    contactPerson: String,
    contactEmail: String,
    contactPhone: String
  },
  vendor: {
    name: String,
    contactEmail: String,
    contactPhone: String,
    supportContract: {
      isActive: Boolean,
      expirationDate: Date,
      supportLevel: String
    }
  },
  purchaseInfo: {
    purchaseDate: Date,
    warrantyExpiration: Date,
    cost: Number,
    purchaseOrderNumber: String
  },
  notes: String,
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for performance
deviceSchema.index({ manufacturer: 1, model: 1 });
deviceSchema.index({ 'location.department': 1 });
deviceSchema.index({ category: 1 });
deviceSchema.index({ status: 1 });
deviceSchema.index({ criticality: 1 });
deviceSchema.index({ patientSafetyClassification: 1 });
deviceSchema.index({ 'networkInfo.ipAddress': 1 });
deviceSchema.index({ serialNumber: 1 });

// Virtual for full location
deviceSchema.virtual('fullLocation').get(function() {
  const loc = this.location;
  return `${loc.building || ''} ${loc.floor || ''} ${loc.room || ''} - ${loc.department}`.trim();
});

// Method to check if device is critical
deviceSchema.methods.isCritical = function() {
  return this.criticality === 'critical' || 
         this.patientSafetyClassification === 'life-supporting' ||
         this.patientSafetyClassification === 'life-sustaining';
};

// Method to check if device needs attention
deviceSchema.methods.needsAttention = function() {
  return this.status === 'critical' || 
         this.status === 'warning' ||
         this.securityInfo.vulnerabilityCount > 0 ||
         (this.operationalStatus.nextMaintenanceDate && 
          this.operationalStatus.nextMaintenanceDate < new Date());
};

module.exports = mongoose.model('Device', deviceSchema);