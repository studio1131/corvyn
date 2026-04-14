export default {
  name: 'article',
  title: 'Article / Étude',
  type: 'document',
  fields: [
    {
      name: 'number',
      title: 'Numéro',
      type: 'string',
      description: 'Ex : 001, 002, 007…',
      validation: R => R.required()
    },
    {
      name: 'title',
      title: 'Titre',
      type: 'string',
      validation: R => R.required()
    },
    {
      name: 'category',
      title: 'Catégorie (affichée)',
      type: 'string',
      description: 'Ex : Identité, Luxe & désir, Le fondateur, Psychologie'
    },
    {
      name: 'filterTag',
      title: 'Tag filtre (slug)',
      type: 'string',
      description: 'Slug utilisé pour le filtrage : identite, luxe, fondateur, psychologie'
    },
    {
      name: 'excerpt',
      title: 'Accroche',
      type: 'text',
      rows: 3,
      description: 'Phrase courte affichée dans la liste et les cartes.'
    },
    {
      name: 'publishedDate',
      title: 'Date de publication',
      type: 'string',
      description: 'Texte libre affiché tel quel. Ex : Mars 2026'
    },
    {
      name: 'readingTime',
      title: 'Temps de lecture',
      type: 'string',
      description: 'Ex : 7 min'
    },
    {
      name: 'body',
      title: "Corps de l'article",
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'Citation', value: 'blockquote' }
          ],
          marks: {
            decorators: [
              { title: 'Gras', value: 'strong' },
              { title: 'Italique', value: 'em' }
            ]
          }
        }
      ]
    }
  ],
  orderings: [
    {
      title: 'Numéro croissant',
      name: 'numberAsc',
      by: [{ field: 'number', direction: 'asc' }]
    }
  ],
  preview: {
    select: { title: 'title', subtitle: 'number' }
  }
}
