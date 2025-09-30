const swaggerAutogen = require("swagger-autogen")({ openapi: "3.0.0" })

//swagger documentation set up
const doc = {
  info: {
    version: "3.0.0",
    title: "Shopify API",
    description: "API Documentation for Shopify Project",
  },
  servers: [
    {
      url: "http://localhost:8080/",
      description: "Shopify API Documentation. Use this when testing locally.",
    },
    {
      url: "https://webservices-project-rufi.onrender.com/",
      description:
        "Shopify API Documentation. Use this when testing on a live server",
    },
  ],
}

//create a file to handle the output data sent and a route to the router file for the project
const outputFile = "./swagger-output.json"
const route = ["./router/index.js"]

//export and trigger the function
swaggerAutogen(outputFile, route, doc)
