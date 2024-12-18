import type { ApplicationService } from '@adonisjs/core/types'
import { Client, ClientOptions } from '@elastic/elasticsearch'
import { RuntimeException } from '@adonisjs/core/exceptions'

declare module '@adonisjs/core/types' {
  interface ContainerBindings {
    'elasticsearch.client': Client
  }
}

export function defineConfig(config: ClientOptions): ClientOptions {
  return config
}

export default class ElasticSearchProvider {
  constructor(protected app: ApplicationService) {}

  protected registerElasticsearchClient() {
    this.app.container.singleton('elasticsearch.client', async () => {
      const config = this.app.config.get<ClientOptions>('elasticsearch')

      console.log({ config })

      if (!config) {
        throw new RuntimeException(
          'Invalid "config/elasticsearch.ts" file. Make sure you are using the "defineConfig" method'
        )
      }

      return new Client(config)
    })
  }

  /**
   * Register bindings to the container
   */
  register() {
    this.registerElasticsearchClient()
  }

  /**
   * The container bindings have booted
   */
  async boot() {}

  /**
   * The application has been booted
   */
  async start() {}

  /**
   * The process has been started
   */
  async ready() {}

  /**
   * Preparing to shutdown the app
   */
  async shutdown() {}
}
