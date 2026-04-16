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
    },
    {
      name: 'audioTracks',
      title: "Pistes audio — L'identité s'entend",
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Titre de la piste',
              type: 'string',
              validation: R => R.required(),
              description: 'Ex : Identité Fragment I'
            },
            {
              name: 'subtitle',
              title: 'Sous-titre',
              type: 'string',
              description: 'Ex : CORVYN Studio · 2026'
            },
            {
              name: 'duration',
              title: 'Durée affichée',
              type: 'string',
              description: 'Ex : 3:42'
            },
            {
              name: 'audioFile',
              title: 'Fichier audio',
              type: 'file',
              options: { accept: 'audio/*' },
              description: 'MP3 ou WAV uploadé directement dans Sanity.'
            },
            {
              name: 'externalUrl',
              title: 'URL externe (Spotify, SoundCloud…)',
              type: 'url',
              description: 'Optionnel — utilisé si aucun fichier audio uploadé.'
            }
          ],
          preview: {
            select: { title: 'title', subtitle: 'duration' }
          }
        }
      ],
      description: "Pistes affichées dans la section « L'identité s'entend » sur la page d'accueil et la page Études. L'ordre ici = l'ordre d'affichage sur le site."
    }
  ],
  preview: {
    select: { title: '_type' },
    prepare: () => ({ title: 'Paramètres du site' })
  }
}
