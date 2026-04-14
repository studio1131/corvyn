export default {
  name: 'contactSubmission',
  title: 'Contact Submission',
  type: 'document',
  fields: [
    { name: 'name', title: 'Name', type: 'string', validation: Rule => Rule.required() },
    { name: 'email', title: 'Email', type: 'string', validation: Rule => Rule.required() },
    { name: 'company', title: 'Company', type: 'string' },
    { name: 'message', title: 'Message', type: 'text', validation: Rule => Rule.required() },
    { name: 'submittedAt', title: 'Submitted At', type: 'datetime' },
    { name: 'ipHashHint', title: 'IP Hash Hint', type: 'string' }
  ]
};