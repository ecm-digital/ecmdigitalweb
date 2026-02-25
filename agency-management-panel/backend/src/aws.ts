/**
 * AWS Services stub for local development.
 * In production, these would connect to real AWS services (RDS, Cognito, DynamoDB).
 * For local dev, they use in-memory stores.
 */

export async function initializeRDSDatabase(): Promise<void> {
  console.log('⚠️ Using local stub for RDS database initialization');
}

export const CognitoService = {
  async authenticateUser(email: string, password: string) {
    console.log('⚠️ CognitoService stub: authenticateUser');
    return { success: true, token: 'stub-token' };
  },
  async verifyToken(token: string) {
    console.log('⚠️ CognitoService stub: verifyToken');
    return { valid: true };
  },
};

export const UsersService = {
  async getUsers() {
    return [];
  },
  async getUser(id: string) {
    return null;
  },
  async createUser(data: any) {
    return { id: Date.now().toString(), ...data };
  },
  async updateUser(id: string, data: any) {
    return { id, ...data };
  },
  async deleteUser(id: string) {
    return { success: true };
  },
};

export const ProjectsService = {
  async getProjects() {
    return [];
  },
  async getProject(id: string) {
    return null;
  },
  async createProject(data: any) {
    return { id: Date.now().toString(), ...data };
  },
  async updateProject(id: string, data: any) {
    return { id, ...data };
  },
  async deleteProject(id: string) {
    return { success: true };
  },
};
