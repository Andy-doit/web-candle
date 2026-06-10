export interface IEmailBase {
  to: string
  subject: string
  text: string
  html: string
  captchaToken: string
}