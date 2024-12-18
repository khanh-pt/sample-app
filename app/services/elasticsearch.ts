import app from '@adonisjs/core/services/app'

import type { Client } from '@elastic/elasticsearch'

let elasticsearchClient: Client

/**
 * Returns a singleton instance of the Client class from
 * the container
 */
await app.booted(async () => {
  elasticsearchClient = await app.container.make('elasticsearch.client')
})

export { elasticsearchClient as default }
