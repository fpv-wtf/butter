FROM ubuntu:22.04

RUN apt update
RUN apt install -y make python3 python-is-python3 python3-pip unzip img2simg curl sudo wget

RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
RUN apt install -y nodejs

RUN pip3 install pycryptodome

COPY ./ /app

WORKDIR /app

RUN mkdir -p firmwares packages tmp

CMD make