const VaultClient = require('../vault/client');

class IAMService {
  constructor() {
    this.vault = new VaultClient();
    this.permissions = {
      admin: ['read', 'write', 'delete', 'manage'],
      user: ['read', 'write'],
      viewer: ['read']
    };
  }

  async initializeSecrets() {
    try {
      // Store JWT secret in Vault
      await this.vault.storeSecret('jwt', {
        secret: process.env.JWT_SECRET || 'legal-dms-secret-key',
        algorithm: 'HS256'
      });

      // Store database credentials
      await this.vault.storeSecret('database', {
        host: 'localhost',
        port: 5432,
        username: 'legal_dms_user',
        password: 'secure_password_123'
      });

      // Store API keys
      await this.vault.storeSecret('api-keys', {
        encryption_key: 'legal-docs-encryption-key-2025',
        audit_key: 'audit-logging-key-2025'
      });

      console.log('✅ Secrets initialized in Vault');
    } catch (error) {
      console.error('❌ Failed to initialize secrets:', error.message);
    }
  }

  hasPermission(userRole, requiredPermission) {
    const userPermissions = this.permissions[userRole] || [];
    return userPermissions.includes(requiredPermission);
  }

  async auditLog(action, user, resource, result) {
    const auditEntry = {
      timestamp: new Date().toISOString(),
      action,
      user: user.username,
      userId: user.userId,
      role: user.role,
      resource,
      result,
      ip: user.ip || 'unknown'
    };

    console.log('🔍 AUDIT LOG:', JSON.stringify(auditEntry));
    
    try {
      const auditPath = `audit/${Date.now()}-${user.userId}`;
      await this.vault.storeSecret(auditPath, auditEntry);
    } catch (error) {
      console.error('Failed to store audit log:', error.message);
    }
  }
}

module.exports = IAMService;
