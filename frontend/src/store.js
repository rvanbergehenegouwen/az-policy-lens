import { create } from 'zustand';
export const useAppStore = create((set) => ({
    currentUser: null,
    setCurrentUser: (user) => set({ currentUser: user }),
    complianceData: [],
    setComplianceData: (data) => set({ complianceData: data }),
    isLoading: false,
    setIsLoading: (loading) => set({ isLoading: loading }),
}));
