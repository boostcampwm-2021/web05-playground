#!/bin/sh

# 실행중인 도커 컨테이너 중지
echo "stop container"
docker stop $(docker ps -a -q)

# 도커 컨테이너 삭제
echo "delete container"
docker rm $(docker ps -a -q)

# 노드 서버 이미지 빌드
echo "image build"
docker build ./worker-server --tag kimsungho97/worker-server

# db 서버 이미지 빌드
echo "db build"
docker build ../ --tag kimsungho97/mysql:5.7

# 첫 번째 월드 컨테이너 실행
echo "first container run"
PORT=8000 docker-compose -f ./worker-server/docker-compose.yml up -d

# 두 번째 월드 컨테이너 실행
echo "second container run"
PORT=9000 docker-compose -f ./worker-server/docker-compose.yml -p worker2 up -d