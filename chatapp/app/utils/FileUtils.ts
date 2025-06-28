const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt'];
const maxFileSizeMB = 10;
export const isValidFileType = (file: File): string |null => {
const extension=file.name.split(".").pop()?.toLowerCase() || "";
  if (!extension || !allowedExtensions.includes(extension)) {
    return 'Desteklenmeyen dosya türü. PDF, Word, Excel ya da TXT yükleyin.';
  }

  if (file.size > maxFileSizeMB * 1024 * 1024) {
    return `Dosya boyutu ${maxFileSizeMB}MB'dan büyük olamaz.`;
  }

  return null;

};