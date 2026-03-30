export default function VmList({ vms, selectedVm, onSelect }) {
  return (
    <aside className="w-52 bg-gray-900 border-r border-gray-800 flex flex-col">
      <div className="px-4 py-4 border-b border-gray-800">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">VM 목록</p>
      </div>
      <div className="flex-1 overflow-auto p-2 flex flex-col gap-1">
        {vms.length === 0 && (
          <p className="text-xs text-gray-600 px-2 py-3">등록된 VM이 없습니다</p>
        )}
        {vms.map(vm => (
          <button
            key={vm.id}
            onClick={() => onSelect(vm)}
            className={`w-full text-left px-3 py-3 rounded-lg transition-all
              ${selectedVm?.id === vm.id
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
          >
            <div className="flex items-center gap-2 mb-1">
              {/* enabled → online 으로 변경 */}
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0
                ${vm.online ? 'bg-green-400' : 'bg-red-400'}`}/>
              <span className="font-medium text-sm">{vm.alias}</span>
            </div>
            <div className="flex items-center justify-between pl-3.5">
              <p className="text-xs opacity-60">{vm.local_ip}</p>
              {/* 온라인/오프라인 텍스트 표시 */}
              <span className={`text-xs font-medium
                ${vm.online ? 'text-green-400' : 'text-red-400'}`}>
                {vm.online ? 'Online' : 'Offline'}
              </span>
            </div>
          </button>
        ))}
      </div>
      <div className="px-4 py-3 border-t border-gray-800">
        <p className="text-xs text-gray-600">총 {vms.length}개 VM</p>
      </div>
    </aside>
  )
}
