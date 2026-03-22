FROM rust:1.90.0

WORKDIR /usr/src/promptgame
COPY . .

COPY static/* /static/

RUN cargo install --path .

CMD ["promptgame"]