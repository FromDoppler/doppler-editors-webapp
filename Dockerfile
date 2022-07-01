FROM koalaman/shellcheck-alpine:v0.8.0 as verify-sh
WORKDIR /src
COPY ./*.sh ./
RUN shellcheck -e SC1091,SC1090 ./*.sh

FROM node:18 AS restore
WORKDIR /src
COPY package.json yarn.lock ./
RUN yarn
COPY . .

FROM restore AS verify-format
ENV CI=true
RUN yarn verify-format

FROM restore AS test
ENV CI=true
RUN yarn test

FROM restore AS build
ENV CI=true
ARG public_url="."
ENV PUBLIC_URL="${public_url}"
RUN yarn build

# Using specific digest (f7f7607...) to avoid unwanted changes in the non-oficial image
FROM ttionya/openssh-client@sha256:f7f7607d56f09a7c42e246e9c256ff51cf2f0802e3b2d88da6537bea516fe142 as final
COPY ./cdn-helpers/* ./
COPY --from=build /src/build ./build/
