import { backendApi } from '@/services/backendApi'

export type SchoolRecord = {
  schoolId: number
  schoolCode: string
  schoolName: string
  principalName: string
  email: string
  phoneNumber: string
  logo: string
  logoName: string
  logoType: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  country: string
  postalCode: string
}

export type UpdateSchoolPayload = {
  schoolId: number
  schoolCode: string
  schoolName: string
  principalName: string
  email: string
  phoneNumber: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  country: string
  postalCode: string
  logoFile?: File | null
  logo?: string
  logoName?: string
  logoType?: string
}

export async function getSchools(): Promise<SchoolRecord[]> {
  const response = await backendApi.get<SchoolRecord[]>('/MSchool')
  return Array.isArray(response.data) ? response.data : []
}

export async function updateSchool(payload: UpdateSchoolPayload): Promise<void> {
  const toFileFromLogo = async (): Promise<File | null> => {
    if (!payload.logo) return null

    const fileName = payload.logoName || 'school-logo.jpg'
    const mimeType = payload.logoType || 'image/jpeg'

    if (payload.logo.startsWith('data:')) {
      const response = await fetch(payload.logo)
      const blob = await response.blob()
      return new File([blob], fileName, { type: blob.type || mimeType })
    }

    if (payload.logo.startsWith('http://') || payload.logo.startsWith('https://')) {
      const response = await fetch(payload.logo)
      if (!response.ok) return null
      const blob = await response.blob()
      return new File([blob], fileName, { type: blob.type || mimeType })
    }

    const normalizedBase64 = payload.logo.replace(/\s/g, '')
    const binary = atob(normalizedBase64)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i)
    }
    const blob = new Blob([bytes], { type: mimeType })
    return new File([blob], fileName, { type: mimeType })
  }

  const formData = new FormData()
  formData.append('SchoolCode', payload.schoolCode ?? '')
  formData.append('AddressLine1', payload.addressLine1 ?? '')
  formData.append('AddressLine2', payload.addressLine2 ?? '')
  formData.append('City', payload.city ?? '')
  formData.append('State', payload.state ?? '')
  formData.append('Country', payload.country ?? '')
  formData.append('PhoneNumber', payload.phoneNumber ?? '')
  formData.append('PostalCode', payload.postalCode ?? '')
  formData.append('PrincipalName', payload.principalName ?? '')
  formData.append('Email', payload.email ?? '')
  formData.append('SchoolName', payload.schoolName ?? '')

  if (payload.logoFile) {
    formData.append('Logo', payload.logoFile, payload.logoFile.name)
  } else {
    const existingLogoFile = await toFileFromLogo()
    if (existingLogoFile) {
      formData.append('Logo', existingLogoFile, existingLogoFile.name)
    }
  }

  await backendApi.put(`/MSchool/${payload.schoolId}`, formData, {
    headers: {
      accept: '*/*',
    },
  })
}
