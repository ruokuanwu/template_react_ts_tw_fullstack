export interface LoginPayload {
  email: string
  password: string
}

export async function login(payload: LoginPayload) {
  return Promise.resolve({
    token: 'demo-token',
    email: payload.email,
  })
}
