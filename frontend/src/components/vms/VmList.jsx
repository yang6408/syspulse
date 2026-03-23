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
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0
                ${vm.enabled ? 'bg-green-400' : 'bg-red-400'}`}/>
              <span className="font-medium text-sm">{vm.alias}</span>
            </div>
            <p className="text-xs opacity-60 pl-3.5">{vm.local_ip}</p>
          </button>
        ))}
      </div>
      <div className="px-4 py-3 border-t border-gray-800">
        <p className="text-xs text-gray-600">총 {vms.length}개 VM</p>
      </div>
    </aside>
  )
}
