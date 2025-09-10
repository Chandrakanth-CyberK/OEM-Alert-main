import { Schema, model } from 'mongoose';

const alertSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Alert title is required'],
    trim: true
  },
  message: {
    type: String,
    required: [true, 'Alert message is required']
  },
  type: {
    type: String,
    required: [true, 'Alert type is required'],
    enum: ['vulnerability', 'device_failure', 'compliance', 'security_incident', 'maintenance', 'system']
  },
  severity: {
    type: String,
    required: [true, 'Alert severity is required'],
    enum: ['critical', 'high', 'medium', 'low', 'info']
  },
  priority: {
    type: String,
    required: [true, 'Alert priority is required'],
    enum: ['immediate', 'urgent', 'high', 'medium', 'low']
  },
  status: {
    type: String,
    enum: ['active', 'acknowledged', 'resolved', 'dismissed'],
    default: 'active'
  },
  source: {
    type: {
      type: String,
      enum: ['vulnerability_scanner', 'device_monitor', 'compliance_check', 'manual', 'external_feed']
    },
    identifier: String, // CVE ID, Device ID, etc.
    details: Schema.Types.Mixed
  },
  affectedEntities: [{
    entityType: {
      type: String,
      enum: ['device', 'user', 'department', 'system']
    },
    entityId: Schema.Types.ObjectId,
    entityName: String,
    impact: String
  }],
  department: {
    type: String,
    enum: ['ICU', 'Emergency', 'Surgery', 'Radiology', 'Laboratory', 'IT', 'All']
  },
  patientSafetyImpact: {
    type: String,
    enum: ['life-critical', 'high', 'medium', 'low', 'none'],
    default: 'none'
  },
  hipaaImpact: {
    type: String,
    enum: ['high', 'medium', 'low', 'none'],
    default: 'none'
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  acknowledgedBy: {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    acknowledgedAt: Date,
    notes: String
  },
  resolvedBy: {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    resolvedAt: Date,
    resolution: String,
    resolutionNotes: String
  },
  escalation: {
    isEscalated: {
      type: Boolean,
      default: false
    },
    escalatedAt: Date,
    escalatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    escalationReason: String,
    escalationLevel: {
      type: Number,
      min: 1,
      max: 5,
      default: 1
    }
  },
  notifications: [{
    method: {
      type: String,
      enum: ['email', 'sms', 'push', 'dashboard']
    },
    recipients: [String],
    sentAt: Date,
    status: {
      type: String,
      enum: ['sent', 'failed', 'pending'],
      default: 'pending'
    },
    errorMessage: String
  }],
  automatedActions: [{
    action: String,
    executedAt: Date,
    status: {
      type: String,
      enum: ['success', 'failed', 'pending']
    },
    result: String
  }],
  tags: [String],
  expiresAt: Date,
  isActive: {
    type: Boolean,
    default: true
  },
  metadata: {
    sourceSystem: String,
    correlationId: String,
    additionalData: Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Indexes for performance
alertSchema.index({ status: 1 });
alertSchema.index({ severity: 1 });
alertSchema.index({ priority: 1 });
alertSchema.index({ type: 1 });
alertSchema.index({ department: 1 });
alertSchema.index({ createdAt: -1 });
alertSchema.index({ assignedTo: 1 });
alertSchema.index({ 'source.identifier': 1 });
alertSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Virtual for age in hours
alertSchema.virtual('ageInHours').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60));
});

// Method to check if alert is overdue
alertSchema.methods.isOverdue = function() {
  const now = new Date();
  const ageInHours = this.ageInHours;
  
  switch (this.priority) {
    case 'immediate':
      return ageInHours > 1;
    case 'urgent':
      return ageInHours > 4;
    case 'high':
      return ageInHours > 24;
    case 'medium':
      return ageInHours > 72;
    default:
      return ageInHours > 168; // 1 week
  }
};

// Method to determine if alert needs escalation
alertSchema.methods.needsEscalation = function() {
  return this.isOverdue() && !this.escalation.isEscalated && this.status === 'active';
};

export default model('Alert', alertSchema);