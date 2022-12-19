FROM node:16

# 앱 디렉터리 생성
WORKDIR /usr/src/app

# 앱 의존성 설치
COPY package*.json ./


COPY requirements.txt ./

# install python & modules
RUN apt-get update
RUN apt-get install python3-pip -y
RUN ln -sf /usr/bin/python3 /usr/bin/python
RUN ln -sf /usr/bin/pip3 /usr/bin/pip
RUN python -m pip install --upgrade pip
RUN pip install -r requirements.txt

# 앱 소스 추가
COPY . .
COPY .env ./

# install npm modules
RUN apt-get update
RUN npm install
WORKDIR /usr/src/app/server
CMD ["node", "server.js"]
