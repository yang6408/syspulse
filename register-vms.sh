#!/bin/bash

# .env 파일 로드 (컨테이너 내부 경로)
if [ -f /.env ]; then
  source /.env
elif [ -f /opt/syspulse/.env ]; then
  source /opt/syspulse/.env
fi

BASE_URL="http://localhost:3000"

echo "VM_B_IP: ${VM_B_IP}"
echo "VM_C_IP: ${VM_C_IP}"
echo "VM_D_IP: ${VM_D_IP}"

# 백엔드 준비될 때까지 대기
echo "백엔드 준비 대기 중..."
until curl -s "${BASE_URL}/health" > /dev/null; do
  sleep 2
done
echo "백엔드 준비 완료"

# VM 등록 함수
register_vm() {
  local alias=$1
  local ip=$2

  if [ -z "$ip" ]; then
    echo "${alias} IP가 없습니다. 건너뜁니다."
    return
  fi

  existing=$(curl -s "${BASE_URL}/api/vms" | grep "\"${ip}\"")

  if [ -n "$existing" ]; then
    echo "${alias} (${ip}) 이미 등록되어 있습니다. 건너뜁니다."
  else
    result=$(curl -s -X POST "${BASE_URL}/api/vms" \
      -H "Content-Type: application/json" \
      -d "{\"alias\": \"${alias}\", \"local_ip\": \"${ip}\"}")
    echo "${alias} (${ip}) 등록 완료: ${result}"
  fi
}

register_vm "VM-B" "${VM_B_IP}"
register_vm "VM-C" "${VM_C_IP}"
register_vm "VM-D" "${VM_D_IP}"

echo "VM 등록 완료"
