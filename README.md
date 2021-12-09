# Editors Micro-Frontend

It is a POC for adding a new WebApp to Doppler complementing the [new WebApp](https://github.com/FromDoppler/doppler-webapp) (`app.fromdoppler.com`)
and the [old MVC UI](https://github.com/MakingSense/Doppler/tree/develop/Doppler.Presentation.MVC) (`app2.fromdoppler.com`).

From the user point of view, this should be the same application. But, from ours, it is a different
application deployed independently and loose coupled to the other ones.

By the moment, we will relay on Doppler user's JWT Token and `GetUserData`, and probably, in the
future we will try to use OAuth 2 in place.

On the other hand, we will use our _Manifest Loader_ <!-- TODO: add the link to the documentation here -->
in order to take advantage of the cache and simplify the release process. CI/CD process will be very
similar to our API microservices (for example [Hello Microservice](https://github.com/FromDoppler/hello-microservice#context)),
but based on manifest files in our CDN in place of Docker images.

## Usage of the released packages

Since we are using the _Manifest Loader_, the packages are independent from the hosting service,
you can see an example of how to use it in [demo.html](./demo/demo.html).
