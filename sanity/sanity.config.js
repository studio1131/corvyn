import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'

export default defineConfig({
  name: 'corvyn-studio',
  title: 'CORVYN Studio',
  projectId: 'vr3qc54u',
  dataset: 'production',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Contenu')
          .items([
            S.listItem()
              .title('Paramètres du site')
              .id('siteSettings')
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings')
              ),
            S.divider(),
            S.listItem()
              .title('Articles / Études')
              .schemaType('article')
              .child(S.documentTypeList('article').title('Articles')),
            S.divider(),
            S.listItem()
              .title('Soumissions contact')
              .schemaType('contactSubmission')
              .child(S.documentTypeList('contactSubmission').title('Contact'))
          ])
    }),
    visionTool()
  ],
  schema: {
    types: schemaTypes
  }
})
