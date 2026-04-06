source /opt/syspulse/.env

sed \
  -e "s/VM_B_IP_PLACEHOLDER/${VM_B_IP}/g" \
  -e "s/VM_C_IP_PLACEHOLDER/${VM_C_IP}/g" \
  -e "s/VM_D_IP_PLACEHOLDER/${VM_D_IP}/g" \
  /opt/syspulse/prometheus/prometheus.yml.template \
  > /opt/syspulse/prometheus/prometheus.yml

echo "prometheus.yml 생성 완료"
echo "VM-B: ${VM_B_IP}"
echo "VM-C: ${VM_C_IP}"
echo "VM-D: ${VM_D_IP}"
