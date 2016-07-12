# The DocPad Configuration File
# It is simply a CoffeeScript Object which is parsed by CSON

#Import
moment = require('moment')
_ = require('lodash')

docpadConfig = {

  # Template Data
  # =============
  # These are variables that will be accessible via our templates
  # To access one of these within our templates, refer to the FAQ: https://github.com/bevry/docpad/wiki/FAQ

  templateData:

    authors: require "./js/providers.js"

    # Specify some site properties
    site:

      # The name of our business
      name: "movel"

      # The production url of our website
      url: "http://www.movel.co"

      # Here are some old site urls that you would like to redirect from
      oldUrls: [
        'www.movel.us',
        'movel.herokuapp.com'
      ]

      # The default title of our website
      title: "Movel"

      # The website description (for SEO)
      description: """
        Top mobile application development company. Web UX App Washington DC Virginia Maryland USA. Develop iPhone, iPad, Android app design services. App developers for hire.
        """

      # The website keywords (for SEO) separated by commas
      keywords: """
        app,apps,application,mobile,development,company,companies,android,iphone,ipad,ios,design,strategy,web,top,best,developer
        """

      # The website author's name
      author: "Movel"

      # The website author's email
      email: "info@movel.co"

      # Your company's name
      copyright: "© Copyright Movel 2016. All rights reserved."

    practice:
      name: "Liberty Laser Eye"
      address: "123 Maple Ave."
    # Helper Functions
    # ----------------

    requireImage: (resource) ->
      require('file!img!' + resource)

    getAuthor: (author) ->
      if author
        return @authors[author]
      @authors['community']

    getAuthorUrl: (author) ->
      if author
        return '/company/team/' + author
      '/company/team'

    # Get the prepared site/document title
    # Often we would like to specify particular formatting to our page's title
    # we can apply that formatting here
    getPreparedTitle: ->
      # if we have a document SEO title, then we should use that and suffix the site's title onto it
      if @document.seoTitle
        "#{@document.title} | #{@document.seoTitle} | #{@site.title}"
      else if @document.title
        "#{@document.title} | #{@site.title}"
      # if our document does not have it's own title, then we should just use the site's title
      else
        @site.title

    # Get the prepared site/document description
    getPreparedDescription: ->
      # if we have a document description, then we should use that, otherwise use the site's description
      @document.description or @site.description

    # Get the prepared site/document keywords
    getPreparedKeywords: ->
      # Merge the document keywords with the site keywords
      @site.keywords.concat(@document.keywords or []).join(', ')

    # Get the tag URL
    getTagUrl: (tag) ->
      page = @getFile(tag: tag)
      if page != null
        return page.get('url')

    getImageUrl: (image) ->
      return require('./docpad/raw/assets/img/apple-screen.jpg')

}

# Export the DocPad Configuration
module.exports = docpadConfig
