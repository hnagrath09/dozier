import { users } from '../data/users'

export default (email: string) => {
  const user = users.find((user) => user.email === email)
  if (user) {
    return user
  }
  throw new Error(`No user with ${email} found`)
}
