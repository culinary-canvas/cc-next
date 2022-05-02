import { format } from 'date-fns'
import StringUtils from '../services/utils/StringUtils'
import { IssueModel } from './models/Issue.model'

export class IssueService {
  static async validate(issue: IssueModel) {
    // TODO Validate no duplicate year/month
    return true
  }

  static toDisplayText(issue: IssueModel) {
    if (!issue) {
      return ''
    }
    return `${StringUtils.toDisplayText(issue.name)} (${format(
      issue.publishMonth,
      'MMM yyyy',
    )})`
  }
}
