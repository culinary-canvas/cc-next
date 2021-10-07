import { firebase } from '../firebase/Firebase'
import { httpsCallable } from 'firebase/functions'

export class EmailService {
  static VALIDATION_PATTERN =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  static async addEducationLeadContact(
    email: string,
    firstName: string,
    lastName: string,
    newsletter: boolean,
  ) {
    try {
      const { functions } = firebase()
      const addContact = httpsCallable(
        functions,
        'mailchimp-addEducationLeadContact',
      )
      await addContact({
        email,
        firstName,
        lastName,
        newsletter,
      })
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  static validate(email: string): boolean {
    return this.VALIDATION_PATTERN.test(email)
  }
}
