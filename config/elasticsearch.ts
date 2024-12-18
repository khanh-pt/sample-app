import env from '#start/env'
import { defineConfig } from '#providers/elastic_search_provider'

const elasticsearchConfig = defineConfig({ node: env.get('ELASTICSEARCH_URL') })

export default elasticsearchConfig
