FROM node:16
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --production

# install python with
COPY requirements.txt ./
RUN apt-get update || : && apt-get install python3-pip -y
RUN ln -sf /usr/bin/python3 /usr/bin/python
RUN ln -sf /usr/bin/pip3 /usr/bin/pip
RUN python -m pip install --upgrade pip
RUN pip install -r requirements.txt

COPY . .
COPY ./.env ./.env
CMD ["node", "src/server.js"]
