const { Liquid } = require('liquidjs')

// Creating the Liquid logic engine 
const engine = new Liquid({
  extname: '.liquid',
  globals: { basemsg: 'Base message rendered by tag' },
})

// register specific tags that we may need to creat specific for the business scenario
engine.registerTag('engage', {
  parse: function (token) {
    const [key, val] = token.args.split(':')
    this[key] = val
  },
  render: async function (scope, emitter) {
    const msg = await this.liquid.evalValue(this.content, scope)
    emitter.write(`engage-tag: ${msg}`)
  }
})

//Creating the context, this would be a simple get context from a database based on poc-id
const ctx = {
  name: 'John',
  promotion: {
      minimum: 2, 
      maxdate: 'Sept 07, 2022'
    },
  product: {
      name: "Beck Long Neck", 
        price: '12.99',  
        package: {
            size: 6, 
            type:"pack" 
        }
    },
}


async function main () {
  // Porwful templating model
  console.log('==========renderFile===========')
  const message = await engine.renderFile('engage-message', ctx)
  console.log(message)

  //Habilit to creat specific tags
  console.log('==========engageTag===========')
  const tag = await engine.renderFile('engage-tag', ctx)
  console.log(tag)

  //Method that would be idealy used, get the message, and joins with the context
  console.log('==========renderMessage===========')
  const baseMessage = "Hello {{name}}, enjoy now this amazin oportunity, if you get '{{promotion.minimum}}' of '{{product.name}}' on a '{{product.package.type}}' of '{{product.package.size}}' until '{{promotion.maxdate}}', you will pay only '{{product.price}}'"
  engine.parseAndRender(baseMessage, ctx).then(console.log);
}

main()
