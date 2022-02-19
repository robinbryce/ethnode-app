## Web Console for iona

## Notes

* package the site into nginx image for deployment
* root the whole app at /var/www in nginx
* use a treafik stripprifix middleware to host the app
  at configurable prefix
* deploy to its own namespace
