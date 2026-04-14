export default {
  name: 'siteSettings',
  title: 'Paramètres du site',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  fields: [
    {
      name: 'heroImage',
      title: "Image héro (page d'accueil)",
      type: 'image',
      options: { hotspot: true },
      description: "Grande photo en fond de la section héro."
    },
    {
      name: 'servicesImage',
      title: 'Image services',
      type: 'image',
      options: { hotspot: true },
      description: 'Photo affichée dans la section Services.'
    },
    {
      name: 'services',
      title: 'Liste des services',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Nom',
              type: 'string',
              validation: R => R.required()
            },
            {
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 4
            }
          ],
          preview: {
            select: { title: 'name', subtitle: 'description' }
          }
        }
      ],
      description: "Ordre d'affichage dans la page Services."
    }
  ],
  preview: {
    select: { title: '_type' },
    prepare: () => ({ title: 'Paramètres du site' })
  }
}
