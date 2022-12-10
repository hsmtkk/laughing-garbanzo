FROM ruby:3.0 AS runtime
WORKDIR /kakeibo
COPY kakeibo/Gemfile /kakeibo/Gemfile
COPY kakeibo/Gemfile.lock /kakeibo/Gemfile.lock
RUN bundle install
COPY kakeibo/ /kakeibo/
ENTRYPOINT rails server -e production -b 0.0.0.0 -p $PORT
