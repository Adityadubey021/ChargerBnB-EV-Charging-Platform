// Token utility functions
export const getAuthToken = (): string | null => {
    return localStorage.getItem('accessToken');
};

export const setAuthToken = (token: string): void => {
    localStorage.setItem('accessToken', token);
};

export const removeAuthToken = (): void => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
};

// Multi-role access check
// Admin can access: ADMIN, HOST, USER pages
// Host can access: HOST, USER pages  
// User can access: USER pages only
export const canAccessRole = (userRole: string, requiredRole: string): boolean => {
    const roleHierarchy: { [key: string]: string[] } = {
        'ADMIN': ['ADMIN', 'HOST', 'USER'],
        'HOST': ['HOST', 'USER'],
        'USER': ['USER']
    };

    return roleHierarchy[userRole]?.includes(requiredRole) || false;
};
