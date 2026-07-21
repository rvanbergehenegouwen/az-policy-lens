import { create } from 'zustand'

export interface User {
  id: string
  email: string
  role: 'admin' | 'superuser' | 'user'
  created_at: string
}

export interface ComplianceData {
  framework: string
  compliant: number
  non_compliant: number
  compliance_rating: number
}

export interface PolicyAssignment {
  id: string
  display_name: string
  category: string
  status: string
  compliance_count: number
  non_compliance_count: number
  framework: string
  scope: string
  assigned_by: string
  created_on: string
}

interface AppStore {
  currentUser: User | null
  setCurrentUser: (user: User | null) => void
  complianceData: ComplianceData[]
  setComplianceData: (data: ComplianceData[]) => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

export const useAppStore = create<AppStore>((set) => ({
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),
  complianceData: [],
  setComplianceData: (data) => set({ complianceData: data }),
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
}))
