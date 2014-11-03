FROM google/debian:wheezy

RUN apt-get update -y && apt-get install --no-install-recommends -y -q curl python build-essential git ca-certificates
RUN mkdir /nodejs && curl http://nodejs.org/dist/v0.10.32/node-v0.10.32-linux-x64.tar.gz | tar xvzf - -C /nodejs --strip-components=1
RUN apt-get install -y postgresql

USER postgres
RUN /etc/init.d/postgresql start && createuser drilldown -S -D -R && createdb --owner=drilldown --port=5432 drilldown && createdb --owner=drilldown --port=5432 drilldown-testing

USER root
ENV PATH $PATH:/nodejs/bin
RUN npm install -g gulp

WORKDIR /app
#ONBUILD ADD package.json /app/
#ONBUILD RUN npm install
#ONBUILD ADD . /app

EXPOSE 3000
CMD []
#ENTRYPOINT ["/nodejs/bin/npm", "start"]
ENTRYPOINT ["/bin/bash"]
