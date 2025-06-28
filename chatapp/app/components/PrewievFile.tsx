import { DocumentIcon, PaperAirplaneIcon, XMarkIcon } from "@heroicons/react/24/outline";
interface PreviewFileProps {
  filePreview: File | null;
    setFilePreview: (file: File | null) => void;
    onSendFile: (file: File) => void;
}
export const PreviewFile = ({ filePreview, setFilePreview, onSendFile }: PreviewFileProps) => {
  {/* Dosya önizleme kutusu */}
  return (
    <div>
      {filePreview && (
        <div className="absolute bottom-16 left-4 bg-white p-3 rounded-lg shadow-lg border z-50 w-64">
          <div className="flex items-center space-x-2">
            <DocumentIcon className="w-6 h-6 text-purple-600" />
      <div className="flex-1">
        <img src={filePreview} alt="Preview" className="w-32 h-32 object-cover" />
        <p className="text-sm font-medium truncate">{filePreview.name}</p>
        <p className="text-xs text-gray-500">{(filePreview.size / 1024).toFixed(1)} KB</p>
      </div>
      <button
        onClick={() => {
          onSendFile(filePreview);
          setFilePreview(null);
        }}
        className="p-1 bg-purple-500 text-white rounded-full hover:bg-purple-600"
        title="Gönder"
      >
        <PaperAirplaneIcon className="w-4 h-4" />
      </button>
    </div>
    <button 
      onClick={() => setFilePreview(null)}
      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
    >
      <XMarkIcon className="w-3 h-3" />
    </button>
  </div>
)}
</div>
  )
}